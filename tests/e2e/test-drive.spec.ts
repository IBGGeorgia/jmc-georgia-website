import {test,expect} from '@playwright/test';

test.describe('Test Drive staging safety contract',()=>{
 for(const width of [1440,768,390,320]){
  test('responsive model selector and consent, with real submission disabled @ '+width,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
   const flow=page.locator('#test-drive-request');
   await expect(flow).toBeVisible();
   const radios=flow.getByRole('radio');
   await expect(radios).toHaveCount(3);
   await expect(flow.locator('.jmc-lead-model-name')).toHaveText(['VIGUS','Grand Avenue','Grand Avenue PRO']);
   await expect(radios.first()).toBeChecked();
   await radios.nth(1).check();
   await expect(radios.nth(1)).toBeChecked();
   await expect(flow.getByRole('checkbox')).toHaveCount(2);
   await expect(flow.getByRole('button',{name:/გაგზავნე Test Drive მოთხოვნა/})).toBeDisabled();
   await expect(flow).toContainText('ონლაინ განაცხადები ჯერ არ მიიღება');
   expect(await page.evaluate(()=>document.documentElement.scrollWidth))
    .toBeLessThanOrEqual(width+2);
  });
 }
 test('Submission endpoint fails closed and never stores data without infrastructure',async({request})=>{
  const status=await request.get('/api/test-drive');
  expect(status.status()).toBe(200);
  expect(await status.json()).toEqual({ready:false});
  const response=await request.post('/api/test-drive',{data:{
   fullName:'Test Example',phone:'+995599123456',model:'vigus',
   consent:true,marketingOptIn:false
  }});
  expect(response.status()).toBe(503);
  expect((await response.json()).error).toBe('NOT_ACTIVE');
 });
 test('Manager and export do not expose PII without credentials',async({page,request})=>{
  await page.goto('/lead-manager',{waitUntil:'domcontentloaded'});
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole('heading',{name:'JMC Admin',level:1})).toBeVisible();
  await expect(page.getByText('მომხმარებლების დაცული ავტორიზაცია გააქტიურდება',{exact:false})).toBeVisible();
  const download=await request.get('/api/lead-manager/export');
  expect(download.status()).toBe(401);
  const patch=await request.patch('/api/lead-manager',{data:{id:'a',status:'new'}});
  expect(patch.status()).toBe(401);
 });
});

test('Customer journey puts model selector immediately after hero, before explanation',async({page})=>{
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:860});
  await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
  const sections=page.locator('main > section');
  const classes=await sections.evaluateAll(nodes=>nodes.map(node=>node.className));
  expect(classes.slice(0,4)).toEqual([
   'jmc-td-hero','jmc-lead-flow','jmc-td-process','jmc-td-visit'
  ]);
  await expect(page.getByRole('heading',{name:'რა ხდება მოთხოვნის გაგზავნის შემდეგ?'})).toBeVisible();
  const anchor=page.locator('.jmc-td-hero-primary');
  await anchor.click();
  await expect(page).toHaveURL(/#test-drive-request$/);
  await expect(page.locator('.jmc-lead-model')).toHaveCount(3);
  await expect(page.locator('.jmc-lead-submit button')).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(width+2);
 }
});

test('Privacy page publishes approved contact while intake remains closed',async({page})=>{
 await page.goto('/privacy',{waitUntil:'domcontentloaded'});
 await expect(page.locator('a[href="mailto:compliance@ibg.ge"]')).toHaveCount(1);
 await expect(page.getByRole('heading',{name:'პოლიტიკა მზადდება'})).toBeVisible();
});

test('Optional marketing consent shows clear, direct withdrawal channel',async({page})=>{
 await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.jmc-lead-consent a[href="mailto:compliance@ibg.ge"]')).toHaveCount(1);
 await expect(page.locator('.jmc-lead-consent input[type="checkbox"]').last()).not.toBeChecked();
});


test('Drive Studio V2 syncs main photography with selected models and view controls',async({page})=>{
 for(const width of [1440,768,390,320]){
  await page.setViewportSize({width,height:870});
  await page.goto('/test-drive?model=grand-avenue-pro',{waitUntil:'domcontentloaded'});
  const hero=page.locator('.jmc-drive-stage-image');
  await expect(hero).toHaveAttribute('data-selected-model','grand-avenue-pro');
  await expect(page.locator('.jmc-drive-selected-summary')).toContainText('Grand Avenue PRO');
  const angle=page.getByRole('group',{name:'ავტომობილის რაკურსები'});
  await expect(angle.getByRole('button')).toHaveCount(3);
  await angle.getByRole('button',{name:/რაკურსი 2/}).click();
  await expect(hero).toHaveAttribute('data-view','1');
  await page.locator('.jmc-lead-model input[value="vigus"]').check();
  await expect(hero).toHaveAttribute('data-selected-model','vigus');
  await expect(hero).toHaveAttribute('data-view','0');
  await expect(page.locator('.jmc-drive-selected-summary')).toContainText('VIGUS');
  await expect(page.locator('.jmc-lead-submit button')).toBeDisabled();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth))
   .toBeLessThanOrEqual(width+2);
 }
});

test('Drive Studio V2 preserves data minimization and explicit opt-ins',async({page})=>{
 await page.goto('/test-drive');
 await expect(page.locator('.jmc-lead-consent input[type="checkbox"]')).toHaveCount(2);
 await expect(page.locator('.jmc-lead-consent input[type="checkbox"]').last()).not.toBeChecked();
 await expect(page.locator('.jmc-drive-stage-image')).toHaveAttribute('data-selected-model','vigus');
 await expect(page.locator('.jmc-drive-view-controls button')).toHaveCount(3);
 await expect(page.locator('.jmc-lead-form')).toHaveAttribute('novalidate','');
});


test('Drive Studio V2.1 follows canonical pill/button and neutral selection tokens',async({page})=>{
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:850});
  await page.goto('/test-drive?model=vigus',{waitUntil:'domcontentloaded'});
  const theme=await page.evaluate(()=>{
   const primary=getComputedStyle(document.querySelector<HTMLElement>('.jmc-lead-submit .button')!);
   const hero=getComputedStyle(document.querySelector<HTMLElement>('.jmc-td-hero-primary')!);
   const angles=[...document.querySelectorAll<HTMLElement>('.jmc-drive-view')].map(el=>({
    height:el.getBoundingClientRect().height,radius:getComputedStyle(el).borderRadius
   }));
   return {primary:primary.backgroundColor,hero:hero.backgroundColor,
    primaryRadius:primary.borderRadius,heroRadius:hero.borderRadius,angles,
    decorativeAside:!!document.querySelector('.jmc-td-hero-aside')};
  });
  expect(theme.primary).toBe('rgb(29, 29, 31)');
  expect(theme.hero).toBe('rgb(255, 255, 255)');
  expect(theme.primaryRadius).toBe('999px');
  expect(theme.heroRadius).toBe('999px');
  expect(theme.angles.every(x=>x.height>=44&&x.radius==='999px')).toBe(true);
  expect(theme.decorativeAside).toBe(false);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth))
   .toBeLessThanOrEqual(width+2);
 }
});

test('New VIGUS angles are first-party and load without clipping',async({page})=>{
 await page.goto('/test-drive?model=vigus',{waitUntil:'domcontentloaded'});
 const image=page.locator('.jmc-drive-stage-image');
 const controls=page.getByRole('group',{name:'ავტომობილის რაკურსები'});
 for(const [index,part] of [[1,'drive-front-20261030.png'],[2,'drive-side-20261030.png']] as const){
  await controls.getByRole('button').nth(index).click();
  await expect(image).toHaveAttribute('src',new RegExp('/images/vigus/'+part.replace('.','\\.')));
  await expect.poll(async()=>image.evaluate((node:HTMLImageElement)=>node.complete&&node.naturalWidth>=1000)).toBe(true);
  await expect(image).toHaveCSS('object-fit','contain');
 }
});
