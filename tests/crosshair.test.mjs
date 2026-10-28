import test from 'node:test';
import assert from 'node:assert/strict';
import {setupSpaceCrosshair} from '../dist/space-crosshair.js';

function surface(){
 const listeners={},frames=new Map();let seq=0,layer;
 const element=()=>{const classes=new Set();return {style:{},children:[],setAttribute(){},remove(){},classList:{add:c=>classes.add(c),remove:c=>classes.delete(c),toggle(c,v){v?classes.add(c):classes.delete(c)},contains:c=>classes.has(c)},set innerHTML(v){this.children=Array.from({length:4},element)}}};
 const doc={querySelector:()=>null,head:{append(){}},body:{append(el){layer=el}},createElement:element,documentElement:{lang:'en'},elementsFromPoint:()=>[],addEventListener(type,fn){(listeners[type]??=[]).push(fn)}};
 doc.defaultView={matchMedia:()=>({matches:true,addEventListener(){}}),requestAnimationFrame(fn){frames.set(++seq,fn);return seq},cancelAnimationFrame(id){frames.delete(id)},addEventListener(){},innerWidth:1920,innerHeight:1080};
 const controller=new AbortController();setupSpaceCrosshair(doc,doc,controller.signal);
 return {move(){for(const fn of listeners.pointermove)fn({pointerType:'mouse',clientX:50,clientY:60,target:{closest:()=>null}})},flush(){for(const [id,fn] of frames){frames.delete(id);fn()}},active:()=>layer.classList.contains('is-active'),controller};
}
test('only the current document owns a crosshair, including pending animation frames',()=>{
 const outer=surface(),first=surface(),second=surface();
 outer.move();outer.flush();assert.equal(outer.active(),true);
 first.move();first.flush();assert.equal(outer.active(),false);assert.equal(first.active(),true);
 first.move();second.move();first.flush();second.flush();
 assert.equal(first.active(),false);assert.equal(second.active(),true);
 outer.move();outer.flush();assert.equal(second.active(),false);assert.equal(outer.active(),true);
 for(const s of [outer,first,second])s.controller.abort();
});
