import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {JSDOM} from 'jsdom';
const source=await readFile(new URL('../dist/windows.js',import.meta.url),'utf8');
function setup(){const dom=new JSDOM('<section><header></header></section>',{runScripts:'outside-only'});const w=dom.window,el=w.document.querySelector('section'),bar=el.firstChild;w.matchMedia=()=>({matches:false});w.cancelWindowMotion=()=>{};w.clampPosition=(x,y)=>({x,y});w.createFrameBatch=fn=>({push:fn,flush(){},cancel(){}});bar.setPointerCapture=()=>{};w.eval(source.slice(source.indexOf('export function makeDraggable'),source.indexOf('function makeResizable')).replace('export ',''));w.makeDraggable(el,bar);const pointer=(type,x,y)=>{const e=new w.MouseEvent(type,{bubbles:true,button:0,clientX:x,clientY:y});bar.dispatchEvent(e)};return {dom,el,pointer};}
test('a titlebar click does not create a temporary dragging compositor layer',()=>{const {dom,el,pointer}=setup();pointer('pointerdown',50,60);assert.equal(el.classList.contains('dragging'),false);pointer('pointerup',50,60);assert.equal(el.classList.contains('dragging'),false);dom.window.close()});
test('actual titlebar movement still starts dragging and release clears it',()=>{const {dom,el,pointer}=setup();pointer('pointerdown',50,60);pointer('pointermove',65,70);assert.equal(el.classList.contains('dragging'),true);pointer('pointerup',65,70);assert.equal(el.classList.contains('dragging'),false);dom.window.close()});
