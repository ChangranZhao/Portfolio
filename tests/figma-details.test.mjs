import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {figmaPages} from '../dist/figma-page-data.js';
test('the latest three case studies include all 44 pages in designer order',()=>{
 for(const [prefix,count] of [['2',18],['3',14],['4',12]])assert.deepEqual(figmaPages.filter(p=>p.name.startsWith(prefix+'_')).map(p=>p.name),Array.from({length:count},(_,i)=>`${prefix}_page${i+1}`));
 assert.equal(new Set(figmaPages.map(p=>p.id)).size,44);
});
test('each page contains selectable text and nonempty local original assets',async()=>{
 for(const f of figmaPages){const url=new URL('../dist/'+f.page,import.meta.url),html=await readFile(url,'utf8');assert.match(html,/<p[ >]/,f.name);assert.doesNotMatch(html,/https:\/\/www\.figma\.com\/api\/mcp\/asset|className=|src=\{|style=\{/,f.name);
  for(const [,asset] of html.matchAll(/src="([^"]+)"/g))assert.ok((await stat(new URL(asset,url))).size>0,asset);
 }
});
