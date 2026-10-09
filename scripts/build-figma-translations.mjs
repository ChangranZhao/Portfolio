import {readFile,writeFile} from 'node:fs/promises';
const sources=JSON.parse(await readFile('qa/figma-text-sources.json','utf8'));
const lines=(await readFile('qa/figma-zh-index.txt','utf8')).trim().split(/\r?\n/);
const translations=new Map(lines.map(line=>{const i=line.indexOf('|');return[Number(line.slice(0,i)),line.slice(i+1)];}));
if(translations.size!==sources.length||sources.some((_,i)=>!translations.get(i)))throw Error('Incomplete Figma translations');
await writeFile('dist/figma-translations.js','// Authored translations for the editable Figma text blocks.\nexport const figmaTranslations = '+JSON.stringify(Object.fromEntries(sources.map((source,i)=>[source,translations.get(i)])),null,2)+';\n');
console.log('Compiled '+translations.size+' translated text blocks.');
