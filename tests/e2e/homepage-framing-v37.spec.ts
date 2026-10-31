import {test,expect} from '@playwright/test';
test.describe('Homepage 3.7 photo composition contract',()=>{
 for(const width of [1920,1440,950,768,700,430,390,320]){
  test('Hero framing, text/CTAs and editorial images at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const hero=page.locator('.home3-hero');
   const backdrop=page.locator('.home3-hero-backdrop');
   await expect(hero).toHaveCSS('height',width<=700?'650px':'748px');
   if(width<=700){
    const size=await backdrop.evaluate(el=>getComputedStyle(el).backgroundSize);
    expect(size).not.toBe('cover');
    const headline=page.locator('.home3-headline-word');
    const word=await headline.evaluate(el=>({rect:el.getBoundingClientRect().toJSON(),lines:el.getClientRects().length}));
    expect(word.lines).toBe(1);
    expect(word.rect.right).toBeLessThanOrEqual(width-12);
   }
   await expect(page.locator('.home3-hero .home3-actions a').first()).toBeVisible();
   const stage=page.locator('.home3-stage-image');
   const ratio=await stage.evaluate(el=>el.getBoundingClientRect().width/el.getBoundingClientRect().height);
   // The v4.1 native 4:3 stage follows width instead of the obsolete 600px cap.
   expect(ratio).toBeGreaterThan(1.32);
   expect(ratio).toBeLessThan(1.35);
   if(width>=701&&width<=950){
    const photo=page.locator('.home3-story-photo').first();
    const card=page.locator('.home3-story-tile').first();
    const [p,c]=await Promise.all([photo.boundingBox(),card.boundingBox()]);
    expect(p&&c).toBeTruthy();
    expect(p!.width).toBeLessThan(c!.width*.60);
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
   if(width===1440||width===390){
    const photographs=page.locator('.home3-stage-image img, .home3-story-photo img, .home3-detail-media img');
    for(const photo of await photographs.all()){
      await photo.scrollIntoViewIfNeeded();
      await expect.poll(()=>photo.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBe(true);
    }
    await page.locator('.home3-hero').scrollIntoViewIfNeeded();
    await test.info().attach('homepage-photo-composition-'+width,{body:await page.screenshot({fullPage:true}),contentType:'image/png'});
   }
  });
 }
});
