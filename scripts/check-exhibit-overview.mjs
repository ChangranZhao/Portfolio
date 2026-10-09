import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1920,height:1200}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173/#project=p1');if(await page.locator('.user-guide[open]').count())await page.keyboard.press('Escape');
 const board=page.locator('.overview-board');await board.waitFor({state:'attached'});
 await page.evaluate(async()=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');});
 assert.equal(await page.locator('[data-overview-exhibit]').count(),20);assert.equal(await board.locator('img').count(),24);
 await board.locator('img').evaluateAll(async imgs=>{imgs.forEach(i=>i.loading='eager');await Promise.all(imgs.map(i=>i.decode()));});
 await board.scrollIntoViewIfNeeded();const box=await board.boundingBox();assert.ok(Math.abs(box.width/box.height-16/9)<.01);
 assert.equal(await board.locator('figcaption strong').evaluateAll(els=>els.filter(e=>e.scrollWidth>e.clientWidth+1).length),0);
 await board.screenshot({path:'qa/exhibit-overview-en.png'});
 await page.evaluate(async()=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('zh');});assert.match(await board.innerText(),/齐风民俗/);await board.screenshot({path:'qa/exhibit-overview-zh.png'});
 await page.setViewportSize({width:390,height:844});const mobile=await board.boundingBox();assert.ok(Math.abs(mobile.width/mobile.height-16/9)<.01);assert.deepEqual(errors,[]);
 console.log('20 exhibits, 24 loaded photographs, 16:9 desktop/mobile and bilingual labels passed.');
}finally{await browser.close();}
