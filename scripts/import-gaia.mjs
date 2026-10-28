import {readFile,writeFile,mkdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const source='C:/Users/20135/Documents/Codex/2026-10-25/https-www-figma-com-design-yhknldzhkb5gss672skhmm/work/';
const original=await readFile(new URL('scripts/import-figma-details.mjs',root),'utf8');
const converter=original.slice(original.indexOf('const assets=new Map()'),original.indexOf("await mkdir(new URL('dist/figma-pages/'")).replace("const fixed={", "const fixed={'whitespace-pre':'white-space:pre','font-light':'font-weight:300',capitalize:'text-transform:capitalize','px-[14px]':'padding-left:14px;padding-right:14px','py-[12px]':'padding-top:12px;padding-bottom:12px','pb-[10px]':'padding-bottom:10px','pt-[12px]':'padding-top:12px',");
const {convert,assets,unknown}=new Function(converter+';return {convert,assets,unknown};')();
await mkdir(new URL('dist/gaia-boards/',root),{recursive:true});
const pages=[];
for(const [i,key] of ['2001-722','2001-975','2001-1167','2001-1313','2009-2','2001-1506'].entries()){
 const record=JSON.parse(await readFile(source+'gaia-'+key+'.json','utf8'));
 const html=convert(record.content[0],key);
 const page='gaia-boards/'+key+'.html';
 await writeFile(new URL('dist/'+page,root),`<!doctype html><html lang="en"><head><meta charset="utf-8"><link rel="stylesheet" href="../figma-board.css"><style>html,body,.figma-canvas{background:#000}p{white-space:normal}img{max-width:none}</style></head><body><main class="figma-canvas">${html.replaceAll('assets/figma-details/','../assets/figma-details/')}</main></body></html>`);
 pages.push({id:record.nodeId,name:'gaia_page'+(i+1),page,width:1920,height:1080});
}
if(unknown.size)throw Error('Unknown classes: '+[...unknown].join(' '));
await writeFile(new URL('dist/gaia-pages.js',root),'export const gaiaPages = '+JSON.stringify(pages)+';\n');
await writeFile(new URL('tmp/gaia-assets.json',root),JSON.stringify(Object.fromEntries(assets),null,2));
console.log('Converted',pages.length,'boards;',assets.size,'assets to download');
