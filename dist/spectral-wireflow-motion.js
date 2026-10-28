export function setupSpectralWireflow(doc,section,root,signal,reduced){
  const board=doc.querySelector('[data-node-id="36:5538"]');
  if(!board)return;
  const entries=[];
  for(const el of board.children){
    const x=parseFloat(el.style.left),y=parseFloat(el.style.top);
    const w=parseFloat(el.style.width),h=parseFloat(el.style.height);
    // The exported board keeps each phone, caption and connector label separate.
    if(y>=180&&y<1040&&w>2&&h>2){
      const row=y>=620?1:0,col=x>=1000?1:0;
      const group=row*2+col,origin=col?1005:50;
      const heading=y<(row?690:250);
      const arrow=Math.abs(y-(row?811.08:371.08))<2;
      const phone=Math.max(0,Math.min(4,Math.round((x-origin)/183)));
      entries.push({el,delay:150+group*1850+(heading?0:260+phone*280)+(arrow?180:0)});
    }
    // Shared connector artwork spans the whole board; reveal once screens exist.
    if(el.querySelector('[data-node-id="36:5557"]'))entries.push({el,delay:7100});
  }
  let animations=[],played=false;
  const show=()=>{animations.forEach(a=>a.cancel());animations=[];entries.forEach(({el})=>el.style.opacity='');};
  if(!reduced())entries.forEach(({el})=>el.style.opacity='0');
  const observer=new IntersectionObserver(events=>{
    if(played||!events.some(e=>e.isIntersecting))return;
    played=true;observer.disconnect();
    if(reduced()){show();return;}
    animations=entries.map(({el,delay})=>el.animate([{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],{duration:520,delay,easing:'cubic-bezier(.22,.7,.22,1)',fill:'both'}));
    Promise.all(animations.map(a=>a.finished)).then(show).catch(()=>{});
  },{root,threshold:.35});
  observer.observe(section);
  const preferences=()=>{if(reduced()){played=true;observer.disconnect();show();}};
  document.addEventListener('portfolio-preferences',preferences,{signal});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',preferences,{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();show();},{once:true});
}
