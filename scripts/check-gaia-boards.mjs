import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1920,height:1080}});await mkdir('qa/gaia',{recursive:true});
for(const id of ['2001-722','2001-975','2001-1167','2001-1313','2009-2','2001-1506']){
 await page.goto('http://127.0.0.1:4173/gaia-boards/'+id+'.html');
 await page.evaluate(async()=>{window.loc=(await import('/gaia-language.js')).localizeGaia;window.loc(document,'en')});
 await page.evaluate(()=>Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{})})));await page.screenshot({path:'qa/gaia/'+id+'-en.png'});
 console.log(id,JSON.stringify(await page.evaluate(()=>[...document.querySelectorAll('p,[data-node-id]')].filter(e=>!e.children.length&&e.getBoundingClientRect().height&&/[\u3400-\u9fff]/.test(e.textContent)).map(e=>e.textContent.trim()))));
 console.log('images',await page.evaluate(()=>[...document.images].filter(i=>!i.complete||!i.naturalWidth).map(i=>i.src)));
 await page.evaluate(()=>loc(document,'zh-Hant'));await page.screenshot({path:'qa/gaia/'+id+'-hant.png'});
}
await browser.close();
