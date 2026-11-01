import {build} from 'esbuild';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=new URL('../',import.meta.url);
export async function buildReact(){
 const sources=[['dist/windows.js','Window lifecycle and pointer interactions'],['dist/shell-motion.js','Window and Dock motion'],['dist/blue-calico.js','Blue Calico Realm editorial page'],['dist/board-performance.js','Project board scheduling'],['src/react-apps/Library.tsx','React portfolio and photo library'],['src/react-apps/About.tsx','React profile application']];
 const files=await Promise.all(sources.map(async([name,description])=>({name,description,language:name.endsWith('tsx')?'typescript':'javascript',content:await readFile(new URL(name,root),'utf8')})));
 await mkdir(new URL('dist/assets/',root),{recursive:true});
 await writeFile(new URL('dist/assets/creativeos-source.json',root),JSON.stringify(files));
 const result=await build({entryPoints:[fileURLToPath(new URL('src/react-apps/index.tsx',root))],outfile:fileURLToPath(new URL('dist/react-apps.js',root)),bundle:true,format:'esm',minify:true,target:'es2022',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof',metafile:true});
 const bytes=Object.values(result.metafile.outputs).reduce((n,o)=>n+o.bytes,0);
 if(bytes>400*1024)throw Error(`React application bundle exceeds 400 KiB budget: ${bytes}`);
 console.log(`React applications: ${(bytes/1024).toFixed(1)} KiB, loaded on demand.`);
 const gallery=await build({entryPoints:[fileURLToPath(new URL('src/ue-gallery/index.js',root))],outfile:fileURLToPath(new URL('dist/ue-gallery.js',root)),banner:{js:'/*!\n'+(await readFile(new URL('node_modules/three/LICENSE',root),'utf8'))+'\n*/'},bundle:true,format:'esm',minify:true,target:'es2022',legalComments:'eof',metafile:true});
 const galleryBytes=Object.values(gallery.metafile.outputs).reduce((n,o)=>n+o.bytes,0);if(galleryBytes>850*1024)throw Error('3D gallery exceeds its independent transfer budget');
 await writeFile(new URL('dist/assets/licenses/three.txt',root),await readFile(new URL('node_modules/three/LICENSE',root)));
 console.log(`3D gallery: ${(galleryBytes/1024).toFixed(1)} KiB, fetched only when Unreal Engine opens.`);
}
if(process.argv[1]===fileURLToPath(import.meta.url))await buildReact();
