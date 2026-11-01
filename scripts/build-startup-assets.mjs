import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {figmaPages} from '../dist/figma-page-data.js';
import {mimesisPages} from '../dist/mimesis-page-data.js';
import {gaiaPages} from '../dist/gaia-pages.js';
import {changzhiPages} from '../dist/changzhi-assets.js';
const root=new URL('../dist/',import.meta.url),warmups={};
const first={p2:figmaPages.find(p=>p.name==='4_page1'),p3:figmaPages.find(p=>p.name==='2_page1'),p4:figmaPages.find(p=>p.name==='3_page1'),p7:mimesisPages[0],p8:gaiaPages[0],p6:changzhiPages.find(p=>p.id==='928:853')};
for(const [id,page] of Object.entries(first)){
 const html=await readFile(new URL(page.page,root),'utf8');
 const images=[...html.matchAll(/\bsrc="([^"]+\.(?:png|jpe?g|webp))"/gi)].map(m=>path.posix.normalize(path.posix.join(path.posix.dirname(page.page),m[1])));
 warmups[id]=[...new Set(images)].slice(0,2);
}
await writeFile(new URL('startup-assets.js',root),'// Selected first-board images only. Regenerate with scripts/build-startup-assets.mjs.\nexport const projectWarmups = '+JSON.stringify(warmups,null,2)+';\n');
console.log('Prepared first-board photo warmups for '+Object.keys(warmups).length+' projects.');
