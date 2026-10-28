/** Pins authentic user-provided PRO originals as first-party Next.js public assets.
 * Runs only during builds; site never requests Higgsfield CDN at runtime.
 * Checks content SHA256 so AI changes or corrupted bytes cannot enter production.
 */
import {createHash} from 'node:crypto';
import {mkdir,readFile,writeFile,rename,rm} from 'node:fs/promises';
import {join} from 'node:path';
const root=join(process.cwd(),'public','images','grand-avenue-pro');
const prefix='https://d2ol7oe51mr4n9.cloudfront.net/user_39RQYoSaWBG5Rv9RmVqvLICsOMX/';
const images=[["hero","01302a38-69f5-426d-bbef-bd2f9c2f4e82","8419cfe8a6fe1ad53c1d1f59f3ea44fb3c771cade07cb40d958e731b750e830d"],["exterior","80f58619-2597-43c3-abac-e3b68380fa5d","b3b3ca302acfd9dccef42451d106972aa37edae257a18c61f7e1dee092ca88ea"],["rear","2ff6bbfd-8976-4130-8162-0043745397be","fe0be227d14c921a2385fbe978d5b0bcb36fd30999e40b342b177652b350299b"],["front-detail","b14563cb-8c6e-4650-bb09-628ac4c3a77a","430dec463ba0f3d8f0003ff5a17a73afe4e0e128dc5a037637c1613d63c682bf"],["cluster","6fa6bbf3-6237-411a-9c80-0f6594e2a186","724b905c9b8af0a1ee842b3a06bc0c6388ad3dbce2f554d602d2965ee345e40f"],["terrain-display","6c8fff44-308a-4d15-a19a-b2380ce911b3","8c689e29424217105ca9e20f658c7129106e3ce3354853d0814f5e946c18d5b4"],["overhead","178add8a-a884-4684-b831-940d1d5218fe","a21c04acdc5456915a0bf35c6543a7b4b110bee7fd450f5ee9e2c717b7159993"]];
await mkdir(root,{recursive:true});
for(const [name,id,sha] of images){
 const dest=join(root,name+'.jpg');
 const check=b=>createHash('sha256').update(b).digest('hex')===sha;
 try{const local=await readFile(dest);if(check(local)){console.log('Verified local PRO original:',name);continue}}catch{}
 const response=await fetch(prefix+id+'.jpg',{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw new Error('PRO image '+name+' HTTP '+response.status);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(!check(bytes)||bytes[0]!==0xff||bytes[1]!==0xd8||bytes[2]!==0xff)throw new Error('PRO original SHA/JPEG verification failed: '+name);
 const tmp=dest+'.tmp';
 try{await writeFile(tmp,bytes);await rename(tmp,dest)}catch(e){await rm(tmp,{force:true});throw e}
 console.log('Downloaded and verified first-party PRO image:',name,bytes.length);
}
