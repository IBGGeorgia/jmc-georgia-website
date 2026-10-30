import {test,expect} from '@playwright/test';
test.describe('Homepage lineup 3.5 layout',()=>{
 for(const width of [1920,1440,768,390,320]){
  test('preserves approved content bounds and button geometry at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const tabs=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
   await tabs.getByRole('button',{name:'Grand Avenue PRO'}).click();
   await expect(page.locator('.home3-stage-copy h3')).toHaveText('Grand Avenue PRO');
   const image=page.locator('.home3-stage-image img');
   await expect(image).toBeVisible();
   await expect(image).toHaveCSS('object-fit','contain');
   const button=page.locator('.home3-stage-copy a.home3-pill').first();
   await expect(button).toHaveCSS('border-radius','999px');
   expect((await button.boundingBox())!.height).toBeGreaterThanOrEqual(44);
   const metrics=await page.evaluate(()=>({overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth}));
   expect(metrics.overflow).toBeLessThanOrEqual(2);
  });
 }
});
