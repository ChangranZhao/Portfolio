// Retain every visited document. Bound only new initialization and background work.
export function createBoardScheduler(root){
 const records=new Map();let inflight=0,scrolling=false,scrollTimer=0,disposed=false,preparingAll=false;
 const enabled=()=>!document.hidden&&root.closest?.('.window')?.dataset.suspended!=='true';
 const apply=record=>{
  const doc=record.frame.contentDocument;if(!doc?.body)return;
  const active=record.visible&&enabled()&&!scrolling&&!root.closest?.('.case-reader')?.classList?.contains('case-preparing');
  doc.body.classList.toggle('portfolio-board-paused',!active);
  if(record.doc===doc&&record.active===active)return;
  record.doc=doc;record.active=active;const EventType=doc.defaultView?.Event||Event;doc.dispatchEvent?.(new EventType('portfolio-board-activity'));
  for(const animation of doc.getAnimations?.()||[])if(!active&&animation.playState==='running'){record.paused.add(animation);animation.pause();}
  if(active){for(const animation of record.paused)if(animation.playState==='paused')animation.play();record.paused.clear();}
 };
 function release(record){if(!record.inflight)return;record.inflight=false;inflight--;clearTimeout(record.deadline);drain();}
 function start(record){record.loaded=true;record.inflight=true;inflight++;load.unobserve(record.section);record.frame.src=record.src;const EventType=record.frame.ownerDocument?.defaultView?.Event||Event;record.frame.dispatchEvent?.(new EventType('portfolio-board-loading'));record.deadline=setTimeout(()=>release(record),12000);}
 function drain(){if(disposed||scrolling||!enabled())return;const pending=[...records.values()].filter(r=>!r.loaded&&(preparingAll||r.near&&r.ready)).sort((a,b)=>Number(b.visible)-Number(a.visible));for(const r of pending){if(inflight>=2)break;start(r);}}
 const preload=event=>{preparingAll=true;for(const r of records.values()){if(event.detail?.retry&&r.frame.dataset?.projectFrameFailed){r.loaded=false;delete r.frame.dataset.projectFrameFailed;}apply(r);}drain();};
 root.addEventListener?.('portfolio-project-preload',preload);
 const ready=()=>{preparingAll=false;visibility();};
 root.addEventListener?.('portfolio-project-ready',ready);
 const load=new IntersectionObserver(entries=>{for(const entry of entries){
  const record=records.get(entry.target);if(!record||record.loaded)continue;
  record.near=entry.isIntersecting;record.ready=false;clearTimeout(record.timer);
  if(record.near)record.timer=setTimeout(()=>{record.ready=true;drain();},120);
 }},{root,rootMargin:'900px 0px'});
 const visible=new IntersectionObserver(entries=>{for(const entry of entries){const record=records.get(entry.target);if(record){record.visible=entry.isIntersecting;apply(record);}}},{root,threshold:0});
 const visibility=()=>{for(const record of records.values())apply(record);drain();};
 const onScroll=()=>{if(!scrolling){scrolling=true;for(const record of records.values())if(record.visible)apply(record);}clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{scrolling=false;visibility();},150);};
 root.addEventListener?.('scroll',onScroll,{passive:true});
 document.addEventListener('visibilitychange',visibility);document.addEventListener('portfolio-windows-changed',visibility);
 return {
  observe(frame,section,src,eager=false){
   frame.setAttribute?.('data-project-board-src',src);
   const record={frame,section,src,loaded:false,near:eager,ready:eager,visible:eager,paused:new Set()};records.set(section,record);
   frame.addEventListener('load',()=>{
    if(disposed||!record.loaded||frame.contentDocument?.URL==='about:blank')return;
    release(record);const doc=frame.contentDocument;if(!doc?.head)return;
    const style=doc.createElement('style');style.textContent='.portfolio-board-paused,.portfolio-board-paused *,.portfolio-board-paused *::before,.portfolio-board-paused *::after{animation-play-state:paused!important}';doc.head.append(style);
    queueMicrotask(()=>{if(!disposed)apply(record);});
   });
   frame.addEventListener('error',()=>release(record));
   if(eager)drain();else load.observe(section);visible.observe(section);
  },
  dispose(){disposed=true;load.disconnect();visible.disconnect();root.removeEventListener?.('scroll',onScroll);root.removeEventListener?.('portfolio-project-preload',preload);root.removeEventListener?.('portfolio-project-ready',ready);clearTimeout(scrollTimer);document.removeEventListener('visibilitychange',visibility);document.removeEventListener('portfolio-windows-changed',visibility);for(const r of records.values()){clearTimeout(r.timer);clearTimeout(r.deadline);}records.clear();}
 };
}
