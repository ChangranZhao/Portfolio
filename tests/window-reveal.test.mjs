import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareWindowReveal} from '../dist/window-reveal.js';
test('first commit reveals once and cancels the loading fallback',()=>{
 let shown=0,callback,cancelled=0;const r=prepareWindowReveal(()=>shown++,{schedule:f=>(callback=f,7),cancel:id=>{assert.equal(id,7);cancelled++;}});
 r.ready();callback();r.ready();assert.equal(shown,1);assert.equal(cancelled,1);
});
test('slow or failed imports still reveal the loading and retry surface',()=>{
 let shown=0,callback;const r=prepareWindowReveal(()=>shown++,{schedule:f=>(callback=f,1),cancel:()=>{}});callback();r.ready();assert.equal(shown,1);
});
test('closed windows never reveal after a delayed import or timer',()=>{
 let shown=0,callback;const r=prepareWindowReveal(()=>shown++,{schedule:f=>(callback=f,1),cancel:()=>{}});r.cancel();r.ready();callback();assert.equal(shown,0);
});
