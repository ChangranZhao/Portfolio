import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const file=path.resolve(root,'../导出/HTML/Project01/齐文化典籍中心_空间叙事_全英分层.html');
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.woff2':'font/woff2'};
async function embed(url,base=dist){if(url.startsWith('data:')||url.startsWith('#'))return url;const f=path.resolve(base,url);assert.ok(f.startsWith(dist+path.sep));return `data:${mime[path.extname(f)]};base64,${(await readFile(f)).toString('base64')}`;}
async function cssFile(name){const f=path.join(dist,name);let s=await readFile(f,'utf8');for(const m of [...s.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?\s*;/g)])s=s.replace(m[0],await cssFile(path.join(path.dirname(name),m[1])));for(const m of [...s.matchAll(/url\(["']?([^"')]+)["']?\)/g)])s=s.replace(m[0],`url("${await embed(m[1],path.dirname(f))}")`);return s;}
const overrides=`*{box-sizing:border-box}html,body{width:1920px;min-width:1920px;margin:0;background:#000;color:#eee;font-family:Arial,sans-serif}.spatial-page{width:1920px;padding:0 32px 24px;container-type:inline-size}.sp-diagram{width:1856px;height:1044px}.sp-diagram .sp-drawing{transform:scale(.483333333333)!important}.sp-point{pointer-events:none}.sp-diagram-tools{padding:16px 0}.sp-floor+.sp-floor{margin-top:30px}*{animation:none!important;transition:none!important;cursor:default!important}`;
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1200}});
 await page.goto('http://127.0.0.1:4173/culture.html');
 await page.evaluate(async()=>{
  const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');document.documentElement.lang='en';
  const {createSpatialDesign}=await import('/project-spatial-design.js');
  document.querySelectorAll('link[rel=stylesheet],style').forEach(n=>n.remove());
  const result=createSpatialDesign();document.body.replaceChildren(result.element||result.section||result);
 });
 const css=await cssFile('project-spatial-design.css')+'\n'+await cssFile('chinese-fonts.css')+'\n'+overrides;
 await page.addStyleTag({content:css});
 const extracted=await page.evaluate(async()=>{
  document.querySelectorAll('.sp-masthead,.sp-intro,.sp-sequence,.sp-footer,.sp-enlarge,.sp-interaction-guide,.sp-exhibit-caption,figcaption,dialog').forEach(n=>n.remove());
  document.querySelectorAll('.sp-secondary-label').forEach(n=>n.remove());
  document.querySelectorAll('button').forEach(n=>{const span=document.createElement('span');for(const a of n.attributes)if(!['type','tabindex','role','aria-haspopup'].includes(a.name))span.setAttribute(a.name,a.value);span.innerHTML=n.innerHTML;n.replaceWith(span);});
  document.querySelectorAll('img').forEach(n=>n.loading='eager');
  await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));
  return {html:document.querySelector('.spatial-page').outerHTML,chinese:[...document.querySelectorAll('.spatial-page p,.spatial-page span')].filter(n=>/[\u3400-\u9fff]/.test(n.textContent)).map(n=>n.textContent)};
 });
 assert.deepEqual(extracted.chinese,[]);
 let html=extracted.html;for(const m of [...html.matchAll(/\bsrc="([^"]+)"/g)])html=html.replace(m[0],`src="${await embed(m[1])}"`);
 await writeFile(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920"><title>Qi Culture Classics Center — Spatial Narrative</title><style>${css}</style></head><body>${html}</body></html>`);
 const check=await browser.newPage({viewport:{width:1920,height:1200}});await check.goto(pathToFileURL(file).href);await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});
 const stats=await check.evaluate(()=>({width:document.documentElement.scrollWidth,images:document.images.length,broken:[...document.images].filter(n=>!n.naturalWidth).length,chinese:/[\u3400-\u9fff]/.test(document.body.innerText),floors:document.querySelectorAll('.sp-floor').length,scripts:document.scripts.length}));assert.equal(stats.width,1920);assert.equal(stats.broken,0);assert.equal(stats.chinese,false);assert.equal(stats.floors,2);assert.equal(stats.scripts,0);
 await check.screenshot({path:path.join(root,'qa/spatial-english-export.png'),fullPage:true});console.log(JSON.stringify({file,...stats},null,2));
}finally{await browser.close();}
