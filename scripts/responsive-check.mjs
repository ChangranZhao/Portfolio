import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:4173');
 await page.getByRole('button',{name:'Browse all portfolio projects',exact:true}).click();
 const collection=page.locator('.window[data-window-id="projects"]');
 const original=await collection.boundingBox();
 await collection.locator('.maximize').click();
 await page.setViewportSize({width:820,height:650});
 await collection.locator('.maximize').click();
 await page.setViewportSize({width:1440,height:900});
 await page.waitForFunction(()=>document.querySelector('.window[data-window-id=projects]').getBoundingClientRect().width===900);
 const restored=await collection.boundingBox();assert.equal(restored.width,original.width);assert.equal(restored.height,original.height);
 console.log('PASS normal window dimensions survive viewport shrink, maximize and restore');
 for(const size of [{width:1440,height:900},{width:820,height:650},{width:390,height:844},{width:667,height:375}]){
  await page.setViewportSize(size);await page.reload();
  await page.evaluate(async()=>{
   const {hideAll}=await import('./windows.js');
   const triggers=[...document.querySelectorAll('.desktop-icon'),...document.querySelectorAll('#dock>button'),...document.querySelectorAll('[data-action]')];
   for(const b of triggers){b.click();hideAll();}
  });
  const ids=await page.locator('.window').evaluateAll(nodes=>nodes.map(n=>n.dataset.windowId));
  assert.ok(ids.length>=20,`Only ${ids.length} windows were exercised`);
  for(const id of ids){
   const win=page.locator(`.window[data-window-id="${id}"]`);
   if(await win.evaluate(e=>getComputedStyle(e).display==='none'&&e.classList.contains('workspace-sticker')))continue;
   await page.evaluate(async id=>(await import('./windows.js')).focusWindow(id),id);
   await win.locator('.maximize').click();
   await page.waitForFunction(id=>{const e=document.querySelector(`.window[data-window-id="${id}"]`);return e.classList.contains('maximized')&&e.getBoundingClientRect().width>=innerWidth-18;},id);
   const bounds=await win.boundingBox();
   assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=size.width+1&&bounds.y+bounds.height<=size.height+1,`${id} outside viewport ${JSON.stringify(bounds)}`);
   assert.ok(bounds.width>=size.width-18,`${id} failed to maximize ${JSON.stringify(bounds)} ${await win.getAttribute("class")}`);
   const overflow=await win.locator('.window-body').evaluate(e=>e.scrollWidth>e.clientWidth+1);
   assert.equal(overflow,false,`${id} body overflows at ${size.width}`);
   await win.locator('.maximize').click();
   await page.evaluate(async id=>(await import('./windows.js')).minimizeWindow(id),id);
  }
  console.log(`PASS ${ids.length} window types maximize, restore and fit at ${size.width}×${size.height}`);
 }
 assert.deepEqual(errors,[]);console.log('PASS no browser runtime errors');
}finally{await browser.close();}
