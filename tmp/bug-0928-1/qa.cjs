const {chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge'});
 const page=await browser.newPage({viewport:{width:1600,height:1200},deviceScaleFactor:1});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('portfolio-preferences',JSON.stringify({startup:false,lang:'en'})));
 await page.goto('http://127.0.0.1:4173/#project=p1');
 await page.locator('#case-interview').waitFor();
 await page.locator('#main-menu').evaluate(e=>e.hidden=true);
 assert.equal(await page.locator('.field-interview-photo').count(),2);
 assert.equal(await page.locator('.field-dialogue').count(),3);
 assert.equal(await page.locator('.sp-interaction-guide').count(),2);
 await page.locator('#case-interview').scrollIntoViewIfNeeded();
 await page.locator('.field-interview-photo img').first().evaluate(img=>img.scrollIntoView({block:'center'}));
 await page.waitForFunction(()=>[...document.querySelectorAll('.field-interview-photo img')].every(img=>img.complete&&img.naturalWidth>0));
 const images=await page.locator('.field-interview-photo img').evaluateAll(nodes=>nodes.map(n=>({src:n.currentSrc,loaded:n.complete&&n.naturalWidth>0})));
 assert(images.every(i=>i.loaded),JSON.stringify(images));
 await page.locator('#case-interview').screenshot({path:'tmp/bug-0928-1/field-desktop.png'});
 await page.locator('#case-narrative .sp-floor').first().screenshot({path:'tmp/bug-0928-1/floor-desktop.png'});
 for(const lang of ['zh','en']){
  await page.evaluate(async lang=>{const m=await import('/localization.js');m.setGlobalLanguage(lang);document.dispatchEvent(new Event('portfolio-preferences'));},lang);
  await page.waitForTimeout(150);
  const guide=await page.locator('.sp-interaction-guide').first().innerText();
  const question=await page.locator('.field-question').first().innerText();
  const photoLabel=await page.locator('.field-interview-photo figcaption').first().innerText();
  if(lang==='zh'){assert.match(guide,/点击白色节点/);assert.match(question,/故事如何串联/);assert.match(photoLabel,/现场讨论/)}
  else {assert.match(guide,/SELECT THE WHITE POINTS/);assert.match(question,/How do the stories connect/);assert.match(photoLabel,/SITE DISCUSSION/)}
  console.log(lang,{guide,question});
 }
 await page.setViewportSize({width:390,height:844});
 await page.waitForTimeout(300);
 await page.locator('#case-interview').screenshot({path:'tmp/bug-0928-1/field-mobile.png'});
 await page.locator('.field-interview').screenshot({path:'tmp/bug-0928-1/interview-mobile.png'});
 await page.locator('#case-narrative .sp-floor').first().screenshot({path:'tmp/bug-0928-1/floor-mobile.png'});
 const widths=await page.evaluate(()=>({field:[document.querySelector('#case-interview').clientWidth,document.querySelector('#case-interview').scrollWidth],spatial:[document.querySelector('#case-narrative').clientWidth,document.querySelector('#case-narrative').scrollWidth]}));
 assert.deepEqual(widths.field[0],widths.field[1]);assert.deepEqual(widths.spatial[0],widths.spatial[1]);assert.deepEqual(errors,[]);
 console.log('visual checks passed',widths);
 await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
