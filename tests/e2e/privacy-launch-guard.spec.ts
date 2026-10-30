import {test,expect} from '@playwright/test';

test('Public privacy holding page states verified legal controller but not approved policy',async({page})=>{
 await page.goto('/privacy');
 await expect(page.getByRole('heading',{level:1,name:'კონფიდენციალურობა'})).toBeVisible();
 await expect(page.getByText('compliance@ibg.ge')).toBeVisible();
 await expect(page.locator('.jmc-privacy-panel')).not.toContainText('Eastgate Automotive LLC');
 await expect(page.locator('.jmc-privacy-panel')).toContainText('შპს „იბერია ბიზნეს ჯგუფი“');
 await expect(page.locator('.jmc-privacy-panel')).toContainText('204975376');
 await expect(page.locator('.jmc-privacy-panel')).toContainText('პოლიტიკა მზადდება');
});

test('Public Test Drive form remains closed until approved legal and retention gates',async({page,request})=>{
 test.skip(process.env.TEST_DRIVE_E2E==='1','Full-journey disposable CI intentionally opens synthetic intake');
 const status=await request.get('/api/test-drive');
 expect(status.status()).toBe(200);
 expect(await status.json()).toEqual({ready:false});
 await page.goto('/test-drive');
 await expect(page.getByText('ონლაინ განაცხადები ჯერ არ მიიღება')).toBeVisible();
 await expect(page.getByRole('button',{name:'გაგზავნე Test Drive მოთხოვნა'})).toBeDisabled();
});
