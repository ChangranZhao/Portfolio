import {test} from 'node:test';
import assert from 'node:assert/strict';
const module = await import('../dist/state.mjs').catch(()=>({}));
test('reopening a minimized project restores its existing window',()=>{
  assert.equal(typeof module.WindowState,'function','Window state must be implemented');
  const s=new module.WindowState(); s.open('p1');s.minimize('p1');s.open('p1');
  assert.equal(s.items.size,1);assert.equal(s.items.get('p1').minimized,false);
});
test('closing the front window focuses the next visible window',()=>{
  assert.equal(typeof module.WindowState,'function');
  const s=new module.WindowState();s.open('p1');s.open('p2');s.close('p2');
  assert.equal(s.active,'p1');assert.equal(s.items.has('p2'),false);
});
test('minimizing the only window leaves no active invisible window',()=>{
  assert.equal(typeof module.WindowState,'function');
  const s=new module.WindowState();s.open('p1');s.minimize('p1');assert.equal(s.active,null);
});
test('window coordinates remain reachable in small and large viewports',()=>{
  assert.equal(typeof module.clampPosition,'function');
  assert.deepEqual(module.clampPosition(-900,-800,800,600,1440,900),{x:0,y:38});
  assert.deepEqual(module.clampPosition(2000,2000,800,600,1440,900),{x:640,y:270});
  assert.deepEqual(module.clampPosition(500,500,800,600,390,700),{x:0,y:70});
});
