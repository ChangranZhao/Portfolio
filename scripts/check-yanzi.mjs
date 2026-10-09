import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1536,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({startup:false})));
 await page.goto('http://127.0.0.1:4173/#project=p1');if(await page.locator('.user-guide[open]').count())await page.keyboard.press('Escape');
 const card=page.locator('[data-case="yanzi"]');await card.waitFor({state:'attached'});assert.equal(await card.count(),1,'Page 7 must include a clickable Yan Zi case');await card.click();
 const reader=page.locator('.ex-yz-reader');await reader.waitFor();await page.evaluate(async()=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('en');document.dispatchEvent(new CustomEvent('portfolio-preferences'));});
 assert.match(await reader.innerText(),/Qwen2\.5/);assert.match(await reader.innerText(),/qwen2.5:0.5b/);assert.match(await reader.innerText(),/BlendShape/);
 assert.equal(await reader.locator('.yz-block').count(),7);await reader.locator('img').evaluateAll(async imgs=>{imgs.forEach(i=>i.loading='eager');await Promise.all(imgs.map(i=>i.decode()));});
 assert.equal(await reader.locator('img').evaluateAll(imgs=>imgs.filter(i=>!i.naturalWidth).length),0);
 await reader.locator('[data-yz-asset]').first().click();assert.equal(await reader.locator('.ex-asset-viewer').count(),1);await page.keyboard.press('Escape');assert.equal(await reader.locator('.ex-asset-viewer').count(),0);assert.equal(await reader.count(),1);
 await page.screenshot({path:'qa/yanzi-desktop.png'});
 await reader.locator('[data-yz-jump="yz-01"]').click();await page.screenshot({path:'qa/yanzi-system.png'});assert.match(await reader.locator('#yz-02').innerText(),/ConcurrentQueue<byte\[\]>/);await reader.locator('.ex-reader-body').evaluate(el=>el.scrollTop=0);
 await page.evaluate(async()=>{const {setGlobalLanguage}=await import('/localization.js');setGlobalLanguage('zh');document.dispatchEvent(new CustomEvent('portfolio-preferences'));});assert.match(await reader.innerText(),/语音/);
 await page.setViewportSize({width:390,height:844});assert.ok(await reader.evaluate(el=>el.scrollWidth<=el.clientWidth+2));await page.screenshot({path:'qa/yanzi-mobile.png'});
 await page.keyboard.press('Escape');assert.equal(await reader.count(),0);await card.click();assert.equal(await reader.count(),1);await reader.locator('.ex-close').click();assert.equal(await reader.count(),0);assert.deepEqual(errors,[]);
 console.log('Yan Zi: Page 7 entry, 7 sections, images, bilingual switch, lightbox, Escape, reopen and mobile checks passed.');
}finally{await browser.close();}


