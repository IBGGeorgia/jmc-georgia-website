import {test,expect} from '@playwright/test';

test.describe('Homepage 3.0 canonical Design Bible',()=>{
 for(const width of [1920,1440,768,390,320]){
  test('shared grid, hero height, neutral CTA and no overflow at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const hero=page.locator('.home3-hero');
   await expect(hero).toHaveCSS('height',width<=700?'650px':'748px');
   const rect=await page.locator('.home3-hero-copy.home3-shell').boundingBox();
   expect(rect).not.toBeNull();
   const gutter=width<=700?16:24;
   expect(rect!.width).toBeCloseTo(Math.min(1680,width-2*gutter),0);
   const primary=page.locator('.home3-hero .home3-pill-red');
   await expect(primary).toHaveCSS('background-color','rgb(255, 255, 255)');
   await expect(primary).toHaveCSS('border-radius','999px');
   const secondary=page.locator('.home3-conversion .home3-pill-outline');
   await expect(secondary).toBeAttached();
   const scroll=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(scroll).toBeLessThanOrEqual(2);
  });
 }
});
