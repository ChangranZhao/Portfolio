// Remember host activity across React effect restarts (depth, language, playback).
export const hostActivity={active:window.parent===window,scrolling:false};
const update=()=>document.documentElement.classList.toggle('culture-host-paused',!hostActivity.active||hostActivity.scrolling||document.hidden);
window.addEventListener('message',event=>{
 if(event.source!==parent||event.origin!==location.origin)return;
 if(event.data?.type==='portfolio-culture-active')hostActivity.active=Boolean(event.data.active);
 else if(event.data?.type==='portfolio-culture-scrolling')hostActivity.scrolling=Boolean(event.data.scrolling);
 else return;
 update();
});
document.addEventListener('visibilitychange',update);update();
if(parent!==window)parent.postMessage({type:'portfolio-culture-ready'},location.origin);
