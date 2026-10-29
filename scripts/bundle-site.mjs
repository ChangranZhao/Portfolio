import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';

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
 console.log(`Bundled ${styles.length} page stylesheets into one; application code minified with deferred project chunks.`);
}
