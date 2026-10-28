import {translateBoard} from './changzhi-zh.mjs';
import {readFile,writeFile,mkdir,stat} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const research=JSON.parse(await readFile(new URL('tmp/changzhi-figma-research.json',root)));
research.records.push(JSON.parse(await readFile(new URL('tmp/changzhi-814.json',root))));
const original=await readFile(new URL('scripts/import-figma-details.mjs',root),'utf8');
const converter=original.slice(original.indexOf('const assets=new Map()'),original.indexOf("await mkdir(new URL('dist/figma-pages/'")).replaceAll('backdrop-blur|mask-size','backdrop-blur|mask-size|mask-position').replace("'mask-size':'mask-size'","'mask-size':'mask-size','mask-position':'mask-position'");
const {convert,assets,unknown}=new Function(converter+';return {convert,assets,unknown};')();
const pages=[];
await mkdir(new URL('dist/changzhi-boards/',root),{recursive:true});
for(const r of research.records){
 const key=r.nodeId.replace(':','-'),code=r.content[0].replaceAll('leading-none','leading-[1]');
 let html=convert(code,key);
 const masks=[];html=html.replace(/mask-image:url\(&quot;([^&]+)&quot;\)/g,(_,asset)=>{const name='--cz-mask-'+masks.length;masks.push(`${name}:url('../${asset}')`);return 'mask-image:var('+name+')';});
 if(masks.length)await writeFile(new URL(`dist/changzhi-boards/${key}.css`,root),':root{'+masks.join(';')+'}');
 const name=code.match(/data-name="([^"]+)"/)?.[1];
 const images=[...new Set([...html.matchAll(/src="([^"]+)"/g)].map(m=>m[1]))];
 const vars={}; for(const m of code.matchAll(/const (\w+) = `\$\{assetPathPrefix\}\/([^`]+)`;/g))vars[m[1]]=`assets/figma-details/${key}/${m[2]}`;
 pages.push({id:r.nodeId,name,page:`changzhi-boards/${key}.html`,images,vars});
 await writeFile(new URL(`dist/changzhi-boards/${key}.html`,root),translateBoard(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../figma-board.css">${masks.length?`<link rel="stylesheet" href="${key}.css">`:''}<title>${name}</title><style>body{margin:0;background:#030303}.figma-canvas{transform-origin:top left}img{cursor:zoom-in}p{white-space:normal}</style></head><body><main class="figma-canvas">${html.replaceAll('assets/figma-details/','../assets/figma-details/')}</main><script>function fit(){document.querySelector('main').style.transform='scale('+innerWidth/1920+')';document.body.style.height=innerWidth*1080/1920+'px'}addEventListener('resize',fit);fit();</script><script type="module" src="../${r.nodeId==='928:973'?'changzhi-atlas.js':'changzhi-board-motion.js'}"></script></body></html>`,key));
}
let done=0;const queue=[...assets];
await Promise.all(Array.from({length:8},async()=>{while(queue.length){const [file,url]=queue.shift(),dest=new URL('dist/'+file,root);try{if((await stat(dest)).size>0){done++;continue}}catch{}await mkdir(new URL('./',dest),{recursive:true});let response;for(let attempt=0;attempt<3;attempt++){response=await fetch(url);if(response.ok)break;}if(!response.ok)throw Error(url+' '+response.status);const bytes=Buffer.from(await response.arrayBuffer());if(!bytes.length)throw Error('Empty asset');await writeFile(dest,bytes);done++;}}));
await writeFile(new URL('dist/changzhi-assets.js',root),'export const changzhiPages = '+JSON.stringify(pages,null,2)+';\n');
console.log(JSON.stringify({pages:pages.length,assets:done,unknown:[...unknown],inventory:pages.map(p=>({id:p.id,name:p.name,vars:Object.keys(p.vars)}))},null,2));
