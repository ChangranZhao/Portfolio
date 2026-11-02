import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
const dom=new JSDOM('<html lang="en"><body><div class="menubar"><nav class="menu-left"><button id="brand-menu">Brand</button><button data-action="about">About</button></nav></div><div id="main-menu" hidden></div><div id="windows"></div><div class="dock-container"></div></body></html>',{url:'http://localhost/'});
Object.assign(globalThis,{window:dom.window,document:dom.window.document,Event:dom.window.Event,innerWidth:1280,innerHeight:900,CSS:{escape:s=>s},matchMedia:()=>({matches:false})});
const {createWindow,closeWindow}=await import('../dist/windows.js');
const {setupApplicationMenus}=await import('../dist/app-menus.js');
const calls=[];setupApplicationMenus(Object.fromEntries(['about','settings','projects','photos','figma','search','network','research'].map(key=>[key,()=>calls.push(key)])));
const menuButton=name=>[...document.querySelectorAll('.application-menus>button')].find(el=>el.textContent===name);
test('application menus execute actions and dismiss when keyboard focus leaves',()=>{
 menuButton('File').click();const panel=document.querySelector('.application-menu');assert.equal(panel.hidden,false);
 [...panel.querySelectorAll('button')].find(el=>el.textContent==='Open Photos').click();assert.deepEqual(calls,['photos']);assert.equal(panel.hidden,true);
 menuButton('File').click();document.querySelector('#brand-menu').focus();assert.equal(panel.hidden,true);
 menuButton('View').click();panel.querySelector('button').focus();assert.equal(panel.hidden,false);
 panel.dispatchEvent(new dom.window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(panel.hidden,true);assert.equal(document.activeElement,menuButton('View'));
});
test('deferred reveal focuses its window but never steals focus from a newer one',()=>{
 const first=createWindow({id:'first',title:'First',content:document.createElement('div'),deferOpen:true});
 document.querySelector('#brand-menu').focus();first.reveal();assert.equal(document.activeElement,first.el);assert.equal(first.el.style.visibility,'');
 const second=createWindow({id:'second',title:'Second',content:document.createElement('div'),deferOpen:true});
 const third=createWindow({id:'third',title:'Third',content:document.createElement('div')});
 second.reveal();assert.equal(document.activeElement,third.el);
 for(const id of ['first','second','third'])closeWindow(id);
});
test('menus open on hover, switch without clicking, and dismiss far from the menu bar',()=>{
 menuButton('File').dispatchEvent(new dom.window.MouseEvent('pointerenter'));
 const panel=document.querySelector('.application-menu');assert.equal(panel.hidden,false);assert.match(panel.textContent,/Open Portfolio/);
 menuButton('View').dispatchEvent(new dom.window.MouseEvent('pointerenter'));assert.match(panel.textContent,/Show Desktop/);
 document.dispatchEvent(new dom.window.MouseEvent('pointermove',{clientY:400}));assert.equal(panel.hidden,true);
 menuButton('File').dispatchEvent(new dom.window.MouseEvent('pointerenter'));document.dispatchEvent(new Event('portfolio-popover-opening'));assert.equal(panel.hidden,true);
});
test('yellow control restores a maximized window before minimizing it',()=>{
 const w=createWindow({id:'zoom-test',title:'Zoom',content:document.createElement('div')});
 w.el.querySelector('.maximize').click();assert.equal(w.el.classList.contains('maximized'),true);
 w.el.querySelector('.minimize').click();assert.equal(w.el.classList.contains('maximized'),false);assert.equal(w.el.hidden,false);
 w.el.querySelector('.minimize').click();assert.equal(w.el.hidden,true);closeWindow('zoom-test');
});

test('repeated window notifications keep the hovered title and open menu stable',()=>{
 const w=createWindow({id:'long-title',title:'Wind from the East — Full Project',content:document.createElement('div')});
 const title=menuButton('Wind from the East — Full Project');
 title.dispatchEvent(new dom.window.MouseEvent('pointerenter'));
 const panel=document.querySelector('.application-menu');assert.equal(panel.hidden,false);
 document.dispatchEvent(new Event('portfolio-windows-changed'));
 assert.equal(menuButton('Wind from the East — Full Project'),title,'Do not replace the pointer target on unchanged window updates');
 assert.equal(panel.hidden,false,'Do not restart the menu animation while hovering');
 closeWindow('long-title');
});
test('switching and closing windows reuses menu buttons and clears the previous open highlight',()=>{
 const title=document.querySelector('.application-menus>button'),file=menuButton('File');
 const first=createWindow({id:'stable-first',title:'First project',content:document.createElement('div')});
 assert.equal(document.querySelector('.application-menus>button'),title);
 file.click();assert.equal(file.getAttribute('aria-expanded'),'true');
 const second=createWindow({id:'stable-second',title:'Second project',content:document.createElement('div')});
 assert.equal(menuButton('File'),file);assert.equal(file.getAttribute('aria-expanded'),'false');
 closeWindow('stable-second');assert.equal(document.querySelector('.application-menus>button'),title);assert.equal(title.textContent,'First project');
 assert.equal(document.querySelector('.application-menu').hidden,true);closeWindow('stable-first');
});
test('Full Project menus read the accessible window title when the browser titlebar replaces the native title',()=>{
 const w=createWindow({id:'custom-titlebar',title:'Wind from the East — Full Project',content:document.createElement('div')});
 w.el.querySelector('.window-title').remove();document.dispatchEvent(new Event('portfolio-windows-changed'));
 assert.ok(menuButton('Wind from the East — Full Project'));
 closeWindow('custom-titlebar');assert.ok(menuButton('Finder'));
});
test('the fixed menu bar does not sample changing window compositor layers',async()=>{
 const {readFile}=await import('node:fs/promises');const css=await readFile('dist/desktop-shell.css','utf8');assert.match(css,/html body \.menubar\{backdrop-filter:none!important;-webkit-backdrop-filter:none!important;isolation:isolate;contain:paint/);
});
