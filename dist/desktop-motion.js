import {state} from './windows.js';
// Particle positions are independent of the original reference composition.
export function setupDesktopDrift(desktop){
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const icons=[...desktop.querySelectorAll('.desktop-icon')].map((el,i)=>{
    const angle=.7+i*2.39996,speed=19+(i%6)*2;
    return {el,i,x:0,y:0,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed};
  });
  let timer,frame=0,running=false,last=0,measureFrame=0,hovered=false;
  const disabled=()=>hovered||innerWidth<=700||reduced.matches||document.body.classList.contains('reduce-motion')||document.hidden||document.body.classList.contains('guide-open')||document.body.classList.contains('tour-active')||[...state.items.values()].some(w=>!w.minimized);
  function paint(p){
    // A single transform owns positioning; no competing filled translate animation.
    if(innerWidth<=700){p.el.style.removeProperty('transform');return;}
    p.el.style.transform=`translate(calc(-50% + ${p.x.toFixed(2)}px), calc(-5% + ${p.y.toFixed(2)}px))`;
  }
  function measure(){
    if(innerWidth<=700){for(const p of icons){p.x=p.y=0;paint(p);}return;}
    const bounds=desktop.getBoundingClientRect();
    const rectangles=icons.map(p=>p.el.getBoundingClientRect());
    for(const [i,p] of icons.entries()){
      const r=rectangles[i],left=r.left-p.x,top=r.top-p.y;
      p.minX=bounds.left+6-left;p.maxX=Math.max(p.minX,bounds.right-6-left-r.width);
      p.minY=bounds.top+6-top;p.maxY=Math.max(p.minY,bounds.bottom-6-top-r.height);
      p.x=Math.max(p.minX,Math.min(p.maxX,p.x));p.y=Math.max(p.minY,Math.min(p.maxY,p.y));paint(p);
    }
  }
  function animate(now){
    frame=0;if(!running||disabled())return;
    if(now-last<1000/30){frame=requestAnimationFrame(animate);return;}
    const dt=Math.min((now-last)/1000,.08);last=now;
    for(const p of icons){
      if(p.el.matches(':hover,:focus-visible'))continue;
      const mobile=innerWidth<=700,factor=mobile?.35:1;
      // Small changes in direction keep paths organic without tethering to home.
      const turn=Math.sin(now/6500+p.i)*dt*.09,c=Math.cos(turn),s=Math.sin(turn),vx=p.vx;
      p.vx=vx*c-p.vy*s;p.vy=vx*s+p.vy*c;
      p.x+=p.vx*dt*factor;p.y+=p.vy*dt*factor;
      if(p.x<p.minX){p.x=p.minX;p.vx=Math.abs(p.vx);}else if(p.x>p.maxX){p.x=p.maxX;p.vx=-Math.abs(p.vx);}
      if(p.y<p.minY){p.y=p.minY;p.vy=Math.abs(p.vy);}else if(p.y>p.maxY){p.y=p.maxY;p.vy=-Math.abs(p.vy);}
      paint(p);
    }
    frame=requestAnimationFrame(animate);
  }
  function start(){
    clearTimeout(timer);if(disabled())return;
    measure();running=true;desktop.classList.add('is-drifting');last=performance.now();
    if(!frame)frame=requestAnimationFrame(animate);
  }
  function pause(){
    clearTimeout(timer);cancelAnimationFrame(frame);frame=0;running=false;desktop.classList.remove('is-drifting');
    if(!disabled())timer=setTimeout(start,2000);
  }
  for(const event of ['pointerdown','click','keydown','wheel'])document.addEventListener(event,pause,{passive:true,capture:true});
  document.addEventListener('portfolio-windows-changed',pause);
  document.addEventListener('visibilitychange',pause);
  function scheduleMeasure(){if(measureFrame)return;measureFrame=requestAnimationFrame(()=>{measureFrame=0;pause();measure()});}
  window.addEventListener('resize',scheduleMeasure);
  reduced.addEventListener('change',pause);
  new MutationObserver(pause).observe(document.body,{attributes:true,attributeFilter:['class']});
  for(const p of icons){p.el.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){hovered=true;pause();}});p.el.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'){hovered=false;pause();}});paint(p);const img=p.el.querySelector('img');if(img&&!img.complete)img.addEventListener('load',scheduleMeasure,{once:true});}
  pause();
}
