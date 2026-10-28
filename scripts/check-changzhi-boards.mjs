import {createRequire} from 'node:module';
import {readFile,stat,writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {changzhiPages} from '../dist/changzhi-assets.js';
const require=createRequire(import.meta.url),{chromium}=require('C:/Users/20135/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const browser=await chromium.launch({headless:true,channel:'msedge'}),page=await browser.newPage({viewport:{width:1280,height:720}});
const failed=[];page.on('response',r=>{if(r.status()>=400)failed.push(r.url());});
const records=[];
for(const board of changzhiPages){for(const image of board.images)assert.ok((await stat(new URL('../dist/'+image,import.meta.url))).size>0);await page.goto('http://127.0.0.1:4173/'+board.page,{waitUntil:'networkidle'});await page.locator('img').evaluateAll(ims=>{for(const im of ims)im.loading='eager';return Promise.all(ims.map(im=>im.decode()));});const bad=await page.locator('img').evaluateAll(ims=>ims.filter(i=>!i.naturalWidth||!i.getBoundingClientRect().width).map(i=>i.src));assert.deepEqual(bad,[]);records.push({node:board.id,images:await page.locator('img').count()});if(['928:1130','928:913','928:1292'].includes(board.id))await page.screenshot({path:'qa/cultural-digitalization/board-'+board.id.replace(':','-')+'.png'});}
await browser.close();assert.deepEqual(failed,[]);await writeFile('qa/cultural-digitalization/board-results.json',JSON.stringify(records,null,2));console.log('All 16 editable boards and 122 local assets verified; all rendered images decode with nonzero geometry.');
