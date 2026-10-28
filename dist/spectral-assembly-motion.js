// Animate the existing illustration in layers, preserving its final layout.
export function setupSpectralAssembly(doc, section, root, signal, reduced) {
  const drawing=doc.querySelector('[data-node-id="678:13711"]');
  const source=drawing?.querySelector('img');
  const notes=doc.querySelector('[data-node-id="678:13718"]');
  if(!source||!notes)return;
  const original=source.parentElement;
  const lines=[...drawing.children].filter(el=>el!==original);
  original.style.zIndex='0';
  lines.forEach(el=>el.style.zIndex='5');
  const labels=[...notes.children];
  const style=doc.createElement('style');
  style.textContent=`
    .assembly-motion-layer{position:absolute;inset:0;pointer-events:none;mix-blend-mode:multiply}
    .assembly-replay{position:absolute;right:4px;top:8px;border:1px solid #ccc;border-radius:20px;background:#fff;color:#555;padding:7px 14px;font:13px Arial,sans-serif;cursor:pointer}
    .assembly-replay:hover{background:#f4f3ef;border-color:#777}
    .assembly-replay:focus-visible{outline:2px solid #555;outline-offset:3px}
  `;
  doc.head.append(style);
  // Boundaries follow the gaps between plates rather than rectangular tiles.
  const boundaries=[
    '0% 20.5%, 50% 20.5%, 59% 19.1%, 70% 18.7%, 82% 17.5%, 100% 17.5%',
    '0% 34.8%, 36% 34.8%, 47% 33.1%, 62% 33.1%, 76% 34.8%, 100% 34.8%',
    '0% 65%, 20% 65%, 30% 60%, 42% 56%, 55% 55%, 67% 60%, 80% 63%, 100% 63%'
  ];
  const reverse=line=>line.split(', ').reverse().join(', ');
  const regions=[`0% 0%,100% 0%,${reverse(boundaries[0])}`,
    `${boundaries[0]},${reverse(boundaries[1])}`,
    `${boundaries[1]},${reverse(boundaries[2])}`,
    `${boundaries[2]},100% 100%,0% 100%`];
  const layers=regions.map((region,i)=>{
    const layer=doc.createElement('div');layer.className='assembly-motion-layer';
    layer.setAttribute('aria-hidden','true');layer.style.zIndex=String(4-i);
    const crop=doc.createElement('div');crop.style.cssText='position:absolute;inset:0;';
    crop.style.clipPath=`polygon(${region})`;
    const copy=source.cloneNode();copy.alt='';copy.removeAttribute('loading');
    crop.append(copy);layer.append(crop);original.append(layer);return layer;
  });
  const button=doc.createElement('button');button.type='button';button.className='assembly-replay';
  const buttonLabel=()=>{button.textContent=doc.documentElement.lang.startsWith('zh')?'↻ 重播拆解':'↻ Replay';};
  buttonLabel();drawing.parentElement.append(button);
  let animations=[],played=false,ready=false,visible=false;
  const reset=()=>{animations.forEach(a=>a.cancel());animations=[];};
  const finish=()=>{
    reset();source.style.visibility='visible';layers.forEach(el=>el.style.display='none');
    [...lines,...labels].forEach(el=>{el.style.opacity='';el.style.clipPath='';});
  };
  const prepare=()=>{
    source.style.visibility='hidden';
    layers.forEach((el,i)=>{el.style.display='';el.style.transform=`translateY(${[175,115,55,0][i]}px)`;});
    [...lines,...labels].forEach(el=>el.style.opacity='0');
  };
  const animate=(el,keyframes,options)=>{
    const animation=el.animate(keyframes,{fill:'both',...options});animations.push(animation);return animation;
  };
  const play=()=>{
    if(!ready)return;
    played=true;reset();buttonLabel();
    if(reduced()){finish();return;}
    prepare();
    const ease='cubic-bezier(.22,.7,.22,1)';
    layers.forEach((el,i)=>animate(el,[{transform:`translateY(${[175,115,55,0][i]}px)`},{transform:'translateY(0)'}],{duration:1900,delay:250+(3-i)*180,easing:ease}));
    // Explanations begin only after every layer has reached its final position.
    const orderedLines=[lines[3],lines[2],lines[0],lines[1],lines[4],lines[5]];
    orderedLines.forEach((el,i)=>animate(el,[{opacity:0,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0% 0 0)'}],{duration:480,delay:2800+i*160,easing:'ease-out'}));
    labels.forEach((el,i)=>animate(el,[{opacity:0,translate:'10px 0'},{opacity:1,translate:'0 0'}],{duration:550,delay:3080+i*160,easing:ease}));
    animations.at(-1).finished.then(finish).catch(()=>{});
  };
  const observer=new IntersectionObserver(entries=>{
    visible=entries.some(entry=>entry.isIntersecting);
    if(visible&&ready&&!played)play();
  },{root,threshold:.25});
  observer.observe(section);
  button.addEventListener('click',play,{signal});
  const preferences=()=>{buttonLabel();if(reduced())finish();};
  document.addEventListener('portfolio-preferences',preferences,{signal});
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  media.addEventListener('change',preferences,{signal});
  source.decode().then(()=>{
    if(signal.aborted)return;ready=true;
    // Clone image styles must override the source visibility, not inherit it.
    layers.forEach(el=>el.querySelector('img').style.visibility='visible');
    if(reduced())finish();else{prepare();if(visible)play();}
  }).catch(()=>finish());
  signal.addEventListener('abort',()=>{observer.disconnect();reset();},{once:true});
}
