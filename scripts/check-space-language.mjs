import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 const page=await browser.newPage({locale:'en-US',viewport:{width:1680,height:1050}});
 await page.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({languageMode:'system',startup:false})));
 await page.goto('http://127.0.0.1:4173/#project=p2');
 for(let i=1;i<=8;i++){
  await page.locator(`#space-page-${i}`).scrollIntoViewIfNeeded();
  const f=page.frameLocator(`#space-page-${i} iframe`);
  await f.locator('html[lang="en"]').waitFor();
  await f.locator('body').evaluate(()=>document.fonts.ready);
  assert.equal(/[\u4e00-\u9fff]/.test(await f.locator('body').innerText()),false,`page ${i} Chinese text`);
  const clipped=await f.locator('.panel').evaluateAll(es=>es.filter(e=>e.scrollHeight>e.clientHeight+1).map(e=>e.innerText));
  assert.deepEqual(clipped,[],`page ${i} clipped panels`);
  if(i===3||i===4||i===5)await f.locator('.sheet').screenshot({path:`qa/space-en-${i}.png`});
 }
 await page.evaluate(async()=>{const {openGuide}=await import('./user-guide.js');openGuide()});
 await page.locator('.user-guide select').selectOption('zh');
 const f=page.frameLocator('#space-page-2 iframe');
 await f.locator('html[lang="zh-CN"]').waitFor();
 assert.match(await f.locator('.heading').innerText(),/当距离/);
 await page.locator('.user-guide select').selectOption('system');
 await f.locator('html[lang="en"]').waitFor();
 assert.match(await f.locator('.heading').innerText(),/When distance/);
 console.log('All eight pages English; main-site language switching synchronized.');
}finally{await browser.close()}
