import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {setupDockMotion} from '../dist/dock-motion.js';

test('restored Dock focus clears magnification without disabling genuine pointer hover',()=>{
 const dom=new JSDOM('<body><div id="dock"><button class="dock-item">Notion</button><button class="dock-item">Photos</button></div></body>');
 const dock=dom.window.document.querySelector('#dock'),items=[...dock.querySelectorAll('button')];
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,innerWidth:1280,innerHeight:900,matchMedia:query=>({matches:!query.includes('reduced-motion'),addEventListener(){}}),ResizeObserver:class{observe(){}},requestAnimationFrame:()=>1,cancelAnimationFrame(){}});
 Object.defineProperty(document,'hidden',{value:false});
 Object.defineProperties(dock,{clientWidth:{value:120},scrollWidth:{value:120}});
 items.forEach((item,i)=>Object.defineProperties(item,{offsetWidth:{value:48},offsetLeft:{value:i*60},offsetParent:{value:dock}}));
 setupDockMotion(dock);
 items[0].focus();assert.ok(dock.classList.contains('dock-tracking'));
 items[0].dispatchEvent(new dom.window.Event('dock-focus-restored',{bubbles:true}));
 assert.equal(dock.classList.contains('dock-tracking'),false);
 assert.equal(items[0].style.transform,'');
 assert.equal(document.activeElement,items[0],'Focus remains available to keyboard navigation');
 const move=new dom.window.MouseEvent('pointermove',{clientX:35,bubbles:true});Object.defineProperty(move,'pointerType',{value:'mouse'});dock.dispatchEvent(move);
 items[0].dispatchEvent(new dom.window.Event('dock-focus-restored',{bubbles:true}));
 assert.equal(dock.classList.contains('dock-tracking'),true,'Real mouse hover still magnifies the Dock');
 dom.window.close();
});
