import {readFileSync} from 'node:fs';
import {exit} from 'node:process';

const files=['app/globals.css','app/editorial-surfaces.css','app/design-system.css'];
let violations=0;
for(const path of files){
 const css=readFileSync(path,'utf8');
 const blocks=[...css.matchAll(/(?:^|\})\s*([^{}]+)\{/gm)];
 const counts=new Map();
 for(const match of blocks){
  const selector=match[1].trim();
  if(selector.startsWith('@'))continue;
  counts.set(selector,(counts.get(selector)||0)+1);
 }
 const repeats=[...counts.entries()].filter(([,n])=>n>1).sort((a,b)=>b[1]-a[1]);
 console.log(`${path}: ${Math.round(Buffer.byteLength(css)/1024)} KiB, ${counts.size} unique selectors, ${repeats.length} repeated selectors`);
 console.log('  Largest repeat groups:',repeats.slice(0,5).map(([selector,n])=>`${selector} ×${n}`).join(' | ')||'none');
 if(path==='app/editorial-surfaces.css' && /(?:1200|1240|1480)px/.test(css)){
  console.error('ERROR: obsolete generic fixed-width literal found in editorial surfaces');
  violations++;
 }
 if(path==='app/design-system.css'){
  for(const token of ['--jmc-content-max:1680px','--jmc-readable-max:760px','--jmc-gutter-desktop:24px','--jmc-gutter-mobile:16px']){
   if(!css.includes(token)){console.error(`ERROR: canonical Width Bible token missing: ${token}`);violations++;}
  }
 }
}
if(violations){console.error(`CSS audit failed with ${violations} violation(s)`);exit(1);}
console.log('CSS audit passed. Repeated selectors are informational: responsive overrides need manual review.');
