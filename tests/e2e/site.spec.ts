import {test, expect} from '@playwright/test';

const routes=[
 {path:'/',label:'home'},
 {path:'/vehicles/vigus',label:'vigus'},
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
 await expect(page.getByText('თბილისი, ბელიაშვილის 115').first()).toBeVisible();
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
