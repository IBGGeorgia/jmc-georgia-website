import {test,expect} from '@playwright/test';

const models=[
 {slug:'vigus',name:'VIGUS'},
 {slug:'grand-avenue',name:'Grand Avenue'},
 {slug:'grand-avenue-pro',name:'Grand Avenue PRO'}
] as const;

test.describe('Homepage 3.9 consistent Model Lineup images',()=>{
 test('first-party optimized masters have identical intrinsic format and dimensions',async({request})=>{
   const response=await request.get('/images/homepage/audit.json');
   expect(response.status()).toBe(200);
   const audit=await response.json();
   expect(audit.mode).toBe('immutable-local');
   for(const model of models){
     const key='lineup-'+model.slug;
     const entry=audit.images.find((x:{name:string})=>x.name===key);
     expect(entry?.role).toBe('model-lineup');
     expect([entry.width,entry.height,entry.format]).toEqual([1600,1200,'webp']);
     expect(entry.bytes).toBeGreaterThan(50000);
     expect(entry.bytes).toBeLessThan(1200000);
     const image=await request.get('/images/homepage/'+key+'.webp');
     expect(image.status()).toBe(200);
     expect(image.headers()['content-type']).toContain('image/webp');
   }
 });
 for(const width of [1920,1440,1024,768,430,390,320]){
   test('stable complete 4:3 truck photographs at '+width,async({page})=>{
      await page.setViewportSize({width,height:900});
      await page.goto('/',{waitUntil:'domcontentloaded'});
      const tabs=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
      const stage=page.locator('.home3-stage-image');
      let referenceHeight=0;
      for(const model of models){
        await tabs.getByRole('button',{name:model.name,exact:true}).click();
        await stage.scrollIntoViewIfNeeded();
        const image=stage.locator('img');
        await expect(image).toHaveAttribute('src','/images/homepage/lineup-'+model.slug+'.webp');
        await expect(image).toHaveCSS('object-fit','contain');
        await expect(image).toHaveCSS('padding-top','0px');
        await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>[i.naturalWidth,i.naturalHeight])).toEqual([1600,1200]);
        const bounds=await stage.boundingBox();
        expect(bounds).toBeTruthy();
        if(referenceHeight)expect(Math.abs(bounds!.height-referenceHeight)).toBeLessThan(2);
        referenceHeight=bounds!.height;
        const ratio=bounds!.width/bounds!.height;
        if(width<=900){expect(ratio).toBeGreaterThan(1.28);expect(ratio).toBeLessThan(1.39);}
        else{expect(bounds!.height).toBeGreaterThanOrEqual(519);expect(bounds!.height).toBeLessThanOrEqual(601);}
      }
      expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
      if(width===1440||width===390){
         const image=stage.locator('img');
         await expect.poll(()=>image.evaluate((i:HTMLImageElement)=>i.complete&&i.naturalWidth>0)).toBe(true);
         await test.info().attach('model-lineup-final-'+width,{body:await page.screenshot(),contentType:'image/png'});
      }
   });
 }
});
