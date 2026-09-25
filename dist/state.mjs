export class WindowState {
  constructor(){this.items=new Map();this.active=null;this.layer=10;}
  open(id){
    let item=this.items.get(id);
    if(!item){item={id,minimized:false,z:0};this.items.set(id,item);}
    item.minimized=false;item.z=++this.layer;this.active=id;return item;
  }
  focus(id){if(this.items.has(id))return this.open(id);}
  minimize(id){const item=this.items.get(id);if(item)item.minimized=true;this.pickActive();}
  close(id){this.items.delete(id);this.pickActive();}
  pickActive(){this.active=[...this.items.values()].filter(x=>!x.minimized).sort((a,b)=>b.z-a.z)[0]?.id??null;}
}
export function clampPosition(x,y,w,h,vw,vh){
  return {x:Math.max(0,Math.min(x,Math.max(0,vw-w))),y:Math.max(38,Math.min(y,Math.max(38,vh-h-30)))};
}
