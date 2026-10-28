import {registerTranslations} from './localization.js';
registerTranslations([['Content','内容'],['Concept','概念'],['Story','故事'],['Details','细节'],['Design','设计'],['Technique','制作技术']]);
import {mimesisPages} from './mimesis-page-data.js';
import {traditional} from './chinese-traditional.js';
import {mimesisEnglish} from './mimesis-original-translations.js';
const mimesisChinese={'DIGITAL-CLOTH DESIGN':'数字服饰设计','DIGITAL-CLOTH  DESIGN':'数字服饰设计','CONTENT':'内容','CONCEPT':'概念','STORY':'故事','DETAILS':'细节','DESIGN':'设计','TECHNICH':'制作技术','BASIC PREVIEW':'场景预览','CLOTH & SCENE':'服饰与场景','The Shape of AI':'人工智能的形态','CONCEPT DESIGN & DIGITAL CLOTH':'概念设计与数字服饰','CONCEPT DESIGN':'概念设计','CONCEPT DESIGN & DIGITAL CLOTH':'概念设计与数字服饰','DIHITAL ART':'数字艺术','Turn AI into clothing, treat it as our companion, and live with it.':'将 AI 化作服饰，视其为伙伴，与之共生。','ANTI-MECHANICAL SENSE OF LIFE':'反机械 · 生命感'};
const hantExtra={'梦':'夢','谜':'謎','强':'強','许':'許','弃':'棄','摆':'擺','壳':'殼','紧':'緊','谓':'謂','么':'麼','难':'難','严':'嚴','愿':'願','丽':'麗','飞':'飛','吗':'嗎','伙':'夥'};
const toHant=text=>[...text].map(c=>hantExtra[c]||traditional[c]||c).join('').replaceAll('關系','關係').replaceAll('聯系','聯繫').replaceAll('制作','製作').replaceAll('制成','製成').replaceAll('復制人','複製人').replaceAll('隨着','隨著');
const labels=['Overview','Content','Concept','Story','Details','Design','Technique'];
const ids=['case-overview','mimesis-content','mimesis-concept','mimesis-story','mimesis-details','mimesis-design','mimesis-technique'];
export const mimesisChapters=labels.map((label,i)=>[label,ids[i]]);
export function createMimesis(article,project,{openImage}){
 article.classList.add('mimesis-article');const frames=[];
 const language=()=>{const value=document.documentElement.lang.toLowerCase();return value.startsWith('zh')?(/hant|tw|hk|mo/.test(value)?'zh-Hant':'zh'):'en';};
 function localize(frame){const doc=frame.contentDocument;if(!doc)return;for(const p of doc.querySelectorAll('p')){p.dataset.original??=p.textContent;const original=p.dataset.original;const lang=language();doc.documentElement.lang=lang==='zh'?'zh-CN':lang;const key=original.replace(/\s+/g,' ').trim();p.dataset.miType=key==='MIMESIS'?'brand':key==='DIGITAL-CLOTH DESIGN'?'subtitle':key==='CLOTH & SCENE'?'vertical':key==='The Shape of AI'?'hero-subtitle':key==='CONCEPT DESIGN & DIGITAL CLOTH'?'hero-caption':key==='BASIC PREVIEW'?'label':/^(CONTENT|CONCEPT|STORY|DETAILS|DESIGN|TECHNICH)$/.test(key)?'heading':/[\u3400-\u9fff]/.test(key)?'body':key.replace(/[\s\u200b]/g,'')===''?'empty':'other';const chinese=mimesisChinese[key]||original;p.textContent=lang==='en'?(mimesisEnglish[key]||original):lang==='zh-Hant'?toHant(chinese):chinese;}
 // Fit translated paragraphs within their authored boxes without changing the composition.
 for(const p of doc.querySelectorAll('p[data-original]')){p.dataset.fontSize??=p.style.fontSize;p.style.fontSize=p.dataset.fontSize;const style=doc.defaultView.getComputedStyle(p),size=parseFloat(style.fontSize);if(language()!=='en'||!/[\u3400-\u9fff]/.test(p.dataset.original))continue;const parent=p.parentElement;const available=p.style.height?parseFloat(p.style.height):parent.style.height?parseFloat(parent.style.height):0;if(available>0){let font=size;while(font>size*.65&&p.scrollHeight>available+2){font-=.5;p.style.fontSize=font+'px';}}}}

 function arrange(frame){
  const doc=frame.contentDocument;if(!doc)return;const root=doc.querySelector('[data-node-id="1:3153"], [data-node-id="1:3221"]');if(!root)return;
  if(!root.dataset.reflow){root.dataset.reflow='true';root.classList.add('mi-flow-spread');const take=id=>root.querySelector('[data-node-id="'+id+'"]');const column=(ids,cls)=>{const box=doc.createElement('div');box.className='mi-flow-column '+cls;for(const id of ids){const n=take(id);if(n)box.append(n);}root.append(box);};
   if(root.dataset.nodeId==='1:3153'){column(['1:3160','1:3161','1:3163','1:3155','1:3165'],'mi-flow-left');column(['1:3166','1:3176'],'mi-flow-middle');column(['1:3169','1:3178','1:3175','1:3170','1:3177'],'mi-flow-right');}
   else{column(['1:3223','1:3224','1:3225','1:3226'],'mi-flow-story-copy');column(['1:3227'],'mi-flow-story-art');}
  }
  frame.contentWindow.requestAnimationFrame(()=>{const height=Math.ceil(root.getBoundingClientRect().height);frame.style.height=height+'px';const section=frame.parentElement;section.style.aspectRatio='2880 / '+height;});
 }
 const listener=()=>frames.forEach(frame=>{localize(frame);arrange(frame);});document.addEventListener('portfolio-preferences',listener);const languageObserver=new MutationObserver(listener);languageObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 const observer=new ResizeObserver(entries=>{for(const entry of entries){const stage=entry.target;stage.querySelector('iframe').style.transform='scale('+entry.contentRect.width/2880+')';}});
 mimesisPages.forEach((page,i)=>{const section=document.createElement('section');section.className='mi-original-page';section.id=ids[i];if(i===1)section.classList.add('mi-readable-content');if([0,2,3,5].includes(i))section.classList.add('mi-large-copy-'+i);const frame=document.createElement('iframe');frame.src=page.page;frame.title='MIMESIS / '+labels[i];frame.className='mi-original-frame';frame.setAttribute('scrolling','no');frame.loading=i===0?'eager':'lazy';section.append(frame);article.append(section);frames.push(frame);observer.observe(section);frame.onload=()=>{localize(frame);arrange(frame);for(const img of frame.contentDocument.images){const visible=img.getBoundingClientRect();if(visible.width<80||visible.height<80||parseFloat(frame.contentWindow.getComputedStyle(img).opacity)<.5)continue;img.style.cursor='zoom-in';img.style.pointerEvents='auto';img.onclick=()=>openImage([{src:img.src,name:project.title}],0,project.title);}};});
 return()=>{observer.disconnect();languageObserver.disconnect();document.removeEventListener('portfolio-preferences',listener);};
}
