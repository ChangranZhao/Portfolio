import {readFile,writeFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
let importer=await readFile(new URL('scripts/import-changzhi.mjs',root),'utf8');
importer=importer.replace("fit();</script></body></html>","fit();</script><script type=\"module\" src=\"../${r.nodeId==='928:973'?'changzhi-atlas.js':'changzhi-board-motion.js'}\"></script></body></html>");
await writeFile(new URL('scripts/import-changzhi.mjs',root),importer);
const source=await readFile(new URL('dist/changzhi-project.js',root),'utf8');
await writeFile(new URL('tmp/changzhi-project-before-primary.js',root),source);
