import {gaiaPages} from './gaia-pages.js';
import {localizeGaia} from './gaia-language.js';
import {setupSpaceCrosshair} from './space-crosshair.js';
import {setupSpaceMotion,spaceImageIsContent} from './space-motion.js';
import {figmaPages} from './figma-page-data.js';
import {localizeFigmaBoard} from './figma-board-language.js';
import {registerTranslations} from './localization.js';
import {setupSpectralAssembly} from './spectral-assembly-motion.js';
import {setupSpectralSystem} from './spectral-system-motion.js';
import {setupSpectralWireflow} from './spectral-wireflow-motion.js';
import {setupSpectralMockups} from './spectral-mockup-motion.js';
import {createBoardScheduler} from './board-performance.js';
const chapterTranslations={Overview:'项目概览','Product concept':'产品概念',TeleAbsence:'远距缺席','Design position':'设计立场','Material & form':'材料与形态','Function & structure':'功能与结构',Interaction:'交互',System:'系统','App wireflows':'应用线框流程','App design':'应用设计','Functional prototype':'功能原型',Enclosure:'外壳',Interviews:'访谈',Projection:'投影','Product prototype':'产品原型','Technical details':'技术细节','Everyday journey':'日常旅程',Lifecycle:'生命周期',Encounters:'相遇','Performance directions':'演出方向','A room of light':'光构成的房间','Visual language':'视觉语言',Making:'制作','Live system':'现场系统','Inside the image':'置身影像',Audience:'观众','Open sky':'开阔天空','Doubled image':'重叠影像','Open enclosure':'打开围合','Return to volume':'回归空间',Reflection:'反思','Language & perception':'语言与感知',Exhibition:'展览','World building':'世界构建','Planetary environments':'行星环境','Writing system':'书写系统','Visual development':'视觉开发','Comparative alphabet':'比较字母表','Interaction narrative':'交互叙事',Development:'开发','Distance & connection':'距离与连接'};
registerTranslations(Object.entries(chapterTranslations));
registerTranslations([['Cover','封面'],['Memory & background','记忆与背景'],['Project context','项目背景'],['Research & data','数据研究'],['Interaction design','交互设计'],['Technical system','技术实现'],['Narrative','叙事与视觉转译'],['Final work','最终呈现']]);
const groups={p8:'gaia',p3:'2',p4:'3',p2:'4'};
const labels={
 p8:['Project context','Research & data','Interaction design','Technical system','Narrative','Final work'],
 p3:['Overview','Product concept','TeleAbsence','Design position','Material & form','Function & structure','Interaction','System','App wireflows','App design','Functional prototype','Enclosure','Interviews','Projection','Product prototype','Technical details','Everyday journey','Lifecycle'],
 p4:['Overview','Encounters','Memory & background','A room of light','Visual language','Making','Live system','Inside the image','Audience','Open sky','Doubled image','Open enclosure','Return to volume','Reflection'],
 p2:['Overview','Language & perception','Distance & connection','World building','Planetary environments','Writing system','Visual development','Comparative alphabet','Interaction narrative','Development','Exhibition','Reflection']
};
const pagesFor=id=>id==='p8'?gaiaPages:figmaPages.filter(p=>p.name.startsWith(groups[id]+'_'));
const labelFor=(id,page)=>page.label||labels[id][Number(page.name.split('page')[1])-1];
registerTranslations([['Concept film','概念短片'],['Prototype demonstration','原型演示'],['App demonstration','应用演示']]);
export const hasFigmaDetails=id=>Object.hasOwn(groups,id);
export const figmaChapters=id=>pagesFor(id).map((p,i)=>[id==='p8'?(i===0?'Cover':`${String(i).padStart(2,'0')} / ${labelFor(id,p)}`):`${String(i+1).padStart(2,'0')} / ${labelFor(id,p)}`,`figma-${p.id.replace(':','-')}`]);
export function createFigmaDetails(article,project,{openImage}){
 const localize=project.id==='p8'?localizeGaia:localizeFigmaBoard;
 article.classList.add('figma-article');
 article.parentElement?.classList.add('figma-reader');
 const boards=[],controller=new AbortController(),scheduler=createBoardScheduler(article);
 const language=()=>document.documentElement.lang==='zh-CN'?'zh':document.documentElement.lang;
 document.addEventListener('portfolio-preferences',()=>{for(const {frame} of boards){const doc=frame.contentDocument;if(frame.getAttribute('src')&&doc?.URL!=='about:blank')localize(doc,language());}},{signal:controller.signal});
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion');
 const reveal=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-visible');reveal.unobserve(e.target);}},{root:article,threshold:.08});
 for(const [i,p] of pagesFor(project.id).entries()){
  const label=labelFor(project.id,p);
  const section=document.createElement('section');section.className='figma-page';section.id=`figma-${p.id.replace(':','-')}`;section.setAttribute('aria-label',`${i+1}. ${label}`);
  const rail=document.createElement('div');rail.className='figma-page-rail';
  const stage=document.createElement('div');stage.className='figma-page-stage';
  if(project.id==='p2'&&Number(p.name.split('page')[1])>=9){section.style.background='#000000';stage.style.background='#000000';rail.style.background='#000000';}
  const frame=document.createElement('iframe');frame.className='figma-page-frame';frame.title=`${project.title} — ${String(i+1).padStart(2,'0')} / ${label}`;frame.loading='eager';frame.setAttribute('scrolling','no');
  if(p.id==='spectral-film'||p.id==='spectral-prototype-film'||p.id==='spectral-ui-film'){frame.allow='fullscreen; autoplay; encrypted-media; picture-in-picture';frame.allowFullscreen=true;}
  frame.addEventListener('load',()=>{
   const doc=frame.contentDocument;if(!doc||!frame.getAttribute('src')||doc.URL==='about:blank')return;doc.body.classList.toggle('reduce-motion',reduced());
   localize(doc,language());
   if(project.id==='p2')setupSpaceMotion(doc,section,article,controller.signal,reduced);
   const images=[...doc.images].filter(img=>project.id==='p8'?/\.(?:png|webp)(?:$|[?#])/.test(img.src):project.id!=='p2'||spaceImageIsContent(img));
   const items=images.map((img,n)=>({src:img.currentSrc||img.src,name:img.closest('[data-name]')?.dataset.name||`${label} · ${n+1}`}));
   images.forEach((img,n)=>{img.tabIndex=0;img.setAttribute('role','button');img.setAttribute('aria-label','Enlarge image: '+items[n].name);img.setAttribute('aria-haspopup','dialog');img.style.pointerEvents='auto';img.classList.add('figma-interactive-image');
    const open=()=>project.id==='p8'?setTimeout(()=>openImage(items,n,project.title+' / '+label),0):openImage(items,n,project.title+' / '+label);
    img.addEventListener('click',e=>{e.stopPropagation();open();},{signal:controller.signal});
    img.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}},{signal:controller.signal});
   });
   if(project.id==='p2')setupSpaceCrosshair(doc,article,controller.signal);
   if(project.id==='p3'&&p.id==='33:3153')setupSpectralAssembly(doc,section,article,controller.signal,reduced);
   if(project.id==='p3'&&p.id==='33:3570')setupSpectralSystem(doc,section,article,controller.signal,reduced);
   if(project.id==='p3'&&p.id==='36:5538')setupSpectralWireflow(doc,section,article,controller.signal,reduced);
   if(project.id==='p3'&&p.id==='33:3665')setupSpectralMockups(doc,section,article,controller.signal,reduced);
   // Captions and transparent collage layers may sit above the photograph.
   doc.addEventListener('click',e=>{
    if(doc.getSelection()?.toString())return;
    const img=doc.elementsFromPoint(e.clientX,e.clientY).find(el=>el.matches('img.figma-interactive-image'));
    if(img)openImage(items,images.indexOf(img),project.title+' / '+label);
   },{signal:controller.signal});
  },{signal:controller.signal});
  stage.append(frame);rail.append(stage);section.append(rail);article.append(section);boards.push({rail,stage,frame});
  scheduler.observe(frame,section,p.page,i===0);
  reveal.observe(section);
  if(project.id==='p8'&&p.id==='2009:2'){
   const video=document.createElement('section');video.className='mimesis-project-video';video.id='gaia-project-video';
   const player=document.createElement('iframe');player.src='https://www.youtube-nocookie.com/embed/arpZAWx3yNw';player.title='GAIA HYPOTHESIS — Project Video';player.loading='lazy';player.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';player.allowFullscreen=true;player.referrerPolicy='strict-origin-when-cross-origin';
   video.append(player);article.append(video);
  }
 }
 const resize=()=>{for(const {rail,stage,frame} of boards){const width=rail.clientWidth;if(!width)continue;const scale=width/1920;stage.style.width=width+'px';stage.style.height=1080*scale+'px';frame.style.transform=`scale(${scale})`;}};
 const observer=new ResizeObserver(resize);observer.observe(article);
 const dispose=()=>{cancelAnimationFrame(scheduled);observer.disconnect();reveal.disconnect();scheduler.dispose();controller.abort();};
 const scheduled=requestAnimationFrame(()=>{resize();article.closest('.window')?.addEventListener('window-closing',dispose,{once:true});});
 return dispose;
}
