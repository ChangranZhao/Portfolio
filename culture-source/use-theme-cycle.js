import {useCallback,useEffect,useRef} from 'react';

// One timeout per transition; no per-frame state updates or hover selectors.
export function useThemeCycle(setCategory,paused){
 const restart=useRef(()=>{});
 useEffect(()=>{
  let timer=0,visible=false,hostActive=true,running=false;
  const enabled=()=>visible&&hostActive&&!document.hidden&&!paused;
  const clear=()=>{clearTimeout(timer);timer=0;};
  function step(index){
   clear();if(!enabled())return;
   setCategory(index);
   timer=setTimeout(()=>step(index===null?0:index===3?null:index+1),index===null?5000:2000);
  }
  const sync=()=>{
   const next=enabled();if(next===running)return;running=next;
   clear();setCategory(null);if(next)timer=setTimeout(()=>step(0),5000);
  };
  restart.current=()=>{clear();if(enabled())timer=setTimeout(()=>step(0),5000);};
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting&&entry.intersectionRatio>=.1;sync();},{threshold:[0,.1]});
  const graph=document.querySelector('.knowledge-graph');if(graph)observer.observe(graph);
  const message=e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='portfolio-culture-active')return;hostActive=!!e.data.active;sync();};
  window.addEventListener('message',message);document.addEventListener('visibilitychange',sync);
  return()=>{clear();observer.disconnect();window.removeEventListener('message',message);document.removeEventListener('visibilitychange',sync);restart.current=()=>{};};
 },[paused,setCategory]);
 return useCallback(value=>{setCategory(value);restart.current();},[setCategory]);
}
