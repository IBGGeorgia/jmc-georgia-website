import {test,expect} from '@playwright/test';
test.describe('Homepage media and motion smoke checks',()=>{
 test('approved Hero is served first-party as immutable WebP',async({request})=>{
  const response=await request.get('/images/homepage/grand-avenue-pro-hero.webp');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/webp');
  const body=await response.body();
  expect(body.length).toBeGreaterThan(10000);
  expect(body.length).toBeLessThan(1300000);
  expect(body.toString('ascii',0,4)).toBe('RIFF');
  expect(body.toString('ascii',8,12)).toBe('WEBP');
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
