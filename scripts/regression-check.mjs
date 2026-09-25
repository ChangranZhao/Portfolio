import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'});
const failures=[];
async function check(name,fn){try{await fn();console.log('PASS '+name);}catch(e){failures.push(name);console.log('FAIL '+name+': '+e.message);}}
await page.goto('http://127.0.0.1:4173');
await check('restored maximized window fits a smaller viewport',async()=>{
 await page.getByRole('button',{name:'Open MIMESIS—The Shape of AI',exact:true}).click();
 await page.getByRole('button',{name:'Maximize MIMESIS — The Shape of AI',exact:true}).click();
 await page.setViewportSize({width:800,height:750});
 await page.getByRole('button',{name:'Restore MIMESIS — The Shape of AI',exact:true}).click();
 const b=await page.locator('.window').boundingBox();assert.ok(b.x>=0&&b.x+b.width<=800,JSON.stringify(b));
});
await page.setViewportSize({width:1440,height:900});await page.reload();
await check('desktop entry switches an existing About view back to Gallery',async()=>{
 await page.getByRole('button',{name:'Open MIMESIS—The Shape of AI',exact:true}).click();
 await page.getByRole('button',{name:'About',exact:true}).click();
 await page.getByRole('button',{name:'Minimize MIMESIS — The Shape of AI',exact:true}).click();
 await page.getByRole('button',{name:'Open MIMESIS—The Shape of AI',exact:true}).click();
 assert.equal(await page.locator('.gallery-view').isVisible(),true);
});
await check('restored gallery receives keyboard focus',async()=>{
 await page.getByRole('button',{name:'Gallery',exact:true}).click();
 await page.getByRole('button',{name:'Minimize MIMESIS — The Shape of AI',exact:true}).click();
 await page.getByRole('button',{name:'Restore MIMESIS — The Shape of AI',exact:true}).click();
 await page.keyboard.press('ArrowRight');assert.match(await page.locator('.counter').textContent(),/^02/);
});
await page.setViewportSize({width:768,height:900});await page.reload();
await check('Dock provides scroll access to overflowing minimized windows',async()=>{
 for(const name of ['Figma','Illustrator','Cursor','Unity','Photos']){
   await page.getByRole('button',{name:'Open '+name,exact:true}).click();
   await page.locator('.window:visible .minimize').last().click();
 }
 const reachable=await page.locator('.dock').evaluate(d=>{
   const restore=d.querySelector('.dock-restores');
   return d.scrollWidth<=d.clientWidth||['auto','scroll'].includes(getComputedStyle(d).overflowX)||(['auto','scroll'].includes(getComputedStyle(restore).overflowX)&&restore.getBoundingClientRect().right<=innerWidth);
 });assert.equal(reachable,true);
});
await browser.close();if(failures.length)process.exitCode=1;
