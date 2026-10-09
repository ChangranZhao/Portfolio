import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const file=path.resolve(root,'../导出/HTML/Project01/齐文化典籍中心_文化图谱_分层_Figma兼容版.html');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1920,height:1400},reducedMotion:'reduce'});
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
const cache=new Map();
async function embed(url,base=dist){
 if(url.startsWith('data:')||url.startsWith('#'))return url;
 const name=url.startsWith('http')?path.join(dist,decodeURIComponent(new URL(url).pathname)):path.resolve(base,url);
 assert.ok(name.startsWith(dist+path.sep));
 if(!cache.has(name))cache.set(name,`data:${mime[path.extname(name)]};base64,${(await readFile(name)).toString('base64')}`);
 return cache.get(name);
}
try{
 await page.addInitScript(()=>{localStorage.setItem('culture-language','en');localStorage.setItem('portfolio-preferences',JSON.stringify({lang:'en',motion:true}));});
 await page.goto('http://127.0.0.1:4173/culture.html');
 await page.locator('.photo-card').first().waitFor();
 await page.addStyleTag({content:'html,body{width:1920px!important;min-width:1920px!important;margin:0}.app{width:1920px!important;max-width:none!important;padding:0 30px!important}.capture-tools,.capture-notice,.controls,.drag-hint,dialog{display:none!important}*{animation:none!important;transition:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
 await page.waitForTimeout(500);
 // Freeze each visible sphere face as a separate planar layer, with no runtime 3D dependency.
 const poses=await page.evaluate(()=>{
  const stage=document.querySelector('.sphere-stage').getBoundingClientRect();
  function matrix(el){const s=getComputedStyle(el),o=s.transformOrigin.split(' ').map(parseFloat);return new DOMMatrix().translate(parseFloat(s.left)||0,parseFloat(s.top)||0).translate(...o).multiply(new DOMMatrix(s.transform==='none'?undefined:s.transform)).translate(-o[0],-o[1],-(o[2]||0));}
  return [...document.querySelectorAll('.face-front')].map((face,index)=>{
   const card=face.closest('.photo-card'),globe=card.closest('.globe');
   const m=new DOMMatrix(getComputedStyle(globe).transform).multiply(matrix(card)).multiply(matrix(face));
   const s=getComputedStyle(face),w=parseFloat(s.width),h=parseFloat(s.height),p=m.transformPoint(new DOMPoint(w/2,h/2)),n=m.transformPoint(new DOMPoint(0,0,1,0)),d=parseFloat(getComputedStyle(globe.parentElement).perspective);
   face.setAttribute('data-export-face',index);
   return {index,w,h,depth:p.z,visible:n.z*(d-p.z)-n.x*p.x-n.y*p.y>0,src:face.querySelector('img').src,alt:face.querySelector('img').alt,stage:{x:stage.x,y:stage.y,width:stage.width,height:stage.height}};
  }).filter(p=>p.visible).sort((a,b)=>a.depth-b.depth);
 });
 const cdp=await page.context().newCDPSession(page);
 await cdp.send('DOM.enable');const {root:dom}=await cdp.send('DOM.getDocument');
 for(const pose of poses){const {nodeId}=await cdp.send('DOM.querySelector',{nodeId:dom.nodeId,selector:`[data-export-face="${pose.index}"]`});const {quads}=await cdp.send('DOM.getContentQuads',{nodeId});pose.quad=quads[0];}
 const body=await page.evaluate(poses=>{
  const original=document.querySelector('.app'),clone=original.cloneNode(true),stage=clone.querySelector('.sphere-stage');
  // SVG image references are omitted by some HTML importers. Export ordinary HTML
  // images with the same projected position, separately from the vector diagram.
  const board=original.querySelector('.knowledge-board'),boardBox=board.getBoundingClientRect(),target=clone.querySelector('.knowledge-board');
  original.querySelectorAll('.knowledge-graph image').forEach((source,index)=>{
   const matrix=source.getScreenCTM().translate(source.x.baseVal.value,source.y.baseVal.value);
   const img=document.createElement('img');img.className='archive-photo-layer';
   img.src=source.href.baseVal;img.alt=source.closest('.archive-node')?.textContent.trim()||`Archive ${index+1}`;
   img.setAttribute('data-layer',img.alt);
   const s=getComputedStyle(source);
   img.style.cssText=`position:absolute;left:0;top:0;width:${source.width.baseVal.value}px;height:${source.height.baseVal.value}px;object-fit:${source.getAttribute('preserveAspectRatio')?.includes('slice')?'cover':'contain'};transform-origin:0 0;transform:matrix(${matrix.a},${matrix.b},${matrix.c},${matrix.d},${matrix.e-boardBox.x},${matrix.f-boardBox.y});filter:${s.filter};opacity:${s.opacity};pointer-events:none;`;
   target.append(img);
  });
  clone.querySelectorAll('.knowledge-graph image').forEach(n=>n.remove());
  stage.innerHTML='';stage.style.cssText='position:relative;width:100%;height:100%;overflow:hidden';
  for(const p of poses){
   const q=p.quad.map((n,i)=>n-(i%2?p.stage.y:p.stage.x));
   const group=document.createElement('div');group.className='sphere-photo-layer';group.setAttribute('data-layer',p.alt);group.style.cssText='position:absolute;inset:0;pointer-events:none';
   // Two clipped triangles preserve the projected quadrilateral while retaining image layers.
   const transforms=[[(q[2]-q[0])/p.w,(q[3]-q[1])/p.w,(q[4]-q[2])/p.h,(q[5]-q[3])/p.h,q[0],q[1]],[(q[4]-q[6])/p.w,(q[5]-q[7])/p.w,(q[6]-q[0])/p.h,(q[7]-q[1])/p.h,q[0],q[1]]];
   transforms.forEach((m,i)=>{const img=document.createElement('img');img.src=p.src;img.alt=p.alt;img.style.cssText=`position:absolute;left:0;top:0;width:${p.w}px;height:${p.h}px;object-fit:cover;transform-origin:0 0;transform:matrix(${m});clip-path:polygon(${i===0?'0 0,100% 0,100% 100%':'0 0,100% 100%,0 100%'});`;group.append(img);});
   stage.append(group);
  }
  clone.querySelectorAll('.capture-tools,.capture-notice,.controls,.drag-hint,dialog,script').forEach(n=>n.remove());
  clone.querySelectorAll('a').forEach(n=>n.removeAttribute('href'));
  clone.querySelectorAll('button').forEach(n=>{const d=document.createElement('div');for(const a of n.attributes)if(a.name!=='type')d.setAttribute(a.name,a.value);d.innerHTML=n.innerHTML;n.replaceWith(d);});
  clone.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes])if(a.name.startsWith('on')||['tabindex','role','aria-pressed','data-photo'].includes(a.name))n.removeAttribute(a.name);});
  return clone.outerHTML;
 },poses);
 let html=body;
 for(const m of [...html.matchAll(/\b(src|href)="([^"<>]+)"/g)]){if(m[2].startsWith('data:')||m[2].startsWith('#'))continue;html=html.replace(m[0],`${m[1]}="${await embed(m[2])}"`);}
 let css='';for(const name of ['culture-runtime.css','chinese-fonts.css']){let s=await readFile(path.join(dist,name),'utf8');for(const m of [...s.matchAll(/url\(["']?([^"')]+)["']?\)/g)])s=s.replace(m[0],`url("${await embed(m[1])}")`);css+=s;}
 css+='html,body{width:1920px!important;min-width:1920px!important;margin:0}.app{width:1920px!important;max-width:none!important;padding:0 30px!important}.theme-bars>div{position:relative;flex:1;text-align:left;color:#929c9c;font-size:7px;padding:0 0 10px;border-bottom:1px solid #364042}.theme-bars>div span{display:block;min-height:18px}*{animation:none!important;transition:none!important;cursor:default!important;pointer-events:none!important}';
 await writeFile(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920"><title>齐文化典籍中心 · 文化图谱 · 分层排版</title><style>${css}</style></head><body>${html}</body></html>`);
 const check=await browser.newPage({viewport:{width:1920,height:1400}}),requests=[];
 check.on('request',r=>{if(r.url().startsWith('http'))requests.push(r.url());});
 await check.goto(pathToFileURL(file).href,{waitUntil:'load'});
 await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode()));});
 const stats=await check.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,archiveLayers:document.querySelectorAll('.archive-photo-layer').length,svgImages:document.querySelectorAll('svg image').length,sphereLayers:document.querySelectorAll('.sphere-photo-layer').length,svgText:document.querySelectorAll('svg text').length,vectorPaths:document.querySelectorAll('svg path').length,broken:[...document.images].filter(im=>!im.naturalWidth).length,scripts:document.scripts.length,buttons:document.querySelectorAll('button').length}));
 assert.equal(stats.archiveLayers,24);assert.equal(stats.svgImages,0);
 assert.equal(stats.width,1920);assert.equal(stats.broken,0);assert.equal(stats.scripts,0);assert.equal(stats.buttons,0);assert.ok(stats.sphereLayers>70);assert.ok(stats.svgText>50);assert.deepEqual(requests,[]);
 await check.screenshot({path:path.join(root,'qa/culture-layered-export.png'),fullPage:true});
 console.log(JSON.stringify({file,...stats},null,2));
}finally{await browser.close();}
