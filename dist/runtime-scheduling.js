// Coalesce high-frequency input, while committing the final event on release.
export function createFrameBatch(render,win=window){
 let frame=0,pending=false,value;
 const flush=()=>{if(frame)win.cancelAnimationFrame(frame);frame=0;if(pending){pending=false;render(value);}};
 return {push(next){value=next;pending=true;if(!frame)frame=win.requestAnimationFrame(flush);},flush,cancel(){if(frame)win.cancelAnimationFrame(frame);frame=0;pending=false;}};
}

export function createTaskQueue({schedule=fn=>setTimeout(fn,0),now=()=>performance.now(),maxSteps=120,budget=4,before=()=>{},after=()=>{}}={}){
 const jobs=[];let scheduled=false;
 const run=()=>{scheduled=false;const deadline=now()+budget;let steps=0;before();try{while(jobs.length&&steps++<maxSteps&&now()<deadline){if(jobs[0].next().done)jobs.shift();}}finally{after();}if(jobs.length)enqueue();};
 const enqueue=()=>{if(!scheduled){scheduled=true;schedule(run);}};
 return {add(iterator){jobs.push(iterator);enqueue();},clear(){jobs.length=0;}};
}

// Logical time stops with a retained board. Resume neither skips animation cues
// nor creates a backlog of callbacks after a long visit to another window/tab.
export function createActivityClock(doc,signal){
 const win=doc.defaultView,frames=new Map(),timers=new Map();
 const visible=()=>!doc.hidden&&!doc.body?.classList.contains('portfolio-board-paused');
 let active=visible(),elapsed=0,start=win.performance.now(),serial=0,disposed=false;
 const now=()=>elapsed+(active?win.performance.now()-start:0);
 function armFrame(id,job){job.handle=win.requestAnimationFrame(()=>{job.handle=0;frames.delete(id);if(!disposed&&active)job.fn(now());});}
 function armTimer(id,job){job.handle=win.setTimeout(()=>{job.handle=0;timers.delete(id);if(!disposed&&active)job.fn();},Math.max(0,job.due-now()));}
 const update=()=>{
  const next=visible();if(disposed||next===active)return;
  if(active)elapsed=now();active=next;start=win.performance.now();
  for(const [id,job] of frames){if(active)armFrame(id,job);else{win.cancelAnimationFrame(job.handle);job.handle=0;}}
  for(const [id,job] of timers){if(active)armTimer(id,job);else{win.clearTimeout(job.handle);job.handle=0;}}
 };
 const dispose=()=>{if(disposed)return;elapsed=now();active=false;disposed=true;for(const job of frames.values())win.cancelAnimationFrame(job.handle);for(const job of timers.values())win.clearTimeout(job.handle);frames.clear();timers.clear();doc.removeEventListener('visibilitychange',update);doc.removeEventListener('portfolio-board-activity',update);signal?.removeEventListener('abort',dispose);};
 doc.addEventListener('visibilitychange',update);doc.addEventListener('portfolio-board-activity',update);signal?.addEventListener('abort',dispose,{once:true});
 if(signal?.aborted)dispose();
 return {now,dispose,
  requestAnimationFrame(fn){if(disposed)return 0;const id=++serial,job={fn,handle:0};frames.set(id,job);if(active)armFrame(id,job);return id;},
  cancelAnimationFrame(id){const job=frames.get(id);if(job)win.cancelAnimationFrame(job.handle);frames.delete(id);},
  setTimeout(fn,ms){if(disposed)return 0;const id=++serial,job={fn,due:now()+ms,handle:0};timers.set(id,job);if(active)armTimer(id,job);return id;},
  clearTimeout(id){const job=timers.get(id);if(job)win.clearTimeout(job.handle);timers.delete(id);}
 };
}
