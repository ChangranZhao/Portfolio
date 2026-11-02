// Pause motion, never the retained text, images or layout.
export function manageProjectActivity(article,signal){
 const doc=article.ownerDocument,win=doc.defaultView;let timer;
 const observer=new win.IntersectionObserver(entries=>{for(const entry of entries)entry.target.classList.toggle('project-section-paused',!entry.isIntersecting);},{root:article});
 for(const section of article.children)observer.observe(section);
 const background=()=>article.classList.toggle('project-background-paused',doc.hidden||article.closest('.window')?.dataset.suspended==='true');
 article.addEventListener('scroll',()=>{
  article.classList.add('project-scroll-paused');clearTimeout(timer);timer=setTimeout(()=>article.classList.remove('project-scroll-paused'),150);
 },{passive:true,signal});
 doc.addEventListener('portfolio-windows-changed',background,{signal});doc.addEventListener('visibilitychange',background,{signal});background();
 signal.addEventListener('abort',()=>{clearTimeout(timer);observer.disconnect();},{once:true});
}
