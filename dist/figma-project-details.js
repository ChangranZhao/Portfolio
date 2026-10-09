import {figmaPages} from './figma-page-data.js';
import {localizeFigmaBoard} from './figma-board-language.js';
import {registerTranslations} from './localization.js';
const chapterTranslations={Overview:'项目概览','Product concept':'产品概念',TeleAbsence:'远距缺席','Design position':'设计立场','Material & form':'材料与形态','Function & structure':'功能与结构',Interaction:'交互',System:'系统','App wireflows':'应用线框流程','App design':'应用设计','Functional prototype':'功能原型',Enclosure:'外壳',Interviews:'访谈',Projection:'投影','Product prototype':'产品原型','Technical details':'技术细节','Everyday journey':'日常旅程',Lifecycle:'生命周期',Encounters:'相遇','Performance directions':'演出方向','A room of light':'光构成的房间','Visual language':'视觉语言',Making:'制作','Live system':'现场系统','Inside the image':'置身影像',Audience:'观众','Open sky':'开阔天空','Doubled image':'重叠影像','Open enclosure':'打开围合','Return to volume':'回归空间',Reflection:'反思','Language & perception':'语言与感知',Exhibition:'展览','World building':'世界构建','Planetary environments':'行星环境','Writing system':'书写系统','Visual development':'视觉开发','Comparative alphabet':'比较字母表','Interaction narrative':'交互叙事',Development:'开发','Distance & connection':'距离与连接'};
registerTranslations(Object.entries(chapterTranslations));
registerTranslations([['Memory & background','记忆与背景']]);
const groups={p3:'2',p4:'3',p2:'4'};
const labels={
 p3:['Overview','Product concept','TeleAbsence','Design position','Material & form','Function & structure','Interaction','System','App wireflows','App design','Functional prototype','Enclosure','Interviews','Projection','Product prototype','Technical details','Everyday journey','Lifecycle'],
 p4:['Overview','Encounters','Memory & background','A room of light','Visual language','Making','Live system','Inside the image','Audience','Open sky','Doubled image','Open enclosure','Return to volume','Reflection'],
 p2:['Overview','Language & perception','Distance & connection','World building','Planetary environments','Writing system','Visual development','Comparative alphabet','Interaction narrative','Development','Exhibition','Reflection']
};
const pagesFor=id=>figmaPages.filter(p=>p.name.startsWith(groups[id]+'_'));
const labelFor=(id,page)=>labels[id][Number(page.name.split('page')[1])-1];
export const hasFigmaDetails=id=>Object.hasOwn(groups,id);
export const figmaChapters=id=>pagesFor(id).map((p,i)=>[`${String(i+1).padStart(2,'0')} / ${labelFor(id,p)}`,`figma-${p.id.replace(':','-')}`]);
export function createFigmaDetails(article,project,{openImage}){
 article.classList.add('figma-article');
 article.parentElement?.classList.add('figma-reader');
 const boards=[],controller=new AbortController();
 const language=()=>document.documentElement.lang==='zh-CN'?'zh':document.documentElement.lang;
 document.addEventListener('portfolio-preferences',()=>{for(const {frame} of boards)localizeFigmaBoard(frame.contentDocument,language());},{signal:controller.signal});
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion');
 const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}},{root:article,threshold:.08});
 for(const [i,p] of pagesFor(project.id).entries()){
  const label=labelFor(project.id,p);
  const section=document.createElement('section');section.className='figma-page';section.id=`figma-${p.id.replace(':','-')}`;section.setAttribute('aria-label',`${i+1}. ${label}`);
  const rail=document.createElement('div');rail.className='figma-page-rail';
  const stage=document.createElement('div');stage.className='figma-page-stage';
  const frame=document.createElement('iframe');frame.className='figma-page-frame';frame.src=p.page;frame.title=`${project.title} — ${String(i+1).padStart(2,'0')} / ${label}`;frame.loading=i===0?'eager':'lazy';frame.setAttribute('scrolling','no');
  frame.addEventListener('load',()=>{
   const doc=frame.contentDocument;if(!doc)return;doc.body.classList.toggle('reduce-motion',reduced());
   localizeFigmaBoard(doc,language());
   const images=[...doc.images];
   const items=images.map((img,n)=>({src:img.currentSrc||img.src,name:img.closest('[data-name]')?.dataset.name||`${label} · ${n+1}`}));
   images.forEach((img,n)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Enlarge image: '+items[n].name);img.setAttribute('aria-haspopup','dialog');img.style.pointerEvents='auto';img.classList.add('figma-interactive-image');
    const open=()=>openImage(items,n,project.title+' / '+label);
    img.addEventListener('click',e=>{e.stopPropagation();open();},{signal:controller.signal});
    img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}},{signal:controller.signal});
   });
   // Captions and transparent collage layers may sit above the photograph.
   doc.addEventListener('click',e=>{
    if(doc.getSelection()?.toString())return;
    const img=doc.elementsFromPoint(e.clientX,e.clientY).find(el=>el.matches('img.figma-interactive-image'));
    if(img)openImage(items,images.indexOf(img),project.title+' / '+label);
   },{signal:controller.signal});
  },{signal:controller.signal});
  stage.append(frame);rail.append(stage);section.append(rail);article.append(section);boards.push({rail,stage,frame});
  reveal.observe(section);
 }
 const resize=()=>{for(const {rail,stage,frame} of boards){const width=rail.clientWidth;if(!width)continue;const scale=width/1920;stage.style.width=width+'px';stage.style.height=1080*scale+'px';frame.style.transform=`scale(${scale})`;}};
 const observer=new ResizeObserver(resize);observer.observe(article);
 const dispose=()=>{cancelAnimationFrame(scheduled);observer.disconnect();reveal.disconnect();controller.abort();};
 const scheduled=requestAnimationFrame(()=>{resize();article.closest('.window')?.addEventListener('window-closing',dispose,{once:true});});
 return dispose;
}
