import {readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
for(const directory of ['dist','scripts','tests']){
  for(const file of await readdir(new URL('../'+directory+'/',import.meta.url))){
    if(!/\.m?js$/.test(file))continue;
    const result=spawnSync(process.execPath,['--check',directory+'/'+file],{cwd:root,stdio:'inherit'});
    if(result.status!==0)process.exit(result.status||1);
  }
}
await import('./verify-assets.mjs');
console.log('JavaScript syntax and resource checks passed.');
