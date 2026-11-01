import {readFile,writeFile,readdir,mkdir,rm,cp} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {optimizeImage} from './image-optimization.mjs';
import {bundleSite} from './bundle-site.mjs';
import sharp from 'sharp';
import {buildReact} from './build-react.mjs';
import {pagesHeaders} from './pages-headers.mjs';
await buildReact();
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
const imageDimensions=new Map();
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
    // srcset descriptors must match the published pixels, not source originals.
    if(file==='data.js')text=text.replace(/^export const projects = (.*);$/m,(_,json)=>{
      const projects=JSON.parse(json);
      for(const project of projects)for(const image of project.images){
        for(const [key,widthKey] of [['src','fullWidth'],['preview','previewWidth'],['small','smallWidth'],['thumb','thumbWidth']]){
          const dims=imageDimensions.get(image[key]);if(dims){image[widthKey]=dims.width;if(key==='src'){image.width=dims.width;image.height=dims.height;}}
        }
      }
      return 'export const projects = '+JSON.stringify(projects)+';';
    });
    contents=Buffer.from(text);
  }
  const optimized=await optimizeImage(contents,file);
  if(optimized){imageBytesBefore+=contents.length;imageBytesAfter+=optimized.length;optimizedImages++;contents=optimized;}
  const ext=path.posix.extname(file),hash=createHash('sha256').update(contents).digest('hex').slice(0,12);
  const target=file==='index.html'||stablePage||file.endsWith('OFL.txt')?file:file.slice(0,-ext.length)+'.'+hash+(optimized?'.webp':ext);
  if(/\.(png|jpe?g|webp)$/i.test(file)){const {width,height}=await sharp(contents).metadata();imageDimensions.set(target,{width,height});}
  await mkdir(path.dirname(path.join(output,target)),{recursive:true});await writeFile(path.join(output,target),contents);
  manifest[file]=target;visiting.delete(file);return target;
}
await emit('index.html');await emit('assets/Inter-OFL.txt');await emit('assets/culture/OFL.txt');await emit('assets/figma-fonts/OFL.txt');
await emit('cultural-digitalization.html');await emit('changzhi.html');await emit('zibo.html');
// Preserve explicit asset-directory references whose filenames are composed at runtime.
for(const directory of runtimeDirectories)await cp(path.join(source,directory),path.join(output,directory),{recursive:true});
await bundleSite(output,manifest);
await writeFile(path.join(output,'.nojekyll'),'');
await writeFile(path.join(output,'_headers'),pagesHeaders());
await writeFile(path.join(output,'asset-manifest.json'),JSON.stringify(manifest,null,2));
// npm postbuild runs the shared deployment verifier (sizes, counts and references).
console.log(`Built ${Object.keys(manifest).length} referenced files into site/ with content-hashed URLs.`);
console.log(`Optimized ${optimizedImages} images: ${(imageBytesBefore/1048576).toFixed(1)} → ${(imageBytesAfter/1048576).toFixed(1)} MiB; source images preserved.`);
