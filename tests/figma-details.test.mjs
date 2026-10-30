import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {figmaPages} from '../dist/figma-page-data.js';
test('the three case studies retain 44 boards and the three film chapters in designer order',()=>{
 for(const [prefix,count] of [['2',18],['3',14],['4',12]]){
  const expected=Array.from({length:count},(_,i)=>`${prefix}_page${i+1}`);
  if(prefix==='2')for(const [after,film] of [['2_page2','2_film'],['2_page10','2_ui_film'],['2_page12','2_prototype_film']])expected.splice(expected.indexOf(after)+1,0,film);
  assert.deepEqual(figmaPages.filter(p=>p.name.startsWith(prefix+'_')).map(p=>p.name),expected);
 }
 assert.equal(new Set(figmaPages.map(p=>p.id)).size,47);
});
test('each page contains selectable text and nonempty local original assets',async()=>{
 for(const f of figmaPages){const url=new URL('../dist/'+f.page,import.meta.url),html=await readFile(url,'utf8');
  if(f.name.endsWith('film')){assert.match(html,/data-title="[^"]+"/,f.name);assert.match(html,/data-youtube-src="https:\/\/www\.youtube-nocookie\.com\/embed\//,f.name);assert.doesNotMatch(html,/<iframe\b/,f.name);assert.match(html,/mountYouTubeFacades\(\)/,f.name);}
  else assert.match(html,/<p[ >]/,f.name);
  assert.doesNotMatch(html,/https:\/\/www\.figma\.com\/api\/mcp\/asset|className=|src=\{|style=\{/,f.name);
  for(const [,asset] of html.matchAll(/\s(?:src|data-poster)="([^"]+)"/g))assert.ok((await stat(new URL(asset,url))).size>0,asset);
 }
});
