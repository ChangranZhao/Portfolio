import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cacheDirectory=new URL('../node_modules/.cache/portfolio-images/',import.meta.url);
export function imageCacheURL(contents){return new URL(createHash('sha256').update('1600-landscape-1920-tall-q78-a90-v3').update(contents).digest('hex')+'.webp',cacheDirectory);}

// Keep the source assets intact; optimize only the published copy.
export async function optimizeImage(contents, file) {
  if (!/\.(png|jpe?g|webp)$/i.test(file) || contents.length < 24 * 1024) return null;
  const cached=imageCacheURL(contents);
  try{return await readFile(cached);}catch(error){if(error.code!=='ENOENT')throw error;}
  const image = sharp(contents, { animated: true });
  const meta = await image.metadata();
  if ((meta.pages || 1) > 1) return null;
  // Preserve extra pixels in portrait boards/diagrams; landscape photos need less.
  const rotated=[5,6,7,8].includes(meta.orientation),width=rotated?meta.height:meta.width,height=rotated?meta.width:meta.height;
  const optimized = await image.rotate().resize({width:height>width?1920:1600,height:8192,fit:'inside',withoutEnlargement:true})
    .webp({quality:78,alphaQuality:90,effort:2}).toBuffer();
  if(optimized.length>=contents.length*.9)return null;
  await mkdir(cacheDirectory,{recursive:true});await writeFile(cached,optimized);
  return optimized;
}
