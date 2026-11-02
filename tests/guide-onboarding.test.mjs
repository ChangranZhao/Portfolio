import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {JSDOM} from 'jsdom';

test('onboarding keeps language choices readable, uses current screenshots and exits cleanly',async()=>{
 const dom=new JSDOM('<html lang="en"><body><nav class="menubar"><div class="menu-left"></div></nav><div id="windows"></div></body></html>',{url:'http://localhost',runScripts:'outside-only',pretendToBeVisual:true});
 const {window}=dom;window.matchMedia=()=>({matches:false,addEventListener(){}});
 for(const key of ['window','document','localStorage','navigator','location','Event','MutationObserver','NodeFilter'])Object.defineProperty(globalThis,key,{value:key==='window'?window:window[key],configurable:true});
 globalThis.matchMedia=window.matchMedia;
 window.HTMLDialogElement.prototype.showModal=function(){this.open=true};
 window.HTMLDialogElement.prototype.close=function(){this.open=false};
 for(const file of ['shell-theme.js','glass-settings.js'])window.eval(readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'));
 localStorage.setItem('portfolio-preferences',JSON.stringify({startup:false,languageMode:'en'}));
 const {openGuide,preferences}=await import('../dist/user-guide.js');
 openGuide();
 const dialog=document.querySelector('.user-guide');
 assert.equal(dialog.querySelectorAll('[data-language-option]').length,4);
 assert.equal(dialog.querySelector('select'),null,'No native white-on-white language popup');
 for(const language of ['zh','zh-Hant','en']){
  dialog.querySelector(`[data-language-option="${language}"]`).click();
  assert.equal(preferences.languageMode,language);
  assert.equal(dialog.querySelector(`[data-language-option="${language}"]`).getAttribute('aria-pressed'),'true');
  assert.equal(document.activeElement,dialog.querySelector(`[data-language-option="${language}"]`));
 }
 const next=()=>dialog.querySelector('footer button:last-child').click();
 next();assert.ok(dialog.querySelector('.guide-appearance-layout'));
 next();
 for(const image of dialog.querySelectorAll('img')){
  assert.match(image.getAttribute('src'),/current-(desktop|project)\.png$/);
  assert.ok(existsSync(new URL('../dist/'+image.getAttribute('src'),import.meta.url)));
 }
 next();assert.match(dialog.querySelector('img').getAttribute('src'),/current-full-project\.png$/);
 next();assert.match(dialog.querySelector('.guide-route').textContent,/Settings.*Exhibitions & Papers/);
 assert.match(dialog.querySelector('img').getAttribute('src'),/current-research\.png$/);
 assert.equal(dialog.querySelectorAll('.guide-reading-links button').length,2);
 next();assert.match(dialog.textContent,/Unity museum.*UE gallery.*TD node/);
 dialog.querySelector('.guide-close').click();
 assert.equal(document.querySelector('.user-guide'),null);
 assert.equal(document.body.classList.contains('guide-open'),false);
 assert.equal(JSON.parse(localStorage.getItem('portfolio-preferences')).startup,false);
 dom.window.close();
});
