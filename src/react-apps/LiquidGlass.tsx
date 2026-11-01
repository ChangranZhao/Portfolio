import React from 'react';
import {createRoot,type Root} from 'react-dom/client';
import {flushSync} from 'react-dom';
import LiquidGlass from 'liquid-glass-react';

const still={x:0,y:0};
// The shallow, fixed menu bar uses native backdrop blur: SVG displacement can
// leave rectangular damage tiles when a window below changes compositor layers.
const selectors='#dock,.application-menu,#main-menu,.system-control-center,.window:not(.inactive)';
// Optical backgrounds never own controls, artwork or window transforms.
export function mountLiquidGlass(){
 const layers=new Map<HTMLElement,{host:HTMLDivElement;root:Root;resize:ResizeObserver;timer:number;paint:()=>void}>();
 let queued=false,disposed=false;
 const remove=(element:HTMLElement)=>{const layer=layers.get(element);if(!layer)return;clearTimeout(layer.timer);layer.resize.disconnect();layer.root.unmount();layer.host.remove();element.classList.remove('liquid-optical');layers.delete(element);};
 const scan=()=>{
  queued=false;if(disposed)return;
  const visible=[...document.querySelectorAll<HTMLElement>(selectors)].filter(el=>!el.closest('[hidden],.closing,.minimizing')&&el.getBoundingClientRect().width>0&&getComputedStyle(el).display!=='none').slice(0,7);
  for(const [el,layer] of layers)if(!visible.includes(el)||!layer.host.isConnected)remove(el);
  for(const el of visible){if(layers.has(el)){layers.get(el)!.paint();continue;}
   const host=document.createElement('div');host.className='liquid-lens';host.setAttribute('aria-hidden','true');host.setAttribute('data-no-localize','');el.prepend(host);
   const root=createRoot(host);let last='';
   const paint=()=>{
    if(disposed||!host.isConnected)return;
    const radius=parseFloat(getComputedStyle(el).borderRadius)||0,size=`${host.clientWidth}:${host.clientHeight}:${radius}`;
    const settings=window.creativeOSGlass?.get()||{refraction:100,blur:10},key=`${size}:${settings.refraction}:${settings.blur}`;
    if(key===last)return;last=key;
    const strength=el.id==='dock'?100:el.classList.contains('window')?82:88;
    // Keep the same SVG/filter instance when only user parameters change.
    // Resize remounts commit atomically, never exposing an empty lens.
    flushSync(()=>root.render(<LiquidGlass key={size} className="liquid-optic-frame" padding="0" cornerRadius={radius} displacementScale={strength*settings.refraction/100} blurAmount={(settings.blur-4)/32} saturation={125} aberrationIntensity={1.4*settings.refraction/100} elasticity={0} mode="standard" globalMousePos={still} mouseOffset={still} style={{position:'absolute',left:'50%',top:'50%',width:'100%',height:'100%',pointerEvents:'none'}}><span/></LiquidGlass>));
    el.classList.add('liquid-optical');
   };
   const layer={host,root,resize:new ResizeObserver(()=>{clearTimeout(layer.timer);layer.timer=window.setTimeout(paint,100);}),timer:0,paint};layers.set(el,layer);layer.resize.observe(host);paint();
  }
 };
 // MutationObserver + microtask commits the material before the browser paints
 // a newly opened menu/window. Keep CSS glass until the React layer exists.
 const schedule=()=>{if(!disposed&&!queued){queued=true;queueMicrotask(scan);}};
 const surfaces='#dock,.application-menu,#main-menu,.system-control-center,.window';
 const surfaceTree=(node:Node)=>node instanceof HTMLElement&&(node.matches(surfaces)||!!node.querySelector(surfaces));
 const observer=new MutationObserver(records=>{
  // Text, sliders, node dragging and React's own optical DOM do not change
  // the set of glass surfaces. Avoid a document scan/layout on those updates.
  const relevant=records.some(record=>{
   if(record.type==='childList')return [...record.addedNodes,...record.removedNodes].some(surfaceTree)||[...record.removedNodes].some(n=>n instanceof HTMLElement&&n.classList.contains('liquid-lens'));
   const target=record.target;if(!(target instanceof HTMLElement)||!target.matches(surfaces))return false;
   if(record.attributeName==='hidden')return true;
   const old=new Set((record.oldValue||'').split(/\s+/));return ['inactive','closing','minimizing'].some(name=>old.has(name)!==target.classList.contains(name));
  });if(relevant)schedule();
 });observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeOldValue:true,attributeFilter:['hidden','class']});
 document.addEventListener('portfolio-glass-settings',schedule);document.addEventListener('visibilitychange',schedule);scan();
 return {dispose(){disposed=true;observer.disconnect();document.removeEventListener('portfolio-glass-settings',schedule);document.removeEventListener('visibilitychange',schedule);for(const el of [...layers.keys()])remove(el);}};
}
