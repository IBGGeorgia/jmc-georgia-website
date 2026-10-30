import {test,expect} from '@playwright/test';
test.describe('Homepage media and motion smoke checks',()=>{
 test('approved hero is served first-party and has PNG bytes',async({request})=>{
  const response=await request.get('/images/homepage/grand-avenue-pro-hero.png');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/png');
  const body=await response.body();
  expect(body.length).toBeGreaterThan(100000);
  expect([...body.subarray(0,8)]).toEqual([137,80,78,71,13,10,26,10]);
 });
 for(const width of [1440,390,320]){
  test('homepage media and reduced motion at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.emulateMedia({reducedMotion:'reduce'});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   await expect(page.locator('.home3-hero')).toBeVisible();
   await expect(page.locator('.home3-hero-copy h1')).toBeVisible();
   await expect(page.locator('.home3-hero-copy h1')).toHaveCSS('animation-name','none');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
