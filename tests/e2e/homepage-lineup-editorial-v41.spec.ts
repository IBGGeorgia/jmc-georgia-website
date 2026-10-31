import {test,expect} from '@playwright/test';
const models=[
 {slug:'vigus',name:'VIGUS'},
 {slug:'grand-avenue',name:'Grand Avenue'},
 {slug:'grand-avenue-pro',name:'Grand Avenue PRO'},
] as const;

test.describe('Homepage 4.1 balanced editorial photo/text grid',()=>{
 for(const width of [1920,1440,1200,1024,900,768,430,390,320]){
  test('three vehicles retain exact 4:3 frame and generously sized copy at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const tabs=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
   let previousHeight=0;
   for(const model of models){
    await tabs.getByRole('button',{name:model.name,exact:true}).click();
    const panel=page.locator('.home3-vehicle-stage');
    const media=panel.locator('.home3-stage-image');
    const copy=panel.locator('.home3-stage-copy');
    const img=media.locator('img');
    await media.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate((v:HTMLImageElement)=>v.complete&&v.naturalWidth===1600&&v.naturalHeight===1200)).toBe(true);
    const metrics=await page.evaluate(()=>{
     const panel=document.querySelector('.home3-vehicle-stage')!.getBoundingClientRect();
     const media=document.querySelector('.home3-stage-image')!.getBoundingClientRect();
     const copy=document.querySelector('.home3-stage-copy')!.getBoundingClientRect();
     const img=document.querySelector('.home3-stage-image img') as HTMLImageElement;
     const cs=getComputedStyle(img);
     return {
       panelWidth:panel.width,
       mediaWidth:media.width,mediaHeight:media.height,
       copyWidth:copy.width,copyHeight:copy.height,
       imgWidth:img.getBoundingClientRect().width,imgHeight:img.getBoundingClientRect().height,
       fit:cs.objectFit,padding:cs.padding,source:[img.naturalWidth,img.naturalHeight],
       overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,
     };
    });
    expect(metrics.fit).toBe('cover');
    expect(metrics.padding).toBe('0px');
    expect(metrics.source).toEqual([1600,1200]);
    expect(metrics.mediaWidth/metrics.mediaHeight).toBeGreaterThan(1.32);
    expect(metrics.mediaWidth/metrics.mediaHeight).toBeLessThan(1.35);
    expect(Math.abs(metrics.imgWidth-metrics.mediaWidth)).toBeLessThan(2);
    expect(Math.abs(metrics.imgHeight-metrics.mediaHeight)).toBeLessThan(2);
    if(width>900){
      expect(metrics.mediaWidth/metrics.panelWidth).toBeGreaterThan(.53);
      expect(metrics.mediaWidth/metrics.panelWidth).toBeLessThan(.55);
      expect(metrics.copyWidth/metrics.panelWidth).toBeGreaterThan(.45);
      expect(metrics.copyWidth/metrics.panelWidth).toBeLessThan(.47);
    }else{
      expect(metrics.copyWidth/metrics.panelWidth).toBeGreaterThan(.99);
    }
    if(previousHeight)expect(Math.abs(previousHeight-metrics.mediaHeight)).toBeLessThan(2);
    previousHeight=metrics.mediaHeight;
    expect(metrics.overflow).toBeLessThanOrEqual(2);
    if([1920,1440,1024,390].includes(width)){
      await test.info().attach('lineup-'+model.slug+'-'+width,{
        body:await panel.screenshot({animations:'disabled'}),contentType:'image/png',
      });
    }
   }
  });
 }
});
