import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';

test('floating panels pause desktop drift until every overlay closes, without moving icons on resume',async()=>{
 const dom=new JSDOM('<body><div class="menubar"></div><div id="windows"></div><div class="dock-container"></div><div id="desktop"><button class="desktop-icon">Photo</button></div><section class="system-control-center" hidden></section><div class="dropdown" hidden></div><dialog id="lightbox"></dialog></body>',{pretendToBeVisual:true,url:'http://localhost/'});
 const timers=new Map(),frames=new Map();let now=0,serial=0;
 const original={setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,performance:globalThis.performance};
 Object.assign(globalThis,{window:dom.window,document:dom.window.document,MutationObserver:dom.window.MutationObserver,innerWidth:1200,innerHeight:900,matchMedia:()=>({matches:false,addEventListener(){}}),requestAnimationFrame:fn=>(frames.set(++serial,fn),serial),cancelAnimationFrame:id=>frames.delete(id),setTimeout:(fn,delay)=>(timers.set(++serial,{fn,at:now+delay}),serial),clearTimeout:id=>timers.delete(id),performance:{now:()=>now}});
 const desktop=document.querySelector('#desktop'),icon=desktop.querySelector('button'),panel=document.querySelector('.system-control-center'),menu=document.querySelector('.dropdown'),lightbox=document.querySelector('#lightbox');
 desktop.getBoundingClientRect=()=>({left:0,top:0,right:1000,bottom:800,width:1000,height:800});
 icon.getBoundingClientRect=()=>({left:100,top:100,right:200,bottom:200,width:100,height:100});
 const advance=ms=>{now+=ms;for(const [id,timer] of [...timers])if(timer.at<=now){timers.delete(id);timer.fn();}};
 const step=()=>{now+=40;const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(now));};
 const mutations=async()=>{await Promise.resolve();await Promise.resolve();};
 try{
  const {setupDesktopDrift}=await import('../dist/desktop-motion.js');setupDesktopDrift(desktop);
  advance(2000);step();assert.equal(desktop.classList.contains('is-drifting'),true);const position=icon.style.transform;
  panel.hidden=false;await mutations();assert.equal(desktop.classList.contains('is-drifting'),false,'Control Center must immediately pause its moving backdrop');
  advance(4000);step();assert.equal(icon.style.transform,position);assert.equal(frames.size,0);
  menu.hidden=false;panel.hidden=true;await mutations();advance(4000);assert.equal(desktop.classList.contains('is-drifting'),false,'Switching panels must not resume the backdrop');
  menu.hidden=true;await mutations();advance(2000);assert.equal(desktop.classList.contains('is-drifting'),true);assert.equal(icon.style.transform,position,'Resume preserves the last position');step();assert.notEqual(icon.style.transform,position);
  lightbox.setAttribute('open','');await mutations();assert.equal(desktop.classList.contains('is-drifting'),false,'Image previews also keep their backdrop still');
 }finally{Object.assign(globalThis,original);dom.window.close();}
});
