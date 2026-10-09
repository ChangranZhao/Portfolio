import {readFile,writeFile,mkdir} from 'node:fs/promises';
const source=await readFile(new URL('../qa/echo-figma-reference.txt',import.meta.url),'utf8');
const prefix=source.match(/const assetPathPrefix = "([^"]+)"/)[1];
const assets=[...source.matchAll(/const (img\w+) = `\$\{assetPathPrefix\}\/([^`]+)`;/g)].map(m=>({name:m[1],file:m[2]}));
const dir=new URL('../dist/assets/echo-process/',import.meta.url);await mkdir(dir,{recursive:true});
const results=await Promise.allSettled(assets.map(async a=>{const r=await fetch(prefix+'/'+a.file);if(!r.ok)throw Error(a.file+': '+r.status);const data=Buffer.from(await r.arrayBuffer());if(!data.length)throw Error('Empty '+a.file);await writeFile(new URL(a.file,dir),data);return a.file;}));
for(const r of results)if(r.status==='rejected')throw r.reason;
function styles(classes){
 const rules=[],transforms=[];
 const fixed={absolute:'position:absolute',relative:'position:relative',flex:'display:flex','flex-col':'flex-direction:column','flex-none':'flex:none',block:'display:block','size-full':'width:100%;height:100%','items-center':'align-items:center','justify-center':'justify-content:center','bg-black':'background:#000','text-white':'color:#fff','text-justify':'text-align:justify','font-black':'font-weight:900','font-bold':'font-weight:700','font-semibold':'font-weight:600','font-medium':'font-weight:500','font-normal':'font-weight:400','not-italic':'font-style:normal','inset-0':'inset:0','overflow-hidden':'overflow:hidden','pointer-events-none':'pointer-events:none','object-cover':'object-fit:cover','max-w-none':'max-width:none','h-0':'height:0','mb-0':'margin-bottom:0','[word-break:break-word]':'overflow-wrap:break-word'};
 for(const c of classes.split(/\s+/)){
  if(fixed[c]){rules.push(fixed[c]);continue;}
  if(c.startsWith('font-[')){rules.push('font-family:Inter,Arial,sans-serif');continue;}
  const v=c.match(/^(h|w|size|left|top|inset|leading|text)-\[([^\]]+)\]$/);
  if(v){const prop={h:'height',w:'width',left:'left',top:'top',inset:'inset',leading:'line-height',text:'font-size'}[v[1]];let value=v[2].replaceAll('_',' ');if(v[1]==='leading'&&value==='0')value='0';rules.push(v[1]==='size'?`width:${value};height:${value}`:`${prop}:${value}`);continue;}
  if(/^opacity-\d+$/.test(c)){rules.push('opacity:'+Number(c.split('-')[1])/100);continue;}
  if(c==='-translate-y-1/2'){transforms.unshift('translateY(-50%)');continue;}
  if(c==='scale-y-87'){transforms.push('scaleY(.8660254)');continue;}
  if(c==='-scale-y-100'){transforms.push('scaleY(-1)');continue;}
  if(/rotate|skew-x/.test(c)){const neg=c.startsWith('-'),raw=c.replace(/^-/,''),angle=raw.match(/\[([^\]]+)\]/)?.[1]||raw.match(/(\d+)$/)?.[1]+'deg';const name=raw.startsWith('rotate')?'rotate':'skewX';const transform=`${name}(${neg?'-':''}${angle})`;if(name==='rotate')transforms.unshift(transform);else transforms.splice(transforms.findIndex(t=>t.startsWith('scale')),0,transform);continue;}
  throw Error('Unhandled class '+c);
 }
 if(transforms.length)rules.push('transform:'+transforms.join(' '));return rules.join(';');
}
let markup=source.slice(source.indexOf('    <div className='),source.indexOf('\n  );'));
markup=markup.replace(/className="([^"]+)"/g,(_,cls)=>`style="${styles(cls)}"`).replace(/src=\{(img\w+)\}/g,(_,name)=>`src="\${media.${name}}"`).replace(/\{`([^`]+)`\}/g,(_,s)=>s.replaceAll('&','&amp;')).replace(/<img /g,'<img loading="lazy" decoding="async" ');
markup=markup.replace('width:319.853px','width:1100px').replace('>How we do</p>','>How we do · 05 / Making</p>');
// Keep the original Figma composition, with independently selectable live text and images.
const module=`// Generated from Figma node 1:2. Images are local originals; layout remains editable HTML.\nconst media=${JSON.stringify(Object.fromEntries(assets.map(a=>[a.name,'assets/echo-process/'+a.file])),null,2)};\nexport function createEchoProcessBoard(openImage){\n const wrapper=document.createElement('div');wrapper.className='echo-board-wrap';\n const canvas=document.createElement('div');canvas.className='echo-figma-canvas';\n canvas.innerHTML=\`${markup}\`;\n for(const img of canvas.querySelectorAll('img')){\n  img.alt='';\n  if(img.getAttribute('src').endsWith('.png')){\n   const button=document.createElement('button');button.type='button';button.className='echo-board-image';button.setAttribute('aria-label','View process photograph');\n   img.parentNode.insertBefore(button,img);button.append(img);button.onclick=()=>openImage([{src:img.getAttribute('src'),name:'Echo Space — process'}],0,'ECHO SPACE');\n  }\n }\n wrapper.append(canvas);\n const observer=new ResizeObserver(([entry])=>{const scale=entry.contentRect.width/2155;canvas.style.transform='scale('+scale+')';wrapper.style.height=(3047.054*scale)+'px';});\n observer.observe(wrapper);\n queueMicrotask(()=>wrapper.closest('.window')?.addEventListener('window-closing',()=>observer.disconnect(),{once:true}));\n return wrapper;\n}\n`;
await writeFile(new URL('../dist/echo-process-board.js',import.meta.url),module.replace(' for(const img of canvas.querySelectorAll',` canvas.querySelector('[data-node-id="1:4"]')?.remove();\n for(const element of canvas.querySelectorAll('[style*="pointer-events:none"]'))element.style.pointerEvents='';\n for(const img of canvas.querySelectorAll`));
console.log('Imported '+assets.length+' original Figma assets and generated editable process board.');
