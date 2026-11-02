import test from 'node:test';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';import {installProjectImageRecovery} from '../dist/project-image-recovery.js';
test('a failed same-origin image retries once without remounting the page, and close cancels pending retries',()=>{
 const dom=new JSDOM('<article><img src="/broken.webp"><img src="/later.webp"></article>',{url:'http://localhost'}),doc=dom.window.document,root=doc.querySelector('article'),images=[...root.querySelectorAll('img')],timers=[];
 dom.window.setTimeout=(fn)=>{timers.push(fn);return timers.length;};const cancelled=[];dom.window.clearTimeout=id=>cancelled.push(id);
 for(const img of images){Object.defineProperty(img,'complete',{value:true});Object.defineProperty(img,'naturalWidth',{value:0});}
 const dispose=installProjectImageRecovery(root);assert.equal(timers.length,2);timers[0]();assert.equal(images[0].src,'http://localhost/broken.webp?_image_retry=1');images[0].dispatchEvent(new dom.window.Event('error'));assert.equal(timers.length,2);dispose();assert.ok(cancelled.includes(2));assert.equal(root.querySelectorAll('img').length,2);dom.window.close();
});
