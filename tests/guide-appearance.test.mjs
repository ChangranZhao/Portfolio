import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {appearanceGuide} from '../dist/guide-appearance.js';

test('guide choices preview live, keep slider focus, remember themes and remove subscriptions',()=>{
 const dom=new JSDOM('<html lang="en"><body><section></section></body></html>',{url:'http://localhost',runScripts:'outside-only'});
 const {window}=dom;window.matchMedia=()=>({matches:true,addEventListener(){}});
 for(const file of ['shell-theme.js','glass-settings.js'])window.eval(readFileSync(new URL('../dist/'+file,import.meta.url),'utf8'));
 Object.assign(globalThis,{window,document:window.document});
 const host=document.querySelector('section'),dispose=appearanceGuide(host,(_zh,_hant,en)=>en);
 const click=text=>[...host.querySelectorAll('button')].find(b=>b.textContent.startsWith(text)).click();
 const input=host.querySelector('input');input.focus();input.value=44;input.dispatchEvent(new window.Event('input'));
 assert.equal(document.activeElement,input);assert.equal(window.creativeOSGlass.get().transparency,44);
 click('Classic');assert.equal(host.querySelector('.guide-glass-tuning').hidden,true);assert.equal(window.localStorage.getItem('portfolio-shell-material'),'classic');
 click('Liquid Glass');assert.equal(host.querySelector('.guide-glass-tuning').hidden,false);assert.equal(input.value,'44');
 click('Light');assert.equal(input.value,'28');click('Dark');assert.equal(input.value,'44');click('Reset this theme');assert.equal(input.value,'36');
 dispose();window.creativeOSGlass.set({transparency:70});assert.equal(input.value,'36','Disposed guide controls no longer receive events');
 host.replaceChildren();const disposeNext=appearanceGuide(host,(_zh,_hant,en)=>en);assert.equal(host.querySelector('input').value,'70');disposeNext();dom.window.close();
});
