import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist');
const destination=path.resolve(root,'../导出/HTML/Project02');
await mkdir(destination,{recursive:true});await mkdir(path.join(root,'qa/spectral-editorial'),{recursive:true});
const mime={'.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml','.woff2':'font/woff2','.ttf':'font/ttf'};
const cache=new Map();
async function embed(src){const rel=src.startsWith('http')?decodeURIComponent(new URL(src).pathname.slice(1)):src;const file=path.resolve(dist,rel);assert(file.startsWith(dist+path.sep));if(!cache.has(file))cache.set(file,'data:'+mime[path.extname(file)]+';base64,'+(await readFile(file)).toString('base64'));return cache.get(file);}
let css='';for(const name of ['spectral-fluid.css','spectral-concept.css','spectral-editorial.css','spectral-form-research.css','spectral-function.css']){let value=await readFile(path.join(dist,name),'utf8');for(const m of [...value.matchAll(/url\(['"]?([^)'"\s]+)['"]?\)/g)])value=value.replace(m[0],`url("${await embed(m[1])}")`);css+='\n'+value;}
css+=`\nhtml,body{margin:0;padding:0;background:#e8e8e8;color:#171717}*{box-sizing:border-box}button{font:inherit;color:inherit}.sf-book{container-type:inline-size;width:1920px;margin:auto;background:#fff}.sf-page{break-after:page;page-break-after:always}.sf-page:last-child{break-after:auto}.sf-art{cursor:default!important}a{color:inherit}.sf-book *{animation:none!important;transition:none!important}.sf-cover-page{height:56.25cqw}.sf-page h4{font-family:inherit}@page{size:1920px 1080px;margin:0}@media print{html,body{background:white}.sf-book{margin:0}.sf-page{border:0;print-color-adjust:exact;-webkit-print-color-adjust:exact}}`;
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
const p=await browser.newPage({viewport:{width:1920,height:1100},reducedMotion:'reduce'});await p.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({languageMode:'en',startup:false})));
await p.goto('http://127.0.0.1:4173/#project=p3');await p.locator('#sf-concept').waitFor();
for(const [lang,file] of [['en','index.html'],['zh','灵韵光谱_中文静态排版.html']]){
 await p.evaluate(async lang=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage(lang);await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));},lang);
 const sources=await p.locator('.sf-book img').evaluateAll(imgs=>imgs.map(i=>i.getAttribute('src')));const mapping={};for(const src of new Set(sources))mapping[src]=await embed(src);
 const html=await p.locator('.sf-book').evaluate((book,mapping)=>{const clone=book.cloneNode(true);clone.querySelectorAll('img').forEach(i=>{i.src=mapping[i.getAttribute('src')];i.loading='eager';i.removeAttribute('srcset')});clone.querySelectorAll('button').forEach(b=>{const d=document.createElement('div');d.className=b.className;d.innerHTML=b.innerHTML;b.replaceWith(d)});clone.querySelectorAll('*').forEach(e=>{for(const a of [...e.attributes])if(a.name.startsWith('data-')||a.name.startsWith('on')||['tabindex','fetchpriority'].includes(a.name))e.removeAttribute(a.name)});return clone.outerHTML;},mapping);
 const output=path.join(destination,file);await writeFile(output,`<!doctype html><html lang="${lang==='en'?'en':'zh-CN'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920"><title>Spectral Fluid — ${lang==='en'?'Editorial Portfolio':'灵韵光谱静态排版'}</title><style>${css}</style></head><body>${html}</body></html>`);
 const check=await browser.newPage({viewport:{width:1920,height:1100}});let requests=[];check.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});await check.goto(pathToFileURL(output).href);await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode()))});assert.equal(await check.locator('.sf-page').count(),14);assert.equal(await check.locator('script').count(),0);assert.deepEqual(requests,[]);
 const issues=await check.locator('.sf-page').evaluateAll(pages=>pages.flatMap(e=>{const r=e.getBoundingClientRect(),footer=e.querySelector('.sf-footer,.sr-footer,.sc-footer')?.getBoundingClientRect();return [...e.querySelectorAll('h2,h3,h4,p')].filter(n=>{const x=n.getBoundingClientRect();return x.right>r.right+2||x.bottom>r.bottom+2||(footer&&!n.closest('footer')&&x.bottom>footer.top+2)}).map(n=>({page:e.id,text:n.textContent.slice(0,70)}))}));
 console.log(lang,JSON.stringify({pages:14,images:sources.length,offline:true,layoutIssues:issues}));
 for(const [i,section] of (await check.locator('.sf-page').all()).entries())await section.screenshot({path:path.join(root,'qa/spectral-editorial',`${lang}-${String(i).padStart(2,'0')}.png`)});
 await check.close();assert.deepEqual(issues,[],'Text must remain inside each slide');
}
await copyFile(path.join(dist,'assets/spectral/concept/OFL.txt'),path.join(destination,'OFL-Anton.txt'));
await writeFile(path.join(destination,'阅读说明.txt'),'Spectral Fluid / 灵韵光谱\n\nindex.html：英文静态排版\n灵韵光谱_中文静态排版.html：中文静态排版\n\n共14页，包含封面，每页1920 × 1080（16:9）。图片、字体与样式已内嵌；可直接双击打开，不需要本地服务器或网络。\n原生文字与矢量图保留，不是整页截图。网页操作按钮已移除，来源链接保留。\n浏览器打印时选择背景图形，缩放100%，关闭页眉页脚。\n研究案例图片来源与署名见相应页。Anton字体许可证附于同目录。\n');
console.log('Exported to '+destination);
}finally{await browser.close();}
