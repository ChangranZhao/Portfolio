export function setupSpectralMockups(doc,section,root,signal,reduced){
  const groups=[
    [14121,14134,14132,14133], // Memory
    [14122,14141,14143,14144], // Ghost
    [14123,14146,14148,14149], // Life rhythms
    [14124,14136,14138,14139], // Add memory
    [14125,14151,14153,14154], // Presence
    [14126,14156,14158,14159]  // Trace
  ];
  const entries=groups.flatMap((ids,group)=>ids.map((id,part)=>({
    el:doc.querySelector(`[data-node-id="678:${id}"]`),
    delay:180+group*850+(part?130:0),part
  }))).filter(entry=>entry.el);
  if(entries.length!==24)return;
  let animations=[],played=false,ready=false,visible=false;
  const show=()=>{animations.forEach(a=>a.cancel());animations=[];entries.forEach(({el})=>el.style.opacity='');};
  if(!reduced())entries.forEach(({el})=>el.style.opacity='0');
  const play=()=>{
    if(played||!ready||!visible)return;
    played=true;observer.disconnect();
    if(reduced()){show();return;}
    animations=entries.map(({el,delay,part})=>el.animate([
      {opacity:0,translate:part?'0 8px':'0 22px'},
      {opacity:1,translate:'0 0'}
    ],{duration:part?560:720,delay,easing:'cubic-bezier(.22,.7,.22,1)',fill:'both'}));
    Promise.all(animations.map(a=>a.finished)).then(show).catch(()=>{});
  };
  const observer=new IntersectionObserver(events=>{
    visible=events.some(e=>e.isIntersecting);play();
  },{root,threshold:.35});
  observer.observe(section);
  const pictures=entries.filter(entry=>entry.part===0).map(({el})=>el.querySelector('img'));
  pictures.forEach(img=>img.loading='eager');
  Promise.allSettled(pictures.map(img=>img.decode())).then(()=>{
    if(signal.aborted)return;ready=true;play();
  });
  const preferences=()=>{if(reduced()){played=true;observer.disconnect();show();}};
  document.addEventListener('portfolio-preferences',preferences,{signal});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',preferences,{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();show();},{once:true});
}
