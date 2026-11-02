import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import sharp from 'sharp';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {optimizeZiboReading,readingImages} from '../dist/zibo-reading.js';

test('Zibo reading uses bounded copies while retaining original assets for enlargement',async()=>{
 const dom=new JSDOM('<article><img src="assets/culture/industry-01.webp"><svg><image href="assets/construction-originals/01-01.webp"/></svg></article>');
 const root=dom.window.document.querySelector('article');optimizeZiboReading(root);
 assert.match(root.querySelector('img').getAttribute('src'),/zibo-reading/);assert.equal(root.querySelector('img').dataset.readingOriginal,'assets/culture/industry-01.webp');
 assert.match(root.querySelector('image').getAttribute('href'),/zibo-reading/);
 const original=await sharp(await readFile('dist/assets/culture/industry-01.webp')).metadata(),preview=await sharp(await readFile('dist/'+readingImages['assets/culture/industry-01.webp'])).metadata();
 assert.ok(preview.width<=480);assert.ok(preview.width*preview.height<original.width*original.height*.25);
 assert.ok(await readFile('dist/assets/culture/industry-01.webp'));dom.window.close();
});

test('embedded culture starts suspended, remembers activity across rerenders and pauses CSS while scrolling',async()=>{
 const listeners={},messages=[],classes=new Set(),parent={postMessage:m=>messages.push(m)},doc={hidden:false,documentElement:{classList:{toggle:(c,on)=>on?classes.add(c):classes.delete(c)}},addEventListener:(name,fn)=>listeners[name]=fn};
 const context={window:{parent,addEventListener:(name,fn)=>listeners[name]=fn},parent,document:doc,location:{origin:'http://local'}};
 vm.runInNewContext((await readFile('culture-source/host-activity.js','utf8')).replace('export const hostActivity','var hostActivity'),context);
 assert.equal(context.hostActivity.active,false);assert.ok(classes.has('culture-host-paused'));assert.equal(messages[0].type,'portfolio-culture-ready');
 const send=data=>listeners.message({source:parent,origin:'http://local',data});send({type:'portfolio-culture-active',active:true});assert.equal(classes.size,0);
 send({type:'portfolio-culture-scrolling',scrolling:true});assert.ok(classes.has('culture-host-paused'));assert.equal(context.hostActivity.scrolling,true);
 send({type:'portfolio-culture-scrolling',scrolling:false});assert.equal(classes.size,0);send({type:'portfolio-culture-active',active:false});assert.equal(context.hostActivity.active,false);
});
