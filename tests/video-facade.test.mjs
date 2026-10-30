import test from 'node:test';
import assert from 'node:assert/strict';
import {createYouTubeFacade} from '../dist/video-facade.js';

class Element extends EventTarget{
 constructor(tag,doc){super();this.tagName=tag;this.ownerDocument=doc;this.children=[];this.attributes={};this.style={};}
 setAttribute(key,value){this.attributes[key]=value;}
 append(...nodes){this.children.push(...nodes);}
 replaceWith(node){this.replacement=node;}
}
test('a video cover makes no player request before click and activates once with autoplay',()=>{
 const doc={createElement(tag){return new Element(tag,doc);}},frame=new Element('iframe',doc);
 frame.src='https://www.youtube-nocookie.com/embed/abc123';frame.title='Project video';
 let calls=0;const cover=createYouTubeFacade(frame,{poster:'assets/cover.webp',connect(f){calls++;assert.equal(f,frame);}});
 assert.equal(calls,0);assert.equal(cover.children.some(n=>n.tagName==='iframe'),false);
 assert.equal(cover.children.find(n=>n.tagName==='img').src,'assets/cover.webp');
 cover.dispatchEvent(new Event('click'));cover.dispatchEvent(new Event('click'));
 assert.equal(calls,1);assert.equal(cover.replacement,frame);
 assert.equal(new URL(frame.src).searchParams.get('autoplay'),'1');
});
