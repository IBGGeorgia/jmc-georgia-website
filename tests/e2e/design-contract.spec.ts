import {test,expect} from '@playwright/test';

test.describe('JMC approved UI v2 design contracts',()=>{
 for(const width of [1440,768,390,320]){
  test('navigation and CTA geometry at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const primary=page.locator('main a.button').first();
   await expect(primary).toHaveCSS('border-radius','999px');
   expect(await primary.evaluate(e=>e.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
   await page.locator('.jmc-menu-trigger').click();
   const dialog=page.getByRole('dialog',{name:'JMC Georgia — მენიუ'});
   await expect(dialog).toBeVisible();
   await expect(dialog.locator('nav a')).toHaveCount(7);
   expect(await dialog.evaluate(e=>e.scrollWidth)).toBeLessThanOrEqual(width+2);
   const icons=dialog.locator('.jmc-icon');
   expect(await icons.count()).toBeGreaterThan(0);
   await expect(icons.first()).toHaveCSS('stroke-width','1.75px');
   await page.keyboard.press('Escape');
   await expect(dialog).toBeHidden();
  });
 }
 for(const width of [1440,390]){
  test('PRO gallery focus and keyboard lifecycle at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/vehicles/grand-avenue-pro',{waitUntil:'domcontentloaded'});
   const tile=page.locator('.pro-premium-gallery-tile').first();
   await tile.click();
   const lightbox=page.getByRole('dialog',{name:'Grand Avenue PRO ფოტოების დათვალიერება'});
   await expect(lightbox).toBeVisible();
   await expect(lightbox.getByRole('button',{name:'დახურვა'})).toBeFocused();
   await lightbox.getByRole('button',{name:'შემდეგი ფოტო'}).click();
   await expect(lightbox.locator('.pro-premium-gallery-nav span')).toContainText('02');
   await page.keyboard.press('Escape');
   await expect(lightbox).toBeHidden();
   await expect(tile).toBeFocused();
  });
 }
});
