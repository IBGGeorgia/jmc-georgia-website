import {test,expect} from '@playwright/test';
test.describe('Homepage 3.4 photo explorer',()=>{
 for(const width of [1440,390,320]){
  test('model tabs and angle thumbnails at '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const group=page.getByRole('group',{name:'გალერეის მოდელი'});
   await group.getByRole('button',{name:'Grand Avenue',exact:true}).click();
   const angle=page.getByRole('group',{name:'აირჩიე ფოტოს რაკურსი'});
   expect(await angle.getByRole('button').count()).toBeGreaterThan(1);
   await angle.getByRole('button').nth(1).click();
   await expect(angle.getByRole('button').nth(1)).toHaveAttribute('aria-pressed','true');
   await page.getByRole('button',{name:'შემდეგი ფოტო'}).focus();
   await page.keyboard.press('ArrowRight');
   await expect(angle.getByRole('button').nth(2)).toHaveAttribute('aria-pressed','true');
   const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
   expect(overflow).toBeLessThanOrEqual(2);
  });
 }
});
