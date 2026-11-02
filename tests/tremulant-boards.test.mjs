import test from 'node:test';import assert from 'node:assert/strict';import {JSDOM} from 'jsdom';
import {createTremulantProject} from '../dist/tremulant-project.js';import {projects} from '../dist/data.js';
test('seven Tremulant boards have selectable English text, retained photography and documented hardware',()=>{
 const dom=new JSDOM('<article></article>'),previous=globalThis.document;globalThis.document=dom.window.document;
 try{const root=document.querySelector('article');createTremulantProject(root,projects.find(p=>p.id==='p5'),()=>{});
 assert.equal(root.querySelectorAll('.to-board').length,7);assert.doesNotMatch(root.textContent,/[\u3400-\u9fff]/);assert.match(root.textContent,/149/);assert.match(root.textContent,/25 electromagnets/);assert.match(root.textContent,/MOSFET/);
 assert.equal(root.querySelectorAll('.to-photo-archive img').length,8);assert.ok(root.querySelectorAll('.to-board h2').length>=6);assert.equal(root.querySelectorAll('.to-original-chinese').length,0);
 }finally{globalThis.document=previous;dom.window.close()}
});
