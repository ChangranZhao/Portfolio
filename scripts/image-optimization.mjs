import sharp from 'sharp';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const cacheDirectory=new URL('../node_modules/.cache/portfolio-images/',import.meta.url);
export function imageCacheURL(contents,profile='full'){return new URL(createHash('sha256').update('responsive-q76-v4:'+profile).update(contents).digest('hex')+'.webp',cacheDirectory);}

// Keep the source assets intact; optimize only the published copy.
export async function optimizeImage(contents, file) {
  if (!/\.(png|jpe?g|webp)$/i.test(file) || contents.length < 24 * 1024) return null;
  const profile=/-small\./i.test(file)?'small':/-thumb\./i.test(file)?'thumb':/-preview\./i.test(file)?'preview':/assets\/figma-details\//.test(file)?'board':'full';
  const widths={small:320,thumb:600,preview:1280,board:1440,full:1600},qualities={small:68,thumb:70,preview:72,board:74,full:76};
  const cached=imageCacheURL(contents,profile);
  try{return await readFile(cached);}catch(error){if(error.code!=='ENOENT')throw error;}
  const image = sharp(contents, { animated: true });
  const meta = await image.metadata();
  if ((meta.pages || 1) > 1) return null;
  // Preserve extra pixels in portrait boards/diagrams; landscape photos need less.
  const rotated=[5,6,7,8].includes(meta.orientation),width=rotated?meta.height:meta.width,height=rotated?meta.width:meta.height;
  const optimized = await image.rotate().resize({width:height>width&&profile==='full'?1920:widths[profile],height:8192,fit:'inside',withoutEnlargement:true})
    .webp({quality:qualities[profile],alphaQuality:90,effort:2}).toBuffer();
  if(optimized.length>=contents.length*.9)return null;
  await mkdir(cacheDirectory,{recursive:true});await writeFile(cached,optimized);
  return optimized;
}
