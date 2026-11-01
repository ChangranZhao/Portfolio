import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';

export async function bundleSite(output,manifest){
 const index=path.join(output,'index.html');let html=await readFile(index,'utf8');
 const links=[...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
 const styles=links.map(([tag])=>tag.match(/href="([^"]+)"/)[1]);
 const css=await build({
  stdin:{contents:styles.map(file=>`@import ${JSON.stringify('./'+file)};`).join('\n'),resolveDir:output,loader:'css'},
  bundle:true,minify:true,write:false,logLevel:'silent',target:'es2022',
  plugins:[{name:'preserve-published-image-urls',setup(build){
   build.onResolve({filter:/.*/},args=>args.kind==='url-token'?{path:args.path,external:true}:undefined);
  }}]
 });
 const contents=css.outputFiles[0].contents;
 const cssName='site-styles.'+createHash('sha256').update(contents).digest('hex').slice(0,12)+'.css';
 await writeFile(path.join(output,cssName),contents);
 html=html.replace(links[0][0],`<link rel="stylesheet" href="${cssName}">`);
 for(const [tag] of links.slice(1))html=html.replace(tag,'');
 manifest['site-styles.css']=cssName;

 // Keep chunks at the site root so existing import.meta.url asset URLs retain
 // their meaning. Dynamic project imports stay deferred instead of joining boot.
 const entryNames=['app.js','startup.js'];
 const result=await build({entryPoints:entryNames.map(file=>path.join(output,manifest[file])),outdir:output,
  bundle:true,splitting:true,format:'esm',minify:true,metafile:true,target:'es2022',
  entryNames:'bundle-[name]-[hash]',chunkNames:'chunk-[hash]',logLevel:'silent'});
 for(const [filename,info] of Object.entries(result.metafile.outputs)){
  if(!info.entryPoint)continue;
  const entry=entryNames.find(file=>path.resolve(info.entryPoint)===path.join(output,manifest[file]));
  if(!entry)continue;
  const name=path.basename(filename);html=html.replace(`src="${manifest[entry]}"`,`src="${name}"`);manifest[entry]=name;
 }
 await writeFile(index,html);
 const outputs=result.metafile.outputs;
 const byPath=new Map(Object.entries(outputs).map(([file,info])=>[path.resolve(file),{file,info}]));
 const initial=new Set();
 function visit(file){const record=byPath.get(path.resolve(file));if(!record||initial.has(record.file))return;initial.add(record.file);for(const dependency of record.info.imports)if(dependency.kind!=='dynamic-import'&&!dependency.external)visit(dependency.path);}
 for(const [file,info] of Object.entries(outputs))if(info.entryPoint&&entryNames.some(name=>path.resolve(info.entryPoint)===path.join(output,manifest[name])||path.basename(file)===manifest[name]))visit(file);
 const reactOutputs=Object.entries(outputs).filter(([,info])=>Object.keys(info.inputs).some(input=>path.basename(input)===manifest['react-apps.js']));
 if(!initial.size||!reactOutputs.length||reactOutputs.some(([file])=>initial.has(file)))throw Error('React applications must remain outside the startup dependency graph');
 const reactBytes=reactOutputs.reduce((n,[,info])=>n+info.bytes,0);
 const reactGzipBytes=(await Promise.all(reactOutputs.map(async([file])=>gzipSync(await readFile(file)).length))).reduce((a,b)=>a+b,0);
 await writeFile(path.join(output,'build-report.json'),JSON.stringify({initialScripts:[...initial].map(file=>path.basename(file)),reactDeferred:true,reactBytes,reactGzipBytes},null,2));
 console.log(`Bundled ${styles.length} page stylesheets into one; application code minified with deferred project chunks.`);
 console.log(`Deferred React application transfer: ${(reactGzipBytes/1024).toFixed(1)} KiB gzip.`);
}
