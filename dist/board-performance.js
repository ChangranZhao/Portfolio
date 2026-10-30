// The browser's iframe lazy loading may fetch several screens ahead. Keep
// distant chapters unloaded and suspend animations in boards outside the reader.
export function createBoardScheduler(root){
 const records=new Map();
 const apply=record=>{
  const doc=record.frame.contentDocument;if(!doc?.body)return;
  const active=record.visible&&!document.hidden&&root.closest?.('.window')?.dataset.suspended!=='true';
  doc.body.classList.toggle('portfolio-board-paused',!active);
  if(record.doc!==doc||record.active!==active){record.doc=doc;record.active=active;const EventType=doc.defaultView?.Event||Event;doc.dispatchEvent?.(new EventType('portfolio-board-activity'));}
  for(const animation of doc.getAnimations?.()||[]){
   if(!active&&animation.playState==='running'){record.paused.add(animation);animation.pause();}
  }
  if(active){for(const animation of record.paused)if(animation.playState==='paused')animation.play();record.paused.clear();}
 };
 const load=new IntersectionObserver(entries=>{for(const entry of entries){
  const record=records.get(entry.target);if(!record||record.loaded)continue;
  clearTimeout(record.timer);
  if(entry.isIntersecting)record.timer=setTimeout(()=>{record.loaded=true;record.frame.src=record.src;load.unobserve(entry.target);},120);
 }},{root,rootMargin:'400px 0px'});
 const visible=new IntersectionObserver(entries=>{for(const entry of entries){const record=records.get(entry.target);if(record){record.visible=entry.isIntersecting;apply(record);}}},{root,threshold:0});
 const visibility=()=>{for(const record of records.values())apply(record);};
 document.addEventListener('visibilitychange',visibility);
 document.addEventListener('portfolio-windows-changed',visibility);
 return {
  observe(frame,section,src,eager=false){
   const record={frame,src,loaded:eager,visible:eager,paused:new Set()};records.set(section,record);
   frame.addEventListener('load',()=>{
    const doc=frame.contentDocument;if(!doc?.head)return;
    const style=doc.createElement('style');style.textContent='.portfolio-board-paused,.portfolio-board-paused *,.portfolio-board-paused *::before,.portfolio-board-paused *::after{animation-play-state:paused!important}';doc.head.append(style);
    queueMicrotask(()=>apply(record));
   });
   if(eager)frame.src=src;else load.observe(section);
   visible.observe(section);
  },
  dispose(){load.disconnect();visible.disconnect();document.removeEventListener('visibilitychange',visibility);document.removeEventListener('portfolio-windows-changed',visibility);for(const record of records.values())clearTimeout(record.timer);records.clear();}
 };
}
