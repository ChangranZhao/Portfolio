import test from 'node:test';
import assert from 'node:assert/strict';
import {awardRecords,exhibitionRecords,innovationRecords,awards,exhibitions,publications} from '../dist/profile-data.js';
import {projects} from '../dist/data.js';
import {awardDetails} from '../dist/award-details.js';
import {readFileSync,existsSync} from 'node:fs';

test('awards follow Word priority order and every award has complete local detail assets',()=>{
 const source=JSON.parse(readFileSync(new URL('../docs/profile-records-audit.json',import.meta.url),'utf8'));
 assert.deepEqual(awardRecords.map(r=>r.id),source.records.map(r=>r.id).filter(id=>awardRecords.some(r=>r.id===id)));
 for(const r of awardRecords){
  const d=awardDetails[r.id];assert.ok(d,r.id);
  for(const key of ['description','about'])for(const lang of ['en','zh'])assert.ok(d[key][lang].length>20,r.id+' '+key+' '+lang);
  for(const src of [d.certificate.src,d.identity.src])assert.ok(existsSync(new URL('../dist/'+src,import.meta.url)),src);
  assert.ok(d.identity.x>=0&&d.identity.y>=0&&d.identity.x+d.identity.w<=1&&d.identity.y+d.identity.h<=1,r.id+' identity crop');
 }
 assert.equal(awardDetails['icad-tree'].certificate.src,'assets/awards/icad-echo.webp');
 assert.equal(awardDetails['icad-echo'].certificate.src,'assets/awards/icad-tree.webp');
});

test('all 36 checklist records are represented once in the right category',()=>{
 assert.equal(awardRecords.length,29);
 assert.equal(innovationRecords.length,4);
 for(const id of ['chinavis','chinesechi','icme']) assert.equal(exhibitionRecords.filter(r=>r.id===id).length,1);
 assert.equal(awards.length,awardRecords.length);
 assert.equal(exhibitions.length,exhibitionRecords.length);
 const all=[...awardRecords,...exhibitionRecords,...innovationRecords];
 assert.equal(new Set(all.map(r=>r.id)).size,all.length);
 for(const record of all){
  for(const field of ['title','result','work']) for(const lang of ['zh','en']) assert.equal(typeof record[field][lang],'string');
  if(record.projectId) assert.ok(projects.some(p=>p.id===record.projectId),record.id);
 }
});
test('corrected award status, project associations and date precision stay intact',()=>{
 const get=id=>awardRecords.find(r=>r.id===id);
 assert.match(get('paris').result.en,/Nomination/);
 assert.equal(get('muse-echo').result.zh,'金奖 · 公共艺术装置');
 assert.equal(get('muse-gaia').result.zh,'银奖 · 公共艺术装置');
 assert.equal(get('usda').work.en,'MecHabolism');
 assert.equal(get('usda').projectId,undefined);
 assert.equal(get('metaverse').date,'');
 assert.equal(get('metaverse').work.zh,'末日薯光');
 assert.equal(get('jingcai-museum').date,'2024.06');
 assert.equal(get('aaia').result.zh,'入围（三等奖）');
 assert.ok(get('aaia').note.zh);
 assert.equal(get('muse-home').date,'2025');
 assert.equal(exhibitionRecords.find(r=>r.id==='chinavis').date,'2026.07.19–22');
 assert.ok(publications.some(([title])=>title.startsWith('Homeward Memories:')));
});
