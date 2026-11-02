import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {setupAlphabetMotion,setupCompleteAlphabetMotion} from '../dist/space-alphabet-motion.js';
import {setupInteractionMotion} from '../dist/space-interaction-motion.js';

function fixture(reduced=false,page='58-1386.html',setup=setupAlphabetMotion){
 const dom=new JSDOM(readFileSync(new URL('../dist/figma-pages/'+page,import.meta.url),'utf8'),{pretendToBeVisual:true});
 const {window}=dom,doc=window.document;let time=0,serial=0,visible;const frames=new Map();
 window.HTMLMediaElement.prototype.play=function(){this.dataset.playing='true';return Promise.resolve()};window.HTMLMediaElement.prototype.pause=function(){this.dataset.playing='false'};
 Object.defineProperty(window.performance,'now',{value:()=>time});
 window.requestAnimationFrame=fn=>{frames.set(++serial,fn);return serial};window.cancelAnimationFrame=id=>frames.delete(id);
 window.IntersectionObserver=class{constructor(cb){visible=cb;}observe(){}disconnect(){}};
 const timers=new Map();window.setTimeout=(fn,ms)=>{timers.set(++serial,{fn,due:time+ms});return serial};window.clearTimeout=id=>timers.delete(id);
 const abort=new window.AbortController();setup(doc,doc.body,doc.body,abort.signal,()=>reduced);
 return {doc,frames,abort,start(){visible([{isIntersecting:true,intersectionRatio:1}])},advance(ms){time+=ms;const pending=[...frames.values()];frames.clear();for(const fn of pending)fn(time);for(const [id,t] of [...timers])if(t.due<=time){timers.delete(id);t.fn();}},close(){abort.abort();dom.window.close()}};
}
test('all 82 planetary glyphs reveal in order within ten seconds without altering text or layout',()=>{
 const f=fixture();try{
  const glyphs=[...f.doc.querySelectorAll('.space-alphabet-glyph')];assert.equal(glyphs.length,82);
  const delays=glyphs.map(n=>parseFloat(n.style.getPropertyValue('--alphabet-delay')));assert.equal(delays[0],0);assert.ok(delays.every((v,i)=>!i||v>=delays[i-1]));assert.ok(delays.at(-1)+.35<=10.001);
  assert.equal(f.doc.querySelectorAll('.space-alphabet-typing').length,0);f.start();assert.ok(f.doc.querySelectorAll('.space-alphabet-typing').length>0);
  assert.ok(f.doc.querySelectorAll('[data-node-id="678:16931"] p').length>1);assert.ok([...f.doc.querySelectorAll('[data-node-id="678:16931"] p')].every(p=>p.classList.contains('space-alphabet-source-text')));
  const source=f.doc.querySelector('[data-node-id="678:16931"] p').textContent;f.advance(5000);assert.equal(f.doc.querySelector('[data-node-id="678:16931"] p').textContent,source);
  f.advance(5000);assert.equal(f.doc.querySelectorAll('.space-alphabet-glyph,.space-alphabet-typing,.space-alphabet-text-pending').length,0);assert.equal(f.frames.size,0);
 }finally{f.close()}
});

test('interaction reveals left to right with staged videos and complete typing inside ten seconds',()=>{
 const f=fixture(false,'58-2564.html',setupInteractionMotion);try{
  const videos=[...f.doc.querySelectorAll('video')];assert.equal(videos.length,3);assert.ok(videos.every(v=>!v.autoplay&&v.dataset.playing==='false'));
  const delays=['273','286','297'].map(id=>parseFloat(f.doc.querySelector(`[data-node-id="114:${id}"]`).style.getPropertyValue('--interaction-delay')));assert.deepEqual(delays,[0,2.7,5.4]);
  f.start();f.advance(100);assert.equal(videos[0].dataset.playing,'true');assert.equal(videos[1].dataset.playing,'false');
  f.advance(2800);assert.equal(videos[1].dataset.playing,'true');assert.equal(videos[2].dataset.playing,'false');
  f.advance(2800);assert.equal(videos[2].dataset.playing,'true');assert.ok(f.doc.querySelectorAll('.space-interaction-typing').length>10);
  f.doc.body.classList.add('portfolio-board-paused');f.doc.dispatchEvent(new f.doc.defaultView.Event('portfolio-board-activity'));assert.ok(videos.every(v=>v.dataset.playing==='false'));
  f.doc.body.classList.remove('portfolio-board-paused');f.doc.dispatchEvent(new f.doc.defaultView.Event('portfolio-board-activity'));f.advance(4300);
  assert.equal(f.doc.querySelectorAll('.space-interaction-piece,.space-interaction-typing,.space-interaction-pending').length,0);assert.equal(f.frames.size,0);
  f.abort.abort();assert.ok(videos.every(v=>v.dataset.playing==='false'));
 }finally{f.close()}
});
test('reduced motion shows everything immediately and closing cancels in-progress motion',()=>{
 const reduced=fixture(true);assert.equal(reduced.doc.querySelectorAll('.space-alphabet-glyph').length,0);reduced.close();
 const f=fixture();f.start();f.abort.abort();assert.equal(f.frames.size,0);assert.equal(f.doc.querySelectorAll('.space-alphabet-typing').length,0);f.close();
});

test('complete alphabet expands the three left steps top to bottom and finishes every right item inside ten seconds',()=>{
 const f=fixture(false,'58-957.html',setupCompleteAlphabetMotion);try{
  const delay=id=>parseFloat(f.doc.querySelector(`[data-node-id="678:${id}"]`).style.getPropertyValue('--complete-delay'));
  assert.equal(delay('16006'),0);assert.ok(delay('16009')>delay('16006'));assert.ok(delay('16013')>delay('16009'));
  const pieces=[...f.doc.querySelectorAll('.space-complete-piece')];assert.ok(pieces.length>120);assert.ok(pieces.every(n=>parseFloat(n.style.getPropertyValue('--complete-delay'))+.65<=10));
  assert.equal(f.doc.body.classList.contains('space-complete-playing'),false);f.start();assert.equal(f.doc.body.classList.contains('space-complete-playing'),true);
  f.advance(10000);assert.equal(f.doc.querySelectorAll('.space-complete-piece').length,0);
 }finally{f.close()}
});
