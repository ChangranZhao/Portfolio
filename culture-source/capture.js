import {toSvg,getFontEmbedCSS} from 'html-to-image';

function elementMatrix(node){
 const style=getComputedStyle(node);
 const origin=style.transformOrigin.split(' ').map(parseFloat);
 return new DOMMatrix().translate(parseFloat(style.left)||0,parseFloat(style.top)||0)
  .translate(origin[0]||0,origin[1]||0,origin[2]||0)
  .multiply(new DOMMatrix(style.transform==='none'?undefined:style.transform))
  .translate(-(origin[0]||0),-(origin[1]||0),-(origin[2]||0));
}

function surfacePose(node){
 const card=node.closest('.photo-card'),globe=card.closest('.globe');
 const local=elementMatrix(card).multiply(elementMatrix(node));
 const world=new DOMMatrix(getComputedStyle(globe).transform).multiply(local);
 const style=getComputedStyle(node);
 const center=world.transformPoint(new DOMPoint(parseFloat(style.width)/2,parseFloat(style.height)/2,0));
 const normal=world.transformPoint(new DOMPoint(0,0,1,0));
 const camera=parseFloat(getComputedStyle(globe.parentElement).perspective);
 return {local,depth:center.z,visible:normal.z*(camera-center.z)-normal.x*center.x-normal.y*center.y>0};
}

export async function captureViewport(){
 const {innerWidth:width,innerHeight:height,scrollX,scrollY}=window;
 const pixelRatio=Math.min(window.devicePixelRatio||1,2);
 await Promise.all(Array.from(document.images, image=>image.decode().catch(()=>{})));
 // A standalone SVG does not inherit the page's downloaded fonts. Embed them
 // when loaded; if the page itself uses fallback fonts, retain those instead.
 const hasWebFonts=Array.from(document.fonts).some(font=>font.status==='loaded');
 const fontEmbedCSS=hasWebFonts?await getFontEmbedCSS(document.body):'';
 const surfaces=new Map(Array.from(document.querySelectorAll('.photo-face'),node=>[
  node.closest('.photo-card').dataset.photo+'-'+node.dataset.face,surfacePose(node)
 ]));
 const svg=await toSvg(document.body,{
  backgroundColor:'#080a0c',
  filter:node=>{
   if(node.hasAttribute?.('data-capture-exclude'))return false;
   if(!node.classList?.contains('photo-face'))return true;
   return surfaces.get(node.closest('.photo-card').dataset.photo+'-'+node.dataset.face).visible;
  },
  fontEmbedCSS,
 });
 const documentClone=new DOMParser().parseFromString(decodeURIComponent(svg.slice(svg.indexOf(',')+1)),'image/svg+xml');
 // SVG descendants need explicit presentation styles in a standalone export;
 // the HTML clone can otherwise lose their class-based fill and typography.
 const graphNodes=document.querySelectorAll('.knowledge-graph, .knowledge-graph *');
 documentClone.querySelectorAll('.knowledge-graph, .knowledge-graph *').forEach((node,index)=>{
  if(!graphNodes[index])return;
  const style=getComputedStyle(graphNodes[index]);
  for(const property of ['fill','fill-opacity','stroke','stroke-width','stroke-opacity','font-family','font-size','font-weight','font-style','letter-spacing','text-anchor','opacity','filter','color','visibility','display']){
   node.style.setProperty(property,style.getPropertyValue(property),'important');
  }
 });
 const globe=documentClone.querySelector('.globe');
 // Flatten visible surfaces into one depth-sorted list. SVG foreignObject
 // does not reliably preserve nested CSS 3D occlusion or backface visibility.
 if(globe){
  const faces=Array.from(globe.querySelectorAll('.photo-face')).map(node=>({node,pose:surfaces.get(node.closest('.photo-card').dataset.photo+'-'+node.dataset.face)}));
  faces.sort((a,b)=>a.pose.depth-b.pose.depth).forEach(({node,pose})=>{
   // Override cloned logical inset properties as well as physical offsets.
   node.style.setProperty('left','0px','important');
   node.style.setProperty('top','0px','important');
   node.style.setProperty('transform-origin','0px 0px','important');
   node.style.setProperty('transform',pose.local.toString(),'important');
   globe.append(node);
  });
  globe.querySelectorAll('.photo-card').forEach(card=>card.remove());
 }
 const source=new Image();
 source.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(documentClone));
 await source.decode();
 const canvas=document.createElement('canvas');
 canvas.width=Math.round(width*pixelRatio);
 canvas.height=Math.round(height*pixelRatio);
 const context=canvas.getContext('2d');
 context.fillStyle='#080a0c';
 context.fillRect(0,0,canvas.width,canvas.height);
 context.drawImage(source,scrollX,scrollY,width,height,0,0,canvas.width,canvas.height);
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('无法生成图片')),'image/png'));
}

export function downloadImage(blob,name){
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');
 link.href=url;link.download=name;
 document.body.append(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),60000);
}
