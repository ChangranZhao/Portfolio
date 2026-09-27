import {exhibitContent} from './exhibit-content.js';
import {exhibitMedia} from './exhibit-media.js';
import {traditional} from './chinese-traditional.js';

function wording(zh,en){
 const lang=document.documentElement.lang;
 return lang==='en'?en:lang==='zh-Hant'?[...zh].map(c=>traditional[c]||c).join(''):zh;
}
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}

export function createExhibitReader(){
 let dialog=null,current=0,photo=0,trigger=null;
 function close(){
  if(!dialog)return;
  dialog.close();dialog.remove();dialog=null;
  if(trigger?.isConnected)trigger.focus({preventScroll:true});
 }
 function showPhoto(index){
  const entry=exhibitContent[current],media=exhibitMedia[entry.id];photo=Math.max(0,Math.min(media.length-1,index));
  const item=media[photo],image=dialog.querySelector('.ex-main-image');
  image.src=item.src;image.width=item.width;image.height=item.height;
  image.alt=wording(entry.title[0]+' · '+(item.videoStill?'视频静帧':'展项照片')+' '+(photo+1),entry.title[1]+' · '+(item.videoStill?'Video still':'Exhibit photo')+' '+(photo+1));
  dialog.querySelector('.ex-image-count').textContent=`${String(photo+1).padStart(2,'0')} / ${String(media.length).padStart(2,'0')} · `+wording(item.videoStill?'视频静帧':'展项照片',item.videoStill?'VIDEO STILL':'EXHIBIT PHOTO');
  dialog.querySelector('[data-photo="prev"]').disabled=photo===0;
  dialog.querySelector('[data-photo="next"]').disabled=photo===media.length-1;
  for(const [i,b] of [...dialog.querySelectorAll('.ex-thumb')].entries())b.setAttribute('aria-pressed',String(i===photo));
 }
 function render(){
  if(!dialog)return;
  const entry=exhibitContent[current],media=exhibitMedia[entry.id];
  dialog.replaceChildren();dialog.setAttribute('aria-label',wording('展项详情 · '+entry.title[0],'Exhibit details · '+entry.title[1]));
  const header=element('header','ex-window-bar');
  header.append(element('span','',wording('风从东方来 / 展项详情','WIND FROM THE EAST / EXHIBIT DETAILS')));
  const closeButton=element('button','ex-close',wording('关闭 ×','Close ×'));closeButton.type='button';closeButton.onclick=close;header.append(closeButton);
  const body=element('div','ex-reader-body'),gallery=element('section','ex-gallery'),stage=element('div','ex-image-stage');
  const main=element('img','ex-main-image');main.decoding='async';stage.append(main);
  const enlarge=element('button','ex-image-expand',wording('放大照片 ↗','Enlarge photo ↗'));enlarge.type='button';
  enlarge.setAttribute('aria-pressed',String(dialog.classList.contains('ex-photo-expanded')));
  enlarge.onclick=()=>{const expanded=dialog.classList.toggle('ex-photo-expanded');enlarge.setAttribute('aria-pressed',String(expanded));enlarge.textContent=wording(expanded?'返回介绍 ↙':'放大照片 ↗',expanded?'Back to details ↙':'Enlarge photo ↗');};
  stage.append(enlarge);gallery.append(stage);
  const controls=element('div','ex-photo-controls');controls.append(element('span','ex-image-count'));
  const photoButtons=element('div');
  for(const [action,label] of [['prev','←'],['next','→']]){const b=element('button','',label);b.type='button';b.dataset.photo=action;b.setAttribute('aria-label',wording(action==='prev'?'上一张照片':'下一张照片',action==='prev'?'Previous photo':'Next photo'));b.onclick=()=>showPhoto(photo+(action==='prev'?-1:1));photoButtons.append(b);}
  controls.append(photoButtons);gallery.append(controls);
  const thumbs=element('div','ex-thumbnails');thumbs.setAttribute('aria-label',wording('展项照片','Exhibit photographs'));
  media.forEach((item,index)=>{const b=element('button','ex-thumb');b.type='button';b.setAttribute('aria-label',wording('查看照片 ','View photo ')+(index+1));b.onclick=()=>showPhoto(index);const im=element('img');im.src=item.thumb;im.alt='';im.width=item.width;im.height=item.height;im.loading='lazy';im.decoding='async';b.append(im);if(item.videoStill)b.append(element('span','',wording('静帧','STILL')));thumbs.append(b);});gallery.append(thumbs);
  const info=element('article','ex-info');
  info.append(element('p','ex-eyebrow',wording(...entry.zone)),element('div','ex-number',current<2?wording(current===0?'前厅':'序厅',current===0?'LOBBY':'PREFACE'):'EXHIBIT '+entry.id),element('h2','',wording(...entry.title)),element('h3','',wording('展项介绍','ABOUT THE EXHIBIT')));
  entry.text.forEach((text,i)=>info.append(element('p','ex-description',wording(text,entry.en[i]))));
  info.append(element('p','ex-source',wording('根据《齐文化典籍中心最终版方案》（260105）第 '+entry.pages.join('、')+' 页整理。','Adapted from the Qi Culture Classics Center proposal (260105), pp. '+entry.pages.join(', ')+'.')));
  body.append(gallery,info);
  const footer=element('footer','ex-reader-footer');
  const prev=element('button','',wording('← 上一展项','← Previous exhibit')),next=element('button','',wording('下一展项 →','Next exhibit →'));prev.type=next.type='button';prev.disabled=current===0;next.disabled=current===exhibitContent.length-1;
  const select=element('select','ex-jump');select.setAttribute('aria-label',wording('选择展项','Choose an exhibit'));
  exhibitContent.forEach((e,i)=>{const option=element('option','',(i<2?'':e.id+' / ')+wording(...e.title));option.value=i;option.selected=i===current;select.append(option);});
  function change(i){current=i;photo=0;dialog.classList.remove('ex-photo-expanded');render();dialog.querySelector('.ex-reader-body').scrollTop=0;dialog.querySelector('.ex-jump').focus({preventScroll:true});}
  prev.onclick=()=>change(current-1);next.onclick=()=>change(current+1);select.onchange=()=>change(Number(select.value));footer.append(prev,select,next);
  dialog.append(header,body,footer);showPhoto(photo);
 }
 function open(id,opener){
  const index=exhibitContent.findIndex(e=>e.id===id);if(index<0)return;
  current=index;photo=0;trigger=opener;
  if(!dialog){
   dialog=element('dialog','ex-reader');dialog.setAttribute('data-no-localize','');
   dialog.addEventListener('cancel',e=>{e.preventDefault();if(dialog.classList.contains('ex-photo-expanded'))dialog.querySelector('.ex-image-expand').click();else close();});
   dialog.addEventListener('keydown',e=>{if(e.target.matches('select')||e.altKey||e.ctrlKey||e.metaKey)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();showPhoto(photo+(e.key==='ArrowRight'?1:-1));}});
   document.body.append(dialog);render();dialog.showModal();
  }else{dialog.classList.remove('ex-photo-expanded');render();}
 }
 document.addEventListener('portfolio-preferences',render);
 return {open,close,destroy(){close();document.removeEventListener('portfolio-preferences',render);}};
}
