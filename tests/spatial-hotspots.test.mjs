import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {prepareDiagram} from '../dist/project-spatial-design.js';

test('both floors expose explicit view controls, translated labels and the original exhibit routes',()=>{
 const dom=new JSDOM('<html lang="en"><body></body></html>');const before=globalThis.document;globalThis.document=dom.window.document;
 try{
  for(const floor of [1,2]){
   const opens=[],diagram=prepareDiagram(()=>{},floor,(id)=>opens.push(id)),buttons=[...diagram.drawing.querySelectorAll('.sp-point')];
   assert.equal(buttons.length,floor===1?10:14);
   assert.equal(diagram.drawing.querySelectorAll('.sp-blinking-marker').length,0);
   for(const button of buttons){assert.equal(button.querySelector('.sp-point-action').textContent,'View ↗');assert.match(button.getAttribute('aria-label'),/Click to view/);assert.ok(button.querySelector('.sp-point-tooltip').textContent.length>20);button.click();assert.equal(opens.at(-1),button.dataset.exhibit);}
   document.documentElement.lang='zh-CN';diagram.translate();assert.equal(buttons[0].querySelector('.sp-point-action').textContent,'查看 ↗');document.documentElement.lang='en';
  }
 }finally{globalThis.document=before;dom.window.close()}
});
