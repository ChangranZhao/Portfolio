import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {prepareProject,runPreloadTasks} from '../dist/project-preload.js';
import {showProjectLoading} from '../dist/project-loading.js';

test('preparation bounds concurrency, reports completed work and continues after a failed task',async()=>{
 let active=0,peak=0;const progress=[];
 const tasks=Array.from({length:9},(_,i)=>async()=>{active++;peak=Math.max(peak,active);await new Promise(r=>setTimeout(r,2));active--;if(i===3)throw new Error('Missing image');});
 const failed=await runPreloadTasks(tasks,{concurrency:3,onProgress:(done,total)=>progress.push([done,total])});
 assert.equal(peak,3);assert.equal(failed.length,1);assert.deepEqual(progress.at(-1),[9,9]);
});

test('closing a preparation stops queued work',async()=>{
 const controller=new AbortController();let count=0;
 const jobs=Array.from({length:10},()=>async()=>{count++;controller.abort();});
 await assert.rejects(runPreloadTasks(jobs,{concurrency:1,signal:controller.signal}),{name:'AbortError'});
 assert.equal(count,1);
});

test('SVG paint-server fragments are not treated as downloadable images',async()=>{
 const dom=new JSDOM('<article><svg><rect style="fill:url(%23grad)"></rect><rect style="fill:url(#grad)"></rect></svg></article>',{url:'http://localhost/project.html'});
 assert.deepEqual(await prepareProject(dom.window.document.querySelector('article'),{timeout:20}),[]);
 dom.window.close();
});

test('all lazy photos prepare and a broken image remains a retryable failure',async()=>{
 const dom=new JSDOM('<article><img src="/one.webp" loading="lazy"><img src="/two.webp" loading="lazy"><iframe src="https://youtube.com/embed/example"></iframe><iframe src="/paper.pdf"></iframe></article>',{url:'http://localhost'});
 const article=dom.window.document.querySelector('article'),images=[...article.querySelectorAll('img')];
 let bad=true;for(const [i,img] of images.entries()){
  Object.defineProperty(img,'complete',{get:()=>true});Object.defineProperty(img,'naturalWidth',{get:()=>i===1&&bad?0:600});
  img.decode=async()=>{if(i===1&&bad)throw new Error('bad image')};
 }
 const failed=await prepareProject(article,{timeout:100});assert.equal(failed.length,1);assert.equal(failed[0].url,'http://localhost/two.webp');
 assert.ok(images.every(img=>img.loading==='eager'));bad=false;
 assert.deepEqual(await prepareProject(article,{timeout:100}),[]);
 dom.window.close();
});

test('an unopened board is requested, then its images and fonts settle before ready',async()=>{
 const dom=new JSDOM('<article><iframe data-project-board-src="/board.html"></iframe></article>',{url:'http://localhost'});
 const root=dom.window.document.querySelector('article'),frame=root.querySelector('iframe');let decoded=false,fontReady=false;
 root.addEventListener('portfolio-project-preload',()=>{
  frame.src='/board.html';const doc=frame.contentDocument;doc.open();doc.write('<html><body><img src="/board.webp"></body></html>');doc.close();
  Object.defineProperty(doc,'readyState',{value:'complete'});Object.defineProperty(doc.images[0],'complete',{value:true});Object.defineProperty(doc.images[0],'naturalWidth',{value:400});doc.images[0].decode=async()=>{decoded=true};
  Object.defineProperty(doc,'fonts',{value:{ready:Promise.resolve().then(()=>{fontReady=true})}});
  frame.dispatchEvent(new dom.window.Event('load'));
 });
 assert.deepEqual(await prepareProject(root,{timeout:100}),[]);assert.equal(decoded,true);assert.equal(fontReady,true);assert.ok(frame.isConnected);
 dom.window.close();
});

test('a board waiting in the initialization queue does not consume its network timeout',async()=>{
 const dom=new JSDOM('<article><iframe data-project-board-src="/later.html"></iframe></article>',{url:'http://localhost'}),root=dom.window.document.querySelector('article'),frame=root.querySelector('iframe');
 const ready=prepareProject(root,{timeout:15});
 await new Promise(resolve=>setTimeout(resolve,35));
 frame.src='/later.html';const child=frame.contentDocument;child.open();child.write('<html><body>Ready</body></html>');child.close();Object.defineProperty(child,'readyState',{value:'complete'});
 frame.dispatchEvent(new dom.window.Event('portfolio-board-loading'));frame.dispatchEvent(new dom.window.Event('load'));
 assert.deepEqual(await ready,[]);dom.window.close();
});

test('reading is gated until image decoding finishes and the gate releases activity exactly once',async()=>{
 const dom=new JSDOM('<div class="case-reader"><nav class="case-chapters"></nav><article class="case-article"><img src="/cover.webp"></article></div>',{url:'http://localhost'});
 const root=dom.window.document.querySelector('.case-reader'),image=root.querySelector('article img');let finish;
 Object.defineProperty(image,'naturalWidth',{value:500});image.decode=()=>new Promise(resolve=>{finish=resolve});
 let ready=0;const completion=new Promise(resolve=>root.addEventListener('portfolio-project-ready',()=>{ready++;resolve()},{once:true}));
 const dispose=showProjectLoading(root,{title:'Example',images:[{small:'/small.webp'}]});
 assert.equal(root.classList.contains('case-preparing'),true);assert.ok(root.querySelector('.project-loading'));assert.equal(root.querySelector('article').getAttribute('aria-hidden'),'true');
 while(!finish)await new Promise(r=>setTimeout(r,1));assert.equal(ready,0);finish();await completion;
 assert.equal(ready,1);assert.equal(root.classList.contains('case-preparing'),false);assert.equal(root.querySelector('.project-loading'),null);assert.equal(root.querySelector('article').hasAttribute('aria-hidden'),false);
 assert.equal(root.querySelector('article img'),image,'The reading content stays mounted');
 dispose();dom.window.close();
});

test('closing the loading surface cancels preparation and cannot reveal a closed reader later',async()=>{
 const dom=new JSDOM('<div class="case-reader"><article class="case-article"><img src="/slow.webp"></article></div>',{url:'http://localhost'}),root=dom.window.document.querySelector('.case-reader'),image=root.querySelector('img');let finish,ready=0;
 Object.defineProperty(image,'naturalWidth',{value:500});image.decode=()=>new Promise(resolve=>{finish=resolve});root.addEventListener('portfolio-project-ready',()=>ready++);
 const dispose=showProjectLoading(root,{title:'Example',images:[]});while(!finish)await new Promise(r=>setTimeout(r,1));dispose();finish();await new Promise(r=>setTimeout(r,5));
 assert.equal(ready,0);assert.equal(root.querySelector('.project-loading'),null);dom.window.close();
});

test('a failed image does not silently enter reading; retry prepares it before revealing',async()=>{
 const dom=new JSDOM('<div class="case-reader"><article class="case-article"><img src="/missing.webp"></article></div>',{url:'http://localhost'});
 const root=dom.window.document.querySelector('.case-reader'),image=root.querySelector('article img');let broken=true;
 Object.defineProperty(image,'naturalWidth',{get:()=>broken?0:500});image.decode=async()=>{if(broken)throw new Error('offline')};
 const dispose=showProjectLoading(root,{title:'Example',images:[]});
 while(root.querySelector('.project-loading-actions').hidden)await new Promise(r=>setTimeout(r,1));
 assert.equal(root.classList.contains('case-preparing'),true);broken=false;
 const completion=new Promise(resolve=>root.addEventListener('portfolio-project-ready',resolve,{once:true}));root.querySelector('.project-loading-retry').click();await completion;
 assert.equal(root.querySelector('.project-loading'),null);dispose();dom.window.close();
});
