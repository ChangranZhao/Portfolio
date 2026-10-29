import {readFile,writeFile,readdir,mkdir,rm,cp,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {optimizeImage} from './image-optimization.mjs';
import {bundleSite} from './bundle-site.mjs';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=path.join(root,'dist'),output=path.join(root,'site');
// Only the dedicated generated output directory is cleaned.
if(path.dirname(output)!==root.replace(/[\\/]$/,'')||path.basename(output)!=='site')throw Error('Invalid output path');
const files=new Set();
async function list(dir=''){
  for(const entry of await readdir(path.join(source,dir),{withFileTypes:true})){
    const file=path.posix.join(dir,entry.name);if(entry.isDirectory())await list(file);else if(entry.isFile())files.add(file);
  }
}
await list();await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
const manifest={},visiting=new Set(),runtimeDirectories=new Set();
let imageBytesBefore=0,imageBytesAfter=0,optimizedImages=0;
async function emit(file){
  if(manifest[file])return manifest[file];if(visiting.has(file))throw Error('Circular build dependency: '+file);
  const stablePage=['cultural-digitalization.html','changzhi.html','zibo.html'].includes(file);
  if(stablePage)manifest[file]=file;
  visiting.add(file);let contents=await readFile(path.join(source,file));
  if(/\.(html|css|m?js)$/.test(file)){
    let text=contents.toString('utf8');const matches=[...text.matchAll(/"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/g)];
    for(const match of matches.reverse()){
      const value=match[0].slice(1,-1),quote=match[0][0];
      const candidate=path.posix.normalize(path.posix.join(path.posix.dirname(file),value));
      if(value.endsWith('/')&&candidate.startsWith('assets/')&&[...files].some(f=>f.startsWith(candidate))){runtimeDirectories.add(candidate);continue;}
      if(!files.has(candidate))continue;
      const target=await emit(candidate);let replacement=path.posix.relative(path.posix.dirname(file),target);
      if(value.startsWith('./'))replacement='./'+replacement;
      text=text.slice(0,match.index)+quote+replacement+quote+text.slice(match.index+match[0].length);
    }
    contents=Buffer.from(text);
  }
  const optimized=await optimizeImage(contents,file);
  if(optimized){imageBytesBefore+=contents.length;imageBytesAfter+=optimized.length;optimizedImages++;contents=optimized;}
  const ext=path.posix.extname(file),hash=createHash('sha256').update(contents).digest('hex').slice(0,12);
  const target=file==='index.html'||stablePage||file.endsWith('OFL.txt')?file:file.slice(0,-ext.length)+'.'+hash+(optimized?'.webp':ext);
  await mkdir(path.dirname(path.join(output,target)),{recursive:true});await writeFile(path.join(output,target),contents);
  manifest[file]=target;visiting.delete(file);return target;
}
await emit('index.html');await emit('assets/Inter-OFL.txt');await emit('assets/culture/OFL.txt');await emit('assets/figma-fonts/OFL.txt');
await emit('cultural-digitalization.html');await emit('changzhi.html');await emit('zibo.html');
// Preserve explicit asset-directory references whose filenames are composed at runtime.
for(const directory of runtimeDirectories)await cp(path.join(source,directory),path.join(output,directory),{recursive:true});
await bundleSite(output,manifest);
await writeFile(path.join(output,'.nojekyll'),'');
await writeFile(path.join(output,'_headers'),'/*\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n');
await writeFile(path.join(output,'asset-manifest.json'),JSON.stringify(manifest,null,2));
// Cloudflare Pages rejects the entire deployment if any output file exceeds 25 MiB.
const maxAssetBytes=25*1024*1024;
const oversized=[];
async function checkOutputSizes(directory){
  for(const entry of await readdir(directory,{withFileTypes:true})){
    const file=path.join(directory,entry.name);
    if(entry.isDirectory())await checkOutputSizes(file);
    else if(entry.isFile()){
      const {size}=await stat(file);
      if(size>maxAssetBytes)oversized.push(`${path.relative(output,file)} (${(size/1024/1024).toFixed(2)} MiB)`);
    }
  }
}
await checkOutputSizes(output);
if(oversized.length)throw new Error('Cloudflare Pages file limit exceeded (25 MiB). Compress these assets before deploying:\n'+oversized.join('\n'));
console.log(`Built ${Object.keys(manifest).length} referenced files into site/ with content-hashed URLs.`);
console.log(`Optimized ${optimizedImages} images: ${(imageBytesBefore/1048576).toFixed(1)} → ${(imageBytesAfter/1048576).toFixed(1)} MiB; source images preserved.`);
