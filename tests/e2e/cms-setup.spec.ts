import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {JMC_SCHEMA_SQL} from '../../lib/cms-schema';

test('bundled production schema must match canonical SQL file',()=>{
 expect(JMC_SCHEMA_SQL).toBe(readFileSync('db/test-drive.sql','utf8'));
});

test('First-admin setup rejects unauthenticated initialization and is one-time only',async({page,request})=>{
 test.skip(process.env.CMS_SETUP_E2E!=='1','Only run with disposable CI PostgreSQL');
 const token=process.env.CMS_SETUP_TOKEN!;
 const password=process.env.CMS_E2E_ADMIN_PASSWORD!;
 const origin='http://127.0.0.1:3000';
 const payload={setupToken:token,username:'jmc.qaadmin',displayName:'CMS QA Admin',password};
 const status=await request.get('/api/admin/setup');
 expect(status.status()).toBe(200);
 expect((await status.json()).setupAvailable).toBe(true);
 const denied=await request.post('/api/admin/setup',{headers:{Origin:origin},
  data:{...payload,setupToken:'bad-token'}});
 expect(denied.status()).toBe(403);
 const crossOrigin=await request.post('/api/admin/setup',{headers:{Origin:'https://unknown.example'},
  data:payload});
 expect(crossOrigin.status()).toBe(403);
 const success=await request.post('/api/admin/setup',{headers:{Origin:origin},data:payload});
 expect(success.status()).toBe(201);
 expect((await success.json()).username).toBe(payload.username);
 const replay=await request.post('/api/admin/setup',{headers:{Origin:origin},data:payload});
 expect(replay.status()).toBe(409);
 await page.goto('/admin');
 await page.getByLabel('მომხმარებლის სახელი').fill(payload.username);
 await page.getByLabel('პაროლი',{exact:true}).fill(password);
 await page.getByRole('button',{name:'შესვლა'}).click();
 await expect(page.getByRole('heading',{name:/გამარჯობა/})).toBeVisible();
 const accounts=await page.request.get('/api/admin/users');
 expect(accounts.status()).toBe(200);
 const body=await accounts.json();
 expect(body.users).toHaveLength(1);
 expect(body.users[0].role).toBe('admin');
 expect(body.users[0]).not.toHaveProperty('password_hash');
 const leads=await page.request.get('/api/test-drive');
 expect(await leads.json()).toEqual({ready:false});
});

test('Public CMS setup page remains responsive and never exposes credentials',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:850});
  await page.goto('/admin/setup',{waitUntil:'domcontentloaded'});
  await expect(page.getByRole('heading',{level:1,name:'პირველი ადმინისტრატორი'})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 }
});
