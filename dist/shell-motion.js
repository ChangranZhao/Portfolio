// Geometry is pure; a settled Dock has no animation-frame callbacks.
export function dockTargets(items,pointer,radius=130,maxScale=1.4){
 const scales=items.map(item=>pointer===null?1:1+(maxScale-1)*(1+Math.cos(Math.PI*Math.min(1,Math.abs(pointer-item.center)/radius)))/2);
 const extras=items.map((item,i)=>item.width*(scales[i]-1));let offset=-extras.reduce((a,b)=>a+b,0)/2;
 return items.map((item,i)=>{const x=offset+extras[i]/2;offset+=extras[i];return {scale:scales[i],x,y:0};});
}
export function fittedDockTargets(items,pointer,{viewportWidth,viewportHeight,room}){
 const size=Math.min(viewportWidth,viewportHeight),maxScale=size<768?1.5:size<1024?1.6:1.8,radius=(size<768?size*.35:size<1024?size*.3:300)/2;
 const desired=dockTargets(items,pointer,radius,maxScale),expansion=dockSurface(items,desired).expand;
 const fit=expansion>0?Math.min(1,Math.max(0,room)/expansion):1;
 return fit===1?desired:dockTargets(items,pointer,radius,1+(maxScale-1)*fit);
}
// Use current (interpolated) sizes so the base and dividers never lead the icons.
export function dockSurface(items,current,separatorCenters=[]){
 const extras=items.map((item,i)=>item.width*(current[i].scale-1));
 const expand=extras.reduce((sum,width)=>sum+width,0)/2;
 return {expand,separators:separatorCenters.map(center=>items.reduce((x,item,i)=>x+(item.center<center?extras[i]:0),-expand)||0)};
}
const motions=new WeakMap();
export function cancelWindowMotion(el){motions.get(el)?.cancel();motions.delete(el);}
function runMotion(el,frames,duration,onFinish,easing='cubic-bezier(.16,1,.3,1)',stageFirstFrame=false){
 const animation=el.animate(frames,{duration,easing,fill:'both'});
 let frame=0;
 const controller={cancel(){if(frame)cancelAnimationFrame(frame);frame=0;animation.cancel();}};
 motions.set(el,controller);
 animation.onfinish=()=>{if(motions.get(el)!==controller)return;motions.delete(el);onFinish();controller.cancel();};
 // Window construction, React commits and titlebar layout must not consume
 // the opening timeline before the browser can paint its first frame.
 if(stageFirstFrame&&animation.pause&&animation.play&&typeof requestAnimationFrame==='function'){
  animation.pause();animation.currentTime=0;
  frame=requestAnimationFrame(()=>{frame=requestAnimationFrame(()=>{
   frame=0;if(motions.get(el)!==controller)return;
   if(el.isConnected===false){motions.delete(el);controller.cancel();return;}
   animation.play();
  });});
 }
 return animation;
}
export function animateWindowLayout(el,change,{reduced=false,onFinish=()=>{}}={}){
 if(reduced||!el.animate){cancelWindowMotion(el);change();onFinish();return;}
 const from=el.getBoundingClientRect();cancelWindowMotion(el);change();const to=el.getBoundingClientRect();
 if(!to.width||!to.height){onFinish();return;}
 runMotion(el,[{transformOrigin:'0 0',transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`},{transformOrigin:'0 0',transform:'none'}],420,onFinish,'cubic-bezier(.22,.5,.36,1)');
}
export function animateWindow(el,kind,target,{reduced=false,onFinish=()=>{},readStyle=node=>getComputedStyle(node)}={}){
 const previous=motions.get(el),style=!reduced&&el.animate?readStyle(el):null;
 const origin=style?.transformOrigin||'50% 50%';
 const from=style?{transform:style.transform,opacity:style.opacity,transformOrigin:origin}:null;
 previous?.cancel();motions.delete(el);
 if(reduced||!el.animate){onFinish();return;}
 const r=el.getBoundingClientRect(),t=target||{left:r.left+r.width/2,top:r.top+r.height+80,width:40,height:30};
 const [xOrigin,yOrigin]=origin.split(' '),px=(v,size)=>v.endsWith('%')?parseFloat(v)*size/100:parseFloat(v);
 const sx=Math.max(.03,Math.min(1,t.width/r.width)),sy=Math.max(.03,Math.min(1,t.height/r.height));
 const collapsed={transform:`translate(${t.left-r.left-px(xOrigin,r.width)*(1-sx)}px,${t.top-r.top-px(yOrigin,r.height)*(1-sy)}px) scale(${sx},${sy})`,opacity:0,transformOrigin:origin};
 const normal={transform:'none',opacity:1,transformOrigin:origin};
 const frames=kind==='open'?[{transform:'scale(0.95)',opacity:0,transformOrigin:origin},normal]:kind==='restore'?[previous?from:collapsed,normal]:[from,kind==='close'?{transform:'scale(.97)',opacity:0,transformOrigin:origin}:collapsed];
 runMotion(el,frames,kind==='close'?150:kind==='open'?480:kind==='restore'?420:320,onFinish,['open','restore'].includes(kind)?'cubic-bezier(.22,.5,.36,1)':undefined,kind==='open');
}
