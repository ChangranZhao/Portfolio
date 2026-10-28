import {readFile,writeFile} from 'node:fs/promises';
const path=new URL('../dist/changzhi-primary.js',import.meta.url);
let s=await readFile(path,'utf8');
s="import {localizeChangzhi} from './changzhi-language.js';\n"+s;
s=s.replace(" const controller=new AbortController()", " const language=()=>document.documentElement.lang==='zh-CN'?'zh':document.documentElement.lang;\n localizeChangzhi(root,language());\n const controller=new AbortController()");
s=s.replace('function notify(frame,active){','function notify(frame,active){if(frame.contentDocument?.body)localizeChangzhi(frame.contentDocument,language());');
s=s.replace("()=>frames.forEach(f=>notify(f,visible.has(f))),{signal});", "()=>{localizeChangzhi(root,language());frames.forEach(f=>notify(f,visible.has(f)));},{signal});",1);
await writeFile(path,s);
const lp=new URL('../dist/changzhi-language.js',import.meta.url);let l=await readFile(lp,'utf8');l=l.replace('doc.createTreeWalker(doc.body,4)','(doc.ownerDocument||doc).createTreeWalker(doc.body||doc,4)').replace(" doc.documentElement.lang=lang==='zh'?'zh-CN':lang;"," if(doc.documentElement)doc.documentElement.lang=lang==='zh'?'zh-CN':lang;");await writeFile(lp,l);
