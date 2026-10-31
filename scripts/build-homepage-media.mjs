/** Homepage media mastering and audit.
 * Only the three JMC-specific, reference-led FLUX.2 outputs and the previously
 * user-approved Hero are processed. Original first-party gallery assets are kept.
 */
import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
import {existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
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
const lockPath=join(root,'assets/homepage/media-lock.json');
const pinned=existsSync(lockPath);
if(!pinned&&process.env.HOMEPAGE_ASSET_BOOTSTRAP!=='1')throw Error('Homepage SHA-256 manifest missing; no CDN fetch allowed in ordinary builds.');
const lock=pinned?JSON.parse(await readFile(lockPath,'utf8')):null;
const report={generatedAt:new Date().toISOString(),mode:pinned?'immutable-local':'one-time-bootstrap',specification:{lineup:'1600x1200 WebP, 4:3',hero:'1920x1080 WebP, 16:9',story:'existing first-party original; constrained layout'},images:[]};
async function pinnedAsset(file,width,height){
 const rel='public/images/homepage/'+file,entry=lock?.images?.find(i=>i.path===rel);
 if(!entry||entry.width!==width||entry.height!==height||entry.format!=='webp')throw Error('Pinned image manifest entry invalid: '+rel);
 const buf=await readFile(join(root,rel));
 const sha=createHash('sha256').update(buf).digest('hex');
 if(sha!==entry.sha256||buf.length!==entry.bytes)throw Error('Homepage image digest mismatch: '+rel);
 const m=await sharp(buf).metadata();
 if(m.format!=='webp'||m.width!==width||m.height!==height)throw Error('Pinned image dimensions invalid: '+rel);
 return buf;
}
for(const [name,url] of lineup){
 const buf=pinned?await pinnedAsset('lineup-'+name+'.webp',1600,1200):await acquire('lineup-'+name,url);
 const m=await sharp(buf).metadata();
 report.images.push({name:'lineup-'+name,role:'model-lineup',width:m.width,height:m.height,format:m.format,bytes:buf.length,kib:Math.round(buf.length/1024),aspectRatio:Number((m.width/m.height).toFixed(4))});
}
let heroOriginal,optimizedHero;
if(pinned){
 optimizedHero=await pinnedAsset('grand-avenue-pro-hero.webp',1920,1080);
 heroOriginal=lock.heroOriginal;
 if(!heroOriginal||heroOriginal.width<1920||heroOriginal.height<1080)throw Error('Pinned Hero source metadata invalid');
}else{
 const hero=await readFile(join(dir,'grand-avenue-pro-hero.png'));
 const meta=await sharp(hero).metadata();
 heroOriginal={width:meta.width,height:meta.height,bytes:hero.length};
 optimizedHero=await sharp(hero).rotate().resize(1920,1080,{fit:'cover',position:'centre',withoutEnlargement:true}).webp({quality:88,effort:5}).toBuffer();
 await writeFile(join(dir,'grand-avenue-pro-hero.webp'),optimizedHero);
}
report.images.push({name:'grand-avenue-pro-hero',role:'hero',originalWidth:heroOriginal.width,originalHeight:heroOriginal.height,originalBytes:heroOriginal.bytes,width:1920,height:1080,format:'webp',bytes:optimizedHero.length,kib:Math.round(optimizedHero.length/1024),aspectRatio:16/9});
// Additional approved Homepage-only 4-angle studio set; no external image requests.
for(const angle of ['front-three-quarter','front','side','rear-three-quarter']){
 const filename='vigus-'+angle+'.webp';
 const buf=await pinnedAsset(filename,1440,1080);
 report.images.push({name:'vigus-'+angle,role:'homepage-vigus-editorial',width:1440,height:1080,format:'webp',bytes:buf.length,kib:Math.round(buf.length/1024),aspectRatio:4/3});
}
for(const name of ['vigus','grand-avenue','grand-avenue-pro']){
 const path=join(root,'public/images/studio',name+'-studio.webp');
 const bytes=await readFile(path),m=await sharp(bytes).metadata();
 report.images.push({name:name+'-studio-original',role:'source-preserved',width:m.width,height:m.height,format:m.format,bytes:bytes.length,kib:Math.round(bytes.length/1024),aspectRatio:Number((m.width/m.height).toFixed(4))});
}
await writeFile(join(dir,'audit.json'),JSON.stringify(report,null,2)+'\n');
console.log('HOMEPAGE_MEDIA_AUDIT',JSON.stringify(report));
