import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await mkdir('qa',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});
const errors=[];const missing=[];
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400&&/construction/.test(r.url()))missing.push(r.url());});
try{
 await page.goto('http://127.0.0.1:4173/#project=p1');
 await page.locator('.user-guide[open]').waitFor();
 await page.keyboard.press('Escape');
 const section=page.locator('#case-delivery');
 await section.waitFor();
 await section.scrollIntoViewIfNeeded();
 await page.evaluate(async()=>{
  const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');
  await Promise.all([...document.querySelectorAll('.cd-photo image')].map(el=>new Promise((resolve,reject)=>{const image=new Image();image.onload=resolve;image.onerror=reject;image.src=el.getAttribute('href');})));
 });
 assert.equal(await section.locator('.cd-photo').count(),33);
 assert.equal(await section.locator('.cd-photo image').evaluateAll(images=>new Set(images.map(i=>i.getAttribute('href'))).size),33);
 for(const photo of await section.locator('.cd-photo').all()){
  await photo.scrollIntoViewIfNeeded();
  assert.ok(await photo.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}),'Each photograph must have an unobstructed clickable center');
 }
 await section.scrollIntoViewIfNeeded();
 await section.screenshot({path:'qa/construction-desktop.png'});
 await section.locator('[data-photo-index="0"]').click();
 assert.ok(await page.locator('#lightbox').evaluate(el=>el.open));
 assert.ok(await page.locator('#lightbox img').first().evaluate(img=>img.src.includes('construction-originals/01-01.jpg')));
 await page.keyboard.press('Escape');
 await section.locator('[data-photo-index="32"]').focus();await page.keyboard.press('Enter');
 assert.ok(await page.locator('#lightbox').evaluate(el=>el.open));
 await page.keyboard.press('Escape');
 await section.locator('[data-zoom="in"]').click();
 assert.equal(await section.locator('[data-zoom="reset"]').textContent(),'125%');
 await section.locator('[data-zoom="reset"]').click();
 await page.evaluate(async()=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('zh');});
 assert.equal(await section.locator('.cd-title').textContent(),'施工落地');
 await section.screenshot({path:'qa/construction-chinese.png'});
 await page.setViewportSize({width:390,height:844});
 await section.scrollIntoViewIfNeeded();
 const dimensions=await section.evaluate(el=>({width:el.getBoundingClientRect().width,scroll:el.querySelector('.cd-viewport').scrollWidth,view:el.querySelector('.cd-viewport').clientWidth,body:document.documentElement.scrollWidth}));
 assert.ok(dimensions.width<=390&&dimensions.body<=390,JSON.stringify(dimensions));
 assert.ok(dimensions.scroll>dimensions.view,JSON.stringify(dimensions));
 await section.locator('.cd-viewport').evaluate(el=>el.scrollLeft=el.scrollWidth);
 await page.screenshot({path:'qa/construction-mobile.png'});
 await section.locator('[data-photo-index="29"]').click();
 assert.ok(await page.locator('#lightbox').evaluate(el=>el.open));
 await page.keyboard.press('Escape');
 assert.deepEqual(missing,[]);assert.deepEqual(errors,[]);
 // A clean full-board export uses the same module and styles after the real page checks.
 await page.setViewportSize({width:1536,height:1200});
 await page.evaluate(async()=>{
  const {createConstructionTimeline}=await import('/project-construction.js');
  document.body.replaceChildren(createConstructionTimeline(()=>{}));
  document.body.style.cssText='margin:0;overflow:auto;display:block;height:auto;background:#050505';
  const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');
  await document.fonts.ready;
 });
 await page.locator('.cd-section').screenshot({path:'qa/construction-board.png'});
 console.log('PASS: 33 unique images; original-photo lightbox; keyboard activation; zoom; Chinese; 390px scrolling; no construction resource errors or page exceptions.');
}finally{await browser.close();}
