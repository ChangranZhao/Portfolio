const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));

export function chooseHotspotOffset(anchor,obstacles){
 const candidates=[[0,0]];
 for(const radius of [60,100,150,210,270])for(let i=0;i<16;i++){
  const angle=i*Math.PI/8;candidates.push([Math.cos(angle)*radius,Math.sin(angle)*radius]);
 }
 let best,score=Infinity;
 for(const [x,y] of candidates){
  // Includes the circle, the View label and a breathing margin.
  const box={left:anchor.x+x-86,right:anchor.x+x+86,top:anchor.y+y-48,bottom:anchor.y+y+132};
  const cost=obstacles.reduce((sum,r)=>sum+overlap(box,r),0)*10000+Math.hypot(x,y);
  if(cost<score){score=cost;best={x,y,box};}
  if(cost===0)break;
 }
 return best;
}

export function layoutSpatialHotspots(drawing){
 const bounds=drawing.getBoundingClientRect(),scale=bounds.width/3840;
 if(!scale)return;
 const rect=r=>({left:(r.left-bounds.left)/scale,right:(r.right-bounds.left)/scale,top:(r.top-bounds.top)/scale,bottom:(r.bottom-bounds.top)/scale});
 const obstacles=[];
 for(const p of drawing.querySelectorAll('p')){
  if(!p.getBoundingClientRect().width||p.closest('.sp-secondary-label'))continue;
  const range=drawing.ownerDocument.createRange();range.selectNodeContents(p);
  for(const r of range.getClientRects())if(r.width&&r.height)obstacles.push(rect(r));
 }
 const placements=[...drawing.querySelectorAll('.sp-point')].map(button=>{
  const host=rect(button.parentElement.getBoundingClientRect());
  const placement=chooseHotspotOffset({x:(host.left+host.right)/2,y:(host.top+host.bottom)/2},obstacles);
  obstacles.push(placement.box);return {button,...placement};
 });
 for(const {button,x,y} of placements){button.style.setProperty('--sp-point-x',x+'px');button.style.setProperty('--sp-point-y',y+'px');}
}
