import {test,expect} from '@playwright/test';

test.describe('Grand Avenue PRO gallery and configurator UX',()=>{
 for(const width of [1440,390]){
  test('gallery works with keyboard and restores focus at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/vehicles/grand-avenue-pro');
   const open=page.locator('.pro-premium-gallery-tile').first();
   await open.scrollIntoViewIfNeeded();
   await open.click();
   const dialog=page.getByRole('dialog',{name:'Grand Avenue PRO ფოტოების დათვალიერება'});
   await expect(dialog).toBeVisible();
   await expect(dialog.locator('.pro-premium-gallery-nav span')).toContainText('01 / 04');
   await page.keyboard.press('ArrowRight');
   await expect(dialog.locator('.pro-premium-gallery-nav span')).toContainText('02 / 04');
   await page.keyboard.press('Escape');
   await expect(dialog).toHaveCount(0);
   await expect(open).toBeFocused();
  });
 }
 test('gallery strip controls respect reduced motion',async({page})=>{
  await page.setViewportSize({width:390,height:850});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/vehicles/grand-avenue-pro');
  const strip=page.locator('.pro-draft-gallery-grid');
  await strip.scrollIntoViewIfNeeded();
  await page.getByRole('button',{name:'გალერეა მარჯვნივ'}).click();
  await expect.poll(()=>strip.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 });
});
