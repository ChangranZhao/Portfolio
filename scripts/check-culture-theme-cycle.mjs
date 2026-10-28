import {createRequire} from 'node:module';import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const browser=await chromium.launch({headless:true,channel:'msedge'});
try{const p=await browser.newPage({viewport:{width:1600,height:1200},reducedMotion:'reduce'});await p.clock.install();await p.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({languageMode:'en',motion:true})));await p.goto('http://127.0.0.1:4173/culture.html');await p.locator('.theme-node').first().waitFor();await p.waitForFunction(()=>document.querySelector('.knowledge-graph').getBoundingClientRect().height>0);await p.clock.pauseAt(await p.evaluate(()=>Date.now()+200));
const host=async(active)=>p.evaluate(active=>window.dispatchEvent(new MessageEvent('message',{source:window,origin:location.origin,data:{type:'portfolio-culture-active',active}})),active);
const state=()=>p.locator('.theme-node').evaluateAll(els=>els.findIndex(e=>e.getAttribute('aria-pressed')==='true'));
assert.equal(await p.locator('.theme-action,.theme-instruction').count(),0);await host(false);await host(true);assert.equal(await state(),-1);
await p.clock.runFor(4999);assert.equal(await state(),-1);await p.clock.runFor(1);assert.equal(await state(),0);
for(const next of [1,2,3,-1]){await p.clock.runFor(1999);assert.notEqual(await state(),next);await p.clock.runFor(1);assert.equal(await state(),next);}
assert.equal(await p.locator('.photo-card.dimmed').count(),0);await p.clock.runFor(4999);assert.equal(await state(),-1);await p.clock.runFor(1);assert.equal(await state(),0);
await host(false);await p.clock.runFor(20000);assert.equal(await state(),-1);await host(true);await p.clock.runFor(5000);assert.equal(await state(),0);
await p.locator('.theme-node').nth(2).dispatchEvent('click');assert.equal(await state(),2);await p.clock.runFor(4999);assert.equal(await state(),2);await p.clock.runFor(1);assert.equal(await state(),0);
await host(false);await p.screenshot({path:'qa/culture-restored.png'});console.log('Passed: original clean cards; 5s wait, 4 × 2s themes, all-on 5s repeat; offscreen pause/restart and manual selection.');}finally{await browser.close();}

