import {createActivityClock} from './runtime-scheduling.js';
import {setupEnvironmentMotion} from './space-environment-motion.js';
import {setupCaptionTypewriter} from './space-caption-typewriter.js';
// Photographs are interactive; exported paths, icons and connectors are decoration.
export function spaceImageIsContent(img){
 return !/\.svg(?:[?#]|$)/i.test(img.src)&&!img.closest('.space-planet');
}
export function setupSpaceMotion(doc,section,article,signal,reduced){
 const clock=createActivityClock(doc,signal);
 doc.body.classList.add('space-motion');
 setupEnvironmentMotion(doc,section,article,signal,reduced);
 setupCaptionTypewriter(doc,section,article,signal,reduced);
 const earth=new URL('./assets/space-planets/earth.png',import.meta.url).href;
 const strip=new URL('./assets/space-planets/planet-strip.png',import.meta.url).href;
 const style=doc.createElement('style');
 style.textContent=`
 .space-motion .figma-interactive-image{transition:translate .35s ease,scale .35s ease,filter .35s ease;transform-origin:center}
 .space-motion .figma-interactive-image:hover,.space-motion .figma-interactive-image:focus-visible{translate:0 -5px;scale:1.035;filter:drop-shadow(0 10px 12px #0003);box-shadow:none}
 .space-planet{cursor:pointer;outline-offset:8px}
 .space-planet::before{content:'';position:absolute;left:24%;top:12%;width:48%;height:48%;border-radius:50%;background-image:var(--planet-image,url("${strip}"));background-size:var(--planet-size,346.2% 213.1%);background-position:var(--planet-position);background-repeat:no-repeat;box-shadow:0 8px 20px #0002;transition:opacity .5s,scale .7s}
 .space-planet img{opacity:0;clip-path:circle(0% at 48% 36%);scale:.9;transition:clip-path .8s cubic-bezier(.2,.7,.2,1),opacity .3s,scale .8s;pointer-events:none!important}
 .space-planet:hover img,.space-planet:focus-visible img,.space-planet.is-open img{opacity:1;clip-path:circle(90% at 48% 36%);scale:1}
 .space-planet:hover::before,.space-planet:focus-visible::before,.space-planet.is-open::before{opacity:0;scale:1.1}
 .reduce-motion .space-planet img{opacity:1;clip-path:none;scale:1;transition:none}
 .reduce-motion .space-planet::before{display:none}
 .reduce-motion .figma-interactive-image{transition:none!important;translate:none!important;scale:1!important}
 @media(prefers-reduced-motion:reduce){.space-planet img{opacity:1;clip-path:none;scale:1;transition:none}.space-planet::before{display:none}.space-motion .figma-interactive-image{transition:none;translate:none!important;scale:1!important}}
 `;doc.head.append(style);
 for(const [id,position] of [['747:22647','5.3% 39%'],['747:22596','54.1% 44.6%'],['747:22654','98.9% 45.3%'],['747:22599','center']]){
  const el=doc.querySelector(`[data-node-id="${id}"]`);if(!el)continue;
  if(id==='747:22599'){el.style.setProperty('--planet-image',`url("${earth}")`);el.style.setProperty('--planet-size','100% 100%');}
  if(id==='747:22596')el.style.setProperty('--planet-size','380.3% 234.1%');
  if(id==='747:22654')el.style.setProperty('--planet-size','392.2% 241.4%');
  el.classList.add('space-planet');el.style.setProperty('--planet-position',position);el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label','展开 / 收起星球拼贴 · Reveal planet collage');el.setAttribute('aria-expanded','false');
  const toggle=()=>{const open=el.classList.toggle('is-open');el.setAttribute('aria-expanded',String(open));};
  el.addEventListener('click',e=>{e.stopPropagation();toggle();},{signal});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}},{signal});
 }
 const craftIds=['747:22593','747:22595','747:22598','747:22666'];
 const craft=craftIds.map(id=>doc.querySelector('[data-node-id="'+id+'"]')).filter(Boolean);
 style.textContent+=`
 @keyframes space-drift{0%,100%{translate:0 0;rotate:-1.5deg}35%{translate:7px -11px;rotate:1.5deg}70%{translate:-5px -5px;rotate:-.5deg}}
 .space-craft{animation:space-drift var(--flight-duration,8s) ease-in-out infinite;animation-delay:var(--flight-delay,0s);animation-play-state:paused;transform-origin:center}
 .space-flight-active .space-craft{animation-play-state:running}
 .reduce-motion .space-craft{animation:none}
 @media(prefers-reduced-motion:reduce){.space-craft{animation:none}}
 `;
 craft.forEach((el,i)=>{el.classList.add('space-craft');el.style.setProperty('--flight-duration',(7+i*1.3)+'s');el.style.setProperty('--flight-delay',(-i*2)+'s');});
 if(craft.length){const flightObserver=new IntersectionObserver(entries=>{doc.body.classList.toggle('space-flight-active',entries.some(e=>e.isIntersecting));},{root:article});flightObserver.observe(section);signal.addEventListener('abort',()=>flightObserver.disconnect(),{once:true});}
 // Reveal the three communication stages in order when this board enters view.
 const stages=['747:22612','747:22619','747:22629'].map(id=>doc.querySelector('[data-node-id="'+id+'"]')).filter(Boolean);
 if(stages.length){
 style.textContent+=`
 @keyframes space-stage-in{from{opacity:0;translate:0 9px}to{opacity:1;translate:0 0}}
 @keyframes space-arrows-in{0%,25%{clip-path:inset(0 100% 0 0);opacity:0}55%{clip-path:inset(0 53% 0 0);opacity:1}100%{clip-path:inset(0);opacity:1}}
 [data-node-id="747:22635"]{opacity:0}
 .space-stages-active [data-node-id="747:22635"]{animation:space-arrows-in 4.6s ease both}
 .reduce-motion [data-node-id="747:22635"]{opacity:1;animation:none}
 .space-stage{opacity:0}
 .space-stages-active .space-stage{animation:space-stage-in 1.4s ease both;animation-delay:var(--stage-delay)}
 .reduce-motion .space-stage{opacity:1;animation:none}
 @media(prefers-reduced-motion:reduce){[data-node-id="747:22635"]{opacity:1;animation:none!important}.space-stage{opacity:1;animation:none!important}}
 `;
 stages.forEach((el,i)=>{el.classList.add('space-stage');el.style.setProperty('--stage-delay',(i*1.6)+'s');});
 const stageObserver=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.35)){doc.body.classList.add('space-stages-active');stageObserver.disconnect();}},{root:article,threshold:.35});stageObserver.observe(section);signal.addEventListener('abort',()=>stageObserver.disconnect(),{once:true});
 }
 // Animate a cloned visual text layer so localization and selectable source text stay intact.
 const board=doc.querySelector('.figma-canvas');
 const page=Number(board?.getAttribute('aria-label')?.split('page')[1]);
 if(page>4)return;
 const roots=[board].filter(Boolean);
 const candidates=()=>[...board.querySelectorAll('p')].filter(p=>{if(page===1)return !!p.closest('[data-node-id="747:22388"],[data-node-id="747:22390"],[data-node-id="747:22391"],[data-node-id="747:22393"]');if(page===3&&p.closest('[data-node-id="747:22508"],[data-node-id="747:22515"],[data-node-id="747:22523"]'))return true;if(page===2&&p.closest('[data-node-id="747:22449"],[data-node-id="747:22459"]'))return true;if(page===4)return ['747:22667','747:22670'].includes(p.dataset.nodeId);const r=p.getBoundingClientRect(),css=doc.defaultView.getComputedStyle(p);return p.textContent.trim().length>55&&parseFloat(css.fontSize)>=12&&parseFloat(css.fontSize)<=24&&r.top>60&&r.bottom<1025&&!p.closest('a');});
 const pending=candidates();
 for(const p of pending)p.classList.add('space-type-pending');
 style.textContent+=' .space-type-pending,.space-type-pending *{visibility:hidden!important}';
 doc.documentElement.setAttribute('data-space-type-ready','');
 if(!roots.length)return;
 let played=false,raf=0;const overlays=[];
 const finish=()=>{clock.cancelAnimationFrame(raf);for(const p of pending)p.classList.remove('space-type-pending');for(const [p,overlay,old] of overlays){overlay.remove();p.style.color=old;}overlays.length=0;};
 const observer=new IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.35))return;played=true;observer.disconnect();if(reduced()){finish();return;}
  const paragraphs=candidates().sort((a,b)=>{const x=a.getBoundingClientRect(),y=b.getBoundingClientRect();return Math.abs(x.top-y.top)>14?x.top-y.top:x.left-y.left;});let total=0;
  for(const p of paragraphs){const text=p.textContent;const r=p.getBoundingClientRect();const overlay=doc.createElement('div');const css=doc.defaultView.getComputedStyle(p);overlay.style.cssText=`position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;pointer-events:none;white-space:${css.whiteSpace};text-align:${css.textAlign};letter-spacing:${css.letterSpacing};font:${css.font};line-height:${css.lineHeight};color:${css.color};overflow-wrap:${css.overflowWrap};`;overlay.setAttribute('aria-hidden','true');doc.body.append(overlay);overlays.push([p,overlay,p.style.color,Array.from(text),total]);total+=Array.from(text).length;p.classList.add('space-type-pending');}
  let lastCount=-1;const start=clock.now();const tick=now=>{if(signal.aborted||reduced()){finish();return;}const count=Math.floor(Math.min(1,(now-start)/10000)*total);if(count!==lastCount){lastCount=count;for(const [,overlay,,chars,offset] of overlays)overlay.textContent=chars.slice(0,Math.max(0,count-offset)).join('');}if(now-start>=10000)finish();else raf=clock.requestAnimationFrame(tick);};raf=clock.requestAnimationFrame(tick);
 },{root:article,threshold:.35});observer.observe(section);
 const preference=()=>{finish();if(!played&&!reduced()){pending.splice(0,pending.length,...candidates());for(const p of pending)p.classList.add('space-type-pending');}};document.addEventListener('portfolio-preferences',preference,{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
