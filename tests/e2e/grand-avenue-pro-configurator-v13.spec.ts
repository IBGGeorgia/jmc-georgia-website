import {test,expect} from '@playwright/test';

test.describe('Grand Avenue PRO four-variant configurator',()=>{
 for(const width of [1440,390]){
  test('LX/SLX and diesel/gasoline follow documented brochure power at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/vehicles/grand-avenue-pro');
   const controls=page.locator('.pro-draft-axes');
   const summary=page.locator('.pro-draft-summary');
   await controls.getByRole('button',{name:'PRO LX'}).click();
   await controls.getByRole('button',{name:'დიზელი'}).click();
   await expect(summary).toContainText('PRO LX · დიზელი');
   await expect(summary).toContainText('177 hp');
   await controls.getByRole('button',{name:'ბენზინი'}).click();
   await expect(summary).toContainText('258 hp');
   await controls.getByRole('button',{name:'PRO SLX'}).click();
   await expect(summary).toContainText('PRO SLX · ბენზინი');
   await expect(summary).toContainText('258 hp');
   await controls.getByRole('button',{name:'დიზელი'}).click();
   await expect(summary).toContainText('PRO SLX · დიზელი');
   await expect(summary).toContainText('177 hp');
   await expect(summary).toContainText('255 mm');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
  test('comparison presets, filtering and zero selected do not crash at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/vehicles/grand-avenue-pro');
   await page.getByRole('button',{name:'დიზელი / ბენზინი'}).click();
   await expect(page.locator('.pro-draft-compare-scroll')).toContainText('258 hp');
   await page.getByRole('button',{name:'აღჭურვილობა',exact:true}).last().click();
   await expect(page.locator('.pro-draft-configurator')).toContainText('აღჭურვილობა · PRO');
   const boxes=page.locator('.pro-draft-compare-options input[type="checkbox"]');
   for(let i=0;i<4;i++){if(await boxes.nth(i).isChecked())await boxes.nth(i).uncheck()}
   await expect(page.getByText('აირჩიე ერთი კომპლექტაცია მაინც.')).toBeVisible();
  });
 }
});
