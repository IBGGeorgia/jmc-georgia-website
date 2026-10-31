import {test,expect} from '@playwright/test';

test.describe('Homepage 4.2 editorial copy and typography',()=>{
 for(const width of [1440,1024,768,390,320]){
  test('headings, model cards, mobile layout and CTAs at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   await expect(page.getByRole('heading',{level:1})).toHaveCount(1);
   await expect(page.getByRole('heading',{name:'JMC-ის მოდელები'})).toBeVisible();
   await expect(page.getByRole('heading',{name:'სამი მოდელი. სამი არჩევანი.'})).toBeVisible();
   await expect(page.getByRole('heading',{name:'დაათვალიერე დეტალურად.'})).toBeVisible();
   await expect(page.getByRole('heading',{name:'გამოსცადე შენი JMC.'})).toBeVisible();
   await expect(page.locator('.home3-scroll')).toHaveCount(0);
   const cards=page.locator('.home3-story-tile');
   await expect(cards).toHaveCount(3);
   for(const [i,name] of ['VIGUS','Grand Avenue','Grand Avenue PRO'].entries()){
    await expect(cards.nth(i).getByRole('heading',{name,exact:true})).toBeVisible();
    await expect(cards.nth(i).getByRole('link',{name:/მოდელის დეტალები/})).toHaveAttribute('href',/vehicles/);
   }
   const font=await page.locator('.home3-story-intro h2').evaluate(el=>({family:getComputedStyle(el).fontFamily,weight:getComputedStyle(el).fontWeight}));
   expect(font.family).toBeTruthy();
   expect(Number(font.weight)).toBeGreaterThanOrEqual(600);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
