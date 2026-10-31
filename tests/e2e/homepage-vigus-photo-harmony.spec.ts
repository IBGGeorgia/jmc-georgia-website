import {test,expect} from '@playwright/test';

const angles=['front-three-quarter','front','side','rear-three-quarter'];
const path=(name:string)=>'/images/homepage/vigus-'+name+'.webp';
test.describe('Homepage 3.8 VIGUS approved photo family',()=>{
 test('all four WebP files are immutable and correct size',async({request})=>{
  const response=await request.get('/images/homepage/audit.json');
  expect(response.status()).toBe(200);
  const audit=await response.json();
  expect(audit.mode).toBe('immutable-local');
  for(const angle of angles){
   const a=audit.images.find((x:{name:string})=>x.name==='vigus-'+angle);
   expect(a?.role).toBe('homepage-vigus-editorial');
   expect([a.width,a.height,a.format]).toEqual([1440,1080,'webp']);
   expect(a.bytes).toBeGreaterThan(30000);
   expect(a.bytes).toBeLessThan(500000);
   const image=await request.get(path(angle));
   expect(image.status()).toBe(200);
   expect(image.headers()['content-type']).toContain('image/webp');
  }
 });
 for(const width of [1920,1440,1024,768,430,390,320]){
  test('Story and Explorer imagery compose correctly at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const story=page.locator('.home3-story-tile').first();
   const storyImg=story.locator('.home3-story-photo img');
   await story.scrollIntoViewIfNeeded();
   await expect(storyImg).toHaveAttribute('src',path('front-three-quarter'));
   await expect.poll(()=>storyImg.evaluate((i:HTMLImageElement)=>[i.naturalWidth,i.naturalHeight])).toEqual([1440,1080]);
   const storyRect=await story.locator('.home3-story-photo').boundingBox();
   expect(storyRect!.height).toBeGreaterThan(200);
   const modelTabs=page.getByRole('group',{name:'გალერეის მოდელი'});
   await modelTabs.getByRole('button',{name:'VIGUS',exact:true}).click();
   const previews=page.getByRole('group',{name:'აირჩიე ფოტოს რაკურსი'}).getByRole('button');
   expect(await previews.count()).toBe(6);
   const image=page.locator('.home3-detail-media img');
   for(let i=0;i<4;i++){
    await previews.nth(i).click();
    await expect(image).toHaveAttribute('src',path(angles[i]));
    await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>[i.naturalWidth,i.naturalHeight])).toEqual([1440,1080]);
    await expect(image).toHaveCSS('object-fit','cover');
   }
   await previews.nth(4).click();
   await expect(image).toHaveAttribute('src',/cockpit/);
   await previews.nth(5).click();
   await expect(image).toHaveAttribute('src',/seats/);
   await previews.first().click();
   const photoBounds=await page.locator('.home3-detail-media').boundingBox();
   expect(photoBounds).toBeTruthy();
   if(width<=950){
    expect(photoBounds!.width/photoBounds!.height).toBeGreaterThan(1.28);
    expect(photoBounds!.width/photoBounds!.height).toBeLessThan(1.39);
   }else{
    expect(photoBounds!.height).toBeGreaterThanOrEqual(519);
    expect(photoBounds!.height).toBeLessThanOrEqual(681);
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
   if(width===1440||width===390){
    await page.locator('.home3-detail-media').scrollIntoViewIfNeeded();
    await test.info().attach('vigus-explorer-'+width,{body:await page.screenshot(),contentType:'image/png'});
   }
  });
 }
});
