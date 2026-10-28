import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try {
 for(const reducedMotion of ['no-preference','reduce']) {
  const p=await browser.newPage({viewport:{width:1600,height:1000},reducedMotion});
  await p.route('**/flow-check',r=>r.fulfill({contentType:'text/html',body:'<link rel="stylesheet" href="/project-field-research.css"><body style="margin:0;background:#080808"><div style="height:1500px"></div></body>'}));
  await p.goto('http://127.0.0.1:4173/flow-check');
  await p.evaluate(async()=>{const {createFieldResearch}=await import('/project-field-research.js');document.body.append(createFieldResearch(()=>{}));});
  const selector='.field-themes > p,.field-convergence,.field-planes > span,.field-planes > svg';
  const items=p.locator(selector);
  assert.equal(await items.count(),10);
  if(reducedMotion==='no-preference') {
   assert.equal(await items.first().evaluate(e=>getComputedStyle(e).opacity),'0');
   const transform=await p.locator('.field-planes > span').first().evaluate(e=>getComputedStyle(e).transform);
   await p.locator('.field-content-flow').scrollIntoViewIfNeeded();
   await p.waitForFunction(()=>document.querySelector('.field-themes > p').getAnimations().length>0);
   assert.deepEqual(await items.evaluateAll(els=>els.map(e=>e.getAnimations()[0]?.effect.getTiming().delay)),[120,480,840,1200,1600,2100,2460,2820,3180,3640]);
   assert.equal(await p.locator('.field-planes > span').first().evaluate(e=>getComputedStyle(e).transform),transform);
   await p.waitForFunction(s=>[...document.querySelectorAll(s)].every(e=>getComputedStyle(e).opacity==='1'&&!e.getAnimations().length),selector);
   await p.locator('.field-content-flow').screenshot({path:'qa/field-flow-revealed.png'});
   await p.evaluate(()=>scrollTo(0,0));await p.locator('.field-content-flow').scrollIntoViewIfNeeded();
   assert.equal(await items.evaluateAll(els=>els.flatMap(e=>e.getAnimations()).length),0);
  } else assert.ok(await items.evaluateAll(els=>els.every(e=>getComputedStyle(e).opacity==='1')));
  await p.close();
 }
 console.log('Passed: themes then convergence then planes; perspective preserved; once-only reveal and reduced motion.');
} finally {await browser.close();}
