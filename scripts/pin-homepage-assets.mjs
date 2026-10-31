/** Persist verified Homepage WebP binaries and their SHA-256 digests in the repository. */
import sharp from 'sharp';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
const root=process.cwd(),rel='public/images/homepage/';
const specs=[['lineup-vigus.webp',1600,1200],['lineup-grand-avenue.webp',1600,1200],['lineup-grand-avenue-pro.webp',1600,1200],['grand-avenue-pro-hero.webp',1920,1080]];
const audit=JSON.parse(await readFile(join(root,rel,'audit.json'),'utf8'));
const hero=audit.images.find(i=>i.role==='hero');
const images=[];
for(const [file,width,height] of specs){
 const bytes=await readFile(join(root,rel,file)),meta=await sharp(bytes).metadata();
 if(meta.format!=='webp'||meta.width!==width||meta.height!==height||bytes.length<10000||bytes.length>1500000)throw Error('Invalid homepage asset: '+file);
 images.push({path:rel+file,sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length,width,height,format:'webp'});
}
const lock={version:1,source:'Approved JMC Homepage 3.6-3.7 outputs; see image audit and GitHub history',heroOriginal:{width:hero.originalWidth,height:hero.originalHeight,bytes:hero.originalBytes},images};
await mkdir(join(root,'assets/homepage'),{recursive:true});
await writeFile(join(root,'assets/homepage/media-lock.json'),JSON.stringify(lock,null,2)+'\n');
console.log('HOMEPAGE_ASSETS_PINNED',JSON.stringify({files:images.length,totalBytes:images.reduce((s,i)=>s+i.bytes,0),checksums:images.map(i=>[i.path,i.sha256])}));
