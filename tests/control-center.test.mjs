import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<html lang="en" data-theme="dark"><body><button id="trigger">Control Center</button></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,Event:dom.window.Event,MutationObserver:dom.window.MutationObserver,localStorage:dom.window.localStorage,location:dom.window.location,Audio:class extends dom.window.EventTarget{volume=.2;loop=false;paused=true;play(){this.paused=false;return Promise.resolve()}pause(){this.paused=true}}});
window.creativeOSTheme={set(value){document.documentElement.dataset.theme=value}};
const {setupControlCenter}=await import('../dist/control-center.js');
const calls=[],trigger=document.querySelector('#trigger');
setupControlCenter(trigger,Object.fromEntries(['projects','photos','figma','desktop','settings'].map(key=>[key,()=>calls.push(key)])));
test('Control Center changes real settings and routes actions without creating windows',()=>{
 trigger.click();const panel=document.querySelector('.system-control-center');assert.equal(panel.hidden,false);
 const sound=panel.querySelector('input[aria-label="Sound"]');sound.value='35';sound.dispatchEvent(new Event('input'));assert.equal(localStorage.getItem('portfolio-music-volume'),'0.35');
 [...panel.querySelectorAll('button')].find(b=>b.textContent.includes('Appearance')).click();assert.equal(document.documentElement.dataset.theme,'light');
 [...panel.querySelectorAll('button')].find(b=>b.textContent.includes('Photos')).click();assert.deepEqual(calls,['photos']);assert.equal(panel.hidden,true);
 trigger.click();document.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape'}));assert.equal(panel.hidden,true);assert.equal(document.activeElement,trigger);
});
test('Control Center and menus stay exclusive, including traditional Chinese labels',()=>{
 document.documentElement.lang='zh-Hant';trigger.click();const panel=document.querySelector('.system-control-center');assert.equal(panel.getAttribute('aria-label'),'控制中心');assert.ok(panel.textContent.includes('系統設置'));
 document.dispatchEvent(new Event('portfolio-popover-opening'));assert.equal(panel.hidden,true);
});
