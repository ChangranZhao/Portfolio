// Figma emits manually broken lines as separate paragraphs, but keeps some
// editable long passages as one paragraph. Preserve both kinds of text box.
for(const p of document.querySelectorAll('p:only-child')){
 const box=p.parentElement,style=getComputedStyle(p);
 const line=parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.2;
 if(box.clientHeight>line*1.55)p.style.whiteSpace='normal';
}
window.addEventListener('message',event=>{
 if(event.origin===location.origin&&event.data?.type==='portfolio-preferences'){
  document.body.classList.toggle('reduce-motion',Boolean(event.data.motion));
 }
});
