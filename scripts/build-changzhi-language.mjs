import {readFile,writeFile} from 'node:fs/promises';
import {translateBoard} from './changzhi-zh.mjs';
const base=new URL('../',import.meta.url);
const research=JSON.parse(await readFile(new URL('tmp/changzhi-figma-research.json',base)));research.records.push(JSON.parse(await readFile(new URL('tmp/changzhi-814.json',base))));
const original=await readFile(new URL('scripts/import-figma-details.mjs',base),'utf8');
const converter=original.slice(original.indexOf('const assets=new Map()'),original.indexOf("await mkdir(new URL('dist/figma-pages/'")).replaceAll('backdrop-blur|mask-size','backdrop-blur|mask-size|mask-position').replace("'mask-size':'mask-size'","'mask-size':'mask-size','mask-position':'mask-position'");
const {convert}=new Function(converter+';return {convert};')();
const pairs={};
for(const r of research.records){const key=r.nodeId.replace(':','-');const html='<title>'+r.content[0].match(/data-name="([^"]+)"/)?.[1]+'</title>'+convert(r.content[0].replaceAll('leading-none','leading-[1]'),key);const zh=translateBoard(html,key);const texts=s=>[...s.replace(/<style[\s\S]*?<\/style>/g,'').matchAll(/>([^<>]+)</g)].map(m=>m[1]);const a=texts(html),b=texts(zh);b.forEach((t,i)=>{if(t!==a[i])pairs[t.trim()]=a[i].trim();});}
Object.assign(pairs,{'长治博物馆 / 数字遗产':'Changzhi Museum / Digital Heritage','放大阅读 ↗':'Enlarge ↗','适应宽度 ↙':'Fit width ↙','从全馆图谱开始 ↓':'Explore the museum atlas ↓','文化主题':'Cultural themes','数字方法':'Digital methods','全部':'All','采集':'Capture','重建':'Reconstruction','动画':'Animation','投影':'Projection','交互':'Interaction','回到全馆关联图谱 ↑':'Back to the museum atlas ↑'});
await writeFile(new URL('dist/changzhi-translations.js',base),'export const translations='+JSON.stringify(pairs,null,2)+';\n');
