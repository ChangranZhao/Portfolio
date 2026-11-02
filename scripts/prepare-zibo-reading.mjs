import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
// The observed asset inventory limits this pass to the Qi Culture reading page.
const inventory=JSON.parse(await readFile(process.argv[2],'utf8'));
const manifest=JSON.parse(await readFile('site/asset-manifest.json','utf8'));
const reverse=new Map(Object.entries(manifest).map(([original,published])=>[published,original]));
const images={},stats={images:0,bytesBefore:0,bytesAfter:0,pixelsBefore:0,pixelsAfter:0};
await mkdir('dist/assets/zibo-reading',{recursive:true});
for(const url of new Set(inventory)){
 const published=url.replace(/^https?:\/\/[^/]+\//,'').replace(/^\.\//,''),source=reverse.get(published)||published;
 if(!/^assets\/(culture|field-research|spatial-design(?:-2)?|construction(?:-originals|-people)?|exhibit-01|ganshi|qizhiweiqi|yanzi)\//.test(source))continue;
 if(!/\.(webp|png|jpe?g|svg)$/i.test(source))continue;
 const input=await readFile('dist/'+source),svg=source.endsWith('.svg');
 if(svg&&input.length<100000)continue;
 const meta=await sharp(input).metadata();if(meta.width*meta.height<250000)continue;
 const spatial=source.includes('/spatial-design'),width=svg?1280:spatial?720:480,height=svg?1600:spatial?1200:720;
 const output=await sharp(input).rotate().resize({width,height,fit:'inside',withoutEnlargement:true}).webp({quality:svg?82:72,alphaQuality:90,effort:4}).toBuffer();
 const dims=await sharp(output).metadata();if(dims.width*dims.height>=meta.width*meta.height&&output.length>=input.length)continue;
 const target='assets/zibo-reading/'+source.slice(7).replaceAll('/','-').replace(/\.[^.]+$/,'.webp');
 await writeFile('dist/'+target,output);images[source]=target;
 stats.images++;stats.bytesBefore+=input.length;stats.bytesAfter+=output.length;stats.pixelsBefore+=meta.width*meta.height;stats.pixelsAfter+=dims.width*dims.height;
}
await writeFile('dist/zibo-reading-data.js','// Small reading assets; full sources stay available in viewers.\nexport const readingImages = '+JSON.stringify(images,null,1)+';\n');
console.log(JSON.stringify(stats));
