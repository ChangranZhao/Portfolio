import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {preloadResources} from '../dist/startup-preload.js';

test('warming has bounded concurrency, deduplicates resources and continues after a failure',async()=>{
 const releases=[],seen=[],progress=[];
 const run=preloadResources(['a','b','a','c','d'],{concurrency:2,load:url=>{seen.push(url);return new Promise((resolve,reject)=>releases.push({resolve,reject}));},onProgress:p=>progress.push(p)});
 assert.deepEqual(seen,['a','b']);releases[0].resolve();await new Promise(r=>setImmediate(r));assert.deepEqual(seen,['a','b','c']);
 releases[1].reject(Error('offline'));await new Promise(r=>setImmediate(r));assert.deepEqual(seen,['a','b','c','d']);
 releases[2].resolve();releases[3].resolve();const result=await run;
 assert.equal(result.loaded,3);assert.equal(result.failed,1);assert.equal(progress.at(-1).completed,4);
});
test('skip/timeout cancels warming even if a request never resolves; no later requests start',async()=>{
 const controller=new AbortController(),seen=[];
 const run=preloadResources(['a','b','c'],{signal:controller.signal,concurrency:1,load:url=>{seen.push(url);return new Promise(()=>{});}});
 controller.abort();const result=await run;assert.deepEqual(seen,['a']);assert.equal(result.completed,0);
});
test('editorial fonts use WOFF2 with immediate fallback and valid font headers',async()=>{
 const css=await readFile(new URL('../dist/figma-board.css',import.meta.url),'utf8');
 for(const name of ['Arimo-400','Arimo-700','IBMPlexMono-400','IBMPlexMono-700','Anton-Regular']){
  const block=css.split('@font-face').find(b=>b.includes(name));assert.match(block,/font-display:\s*swap/);assert.match(block,new RegExp(name+'\\.woff2'));
  const font=await readFile(new URL('../dist/assets/figma-fonts/'+name+'.woff2',import.meta.url));assert.equal(font.subarray(0,4).toString(),'wOF2');
 }
});

test('every font-display declaration is separated from its preceding font descriptor',async()=>{
 const {readdir}=await import('node:fs/promises');
 for(const name of await readdir(new URL('../dist/',import.meta.url))){
  if(!/\.(css|html)$/.test(name))continue;
  const source=await readFile(new URL('../dist/'+name,import.meta.url),'utf8');
  for(const [block] of source.matchAll(/@font-face\s*\{[^}]+\}/g))if(block.includes('font-display'))assert.match(block,/[;{]\s*font-display\s*:/,name+': '+block);
 }
});
