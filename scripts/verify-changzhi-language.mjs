import {createRequire} from 'node:module';
const require=createRequire('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json');
const {chromium}=require('playwright');const browser=await chromium.launch({headless:true,channel:"chrome"});const page=await browser.newPage();
await page.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({languageMode:'en'})));
await page.goto('http://127.0.0.1:4173/#project=p6');await page.waitForTimeout(3000);
console.log('lang',await page.locator('html').getAttribute('lang'));
console.log('frames',page.frames().length);
for(const f of page.frames().slice(1,3))console.log(f.url(),(await f.locator('body').innerText()).slice(0,450));
await browser.close();

