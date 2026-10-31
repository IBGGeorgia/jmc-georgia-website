/**
 * ONE-TIME reviewed Homepage Model Lineup asset mastering.
 * Run only from the controlled feature branch with explicit LINEUP_MASTER_IMPORT=1.
 * No ordinary CI or production build can invoke this importer.
 */
import sharp from 'sharp';
import {createHash} from 'node:crypto';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {join} from 'node:path';
if(process.env.LINEUP_MASTER_IMPORT!=='1')throw new Error('One-time importer requires LINEUP_MASTER_IMPORT=1');
const root=process.cwd();
const dir=join(root,'public/images/homepage');
const sources=[
 ['vigus',null],
 ['grand-avenue','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261031_092451_6181176b-e953-4377-8d1c-4ca4f7bf2a3c.png'],
 ['grand-avenue-pro','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261031_092451_5997ffb3-2c28-4119-931a-0e0fd7286465.png'],
];
await mkdir(dir,{recursive:true});
const lockFile=join(root,'assets/homepage/media-lock.json');
const lock=JSON.parse(await readFile(lockFile,'utf8'));
const report=[];
for(const [slug,url] of sources){
 let input;
 if(!url){input=await readFile(join(dir,'vigus-front-three-quarter.webp'));}
 else{
   const response=await fetch(url,{signal:AbortSignal.timeout(60000)});
   if(!response.ok)throw new Error('Source HTTP '+response.status+' '+slug);
   input=Buffer.from(await response.arrayBuffer());
   if(input.length<100000)throw new Error('Generation too small to be original: '+slug);
 }
 const original=await sharp(input).metadata();
 if(!original.width||!original.height||original.width<1440||original.height<1080)throw new Error('Image source resolution too small '+slug);
 const bytes=await sharp(input).rotate().resize(1600,1200,{fit:'contain',background:'#e9eaed',kernel:'lanczos3'}).webp({quality:88,effort:6}).toBuffer();
 const meta=await sharp(bytes).metadata();
 if(meta.format!=='webp'||meta.width!==1600||meta.height!==1200)throw new Error('Wrong output size '+slug);
 if(bytes.length<30000||bytes.length>1200000)throw new Error('Output file size outside guardrails '+slug);
 const name='lineup-'+slug+'.webp',path='public/images/homepage/'+name;
 await writeFile(join(dir,name),bytes);
 const entry={path,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width:1600,height:1200,format:'webp'};
 const existing=lock.images.findIndex(x=>x.path===path);
 if(existing<0)throw new Error('Missing locked entry '+path);
 lock.images[existing]=entry;
 report.push({slug,original:[original.width,original.height],output:[meta.width,meta.height],bytes:bytes.length,sha256:entry.sha256});
}
lock.version=3;
lock.source='Homepage 3.9 unified editorial composition; VIGUS approved 3/4 studio, Grand Avenue and PRO reference-led FLUX.2 Pro; retained source provenance in Git history.';
await writeFile(lockFile,JSON.stringify(lock,null,2)+'\n');
await writeFile(join(dir,'lineup-master-report.json'),JSON.stringify(report,null,2)+'\n');
console.log('LINEUP_MASTER_COMPLETE',JSON.stringify(report));
