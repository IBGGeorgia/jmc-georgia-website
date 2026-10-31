import {test,expect} from '@playwright/test';

test.describe('Test Drive HIG calendar',()=>{
 for(const width of [1440,390,320]){
  test('calendar trigger respects closed intake and viewport '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/test-drive');
   const calendar=page.locator('.jmc-calendar');
   await expect(calendar).toHaveCount(1);
   await expect(calendar.locator('.jmc-calendar-trigger')).toBeDisabled();
   await expect(page.locator('.jmc-calendar-popover')).toHaveCount(0);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
 test('calendar selection, arrows and Escape in isolated active state',async({page})=>{
  test.skip(process.env.TEST_DRIVE_E2E!=='1','Requires disposable CI intake.');
  await page.goto('/test-drive');
  const trigger=page.locator('.jmc-calendar-trigger');
  await trigger.click();
  await expect(page.getByRole('dialog',{name:'სასურველი დღის არჩევა'})).toBeVisible();
  await page.getByRole('button',{name:'შემდეგი თვე'}).click();
  const date=page.locator('.jmc-calendar-grid button:not([disabled])').filter({hasText:/^15$/}).first();
  await date.click();
  await expect(page.getByRole('dialog',{name:'სასურველი დღის არჩევა'})).toHaveCount(0);
  await trigger.click();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
 });
});
