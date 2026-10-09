import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 for(const port of [4173,4174]){
  const page=await browser.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
  await page.goto(`http://127.0.0.1:${port}/#project=p2`);
  await page.locator('#space-page-1 iframe').waitFor();
  assert.equal(await page.locator('[id^="space-page-"] iframe').count(),8);
  for(let i=1;i<=8;i++){
   await page.locator(`#space-page-${i}`).scrollIntoViewIfNeeded();
   const f=page.frameLocator(`#space-page-${i} iframe`);
   await f.locator('.sheet').waitFor();
   assert.equal(await f.locator('.sheet').count(),1);
   await f.locator('body').evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(im=>im.decode()))});
   assert.equal(await f.locator('body').evaluate(()=>document.documentElement.scrollWidth>innerWidth+1),false);
  }
  await page.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));
  await page.keyboard.press('Escape');
  await page.locator('.case-window .case-chapters button').first().click({force:true});
  if(port===4173)await page.screenshot({path:'qa/space-integrated.png'});
  await page.locator('.case-window .maximize').click({force:true});
  await page.waitForFunction(()=>!!document.fullscreenElement||!!document.querySelector('.case-window.case-fullscreen'));
  assert.equal(errors.length,0,errors.join('\n'));
  console.log(port+': eight pages, images, navigation and fullscreen passed');
  await page.close();
 }
}finally{await browser.close()}



