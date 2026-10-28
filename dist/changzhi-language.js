import {translations} from './changzhi-translations.js';
import {traditional} from './chinese-traditional.js';
const records=new WeakMap();
export function localizeChangzhi(doc,lang){
 if(!doc)return;
 let nodes=records.get(doc);if(!nodes){nodes=new Map();records.set(doc,nodes);}
 const walker=(doc.ownerDocument||doc).createTreeWalker(doc.body||doc,4);
 while(walker.nextNode()){const n=walker.currentNode;if(['SCRIPT','STYLE'].includes(n.parentElement?.tagName))continue;if(!nodes.has(n))nodes.set(n,n.textContent);}
 for(const [n,text] of nodes){const key=text.trim();n.textContent=lang==='en'?(translations[key]??text):lang==='zh-Hant'?[...text].map(c=>traditional[c]||c).join(''):text;}
 if(doc.documentElement)doc.documentElement.lang=lang==='zh'?'zh-CN':lang;
}
