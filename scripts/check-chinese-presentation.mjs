import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()>=400)errors.push(r.url());});
const base=process.env.QA_BASE||'http://127.0.0.1:4173';await page.goto(base+'/cultural-digitalization.html',{waitUntil:'networkidle'});
assert.equal(await page.locator('.cd-nav').innerText().then(t=>/[a-zA-Z]{3}/.test(t)),false);
const sources=await page.locator('[data-board-frame]').evaluateAll(frames=>frames.map(f=>f.src));assert.equal(sources.length,16);
const board=await browser.newPage({viewport:{width:1920,height:1080}});
for(const source of sources){await board.goto(source,{waitUntil:'networkidle'});assert.equal(await board.locator('html').getAttribute('lang'),'zh-CN');assert.equal(/[a-zA-Z]{3}/.test(await board.locator('main').innerText()),false,source);await board.locator('img').evaluateAll(images=>Promise.all(images.map(i=>i.decode())));if(source.includes('928-853'))await board.screenshot({path:'qa/cultural-digitalization/chinese-cover.png'});}
await page.goto(base+'/zibo.html',{waitUntil:'networkidle'});await page.waitForTimeout(300);assert.match(await page.locator('.case-hero h1').innerText(),/风从东方来/);
assert.equal((await page.locator('.case-article').innerText()).includes('Digital Exhibition Design'),false);
await browser.close();assert.deepEqual(errors,[]);console.log('Chinese shell, all 16 Chinese boards with decoded images, and Chinese Zibo content passed.');
