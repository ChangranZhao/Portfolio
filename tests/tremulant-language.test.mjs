import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../dist/data.js';
import {localizeText,setGlobalLanguage} from '../dist/localization.js';

test('Tremulant introduction follows English, simplified and traditional language settings',()=>{
 globalThis.document={documentElement:{},body:{nodeType:0}};
 const paragraphs=projects.find(p=>p.id==='p5').introduction.split(/\r?\n\s*\r?\n/);
 assert.equal(paragraphs.length,2);
 for(const language of ['en','zh','zh-Hant','en']){
  setGlobalLanguage(language);
  const text=paragraphs.map(localizeText).join('\n\n');
  if(language==='en'){
   assert.match(text,/artificial intelligence/);
   assert.doesNotMatch(text,/[\u3400-\u9fff]/);
  }else if(language==='zh')assert.match(text,/该装置通过接入人工智能/);
  else assert.match(text,/該裝置通過接入人工智能/);
 }
 delete globalThis.document;
});
