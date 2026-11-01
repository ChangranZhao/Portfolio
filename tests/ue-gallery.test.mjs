import test from 'node:test';import assert from 'node:assert/strict';
import {galleryExhibits,canWalk,moveVisitor,guideRoute,partitions} from '../src/ue-gallery/model.js';
const projects=Array.from({length:14},(_,i)=>({id:'p'+(i+1)}));
test('14 projects receive distinct reachable wall exhibits and camera poses',()=>{const exhibits=galleryExhibits(projects);assert.equal(exhibits.length,14);assert.equal(new Set(exhibits.map(e=>e.position.join(':'))).size,14);for(const e of exhibits)assert.ok(canWalk(e.view.x,e.view.z))});
test('movement respects gallery walls, offset partitions and display furniture',()=>{assert.equal(canWalk(15,0),false);assert.equal(canWalk(-3,-6),false);assert.equal(canWalk(8,0),false);assert.equal(canWalk(-1,0),true);assert.equal(canWalk(3,-12),true);const p={x:13,z:7};for(let i=0;i<60;i++)moveVisitor(p,1,0,1/60);assert.ok(p.x<=13.2);for(const r of partitions)assert.equal(canWalk(r.x,r.z),false)});
test('guided routes go around every table and reach all exhibit viewing points',()=>{let from={x:0,z:9};for(const e of galleryExhibits(projects)){const path=guideRoute(from,e.view);assert.ok(path.length);assert.ok(path.every(p=>canWalk(p.x,p.z)));const target=path.at(-1);assert.equal(target.x,e.view.x);assert.equal(target.z,e.view.z);from=target}});

test('guided paths bend through the staggered gallery doorways',()=>{const path=guideRoute({x:0,z:9},{x:10,z:-25});assert.ok(path.some(p=>p.z===0&&p.x>=-3&&p.x<=1));assert.ok(path.some(p=>p.z===-12&&p.x>=1&&p.x<=5))});
