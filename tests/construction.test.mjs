import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';

test('construction uses at least 80% of supplied photos and preserves original files',async()=>{
 const moduleURL=new URL('../dist/construction-assets.js',import.meta.url);
 const exists=await readFile(moduleURL).catch(()=>null);
 assert.ok(exists,'Construction needs a source manifest for the supplied photographs');
 const {constructionPhotos}=await import(moduleURL.href);
 const root=new URL('../../素材/Project1_Wind_Blow_Front_the_East/Page6_Construction/',import.meta.url);
 const sources=[];
 for(const dir of await readdir(root,{withFileTypes:true}))if(dir.isDirectory()){
  for(const file of await readdir(new URL(dir.name+'/',root)))if(/\.jpg$/i.test(file))sources.push(dir.name+'/'+file);
 }
 assert.ok(constructionPhotos.length>=Math.ceil(sources.length*.8));
 assert.equal(new Set(constructionPhotos.map(p=>p.source)).size,constructionPhotos.length);
 const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
 for(const p of constructionPhotos){
  assert.ok(sources.includes(p.source),p.source);
  assert.equal(hash(await readFile(new URL('../dist/'+p.src,import.meta.url))),hash(await readFile(new URL(p.source,root))));
  assert.ok((await readFile(new URL('../dist/'+p.preview,import.meta.url))).length>0);
  assert.ok(p.width>0&&p.height>0);
 }
 assert.deepEqual([...new Set(constructionPhotos.map(p=>p.stage))],[1,2,3]);
});
