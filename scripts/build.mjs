import {readFile,writeFile,readdir,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
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
const manifest={},visiting=new Set();
async function emit(file){
  if(manifest[file])return manifest[file];if(visiting.has(file))throw Error('Circular build dependency: '+file);
  visiting.add(file);let contents=await readFile(path.join(source,file));
  if(/\.(html|css|m?js)$/.test(file)){
    let text=contents.toString('utf8');const matches=[...text.matchAll(/"(?:\\.|[^"\\\r\n])*"|'(?:\\.|[^'\\\r\n])*'/g)];
    for(const match of matches.reverse()){
      const value=match[0].slice(1,-1),quote=match[0][0];
      const candidate=path.posix.normalize(path.posix.join(path.posix.dirname(file),value));
      if(!files.has(candidate))continue;
      const target=await emit(candidate);let replacement=path.posix.relative(path.posix.dirname(file),target);
      if(value.startsWith('./'))replacement='./'+replacement;
      text=text.slice(0,match.index)+quote+replacement+quote+text.slice(match.index+match[0].length);
    }
    contents=Buffer.from(text);
  }
  const ext=path.posix.extname(file),hash=createHash('sha256').update(contents).digest('hex').slice(0,12);
  const target=file==='index.html'||file.endsWith('OFL.txt')?file:file.slice(0,-ext.length)+'.'+hash+ext;
  await mkdir(path.dirname(path.join(output,target)),{recursive:true});await writeFile(path.join(output,target),contents);
  manifest[file]=target;visiting.delete(file);return target;
}
await emit('index.html');await emit('assets/Inter-OFL.txt');
await writeFile(path.join(output,'.nojekyll'),'');
await writeFile(path.join(output,'_headers'),'/*\n  Cache-Control: public, max-age=0, must-revalidate\n/assets/*\n  Cache-Control: public, max-age=31536000, immutable\n');
await writeFile(path.join(output,'asset-manifest.json'),JSON.stringify(manifest,null,2));
console.log(`Built ${Object.keys(manifest).length} referenced files into site/ with content-hashed URLs.`);
