import {test, expect} from '@playwright/test';
import {vehicles} from '../../lib/vehicles';
import {getProVariant,proSourceVariants,proDraftStatus} from '../../lib/grand-avenue-pro';
import {grandAvenueProOriginalMedia} from '../../lib/grand-avenue-pro-media';
import {grandAvenue,grandAvenueTechnical,grandAvenueEquipment,grandAvenueMedia,grandAvenueHighlights} from '../../lib/grand-avenue';

const routes=[
 {path:'/',label:'home'},
 {path:'/vehicles',label:'vehicles catalogue'},
 ...vehicles.map(({slug})=>({path:`/vehicles/${slug}`,label:slug})),
 {path:'/about',label:'about'},
 {path:'/contact',label:'contact'},
 {path:'/test-drive',label:'test-drive'},
 {path:'/privacy',label:'privacy'},
] as const;
const screens=[
 {name:'desktop',width:1440,height:900},
 {name:'laptop',width:1024,height:768},
 {name:'tablet',width:768,height:1024},
 {name:'mobile',width:430,height:932},
 {name:'compact',width:390,height:844},
 {name:'narrow',width:320,height:740},
] as const;

test.describe('all live routes — responsive integrity',()=>{
 for(const route of routes){
  for(const screen of screens){
   test(`${route.label} at ${screen.name} (${screen.width}px)`,async({page},testInfo)=>{
    await page.setViewportSize(screen);
    const errors:string[]=[];
    page.on('pageerror',error=>errors.push(error.message));
    const response=await page.goto(route.path,{waitUntil:'domcontentloaded'});
    expect(response?.status(),`${route.path} status`).toBe(200);
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading',{level:1}).first()).toBeVisible();
    await expect(page.locator('.jmc-header')).toBeVisible();
    await expect(page.locator('.jmc-footer')).toHaveCount(1);
    await page.waitForTimeout(150);
    const measurement=await page.evaluate(()=>({
     viewport:document.documentElement.clientWidth,
     document:document.documentElement.scrollWidth,
     body:document.body.scrollWidth,
    }));
    expect(measurement.document,`horizontal overflow: ${JSON.stringify(measurement)}`)
     .toBeLessThanOrEqual(measurement.viewport+2);
    expect(errors,`client-side exceptions: ${errors.join('; ')}`).toEqual([]);

    if(screen.name==='desktop'||screen.name==='compact'){
     await testInfo.attach(`${route.label}-${screen.name}`,{
      body:await page.screenshot({fullPage:true,animations:'disabled',timeout:25000}),
      contentType:'image/png',
     });
    }
   });
  }
 }
});

test('mobile drawer: focus trap, inert background, Escape and focus restore',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const trigger=page.locator('.jmc-menu-trigger');
 await trigger.click();
 const dialog=page.getByRole('dialog',{name:'JMC Georgia — მენიუ'});
 await expect(dialog).toBeVisible();
 await expect(trigger).toHaveAttribute('aria-expanded','true');
 await expect(page.locator('main')).toHaveAttribute('inert','');
 const close=dialog.getByRole('button',{name:'დახურვა'});
 await expect(close).toBeFocused();
 await page.keyboard.press('Shift+Tab');
 await expect(dialog.locator('a,button').last()).toBeFocused();
 await page.keyboard.press('Escape');
 await expect(dialog).toBeHidden();
 await expect(trigger).toBeFocused();
 await expect(trigger).toHaveAttribute('aria-expanded','false');
 await expect(page.locator('main')).not.toHaveAttribute('inert');
});

test('Vigus: functional red reading progress remains and fills on scroll',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const bar=page.locator('.vigus-scroll-progress-fill');
 await expect(bar).toHaveCount(1);
 await expect(bar).toHaveCSS('background-color','rgb(229, 0, 18)');
 await page.evaluate(()=>window.scrollTo(0,Math.round(document.documentElement.scrollHeight*.42)));
 await page.waitForTimeout(350);
 const fraction=await bar.evaluate(element=>{
  const inline=element.style.transform;
  return inline.startsWith('scaleX(')?Number(inline.slice(7,-1)):0;
 });
 expect(fraction).toBeGreaterThan(.1);
 expect(fraction).toBeLessThanOrEqual(1);
});

test('Vigus: view switcher and trim selection are operable',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const views=page.getByRole('group',{name:'რაკურსების არჩევა'});
 await views.getByRole('button',{name:'წინა',exact:true}).click();
 await expect(views.getByRole('button',{name:'წინა',exact:true})).toHaveAttribute('aria-pressed','true');
 const trims=page.getByRole('group',{name:'კომპლექტაციის არჩევა'});
 const options=trims.getByRole('button');
 await expect(options).toHaveCount(2);
 await options.nth(1).click();
 await expect(options.nth(1)).toHaveAttribute('aria-pressed','true');
});

test('reduced-motion: model content remains readable',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 await page.locator('#technology').scrollIntoViewIfNeeded();
 await expect(page.locator('#technology h2')).toBeVisible();
 await expect(page.locator('.vigus-scroll-progress-fill')).toHaveCount(1);
 await expect(page.locator('[data-vigus-count]').first()).toBeVisible();
});

test('footer social icons remain non-interactive until official URLs exist',async({page})=>{
 await page.goto('/',{waitUntil:'domcontentloaded'});
 const social=page.locator('.jmc-footer-socials');
 await expect(social.locator('span.jmc-social-icon')).toHaveCount(3);
 await expect(social.locator('a')).toHaveCount(0);
 await expect(page.locator('.jmc-footer-contact address')).toHaveText('თბილისი, ბელიაშვილის 115');
});

test('Vigus: animated editorial sections actually reveal during scrolling',async({page},testInfo)=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const targets=[
  {name:'character',selector:'#story .vigus-story-mosaic'},
  {name:'design',selector:'#design .vigus-storytelling'},
  {name:'capabilities',selector:'#technology .vigus-capabilities-grid'},
  {name:'trims',selector:'#trims .vigus-selector'},
 ] as const;
 for(const target of targets){
  const section=page.locator(target.selector);
  await section.scrollIntoViewIfNeeded();
  await expect.poll(async()=>Number(await section.evaluate(node=>getComputedStyle(node).opacity)),{
   timeout:8000,message:`Scroll reveal remains invisible: ${target.name}`,
  }).toBeGreaterThan(.85);
  await testInfo.attach(`vigus-scrolled-${target.name}`,{
   body:await page.screenshot({animations:'disabled'}),
   contentType:'image/png',
  });
 }
});

test('Vigus: active CTAs are truthful, labels are Georgian and future routes remain clean',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.vigus-hero-actions a[href="#trims"]')).toHaveCount(1);
 await expect(page.locator('.vigus-hero-actions a[href="/test-drive"]')).toHaveText(/ტესტ-დრაივის ინფორმაცია/);
 await expect(page.locator('.model-final a[href="/test-drive"]')).toHaveCount(1);
 await expect(page.locator('.model-local-nav .vigus-scroll-progress-fill')).toHaveCount(1);
 await expect(page.locator('.model-section-heading')).toHaveCount(6);
 const copy=await page.locator('main').innerText();
 for(const stale of ['Selected version','Choose your Vigus','The new JMC pickup','Design & Comfort','Explore / View selector','Interactive view / Vigus']){
  expect(copy,`stale English label ${stale}`).not.toContain(stale);
 }
 const links=await page.locator('.model-local-nav a[href^="#"]').evaluateAll(nodes=>nodes.map(el=>el.getAttribute('href')));
 for(const href of links){
  expect(href).toBeTruthy();
  await expect(page.locator(href!)).toHaveCount(1);
 }
});

test('Vigus: all published figures remain exactly verified while reveal runs',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const values=page.locator('[data-vigus-count]');
 const before=await values.allTextContents();
 expect(before).toEqual(['2.5','167','210','75','3150']);
 await page.locator('#technology').scrollIntoViewIfNeeded();
 await page.waitForTimeout(1100);
 expect(await values.allTextContents()).toEqual(before);
});

test('Vigus: sticky editorial chapters have a compact scroll rhythm',async({page})=>{
 await page.setViewportSize({width:1440,height:900});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const steps=page.locator('.vigus-storytelling .vigus-highlight-options button');
 await expect(steps).toHaveCount(4);
 for(const step of await steps.all()){
  const height=await step.evaluate(element=>element.getBoundingClientRect().height);
  expect(height,'desktop story chapter should not create excessive empty scroll').toBeLessThanOrEqual(355);
  expect(height).toBeGreaterThanOrEqual(220);
 }
});

test('approved header and booking CTA layout, contact address in burger/footer',async({page})=>{
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:width<500?740:900});
  await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.jmc-header-drive')).toHaveCount(0);
  const cta=page.locator('.model-local-nav .vigus-local-cta');
  await expect(cta).toHaveText('დაჯავშნე Test Drive ↗');
  await expect(cta).toHaveAttribute('href','/test-drive');
  const position=await cta.boundingBox();
  expect(position).toBeTruthy();
  expect(position!.x).toBeGreaterThanOrEqual(0);
  expect(position!.x+position!.width).toBeLessThanOrEqual(width+1);
  await expect(page.locator('.model-local-nav .vigus-scroll-progress-fill')).toHaveCount(1);
  await expect(page.locator('.jmc-footer-contact address')).toContainText('თბილისი, ბელიაშვილის 115');
  const trigger=page.locator('.jmc-menu-trigger');
  await trigger.click();
  const drawer=page.getByRole('dialog',{name:'JMC Georgia — მენიუ'});
  await expect(drawer.locator('.jmc-drawer-address')).toContainText('თბილისი, ბელიაშვილის 115');
  await expect(drawer.locator('.jmc-drawer-address a')).toHaveAttribute('href','/contact');
  await drawer.getByRole('button',{name:'დახურვა'}).click();
  await cta.click();
  await expect(page).toHaveURL(/\/test-drive$/);
  await expect(page.getByText('ტესტ-დრაივის ონლაინ განაცხადები ამ ეტაპზე არ მიიღება.',{exact:false})).toBeVisible();
 }
});

test('model publication: only approved records can become public routes',async({page})=>{
 expect(vehicles.length).toBeGreaterThan(0);
 expect(vehicles.every(vehicle=>vehicle.publicationStatus==='approved')).toBe(true);
 expect(new Set(vehicles.map(vehicle=>vehicle.slug)).size).toBe(vehicles.length);
 for(const model of vehicles){
  expect(model.name.trim()).not.toBe('');
  expect(model.description.trim()).not.toBe('');
  expect(model.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  expect(Array.isArray(model.gallery)).toBe(true);
  expect(Array.isArray(model.trims)).toBe(true);
 }
 const response=await page.goto('/vehicles/unapproved-model-for-qa',{waitUntil:'domcontentloaded'});
 expect(response?.status()).toBe(404);
});

test('Grand Avenue published: exact brochure trim and verified media',async({page})=>{
 expect(grandAvenue.slug).toBe('grand-avenue');
 expect(grandAvenue.publicationStatus).toBe('approved');
 expect(grandAvenue.trims).toHaveLength(1);
 expect(grandAvenue.trims[0].name).toBe('4X4 AT GL · Diesel');
 expect(grandAvenue.trims[0].drivetrain).toBe('4×4');
 expect(grandAvenue.trims[0].transmission).toBe('8AT');
 expect(grandAvenueTechnical.find(s=>s.label==='სიმძლავრე')?.value).toBe('211 ც.ძ.');
 expect(grandAvenueTechnical.find(s=>s.label==='კლირენსი')?.value).toBe('235 მმ');
 expect(grandAvenueTechnical.find(s=>s.label==='საწვავის ავზი')?.value).toBe('80 ლ');
 expect(grandAvenueTechnical.find(s=>s.label==='ემისიის სტანდარტი')?.value).toBe('Euro 5');
 expect(grandAvenueTechnical.some(s=>/საწვავის მოხმარება|ფასი|გარანტია/.test(s.label))).toBe(false);
 expect(grandAvenueHighlights).toHaveLength(4);
 expect(grandAvenueEquipment.exterior.length).toBeGreaterThanOrEqual(5);
 expect(grandAvenueEquipment.interior).toHaveLength(18);
 expect(grandAvenueEquipment.safety).toHaveLength(20);
 expect(Object.keys(grandAvenueMedia).sort()).toEqual(['capability','detail','exterior','front','hero','interior','rear','safety','side']);
 for(const [slot,url] of Object.entries(grandAvenueMedia)){
  expect(url,`${slot}: first-party optimized asset`).toBe(`/images/grand-avenue/${slot}.webp`);
 }
 expect(grandAvenue.heroImage).toBe('/images/grand-avenue/hero.webp');
 expect(grandAvenue.gallery).toEqual(['front','side','rear','detail'].map(slot=>`/images/grand-avenue/${slot}.webp`));
 expect(vehicles.some(v=>v.slug==='grand-avenue')).toBe(true);
 const response=await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
 expect(response?.status()).toBe(200);
});

test('Grand Avenue: all nine approved WebP assets are independently accessible',async({request})=>{
 const expected=['hero','exterior','interior','safety','capability','front','side','rear','detail'];
 for(const slot of expected){
  const response=await request.get(`/images/grand-avenue/${slot}.webp`);
  expect(response.status(),`${slot} asset HTTP status`).toBe(200);
  expect(response.headers()['content-type'],`${slot} MIME`).toContain('image/webp');
  const body=await response.body();
  expect(body.length,`${slot} must contain real image data`).toBeGreaterThan(20000);
  expect(body.subarray(0,4).toString()).toBe('RIFF');
  expect(body.subarray(8,12).toString()).toBe('WEBP');
 }
});

test('Grand Avenue discovery: homepage, catalogue, drawer, footer and test-drive',async({page})=>{
 const grand='/vehicles/grand-avenue';
 for(const path of ['/','/vehicles','/test-drive']){
  await page.goto(path,{waitUntil:'domcontentloaded'});
  await expect(page.locator('main a[href="'+grand+'"]').first()).toBeVisible();
  await expect(page.locator('main a[href="/vehicles/vigus"]').first()).toBeVisible();
 }
 await page.goto('/');
 const toggle=page.locator('.jmc-menu-trigger');
 await toggle.click();
 const drawer=page.getByRole('dialog',{name:'JMC Georgia — მენიუ'});
 await expect(drawer.locator('a[href="'+grand+'"]').first()).toBeVisible();
 await expect(drawer.locator('a[href="/vehicles"]')).toBeVisible();
 await drawer.getByRole('button',{name:'დახურვა'}).click();
 await expect(page.locator('.jmc-footer a[href="'+grand+'"]').first()).toBeVisible();
});

test('Grand Avenue editorial gallery: fullscreen navigation, Escape and focus restore',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
 const open=page.getByRole('button',{name:'წინა — სრულ ეკრანზე ნახვა'});
 await open.scrollIntoViewIfNeeded();
 await open.click();
 const dialog=page.getByRole('dialog',{name:'Grand Avenue — ფოტოგალერეა'});
 await expect(dialog).toBeVisible();
 await expect(dialog.getByText('01 / 04', {exact:false})).toBeVisible();
 await page.keyboard.press('ArrowRight');
 await expect(dialog.getByText('02 / 04', {exact:false})).toBeVisible();
 await page.keyboard.press('Escape');
 await expect(dialog).toHaveCount(0);
 await expect(open).toBeFocused();
});

test('Grand Avenue: mobile lightbox supports touch swipe',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
 await page.getByRole('button',{name:'წინა — სრულ ეკრანზე ნახვა'}).click();
 const dialog=page.getByRole('dialog',{name:'Grand Avenue — ფოტოგალერეა'});
 await expect(dialog.getByText('01 / 04',{exact:false})).toBeVisible();
 await dialog.dispatchEvent('touchstart',{touches:[{identifier:1,clientX:300,clientY:400}]});
 await dialog.dispatchEvent('touchend',{changedTouches:[{identifier:1,clientX:120,clientY:400}]});
 await expect(dialog.getByText('02 / 04',{exact:false})).toBeVisible();
});

test('Grand Avenue: compact mobile gallery scrolls horizontally without document overflow',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
 const grid=page.locator('.grand-gallery-grid');
 await grid.scrollIntoViewIfNeeded();
 const m=await grid.evaluate(el=>({visible:el.clientWidth,total:el.scrollWidth,count:el.querySelectorAll('figure').length,snap:getComputedStyle(el).scrollSnapType}));
 expect(m.count).toBe(4);
 expect(m.total).toBeGreaterThan(m.visible);
 expect(m.snap).toContain('mandatory');
 expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
 await grid.evaluate(el=>{el.scrollLeft=el.scrollWidth});
 await expect.poll(()=>grid.evaluate(el=>el.scrollLeft)).toBeGreaterThan(50);
});

test('Vigus difference filter reduces comparison rows without changing values',async({page})=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto('/vehicles/vigus',{waitUntil:'domcontentloaded'});
 const rows=page.locator('.vigus-compare-mobile .vigus-compare-card').first().locator('dl > div');
 const full=await rows.count();
 await page.getByLabel('მხოლოდ განსხვავებები').check();
 const filtered=await rows.count();
 expect(filtered).toBeGreaterThan(0);
 expect(filtered).toBeLessThan(full);
 await page.getByLabel('მხოლოდ განსხვავებები').uncheck();
 await expect(rows).toHaveCount(full);
});
test('Grand Avenue specification groups preserve all brochure values',async({page})=>{
 await page.goto('/vehicles/grand-avenue',{waitUntil:'domcontentloaded'});
 await expect(page.locator('.grand-specification-group')).toHaveCount(2);
 await expect(page.locator('.grand-specification-grid dt')).toHaveCount(grandAvenueTechnical.length);
 await expect(page.locator('.grand-specification-grid dd')).toHaveCount(grandAvenueTechnical.length);
});

test('Grand Avenue PRO draft: four source-verified independent variants',()=>{
 expect(proDraftStatus).toBe('draft');
 expect(proSourceVariants).toHaveLength(4);
 expect(new Set(proSourceVariants.map(v=>v.id)).size).toBe(4);
 for(const trim of ['LX','SLX'] as const){
  for(const fuel of ['diesel','gasoline'] as const){
   const item=getProVariant(trim,fuel);
   expect(item).toBeTruthy();
   expect(item?.specs.engine).toContain('2.3 L');
   expect(item?.specs.power).toBe(fuel==='diesel'?'177 hp':'258 hp');
   expect(item?.specs.transmission).toBe('8AT');
   expect(item?.specs.clearance).toBe('255 mm');
   expect(item?.specs.acceleration).toBe('');
   expect(item?.specs.consumption).toBe('');
   expect(Array.isArray(item?.groups.safety)).toBe(true);
  }
 }
 expect(vehicles.some(v=>v.slug==='grand-avenue-pro')).toBe(false);
});
test('Grand Avenue PRO cannot be reached on production-style public routing',async({page})=>{
 const response=await page.goto('/vehicles/grand-avenue-pro',{waitUntil:'domcontentloaded'});
 expect(response?.status()).toBe(404);
});

test('PRO editorial draft stays disconnected from public pages and routing',async({page})=>{
 const response=await page.goto('/vehicles/grand-avenue-pro',{waitUntil:'domcontentloaded'});
 expect(response?.status()).toBe(404);
 await page.goto('/vehicles',{waitUntil:'domcontentloaded'});
 await expect(page.locator('main a[href="/vehicles/grand-avenue-pro"]')).toHaveCount(0);
 await page.goto('/test-drive',{waitUntil:'domcontentloaded'});
 await expect(page.locator('main a[href="/vehicles/grand-avenue-pro"]')).toHaveCount(0);
});

test('PRO editorial media only points to original user photos, not AI candidate or other models',()=>{
 const images=Object.values(grandAvenueProOriginalMedia);
 expect(images).toHaveLength(7);
 for(const image of images){
  expect(image.src).toMatch(/^https:\/\/d2ol7oe51mr4n9\.cloudfront\.net\//);
  expect(image.original).toMatch(/\.jpg$/);
  expect(image.alt.length).toBeGreaterThan(12);
  expect(image.src).not.toContain('be63a43e-1ac9-43f5-8607-ab639e509419');
  expect(image.src).not.toContain('/vigus/');
  expect(image.src).not.toContain('/grand-avenue/');
 }
});

test('PRO brochure draft stays unlisted while comparison sources cover four categories',()=>{
 expect(vehicles.some(v=>v.slug==='grand-avenue-pro')).toBe(false);
 for(const variant of proSourceVariants){
  for(const group of ['exterior','interior','safety','offroad']){
   expect(Array.isArray(variant.groups[group])).toBe(true);
  }
 }
});
