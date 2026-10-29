import {test,expect} from '@playwright/test';
test('compare two models, switch trims, add third, and filter differences',async({page})=>{
 await page.goto('/compare');
 await expect(page.getByRole('heading',{name:/სამი მოდელი/})).toBeVisible();
 await expect(page.getByRole('heading',{name:'რით იწყება სწორი არჩევანი?'})).toBeVisible();
 await expect(page.locator('.jmc-compare-story')).toHaveCount(3);
 await expect(page.getByRole('heading',{name:'ახლა შეადარე დეტალები'})).toBeVisible();
 await expect(page.locator('.jmc-compare-slot')).toHaveCount(2);
 await expect(page.locator('.jmc-compare-table tbody tr').first()).toBeVisible();
 await page.locator('#compare-model-1').selectOption('grand-avenue-pro');
 await expect(page.locator('.jmc-compare-slot').nth(1)).toContainText('Grand Avenue PRO');
 await expect(page.locator('#compare-trim-1 option')).toHaveCount(4);
 await page.getByRole('button',{name:'მესამე მოდელის დამატება'}).click();
 await expect(page.locator('.jmc-compare-slot')).toHaveCount(3);
 await page.getByLabel('მხოლოდ განსხვავებები').check();
 await expect(page.locator('.jmc-compare-insight')).toContainText('განსხვავებული პარამეტრია');
 await expect(page.locator('.jmc-compare-table tbody tr').first()).toBeVisible();
 await page.getByRole('button',{name:'მესამე მოდელის ამოღება'}).click();
 await expect(page.locator('.jmc-compare-slot')).toHaveCount(2);
});
test('lead generation remains under construction without intake form',async({page})=>{
 await page.goto('/test-drive');
 await expect(page.getByText(/Under Construction/)).toBeVisible();
 await expect(page.locator('main form')).toHaveCount(0);
});
