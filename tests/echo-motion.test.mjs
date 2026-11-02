import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {setupEchoMotion} from '../dist/echo-motion.js';
const files=['58-740','58-641','58-516','58-472'];
for(const file of files)test(`Echo ${file} reveals once without moving or replacing original content`,()=>{
 const dom=new JSDOM(readFileSync(`dist/figma-pages/${file}.html`,'utf8'),{pretendToBeVisual:true}),doc=dom.window.document;
 let enter;dom.window.IntersectionObserver=class{constructor(cb){enter=cb}observe(){}disconnect(){}};
 const abort=new dom.window.AbortController(),source=[...doc.querySelectorAll('[data-node-id]')].map(n=>[n,n.style.cssText,n.textContent]);
 try{
  setupEchoMotion(doc,doc.body,doc.body,abort.signal,()=>false);
  const pieces=[...doc.querySelectorAll('.echo-album-piece')];assert.ok(pieces.length>5);
  assert.ok(pieces.every(n=>parseFloat(n.style.getPropertyValue('--echo-delay'))+1.3<=9));
  assert.equal(doc.body.classList.contains('echo-album-playing'),false);
  enter([{isIntersecting:true,intersectionRatio:1}]);assert.ok(doc.body.classList.contains('echo-album-playing'));
  const css=doc.head.lastElementChild.textContent;assert.doesNotMatch(css,/translate|scale|infinite/);
  abort.abort();assert.equal(doc.querySelectorAll('.echo-album-piece').length,0);
  for(const [node,style,text] of source){assert.equal(node.style.cssText,style);assert.equal(node.textContent,text);}
 }finally{abort.abort();dom.window.close();}
});
test('Echo documentation spreads and reduced motion stay immediately visible',()=>{
 for(const [file,reduced] of [['58-311',false],['58-675',false],['58-740',true]]){
  const dom=new JSDOM(readFileSync(`dist/figma-pages/${file}.html`,'utf8')),doc=dom.window.document,abort=new dom.window.AbortController();
  try{setupEchoMotion(doc,doc.body,doc.body,abort.signal,()=>reduced);assert.equal(doc.querySelectorAll('.echo-album-piece').length,0);}finally{abort.abort();dom.window.close();}
 }
});
