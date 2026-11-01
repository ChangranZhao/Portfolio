import {fittedDockTargets,dockSurface} from './shell-motion.js';
export function setupDockMotion(dock){
 const fine=matchMedia('(hover:hover) and (pointer:fine) and (min-width:701px)'),reduced=matchMedia('(prefers-reduced-motion:reduce)');
 let items=[],current=[],frame=0,last=0,mouse=null,focused=null,geometry=[],separators=[],separatorCenters=[],dockRect;
 const enabled=()=>fine.matches&&!reduced.matches&&!document.hidden&&!document.body.classList.contains('reduce-motion')&&!dock.classList.contains('is-overflowing')&&!document.querySelector('.window.dragging,.window.resizing');
 function reset(){cancelAnimationFrame(frame);frame=0;last=0;for(const el of [...items,...separators]){el.style.removeProperty('transform');el.style.removeProperty('--dock-icon-shadow');el.style.removeProperty('--dock-icon-radius');}dock.style.removeProperty('--dock-expand');current=items.map(()=>({scale:1,x:0,y:0}));dock.classList.remove('dock-tracking');}
 function geometryOf(el){let left=el.offsetLeft,parent=el.offsetParent;while(parent&&parent!==dock){left+=parent.offsetLeft;parent=parent.offsetParent;}return {center:left+el.offsetWidth/2,width:el.offsetWidth};}
 function measure(){reset();items=[...dock.querySelectorAll('.dock-item')];separators=[...dock.querySelectorAll('.dock-separator')];const base=items[0]?.offsetWidth||48;dock.style.setProperty('--dock-radius',Math.max(12,base*.4)+'px');dock.style.setProperty('--dock-padding',Math.max(8,base*.12)+'px');dock.style.setProperty('--dock-gap',Math.max(8,base*.18)+'px');dock.classList.toggle('is-overflowing',dock.scrollWidth>dock.clientWidth);geometry=items.map(geometryOf);separatorCenters=separators.map(el=>geometryOf(el).center);current=items.map(()=>({scale:1,x:0,y:0}));dockRect=dock.getBoundingClientRect();wake();}
 function tick(now){frame=0;if(!enabled()){reset();return;}const dt=last?Math.min(40,now-last):16.7;last=now;const alpha=1-Math.exp(-dt/65);
 const rect=dockRect||dock.getBoundingClientRect(),pointer=mouse!==null?mouse-rect.left:focused?geometry[items.indexOf(focused)]?.center:null;
 // Keep all icons within the viewport, even with large user-selected Dock sizes.
 const room=Math.max(0,Math.min(rect.left,innerWidth-rect.right)-8);
 const targets=fittedDockTargets(geometry,pointer??null,{viewportWidth:innerWidth,viewportHeight:innerHeight,room});let moving=false;
 current=current.map((value,i)=>{const next={};for(const key of ['scale','x','y']){const d=targets[i][key]-value[key],epsilon=key==='scale'?.001:.04;next[key]=Math.abs(d)<epsilon?targets[i][key]:value[key]+d*alpha;if(Math.abs(d)>=epsilon)moving=true;}items[i].style.transform=`translate(${next.x.toFixed(2)}px,${next.y.toFixed(2)}px) scale(${next.scale.toFixed(4)})`;const size=geometry[i].width;items[i].style.setProperty('--dock-icon-radius',Math.max(12/next.scale,size*.225).toFixed(2)+'px');items[i].style.setProperty('--dock-icon-shadow',`0 ${(size*(next.scale>1.2?.05:.03)).toFixed(1)}px ${(size*(next.scale>1.2?.1:.06)).toFixed(1)}px rgba(0,0,0,${(.3+(next.scale-1)*.2).toFixed(2)})`);return next;});
 const surface=dockSurface(geometry,current,separatorCenters);dock.style.setProperty('--dock-expand',surface.expand.toFixed(2)+'px');separators.forEach((el,i)=>{el.style.transform=`translateX(${surface.separators[i].toFixed(2)}px)`;});
 if(moving)frame=requestAnimationFrame(tick);else{last=0;if(mouse===null&&!focused)reset();}
 }
 function wake(){if(!enabled()){reset();return;}dock.classList.add('dock-tracking');if(!frame)frame=requestAnimationFrame(tick);}
 dock.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){mouse=e.clientX;wake();}},{passive:true});
 dock.addEventListener('pointerleave',()=>{mouse=null;if(!focused?.matches(':focus-visible'))focused=null;wake();});
 dock.addEventListener('focusin',e=>{focused=e.target.closest('.dock-item');wake();});
 // Returning focus after an app closes is not a new Dock interaction.
 dock.addEventListener('dock-focus-restored',()=>{focused=null;if(mouse===null)reset();else wake();});
 dock.addEventListener('focusout',e=>{if(!dock.contains(e.relatedTarget)){focused=null;wake();}});
 dock.addEventListener('scroll',()=>{mouse=null;reset();},{passive:true});
 dock.addEventListener('dock-items-changed',measure);
 document.addEventListener('visibilitychange',()=>{mouse=null;focused=null;reset();});
 document.addEventListener('portfolio-preferences',()=>{mouse=null;focused=null;reset();});
 fine.addEventListener('change',measure);reduced.addEventListener('change',measure);
 new ResizeObserver(measure).observe(dock);window.addEventListener('resize',measure);
 measure();
}
