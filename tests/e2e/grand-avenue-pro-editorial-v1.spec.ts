import {test,expect} from '@playwright/test';

test.describe('Grand Avenue PRO editorial v1',()=>{
 for(const width of [1440,1024,768,390,320]){
  test('model identity, four-version wording and responsive framing '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/vehicles/grand-avenue-pro',{waitUntil:'domcontentloaded'});
   await expect(page.locator('.pro-premium-hero-content h1')).toHaveText('Grand Avenue PRO');
   await expect(page.locator('.pro-premium-intro-copy')).toContainText('LX და SLX');
   await expect(page.locator('.pro-draft-metrics')).toContainText('255 მმ');
   await expect(page.locator('#pro-choose')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
