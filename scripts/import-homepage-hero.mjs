/** Imports the user-approved Homepage hero as a first-party asset before build.
 * Runs on CI and Render; site never hotlinks the generation CDN at runtime.
 */
import {mkdir,readFile,writeFile,rename,rm} from 'node:fs/promises';
import {join} from 'node:path';
const target=join(process.cwd(),'public','images','homepage','grand-avenue-pro-hero.png');
const source='https://d8j0ntlcm91z4.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/hf_20261030_195716_eab6abef-1e45-4f03-b4d3-486e11581045.png';
const valid=b=>b.byteLength>100_000&&b.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
try{const existing=await readFile(target);if(valid(existing)){console.log('Verified existing first-party Homepage hero');process.exit(0)}}catch{}
const response=await fetch(source,{signal:AbortSignal.timeout(45000)});
if(!response.ok)throw Error('Homepage hero source HTTP '+response.status);
const data=Buffer.from(await response.arrayBuffer());
if(!valid(data))throw Error('Homepage hero import failed PNG validation');
await mkdir(join(process.cwd(),'public','images','homepage'),{recursive:true});
const temp=target+'.tmp';
try{await writeFile(temp,data);await rename(temp,target)}catch(e){await rm(temp,{force:true});throw e}
console.log('Homepage hero ready as first-party PNG:',data.length);
