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
  assert.equal(meta.width,1920);assert.equal(meta.height,960);
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
test('startup releases the screen in five seconds even if app modules never load',async()=>{
  const html=await readFile(new URL('../dist/index.html',import.meta.url),'utf8');
  const guard=html.match(/<script>([\s\S]*?)<\/script>/)[1];
  let removed=false,delay,callback;
  const window={dispatchEvent(){}};
  vm.runInNewContext(guard,{window,document:{getElementById:()=>({remove(){removed=true;}})},Event,setTimeout(fn,ms){callback=fn;delay=ms;}});
  assert.equal(delay,5000);assert.equal(removed,false);callback();assert.equal(removed,true);
});
test('distant boards wait for proximity and offscreen animations pause and resume',async()=>{
 const previousDocument=globalThis.document,previousObserver=globalThis.IntersectionObserver,observers=[];
 globalThis.document={hidden:false,addEventListener(){},removeEventListener(){}};
 globalThis.IntersectionObserver=class{constructor(callback){this.callback=callback;observers.push(this);}observe(){}unobserve(){}disconnect(){this.disconnected=true;}};
 try{
  const animation={playState:'running',pause(){this.playState='paused';},play(){this.playState='running';}};
  const handlers={},classes=new Set();
  const frame={addEventListener(name,fn){handlers[name]=fn;},contentDocument:{head:{append(){}},body:{classList:{toggle(name,value){value?classes.add(name):classes.delete(name);}}},createElement(){return{};},getAnimations(){return[animation];}}};
  const section={},scheduler=createBoardScheduler({});scheduler.observe(frame,section,'chapter.html');
  assert.equal(frame.src,undefined);
  observers[0].callback([{target:section,isIntersecting:true}]);
  observers[0].callback([{target:section,isIntersecting:false}]);
  await new Promise(r=>setTimeout(r,140));assert.equal(frame.src,undefined);
  observers[0].callback([{target:section,isIntersecting:true}]);
  await new Promise(r=>setTimeout(r,140));assert.equal(frame.src,'chapter.html');
  handlers.load();await Promise.resolve();assert.equal(animation.playState,'paused');
  observers[1].callback([{target:section,isIntersecting:true}]);assert.equal(animation.playState,'running');
  scheduler.dispose();assert.ok(observers.every(observer=>observer.disconnected));
 }finally{globalThis.document=previousDocument;globalThis.IntersectionObserver=previousObserver;}
});
