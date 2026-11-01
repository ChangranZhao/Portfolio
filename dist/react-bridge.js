import {createWindow,focusWindow,closeWindow,updateWindowMetadata,makeDraggable} from './windows.js';
import {systemDockIcons,finderArtwork} from './system-apps.js';
import {dockIcons} from './data.js';
import {getSystemSettings,setSystemSettings} from './system-settings.js';
import {musicSettings,updateMusicSettings,subscribeMusic,loadMusicFile,playMusicTrack,stepMusicTrack,ambientMusicTrack} from './background-music.js';
import {prepareWindowReveal} from './window-reveal.js';
import {projects} from './data.js';
import * as profile from './profile-data.js';
import {localizeText} from './localization.js';
import {papers} from './papers.js';
import {openPaper} from './paper-reader.js';
const instances=new Map();
let applicationModule,boardCatalog,codeLibrary,awardDetailLibrary,musicLibrary;
const loadApplications=()=>applicationModule??=(import('./react-apps.js').catch(error=>{applicationModule=null;throw error}));
export const warmReactApplications=()=>loadApplications().catch(()=>{});
export function setupLiquidGlass(){
 let controller=null,request=0;
 const sync=()=>{const token=++request;if(document.documentElement.dataset.material!=='liquid'){controller?.dispose();controller=null;return;}if(controller)return;loadApplications().then(module=>{if(token===request&&document.documentElement.dataset.material==='liquid'&&!controller)controller=module.mountLiquidGlass();}).catch(()=>{/* CSS glass remains available if the deferred optical layer fails. */});};
 document.addEventListener('portfolio-material',sync);
 if(document.getElementById('startup-screen'))window.addEventListener('creativeos-startup-finished',sync,{once:true});else sync();
}
const definitions={UnrealEngine:['tool-UnrealEngine','Unreal Engine — Virtual Museum',1200,780],Terminal:['terminal','Terminal — Portfolio Run',1060,650],Settings:['settings','Changran Zhao — Settings',1080,780],Finder:['tool-Finder','Finder',1020,700],Music:['tool-Music','Music',1200,800],Safari:['tool-Safari','Safari',1150,760],GitHub:['tool-GitHub','GitHub — Changran Zhao',1060,740],Launchpad:['tool-Launchpad','Launchpad',900,570],AppStore:['tool-AppStore','App Store',1100,740],Projects:['projects','Portfolio — Selected works',1080,740],Photos:['photos','Photos',1120,740],Figma:['tool-Figma','Figma — Design files',1200,760],Cursor:['tool-Cursor','Cursor — Source explorer',1180,740],VSCode:['vscode','Visual Studio Code',1180,740]};
export function openReactApplication(name,actions,options={}){
 if(name==='About'||name==='Settings'){options={...options,section:options.section||(name==='About'?'overview':'appearance')};name='Settings';}
 const [id,title,width,height]=definitions[name]||['tool-'+name,name==='UnrealEngine'?'Unreal Engine':name,1100,730];
 if(instances.has(id)){if(name==='Launchpad'){closeWindow(id);return;}const instance=instances.get(id);instance.options={...instance.options,...options};instance.controller?.update(options);focusWindow(id);return;}
 const host=document.createElement('div');host.className='os-app';host.setAttribute('data-no-localize','');
 const loading=document.createElement('div');loading.className='os-empty';loading.textContent=localizeText('Loading…');host.append(loading);
 const win=createWindow({id,title,content:host,width,height,deferOpen:true,className:'react-window react-'+name.toLowerCase()});
 if(win.existing)return;
 win.el.dataset.appName=name==='Projects'?'Portfolio':name==='About'?'About Me':name==='AppStore'?'App Store':name;
 const reveal=prepareWindowReveal(win.reveal);
 const instance={options,controller:null,closing:false};instances.set(id,instance);
 updateWindowMetadata(id,title,systemDockIcons.find(app=>app.name===name)?.src||dockIcons.find(app=>app.name===name)?.src||projects[0].images[0].thumb);
 const api={projects,profile,logo:'assets/personal-logo.svg',localize:localizeText,...actions,createWindow,focusWindow,updateWindowMetadata,apps:[...systemDockIcons,...dockIcons],artwork:finderArtwork,getSettings:getSystemSettings,setSettings:setSystemSettings,music:{get:musicSettings,update:updateMusicSettings,subscribe:subscribeMusic,loadFile:loadMusicFile,ambient:ambientMusicTrack,playTrack:playMusicTrack,next:()=>stepMusicTrack(1),previous:()=>stepMusicTrack(-1),loadLibrary:()=>musicLibrary??=(import('./music-library.js').then(m=>m.musicLibrary).catch(error=>{musicLibrary=null;throw error}))},
  loadAwardDetails:()=>awardDetailLibrary??=(import('./award-details.js').then(m=>m.awardDetails).catch(error=>{awardDetailLibrary=null;throw error})),
  mountGallery:async host=>{const loading=document.createElement('div');loading.className='os-empty';loading.textContent=localizeText('Loading…');host.append(loading);const module=await import('./ue-gallery.js');if(!host.isConnected)return ()=>{};host.replaceChildren();return module.mountGallery(host,{projects,localize:localizeText,...actions})},
  mountMuseum:async host=>{const module=await import('./museum-engine.js');return host.isConnected?module.mountMuseum(host,{projects,localize:localizeText,...actions}):()=>{}},
  hasPaper:title=>papers.some(p=>p.title===title),openPaper:title=>{const paper=papers.find(p=>p.title===title);if(paper)openPaper(paper)},
  loadBoards:()=>boardCatalog??=(Promise.all([import('./figma-page-data.js'),import('./gaia-pages.js'),import('./mimesis-page-data.js')]).then(([f,g,m])=>({p8:g.gaiaPages,p7:m.mimesisPages,p3:f.figmaPages.filter(p=>p.name.startsWith('2_')),p4:f.figmaPages.filter(p=>p.name.startsWith('3_')),p2:f.figmaPages.filter(p=>p.name.startsWith('4_'))})).catch(error=>{boardCatalog=null;throw error})),
  prepareBoard:async(frame,projectId,language)=>{
   const doc=frame.contentDocument;if(!doc?.querySelector('.figma-canvas'))return;
   const lang=language.startsWith('zh')?(/hant|tw|hk/i.test(language)?'zh-Hant':'zh'):'en';
   const module=await (projectId==='p8'?import('./gaia-language.js'):projectId==='p7'?import('./mimesis-project.js'):import('./figma-board-language.js'));
   if(!frame.isConnected||frame.contentDocument!==doc)return;
   doc.body.classList.add('reduce-motion');
   for(const p of doc.querySelectorAll('p:only-child')){const style=doc.defaultView.getComputedStyle(p);if(p.parentElement.clientHeight>(parseFloat(style.lineHeight)||parseFloat(style.fontSize)*1.2)*1.55)p.style.whiteSpace='normal';}
   if(projectId==='p8')module.localizeGaia(doc,lang);else if(projectId==='p7')module.localizeMimesisFrame(frame,lang);else module.localizeFigmaBoard(doc,lang);
  },
  loadCode:()=>codeLibrary??=(fetch('assets/creativeos-source.json').then(response=>{if(!response.ok)throw Error('Source unavailable');return response.json()}).catch(error=>{codeLibrary=null;throw error}))
 };
 const ready=()=>{if(instance.closing)return;reveal.ready();const toolbar=host.querySelector('.os-toolbar');if(toolbar&&!toolbar.dataset.draggable){toolbar.dataset.draggable='true';makeDraggable(win.el,toolbar,()=>win.el.classList.contains('maximized'));toolbar.addEventListener('dblclick',e=>{if(!e.target.closest('button,input,select,label'))win.el.querySelector('.light.maximize')?.click();});}document.dispatchEvent(new Event('portfolio-windows-changed'));};
 win.el.addEventListener('portfolio-toolbar-ready',ready);
 const start=()=>{host.replaceChildren(loading);loadApplications().then(module=>{if(instance.closing)return;instance.controller=module.mountApplication(host,api,name,instance.options,next=>openReactApplication(next,actions),ready);}).catch(()=>{if(instance.closing)return;host.replaceChildren();const message=document.createElement('div');message.className='os-empty';message.textContent='Unable to load / 暂时无法加载';const retry=document.createElement('button');retry.className='os-button';retry.textContent='Retry / 重试';retry.onclick=start;message.append(retry);host.append(message);reveal.ready();});};
 win.el.addEventListener('window-closing',()=>{reveal.cancel();instance.closing=true;instances.delete(id);},{once:true});
 // Let the existing closing animation finish before releasing React's DOM.
 const observer=new MutationObserver(()=>{if(!win.el.isConnected){instance.closing=true;if(instances.get(id)===instance)instances.delete(id);instance.controller?.unmount();observer.disconnect();}});
 observer.observe(win.el.parentElement,{childList:true});start();
}
