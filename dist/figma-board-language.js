import {figmaTranslations} from './figma-translations.js';
import {traditional} from './chinese-traditional.js';
const records=new WeakMap();
const normalize=s=>s.replace(/\s+/g,' ').trim();
export function localizeFigmaBoard(doc,language){
 if(!doc?.querySelector('.figma-canvas'))return;
 let blocks=records.get(doc);
 if(!blocks){
  const elements=[...new Set([...doc.querySelectorAll('p')].map(p=>[...p.parentElement.children].every(e=>e.tagName==='P')?p.parentElement:p))];
  blocks=elements.map(el=>{
   const paragraphs=el.tagName==='P'?[el]:[...el.children];
   const source=normalize(paragraphs.map(p=>p.textContent).join(' '));
   const sample=paragraphs[0],style=doc.defaultView.getComputedStyle(sample);
   return{el,source,nodes:[...el.childNodes],sample:sample.cloneNode(false),lines:paragraphs.length,font:parseFloat(style.fontSize),line:parseFloat(style.lineHeight)/parseFloat(style.fontSize)||1.2,width:el.clientWidth,height:el.clientHeight,ownParagraph:el.tagName==='P',originalStyle:el.getAttribute('style')};
  });
  records.set(doc,blocks);
 }
 doc.documentElement.lang=language==='zh'?'zh-CN':language;
 for(const block of blocks){
  const {el,source,nodes,ownParagraph}=block;
  el.replaceChildren(...nodes);
  if(block.originalStyle===null)el.removeAttribute('style');else el.setAttribute('style',block.originalStyle);
  el.removeAttribute('data-translated');
  if(language==='en')continue;
  let translated=figmaTranslations[source];
  if(translated===undefined)continue;
  if(language==='zh-Hant')translated=[...translated].map(c=>traditional[c]||c).join('');
  const titleBreak=block.font>=60&&block.lines>1&&/^[\u3400-\u9fff]{4,8}$/.test(translated);
  if(titleBreak){const middle=Math.ceil(translated.length/2);translated=translated.slice(0,middle)+'\n'+translated.slice(middle);}
  const p=ownParagraph?el:block.sample.cloneNode(false);
  p.textContent=translated;
  if(!ownParagraph)el.replaceChildren(p);
  p.style.whiteSpace=titleBreak?'pre-line':'normal';p.style.wordBreak='normal';p.style.overflowWrap='anywhere';
  if(block.font>=32)p.style.textWrap='balance';
  p.style.fontFamily='"Microsoft YaHei","PingFang SC",Arial,sans-serif';
  p.style.letterSpacing='0';p.style.maxWidth='100%';
  p.style.lineHeight=String(Math.min(1.5,Math.max(1.15,block.line)));
  p.style.flexShrink='0';
  // Keep the original text box geometry while allowing Chinese to wrap naturally.
  let size=block.font;p.style.fontSize=size+'px';
  const available=block.height||el.parentElement.clientHeight;
  while(size>block.font*.55&&(p.scrollHeight>available+1||p.scrollWidth>block.width+1||el.scrollHeight>available+1)){
   size-=.5;p.style.fontSize=size+'px';
  }
  el.dataset.translated=language;
 }
}
