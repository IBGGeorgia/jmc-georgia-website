import {test,expect} from '@playwright/test';
test.describe('About and Contact Frontend closure',()=>{
 for(const width of [1920,1440,768,390,320]){
  test('About exposes all three approved models at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/about');
   await expect(page.locator('.jmc-about-model-card')).toHaveCount(3);
   for(const slug of ['vigus','grand-avenue','grand-avenue-pro']){
    await expect(page.locator('.jmc-about-model-card[href="/vehicles/'+slug+'"]')).toBeVisible();
   }
   await expect(page.getByRole('link',{name:/შეადარე მოდელები/})).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
  test('Contact shows verified location and route actions at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/contact');
   await expect(page.locator('.jmc-contact-location-address')).toContainText('თბილისი, ბელიაშვილის 115');
   await expect(page.getByRole('link',{name:/რუკაზე ნახვა/})).toHaveAttribute('href',/google.com\/maps\/search/);
   await expect(page.getByRole('link',{name:/დაჯავშნე Test Drive/})).toHaveAttribute('href','/test-drive');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
