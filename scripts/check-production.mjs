import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import sharp from 'sharp';
const output=new URL('../site/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('asset-manifest.json',output),'utf8'));
const index=await readFile(new URL('index.html',output),'utf8');
assert.equal([...index.matchAll(/rel="stylesheet"/g)].length,1,'The homepage should request one combined stylesheet');
assert.match(manifest['app.js'],/^bundle-/);
const css=await readFile(new URL(manifest['site-styles.css'],output),'utf8');
assert.doesNotMatch(css,/@import\s/,'Nested stylesheet waterfalls should be bundled');
const {runtimeImages}=await import(new URL(manifest['runtime-image-assets.js'],output));
let previews=0,bytes=0;
for(const [group,images] of Object.entries(runtimeImages))for(const [name,record] of Object.entries(images)){
 for(const url of [record.src,record.preview].filter(Boolean))assert.ok((await stat(new URL(url,output))).size>0,url);
 if(group!=='neuro'||!record.preview)continue;
 assert.match(record.preview,/\.[a-f0-9]{12}\.webp$/,'Preview URLs must be fingerprinted');
 const file=new URL(record.preview,output),size=(await stat(file)).size,meta=await sharp(await readFile(file)).metadata();
 assert.ok(meta.width<=1280&&meta.height<=4096,name);
 assert.ok(size<600*1024,`Oversized preview: ${name}`);
 previews++;bytes+=size;
}
await assert.rejects(stat(new URL('assets/neuro/b2644.png',output)),{code:'ENOENT'},'The raw 17 MB PNG must not be copied into the publication');
let imageCount=0,imageBytes=0,largeImages=0;
for(const [source,target] of Object.entries(manifest)){
 if(!/\.(png|jpe?g|webp)$/i.test(target))continue;
 const contents=await readFile(new URL(target,output));
 const meta=await sharp(contents).metadata();
 assert.ok(meta.width>0&&meta.height>0,`Unreadable image: ${target}`);
 // Newly converted images follow the publication policy; existing tiny assets are retained.
 if(/\.(png|jpe?g)$/i.test(source)&&target.endsWith('.webp'))assert.ok(meta.width<=1920&&meta.height<=8192,source);
 imageCount++;imageBytes+=contents.length;if(contents.length>500*1024)largeImages++;
}
console.log(`All ${imageCount} publication images readable: ${(imageBytes/1048576).toFixed(2)} MiB; ${largeImages} over 500 KiB.`);
console.log(`Production checked: one stylesheet, bundled scripts, ${previews} complete NEURO previews (${(bytes/1048576).toFixed(2)} MiB), no raw 17 MB PNG.`);
