import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({channel:'msedge',headless:true});
try{
 for(const [locale,expected] of [['en-US','en'],['zh-CN','zh-CN'],['zh-TW','zh-Hant']]){
  const context=await browser.newContext({locale});
  await context.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({lang:'zh',startup:false})));
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173/');
  await page.waitForFunction(expected=>document.documentElement.lang===expected,expected);
  await page.locator('.guide-entry').click();
  await page.locator('.user-guide select').waitFor();
  assert.equal(await page.locator('.user-guide select').inputValue(),'system');
  if(locale==='en-US'){
   assert.match(await page.locator('.menu-left').innerText(),/ABOUT ME|About Me/);
   await page.locator('.user-guide select').selectOption('zh');
   assert.equal(await page.locator('html').getAttribute('lang'),'zh-CN');
   await page.locator('.user-guide select').selectOption('system');
   assert.equal(await page.locator('html').getAttribute('lang'),'en');
  }
  assert.deepEqual(errors,[]);console.log(locale+' passed');await context.close();
 }
}finally{await browser.close()}
