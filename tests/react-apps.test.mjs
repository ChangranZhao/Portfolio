import test,{after} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {build} from 'esbuild';
import {JSDOM,VirtualConsole} from 'jsdom';
import {act} from 'react';
const repo=fileURLToPath(new URL('../',import.meta.url)),base=path.join(repo,'tmp');await mkdir(base,{recursive:true});
const directory=await mkdtemp(path.join(base,'react-tests-'));
await build({entryPoints:[path.join(repo,'src/react-apps/index.tsx')],outfile:path.join(directory,'apps.mjs'),bundle:true,format:'esm',platform:'node',packages:'external',jsx:'automatic',logLevel:'silent'});
// React DOM detects browser capabilities at import time, before individual fixtures.
const bootstrap=new JSDOM('<!doctype html>');globalThis.window=bootstrap.window;globalThis.document=bootstrap.window.document;
const {mountApplication}=await import(pathToFileURL(path.join(directory,'apps.mjs')));
delete globalThis.window;delete globalThis.document;bootstrap.window.close();
after(async()=>{assert.equal(path.dirname(directory),base);await rm(directory,{recursive:true,force:true});});
const projects=[{id:'p1',title:'Wind',category:'Spatial',summary:'Culture in space',introduction:'First project',documents:[],images:[{src:'full.webp',thumb:'thumb.webp',small:'small.webp',preview:'preview.webp',name:'Cover',width:1600,height:900,smallWidth:320,thumbWidth:600}]},{id:'p8',title:'Gaia',category:'Installation',summary:'Ecology',documents:[],images:[{src:'gaia.webp',thumb:'gaia-thumb.webp',name:'Study',width:1600,height:900}]}];
async function fixture(name,options={},overrides={}){
 const errors=[],virtualConsole=new VirtualConsole();virtualConsole.on('jsdomError',error=>errors.push(error));
 const dom=new JSDOM('<html lang="en"><body><div id="host"></div></body></html>',{url:'http://localhost/',virtualConsole});
 const keys=['window','document','navigator','HTMLElement','MutationObserver','localStorage','ResizeObserver','IS_REACT_ACT_ENVIRONMENT'];const previous=new Map(keys.map(k=>[k,Object.getOwnPropertyDescriptor(globalThis,k)]));
 for(const [key,value] of Object.entries({window:dom.window,document:dom.window.document,navigator:dom.window.navigator,HTMLElement:dom.window.HTMLElement,MutationObserver:dom.window.MutationObserver,localStorage:dom.window.localStorage,ResizeObserver:class{observe(){}disconnect(){}},IS_REACT_ACT_ENVIRONMENT:true}))Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
 dom.window.HTMLElement.prototype.scrollIntoView=function(){};
 const calls=[];const api={projects,logo:'logo.svg',profile:{roles:['University','Digital arts','Studio lead'],awards:[['Prize','2025']],awardRecords:[{id:'prize',date:'2025',title:{en:'Prize',zh:'奖项名称'},result:{en:'Gold',zh:'金奖'},work:{en:'Gaia',zh:'盖亚'},projectId:'p8'}],exhibitionRecords:[],innovationRecords:[],commercial:[],exhibitions:[],publications:[]},localize:s=>s==='Gaia'?'盖亚':s,openProject:id=>calls.push(['project',id]),openDetails:id=>calls.push(['details',id]),openImage:(images,index,title)=>calls.push(['image',index,title]),hasPaper:()=>false,openPaper:()=>{},loadBoards:async()=>({p8:[{id:'b1',name:'Board 1',page:'board.html',width:1920,height:1080}]}),loadCode:async()=>[{name:'main.js',language:'javascript',content:'const title = "<img onerror=alert(1)>";\nexport default title;'}]};
 Object.assign(api,overrides);
 const host=document.getElementById('host');let app;await act(async()=>{app=mountApplication(host,api,name,options,()=>{})});
 return {host,api,calls,app,click:async selector=>{const b=host.querySelector(selector);assert.ok(b,selector);await act(async()=>b.click())},async close(){await act(async()=>this.app.unmount());dom.window.close();for(const [key,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}assert.deepEqual(errors,[]);}};
}
test('Photos opens thumbnail-backed images and keeps favorites after remount',async()=>{
 const f=await fixture('Photos');try{assert.equal(f.host.querySelector('.os-photo-open img').getAttribute('src'),'small.webp');await f.click('.os-photo-heart');assert.equal(JSON.parse(localStorage.getItem('creativeos-photo-favorites')).length,1);await f.click('.os-photo-open');assert.deepEqual(f.calls[0],['image',0,'Wind']);await act(async()=>f.app.unmount());await act(async()=>{f.app=mountApplication(f.host,f.api,'Photos',{},()=>{})});assert.equal(f.host.querySelector('.os-photo-heart').getAttribute('aria-pressed'),'true');}finally{await f.close()}
});
test('project selection exposes explicit full-project navigation and list view',async()=>{
 const f=await fixture('Projects');try{await f.click('.os-project-card');await f.click('.os-inspector .os-primary');assert.deepEqual(f.calls,[['details','p1']]);await f.click('[aria-label="List view"]');assert.ok(f.host.querySelector('.os-projects.list'));}finally{await f.close()}
});
test('About can navigate an already mounted app from an external section request',async()=>{
 const f=await fixture('About',{section:'experience'});try{assert.ok(f.host.textContent.includes('Studio lead'));const awards=[...f.host.querySelectorAll('.os-side-item')].find(b=>b.textContent==='Awards');await act(async()=>awards.click());assert.ok(f.host.textContent.includes('Prize'));await act(async()=>f.app.update({section:'experience'}));assert.ok(f.host.textContent.includes('Studio lead'));assert.ok(!f.host.textContent.includes('Prize'));}finally{await f.close()}
});
test('award details open in place, show the certificate and return to the same list',async()=>{
 const detail={description:{en:'A project about ecology.',zh:'关于生态的作品。'},about:{en:'Design award overview.',zh:'设计奖项介绍。'},issuer:'Award body',officialUrl:null,certificate:{src:'certificate.webp',width:800,height:1000},identity:{src:'logo.webp',x:0,y:0,w:1,h:1,aspect:2,kind:'logo'}};
 const f=await fixture('About',{section:'awards'},{loadAwardDetails:async()=>({prize:detail})});
 try{
  const sidebar=f.host.querySelector('.os-sidebar');f.host.querySelector('.os-profile').scrollTop=150;
  await f.click('[data-record-id="prize"]');assert.ok(f.host.querySelector('.award-detail'));assert.equal(f.host.querySelector('.os-sidebar'),sidebar);assert.equal(f.host.querySelector('.os-profile').scrollTop,0);
  assert.ok(f.host.textContent.includes('A project about ecology.'));assert.equal(f.host.querySelector('.award-certificate img').getAttribute('src'),'certificate.webp');
  await f.click('.award-certificate');assert.deepEqual(f.calls[0],['image',0,'Prize']);
  await f.click('.award-back');assert.ok(f.host.querySelector('[data-record-id="prize"]'));assert.equal(f.host.querySelector('.os-profile').scrollTop,150);assert.equal(document.activeElement.dataset.recordId,'prize');
 }finally{await f.close()}
});
test('Launchpad categories keep real apps and selecting an app dismisses the panel first',async()=>{
 const calls=[];const f=await fixture('Launchpad',{}, {apps:[{name:'Finder',src:'finder.png'},{name:'Music',src:'music.png'},{name:'Figma',src:'figma.png'},{name:'Cursor',src:'cursor.png'}],closeApp:name=>calls.push(['close',name]),openApp:name=>calls.push(['open',name])});
 try{
  assert.equal(f.host.querySelectorAll('.sys-launch-grid button').length,4);
  const category=[...f.host.querySelectorAll('.sys-launch-categories button')].find(b=>b.textContent==='Creativity');await act(async()=>category.click());
  assert.equal(f.host.querySelectorAll('.sys-launch-grid button').length,1);assert.ok(f.host.querySelector('[data-app="Figma"]'));
  await f.click('[data-app="Figma"]');assert.deepEqual(calls,[['close','Launchpad'],['open','Figma']]);
 }finally{await f.close()}
});
test('Launchpad dismisses on one outside click or Escape, while internal clicks stay open',async()=>{
 const calls=[];const f=await fixture('Launchpad',{}, {apps:[],closeApp:name=>calls.push(name)});
 try{
  await f.click('.sys-launch-more');assert.deepEqual(calls,[]);
  const outside=document.createElement('button');let activated=false;outside.onclick=()=>{activated=true};document.body.append(outside);
  await act(async()=>outside.click());assert.deepEqual(calls,['Launchpad']);assert.equal(activated,false);
  await act(async()=>document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true})));assert.equal(calls.length,2);
 }finally{await f.close()}
});
test('Music uses a queued catalogue, persists real favorites, and shares player volume',async()=>{
 const tracks=[{id:'one',title:'Cradles',artist:'Sub Urban',category:'English Mix',cover:'one.webp',previewUrl:'https://audio-ssl.itunes.apple.com/one.m4a'},{id:'two',title:'Idol',artist:'YOASOBI',category:'Anime',cover:'two.webp',previewUrl:'https://audio-ssl.itunes.apple.com/two.m4a'}];
 const ambient={id:'ambient',title:'The Soft Tech Ambient',artist:'MomotMusic',category:'Creative Ambient',cover:'ambient.webp'};
 const calls=[],listeners=new Set();let state={trackId:'ambient',title:ambient.title,artist:ambient.artist,cover:ambient.cover,enabled:false,paused:true,suspended:false,time:0,duration:0,volume:.2,loop:true,error:false};
 const music={ambient,get:()=>state,subscribe:fn=>{listeners.add(fn);return()=>listeners.delete(fn)},loadLibrary:async()=>tracks,playTrack:(track,list)=>{calls.push(['play',track.id,list.map(t=>t.id)]);state={...state,...track,trackId:track.id,enabled:true,paused:false};listeners.forEach(fn=>fn())},update:next=>{calls.push(['update',next]);state={...state,...next};listeners.forEach(fn=>fn())},next:()=>calls.push(['next']),previous:()=>calls.push(['previous']),loadFile:()=>{}};
 const f=await fixture('Music',{}, {music});try{
  assert.ok(f.host.textContent.includes('2 playable previews'));assert.ok(f.host.querySelectorAll('.music-album-card').length>0);
  await f.click('.music-album-card');assert.deepEqual(calls[0],['play','one',['one','two']]);
  await f.click('[aria-label="Favorite current song"]');assert.deepEqual(JSON.parse(localStorage.getItem('creativeos-music-favorites')),['one']);
  await f.click('[title="Favorite Songs"]');assert.equal(f.host.querySelectorAll('.music-song-row').length,1);assert.ok(f.host.querySelector('.music-song-row').textContent.includes('Cradles'));
  await f.click('[aria-label="Next track"]');assert.deepEqual(calls.at(-1),['next']);
  assert.equal(f.host.querySelector('[aria-label="Volume"]').value,'0.2');
 }finally{await f.close()}
});
test('profile and settings share a sidebar and toolbar, with local section navigation',async()=>{
 let settings={theme:'light',material:'classic',dock:100,desktopIcons:100,desktopFont:100,side:'left',brightness:100,blur:0,glassTransparency:28,glassRefraction:60,glassBlur:8};
 const f=await fixture('Settings',{}, {getSettings:()=>settings,setSettings:next=>{settings={...settings,...next}},music:{get:()=>({enabled:false,volume:.2}),subscribe:()=>()=>{}}});
 try{const sidebar=f.host.querySelector('.os-sidebar'),toolbar=f.host.querySelector('.os-toolbar');assert.ok(f.host.textContent.includes('Education & Experience'));await f.click('.os-account');assert.ok(f.host.querySelector('.os-profile-identity'));assert.equal(f.host.querySelector('.os-sidebar'),sidebar);assert.equal(f.host.querySelector('.os-toolbar'),toolbar);await f.click('[title="Desktop & Dock"]');assert.equal(f.host.querySelector('[aria-label="Dock size"]').value,'100');assert.equal(f.host.querySelectorAll('.os-sidebar').length,1);await act(async()=>f.app.update({section:'awards'}));assert.ok(f.host.textContent.includes('Prize'));assert.equal(f.host.querySelectorAll('.os-side-item.selected').length,1);}finally{await f.close()}
});
test('every search request focuses the existing Projects search field without remounting',async()=>{
 const f=await fixture('Projects');try{const input=f.host.querySelector('input');for(let i=0;i<2;i++){f.host.querySelector('.os-project-card').focus();await act(async()=>f.app.update({search:true}));assert.equal(document.activeElement,input);}}finally{await f.close()}
});
test('Figma previews a real board with scripts disabled and full-project navigation',async()=>{
 const f=await fixture('Figma');try{await f.click('.fg-top nav button[title="Gaia"]');assert.equal(f.host.querySelector('iframe').getAttribute('src'),'board.html');assert.equal(f.host.querySelector('iframe').getAttribute('sandbox'),'allow-same-origin');await f.click('.fg-action.primary');assert.deepEqual(f.calls,[['details','p8']]);}finally{await f.close()}
});
test('Figma does not offer provisional photo navigation while the board catalog loads',async()=>{
 let resolve;const pending=new Promise(r=>resolve=r);const f=await fixture('Figma',{}, {loadBoards:()=>pending});try{assert.ok([...f.host.querySelectorAll('.os-page-list button')].every(b=>b.disabled));await f.click('.fg-top nav button[title="Gaia"]');await act(async()=>resolve({p8:Array.from({length:7},(_,i)=>({id:'b'+i,name:'Board '+i,page:'board-'+i+'.html',width:1920,height:1080}))}));assert.equal(f.host.querySelector('iframe').getAttribute('src'),'board-0.html');assert.equal(f.host.querySelectorAll('.fg-board').length,7);}finally{await f.close()}
});
test('VSCode renders actual source as text without executing markup',async()=>{
 const f=await fixture('VSCode');try{assert.ok(f.host.querySelector('code').textContent.includes('<img onerror=alert(1)>'));assert.equal(f.host.querySelector('code img'),null);assert.equal(f.host.querySelectorAll('.os-line-number').length,2);}finally{await f.close()}
});
test('React owns localized content and updates on preference change without replacing the host',async()=>{
 const f=await fixture('Photos');try{assert.ok(f.host.hasAttribute('data-no-localize'));await act(async()=>{document.documentElement.lang='zh-CN';document.dispatchEvent(new window.Event('portfolio-preferences'))});assert.ok(f.host.textContent.includes('所有照片'));assert.ok(f.host.textContent.includes('盖亚'));await act(async()=>{document.documentElement.lang='en';document.dispatchEvent(new window.Event('portfolio-preferences'))});assert.ok(f.host.textContent.includes('All Photos'));}finally{await f.close()}
});

