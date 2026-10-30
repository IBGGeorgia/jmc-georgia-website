/** One-time import of approved JMC Drive Studio image candidates into this Git branch.
 * Non-interactive: validates the PNG signature/dimensions and commits immutable
 * first-party files. Do NOT re-run without a specific design review.
 */
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const sources=[
 ['drive-front-20261030.png','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_174359_1e8c426b-4af4-47c7-b93e-d16c612ba1c0.png'],
 ['drive-side-20261030.png','https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_174400_57807ee6-a724-419a-8a0f-a983757246f8.png']
];
const dir=join(process.cwd(),'public','images','vigus');
await mkdir(dir,{recursive:true});
for(const [filename,url] of sources){
 const res=await fetch(url,{signal:AbortSignal.timeout(60000)});
 if(!res.ok)throw Error('Image import '+filename+' HTTP '+res.status);
 const bytes=Buffer.from(await res.arrayBuffer());
 if(bytes.length<30000||bytes.length>15000000||bytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')
  throw Error('Invalid PNG signature or size for '+filename);
 const width=bytes.readUInt32BE(16),height=bytes.readUInt32BE(20);
 if(width<1000||height<550||Math.abs(width/height-16/9)>.18)throw Error('Invalid aspect ratio '+filename+': '+width+'x'+height);
 await writeFile(join(dir,filename),bytes);
 console.log('IMPORTED_VIGUS_MEDIA',filename,width,height,bytes.length,createHash('sha256').update(bytes).digest('hex'));
}
