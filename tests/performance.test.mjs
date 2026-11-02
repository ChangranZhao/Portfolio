import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import {optimizeImage} from '../scripts/image-optimization.mjs';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {createBoardScheduler} from '../dist/board-performance.js';

test('publication images are bounded, smaller and retain transparency',async()=>{
  const original=await sharp({create:{width:4000,height:2000,channels:4,background:'#3399aa80'}}).png({compressionLevel:0}).toBuffer();
  const result=await optimizeImage(original,'large.png');
  const meta=await sharp(result).metadata();
  assert.equal(meta.width,1600);assert.equal(meta.height,800);
  assert.equal(meta.hasAlpha,true);assert.ok(result.length<original.length*.9);
});
test('small image assets are left unchanged',async()=>{
  assert.equal(await optimizeImage(Buffer.alloc(100),'icon.png'),null);
});
test('medium images are optimized and tall diagrams keep their aspect ratio',async()=>{
  const medium=await sharp({create:{width:300,height:200,channels:3,background:'#8899aa'}}).png({compressionLevel:0}).toBuffer();
  assert.ok(medium.length<180*1024);
  assert.ok(await optimizeImage(medium,'medium.png'));
  const tall=await sharp({create:{width:1000,height:7000,channels:3,background:'#ffffff'}}).png({compressionLevel:0}).toBuffer();
  const meta=await sharp(await optimizeImage(tall,'diagram.png')).metadata();
  assert.equal(meta.width,1000);assert.equal(meta.height,7000);
});
test('startup releases the screen in eight seconds even if app modules never load',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const guard=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('window.creativeOSBootStarted='));
  let removed=false,delay,callback;
  const window={dispatchEvent(){}};
  vm.runInNewContext(guard,{window,document:{querySelector:()=>null,getElementById:()=>({addEventListener(){},remove(){removed=true;}})},Date,clearTimeout(){},Event,setTimeout(fn,ms){callback=fn;delay=ms;}});
  assert.equal(delay,8000);assert.equal(removed,false);callback();assert.equal(removed,true);
});
test('distant boards wait for proximity and offscreen animations pause and resume',async()=>{
 const previousDocument=globalThis.document,previousObserver=globalThis.IntersectionObserver,observers=[];
 globalThis.document=new EventTarget();globalThis.document.hidden=false;
 globalThis.IntersectionObserver=class{constructor(callback){this.callback=callback;observers.push(this);}observe(){}unobserve(){}disconnect(){this.disconnected=true;}};
 try{
  const animation={playState:'running',pause(){this.playState='paused';},play(){this.playState='running';}};
  const handlers={},classes=new Set();
  const frame={addEventListener(name,fn){handlers[name]=fn;},contentDocument:{head:{append(){}},body:{classList:{toggle(name,value){value?classes.add(name):classes.delete(name);}}},createElement(){return{};},getAnimations(){return[animation];}}};
  const owner={dataset:{suspended:'false'}},section={},scheduler=createBoardScheduler({closest:()=>owner});scheduler.observe(frame,section,'chapter.html');
  observers[1].callback([{target:section,isIntersecting:false}]);
  assert.equal(frame.src,undefined);
  observers[0].callback([{target:section,isIntersecting:true}]);
  observers[0].callback([{target:section,isIntersecting:false}]);
  await new Promise(r=>setTimeout(r,140));assert.equal(frame.src,undefined);
  observers[0].callback([{target:section,isIntersecting:true}]);
  await new Promise(r=>setTimeout(r,140));assert.equal(frame.src,'chapter.html');
  let activityEvents=0;
  // Loading replaces about:blank; the new document must receive its paused state.
  frame.contentDocument={...frame.contentDocument,dispatchEvent(){activityEvents++;}};
  handlers.load();await Promise.resolve();assert.equal(animation.playState,'paused');assert.equal(activityEvents,1);
  observers[1].callback([{target:section,isIntersecting:true}]);assert.equal(animation.playState,'running');
  frame.contentDocument.scrollPosition=420;
  owner.dataset.suspended='true';document.dispatchEvent(new Event('portfolio-windows-changed'));
  assert.equal(animation.playState,'paused');assert.equal(frame.src,'chapter.html');
  owner.dataset.suspended='false';document.dispatchEvent(new Event('portfolio-windows-changed'));
  assert.equal(animation.playState,'running');assert.equal(frame.contentDocument.scrollPosition,420);
  scheduler.dispose();assert.ok(observers.every(observer=>observer.disconnected));
 }finally{globalThis.document=previousDocument;globalThis.IntersectionObserver=previousObserver;}
});

test('nearby boards initialize at most two at once and retain their URLs after leaving view',async()=>{
 const oldDoc=globalThis.document,oldIO=globalThis.IntersectionObserver,observers=[];
 globalThis.document=new EventTarget();document.hidden=false;
 globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;observers.push(this);}observe(){}unobserve(){}disconnect(){}};
 const root=new EventTarget(),frames=Array.from({length:4},()=>new EventTarget()),sections=frames.map(()=>({}));
 const scheduler=createBoardScheduler(root);
 try{
  frames.forEach((f,i)=>scheduler.observe(f,sections[i],'page'+i+'.html'));
  observers[0].cb(sections.map(target=>({target,isIntersecting:true})));
  await new Promise(r=>setTimeout(r,150));assert.equal(frames.filter(f=>f.src).length,2);
  frames[0].dispatchEvent(new Event('load'));assert.equal(frames.filter(f=>f.src).length,3);
  observers[0].cb(sections.map(target=>({target,isIntersecting:false})));
  frames[1].dispatchEvent(new Event('load'));assert.equal(frames.filter(f=>f.src).length,3);assert.equal(frames[0].src,'page0.html');
 }finally{scheduler.dispose();globalThis.document=oldDoc;globalThis.IntersectionObserver=oldIO;}
});
test('responsive image variants have independent cache policies and smaller decoded sizes',async()=>{const image=await sharp({create:{width:2400,height:1600,channels:3,background:'#558877'}}).png({compressionLevel:0}).toBuffer();const small=await sharp(await optimizeImage(image,'assets/p1-000-small.webp')).metadata(),preview=await sharp(await optimizeImage(image,'assets/p1-000-preview.webp')).metadata();assert.equal(small.width,320);assert.equal(preview.width,1280)});

test('project preparation loads every retained board two at a time, without proximity',()=>{
 const oldDoc=globalThis.document,oldIO=globalThis.IntersectionObserver;
 globalThis.document=new EventTarget();document.hidden=false;
 globalThis.IntersectionObserver=class{observe(){}unobserve(){}disconnect(){}};
 const root=new EventTarget(),frames=Array.from({length:5},()=>new EventTarget());
 const scheduler=createBoardScheduler(root);
 try{
  frames.forEach((f,i)=>scheduler.observe(f,{},'board'+i+'.html'));
  root.dispatchEvent(new Event('portfolio-project-preload'));
  assert.equal(frames.filter(f=>f.src).length,2);
  for(const f of frames)f.dispatchEvent(new Event('load'));
  assert.equal(frames.filter(f=>f.src).length,5);
  assert.deepEqual(frames.map(f=>f.src),frames.map((_,i)=>'board'+i+'.html'));
 }finally{scheduler.dispose();globalThis.document=oldDoc;globalThis.IntersectionObserver=oldIO;}
});
test('first-screen preparation reserves initialization for the cover until the reader opens',async()=>{
 const oldDoc=globalThis.document,oldIO=globalThis.IntersectionObserver,observers=[];globalThis.document=new EventTarget();document.hidden=false;
 globalThis.IntersectionObserver=class{constructor(cb){this.cb=cb;observers.push(this);}observe(){}unobserve(){}disconnect(){}};
 const root=new EventTarget(),frames=Array.from({length:4},()=>new EventTarget()),sections=frames.map(()=>({})),scheduler=createBoardScheduler(root);
 try{
  frames.forEach((frame,i)=>scheduler.observe(frame,sections[i],'board'+i+'.html',i===0));
  const event=new Event('portfolio-project-preload');event.detail={criticalOnly:true};root.dispatchEvent(event);observers[0].cb(sections.slice(1).map(target=>({target,isIntersecting:true})));await new Promise(r=>setTimeout(r,150));
  assert.equal(frames.filter(f=>f.src).length,1);root.dispatchEvent(new Event('portfolio-project-ready'));assert.equal(frames.filter(f=>f.src).length,2);
 }finally{scheduler.dispose();globalThis.document=oldDoc;globalThis.IntersectionObserver=oldIO;}
});
test('published board photos use a lighter 1280 pixel profile',async()=>{
 const input=await sharp({create:{width:2400,height:1400,channels:3,background:'#677890'}}).png({compressionLevel:0}).toBuffer();const output=await optimizeImage(input,'assets/figma-details/board/photo.png');assert.equal((await sharp(output).metadata()).width,1280);
});
