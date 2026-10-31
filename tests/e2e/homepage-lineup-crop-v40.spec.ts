import {test,expect} from '@playwright/test';

const models=[['vigus','VIGUS'],['grand-avenue','Grand Avenue'],['grand-avenue-pro','Grand Avenue PRO']] as const;
test.describe('Homepage 4.0 photograph crop prevention',()=>{
 for(const width of [1920,1440,1024,768,430,390,320]){
  test('fit full car image within stage at '+width,async({page})=>{
   await page.setViewportSize({width,height:900});
   await page.goto('/',{waitUntil:'domcontentloaded'});
   const tabs=page.getByRole('group',{name:'აირჩიე JMC-ის მოდელი'});
   let prevStageHeight=0;
   for(const [slug,name] of models){
    await tabs.getByRole('button',{name,exact:true}).click();
    const stage=page.locator('.home3-lineup .home3-stage-image');
    const image=stage.locator('img');
    await stage.scrollIntoViewIfNeeded();
    await expect.poll(()=>image.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth===1600&&el.naturalHeight===1200)).toBe(true);
    const result=await stage.evaluate((el)=>{
     const img=el.querySelector('img')!;
     const a=el.getBoundingClientRect(),b=img.getBoundingClientRect();
     const cs=getComputedStyle(img);
     return {stage:[a.width,a.height],image:[b.width,b.height],offset:[b.left-a.left,b.top-a.top],position:cs.position,fit:cs.objectFit,padding:cs.paddingTop,scale:cs.transform};
    });
    expect(result.position).toBe('absolute');
    expect(result.fit).toBe('contain');
    expect(result.padding).toBe('0px');
    expect(result.image[0]).toBeCloseTo(result.stage[0],0);
    expect(result.image[1]).toBeCloseTo(result.stage[1],0);
    expect(Math.abs(result.offset[0])).toBeLessThan(2);
    expect(Math.abs(result.offset[1])).toBeLessThan(2);
    if(prevStageHeight)expect(Math.abs(result.stage[1]-prevStageHeight)).toBeLessThan(2);
    prevStageHeight=result.stage[1];
    if(width>900){expect(result.stage[1]).toBeGreaterThanOrEqual(519);expect(result.stage[1]).toBeLessThanOrEqual(601);}
    else{expect(result.stage[0]/result.stage[1]).toBeGreaterThan(1.28);expect(result.stage[0]/result.stage[1]).toBeLessThan(1.39);}
    if(width===1440||width===390)await test.info().attach('lineup-no-crop-'+slug+'-'+width,{body:await stage.screenshot({animations:'disabled'}),contentType:'image/png'});
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth)).toBeLessThanOrEqual(2);
  });
 }
});
