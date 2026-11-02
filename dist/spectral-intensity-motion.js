import {createActivityClock} from './runtime-scheduling.js';
export function setupSpectralIntensity(doc,section,article,signal,reduced){
 const ids=[13805,13817,13830],hosts=[13810,13822,13835].map(id=>doc.querySelector(`[data-node-id="678:${id}"]`));
 if(hosts.some(h=>!h)||reduced())return;
 const clock=createActivityClock(doc,signal),cards=ids.map(id=>doc.querySelector(`[data-node-id="678:${id}"]`)),waves=[],originals=[];let played=false;
 const style=doc.createElement('style');style.textContent=`
 .spectral-intensity-card{opacity:0}
 .spectral-intensity-playing .spectral-intensity-card{animation:spectral-intensity-in .65s ease both;animation-delay:var(--intensity-delay)}
 .spectral-fluid-wave{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none}
 .spectral-wave-drawing{clip-path:inset(0 100% 0 0)}
 .spectral-intensity-playing .spectral-wave-drawing{animation:spectral-wave-draw 1.8s ease-out both;animation-delay:calc(var(--intensity-delay) + .65s)}
 .spectral-intensity-playing .spectral-wave-phase{animation:spectral-wave-flow var(--wave-period) linear infinite;animation-delay:calc(var(--intensity-delay) + .65s)}
 @keyframes spectral-intensity-in{from{opacity:0;translate:0 6px}to{opacity:1;translate:0 0}}
 @keyframes spectral-wave-draw{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0)}}
 @keyframes spectral-wave-flow{from{transform:translateX(0)}to{transform:translateX(var(--wave-shift))}}
 `;doc.head.append(style);
 hosts.forEach((host,i)=>{
  cards[i].classList.add('spectral-intensity-card');cards[i].style.setProperty('--intensity-delay',i*3+'s');
  for(const child of host.children){originals.push([child,child.style.visibility]);child.style.visibility='hidden';}
  const svg=createFluidWave(doc,i);svg.classList.add('spectral-wave-drawing');host.append(svg);waves.push(svg);
 });
 const finish=()=>{clock.dispose();cards.forEach(card=>card.classList.remove('spectral-intensity-card'));waves.forEach(svg=>svg.classList.remove('spectral-wave-drawing'));};
 const cleanup=()=>{finish();for(const [el,visibility] of originals)el.style.visibility=visibility;cards.forEach(card=>card.style.removeProperty('--intensity-delay'));waves.forEach(svg=>svg.remove());doc.body.classList.remove('spectral-intensity-playing');style.remove();};
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;played=true;observer.disconnect();if(reduced()){cleanup();return;}doc.body.classList.add('spectral-intensity-playing');clock.setTimeout(finish,9500);},{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{if(reduced()){played=true;observer.disconnect();cleanup();}},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();cleanup();},{once:true});
}

function createFluidWave(doc,index){
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg'),wavelength=[84,48,28][index],amplitude=[11,13,14][index];
 svg.setAttribute('viewBox','0 0 200 94');svg.setAttribute('aria-hidden','true');svg.classList.add('spectral-fluid-wave');
 svg.style.setProperty('--wave-period',[3.6,2.2,1.25][index]+'s');svg.style.setProperty('--wave-shift',-wavelength+'px');
 let path='';for(let x=0;x<=200+wavelength+2;x+=2)path+=(x?'L':'M')+x+','+(47+amplitude*Math.sin(x/wavelength*Math.PI*2)).toFixed(2);
 svg.innerHTML=`<path class="spectral-wave-phase" d="${path}" stroke="#7d8466" stroke-width="1.35" fill="none" vector-effect="non-scaling-stroke"/>`;
 return svg;
}

export function setupSpectralOutputWaves(doc,section,article,signal,reduced){
 const hosts=[13415,13422,13430].map(id=>doc.querySelector(`[data-node-id="678:${id}"]`));
 if(hosts.some(h=>!h)||reduced()||signal.aborted)return;
 const originals=[],waves=[],style=doc.createElement('style');
 style.textContent=`
 .spectral-fluid-wave{position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none}
 .spectral-output-waves-playing .spectral-wave-phase{animation:spectral-output-wave-flow var(--wave-period) linear infinite;animation-delay:var(--output-wave-delay)}
 @keyframes spectral-output-wave-flow{from{transform:translateX(0)}to{transform:translateX(var(--wave-shift))}}
 `;doc.head.append(style);
 hosts.forEach((host,i)=>{
  for(const child of host.children){originals.push([child,child.style.visibility]);child.style.visibility='hidden';}
  const svg=createFluidWave(doc,i);svg.setAttribute('preserveAspectRatio','none');svg.style.setProperty('--output-wave-delay',[4.3,5.1,5.9][i]+'s');host.append(svg);waves.push(svg);
 });
 let played=false;
 const cleanup=()=>{for(const [el,visibility] of originals)el.style.visibility=visibility;waves.forEach(svg=>svg.remove());doc.body.classList.remove('spectral-output-waves-playing');style.remove();};
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;
  played=true;observer.disconnect();if(reduced()){cleanup();return;}doc.body.classList.add('spectral-output-waves-playing');
 },{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{if(reduced()){observer.disconnect();cleanup();}},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();cleanup();},{once:true});
}
