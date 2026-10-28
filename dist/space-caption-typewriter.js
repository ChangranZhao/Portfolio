// Reveal the existing text without changing its layout or localized content.
export function setupCaptionTypewriter(doc,section,article,signal,reduced){
 const caption=doc.querySelector('[data-node-id="747:22068"]');
 if(!caption)return;
 const lines=[...caption.querySelectorAll('p')];
 let raf=0,played=false;
 const finish=()=>{cancelAnimationFrame(raf);for(const p of lines)p.style.clipPath='none';caption.style.visibility='visible';};
 for(const p of lines)p.style.clipPath='inset(0 100% 0 0)';
 caption.style.visibility='visible';
 const observer=new IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.35))return;
  played=true;observer.disconnect();if(reduced()){finish();return;}
  const start=performance.now()+300;
  const tick=now=>{
   if(signal.aborted||reduced()){finish();return;}
   let remaining=Math.floor(Math.max(0,now-start)/65),done=true;
   for(const p of lines){
    const count=Array.from(p.textContent).length;
    const shown=Math.min(count,Math.max(0,remaining));remaining-=count+5;
    if(shown<count)done=false;
    if(shown===0){p.style.clipPath='inset(0 100% 0 0)';continue;}
    if(shown===count){p.style.clipPath='none';continue;}
    const walker=doc.createTreeWalker(p,4);const range=doc.createRange();range.setStart(p,0);
    let chars=shown,node;
    while((node=walker.nextNode())){const letters=Array.from(node.textContent);if(chars<=letters.length){range.setEnd(node,letters.slice(0,chars).join('').length);break;}chars-=letters.length;}
    const bounds=p.getBoundingClientRect();const edge=range.getBoundingClientRect().right;
    p.style.clipPath=`inset(0 ${Math.max(0,(bounds.right-edge)/bounds.width*100)}% 0 0)`;
   }
   if(done)finish();else raf=requestAnimationFrame(tick);
  };raf=requestAnimationFrame(tick);
 },{root:article,threshold:.35});observer.observe(section);
 document.addEventListener('portfolio-preferences',finish,{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
