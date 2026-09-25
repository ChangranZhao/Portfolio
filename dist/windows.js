import {WindowState,clampPosition} from './state.mjs';
export const state=new WindowState();
const container=document.querySelector('#windows');
const windows=new Map();
let onChange=()=>{};
export function setWindowChange(fn){onChange=fn;}
function sync(){
  for(const [id,win] of windows){const item=state.items.get(id);win.el.classList.toggle('inactive',state.active!==id);win.el.style.zIndex=item.z;}
  onChange([...state.items.values()].map(s=>({...s,title:windows.get(s.id).title})));
  document.dispatchEvent(new Event('portfolio-windows-changed'));
}
export function focusWindow(id){state.focus(id);const w=windows.get(id);if(w){clearTimeout(w.minimizeTimer);w.el.hidden=false;w.el.classList.remove('minimizing');}sync();w?.el.focus({preventScroll:true});}
export function closeWindow(id){const win=windows.get(id);if(!win)return;clearTimeout(win.minimizeTimer);win.el.classList.add('closing');setTimeout(()=>win.el.remove(),150);windows.delete(id);state.close(id);sync();win.trigger?.focus({preventScroll:true});}
export function minimizeWindow(id){const win=windows.get(id);if(!win)return;state.minimize(id);win.el.classList.add('minimizing');const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('reduce-motion');win.minimizeTimer=setTimeout(()=>{if(state.items.get(id)?.minimized)win.el.hidden=true;},reduced?0:180);sync();}
export function restoreAll(){for(const id of windows.keys())focusWindow(id);}
export function hideAll(){for(const id of windows.keys())minimizeWindow(id);}
export function createWindow({id,title,content,width=950,height=650,className='',bounds}){
  if(windows.has(id)){focusWindow(id);return {el:windows.get(id).el,existing:true};}
  const el=document.createElement('section');el.className='window opening '+className;el.setAttribute('role','dialog');el.setAttribute('aria-label',title);el.dataset.windowId=id;el.tabIndex=-1;
  el.addEventListener('animationend',e=>{if(e.target===el&&e.animationName==='window-appear')el.classList.remove('opening');});
  const bar=document.createElement('header');bar.className='window-titlebar';
  const lights=document.createElement('div');lights.className='traffic-lights';
  for(const [type,label,mark] of [['close','Close','×'],['minimize','Minimize','−'],['maximize','Maximize','+']]){
    const b=document.createElement('button');b.className='light '+type;b.setAttribute('aria-label',label+' '+title);b.textContent=mark;
    b.addEventListener('click',()=>{if(type==='close')closeWindow(id);else if(type==='minimize')minimizeWindow(id);else toggleMax();});lights.append(b);
  }
  const titleEl=document.createElement('span');titleEl.className='window-title';titleEl.textContent=title;bar.append(lights,titleEl);
  const body=document.createElement('div');body.className='window-body';body.append(content);el.append(bar,body);
  const n=windows.size;const w=Math.min(bounds?.width??width,innerWidth-32),h=Math.min(bounds?.height??height,innerHeight-150);
  const pos=clampPosition(bounds?.x??((innerWidth-w)/2+n%4*22),bounds?.y??((innerHeight-h)/2-15+n%4*20),w,h,innerWidth,innerHeight);
  Object.assign(el.style,{width:w+'px',height:h+'px',left:pos.x+'px',top:pos.y+'px'});
  const win={el,title,trigger:document.activeElement,normal:{width:bounds?.width??width,height:bounds?.height??height,x:pos.x,y:pos.y}};windows.set(id,win);state.open(id);container.append(el);fitWindow(el);
  function toggleMax(){el.classList.toggle('maximized');fitWindow(el);const maximized=el.classList.contains('maximized');lights.querySelector('.maximize').setAttribute('aria-label',(maximized?'Restore ':'Maximize ')+title);lights.querySelector('.maximize').setAttribute('aria-pressed',String(maximized));}
  el.addEventListener('pointerdown',()=>{state.focus(id);sync();});
  el.addEventListener('focusin',()=>{if(state.active!==id){state.focus(id);sync();}});
  bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))toggleMax();});
  makeDraggable(el,bar,()=>el.classList.contains('maximized'));
  makeResizable(win);
  el.addEventListener('window-moved',()=>{win.normal.x=parseFloat(el.style.left);win.normal.y=parseFloat(el.style.top);});
  sync();el.focus({preventScroll:true});document.dispatchEvent(new Event('portfolio-window-opened'));return {el,body,existing:false};
}
export function makeDraggable(el,handle,disabled=()=>false){
  let drag;
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button')||disabled()||matchMedia('(max-width:700px)').matches)return;
    const rect=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};handle.setPointerCapture(e.pointerId);el.classList.add('dragging');e.preventDefault();
  });
  handle.addEventListener('pointermove',e=>{if(!drag)return;const pos=clampPosition(drag.left+e.clientX-drag.x,drag.top+e.clientY-drag.y,el.offsetWidth,el.offsetHeight,innerWidth,innerHeight);el.style.left=pos.x+'px';el.style.top=pos.y+'px';el.style.right='auto';});
  const end=()=>{if(drag)el.dispatchEvent(new Event('window-moved'));drag=null;el.classList.remove('dragging');};handle.addEventListener('pointerup',end);handle.addEventListener('lostpointercapture',end);
}
function makeResizable(win){
  const {el}=win;
  for(const edge of ['n','s','e','w','ne','nw','se','sw']){
    const handle=document.createElement('div');handle.className='window-resize resize-'+edge;handle.dataset.edge=edge;handle.setAttribute('aria-hidden','true');el.append(handle);
    let drag;
    handle.addEventListener('pointerdown',e=>{
      if(e.button!==0||el.classList.contains('maximized')||innerWidth<=700)return;
      const r=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:r.left,top:r.top,right:r.right,bottom:r.bottom};
      handle.setPointerCapture(e.pointerId);el.classList.add('resizing');e.preventDefault();
    });
    handle.addEventListener('pointermove',e=>{
      if(!drag)return;
      const area=desktopArea(),dx=e.clientX-drag.x,dy=e.clientY-drag.y;
      const minW=Math.min(el.classList.contains('workspace-sticker')?180:320,innerWidth-16),minH=Math.min(el.classList.contains('workspace-sticker')?80:240,area.height);
      let {left,top,right,bottom}=drag;
      if(edge.includes('e'))right=Math.max(left+minW,Math.min(innerWidth-8,right+dx));
      if(edge.includes('w'))left=Math.min(right-minW,Math.max(8,left+dx));
      if(edge.includes('s'))bottom=Math.max(top+minH,Math.min(area.top+area.height,bottom+dy));
      if(edge.includes('n'))top=Math.min(bottom-minH,Math.max(area.top,top+dy));
      win.normal={x:left,y:top,width:right-left,height:bottom-top};fitWindow(el);
    });
    const end=()=>{drag=null;el.classList.remove('resizing');};
    handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
  }
}
function desktopArea(){
  const top=Math.ceil(document.querySelector('.menubar').getBoundingClientRect().bottom)+7;
  const dock=document.querySelector(innerWidth<=700?'.mobile-bottom-nav':'.dock-container').getBoundingClientRect();
  const bottom=Math.min(innerHeight-8,dock.top-10);
  return {top,height:Math.max(80,bottom-top)};
}
function fitWindow(el){
  const normal=windows.get(el.dataset.windowId)?.normal;if(!normal)return;
  const area=desktopArea();
  el.style.setProperty('--window-top',area.top+'px');
  el.style.setProperty('--window-height',area.height+'px');
  const w=Math.min(normal.width,Math.max(1,innerWidth-16));
  const h=Math.min(normal.height,area.height);
  const x=Math.max(8,Math.min(normal.x,innerWidth-w-8));
  const y=Math.max(area.top,Math.min(normal.y,area.top+area.height-h));
  Object.assign(el.style,{width:w+'px',height:h+'px',left:x+'px',top:y+'px'});
}
window.addEventListener('resize',()=>{for(const {el} of windows.values())fitWindow(el);});
