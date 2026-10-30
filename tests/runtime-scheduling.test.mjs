import test from 'node:test';
import assert from 'node:assert/strict';
import {createFrameBatch,createActivityClock,createTaskQueue} from '../dist/runtime-scheduling.js';

function environment(){
 let time=0,id=0;const frames=new Map(),timers=new Map();
 const doc=new EventTarget();doc.hidden=false;doc.body={classList:{contains:()=>false}};
 const win={performance:{now:()=>time},requestAnimationFrame(fn){frames.set(++id,fn);return id;},cancelAnimationFrame(id){frames.delete(id);},setTimeout(fn,ms){timers.set(++id,{fn,at:time+ms});return id;},clearTimeout(id){timers.delete(id);}};
 doc.defaultView=win;
 return {doc,win,frames,timers,advance(ms){time+=ms;for(const [key,t] of [...timers])if(t.at<=time){timers.delete(key);t.fn();}},frame(){const jobs=[...frames.values()];frames.clear();for(const job of jobs)job(time);}};
}
test('pointer bursts render only the latest position and release flushes pending movement',()=>{
 const e=environment(),seen=[];const batch=createFrameBatch(p=>seen.push(p),e.win);
 batch.push(10);batch.push(20);batch.push(30);
 assert.deepEqual(seen,[]);assert.equal(e.frames.size,1);e.frame();assert.deepEqual(seen,[30]);
 batch.push(40);batch.flush();assert.deepEqual(seen,[30,40]);assert.equal(e.frames.size,0);
 batch.push(50);batch.cancel();e.frame();assert.deepEqual(seen,[30,40]);
});
test('inactive board preserves animation time and timer remainder without background callbacks',()=>{
 const e=environment(),clock=createActivityClock(e.doc);let ran=0,stamp;
 clock.setTimeout(()=>ran++,100);clock.requestAnimationFrame(t=>stamp=t);
 e.advance(40);e.doc.hidden=true;e.doc.dispatchEvent(new Event('visibilitychange'));
 assert.equal(e.frames.size,0);assert.equal(e.timers.size,0);
 e.advance(5000);assert.equal(ran,0);assert.equal(clock.now(),40);
 e.doc.hidden=false;e.doc.dispatchEvent(new Event('visibilitychange'));e.frame();assert.equal(stamp,40);
 e.advance(59);assert.equal(ran,0);e.advance(1);assert.equal(ran,1);
 clock.dispose();assert.equal(e.frames.size,0);assert.equal(e.timers.size,0);
});
test('clock scheduled while suspended waits for board resume and abort disposes it',()=>{
 const e=environment(),abort=new AbortController();let paused=true,ran=0;
 e.doc.body.classList.contains=()=>paused;
 const clock=createActivityClock(e.doc,abort.signal);clock.setTimeout(()=>ran++,10);
 assert.equal(e.timers.size,0);paused=false;e.doc.dispatchEvent(new Event('portfolio-board-activity'));
 e.advance(10);assert.equal(ran,1);clock.requestAnimationFrame(()=>ran++);abort.abort();e.frame();assert.equal(ran,1);
});
test('large text updates yield between bounded slices and cancellation drops stale work',()=>{
 const jobs=[],seen=[];const queue=createTaskQueue({schedule:fn=>jobs.push(fn),now:()=>0,maxSteps:2});
 function* work(){for(let i=0;i<5;i++){seen.push(i);yield;}}
 queue.add(work());assert.deepEqual(seen,[]);jobs.shift()();assert.deepEqual(seen,[0,1]);
 jobs.shift()();assert.deepEqual(seen,[0,1,2,3]);queue.clear();jobs.shift()();assert.deepEqual(seen,[0,1,2,3]);
});
