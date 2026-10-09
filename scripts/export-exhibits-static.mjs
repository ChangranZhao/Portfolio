import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist'),destination=path.resolve(root,'../导出/HTML/Project01');
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2','.woff':'font/woff'};
const assets=new Map();
async function embed(url,base=dist){if(url.startsWith('data:')||url.startsWith('#'))return url;const f=/^https?:/.test(url)?path.join(dist,decodeURIComponent(new URL(url).pathname)):path.resolve(base,decodeURIComponent(url));assert.ok(f.startsWith(dist+path.sep));if(!assets.has(f))assets.set(f,`data:${mime[path.extname(f)]};base64,${(await readFile(f)).toString('base64')}`);return assets.get(f);}
async function cssFile(name){const f=path.join(dist,name);let s=await readFile(f,'utf8');for(const m of [...s.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?\s*;/g)])s=s.replace(m[0],await cssFile(path.join(path.dirname(name),m[1])));for(const m of [...s.matchAll(/url\(["']?([^"')]+)["']?\)/g)])s=s.replace(m[0],`url("${await embed(m[1],path.dirname(f))}")`);return s;}
const overrides=`html,body{width:1920px!important;min-width:1920px!important;height:auto!important;margin:0!important;padding:0!important;background:#080808;color:#eee} .ex-reader,.ex-reader[open]{position:static!important;display:block!important;inset:auto!important;width:1920px!important;max-width:none!important;height:auto!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;border-radius:0!important;overflow:visible!important;box-shadow:none!important}.ex-reader-body{height:auto!important;max-height:none!important;overflow:visible!important;flex:none!important}.ex-window-bar,.ex-reader-footer,.ex-gs-index,.ex-qz-index,.ex-editorial-archive,.ex-image-expand,.ex-photo-controls{display:none!important}.ex-gs-video img{display:block;width:100%;height:100%;object-fit:contain}*{transition:none!important;animation:none!important;cursor:default!important;scroll-behavior:auto!important}`;
const css=(await cssFile('project-exhibit-reader.css')).replace(/\bbutton\b/g,':is(button,.export-static-control)')+'\n'+await cssFile('chinese-fonts.css')+'\n'+overrides;
const jobs=[['甘石星经','ganshi-details.js','createGanshiDetails',null,'ganshi'],['齐之为齐','qizhiweiqi-details.js','createQizhiweiqiDetails',null,'qizhiweiqi'],['因其俗简其礼','project-exhibit-reader.js','createExhibitReader','01','customs']];
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{for(const [name,module,factory,id,key] of jobs){
 const page=await browser.newPage({viewport:{width:1920,height:1200},reducedMotion:'reduce'});
 await page.route('**/static-export-shell',route=>route.fulfill({contentType:'text/html',body:'<!doctype html><html lang="en"><head><meta charset="utf-8"></head><body></body></html>'}));
 await page.goto('http://127.0.0.1:4173/static-export-shell');
 await page.evaluate(async({module,factory,id})=>{document.documentElement.lang='en';const api=await import('/'+module),reader=api[factory]();id?reader.open(id):reader.open();}, {module,factory,id});
 await page.addStyleTag({content:css});
 await page.evaluate(async()=>{document.querySelectorAll('img').forEach(n=>n.loading='eager');document.querySelectorAll('video').forEach(n=>n.pause());await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});
 const result=await page.evaluate(()=>{
  const source=document.querySelector('.ex-reader'),clone=source.cloneNode(true);
  clone.querySelectorAll('button').forEach((n,i)=>{const original=source.querySelectorAll('button')[i],s=getComputedStyle(original),d=document.createElement('div');for(const a of n.attributes)if(!['type','tabindex','role','aria-haspopup','aria-expanded'].includes(a.name))d.setAttribute(a.name,a.value);for(const prop of s)d.style.setProperty(prop,s.getPropertyValue(prop));d.classList.add('export-static-control');d.innerHTML=n.innerHTML;n.replaceWith(d);});
  clone.querySelectorAll('video').forEach(n=>{const im=document.createElement('img');im.src=n.getAttribute('poster');im.alt='Installation video — representative still';n.replaceWith(im);});
  clone.querySelectorAll('.ex-window-bar,.ex-reader-footer,.ex-gs-index,.ex-qz-index,.ex-editorial-archive,.ex-image-expand,.ex-photo-controls,script,select').forEach(n=>n.remove());
  clone.querySelectorAll('*').forEach(n=>{for(const a of [...n.attributes])if(a.name.startsWith('on')||['tabindex','role','data-gs-asset','data-qz-asset','data-hi-asset','loading'].includes(a.name))n.removeAttribute(a.name);});
  clone.querySelectorAll('a').forEach(n=>n.removeAttribute('href'));
  const walk=document.createTreeWalker(clone,NodeFilter.SHOW_TEXT);let n;while(n=walk.nextNode())n.textContent=n.textContent.replace(/\s*↗/g,'').replace(/\/ muted loop/g,'/ video still');
  const wrapper=document.createElement('main');wrapper.className=clone.className;wrapper.innerHTML=clone.innerHTML;
  return {html:wrapper.outerHTML};
 });
 let html=result.html;for(const m of [...html.matchAll(/\b(src|href|poster)="([^"<>]+)"/g)])if(!m[2].startsWith('#'))html=html.replace(m[0],`${m[1]}="${await embed(m[2])}"`);
 const file=path.join(destination,`${name}_英文静态排版.html`);
 await writeFile(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920"><title>${key} — Qi Culture Classics Center</title><style>${css}</style></head><body>${html}</body></html>`);
 const check=await browser.newPage({viewport:{width:1920,height:1200}}),requests=[];check.on('request',r=>{if(r.url().startsWith('http'))requests.push(r.url());});await check.goto(pathToFileURL(file).href,{timeout:120000});await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});
 const stats=await check.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,images:document.images.length,broken:[...document.images].filter(n=>!n.naturalWidth).length,chinese:document.body.innerText.match(/[\u3400-\u9fff]+/g)||[],scripts:document.scripts.length,buttons:document.querySelectorAll('button').length,videos:document.querySelectorAll('video').length}));
 assert.equal(stats.width,1920);assert.equal(stats.broken,0);assert.deepEqual(stats.chinese,[]);assert.equal(stats.scripts,0);assert.equal(stats.buttons,0);assert.equal(stats.videos,0);assert.deepEqual(requests,[]);
 await check.screenshot({path:path.join(root,`qa/${key}-static-top.png`)});await check.screenshot({path:path.join(root,`qa/${key}-static-full.png`),fullPage:true});console.log(JSON.stringify({file,...stats}));await page.close();await check.close();
}}finally{await browser.close();}

