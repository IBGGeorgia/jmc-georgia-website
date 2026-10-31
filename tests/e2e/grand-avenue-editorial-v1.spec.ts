import {test,expect} from '@playwright/test';

test.describe('Grand Avenue - editorial and brochure-data contract',()=>{
 for(const width of [1440,1024,768,390,320]){
  test('canonical title, correct brochure specs and no overflow at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{level:1,name:'Grand Avenue',exact:true})).toBeVisible();
   const facts=page.locator('.vigus-quick-specs');
   await expect(facts).toContainText('211 ც.ძ.');
   await expect(facts).toContainText('235 მმ');
   await expect(page.locator('.vigus-capabilities-grid')).toContainText('80 ლ');
   await expect(page.locator('.vigus-capabilities-grid')).toContainText('3270 მმ');
   await expect(page.locator('.vigus-selector-details')).toContainText('4X4 AT GL');
   const gallery=page.locator('.grand-gallery-open img').first();
   await gallery.scrollIntoViewIfNeeded();
   await expect(gallery).toHaveCSS('object-fit','contain');
   await expect(gallery).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
