import test from 'node:test';
import assert from 'node:assert/strict';
import {constructionWalk} from '../dist/construction-walk.js';

test('people follow closed routes parallel to both projected ground axes and stay inside the drawing',()=>{
 for(const [i,x,y] of [[0,170,955],[1,267,692],[2,482,932],[3,612,676],[4,739,878],[5,832,775],[6,993,1126],[7,1151,551],[8,1304,1015],[9,1366,421],[10,1567,1015],[11,1787,582]]){
  const walk=constructionWalk(i,x,y),p=walk.points;assert.deepEqual(p[0],p[4]);assert.ok(walk.duration>=28);
  for(let j=0;j<4;j++){
   const dx=p[j+1][0]-p[j][0],dy=p[j+1][1]-p[j][1];assert.ok(Math.abs(dy/dx-(j%2?.62/.83:-.37/1.17))<1e-9);
   assert.ok(x+p[j][0]>22&&x+p[j][0]<1898);assert.ok(y+p[j][1]>125&&y+p[j][1]<1328);
  }
 }
});
