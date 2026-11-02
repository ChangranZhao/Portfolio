import {createActivityClock} from './runtime-scheduling.js';

export function setupCompleteAlphabetMotion(doc,section,article,signal,reduced){
 if(!doc.querySelector('[aria-label="4_page8"]')||reduced())return;
 const node=id=>doc.querySelector(`[data-node-id="678:${id}"]`),pieces=new Map(),clock=createActivityClock(doc,signal);let played=false,timer;
 const add=(el,delay,expand=false)=>{if(el)pieces.set(el,{delay,expand});};
 for(const [ids,delay] of [
  [['16006','16007','16109','16008'],0],
  [['16009','16010','16011','16110','16012'],2.4],
  [['16013','16014','16015','16016','16017','16018','16019'],4.8]
 ])for(const id of ids)add(node(id),delay,true);
 const right=[];const take=id=>{const el=node(String(id));if(el)right.push(el);};
 take(16020);for(let id=16021;id<=16032;id++)take(id);
 for(const [title,description,start,end] of [[16034,[16111,16112],16035,16046],[16048,[16113,16114],16049,16060],[16062,[16115,16116],16063,16074]]){take(title);description.forEach(take);for(let id=start;id<=end;id++)take(id);}
 for(const id of ['16359','16441','16523']){const card=node(id);if(!card)continue;const header=card.firstElementChild;if(header)right.push(header);right.push(...card.querySelectorAll('[data-name="Figure"]'));}
 right.forEach((el,i)=>add(el,.35+i/Math.max(1,right.length-1)*8.95));
 const style=doc.createElement('style');style.textContent=`
 .space-complete-piece{opacity:0}
 .space-complete-playing .space-complete-piece{animation:space-complete-fade .45s ease both;animation-delay:var(--complete-delay)}
 .space-complete-playing .space-complete-expand{animation-name:space-complete-expand;animation-duration:.65s}
 @keyframes space-complete-fade{from{opacity:0}to{opacity:1}}
 @keyframes space-complete-expand{from{opacity:0;clip-path:inset(0 0 100% 0);translate:0 7px}to{opacity:1;clip-path:inset(0);translate:0 0}}
 `;doc.head.append(style);
 for(const [el,{delay,expand}] of pieces){el.classList.add('space-complete-piece');if(expand)el.classList.add('space-complete-expand');el.style.setProperty('--complete-delay',delay.toFixed(4)+'s');}
 const finish=()=>{clock.clearTimeout(timer);clock.dispose();for(const el of pieces.keys()){el.classList.remove('space-complete-piece','space-complete-expand');el.style.removeProperty('--complete-delay');}doc.body.classList.remove('space-complete-playing');style.remove();};
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;played=true;observer.disconnect();if(reduced()){finish();return;}
  doc.body.classList.add('space-complete-playing');timer=clock.setTimeout(finish,10000);
 },{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{played=true;observer.disconnect();finish();},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}

// Keep authored geometry and selectable source text; only opacity/text overlays animate.
export function setupAlphabetMotion(doc,section,article,signal,reduced){
 if(!doc.querySelector('[aria-label="4_page7"]')||reduced())return;
 const glyphs=[...doc.querySelectorAll('[data-name]')].filter(n=>/glyph/i.test(n.dataset.name));
 const groups=['16779','16847','16915','16931','17001'].map(id=>[...doc.querySelectorAll(`[data-node-id="678:${id}"] p`)]),paragraphs=groups.flat(),timing=new Map();
 for(const group of groups){const total=group.reduce((sum,p)=>sum+Array.from(p.textContent).length,0),interval=Math.min(35,8000/Math.max(1,total));let delay=0;for(const p of group){const duration=Math.max(1,Array.from(p.textContent).length*interval);timing.set(p,{delay,duration});delay+=duration;}}
 const clock=createActivityClock(doc,signal),overlays=[];let played=false,raf=0;
 const style=doc.createElement('style');style.textContent=`
 .space-alphabet-glyph{opacity:0}
 .space-alphabet-playing .space-alphabet-glyph{animation:space-alphabet-in .35s ease both;animation-delay:var(--alphabet-delay)}
 .space-alphabet-text-pending{visibility:hidden!important}
 .space-alphabet-source-text,.space-alphabet-source-text *{color:transparent!important}
 @keyframes space-alphabet-in{from{opacity:0}to{opacity:1}}
 `;doc.head.append(style);
 glyphs.forEach((node,i)=>{node.classList.add('space-alphabet-glyph');node.style.setProperty('--alphabet-delay',(i/Math.max(1,glyphs.length-1)*9.65).toFixed(4)+'s');});
 for(const p of paragraphs)p.classList.add('space-alphabet-text-pending');
 const finish=()=>{
  clock.cancelAnimationFrame(raf);raf=0;
  clock.dispose();
  for(const [p,overlay,color] of overlays){p.style.color=color;overlay.remove();}overlays.length=0;
  for(const p of paragraphs)p.classList.remove('space-alphabet-text-pending','space-alphabet-source-text');
  for(const node of glyphs){node.classList.remove('space-alphabet-glyph');node.style.removeProperty('--alphabet-delay');}
  doc.body.classList.remove('space-alphabet-playing');style.remove();
 };
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;played=true;observer.disconnect();
  if(reduced()){finish();return;}
  doc.body.classList.add('space-alphabet-playing');
  for(const p of paragraphs){
   const css=doc.defaultView.getComputedStyle(p),bounds=p.getBoundingClientRect(),overlay=doc.createElement('div'),old=p.style.color;
   overlay.className='space-alphabet-typing';overlay.setAttribute('aria-hidden','true');
   overlay.style.cssText=`position:fixed;left:${bounds.left}px;top:${bounds.top}px;width:${bounds.width}px;height:${bounds.height}px;pointer-events:none;z-index:20;`;
   for(const key of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textAlign','whiteSpace','wordBreak','overflowWrap'])overlay.style[key]=css[key];
   overlay.style.color=css.color;const letters=Array.from(p.textContent);overlay.dataset.duration=String(timing.get(p).duration);overlay.dataset.delay=String(timing.get(p).delay);
   overlays.push([p,overlay,old,letters,-1]);p.classList.remove('space-alphabet-text-pending');p.classList.add('space-alphabet-source-text');p.style.color='transparent';doc.body.append(overlay);
  }
  const start=clock.now();
  const tick=now=>{
   if(signal.aborted||reduced()){finish();return;}
   const elapsed=now-start;
   for(const item of overlays){const [,overlay,,letters]=item,count=Math.min(letters.length,Math.floor(Math.max(0,elapsed-Number(overlay.dataset.delay))/Number(overlay.dataset.duration)*letters.length));if(count!==item[4]){overlay.textContent=letters.slice(0,count).join('');item[4]=count;}}
   if(elapsed>=10000){finish();return;}raf=clock.requestAnimationFrame(tick);
  };raf=clock.requestAnimationFrame(tick);
 },{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{played=true;observer.disconnect();finish();},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
