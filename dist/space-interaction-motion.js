import {createActivityClock} from './runtime-scheduling.js';

// Entrance effects preserve the exported board geometry and selectable text.
export function setupInteractionMotion(doc,section,article,signal,reduced){
 if(!doc.querySelector('[aria-label="4_page9"]'))return;
 const node=id=>doc.querySelector(`[data-node-id="114:${id}"]`),videos=[...doc.querySelectorAll('.interaction-stage-video')],revealed=new Set(),manualPause=new Set();
 let entered=false;
 const active=()=>!signal.aborted&&!doc.hidden&&!doc.body.classList.contains('portfolio-board-paused');
 const syncVideos=()=>videos.forEach(video=>{
  if(active()&&revealed.has(video)&&!manualPause.has(video))video.play().catch(()=>{});else video.pause();
 });
 for(const video of videos){
  video.removeAttribute('autoplay');video.muted=true;video.defaultMuted=true;video.pause();
  video.addEventListener('click',()=>{if(!revealed.has(video)||manualPause.has(video)){manualPause.delete(video);revealed.add(video);}else manualPause.add(video);syncVideos();},{signal});
 }
 doc.addEventListener('portfolio-board-activity',syncVideos,{signal});doc.addEventListener('visibilitychange',syncVideos,{signal});
 signal.addEventListener('abort',()=>videos.forEach(v=>v.pause()),{once:true});
 if(reduced())return;
 const clock=createActivityClock(doc,signal),pieces=[],paragraphs=[],overlays=[];let raf=0;
 const add=(id,delay)=>{const el=node(id);if(el){pieces.push(el);el.classList.add('space-interaction-piece');el.style.setProperty('--interaction-delay',String(delay)+'s');}};
 const text=(ids,delay)=>{
  const ps=ids.flatMap(id=>[...node(id)?.querySelectorAll('p')||[]]),length=ps.reduce((n,p)=>n+Array.from(p.textContent).length,0),interval=Math.min(26,(9500-delay)/Math.max(1,length));let offset=delay;
  for(const p of ps){const letters=Array.from(p.textContent),duration=Math.max(1,letters.length*interval);paragraphs.push({p,letters,delay:offset,duration});p.classList.add('space-interaction-pending');offset+=duration;}
 };
 for(const [ids,delay] of [[[263,264,273],0],[[267,268,286],2.7],[[271,272,297],5.4],[[265],2.2],[[269],4.9]])for(const id of ids)add(id,delay);
 text([261,262],0);text([263,264,273],650);text([267,268,286],3350);text([271,272,297],6050);text([307],7800);
 const style=doc.createElement('style');style.textContent=`
 .space-interaction-piece{opacity:0}
 .space-interaction-playing .space-interaction-piece{animation:space-interaction-in .65s ease both;animation-delay:var(--interaction-delay)}
 .space-interaction-pending{visibility:hidden!important}
 .space-interaction-source,.space-interaction-source *{color:transparent!important}
 @keyframes space-interaction-in{from{opacity:0;translate:-10px 0}to{opacity:1;translate:0 0}}
 `;doc.head.append(style);
 const finish=()=>{
  clock.cancelAnimationFrame(raf);clock.dispose();
  for(const item of overlays){item.p.style.color=item.color;item.overlay.remove();}overlays.length=0;
  for(const {p} of paragraphs)p.classList.remove('space-interaction-pending','space-interaction-source');
  for(const el of pieces){el.classList.remove('space-interaction-piece');el.style.removeProperty('--interaction-delay');}
  doc.body.classList.remove('space-interaction-playing');style.remove();
 };
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(entered||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;entered=true;observer.disconnect();
  if(reduced()){finish();return;}
  doc.body.classList.add('space-interaction-playing');
  for(const item of paragraphs){
   const {p}=item,css=doc.defaultView.getComputedStyle(p),rect=p.getBoundingClientRect(),overlay=doc.createElement('div');
   overlay.className='space-interaction-typing';overlay.setAttribute('aria-hidden','true');overlay.style.cssText=`position:fixed;left:${rect.left}px;top:${rect.top}px;width:${rect.width}px;height:${rect.height}px;pointer-events:none;z-index:20;`;
   for(const key of ['fontFamily','fontSize','fontWeight','fontStyle','lineHeight','letterSpacing','textAlign','whiteSpace','wordBreak','overflowWrap'])overlay.style[key]=css[key];
   overlay.style.color=css.color;overlays.push({...item,overlay,color:p.style.color,count:-1});p.classList.remove('space-interaction-pending');p.classList.add('space-interaction-source');p.style.color='transparent';doc.body.append(overlay);
  }
  videos.forEach((v,i)=>clock.setTimeout(()=>{revealed.add(v);syncVideos();},i*2700));
  const start=clock.now();
  const tick=now=>{
   if(signal.aborted||reduced()){finish();return;}
   const elapsed=now-start;
   for(const item of overlays){const count=Math.min(item.letters.length,Math.floor(Math.max(0,elapsed-item.delay)/item.duration*item.letters.length));if(count!==item.count){item.overlay.textContent=item.letters.slice(0,count).join('');item.count=count;}}
   if(elapsed>=10000){finish();return;}raf=clock.requestAnimationFrame(tick);
  };raf=clock.requestAnimationFrame(tick);
 },{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{observer.disconnect();finish();},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
