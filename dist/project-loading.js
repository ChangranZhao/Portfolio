import {prepareProject} from './project-preload.js';
import {localizeText} from './localization.js';

const messages={
 title:['正在准备完整项目','正在準備完整專案','Preparing Full Project'],
 pages:['正在准备图板与动效','正在準備圖版與動效','Preparing pages & interactions'],
 assets:['正在加载图片与字体','正在載入圖片與字體','Loading images & fonts'],
 note:['准备完成后自动进入，阅读时无需逐张等待图片。','準備完成後自動進入，閱讀時無需逐張等待圖片。','Your project opens when its reading resources are ready.'],
 failed:['部分资源暂时无法加载，请重试。','部分資源暫時無法載入，請重試。','Some resources could not be loaded. Please retry.'],
 retry:['重新加载','重新載入','Retry'],enter:['先阅读已加载的内容','先閱讀已載入的內容','Read available content']
};
export function showProjectLoading(root,project){
 const doc=root.ownerDocument,win=doc.defaultView,controller=new win.AbortController();
 const text=key=>messages[key][doc.documentElement.lang==='zh-CN'?0:/^zh/i.test(doc.documentElement.lang)?1:2];
 const make=(tag,cls)=>{const n=doc.createElement(tag);n.className=cls;return n;};
 const overlay=make('section','project-loading'),card=make('div','project-loading-card'),cover=make('img','project-loading-cover');
 overlay.setAttribute('data-no-localize','');overlay.setAttribute('role','status');overlay.setAttribute('aria-live','polite');
 cover.src=project.images[0]?.small||project.images[0]?.thumb||'';cover.alt='';cover.decoding='async';
 const eyebrow=make('small','project-loading-eyebrow');eyebrow.textContent='CREATIVE OS';
 const title=make('h2','project-loading-title'),name=make('p','project-loading-name');name.textContent=project.title;
 const progress=make('progress','project-loading-progress');progress.max=100;progress.value=0;
 const status=make('div','project-loading-status'),label=make('span',''),count=make('span','');status.append(label,count);
 const note=make('p','project-loading-note'),actions=make('div','project-loading-actions'),retry=make('button','project-loading-retry'),enter=make('button','project-loading-enter');
 retry.type=enter.type='button';actions.append(retry,enter);actions.hidden=true;
 card.append(cover,eyebrow,title,name,progress,status,note,actions);overlay.append(card);root.append(overlay);
 const article=root.querySelector('.case-article'),chapters=root.querySelector('.case-chapters');
 root.classList.add('case-preparing');article?.setAttribute('aria-busy','true');article?.setAttribute('aria-hidden','true');if(chapters)chapters.inert=true;
 let phase='pages',done=0,total=0,percentage=0,failed=false,disposed=false;
 const render=()=>{title.textContent=text('title');name.textContent=localizeText(project.title);label.textContent=text(failed?'failed':phase);count.textContent=failed?'':`${done} / ${total}`;note.textContent=text('note');retry.textContent=text('retry');enter.textContent=text('enter');progress.setAttribute('aria-label',text('title'));};
 doc.addEventListener('portfolio-preferences',render,{signal:controller.signal});
 const reveal=()=>{
  if(disposed)return;disposed=true;progress.value=100;root.classList.remove('case-preparing');article?.removeAttribute('aria-busy');article?.removeAttribute('aria-hidden');if(chapters)chapters.inert=false;
  overlay.remove();article?.dispatchEvent(new win.Event('portfolio-project-ready',{bubbles:true}));controller.abort();
 };
 const run=async retryFailed=>{
  failed=false;actions.hidden=true;render();
  try{
   const failures=await prepareProject(article,{signal:controller.signal,retry:retryFailed,onProgress:update=>{({phase,done,total}=update);const value=phase==='pages'?(total?done/total*35:35):35+(total?done/total*60:60);percentage=Math.max(percentage,value);progress.value=percentage;render();}});
   if(disposed)return;
   if(failures.length){failed=true;actions.hidden=false;overlay.dataset.failed=String(failures.length);overlay.dataset.failedResources=JSON.stringify(failures.map(f=>({url:f.url,reason:f.error?.message})));render();}else reveal();
  }catch(error){if(error.name!=='AbortError'&&!disposed){failed=true;actions.hidden=false;render();}}
 };
 retry.onclick=()=>run(true);enter.onclick=reveal;render();run(false);
 return()=>{disposed=true;controller.abort();overlay.remove();};
}
