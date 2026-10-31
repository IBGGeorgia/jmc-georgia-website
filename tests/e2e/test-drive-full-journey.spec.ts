import {test,expect} from '@playwright/test';
import pg from 'pg';

/** This test runs ONLY against disposable CI Postgres, never Production.
 * CI intentionally opens privacy gates for synthetic records only. */
test('Complete Test Drive journey: selected model -> validated form -> database -> analytics',async({page,request})=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Requires disposable CI PostgreSQL.');
 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL!});
 try{
  const ready=await request.get('/api/test-drive');
  expect(await ready.json()).toEqual({ready:true});
  await page.addInitScript(()=>{(window as Window&{dataLayer?:unknown[]}).dataLayer=[]});
  await page.goto('/privacy');
  await expect(page.getByRole('heading',{name:/თქვენი მონაცემების დამუშავების პირობები/})).toBeVisible();
  await expect(page.locator('.jmc-privacy-approved')).toContainText('შპს „იბერია ბიზნეს ჯგუფი“');
  await expect(page.locator('.jmc-privacy-approved')).toContainText('204975376');
  await expect(page.locator('.jmc-privacy-approved')).toContainText('2026-10-30');
  await expect(page.getByRole('heading',{name:'პოლიტიკა მზადდება'})).toHaveCount(0);
  await page.goto('/test-drive?model=grand-avenue-pro&utm_source=meta&utm_medium=paid_social&utm_campaign=qa');
  await expect(page.locator('.jmc-lead-model input[value="grand-avenue-pro"]')).toBeChecked();
  // URL-selected model must drive the main vehicle image and the form summary.
  await expect(page.locator('.jmc-drive-stage-image')).toHaveAttribute('data-selected-model','grand-avenue-pro');
  await expect(page.locator('.jmc-drive-selected-summary')).toContainText('Grand Avenue PRO');
  const views=page.getByRole('group',{name:'ავტომობილის რაკურსები'});
  await expect(views.getByRole('button')).toHaveCount(3);
  await views.getByRole('button',{name:/რაკურსი 2/}).click();
  await expect(page.locator('.jmc-drive-stage-image')).toHaveAttribute('data-view','1');
  await views.getByRole('button',{name:/Studio/}).click();
  await expect(page.locator('.jmc-drive-stage-image')).toHaveAttribute('data-view','0');

  await expect(page.locator('.jmc-lead-model')).toHaveCount(3);
  await expect(page.locator('.jmc-td-process article')).toHaveCount(3);
  await expect(page.locator('.jmc-lead-submit button')).toBeEnabled();
  await page.locator('input[autocomplete="name"]').fill('QA Customer');
  const phone=page.locator('input[autocomplete="tel"]');
  await phone.fill('123');
  await phone.blur();
  await expect(page.locator('#jmc-lead-phone-help')).toContainText('ქართული მობილური');
  await phone.fill('599 12 34 56');
  await phone.blur();
  await expect(phone).toHaveAttribute('aria-invalid','false');
  await page.locator('.jmc-lead-consent input[type="checkbox"]').first().check();
  await page.locator('.jmc-lead-submit button').click();
  await expect(page.getByRole('heading',{name:'შენი მოთხოვნა მიღებულია'})).toBeVisible();
  await expect(page.locator('.jmc-lead-success')).toContainText('Grand Avenue PRO');
  await expect(page.locator('.jmc-drive-success-photo img')).toHaveAttribute('alt',/Grand Avenue PRO/);
  const events=await page.evaluate(()=>{
   const w=window as Window&{dataLayer?:Record<string,unknown>[]};
   return w.dataLayer?.filter(x=>x.event==='generate_lead')||[];
  });
  expect(events).toHaveLength(1);
  expect(events[0]).toEqual({event:'generate_lead',lead_type:'test_drive',model_slug:'grand-avenue-pro'});
  expect(JSON.stringify(events)).not.toContain('599123456');
  const row=await pool.query(`SELECT full_name,phone,model_slug,source,medium,campaign,consent_version,
    consented_at,marketing_opt_in,status FROM jmc_test_drive_leads WHERE full_name=$1`,['QA Customer']);
  expect(row.rows).toHaveLength(1);
  expect(row.rows[0]).toMatchObject({
   full_name:'QA Customer',phone:'+995599123456',model_slug:'grand-avenue-pro',
   source:'meta',medium:'paid_social',campaign:'qa',consent_version:'ci-test-only',
   marketing_opt_in:false,status:'new'
  });
  expect(row.rows[0].consented_at).toBeTruthy();
  await page.getByRole('button',{name:/ახალი მოთხოვნის გაგზავნა/}).click();
  await expect(page.locator('.jmc-lead-model')).toHaveCount(3);
  await expect(page.locator('input[autocomplete="name"]')).toHaveValue('');
 }finally{await pool.end()}
});

test('Backend rejects invalid consent, CSRF, malformed phone and illegal model',async({request})=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Requires disposable CI PostgreSQL.');
 const valid={model:'vigus',fullName:'QA Valid',phone:'+995599123457',consent:true,
  marketingOptIn:false,preferredDate:'',honeypot:'',utmSource:''};
 const origin='http://127.0.0.1:3000';
 const invalid=await request.post('/api/test-drive',{headers:{Origin:origin},
  data:{...valid,consent:false}});
 expect(invalid.status()).toBe(400);
 const badPhone=await request.post('/api/test-drive',{headers:{Origin:origin},
  data:{...valid,phone:'+995123'}});
 expect(badPhone.status()).toBe(400);
 const badModel=await request.post('/api/test-drive',{headers:{Origin:origin},
  data:{...valid,model:'unapproved-model'}});
 expect(badModel.status()).toBe(400);
 const csrf=await request.post('/api/test-drive',{headers:{Origin:'https://different.example'},
  data:valid});
 expect(csrf.status()).toBe(403);
});

test('Test Drive is readable and does not overflow at four viewport widths',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:860});
  await page.goto('/test-drive?model=grand-avenue',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('heading',{level:1,name:/გამოსცადე JMC/})).toBeVisible();
  await expect(page.locator('.jmc-drive-stage-image')).toHaveCount(1);
  await expect(page.locator('.jmc-drive-stage-image')).toHaveAttribute('data-selected-model','grand-avenue');
  await expect(page.locator('.jmc-lead-model-photo img')).toHaveCount(3);
  await expect(page.locator('.jmc-td-process article')).toHaveCount(process.env.TEST_DRIVE_E2E==='1'?3:0);
  await expect(page.locator('#test-drive-request')).toBeAttached();
  const values=await page.evaluate(()=>({
   viewport:document.documentElement.clientWidth,
   scroll:document.documentElement.scrollWidth,
   hero:document.querySelector('.jmc-td-hero')?.getBoundingClientRect().width,
   button:document.querySelector('.jmc-td-hero-primary')?.getBoundingClientRect().width
  }));
  expect(values.scroll).toBeLessThanOrEqual(values.viewport+2);
  expect(values.hero).toBeGreaterThan(150);
  expect(values.button).toBeGreaterThan(100);
 }
});

test('Retention heartbeat is mandatory: stale cleanup disables form and POST',async({request})=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Disposable CI database only.');
 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL!});
 try{
  await pool.query("UPDATE jmc_lead_retention_health SET last_success_at=now()-interval '48 hours' WHERE singleton=true");
  const status=await request.get('/api/test-drive');
  expect(await status.json()).toEqual({ready:false});
  const attempt=await request.post('/api/test-drive',{headers:{Origin:'http://127.0.0.1:3000'},
   data:{model:'vigus',fullName:'Synthetic QA',phone:'+995599123456',consent:true,
    marketingOptIn:false,preferredDate:'',honeypot:''}});
  expect(attempt.status()).toBe(503);
  expect((await attempt.json()).error).toBe('NOT_ACTIVE');
 }finally{
  await pool.query("UPDATE jmc_lead_retention_health SET last_success_at=now() WHERE singleton=true");
  await pool.end();
 }
});


// The token exists only in disposable CI and Render's private service settings.
test('Cron bridge authenticates and checks schema without exposing customer data',async({request})=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Disposable CI database only');
 const path='/api/internal/retention';
 const noToken=await request.post(path,{data:{mode:'status'}});
 expect(noToken.status()).toBe(401);
 const invalid=await request.post(path,{headers:{authorization:'Bearer invalid'},
  data:{mode:'status'}});
 expect(invalid.status()).toBe(401);
 const auth={authorization:'Bearer '+process.env.JMC_RETENTION_BRIDGE_TOKEN};
 const status=await request.post(path,{headers:auth,data:{mode:'status'}});
 expect(status.status()).toBe(200);
 const info=await status.json() as Record<string,unknown>;
 expect(info.schemaReady).toBe(true);
 expect(info.fresh).toBe(true);
 expect(info).not.toHaveProperty('leads');
 expect(JSON.stringify(info)).not.toMatch(/phone|full_name|ip_fingerprint/);
 const bad=await request.post(path,{headers:auth,data:{mode:'unexpected'}});
 expect(bad.status()).toBe(400);
});

test('Authenticated cron bridge removes only expired synthetic leads, preserving legal holds',async({request})=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Disposable CI database only');
 const {randomUUID}=await import('node:crypto');
 const pool=new pg.Pool({connectionString:process.env.DATABASE_URL!});
 const expired=randomUUID(),held=randomUUID();
 try{
  for(const [id,isHeld] of [[expired,false],[held,true]] as const){
   await pool.query(`INSERT INTO jmc_test_drive_leads
    (id,full_name,phone,model_slug,consent_version,ip_fingerprint,
     created_at,updated_at,retention_hold_until)
    VALUES ($1,'Synthetic Retention QA','+995599000002','vigus','qa-only',
     repeat('c',64),now()-interval '14 months',now()-interval '14 months',
     CASE WHEN $2::boolean THEN now()+interval '30 days' ELSE NULL END)`,
    [id,isHeld]);
  }
  const headers={authorization:'Bearer '+process.env.JMC_RETENTION_BRIDGE_TOKEN};
  const execute=await request.post('/api/internal/retention',{
   headers,data:{mode:'execute'}});
  expect(execute.status()).toBe(200);
  const data=await execute.json() as {ok:boolean;deleted:number};
  expect(data.ok).toBe(true);
  expect(data.deleted).toBeGreaterThanOrEqual(1);
  const rows=await pool.query('SELECT id FROM jmc_test_drive_leads WHERE id=ANY($1::uuid[])',
   [[expired,held]]);
  expect(rows.rows.map(x=>x.id)).toEqual([held]);
  const stamp=await pool.query('SELECT last_success_at FROM jmc_lead_retention_health');
  expect(stamp.rows[0]?.last_success_at).toBeTruthy();
 }finally{
  await pool.query('DELETE FROM jmc_test_drive_leads WHERE id=ANY($1::uuid[])',
   [[expired,held]]).catch(()=>{});
  await pool.end();
 }
});

test('Paid cron runner reaches the protected endpoint without PostgreSQL credentials',async()=>{
 test.skip(process.env.TEST_DRIVE_E2E!=='1','Disposable CI database only');
 const {execFile}=await import('node:child_process');
 const {promisify}=await import('node:util');
 const exec=promisify(execFile);
 const env={...process.env,JMC_RETENTION_EXECUTION_ENABLED:'false',
  JMC_RETENTION_BRIDGE_URL:'http://127.0.0.1:3000/api/internal/retention'};
 delete env.DATABASE_URL;
 const result=await exec(process.execPath,['scripts/render-retention-cron.mjs'],
  {env,timeout:20000});
 expect(result.stdout).toContain('JMC_RETENTION_BRIDGE_CONNECTED');
 expect(result.stdout).toContain('cleanup disabled');
});
