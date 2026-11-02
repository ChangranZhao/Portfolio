import {prepareProject} from './project-preload.js';
import {installProjectImageRecovery} from './project-image-recovery.js';
import {localizeText} from './localization.js';
const messages={
 title:['正在准备完整项目','正在準備完整專案','Preparing Full Project'],
 pages:['正在准备首屏','正在準備首屏','Preparing the first page'],
 assets:['正在加载首屏图片','正在載入首屏圖片','Loading the opening images'],
 note:['即将进入，后续内容会继续加载。','即將進入，後續內容會繼續載入。','Opening shortly. Remaining content continues loading.']
};
export function showProjectLoading(root,project,{maxWait=5500}={}){
 const doc=root.ownerDocument,win=doc.defaultView,controller=new win.AbortController();
 const text=key=>messages[key][doc.documentElement.lang==='zh-CN'?0:/^zh/i.test(doc.documentElement.lang)?1:2];
 const make=(tag,cls)=>{const n=doc.createElement(tag);n.className=cls;return n;};
 const overlay=make('section','project-loading'),card=make('div','project-loading-card'),cover=make('img','project-loading-cover');
 overlay.setAttribute('data-no-localize','');overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 cover.src=project.images[0]?.small||project.images[0]?.thumb||'';cover.alt='';cover.decoding='async';
 const eyebrow=make('small','project-loading-eyebrow');eyebrow.textContent='CREATIVE OS';
 const title=make('h2','project-loading-title'),name=make('p','project-loading-name');
 const progress=make('progress','project-loading-progress');progress.max=100;progress.value=0;
 const status=make('div','project-loading-status'),label=make('span',''),count=make('span','');status.append(label,count);
 const note=make('p','project-loading-note');card.append(cover,eyebrow,title,name,progress,status,note);overlay.append(card);root.append(overlay);
 const article=root.querySelector('.case-article'),chapters=root.querySelector('.case-chapters');
 root.classList.add('case-preparing');article?.setAttribute('aria-busy','true');article?.setAttribute('aria-hidden','true');if(chapters)chapters.inert=true;
 let phase='pages',done=0,total=0,percentage=0,revealed=false,disposeRecovery=()=>{};
 const render=()=>{title.textContent=text('title');name.textContent=localizeText(project.title);label.textContent=text(phase);count.textContent=total?`${done} / ${total}`:'';note.textContent=text('note');progress.setAttribute('aria-label',text('title'));};
 doc.addEventListener('portfolio-preferences',render,{signal:controller.signal});
 const reveal=()=>{
  if(revealed)return;revealed=true;win.clearTimeout(deadline);controller.abort();
  root.classList.remove('case-preparing');article?.removeAttribute('aria-busy');article?.removeAttribute('aria-hidden');if(chapters)chapters.inert=false;
  overlay.remove();if(article){disposeRecovery=installProjectImageRecovery(article);article.dispatchEvent(new win.Event('portfolio-project-ready',{bubbles:true}));}
 };
 // The reader deadline does not depend on the number or success of assets.
 const deadline=win.setTimeout(reveal,Math.min(5500,Math.max(0,maxWait)));render();
 prepareProject(article,{scope:'initial',timeout:4500,signal:controller.signal,onProgress:update=>{
  if(revealed)return;({phase,done,total}=update);const value=phase==='pages'?(total?done/total*35:35):35+(total?done/total*60:60);percentage=Math.max(percentage,value);progress.value=percentage;render();
 }}).then(reveal,error=>{if(error.name!=='AbortError')reveal();});
 return()=>{revealed=true;win.clearTimeout(deadline);controller.abort();disposeRecovery();overlay.remove();};
}
