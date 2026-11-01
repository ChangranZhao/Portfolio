import test from 'node:test';
import assert from 'node:assert/strict';
import {projects} from '../dist/data.js';
import {localizeText,setGlobalLanguage,setLocalizedAttribute} from '../dist/localization.js';

test('dynamic window attributes immediately follow the current language',async()=>{
 globalThis.document={documentElement:{},body:{nodeType:0}};
 const attrs=new Map(),el={setAttribute:(k,v)=>attrs.set(k,v)};
 setGlobalLanguage('zh');setLocalizedAttribute(el,'aria-label','GAIA HYPOTHESIS');assert.equal(attrs.get('aria-label'),'盖亚假说');
 setGlobalLanguage('en');setLocalizedAttribute(el,'aria-label','GAIA HYPOTHESIS');assert.equal(attrs.get('aria-label'),'GAIA HYPOTHESIS');
 await new Promise(resolve=>setTimeout(resolve,0));delete globalThis.document;
});

test('Tremulant introduction follows English, simplified and traditional language settings',async()=>{
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
 // Language traversal now yields between batches; let the scheduled fixture job finish.
 await new Promise(resolve=>setTimeout(resolve,0));
 delete globalThis.document;
});
