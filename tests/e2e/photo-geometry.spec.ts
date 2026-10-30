import {test,expect} from '@playwright/test';

/** Full-site photography geometry contract: equal-size approved studio
 * masters and independent editorial art direction for model details. */
const studioSurfaces=[
 {route:'/',selector:'.jmc-lineup-secondary-visual.jmc-studio-surface',count:2},
 {route:'/vehicles',selector:'.jmc-home-model-image.jmc-studio-surface',count:3},
 {route:'/test-drive',selector:'.jmc-lead-model-photo',count:3},
 {route:'/compare',selector:'.jmc-compare-story-image.jmc-studio-surface',count:3},
 {route:'/compare',selector:'.jmc-compare-slot.jmc-studio-selector > img',count:2},
] as const;

test.describe('Approved image-size audit',()=>{
 for(const width of [1440,768,390,320]){
  for(const sample of studioSurfaces){
   test(`${sample.route} ${sample.selector} @ ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:850});
    await page.goto(sample.route,{waitUntil:'domcontentloaded'});
    const tiles=page.locator(sample.selector);
    await expect(tiles).toHaveCount(sample.count);
    const metrics=await tiles.evaluateAll(nodes=>nodes.map(node=>{
     const image=node instanceof HTMLImageElement?node:node.querySelector('img')!;
     const element=node instanceof HTMLImageElement?node:node;
     const box=element.getBoundingClientRect();
     const photo=image.getBoundingClientRect();
     return {src:image.getAttribute('src'),width:box.width,height:box.height,
      photoWidth:photo.width,photoHeight:photo.height,fit:getComputedStyle(image).objectFit,
      scroll:document.documentElement.scrollWidth,viewport:document.documentElement.clientWidth};
    }));
    for(const item of metrics){
     expect(item.src).toMatch(/^\/images\/studio\/.*-studio\.webp$/);
     expect(item.width).toBeGreaterThan(60);
     expect(item.height).toBeGreaterThan(35);
     expect(item.width/item.height).toBeCloseTo(16/9,1);
     expect(item.photoWidth/item.photoHeight).toBeCloseTo(16/9,1);
     expect(item.fit).toBe('cover');
     expect(item.scroll).toBeLessThanOrEqual(item.viewport+2);
    }
   });
  }
 }
 for(const width of [1440,390,320]){
  test(`Footer CTA uses the approved pill Button at ${width}px`,async({page})=>{
   await page.setViewportSize({width,height:850});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const cta=page.locator('.jmc-footer .jmc-footer-cta.button');
   await expect(cta).toHaveCSS('border-radius','999px');
   await expect(cta).toHaveCSS('background-color','rgb(255, 255, 255)');
   const geo=await cta.boundingBox();
   expect(geo).toBeTruthy();
   expect(geo!.height).toBeGreaterThanOrEqual(44);
   expect(geo!.x).toBeGreaterThanOrEqual(0);
   expect(geo!.x+geo!.width).toBeLessThanOrEqual(width+2);
   await cta.click();
   await expect(page).toHaveURL(/\/vehicles$/);
  });
 }
 test('Image geometry stays separate from large model-page hero art direction',async({page})=>{
  for(const slug of ['vigus','grand-avenue','grand-avenue-pro']){
   await page.goto('/vehicles/'+slug,{waitUntil:'domcontentloaded'});
   await expect(page.locator('main img').first()).toBeAttached();
   expect(await page.locator('main').evaluate(e=>e.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(()=>document.documentElement.clientWidth+2));
  }
 });
});
