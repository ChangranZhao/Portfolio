import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const destination=path.resolve(root,'../导出/HTML/Project01');
await mkdir(destination,{recursive:true});
const file=path.join(destination,'齐文化典籍中心_静态排版.html');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1920,height:1100},deviceScaleFactor:1,reducedMotion:'reduce'});
const overrides=`
html,body{margin:0!important;padding:0!important;width:1920px!important;min-width:1920px!important;height:auto!important;min-height:0!important;overflow:visible!important;background:#080a0b!important}
body{display:block!important}.case-reader{display:block!important;width:1920px!important;height:auto!important;overflow:visible!important}.case-article{display:block!important;width:100%!important;height:auto!important;overflow:visible!important;flex:none!important}
*,*::before,*::after{animation:none!important;transition:none!important;cursor:default!important;scroll-behavior:auto!important}
.cd-viewport{overflow:visible!important}.cd-canvas{width:100%!important;min-width:0!important}.cd-toolbar,.cd-mobile-hint,.sp-enlarge,.sp-interaction-guide,.sp-exhibit-caption,.case-next-chapter,.case-originals,.case-sources,.field-survey-note,.sp-floor figcaption{display:none!important}
.cd-footer>a,.sp-footer>a{display:none!important}.export-culture-image{display:block;width:100%;height:auto;border:0}.case-article img{content-visibility:visible!important}
.spatial-page{padding-left:60px!important;padding-right:60px!important}.sp-diagram{width:1800px!important;height:1012.5px!important}.sp-diagram .sp-drawing{transform:scale(.46875)!important}
`;
const mime={'.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const assets=new Map();
async function dataURI(url,base=dist){
 if(!url||url.startsWith('data:')||url.startsWith('#'))return url;
 let local;
 if(/^https?:/.test(url)){const parsed=new URL(url);assert.equal(parsed.hostname,'127.0.0.1','Export must not silently retain remote resources');local=path.join(dist,decodeURIComponent(parsed.pathname));}
 else local=path.resolve(base,decodeURIComponent(url.split(/[?#]/)[0]));
 assert.ok(local.startsWith(dist+path.sep),'Asset must be inside project dist: '+local);
 if(!assets.has(local))assets.set(local,`data:${mime[path.extname(local)]||'application/octet-stream'};base64,${(await readFile(local)).toString('base64')}`);
 return assets.get(local);
}
async function inlineCSS(name){
 const filename=path.join(dist,name);let text=await readFile(filename,'utf8');
 for(const match of [...text.matchAll(/@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?\s*;/g)])text=text.replace(match[0],await inlineCSS(path.join(path.dirname(name),match[1])));
 for(const match of [...text.matchAll(/url\(\s*['"]?([^'"\)]+)['"]?\s*\)/g)]){
  if(match[1].startsWith('data:')||match[1].startsWith('#'))continue;
  text=text.replace(match[0],`url("${await dataURI(match[1],path.dirname(filename))}")`);
 }
 return text;
}
try{
 await page.goto('http://127.0.0.1:4173/#project=p1');
 await page.locator('.user-guide[open]').waitFor();await page.keyboard.press('Escape');
 await page.locator('#case-delivery').waitFor();
 await page.evaluate(async()=>{
  const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');
  const shell=document.querySelector('.case-window');
  shell.style.cssText='position:fixed;left:0;top:0;width:1920px;height:1100px;max-width:none;';
  document.querySelectorAll('.case-article img').forEach(im=>im.loading='eager');
  await Promise.all([...document.querySelectorAll('.case-article img')].map(im=>im.decode().catch(()=>{})));
  await document.fonts.ready;
 });
 const iframe=page.locator('.culture-embed');
 await iframe.scrollIntoViewIfNeeded();
 const frame=await (await iframe.elementHandle()).contentFrame();
 await frame.waitForSelector('.app');
 if(await frame.locator('.app').getAttribute('data-language')==='zh')await frame.locator('.language-toggle').click();
 await frame.addStyleTag({content:'.capture-tools{display:none!important}'});
 await frame.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
 await page.waitForTimeout(1600);
 const culture=await iframe.screenshot({animations:'disabled'});
 await page.addStyleTag({content:overrides});
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const result=await page.evaluate(cultureData=>{
  const source=document.querySelector('.case-article');
  const clone=source.cloneNode(true);
  const originalButtons=[...source.querySelectorAll('button')];
  clone.querySelectorAll('button').forEach((button,i)=>{
   const style=getComputedStyle(originalButtons[i]);
   const div=document.createElement('div');
   for(const attr of button.attributes)if(!['type','tabindex','role','aria-haspopup','aria-expanded'].includes(attr.name))div.setAttribute(attr.name,attr.value);
   for(const prop of ['display','font','text-align','color','background-color','padding','border','box-sizing'])div.style.setProperty(prop,style.getPropertyValue(prop));
   div.innerHTML=button.innerHTML;button.replaceWith(div);
  });
  clone.querySelectorAll('iframe').forEach(el=>{const image=document.createElement('img');image.className='export-culture-image';image.alt='Cultural research — static view';image.src=cultureData;el.replaceWith(image);});
  clone.querySelectorAll('script,dialog,.cd-toolbar,.cd-mobile-hint,.sp-enlarge,.sp-interaction-guide,.sp-exhibit-caption,.case-next-chapter,.case-originals,.case-sources,.field-survey-note,.sp-floor figcaption,.cd-footer>a,.sp-footer>a').forEach(el=>el.remove());
  clone.querySelectorAll('a').forEach(el=>{const span=document.createElement('span');for(const a of el.attributes)if(!['href','target','rel'].includes(a.name))span.setAttribute(a.name,a.value);span.innerHTML=el.innerHTML;el.replaceWith(span);});
  clone.querySelectorAll('*').forEach(el=>{
   for(const a of [...el.attributes])if(a.name.startsWith('on')||['tabindex','role','aria-haspopup','aria-expanded','loading'].includes(a.name))el.removeAttribute(a.name);
   if(el.tagName==='IMG'){el.setAttribute('loading','eager');el.removeAttribute('srcset');}
  });
  return {html:clone.outerHTML,sections:[...clone.querySelectorAll(':scope>section[id]')].map(el=>el.id),css:[...document.querySelectorAll('link[rel=stylesheet]')].map(el=>new URL(el.href).pathname.slice(1))};
 },'data:image/png;base64,'+culture.toString('base64'));
 let html=result.html;
 for(const match of [...html.matchAll(/\b(src|href|poster)="([^"<>]+)"/g)]){
  if(match[2].startsWith('data:')||match[2].startsWith('#'))continue;
  html=html.replace(match[0],`${match[1]}="${await dataURI(match[2])}"`);
 }
 const css=(await Promise.all([...new Set(result.css)].map(inlineCSS))).join('\n');
 const document=`<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920"><title>齐文化典籍中心 · 静态排版</title><meta name="description" content="齐文化典籍中心完整项目页，1920px 静态排版，供 html2figma 导入。文字和图片保留独立元素，文化球以静态截图呈现。"><style>${css}\n${overrides}</style></head><body><main class="case-reader">${html}</main></body></html>`;
 await writeFile(file,document);
 // Check the exported file offline: no script, no server, no external asset requests.
 const check=await browser.newPage({viewport:{width:1920,height:1100}});
 const requests=[];check.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await check.goto(pathToFileURL(file).href,{waitUntil:'load',timeout:120000});
 await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode().catch(()=>{})));});
 const stats=await check.evaluate(()=>({images:document.images.length,broken:[...document.images].filter(im=>!im.complete||!im.naturalWidth).map(im=>im.alt),scripts:document.scripts.length,frames:document.querySelectorAll('iframe').length,buttons:document.querySelectorAll('button').length,photos:document.querySelectorAll('.cd-photo').length,sections:[...document.querySelectorAll('.case-article>section[id]')].map(el=>el.id),width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight}));
 assert.deepEqual(stats.broken,[]);assert.equal(stats.scripts,0);assert.equal(stats.frames,0);assert.equal(stats.buttons,0);assert.equal(stats.photos,33);assert.deepEqual(stats.sections,result.sections);assert.deepEqual(requests,[]);assert.equal(stats.width,1920);
 const diagrams=await check.locator('.sp-diagram').evaluateAll(nodes=>nodes.map(node=>{
  const drawing=node.querySelector('.sp-drawing'),child=drawing.querySelector('img'),box=drawing.getBoundingClientRect(),frame=node.getBoundingClientRect();
  return {width:box.width,height:box.height,frameWidth:frame.width,frameHeight:frame.height,imagePosition:getComputedStyle(child).position};
 }));
 assert.equal(diagrams.length,2);
 console.log({diagrams});
 for(const diagram of diagrams){assert.ok(Math.abs(diagram.width-diagram.frameWidth)<2);assert.ok(Math.abs(diagram.height-diagram.frameHeight)<2);assert.equal(diagram.imagePosition,'absolute');}
 for(let i=0;i<2;i++)await check.locator('.sp-diagram').nth(i).screenshot({path:path.join(root,`qa/project01-static-spatial-${i+1}.png`)});
 await check.screenshot({path:path.join(root,'qa/project01-static-top.png')});
 await check.locator('#case-delivery').screenshot({path:path.join(root,'qa/project01-static-construction.png')});
 console.log(JSON.stringify({file,megabytes:(Buffer.byteLength(document)/1024/1024).toFixed(1),...stats,externalRequests:requests.length},null,2));
}finally{await browser.close();}

