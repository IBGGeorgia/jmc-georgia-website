import {test,expect} from '@playwright/test';

test.describe('Test Drive pre-activation protections and UI',()=>{
 for(const width of [1440,768,390,320]){
  test('responsive Test Drive model selection and disabled submission @ '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   const res=await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
   expect(res?.status()).toBe(200);
   await expect(page.getByRole('heading',{level:1,name:/გამოსცადე JMC/})).toBeVisible();
   await expect(page.getByText('ონლაინ გაგზავნა მალე გახდება ხელმისაწვდომი.')).toBeVisible();
   await expect(page.locator('.jmc-lead-model')).toHaveCount(3);
   await expect(page.locator('.jmc-lead-submit .button')).toBeDisabled();
   await expect(page.locator('.jmc-lead-model img')).toHaveCount(3);
   const geometry=await page.evaluate(()=>({viewport:document.documentElement.clientWidth,
    width:document.documentElement.scrollWidth}));
   expect(geometry.width).toBeLessThanOrEqual(geometry.viewport+2);
  });
 }
 test('API fail-closes without the required data infrastructure',async({request})=>{
  const status=await request.get('/api/test-drive');
  expect(status.status()).toBe(200);
  expect(await status.json()).toEqual({ready:false});
  const response=await request.post('/api/test-drive',{
   data:{fullName:'Demo Test',phone:'+995555123456',model:'vigus',
    consent:true,marketingOptIn:false,preferredDate:''}
  });
  expect(response.status()).toBe(503);
 });
 test('Sales manager keeps private data unavailable without credentials',async({request,page})=>{
  const response=await request.get('/api/lead-manager/export');
  expect(response.status()).toBe(401);
  await page.goto('/lead-manager',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading',{level:1,name:'JMC Admin'})).toBeVisible();
  await expect(page.getByText('მომხმარებლების დაცული ავტორიზაცია გააქტიურდება')).toBeVisible();
 });
});

test('JMC CMS does not expose private lead pages to anonymous visitors',async({request,page})=>{
 const leads=await request.get('/admin/leads');
 expect([200,307,308]).toContain(leads.status());
 await page.goto('/admin/leads',{waitUntil:'domcontentloaded'});
 await expect(page).toHaveURL(/\/admin$/);
 const patch=await request.patch('/api/lead-manager',{data:{id:'00000000-0000-4000-8000-000000000000',status:'new',notes:''}});
 expect(patch.status()).toBe(401);
 const exportRequest=await request.get('/api/lead-manager/export');
 expect(exportRequest.status()).toBe(401);
});


test.describe('JMC Admin CMS shell: privacy and responsive layout',()=>{
 for(const width of [1440,768,390,320]){
  test('anonymous CMS entry at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/admin',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{level:1,name:'JMC Admin'})).toBeVisible();
   await expect(page.locator('.jmc-admin-sidebar')).toHaveCount(0);
   const geometry=await page.evaluate(()=>({
    viewport:document.documentElement.clientWidth,
    width:document.documentElement.scrollWidth
   }));
   expect(geometry.width).toBeLessThanOrEqual(geometry.viewport+2);
  });
 }
 test('CRM settings and leads redirect anonymous users to login',async({page,request})=>{
  await page.goto('/admin/settings',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/admin/leads',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveURL(/\/admin$/);
  const exported=await request.get('/api/lead-manager/export');
  expect(exported.status()).toBe(401);
 });
});
