import {readFile,writeFile,copyFile,mkdir,stat} from 'node:fs/promises';
import sharp from 'sharp';

const root=new URL('../',import.meta.url);
const source=new URL('output/imagegen/dock-v2/',root);
const target=new URL('dist/assets/dock-v2/',root);
const manifest=JSON.parse(await readFile(new URL('manifest.json',source),'utf8'));
await mkdir(target,{recursive:true});
let total=0;
for(const icon of manifest.icons){
  const local=new URL(`${icon.name}.png`,source);
  try{await stat(local);}catch{await copyFile(icon.source,local);}
  const contents=await readFile(local);
  const meta=await sharp(contents).metadata();
  if(!meta.hasAlpha)throw new Error(`${icon.name}: missing transparent background`);
  // Retain the generated artwork; only resize and encode its delivery copy.
  const data=await sharp(contents).resize(256,256,{fit:'contain',background:'#00000000'}).webp({quality:90,alphaQuality:100,effort:6}).toBuffer();
  await writeFile(new URL(`${icon.name}.webp`,target),data);
  total+=data.length;
  console.log(`${icon.name}: ${meta.width}x${meta.height} -> 256x256, ${(data.length/1024).toFixed(1)} KiB`);
}
console.log(`Dock icons total: ${(total/1024).toFixed(1)} KiB`);
