/** Homepage media mastering and audit.
 * Only the three JMC-specific, reference-led FLUX.2 outputs and the previously
 * user-approved Hero are processed. Original first-party gallery assets are kept.
 */
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
const root=process.cwd(),dir=join(root,'public/images/homepage');
await mkdir(dir,{recursive:true});
const lineup=[
 ['vigus','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_225601_a7bdd718-e842-4cc1-aefa-b6de3bb7ac14.png'],
 ['grand-avenue','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_225601_098263f3-88e3-4063-8f78-1607b1f3d94f.png'],
 ['grand-avenue-pro','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_225601_f8f23c10-762d-403d-8cb4-542c358e5f1a.png']
];
async function acquire(name,url){
 const target=join(dir,name+'.webp');
 try{const existing=await readFile(target);const m=await sharp(existing).metadata();if(m.format==='webp'&&m.width===1600&&m.height===1200)return existing}catch{}
 const res=await fetch(url,{signal:AbortSignal.timeout(60000)});
 if(!res.ok)throw Error('Image source HTTP '+res.status+' '+name);
 const bytes=Buffer.from(await res.arrayBuffer());
 const meta=await sharp(bytes).metadata();
 if(!meta.width||!meta.height||meta.width<1000||meta.height<700)throw Error('Image resolution insufficient: '+name);
 const out=await sharp(bytes).rotate().resize(1600,1200,{fit:'contain',background:'#e9eaed',withoutEnlargement:false}).webp({quality:84,effort:5}).toBuffer();
 await writeFile(target,out);return out;
}
const report={generatedAt:new Date().toISOString(),specification:{lineup:'1600x1200 WebP, 4:3',hero:'1920x1080 WebP, 16:9 (native-resolution, no upscaling)',story:'existing first-party original; constrained layout'},images:[]};
for(const [name,url] of lineup){const buf=await acquire('lineup-'+name,url);const m=await sharp(buf).metadata();report.images.push({name:'lineup-'+name,role:'model-lineup',width:m.width,height:m.height,format:m.format,bytes:buf.length,kib:Math.round(buf.length/1024),aspectRatio:Number((m.width/m.height).toFixed(4))});}
const heroSrc=join(dir,'grand-avenue-pro-hero.png'),hero=await readFile(heroSrc),original=await sharp(hero).metadata();
const optimizedHero=await sharp(hero).rotate().resize(1920,1080,{fit:'cover',position:'centre',withoutEnlargement:true}).webp({quality:88,effort:5}).toBuffer();
await writeFile(join(dir,'grand-avenue-pro-hero.webp'),optimizedHero);
report.images.push({name:'grand-avenue-pro-hero',role:'hero',originalWidth:original.width,originalHeight:original.height,originalBytes:hero.length,width:1920,height:1080,format:'webp',bytes:optimizedHero.length,kib:Math.round(optimizedHero.length/1024),aspectRatio:16/9});
for(const name of ['vigus','grand-avenue','grand-avenue-pro']){
 const path=join(root,'public/images/studio',name+'-studio.webp');
 const bytes=await readFile(path),m=await sharp(bytes).metadata();
 report.images.push({name:name+'-studio-original',role:'source-preserved',width:m.width,height:m.height,format:m.format,bytes:bytes.length,kib:Math.round(bytes.length/1024),aspectRatio:Number((m.width/m.height).toFixed(4))});
}
await writeFile(join(dir,'audit.json'),JSON.stringify(report,null,2)+'\n');
console.log('HOMEPAGE_MEDIA_AUDIT',JSON.stringify(report));
