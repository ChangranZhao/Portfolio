import {animateWindow,animateWindowLayout,cancelWindowMotion} from './shell-motion.js';
import {WindowState,clampPosition} from './state.mjs';
import {createFrameBatch} from './runtime-scheduling.js';
import {setLocalizedAttribute} from './localization.js';
import {decorateWindowControls} from './window-controls.js';
export const state=new WindowState();
const container=document.querySelector('#windows');
const windows=new Map();
let onChange=()=>{};
export function setWindowChange(fn){onChange=fn;}
function sync(){
  for(const [id,win] of windows){const item=state.items.get(id);win.el.classList.toggle('inactive',state.active!==id);win.el.dataset.suspended=String(item.minimized||state.active!==id);win.el.style.zIndex=item.z;}
  onChange([...state.items.values()].map(s=>({...s,title:windows.get(s.id).title,thumbnail:windows.get(s.id).thumbnail})));
  document.dispatchEvent(new Event('portfolio-windows-changed'));
}
const reducedMotion=()=>matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('reduce-motion');
export function updateWindowMetadata(id,title,thumbnail){
 const win=windows.get(id);if(!win)return;win.title=title;win.thumbnail=thumbnail;
 setLocalizedAttribute(win.el,'aria-label',title);const text=win.el.querySelector('.window-title');if(text)text.textContent=title;
 for(const [type,label] of [['close','Close'],['minimize','Minimize'],['maximize',win.el.classList.contains('maximized')?'Restore':'Maximize']])setLocalizedAttribute(win.el.querySelector('.light.'+type),'aria-label',label+' '+title);
 sync();
}
function dockTarget(id){const entries=[...document.querySelectorAll('#dock .dock-item')],el=entries.find(b=>b.dataset.windowId===id)||entries.find(b=>b.dataset.restoreId===id);const r=el?.getBoundingClientRect();return r?.width?r:null;}
export function focusWindow(id){const w=windows.get(id),restoring=state.items.get(id)?.minimized,target=restoring?dockTarget(id):null;state.focus(id);if(w){clearTimeout(w.minimizeTimer);w.el.hidden=false;w.el.classList.remove('minimizing');}sync();if(w&&restoring)animateWindow(w.el,'restore',target,{reduced:reducedMotion()});w?.el.focus({preventScroll:true});}
export function closeWindow(id){const win=windows.get(id);if(!win)return;if(document.fullscreenElement===win.el){document.exitFullscreen().then(()=>closeWindow(id));return;}win.el.dispatchEvent(new Event('window-closing'));clearTimeout(win.minimizeTimer);win.el.classList.remove('opening','minimizing');win.el.classList.add('closing');animateWindow(win.el,'close',null,{reduced:reducedMotion()||win.el.hidden,onFinish:()=>win.el.remove()});windows.delete(id);state.close(id);sync();win.trigger?.focus({preventScroll:true});if(win.trigger?.closest('#dock'))win.trigger.dispatchEvent(new Event('dock-focus-restored',{bubbles:true}));}
export function minimizeWindow(id){const win=windows.get(id);if(!win||state.items.get(id)?.minimized)return;if(document.fullscreenElement===win.el){document.exitFullscreen().then(()=>minimizeWindow(id));return;}win.el.classList.remove('opening','case-fullscreen','case-immersive','case-controls-visible');state.minimize(id);win.el.classList.add('minimizing');sync();animateWindow(win.el,'minimize',dockTarget(id),{reduced:reducedMotion(),onFinish:()=>{if(state.items.get(id)?.minimized)win.el.hidden=true;}});}
export function restoreAll(){for(const id of windows.keys())focusWindow(id);}
export function hideAll(){for(const id of windows.keys())minimizeWindow(id);}
export function createWindow({id,title,content,width=950,height=650,className='',bounds,onMaximize,deferOpen=false}){
  if(windows.has(id)){focusWindow(id);return {el:windows.get(id).el,existing:true};}
  const el=document.createElement('section');el.className='window opening '+className;el.setAttribute('role','dialog');el.setAttribute('aria-label',title);el.dataset.windowId=id;el.tabIndex=-1;
  el.addEventListener('animationend',e=>{if(e.target===el&&e.animationName==='window-appear')el.classList.remove('opening');});
  const bar=document.createElement('header');bar.className='window-titlebar';
  const lights=document.createElement('div');lights.className='traffic-lights';
  for(const [type,label,mark] of [['close','Close','×'],['minimize','Minimize','−'],['maximize','Maximize','+']]){
    const b=document.createElement('button');b.className='light '+type;b.setAttribute('aria-label',label+' '+title);b.textContent=mark;
    b.addEventListener('click',()=>{if(type==='close')closeWindow(id);else if(type==='minimize'){if(el.classList.contains('maximized'))toggleMax();else minimizeWindow(id);}else if(onMaximize)onMaximize(el);else toggleMax();});lights.append(b);
  }
  const titleEl=document.createElement('span');titleEl.className='window-title';titleEl.textContent=title;bar.append(lights,titleEl);
  const body=document.createElement('div');body.className='window-body';body.append(content);el.append(bar,body);
  decorateWindowControls(el);
  const n=windows.size;const w=Math.min(bounds?.width??width,innerWidth-32),h=Math.min(bounds?.height??height,innerHeight-150);
  const pos=clampPosition(bounds?.x??((innerWidth-w)/2+n%4*22),bounds?.y??((innerHeight-h)/2-15+n%4*20),w,h,innerWidth,innerHeight);
  Object.assign(el.style,{width:w+'px',height:h+'px',left:pos.x+'px',top:pos.y+'px'});
  const win={el,title,trigger:document.activeElement,normal:{width:bounds?.width??width,height:bounds?.height??height,x:pos.x,y:pos.y}};windows.set(id,win);state.open(id);container.append(el);fitWindow(el);
  function toggleMax(){el.classList.remove('opening');animateWindowLayout(el,()=>{el.classList.toggle('maximized');fitWindow(el);},{reduced:reducedMotion()});const maximized=el.classList.contains('maximized');setLocalizedAttribute(lights.querySelector('.maximize'),'aria-label',(maximized?'Restore ':'Maximize ')+win.title);lights.querySelector('.maximize').setAttribute('aria-pressed',String(maximized));}
  el.addEventListener('pointerdown',()=>{if(state.active!==id){state.focus(id);sync();}});
  el.addEventListener('focusin',()=>{if(state.active!==id){state.focus(id);sync();}});
  bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))toggleMax();});
  makeDraggable(el,bar,()=>el.classList.contains('maximized')||el.classList.contains('case-fullscreen'));
  makeResizable(win);
  el.addEventListener('window-moved',()=>{win.normal.x=parseFloat(el.style.left);win.normal.y=parseFloat(el.style.top);});
  let revealed=false;
  const reveal=()=>{if(revealed||!windows.has(id))return;revealed=true;el.style.removeProperty('visibility');if(state.active===id&&!el.contains(document.activeElement))el.focus({preventScroll:true});if(!state.items.get(id)?.minimized)animateWindow(el,'open',null,{reduced:reducedMotion(),onFinish:()=>el.classList.remove('opening')});};
  if(deferOpen)el.style.visibility='hidden';else reveal();
  sync();el.focus({preventScroll:true});document.dispatchEvent(new Event('portfolio-window-opened'));return {el,body,reveal,existing:false};
}
export function makeDraggable(el,handle,disabled=()=>false){
  let drag;
  const move=createFrameBatch(point=>{if(!drag)return;if(!drag.started){if(Math.hypot(point.x-drag.x,point.y-drag.y)<3)return;drag.started=true;cancelWindowMotion(el);el.classList.remove('opening');el.classList.add('dragging');}const pos=clampPosition(drag.left+point.x-drag.x,drag.top+point.y-drag.y,drag.width,drag.height,innerWidth,innerHeight);drag.position=pos;el.style.translate=`${pos.x-drag.left}px ${pos.y-drag.top}px`;});
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button,input,select,textarea,a,label')||disabled()||matchMedia('(max-width:700px)').matches)return;
    const rect=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,translate:el.style.translate};handle.setPointerCapture(e.pointerId);e.preventDefault();
  });
  handle.addEventListener('pointermove',e=>{if(drag)move.push({x:e.clientX,y:e.clientY});});
  const end=()=>{if(!drag)return;move.flush();if(drag.position){el.style.left=drag.position.x+'px';el.style.top=drag.position.y+'px';el.style.right='auto';}el.style.translate=drag.translate;drag=null;el.classList.remove('dragging');el.dispatchEvent(new Event('window-moved'));};
  handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);el.addEventListener('window-closing',()=>{move.cancel();drag=null;});
}
function makeResizable(win){
  const {el}=win;
  for(const edge of ['n','s','e','w','ne','nw','se','sw']){
    const handle=document.createElement('div');handle.className='window-resize resize-'+edge;handle.dataset.edge=edge;handle.setAttribute('aria-hidden','true');el.append(handle);
    let drag;
    handle.addEventListener('pointerdown',e=>{
      if(e.button!==0||el.classList.contains('maximized')||innerWidth<=700)return;
      cancelWindowMotion(el);el.classList.remove('opening');const r=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top,right:r.right,bottom:r.bottom,area:desktopArea(),minW:Math.min(el.classList.contains('workspace-sticker')?180:320,innerWidth-16)};
      handle.setPointerCapture(e.pointerId);el.classList.add('resizing');e.preventDefault();
    });
    const resize=createFrameBatch(e=>{
      if(!drag)return;
      const area=drag.area,dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      const minW=drag.minW,minH=Math.min(el.classList.contains('workspace-sticker')?80:240,area.height);
      let {left,top,right,bottom}=drag;
      if(edge.includes('e'))right=Math.max(left+minW,Math.min(innerWidth-8,right+dx));
      if(edge.includes('w'))left=Math.min(right-minW,Math.max(8,left+dx));
      if(edge.includes('s'))bottom=Math.max(top+minH,Math.min(area.top+area.height,bottom+dy));
      if(edge.includes('n'))top=Math.min(bottom-minH,Math.max(area.top,top+dy));
      win.normal={x:left,y:top,width:right-left,height:bottom-top};fitWindow(el,area);
    });
    handle.addEventListener('pointermove',e=>{if(drag)resize.push({clientX:e.clientX,clientY:e.clientY});});
    const end=()=>{resize.flush();drag=null;el.classList.remove('resizing');};
    el.addEventListener('window-closing',()=>{resize.cancel();drag=null;});
    handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
  }
}
function desktopArea(){
  const top=Math.ceil(document.querySelector('.menubar').getBoundingClientRect().bottom)+7;
  const dock=document.querySelector(innerWidth<=700?'.mobile-bottom-nav':'.dock-container').getBoundingClientRect();
  const bottom=Math.min(innerHeight-8,dock.top-10);
  return {top,height:Math.max(80,bottom-top)};
}
function fitWindow(el,area=desktopArea()){
  const normal=windows.get(el.dataset.windowId)?.normal;if(!normal)return;
  el.style.setProperty('--window-top',area.top+'px');
  el.style.setProperty('--window-height',area.height+'px');
  const w=Math.min(normal.width,Math.max(1,innerWidth-16));
  const h=Math.min(normal.height,area.height);
  const x=Math.max(8,Math.min(normal.x,innerWidth-w-8));
  const y=Math.max(area.top,Math.min(normal.y,area.top+area.height-h));
  Object.assign(el.style,{width:w+'px',height:h+'px',left:x+'px',top:y+'px'});
}
let resizeFrame=0;
window.addEventListener('resize',()=>{if(resizeFrame||!windows.size)return;resizeFrame=requestAnimationFrame(()=>{resizeFrame=0;if(!windows.size)return;const area=desktopArea();for(const {el} of windows.values())fitWindow(el,area);});});
