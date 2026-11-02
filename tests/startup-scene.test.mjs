import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareStartupScene,welcomeTiming} from '../dist/startup-scene.js';
const tick=()=>new Promise(r=>setImmediate(r));
test('welcome waits for fonts, bounded image decoding and two paint frames',async()=>{
 let fonts,frames=0;const jobs=[],seen=[];
 const ready=prepareStartupScene({fontsReady:new Promise(r=>fonts=r),images:[0,1,2].map(i=>({decode(){seen.push(i);return new Promise(r=>jobs.push(r));}})),nextFrame:async()=>{frames++;}});
 await tick();assert.deepEqual(seen,[]);fonts();await tick();assert.deepEqual(seen,[0,1]);assert.equal(frames,0);
 jobs[0]();await tick();assert.deepEqual(seen,[0,1,2]);jobs[1]();await tick();assert.equal(frames,0);jobs[2]();assert.equal(await ready,true);assert.equal(frames,2);
});
test('skip cancels a stuck decode and never starts welcome or another image',async()=>{
 const controller=new AbortController();let decodes=0,frames=0;
 const ready=prepareStartupScene({signal:controller.signal,images:Array.from({length:5},()=>({decode(){decodes++;return new Promise(()=>{});}})),nextFrame:async()=>frames++});
 await tick();assert.equal(decodes,2);controller.abort();assert.equal(await ready,false);assert.equal(decodes,2);assert.equal(frames,0);
});
test('failed images do not block the welcome',async()=>{assert.equal(await prepareStartupScene({images:[{decode:()=>Promise.reject(Error('missing'))}],nextFrame:async()=>{}}),true);});
test('glass cutout and visible paths draw together so future strokes cannot erase the current outline',async()=>{
 const {readFile}=await import('node:fs/promises'),html=await readFile('dist/index.html','utf8'),css=await readFile('dist/startup.css','utf8'),js=await readFile('dist/startup.js','utf8');
 assert.equal((html.match(/<path class="hello-write-path /g)||[]).length,4);assert.doesNotMatch(html,/hello-write-mask/);assert.match(css,/stroke-dasharray:1 1/);assert.match(css,/stroke-linecap:butt/);assert.doesNotMatch(css,/contain:paint/);assert.match(html,/<path class="hello-write-path hello-cutout" pathLength="1"/);assert.doesNotMatch(html,/<use[^>]+stroke="black"/);assert.match(css,/data-hello-ready=true[^}]+stroke-dashoffset:0/);
 assert.match(css,/#startup-screen\[data-motion-ready=true\] \.hello-write-path\{animation:hello-write/);assert.doesNotMatch(css,/drop-shadow|animation:hello-details|animation:hello-arrive/);
 assert.ok(js.indexOf('await prepareStartupScene')<js.indexOf("screen.setAttribute('data-motion-ready'"));assert.match(js,/concurrency:1/);assert.doesNotMatch(js,/figma-fonts/);
});

test('late resources cannot leave handwriting unfinished at the eight-second deadline',()=>{
 assert.equal(welcomeTiming(0).duration,4100);for(const elapsed of [0,2000,4000,5500,6500,7900]){const t=welcomeTiming(elapsed);if(t.duration)assert.ok(elapsed+t.duration+t.settle+700<=8000);else assert.equal(t.settle,0);}assert.equal(welcomeTiming(7500).duration,0);
});
