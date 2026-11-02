import test from 'node:test';import assert from 'node:assert/strict';
import {chooseHotspotOffset} from '../dist/spatial-hotspot-layout.js';
const overlaps=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
test('spatial control moves away from a two-line exhibit label including the View badge',()=>{
 const text={left:495,right:950,top:500,bottom:560},result=chooseHotspotOffset({x:500,y:500},[text]);assert.equal(overlaps(result.box,text),false);assert.ok(Math.hypot(result.x,result.y)<=270);
});
test('clear controls keep their original anchor and translated longer labels are avoided',()=>{
 assert.deepEqual(chooseHotspotOffset({x:500,y:500},[]).x,0);
 const texts=[{left:420,right:1100,top:450,bottom:520},{left:490,right:1000,top:530,bottom:580}];const result=chooseHotspotOffset({x:500,y:500},texts);assert.ok(texts.every(t=>!overlaps(result.box,t)));
});
