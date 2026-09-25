import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'});
const page=await browser.newPage({viewport:{width:1600,height:1000},reducedMotion:'reduce'});
const failures=[];
async function check(name,fn){try{await fn();console.log('PASS '+name);}catch(e){failures.push(name);console.log('FAIL '+name+': '+e.message.split('\n')[0]);}}
await page.goto('http://127.0.0.1:4173');
await check('top controls use inset rounded highlighting',async()=>{
 const b=page.locator('.menu-secondary');await b.hover();const v=await b.evaluate(e=>({radius:parseFloat(getComputedStyle(e).borderRadius),height:e.offsetHeight,bar:e.closest('header').offsetHeight}));assert.ok(v.radius>=4&&v.height<v.bar,JSON.stringify(v));
});
await check('personal SVG is used in the menu and favicon',async()=>{
 assert.equal(await page.locator('#brand-menu img').count(),1);const source=await readFile('../素材/personal_logo/ps_logo.svg');assert.deepEqual(await readFile('dist/assets/personal-logo.svg'),source);assert.deepEqual(await readFile('dist/favicon.svg'),source);
});
await check('new Dock assets preserve supplied icon pixels',async()=>{
 assert.ok((await readFile('dist/assets/dock-figma.png')).equals(await readFile('../素材/icon/figma.png')));assert.equal(await page.getByRole('button',{name:'Open ChatGPT',exact:true}).count(),1);
});
await check('About launches only the profile and title windows',async()=>{
 await page.locator('.menubar .brand-name').click();
 assert.equal(await page.locator('.window:not(.workspace-sticker):not(.closing)').count(),1);
 assert.equal(await page.getByRole('heading',{name:'COMMERCIAL PROJECT',exact:true}).count(),1);
 assert.equal(await page.getByRole('heading',{name:'PAPER PUBLICATION',exact:true}).count(),0);
 await page.locator('.menubar .brand-name').click();assert.equal(await page.locator('.window:not(.workspace-sticker):not(.closing)').count(),1);
});
await check('CONTENT reaches all ten actual projects',async()=>{
 await page.getByRole('button',{name:'Browse all portfolio projects',exact:true}).click();
 assert.equal(await page.locator('.project-card').count(),10);
 await page.locator('.project-card').filter({hasText:'SPACE CHRONICLES'}).click();
 await page.getByRole('dialog',{name:'SPACE CHRONICLES',exact:true}).waitFor();
 await page.getByRole('button',{name:'Close SPACE CHRONICLES',exact:true}).click();
});
await check('research menu focuses publications and scrolls into view',async()=>{
 await page.getByRole('button',{name:'Open portfolio menu'}).click();await page.getByRole('menuitem',{name:/UIST POSTER/}).click();
 const section=page.locator('#profile-publications');assert.equal(await section.count(),1);assert.equal(await section.isVisible(),true);
 const id=await page.evaluate(()=>document.activeElement?.closest('.window')?.dataset.windowId);assert.equal(id,'profile-research');
});
await check('research and website controls retain their own selected state',async()=>{
 await page.locator('.menu-research').click();assert.equal(await page.locator('.menu-research').getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'About this website',exact:true}).click();assert.equal(await page.locator('.wifi').getAttribute('aria-pressed'),'true');
 await page.getByRole('button',{name:'Close About this website',exact:true}).click();
});
await page.setViewportSize({width:390,height:844});await page.reload();
await check('mobile menu hides long desktop-only labels',async()=>{
 assert.equal(await page.locator('.menu-research').isVisible(),false);
 assert.equal(await page.locator('.menu-secondary').isVisible(),false);
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
});
await check('mobile About has navigable sections without overflow',async()=>{
 await page.locator('.menubar .brand-name').click();
 assert.equal(await page.locator('.profile-board').isVisible(),true);
 const nav=page.locator('.profile-board .workspace-navigation');await nav.getByRole('button',{name:'Exhibitions & papers',exact:true}).click();
 assert.equal(await page.locator('.research-board').isVisible(),true);
 const overflow=await page.locator('.research-board').evaluate(e=>e.scrollWidth>e.clientWidth+1);assert.equal(overflow,false);
});
await check('keyboard focus raises an obscured window without stealing control focus',async()=>{
 await page.locator('.research-board .workspace-navigation').getByRole('button',{name:'About me',exact:true}).click();
 const close=page.getByRole('button',{name:'Close Changran Zhao / Exhibitions & Papers',exact:true});await close.focus();
 assert.equal(await close.evaluate(e=>e===document.activeElement),true);
 assert.equal(await page.locator('[data-window-id="profile-research"]').evaluate(e=>e.classList.contains('inactive')),false);
});
await browser.close();if(failures.length)process.exitCode=1;
