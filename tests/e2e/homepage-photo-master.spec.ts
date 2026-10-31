import {test,expect} from '@playwright/test';
test.describe('Homepage photo sizing master',()=>{
 test('every mastered media has expected physical dimensions and format',async({request})=>{
  const report=await request.get('/images/homepage/audit.json');
  expect(report.status()).toBe(200);
  const data=await report.json();
  expect(data.mode).toBe('immutable-local');
  for(const item of data.images.filter((x:{role:string})=>x.role==='model-lineup')){
   expect(item.width).toBe(1600);expect(item.height).toBe(1200);
   expect(item.format).toBe('webp');expect(item.bytes).toBeGreaterThan(10000);
   expect(item.bytes).toBeLessThan(800000);
  }
  const hero=data.images.find((x:{role:string})=>x.role==='hero');
  expect(hero.width).toBe(1920);expect(hero.height).toBe(1080);
  expect(hero.width).toBeLessThanOrEqual(hero.originalWidth);
  expect(hero.format).toBe('webp');
  expect(hero.bytes).toBeLessThan(1300000);
 });
 for(const width of [1920,1440,768,390,320]){
  test('model photograph framing and layout at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const group=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
   for(const name of ['VIGUS','Grand Avenue','Grand Avenue PRO']){
    await group.getByRole('button',{name,exact:true}).click();
    const image=page.locator('.home3-stage-image img');
    await expect(image).toBeVisible();
    await expect(image).toHaveCSS('object-fit','contain');
    await expect.poll(async()=>image.evaluate((el:HTMLImageElement)=>[el.naturalWidth,el.naturalHeight])).toEqual([1600,1200]);
    const ratio=await page.locator('.home3-stage-image').evaluate(el=>el.getBoundingClientRect().width/el.getBoundingClientRect().height);
    if(width<=900){expect(ratio).toBeGreaterThan(1.28);expect(ratio).toBeLessThan(1.39);}
    else {const height=await page.locator('.home3-stage-image').evaluate(el=>el.getBoundingClientRect().height);expect(height).toBeLessThanOrEqual(601);expect(height).toBeGreaterThanOrEqual(519);}
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
