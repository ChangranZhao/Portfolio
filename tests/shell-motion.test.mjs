import test from 'node:test';
import assert from 'node:assert/strict';
import {dockTargets,dockSurface,fittedDockTargets,animateWindow,animateWindowLayout,cancelWindowMotion} from '../dist/shell-motion.js';

test('opening holds its first frame until layout has had a paint opportunity',()=>{
 const queue=new Map();let id=0,played=0,paused=0;
 const oldRAF=globalThis.requestAnimationFrame,oldCancel=globalThis.cancelAnimationFrame;
 globalThis.requestAnimationFrame=fn=>(queue.set(++id,fn),id);globalThis.cancelAnimationFrame=id=>queue.delete(id);
 try{
  const animation={currentTime:null,pause(){paused++},play(){played++},cancel(){},onfinish:null};
  const el={isConnected:true,getBoundingClientRect:()=>({left:0,top:0,width:900,height:600}),animate:()=>animation};
  animateWindow(el,'open',null,{readStyle:()=>({transform:'none',opacity:1})});
  assert.equal(paused,1);assert.equal(animation.currentTime,0);assert.equal(played,0);
  const flush=()=>{const batch=[...queue.values()];queue.clear();batch.forEach(fn=>fn());};
  flush();assert.equal(played,0);flush();assert.equal(played,1);
  cancelWindowMotion(el);animateWindow(el,'open',null,{readStyle:()=>({transform:'none',opacity:1})});
  flush();cancelWindowMotion(el);flush();assert.equal(played,1);assert.equal(queue.size,0);
 }finally{globalThis.requestAnimationFrame=oldRAF;globalThis.cancelAnimationFrame=oldCancel;}
});
test('magnified Dock and its base fit available room at every viewport size',()=>{
 const items=Array.from({length:14},(_,i)=>({center:24+i*60,width:48}));
 for(const width of [800,1024,1440,1920])for(const room of [0,15,50,200])for(const pointer of [24,400,804,null]){
  const result=fittedDockTargets(items,pointer,{viewportWidth:width,viewportHeight:1080,room});
  assert.ok(dockSurface(items,result).expand<=room+1e-8);
  assert.ok(result.every(v=>v.scale>=1&&v.scale<=1.8&&v.y===0));
 }
});
test('Dock magnification uses half the reference effect width as its radius',()=>{
 const items=[0,64,128,192,256].map(center=>({center,width:48}));
 const result=fittedDockTargets(items,128,{viewportWidth:1280,viewportHeight:720,room:200});
 assert.equal(result[0].scale,1,'icons outside the 252px-wide influence stay at rest');
 assert.equal(result[4].scale,1);
 assert.equal(result[2].scale,1.5);
 assert.ok(result[1].scale>1&&result[1].scale<1.3);
});
test('Dock surface and separators follow the same interpolated icon widths',()=>{
 const items=[{center:20,width:40},{center:70,width:40},{center:120,width:40}];
 const current=dockTargets(items,70,100,1.4);
 const surface=dockSurface(items,current,[45,95]);
 assert.ok(Math.abs(surface.expand-16)<1e-8);
 assert.ok(Math.abs(surface.separators[0]+8)<1e-8);assert.ok(Math.abs(surface.separators[1]-8)<1e-8);
 assert.deepEqual(dockSurface(items,dockTargets(items,null),[45,95]),{expand:0,separators:[0,0]});
 const halfway=current.map(v=>({...v,scale:1+(v.scale-1)/2}));
 assert.ok(Math.abs(dockSurface(items,halfway,[]).expand-8)<1e-8);
});
test('Dock grows smoothly around pointer, remains symmetric and resets outside its range',()=>{
 const items=[{center:20,width:40},{center:70,width:40},{center:120,width:40}];
 const t=dockTargets(items,70,100,1.4);
 assert.equal(t[1].scale,1.4);assert.equal(t[0].scale,t[2].scale);
 assert.ok(Math.abs(t[0].x+t[2].x)<1e-8);assert.equal(t[1].x,0);
 assert.ok(t.every(v=>v.scale>=1&&v.scale<=1.4));
 assert.deepEqual(dockTargets(items,null),items.map(()=>({scale:1,x:0,y:0})));
 const near=dockTargets(items,70.01,100,1.4);assert.ok(Math.abs(near[1].scale-t[1].scale)<.001);
});
test('reversing a window cancels stale completion without removing content',()=>{
 const made=[],el={getBoundingClientRect:()=>({left:100,top:100,width:600,height:400}),animate(frames,options){const a={frames,options,cancel(){this.cancelled=true;},onfinish:null};made.push(a);return a;}};
 let hidden=0,restored=0;
 animateWindow(el,'minimize',{left:500,top:700,width:40,height:40},{onFinish:()=>hidden++,readStyle:()=>({transform:'none',opacity:'1'})});
 const stale=made[0].onfinish;
 animateWindow(el,'restore',{left:500,top:700,width:40,height:40},{onFinish:()=>restored++,readStyle:()=>({transform:'matrix(1,0,0,1,0,0)',opacity:'.7'})});
 stale();assert.equal(hidden,0);assert.equal(made[0].cancelled,true);
 made[1].onfinish();assert.equal(restored,1);
 assert.equal(made[1].frames.at(-1).transform,'none');
});
test('closing during minimize or restore cancels the previous completion',()=>{
 for(const kind of ['minimize','restore']){
  const made=[],el={getBoundingClientRect:()=>({left:100,top:100,width:600,height:400}),animate(){const a={cancel(){this.cancelled=true;}};made.push(a);return a;}};
  let staleFinished=0,closed=0;
  const readStyle=()=>({transform:'none',opacity:'.7'});
  animateWindow(el,kind,null,{readStyle,onFinish:()=>staleFinished++});
  const stale=made[0].onfinish;
  animateWindow(el,'close',null,{readStyle,onFinish:()=>closed++});
  stale();assert.equal(staleFinished,0);assert.equal(made[0].cancelled,true);
  made[1].onfinish();assert.equal(closed,1);assert.equal(made[1].cancelled,true);
 }
});
test('reduced motion completes window changes immediately without animation',()=>{
 let finished=0;animateWindow({},'minimize',null,{reduced:true,onFinish:()=>finished++});assert.equal(finished,1);
});
test('opening fades and expands to its final size',()=>{
 let frames,options;
 const el={getBoundingClientRect:()=>({left:0,top:0,width:600,height:400}),animate(f,o){frames=f;options=o;return {cancel(){}};}};
 animateWindow(el,'open',null,{readStyle:()=>({transform:'none',opacity:1})});
 assert.equal(frames[0].opacity,0);assert.match(frames[0].transform,/scale\(0\.95\)/);
 assert.equal(frames[1].transform,'none');assert.ok(options.duration>=240);
});
test('bounds transitions preserve the visible starting rectangle and cancel stale motion',()=>{
 let rect={left:100,top:80,width:600,height:400},done=0;const made=[];
 const el={getBoundingClientRect:()=>rect,animate(frames){const a={frames,cancel(){this.cancelled=true;}};made.push(a);return a;}};
 animateWindowLayout(el,()=>{rect={left:0,top:30,width:1200,height:700};},{onFinish:()=>done++});
 assert.match(made[0].frames[0].transform,/translate\(100px,50px\) scale\(0.5,/);
 const stale=made[0].onfinish;
 animateWindow(el,'close',null,{readStyle:()=>({transform:'none',opacity:1})});
 stale();assert.equal(done,0);assert.equal(made[0].cancelled,true);
 let changed=0;animateWindowLayout({},()=>changed++,{reduced:true});assert.equal(changed,1);
});
test('minimizing during a bounds transition retains its top-left transform origin',()=>{
 let frames;const el={getBoundingClientRect:()=>({left:0,top:30,width:1200,height:700}),animate(f){frames=f;return {cancel(){}};}};
 animateWindow(el,'minimize',{left:500,top:720,width:40,height:30},{readStyle:()=>({transform:'matrix(.5,0,0,.5,100,50)',transformOrigin:'0px 0px',opacity:'1'})});
 assert.equal(frames[0].transformOrigin,'0px 0px');assert.equal(frames[1].transformOrigin,'0px 0px');
 assert.match(frames[1].transform,/translate\(500px,690px\)/);
});
