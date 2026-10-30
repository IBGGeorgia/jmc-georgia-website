import {test,expect} from '@playwright/test';
import pg from 'pg';

test('CMS Lead Inbox v2: access controls, 25-row pages, server filters and audited updates',async({page,request})=>{
 test.skip(process.env.CMS_LEAD_E2E!=='1','Requires disposable CI PostgreSQL.');
 const anonymous=await request.get('/api/lead-manager');
 expect(anonymous.status()).toBe(401);
 await page.goto('/admin');
 await page.getByLabel('მომხმარებლის სახელი').fill(process.env.CMS_BOOTSTRAP_USERNAME!);
 await page.getByLabel('პაროლი',{exact:true}).fill(process.env.CMS_BOOTSTRAP_PASSWORD!);
 await page.getByRole('button',{name:'შესვლა'}).click();
 await expect(page.getByRole('heading',{name:/გამარჯობა/})).toBeVisible();
 await page.goto('/admin/settings');
 await expect(page.getByRole('heading',{name:'სისტემის მდგომარეობა'})).toBeVisible();
 await expect(page.getByRole('heading',{name:'მონაცემთა ბაზის მიგრაცია'})).toBeVisible();
 await expect(page.getByText('სქემა განახლებულია')).toBeVisible();
 await expect(page.getByRole('heading',{name:'12-თვიანი შენახვა'})).toBeVisible();
 await page.goto('/admin/leads');
 await expect(page.getByRole('heading',{level:1,name:'Test Drive ლიდები'})).toBeVisible();
 await expect(page.locator('.jmc-lead-inbox-v2 tbody tr')).toHaveCount(25);

 const first=await page.request.get('/api/lead-manager');
 expect(first.status()).toBe(200);
 expect(first.headers()['cache-control']).toContain('no-store');
 const d=await first.json();
 expect(d.total).toBe(32);
 expect(d.page).toBe(1);expect(d.limit).toBe(25);
 expect(d.leads).toHaveLength(25);
 expect(d.stats.total).toBe(32);
 expect(d.stats.new).toBe(16);
 expect(d.leads[0]).not.toHaveProperty('ip_fingerprint');

 const second=await page.request.get('/api/lead-manager?page=2');
 expect((await second.json()).leads).toHaveLength(7);
 const newOnly=await page.request.get('/api/lead-manager?status=new');
 const filtered=await newOnly.json();
 expect(filtered.total).toBe(16);
 expect(filtered.leads.every((x:{status:string})=>x.status==='new')).toBe(true);
 const specific=await page.request.get('/api/lead-manager?q=QA%20Lead%203');
 expect((await specific.json()).total).toBe(4);
 const wildcard=await page.request.get('/api/lead-manager?q=%25');
 expect((await wildcard.json()).total).toBe(0);
 const bad=await page.request.get('/api/lead-manager?page=-1');
 expect(bad.status()).toBe(400);

 const id=d.leads[0].id;
 const origin='http://127.0.0.1:3000';
 const edit=await page.request.patch('/api/lead-manager',{
  headers:{Origin:origin},
  data:{id,status:'completed',notes:'QA status sync'}
 });
 expect(edit.status()).toBe(200);
 expect((await edit.json()).updated).toBe(true);
 const after=await page.request.get('/api/lead-manager?q=QA%20Lead%2032');
 const changed=await after.json();
 expect(changed.total).toBeGreaterThanOrEqual(1);
 const record=(await page.request.get('/api/lead-manager')).json();
 expect((await record).leads.find((x:{id:string})=>x.id===id).status).toBe('completed');

 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
 try{
  const q=await pool.query('SELECT count(*)::int AS c FROM jmc_cms_audit_log WHERE action=$1 AND subject_id=$2',
   ['lead.updated',id]);
  expect(q.rows[0].c).toBe(1);
 }finally{await pool.end()}
});


test('Marketing opt-out: operator-only, CSRF protected, audited and idempotent',async({page,request})=>{
 test.skip(process.env.CMS_LEAD_E2E!=='1','Disposable PostgreSQL only');
 const path='/api/lead-manager/marketing-opt-out';
 const anonymous=await request.post(path,{data:{id:'00000000-0000-4000-8000-000000000000'}});
 expect(anonymous.status()).toBe(401);

 await page.goto('/admin');
 await page.getByLabel('მომხმარებლის სახელი').fill(process.env.CMS_BOOTSTRAP_USERNAME!);
 await page.getByLabel('პაროლი',{exact:true}).fill(process.env.CMS_BOOTSTRAP_PASSWORD!);
 await page.getByRole('button',{name:'შესვლა'}).click();
 await expect(page.getByRole('heading',{name:/გამარჯობა/})).toBeVisible();

 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL!});
 try{
  const found=await pool.query<{id:string}>(`
   SELECT id FROM jmc_test_drive_leads
   WHERE full_name='QA Lead 1' LIMIT 1`);
  expect(found.rows).toHaveLength(1);
  const id=found.rows[0].id;
  await pool.query(`UPDATE jmc_test_drive_leads SET
    marketing_opt_in=true,notes='Original QA note' WHERE id=$1`,[id]);

  const invalid=await page.request.post(path,{
   headers:{Origin:'http://127.0.0.1:3000'},
   data:{id:'bad-uuid'}});
  expect(invalid.status()).toBe(400);

  const csrf=await page.request.post(path,{
   headers:{Origin:'https://untrusted.example'},
   data:{id}});
  expect(csrf.status()).toBe(403);

  await page.goto('/admin/leads');
  const row=page.locator('.jmc-lead-inbox-v2 tbody tr').filter({hasText:'QA Lead 1'});
  await expect(row).toBeVisible();
  await expect(row.getByText('მარკეტინგი: თანხმობა გაცემულია')).toBeVisible();
  page.once('dialog',d=>d.accept());
  await row.getByRole('button',{name:/მარკეტინგული თანხმობის გაუქმება/}).click();
  await expect(page.getByText('მარკეტინგული თანხმობა გაუქმებულია და მოქმედება დაფიქსირებულია CMS-ის ისტორიაში.')).toBeVisible();
  await expect(row.getByText('მარკეტინგი: თანხმობა არ არის')).toBeVisible();
  await expect(row.getByRole('button',{name:/მარკეტინგული თანხმობის გაუქმება/})).toHaveCount(0);

  const updated=await pool.query(`SELECT status,notes,marketing_opt_in
   FROM jmc_test_drive_leads WHERE id=$1`,[id]);
  expect(updated.rows[0].marketing_opt_in).toBe(false);
  expect(updated.rows[0].notes).toBe('Original QA note');
  expect(['new','contacted']).toContain(updated.rows[0].status);

  const again=await page.request.post(path,{
   headers:{Origin:'http://127.0.0.1:3000'},
   data:{id}});
  expect(again.status()).toBe(200);
  expect(await again.json()).toMatchObject({ok:true,withdrawn:true,changed:false});
  const audit=await pool.query<{count:number}>(`SELECT COUNT(*)::int AS count
   FROM jmc_cms_audit_log WHERE action='lead.marketing_withdrawn'
    AND subject_id=$1`,[id]);
  expect(audit.rows[0].count).toBe(1);
 }finally{await pool.end()}
});
