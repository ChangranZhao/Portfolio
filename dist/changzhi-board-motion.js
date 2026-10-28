// Animate the editable photo layers, keeping every Figma asset in its original slot.
const stage=document.querySelector('.figma-canvas');
let reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let active=false,entered=false;
const photoLayers=[...stage.querySelectorAll('img')].filter(i=>!i.src.endsWith('.svg')).map(i=>i.closest('[data-name]')||i.parentElement);
const unique=[...new Set(photoLayers)];
stage.querySelectorAll('img').forEach(image=>{if(!image.src.endsWith('.svg')){image.style.pointerEvents='auto';image.tabIndex=0;image.setAttribute('role','button');image.setAttribute('aria-label','放大：'+(image.closest('[data-name]')?.dataset.name||'项目图像'));image.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();image.click();}});}});
function reveal(){if(!active||entered||reduced)return;entered=true;unique.forEach((el,i)=>el.animate([{opacity:.35,translate:'0 14px'},{opacity:1,translate:'0 0'}],{duration:650,delay:Math.min(i*55,650),easing:'ease-out'}));}
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='changzhi-board-visible'){active=e.data.active;reveal();}if(e.data?.type==='portfolio-preferences'){reduced=Boolean(e.data.motion);if(reduced)document.getAnimations().forEach(a=>a.finish());}});
stage.addEventListener('click',e=>{const image=e.target.closest('img');if(!image||image.src.endsWith('.svg'))return;parent.postMessage({type:'changzhi-board-image',src:image.src,name:image.closest('[data-name]')?.dataset.name||'项目图像'},location.origin);});
