import {test,expect} from '@playwright/test';

test.describe('Test Drive public availability and content',()=>{
 for(const width of [1440,768,390,320]){
  test('truthful availability, accessible selection, no horizontal overflow at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{name:'გამოსცადე JMC. შეარჩიე შენი მოდელი.'})).toBeVisible();
   const unavailable=await page.getByText('ონლაინ განაცხადები ჯერ არ მიიღება').isVisible();
   if(unavailable){
    await expect(page.getByRole('heading',{name:'რა ხდება მოთხოვნის გაგზავნის შემდეგ?'})).toHaveCount(0);
    await expect(page.locator('.jmc-lead-submit button[type="submit"]')).toBeDisabled();
    await expect(page.getByText('განაცხადების მიღება დროებით შეჩერებულია.')).toBeVisible();
   }else{
    await expect(page.getByRole('heading',{name:'რა ხდება მოთხოვნის გაგზავნის შემდეგ?'})).toBeVisible();
   }
   await expect(page.locator('.jmc-lead-models input[type="radio"]')).toHaveCount(3);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
