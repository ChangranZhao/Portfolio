import {translations} from './changzhi-translations.js';
import {traditional} from './chinese-traditional.js';
const records=new WeakMap();
const normalize=s=>s.replace(/\s+/g,' ').trim();
const lookup=new Map(Object.entries(translations).map(([a,b])=>[normalize(a),b]));
const fragments=Object.entries(translations).filter(([a])=>a.length>=2).sort((a,b)=>b[0].length-a[0].length);
export function changzhiText(text,lang){if(lang==='en'){const key=normalize(text);if(lookup.has(key))return text.replace(text.trim(),lookup.get(key));let result=text;for(const [a,b] of fragments)if(result.includes(a))result=result.replaceAll(a,b);return result;}return lang==='zh-Hant'?[...text].map(c=>traditional[c]||c).join(''):text;}

export function localizeChangzhi(doc,lang){
 if(!doc)return;
 let nodes=records.get(doc);if(!nodes){nodes=new Map();records.set(doc,nodes);}
 const walker=(doc.ownerDocument||doc).createTreeWalker(doc.body||doc,4);
 while(walker.nextNode()){const n=walker.currentNode;if(['SCRIPT','STYLE'].includes(n.parentElement?.tagName))continue;const old=nodes.get(n);if(!old||n.textContent!==old.last)nodes.set(n,{source:n.textContent,last:n.textContent});}
 for(const [n,record] of nodes){const next=changzhiText(record.source,lang);if(n.textContent!==next)n.textContent=next;record.last=next;}
 for(const el of (doc.body||doc).querySelectorAll('[title],[alt],[aria-label],[placeholder]')){for(const attr of ['title','alt','aria-label','placeholder']){if(!el.hasAttribute(attr))continue;const key='source-'+attr;const current=el.getAttribute(attr);if(!el.hasAttribute('data-'+key))el.setAttribute('data-'+key,current);el.setAttribute(attr,changzhiText(el.getAttribute('data-'+key),lang));}}
 if(doc.documentElement){doc.documentElement.lang=lang==='zh'?'zh-CN':lang;if(doc.querySelector('title')){const title=doc.querySelector('title');const source=title.dataset.source||title.textContent;title.dataset.source=source;title.textContent=changzhiText(source,lang);}}
}
