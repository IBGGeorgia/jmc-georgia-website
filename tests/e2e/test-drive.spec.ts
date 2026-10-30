import {test,expect} from '@playwright/test';

test.describe('Test Drive staging safety contract',()=>{
 for(const width of [1440,768,390,320]){
  test('responsive model selector and consent, with real submission disabled @ '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
   const flow=page.locator('#test-drive-request');
   await expect(flow).toBeVisible();
   const radios=flow.getByRole('radio');
   await expect(radios).toHaveCount(3);
   await expect(flow.locator('.jmc-lead-model-name')).toHaveText(['VIGUS','Grand Avenue','Grand Avenue PRO']);
   await expect(radios.first()).toBeChecked();
   await radios.nth(1).check();
   await expect(radios.nth(1)).toBeChecked();
   await expect(flow.getByRole('checkbox')).toHaveCount(2);
   await expect(flow.getByRole('button',{name:/გაგზავნე Test Drive მოთხოვნა/})).toBeDisabled();
   await expect(flow).toContainText('ონლაინ განაცხადები ჯერ არ მიიღება');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(width+2);
  });
 }
 test('Submission endpoint fails closed and never stores data without infrastructure',async({request})=>{
  const status=await request.get('/api/test-drive');
  expect(status.status()).toBe(200);
  expect(await status.json()).toEqual({ready:false});
  const response=await request.post('/api/test-drive',{data:{
   fullName:'Test Example',phone:'+995599123456',model:'vigus',
   consent:true,marketingOptIn:false
  }});
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toBe('NOT_ACTIVE');
 });
 test('Manager and export do not expose PII without credentials',async({page,request})=>{
  await page.goto('/lead-manager',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading',{name:'JMC Admin',level:1})).toBeVisible();
  await expect(page.getByText('მომხმარებლების დაცული ავტორიზაცია გააქტიურდება',{exact:false})).toBeVisible();
  const download=await request.get('/api/lead-manager/export');
  expect(download.status()).toBe(401);
  const patch=await request.patch('/api/lead-manager',{data:{id:'a',status:'new'}});
  expect(patch.status()).toBe(401);
 });
});
