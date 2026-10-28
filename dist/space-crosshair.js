// All embedded boards share one pointer owner with the outer website.
const crosshairOwners=new Set();
export function setupSpaceCrosshair(doc,article,signal){
 if(doc.querySelector('.space-crosshair'))return;
 const win=doc.defaultView,mouse=win.matchMedia('(hover:hover) and (pointer:fine)');
 const style=doc.createElement('style');
 style.textContent=`
 .space-crosshair{position:fixed;inset:0;z-index:2147483646;pointer-events:none;overflow:hidden;opacity:0;color:#627d90}
 .space-crosshair.is-active{opacity:1}
 .space-crosshair i{position:absolute;display:block;background:currentColor;opacity:.27;will-change:transform}
 .space-crosshair .scan-horizontal{left:0;top:0;width:100%;height:1px}
 .space-crosshair .scan-vertical{left:0;top:0;width:1px;height:100%}
 .space-crosshair .scan-point{position:absolute;left:0;top:0;width:10px;height:10px;margin:-5px;border:1px solid currentColor;background:transparent;box-sizing:border-box;will-change:transform}
 .space-crosshair.is-image .scan-point{width:18px;height:18px;margin:-9px}
 .space-crosshair.is-text i{opacity:.08}
 .space-crosshair.is-text .scan-point{opacity:.25}
 .space-crosshair .scan-label{position:absolute;left:0;top:0;font:12px Arial,'Microsoft YaHei',sans-serif;letter-spacing:.4px;white-space:nowrap;background:#f9f8f4e8;padding:4px 6px;opacity:0}
 .space-crosshair.is-image .scan-label{opacity:1}
 @media(hover:none),(pointer:coarse){.space-crosshair{display:none}}
 `;doc.head.append(style);
 const layer=doc.createElement('div');layer.className='space-crosshair';layer.setAttribute('aria-hidden','true');
 layer.innerHTML='<i class="scan-horizontal"></i><i class="scan-vertical"></i><span class="scan-point"></span><span class="scan-label"></span>';
 doc.body.append(layer);
 const [horizontal,vertical,point,label]=layer.children;
 let raf=0,latest=null;
 const hide=()=>{layer.classList.remove('is-active');latest=null;win.cancelAnimationFrame(raf);raf=0;};
 crosshairOwners.add(hide);
 const draw=()=>{
  raf=0;if(!latest||!mouse.matches)return;
  const {x,y,target}=latest;
  if(target.closest('a,button,input,select,textarea,[role="button"]:not(img)')){hide();return;}
  const text=!!target.closest('p,h1,h2,h3,figcaption');
  const image=!text&&doc.elementsFromPoint(x,y).some(el=>el.matches('img.figma-interactive-image'));
  layer.classList.add('is-active');layer.classList.toggle('is-text',text);layer.classList.toggle('is-image',image);
  horizontal.style.transform=`translateY(${y}px)`;vertical.style.transform=`translateX(${x}px)`;
  point.style.transform=`translate(${x}px,${y}px)`;
  label.textContent=doc.documentElement.lang==='en'?'View details':doc.documentElement.lang==='zh-Hant'?'查看細節':'查看细节';
  label.style.transform=`translate(${Math.min(x+19,win.innerWidth-110)}px,${Math.min(y+17,win.innerHeight-32)}px)`;
 };
 doc.addEventListener('pointermove',e=>{for(const other of crosshairOwners)if(other!==hide)other();if(e.pointerType!=='mouse'||!mouse.matches){hide();return;}latest={x:e.clientX,y:e.clientY,target:e.target};if(!raf)raf=win.requestAnimationFrame(draw);},{signal,passive:true});
 // Crossing iframe boundaries does not reliably emit document pointerleave.
 doc.addEventListener('pointerout',e=>{if(!e.relatedTarget||e.relatedTarget.tagName==='IFRAME')hide();},{signal,passive:true});
 doc.addEventListener('scroll',hide,{signal,passive:true,capture:true});
 doc.addEventListener('pointerleave',hide,{signal});
 article.addEventListener('scroll',hide,{signal,passive:true});
 doc.addEventListener('pointerdown',hide,{signal});
 win.addEventListener('blur',hide,{signal});
 mouse.addEventListener('change',hide,{signal});
 signal.addEventListener('abort',()=>{crosshairOwners.delete(hide);hide();layer.remove();style.remove();},{once:true});
}
