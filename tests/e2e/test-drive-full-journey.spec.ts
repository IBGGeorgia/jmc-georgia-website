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
  await page.goto('/test-drive?model=grand-avenue-pro&utm_source=meta&utm_medium=paid_social&utm_campaign=qa');
  await expect(page.locator('.jmc-lead-model input[value="grand-avenue-pro"]')).toBeChecked();
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
  await expect(page.getByRole('heading',{level:1,name:/შეიგრძენი JMC/})).toBeVisible();
  await expect(page.locator('.jmc-td-hero-visual img')).toHaveCount(1);
  await expect(page.locator('.jmc-lead-model-photo img')).toHaveCount(3);
  await expect(page.locator('.jmc-td-process article')).toHaveCount(3);
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
