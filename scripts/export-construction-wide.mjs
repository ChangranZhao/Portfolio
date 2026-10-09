import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root=fileURLToPath(new URL('../',import.meta.url)),dist=path.join(root,'dist'),file=path.resolve(root,'../导出/HTML/Project01/齐文化典籍中心_Construction_16比9_分层.html');
const mime={'.webp':'image/webp','.png':'image/png','.woff2':'font/woff2','.ttf':'font/ttf'};
async function embed(url){if(url.startsWith('data:'))return url;const f=path.resolve(dist,url);assert.ok(f.startsWith(dist+path.sep));return `data:${mime[path.extname(f)]};base64,${(await readFile(f)).toString('base64')}`;}
let css=await readFile(path.join(dist,'construction-board.css'),'utf8');
css+=`html,body{width:1920px;height:1080px;min-width:1920px;margin:0;background:#050505;overflow:hidden}.cd-section{position:relative;width:1920px;height:1080px;padding:0}.cd-viewport{position:relative;width:1920px;height:1020px;overflow:hidden}.cd-canvas{width:1920px;height:1020px;min-width:0}.cd-footer{height:60px;padding:16px 0;margin:0 40px;font:12px Arial;letter-spacing:.4px}.cd-canvas text{font-family:Arial,sans-serif}.cd-title{font-size:26px}.cd-subtitle{font-size:15px}*{cursor:default!important;pointer-events:none!important}`;
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
const page=await browser.newPage({viewport:{width:1920,height:1080}});await page.goto('http://127.0.0.1:4173/culture.html');
await page.evaluate(async()=>{const {createConstructionTimeline}=await import('/construction-board.js');document.querySelectorAll('style,link[rel=stylesheet]').forEach(n=>n.remove());document.body.replaceChildren(createConstructionTimeline(()=>{}));document.querySelectorAll('.cd-toolbar,.cd-mobile-hint,.cd-sr-only,.cd-footer a').forEach(n=>n.remove());});
await page.addStyleTag({content:css});
await page.evaluate(()=>{
 const svg=document.querySelector('.cd-canvas'),ns=svg.namespaceURI,sy=1020/1440;
 // Use the ground's two axes for every photo, then derive all guides from
 // the actual photo corners rather than retaining the former panel geometry.
 const guides=[...svg.querySelectorAll('.cd-guide-set')];
 const line=(a,b)=>`M${a[0]},${a[1]} L${b[0]},${b[1]}`;
 for(const [index,node] of [...svg.querySelectorAll('.cd-photo')].entries()){
  const old=node.transform.baseVal.consolidate().matrix,flat=Math.abs(old.c)>.01,side=!flat&&old.b>0;
  const m={a:(flat?1.17:side?.83:1)*.82,b:(flat?-.37:side?.62:-.37/1.17)*.82,c:flat?.83*.82:0,d:flat?.62*.82:.82/sy,e:old.e,f:old.f};
  node.setAttribute('transform',`matrix(${m.a},${m.b},${m.c},${m.d},${m.e},${m.f})`);
  const rect=node.querySelector('rect'),w=Number(rect.getAttribute('width')),h=Number(rect.getAttribute('height'));
  const left=[m.c*h+m.e,m.d*h+m.f],right=[m.a*w+left[0],m.b*w+left[1]],record=node.closest('.cd-record');
  const lift=flat?20:record.classList.contains('cd-depth-back')?125:record.classList.contains('cd-depth-front')?82:105;
  const a=[left[0],left[1]+lift],b=[right[0],right[1]+lift],off=[36,36*.62/.83],c=[b[0]+off[0],b[1]+off[1]],d=[a[0]+off[0],a[1]+off[1]];
  const guide=guides[index],vertical=guide.querySelectorAll('.cd-guide-vertical path');vertical[0].setAttribute('d',line(left,a));vertical[1].setAttribute('d',line(right,b));
  const footprint=guide.querySelector('.cd-guide-footprint');footprint.querySelector('polygon').setAttribute('points',[a,b,c,d].map(p=>p.join(',')).join(' '));
  const diagonals=footprint.querySelectorAll('path');diagonals[0].setAttribute('d',line(a,c));diagonals[1].setAttribute('d',line(b,d));
  const center=[(a[0]+c[0])/2,(a[1]+c[1])/2],r=600/1820,t=(1150-r*(center[0]-50)-center[1])/(.62+r*.83),rail=[center[0]+.83*t,center[1]+.62*t];
  guide.querySelector('.cd-guide-link path').setAttribute('d',line(center,rail));const dot=guide.querySelector('circle');dot.setAttribute('cx',rail[0]);dot.setAttribute('cy',rail[1]);
  guide.querySelector('.cd-guide-cross').innerHTML=[a,b].map(p=>`<path d="${line([p[0]-4,p[1]],[p[0]+4,p[1]])} ${line([p[0],p[1]-4],[p[0],p[1]+4])}"/>`).join('');
  record.querySelectorAll('.cd-drop,.cd-contact').forEach(n=>n.remove());
  const label=record.querySelector('.cd-photo-id');label.setAttribute('x',left[0]);label.setAttribute('y',Math.max(left[1],right[1])+17/sy);
 }
 for(const node of svg.querySelectorAll('text')){const x=Number(node.getAttribute('x')||0),y=Number(node.getAttribute('y')||0);node.setAttribute('transform',`translate(${x} ${y}) scale(1 ${1/sy}) translate(${-x} ${-y})`);}
 const group=document.createElementNS(ns,'g');group.setAttribute('transform',`scale(1 ${sy})`);for(const node of [...svg.children])if(node.tagName!=='defs')group.append(node);svg.append(group);svg.setAttribute('viewBox','0 0 1920 1020');
});
const result=await page.evaluate(()=>{
 const root=document.querySelector('.cd-section'),clone=root.cloneNode(true),host=clone.querySelector('.cd-viewport'),origin=root.getBoundingClientRect();
 root.querySelectorAll('svg image').forEach((source,i)=>{
  const m=source.getScreenCTM().translate(source.x.baseVal.value,source.y.baseVal.value),img=document.createElement('img');
  img.className=source.closest('.cd-photo')?'construction-photo-layer':'construction-person-layer';img.src=source.href.baseVal;img.alt=source.closest('.cd-photo')?.getAttribute('aria-label')||`Scale figure ${i}`;
  img.style.cssText=`position:absolute;left:0;top:0;width:${source.width.baseVal.value}px;height:${source.height.baseVal.value}px;object-fit:contain;transform-origin:0 0;transform:matrix(${m.a},${m.b},${m.c},${m.d},${m.e-origin.x},${m.f-origin.y});`;host.append(img);
 });
 clone.querySelectorAll('svg image').forEach(n=>n.remove());clone.querySelectorAll('[tabindex],[role]').forEach(n=>{n.removeAttribute('tabindex');n.removeAttribute('role');});return clone.outerHTML;
});
let html=result;for(const m of [...html.matchAll(/\bsrc="([^"]+)"/g)])html=html.replace(m[0],`src="${await embed(m[1])}"`);
await writeFile(file,`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=1920"><title>Qi Culture Classics Center — Construction</title><style>${css}</style></head><body>${html}</body></html>`);
const check=await browser.newPage({viewport:{width:1920,height:1080}});await check.goto(pathToFileURL(file).href);await check.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(n=>n.decode()));});
const stats=await check.evaluate(()=>({width:document.documentElement.scrollWidth,height:document.documentElement.scrollHeight,photos:document.querySelectorAll('.construction-photo-layer').length,svgImages:document.querySelectorAll('svg image').length,broken:[...document.images].filter(n=>!n.naturalWidth).length,scripts:document.scripts.length}));assert.equal(stats.width,1920);assert.equal(stats.height,1080);assert.equal(stats.photos,33);assert.equal(stats.svgImages,0);assert.equal(stats.broken,0);assert.equal(stats.scripts,0);
await check.screenshot({path:path.join(root,'qa/construction-wide-export.png')});console.log(JSON.stringify({file,...stats},null,2));
}finally{await browser.close();}
