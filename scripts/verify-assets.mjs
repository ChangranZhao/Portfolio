import {projects,dockIcons} from '../dist/data.js';
import {access,stat} from 'node:fs/promises';
import assert from 'node:assert/strict';
const urls=projects.flatMap(p=>p.images.flatMap(im=>[im.src,im.thumb,im.small,im.preview]).concat(p.documents.map(d=>d.src))).concat(dockIcons.map(i=>i.src),'assets/background.webp','assets/inter-latin.woff2','assets/Inter-OFL.txt','assets/personal-logo.svg','assets/profile-texture.webp');
for(const p of projects)for(const im of p.images)assert.ok(im.smallWidth>0&&im.previewWidth>=im.smallWidth&&im.fullWidth>=im.previewWidth,im.src);
for(const p of projects){assert.ok(p.images.length>0,p.title);assert.equal(new Set(p.images.map(i=>i.src)).size,p.images.length);}
await Promise.all(urls.map(async url=>{await access(new URL('../dist/'+url,import.meta.url));assert.ok((await stat(new URL('../dist/'+url,import.meta.url))).size>0,url);}));
console.log(`Verified ${projects.length} projects, ${projects.reduce((s,p)=>s+p.images.length,0)} images, ${urls.length} local resource references.`);
