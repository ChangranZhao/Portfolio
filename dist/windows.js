import {WindowState,clampPosition} from './state.mjs';
export const state=new WindowState();
const container=document.querySelector('#windows');
const windows=new Map();
let onChange=()=>{};
export function setWindowChange(fn){onChange=fn;}
function sync(){
  for(const [id,win] of windows){const item=state.items.get(id);win.el.classList.toggle('inactive',state.active!==id);win.el.style.zIndex=item.z;}
  onChange([...state.items.values()].map(s=>({...s,title:windows.get(s.id).title})));
}
export function focusWindow(id){state.focus(id);const w=windows.get(id);if(w){clearTimeout(w.minimizeTimer);w.el.hidden=false;w.el.classList.remove('minimizing');}sync();w?.el.focus({preventScroll:true});}
export function closeWindow(id){const win=windows.get(id);if(!win)return;clearTimeout(win.minimizeTimer);win.el.classList.add('closing');setTimeout(()=>win.el.remove(),150);windows.delete(id);state.close(id);sync();win.trigger?.focus({preventScroll:true});}
export function minimizeWindow(id){const win=windows.get(id);if(!win)return;state.minimize(id);win.el.classList.add('minimizing');const reduced=matchMedia('(prefers-reduced-motion:reduce)').matches||document.body.classList.contains('reduce-motion');win.minimizeTimer=setTimeout(()=>{if(state.items.get(id)?.minimized)win.el.hidden=true;},reduced?0:180);sync();}
export function restoreAll(){for(const id of windows.keys())focusWindow(id);}
export function hideAll(){for(const id of windows.keys())minimizeWindow(id);}
export function createWindow({id,title,content,width=950,height=650,className=''}){
  if(windows.has(id)){focusWindow(id);return {el:windows.get(id).el,existing:true};}
  const el=document.createElement('section');el.className='window '+className;el.setAttribute('role','dialog');el.setAttribute('aria-label',title);el.tabIndex=-1;
  const bar=document.createElement('header');bar.className='window-titlebar';
  const lights=document.createElement('div');lights.className='traffic-lights';
  for(const [type,label,mark] of [['close','Close','×'],['minimize','Minimize','−'],['maximize','Maximize','+']]){
    const b=document.createElement('button');b.className='light '+type;b.setAttribute('aria-label',label+' '+title);b.textContent=mark;
    b.addEventListener('click',()=>{if(type==='close')closeWindow(id);else if(type==='minimize')minimizeWindow(id);else toggleMax();});lights.append(b);
  }
  const titleEl=document.createElement('span');titleEl.className='window-title';titleEl.textContent=title;bar.append(lights,titleEl);
  const body=document.createElement('div');body.className='window-body';body.append(content);el.append(bar,body);
  const n=windows.size;const w=Math.min(width,innerWidth-32),h=Math.min(height,innerHeight-150);
  const pos=clampPosition((innerWidth-w)/2+n%4*22,(innerHeight-h)/2-15+n%4*20,w,h,innerWidth,innerHeight);
  Object.assign(el.style,{width:w+'px',height:h+'px',left:pos.x+'px',top:pos.y+'px'});
  const win={el,title,trigger:document.activeElement};windows.set(id,win);state.open(id);container.append(el);
  function toggleMax(){el.classList.toggle('maximized');if(!el.classList.contains('maximized'))fitWindow(el);lights.querySelector('.maximize').setAttribute('aria-label',(el.classList.contains('maximized')?'Restore ':'Maximize ')+title);}
  el.addEventListener('pointerdown',()=>{state.focus(id);sync();});bar.addEventListener('dblclick',e=>{if(!e.target.closest('button'))toggleMax();});
  makeDraggable(el,bar,()=>el.classList.contains('maximized'));
  sync();el.focus({preventScroll:true});return {el,body,existing:false};
}
export function makeDraggable(el,handle,disabled=()=>false){
  let drag;
  handle.addEventListener('pointerdown',e=>{
    if(e.button!==0||e.target.closest('button')||disabled()||matchMedia('(max-width:700px)').matches)return;
    const rect=el.getBoundingClientRect();drag={x:e.clientX,y:e.clientY,left:rect.left,top:rect.top};handle.setPointerCapture(e.pointerId);el.classList.add('dragging');e.preventDefault();
  });
  handle.addEventListener('pointermove',e=>{if(!drag)return;const pos=clampPosition(drag.left+e.clientX-drag.x,drag.top+e.clientY-drag.y,el.offsetWidth,el.offsetHeight,innerWidth,innerHeight);el.style.left=pos.x+'px';el.style.top=pos.y+'px';el.style.right='auto';});
  const end=()=>{drag=null;el.classList.remove('dragging');};handle.addEventListener('pointerup',end);handle.addEventListener('lostpointercapture',end);
}
function fitWindow(el){el.style.width=Math.min(parseFloat(el.style.width),innerWidth-24)+'px';el.style.height=Math.min(parseFloat(el.style.height),innerHeight-130)+'px';const p=clampPosition(parseFloat(el.style.left),parseFloat(el.style.top),parseFloat(el.style.width),parseFloat(el.style.height),innerWidth,innerHeight);el.style.left=p.x+'px';el.style.top=p.y+'px';}
window.addEventListener('resize',()=>{for(const {el} of windows.values())fitWindow(el);});
