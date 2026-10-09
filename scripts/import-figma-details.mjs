import {readFile,writeFile,mkdir,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
const root=new URL('../',import.meta.url);
// Use the reviewed update cache; --source=path/ can select another Figma export.
const sourcePath=process.argv.find(arg=>arg.startsWith('--source='))?.slice(9)||'qa/figma-update-stage/';
const source=new URL(sourcePath.replace(/\/?$/,'/'),root);
const frames=JSON.parse(await readFile(new URL('frames.json',source),'utf8'));
const assets=new Map(),unknown=new Set();
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function styles(classes){
 const rules=[],tr={};let gradient=false;const stops={};
 const fixed={absolute:'position:absolute',relative:'position:relative',flex:'display:flex',contents:'display:contents','flex-col':'flex-direction:column','flex-none':'flex:none',block:'display:block','size-full':'width:100%;height:100%','items-center':'align-items:center','justify-center':'justify-content:center','bg-black':'background:#000','bg-white':'background:#fff','text-black':'color:#000','text-white':'color:#fff','text-center':'text-align:center','text-right':'text-align:right','font-bold':'font-weight:700','font-semibold':'font-weight:600','font-medium':'font-weight:500','font-normal':'font-weight:400','not-italic':'font-style:normal',italic:'font-style:italic','inset-0':'inset:0','overflow-hidden':'overflow:hidden','overflow-clip':'overflow:clip','pointer-events-none':'pointer-events:none','object-cover':'object-fit:cover','object-contain':'object-fit:contain','object-bottom':'object-position:bottom','max-w-none':'max-width:none','mb-0':'margin-bottom:0','[word-break:break-word]':'overflow-wrap:break-word','border-solid':'border-style:solid','border-dashed':'border-style:dashed','border-black':'border-color:#000','border-white':'border-color:#fff','whitespace-pre-wrap':'white-space:pre-wrap','whitespace-nowrap':'white-space:nowrap',uppercase:'text-transform:uppercase','mask-alpha':'mask-mode:alpha','mask-intersect':'mask-composite:intersect','mask-no-clip':'mask-clip:no-clip','mask-no-repeat':'mask-repeat:no-repeat'};
 for(const c of classes.split(/\s+/)){
  const layout={'content-stretch':'align-content:stretch','items-start':'align-items:flex-start','shrink-0':'flex-shrink:0','cursor-pointer':'cursor:pointer','left-3/4':'left:75%'};
  if(layout[c]){rules.push(layout[c]);continue;}
  const spacing=c.match(/^(gap|p)-\[(.+)\]$/);
  if(spacing){rules.push((spacing[1]==='gap'?'gap':'padding')+':'+spacing[2]);continue;}
  if(fixed[c]){rules.push(fixed[c]);continue;}
  let m;
  if(m=c.match(/^font-\['(.+):(.+)'\]$/)){let family=m[1].replaceAll('_',' '),style=m[2];if(family==='Arial'&&style.startsWith('Narrow'))family='Arial Narrow';rules.push(`font-family:'${family}',${/Georgia|Times/.test(family)?'serif':'Arial,sans-serif'}`);rules.push('font-weight:'+(/Heavy/.test(style)?900:/Semi/.test(style)?600:/Bold/.test(style)?700:/Medium/.test(style)?500:400));if(/Italic/.test(style))rules.push('font-style:italic');continue;}
  if(c==='bg-gradient-to-r'){gradient=true;continue;}
  if(m=c.match(/^(from|via|to)-(?:\[(.+)\]|(white|black))$/)){const v=(m[2]||({white:'#fff',black:'#000'}[m[3]])).replaceAll('_',' ');const k=m[1];stops[k]??={};stops[k][/^-?[\d.]+%$/.test(v)?'pos':'color']=v;continue;}
  if(m=c.match(/^(h|w|size|left|right|top|bottom|inset|leading|text|bg|tracking|rounded|rounded-bl|rounded-br|shadow|aspect|backdrop-blur|mask-size)-\[(.+)\]$/)){
   const k=m[1];let v=m[2].replaceAll('_',' ');if(v.startsWith('calc('))v=v.replace(/(?<=[%\d)])([+-])(?=[\d.])/g,' $1 ');
   const p={h:'height',w:'width',left:'left',right:'right',top:'top',bottom:'bottom',inset:'inset',leading:'line-height',text:/^(#|rgb|hsl)/.test(v)?'color':'font-size',bg:'background',tracking:'letter-spacing',rounded:'border-radius','rounded-bl':'border-bottom-left-radius','rounded-br':'border-bottom-right-radius',shadow:'box-shadow',aspect:'aspect-ratio','mask-size':'mask-size'}[k];
   rules.push(k==='size'?`width:${v};height:${v}`:k==='backdrop-blur'?`backdrop-filter:blur(${v})`:`${p}:${v}`);continue;
  }
  if(m=c.match(/^border(?:-([blrt]))?(?:-\[(.+)\]|-(\d+))?$/)){const side={b:'bottom',l:'left',r:'right',t:'top'}[m[1]],v=m[2]||(m[3]||1)+'px';rules.push(/^#|^rgb/.test(v)?'border-color:'+v:`border${side?'-'+side:''}-width:${v}`);continue;}
  if(m=c.match(/^(h|w|left|right|top|bottom)-(0|full|1\/2|px)$/)){rules.push(({h:'height',w:'width'}[m[1]]||m[1])+':'+({0:'0',full:'100%','1/2':'50%',px:'1px'}[m[2]]));continue;}
  if(m=c.match(/^opacity-(\d+)$/)){rules.push('opacity:'+Number(m[1])/100);continue;}
  if(m=c.match(/^mix-blend-(.+)$/)){rules.push('mix-blend-mode:'+m[1]);continue;}
  if(m=c.match(/^(-)?translate-([xy])-(1\/2|full)$/)){tr['t'+m[2]]=`translate${m[2].toUpperCase()}(${m[1]?'-':''}${m[3]==='full'?100:50}%)`;continue;}
  if(m=c.match(/^(-)?(rotate|skew-x|scale-y)-(?:\[(.+)\]|([\d.]+))$/)){const k=m[2],v=m[3]||(k==='scale-y'?Number(m[4])/100:m[4]+'deg');tr[k]=`${{'rotate':'rotate','skew-x':'skewX','scale-y':'scaleY'}[k]}(${m[1]?'-':''}${v})`;continue;}
  unknown.add(c);
 }
 if(gradient)rules.push('background:linear-gradient(to right,'+['from','via','to'].filter(k=>stops[k]).map(k=>(stops[k].color||'transparent')+(stops[k].pos?' '+stops[k].pos:'')).join(',')+')');
 const transforms=['tx','ty','rotate','skew-x','scale-y'].map(k=>tr[k]).filter(Boolean);if(transforms.length)rules.push('transform:'+transforms.join(' '));
 return rules.join(';');
}
function convert(text,key){
 const prefix=text.match(/const assetPathPrefix = "([^"]+)"/)?.[1];
 const media={};for(const m of text.matchAll(/const (\w+) = `\$\{assetPathPrefix\}\/([^`]+)`;/g)){const local=`assets/figma-details/${key}/${m[2]}`;media[m[1]]=local;assets.set(local,prefix+'/'+m[2]);}
 const main=text.includes('export default')?text.slice(text.indexOf('export default')):text;
 let markup=main.match(/return \(\s*([\s\S]*?)\n  \);/)?.[1]||main.match(/return (<[\s\S]*?);\s*\n\}/)?.[1];if(!markup)throw Error('No complete design code: '+key);
 // Expand the reusable research-note markers with their supplied Figma props.
 markup=markup.replace(/<ChronicleResearchNoteMarker\s+([^>]*?)\s*\/>/g,(_,props)=>{
  const component=text.match(/function ChronicleResearchNoteMarker[\s\S]*?return \(\s*([\s\S]*?)\n  \);/)?.[1];
  if(!component)throw Error('Missing research marker component');
  const classes=props.match(/className="([^"]*)"/)?.[1];
  return component.replace(/className=\{className \|\| "([^"]+)"\}/,(_,fallback)=>`className="${classes||fallback}"`).replace('{number}',props.match(/number="([^"]*)"/)?.[1]||'01');
 });
 markup=markup.replace(/className="([^"]+)"/g,(_,c)=>'style="'+esc(styles(c))+'"').replace(/src=\{(\w+)\}/g,(_,v)=>{if(!media[v])throw Error('Missing '+v);return `src="${media[v]}"`;}).replace(/\{`([^`]+)`\}/g,(_,v)=>esc(v)).replace(/\{"([^"\\]*)"\}/g,(_,v)=>esc(v)).replace(/\{'([^'\\]*)'\}/g,(_,v)=>esc(v));
 markup=markup.replace(/style=\{\{([\s\S]*?)\}\}/g,(_,v)=>{const rules=[];for(const m of v.matchAll(/(\w+):\s*(`(?:\\.|[^`])*`|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\d.]+)/g)){let value=m[2].startsWith('"')?JSON.parse(m[2]):m[2].replace(/^[`']|[`']$/g,'');value=value.replace(/\$\{(\w+)\}/g,(_,name)=>media[name]||'');rules.push(m[1].replace(/[A-Z]/g,l=>'-'+l.toLowerCase())+':'+value);}return 'style="'+esc(rules.join(';'))+'"';});
 markup=markup.replace(/<[^>]+>/g,tag=>{const all=[...tag.matchAll(/style="([^"]*)"/g)];if(all.length<2)return tag;return tag.replace(/style="[^"]*"/g,'').replace(/^<(\w+)/,(_,name)=>'<'+name+' style="'+all.map(m=>m[1]).join(';')+'"');});
 markup=markup.replace(/<(div|p|span)([^>]*?)\s*\/>/g,'<$1$2></$1>');
 markup=markup.replace(/<img /g,'<img loading="lazy" decoding="async" ');
 return markup;
}
await mkdir(new URL('dist/figma-pages/',root),{recursive:true});
const manifest=[];
for(const f of [...frames].sort((a,b)=>(a.id==='36:5538')-(b.id==='36:5538'))){
 const key=f.id.replace(':','-');let markup;
 if(f.id==='36:5538'){
  const children=JSON.parse(await readFile(new URL('wirechildren.json',source),'utf8'));const pieces=[];
  for(const child of children){const childKey=child.id.replace(':','-');const code=await readFile(new URL(`children/${childKey}.txt`,source),'utf8');pieces.push(`<div style="position:absolute;left:${child.x}px;top:${child.y}px;width:${child.width}px;height:${child.height}px">${convert(code,childKey)}</div>`);}
  markup='<div style="position:relative;width:100%;height:100%;background:white" data-node-id="36:5538">'+pieces.join('\n')+'</div>';
 }else markup=convert(await readFile(new URL(key+'.txt',source),'utf8'),key);
 markup=markup.replace('制作过程 II / 影像、控制与现场表演','Making II / Images, control and live performance');
 // Isolate the imported editorial composition from the desktop's global typography.
 const masks=[];markup=markup.replace(/mask-image:url\(&quot;([^&]+)&quot;\)/g,(_,asset)=>{const name='--figma-mask-'+masks.length;masks.push(`${name}:url('../${asset}')`);return 'mask-image:var('+name+')';});
 if(masks.length)await writeFile(new URL('dist/figma-pages/'+key+'.css',root),':root{'+masks.join(';')+'}');
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="../figma-board.css">${masks.length?`<link rel="stylesheet" href="${key}.css">`:''}</head><body><main class="figma-canvas" aria-label="${f.name}">${markup.replaceAll('assets/figma-details/','../assets/figma-details/')}</main><script src="../figma-board.js"></script></body></html>`;
 const page=`figma-pages/${key}.html`;await writeFile(new URL('dist/'+page,root),html);manifest.push({...f,page,width:1920,height:1080});
}
if(unknown.size)throw Error('Unhandled Figma styles: '+[...unknown].join(' '));
manifest.sort((a,b)=>frames.findIndex(f=>f.id===a.id)-frames.findIndex(f=>f.id===b.id));
await writeFile(new URL('dist/figma-page-data.js',root),'// Figma frames in the designer’s numbered sequence.\nexport const figmaPages = '+JSON.stringify(manifest,null,2)+';\n');
await writeFile(new URL('asset-map.json',source),JSON.stringify(Object.fromEntries(assets),null,2));
console.log(`Converted ${manifest.length} editable boards; ${assets.size} original assets.`);
if(process.argv.includes('--compile-only'))process.exit(0);
const pending=[...assets];let completed=0;
async function download(){while(pending.length){const [file,url]=pending.shift();const target=new URL('dist/'+file,root);try{if((await stat(target)).size>0){completed++;continue;}}catch{}
 await mkdir(new URL('./',target),{recursive:true});let last;for(let retry=0;retry<3;retry++){try{const r=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('HTTP '+r.status);const data=Buffer.from(await r.arrayBuffer());if(!data.length)throw Error('Empty asset');await writeFile(target,data);last=null;break;}catch(e){last=e;}}if(last)throw Error(file+': '+last);completed++;}}
const results=await Promise.allSettled(Array.from({length:6},download));for(const r of results)if(r.status==='rejected')throw r.reason;console.log(`Verified ${completed} local assets.`);
