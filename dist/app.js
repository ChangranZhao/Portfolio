import {setupDockMotion} from './dock-motion.js';
import {localizeText} from './localization.js';
import {initGuide} from './user-guide.js';
import {projects,dockIcons} from './data.js';
import {systemDockIcons} from './system-apps.js';
import {createWindow,focusWindow,closeWindow,minimizeWindow,hideAll,setWindowChange,makeDraggable,updateWindowMetadata,state} from './windows.js';
import {openReactApplication,warmReactApplications,setupLiquidGlass} from './react-bridge.js';
import {decorateWindowControls} from './window-controls.js';
import {setupApplicationMenus} from './app-menus.js';
import {setupControlCenter} from './control-center.js';
import {setupDesktopDrift} from './desktop-motion.js';

const $=(s,root=document)=>root.querySelector(s);
const byId=id=>projects.find(p=>p.id===id);
function element(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function button(text,fn,className=''){const b=element('button',className,text);b.addEventListener('click',fn);return b;}
const imageRecords=new Map(projects.flatMap(p=>p.images.flatMap(im=>[[im.src,im],[im.thumb,im]])));
function setImageSource(img,src,sizes){
  const record=imageRecords.get(src);img.removeAttribute('srcset');img.removeAttribute('sizes');
  if(record){
    img.width=record.width;img.height=record.height;
    const thumbnail=src===record.thumb;
    if(record.small&&record.preview){
      const candidates=thumbnail?[[record.small,record.smallWidth],[record.thumb,record.thumbWidth]]:[[record.preview,record.previewWidth],[record.src,record.fullWidth]];
      img.srcset=[...new Map(candidates.map(([url,width])=>[width,url])).entries()].map(([width,url])=>`${url} ${width}w`).join(', ');
      img.sizes=sizes||(thumbnail?'(max-width:700px) 48vw, 240px':'(max-width:700px) 95vw, 80vw');
    }
  }
  if(src)img.src=src;else img.removeAttribute('src');
}
function image(src,alt,cls=''){const im=element('img',cls);im.alt=alt;im.decoding='async';im.loading='lazy';setImageSource(im,src);return im;}
function findImage(p,match){return Math.max(0,p.images.findIndex(im=>im.path.toLowerCase().includes(match.toLowerCase())));}
function cover(p){const match={p1:'Tianqiyuan',p3:'3654b331',p5:'exhibit_photo5',p6:'RenderProcess_In_Unity1'}[p.id];return p.images[match?findImage(p,match):0];}
const reactActions={openProject:id=>openProject(id,0,true),openDetails:id=>openDetails(byId(id)),openImage:openLightbox,openApp:openTool,closeApp:name=>closeWindow(({Settings:'settings',About:'settings',Terminal:'terminal',Photos:'photos',Projects:'projects',VSCode:'vscode'})[name]||'tool-'+name)};
const menuOwnership=new Map();

// Coordinates follow the supplied 16:9 desktop. Repeated entries open specific views of a project.
const entries=[
 ['p10','Homeward Memories\nUI Design',11,28,11,'Front_Page',12],
 ['p1','Tianqiyuan Lighting\nInstallation',26,13,9.5,'Tianqiyuan',14],
 ['p7','MIMESIS—The Shape of AI',40,23,13.6,'Front_Page',17],
 ['p9','NEURO IMMERSIVE',52.5,16,8.8,'Front_Page',15],
 ['p4','ECHO-SPACE (3)',65,9.5,10,'page_2',12],
 ['p6','Digital Reconstruction of\nShanxi Suspended\nSculptures',84.5,20,9.3,'RenderProcess_In_Unity1',13],
 ['p6','Digital Reconstruction of\nShanxi Suspended\nSculptures (2)',91,30,8.1,'scan_process1',12],
 ['p1','Interactive Digital Sand\nTable of Qi Culture',73,30,7.8,'Interactive_Digital_Sand',12],
 ['p1','Immersive CAVE Experience\nat Jixia Academy',18.4,37,10.7,'Immersive_CAVE',12],
 ['p5','Tremulant\nOracles (2)',29.5,41.5,7.2,'exhibit_photo5',11],
 ['p7','MIMESIS—The Shape of\nAI (2)',23.7,48,7.7,'Page_1',15],
 ['p2','SPACE CHRONICLES',42.3,50,8.8,'Front_Page',12],
 ['p1','The Star Catalogue of Gan\nand Shi',60,45.5,10.3,'The_Star_Catalogue',15],
 ['p4','ECHO-SPACE (4)',82.8,51.5,8.1,'page_5',14],
 ['p6','Digital Reconstruction of\nShanxi Sculptures',11.5,57,6,'Post_Process_in_Unity1',12],
 ['p1','Qi Culture Immersive\nMirror Hall',20.5,69,12.4,'Qi_Culture_Immersive_Mirror',15],
 ['p5','Tremulant Oracles',37.7,70.5,7.2,'exhibit_photo2',10],
 ['p8','GAIA HYPOTHESIS',48.7,59,7.3,'photo_of_the_Installation3',20],
 ['p4','ECHO-SPACE',69.5,69,10.1,'Front_page',13],
 ['p8','GAIA HYPOTHESIS (2)',85.4,73,7.1,'Front_Page',9],
 ['p4','ECHO-SPACE (2)',55.2,74,10,'page_4',16],
 ['p1','VR Warfare Experience of\nthe Spring and Autumn and\nWarring States Periods',80.6,78,8.7,'VR_Warfare',10],
 ['p3','SPECTRAL FLUID',30.7,84,8.8,'3654b331',10],
 ['p1','Qi Culture Interactive Hall',42.3,83,8.8,'QI_Culture_Interactive_Hall',12],
 ['p8','GAIA HYPOTHESIS\nInstallation study',40,7,9.1,'3d_model_preview',11],
 ['p2','SPACE CHRONICLES\nExhibition view',8.5,79,8.5,'page_4',11],
 ['p5','Tremulant Oracles\nLight study',92,55,8.3,'exhibit_photo3',11],
 ['p11','Path of Light',21,4.5,8.5,'Front_Page.jpg',11],
 ['p12','Blue Calico Realm',58,32,8.4,'experimental_1',11],
 ['p13','24 Term Personality\nInteractive Design',69,52,8.4,'Front_page.jpg',11],
 ['p14','What if Potatoes\nRuled Mars',93,77,6.5,'poster1',14]
];
const desktop=$('#desktop');
const mobileIntro=element('section','mobile-intro');
const mobileHead=element('div','mobile-heading');
mobileHead.append(element('h1','','Portfolio'),button('↗',()=>openCollection(),'mobile-all-projects'));
mobileHead.lastElementChild.setAttribute('aria-label','View all projects');
mobileIntro.append(element('p','mobile-byline','CHANGRAN ZHAO · DIGITAL MEDIA ART'),mobileHead,element('p','mobile-count',`${projects.length} projects / ${entries.length} photographs`));
const mobileFilters=element('nav','mobile-filters');mobileFilters.setAttribute('aria-label','Filter portfolio cards');
for(const [label,ids] of [['All',null],['Spatial',['p1','p6','p9','p11']],['Installation',['p2','p4','p5','p8','p12']],['Digital',['p3','p7','p10','p13','p14']]]){
  const filter=button(label,()=>{for(const b of mobileFilters.children)b.setAttribute('aria-pressed',String(b===filter));for(const card of desktop.children)card.classList.toggle('mobile-filtered',!!ids&&!ids.includes(card.dataset.project));});
  filter.setAttribute('aria-pressed',String(!ids));mobileFilters.append(filter);
}
mobileIntro.append(mobileFilters);desktop.before(mobileIntro);
entries.forEach(([pid,label,x,y,w,match,h],i)=>{
  const p=byId(pid),index=findImage(p,match),im=p.images[index];
  const b=button('',()=>{document.querySelectorAll('.desktop-icon.selected').forEach(el=>el.classList.remove('selected'));b.classList.add('selected');openProject(pid,index,true);},'desktop-icon');
  b.setAttribute('aria-label','Open '+label.replaceAll('\n',' '));b.dataset.project=pid;
  b.style.cssText=`--x:${x}%;--y:${y}%;--w:${w}%;--icon-width:${w};--h:${h}vh;--delay:${i*18}ms;--card-ratio:${[.72,1.12,.9,.82,1.2][i%5]}`;
  const square=pid==='p8'&&match==='photo_of_the_Installation3';
  const portrait=!square&&im.height/im.width>1.1;
  const pic=image(im.thumb,label.replaceAll('\n',' '),'icon-image'+(square?' square':portrait?' portrait':''));
  pic.draggable=false;if(innerWidth>700)pic.loading='eager';b.append(pic);
  const lab=element('span','icon-label');lab.textContent=label;b.append(lab);desktop.append(b);
});

const projectViews=new Map();
async function openDetails(project){const {openProjectDetails}=await import('./project-details.js');openProjectDetails(project,{openImage:openLightbox,openGallery:(pid,index=0)=>openProject(pid,index,true)});}
function openProject(pid,index=0,galleryOnly=false,reuseId=null){
  const p=byId(pid);if(!p)return;
  if(!reuseId&&state.items.has(pid)){projectViews.get(pid)?.showImage(index);focusWindow(pid);return;}
  const layout=element('div','project-layout');
  const sidebar=element('aside','project-sidebar');sidebar.append(element('div','sidebar-label','Selected works'));
  for(const project of projects){const b=button('',()=>openProject(project.id,0,true,reuseId||pid),'sidebar-button'+(project.id===pid?' active':''));b.append(image(cover(project).thumb,''),element('span','',project.title));sidebar.append(b);}
  sidebar.append(element('div','sidebar-bottom','CHANGRAN ZHAO\nDigital Media Art'));
  const content=element('div','project-content');
  const toolbar=element('div','project-toolbar'),crumb=element('div','breadcrumb');crumb.append(document.createTextNode('Portfolio  /  '),element('strong','',p.title));
  const switches=element('div','view-switch');
  const gallery=element('div','gallery-view'),overview=element('div','overview');overview.hidden=true;
  const imageTab=button('Gallery',()=>showMode('gallery'),'active'),aboutTab=button('View Full Project ↗',()=>openDetails(p),'full-project-button');switches.append(imageTab,aboutTab);toolbar.append(crumb,switches);
  function showMode(mode){gallery.hidden=mode!=='gallery';overview.hidden=mode!=='about';imageTab.classList.toggle('active',mode==='gallery');aboutTab.classList.toggle('active',mode==='about');}
  const heading=element('div','project-heading'),headingText=element('div');headingText.append(element('h1','',p.title),element('p','',p.category));const counter=element('span','counter');heading.append(headingText,counter);
  const stage=element('div','gallery-stage'),mainImage=image('','','gallery-image');
  const zoom=button('',()=>openLightbox(p.images,current,p.title),'gallery-image-button');zoom.setAttribute('aria-label','View image full screen');zoom.append(mainImage);
  const prev=button('‹',()=>setImage(current-1),'gallery-nav prev');prev.setAttribute('aria-label','Previous image');
  const next=button('›',()=>setImage(current+1),'gallery-nav next');next.setAttribute('aria-label','Next image');stage.append(zoom,prev,next);
  const caption=element('div','image-caption'),captionName=element('span');caption.append(captionName,element('span','','Click image to enlarge ↗'));
  const filmstrip=element('div','filmstrip');filmstrip.setAttribute('aria-label','Project images');
  const thumbs=p.images.map((im,i)=>{const b=button('',()=>setImage(i));b.setAttribute('aria-label',`Image ${i+1}: ${im.name}`);const pic=image(im.thumb,'');pic.loading='lazy';b.append(pic);filmstrip.append(b);return b;});
  gallery.append(heading,stage,caption,filmstrip);
  overview.append(element('div','eyebrow',p.category),element('h1','',p.title),image(cover(p).src,p.title,'overview-cover'));
  const introduction=p.introduction||p.summary;
  if(introduction){for(const paragraph of introduction.split(/\r?\n\s*\r?\n/))overview.append(element('p','',paragraph));}
  else overview.append(element('p','','Browse the exhibition photographs, visual studies and project pages in the gallery. / 项目图像与过程资料请见 Gallery。'));
  if(p.documents.length){for(const doc of p.documents){const a=element('a','doc-link','↗ '+doc.name);a.href=doc.src;a.target='_blank';a.rel='noopener';overview.append(a);}}
  content.append(toolbar,gallery,overview);layout.append(sidebar,content);
  const win=createWindow({id:reuseId||pid,title:p.title,content:layout,width:1050,height:710,className:'gallery-window'});
  if(reuseId)win.el.querySelector('.window-body').replaceChildren(layout);
  const bar=win.el.querySelector('.window-titlebar');bar.querySelector('.project-toolbar')?.remove();bar.append(toolbar);
  updateWindowMetadata(reuseId||pid,p.title,cover(p).thumb);
  let current=0;
  function setImage(i){current=(i+p.images.length)%p.images.length;const im=p.images[current];setImageSource(mainImage,im.src);mainImage.loading='eager';mainImage.alt=p.title+' — '+im.name;counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(p.images.length).padStart(2,'0')}`;captionName.textContent=im.name;thumbs.forEach((b,j)=>{b.classList.toggle('active',j===current);b.setAttribute('aria-pressed',j===current?'true':'false');});const t=thumbs[current];filmstrip.scrollTo({left:Math.max(0,t.offsetLeft-filmstrip.offsetLeft-filmstrip.clientWidth/2+t.clientWidth/2),behavior:'smooth'});}
  projectViews.set(reuseId||pid,{showImage:i=>{showMode('gallery');setImage(i);}});setImage(index);
  win.el.onkeydown=e=>{if(e.target.matches('input,textarea'))return;if(e.key==='ArrowRight'){e.preventDefault();setImage(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();setImage(current-1);}};
}

let lightboxItems=[],lightboxIndex=0,lightboxTitle='';
const lightbox=$('#lightbox');
function openLightbox(items,index,title){if(document.fullscreenElement&&!document.fullscreenElement.contains(lightbox))document.fullscreenElement.append(lightbox);lightboxItems=items;lightboxIndex=index;lightboxTitle=title;renderLightbox();if(!lightbox.open)lightbox.showModal();}
function renderLightbox(){const im=lightboxItems[lightboxIndex];$('#lightbox-image').src=im.src;$('#lightbox-image').alt=lightboxTitle+' — '+im.name;$('#lightbox-caption').textContent=lightboxTitle+' / '+im.name;$('#lightbox-count').textContent=`${lightboxIndex+1} / ${lightboxItems.length}`;$('#original-image').href=im.src;$('.lightbox-image-wrap').classList.remove('zoomed');$('#zoom-image').textContent='＋';}
function stepLightbox(n){lightboxIndex=(lightboxIndex+n+lightboxItems.length)%lightboxItems.length;renderLightbox();}
lightbox.addEventListener('close',()=>{if(lightbox.parentElement!==document.body)document.body.append(lightbox);});
$('#close-lightbox').onclick=()=>lightbox.close();$('.lightbox-prev').onclick=()=>stepLightbox(-1);$('.lightbox-next').onclick=()=>stepLightbox(1);
$('#zoom-image').onclick=()=>{const zoomed=$('.lightbox-image-wrap').classList.toggle('zoomed');$('#zoom-image').textContent=zoomed?'−':'＋';};
lightbox.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();stepLightbox(1);}if(e.key==='ArrowLeft'){e.preventDefault();stepLightbox(-1);}});
lightbox.addEventListener('click',e=>{if(e.target===lightbox)lightbox.close();});

function openCollection(search=false){openReactApplication('Projects',reactActions,{search});}

function infoWindow(id,title,build,width=550,height=570){const page=element('div','info-page');build(page);return createWindow({id,title,content:page,width,height});}
function openAbout(section='about'){
 const sections={about:'overview',education:'experience',experience:'experience',studio:'commercial',awards:'awards',research:'research','research-poster':'research'};
 openReactApplication('About',reactActions,{section:sections[section]||'overview'});
}
function openTool(name){
 if(name==='Terminal'){openTerminal();return;}if(name==='Trash'){openTrash();return;}
 openReactApplication(name,reactActions);
}
function openPhotos(){openReactApplication('Photos',reactActions);}

function openTerminal(){openReactApplication('Terminal',reactActions);}

function openTrash(){infoWindow('trash','Trash',page=>{page.append(image(dockIcons.find(i=>i.name==='Trash').src,'','tool-icon'),element('h1','','The Trash is empty'),element('p','','All good ideas are still on the desktop.'),button('Back to the desktop',()=>{hideAll();},'action-button secondary-button'));},430,350);}
function openCode(){openReactApplication('VSCode',reactActions);}

const desktopSizeControls=[
  ['Desktop icon size','--desktop-icon-scale',70,140],
  ['Desktop font size','--desktop-font-scale',80,140],
  ['Dock size','--dock-scale',70,140]
];
const desktopSizes={};
try{const saved=JSON.parse(localStorage.getItem('portfolio-desktop-sizes')||'{}');for(const [,key,min,max] of desktopSizeControls){const n=Number(saved[key]);desktopSizes[key]=Number.isFinite(n)?Math.max(min,Math.min(max,n)):100;}}catch{}
for(const [,key] of desktopSizeControls){desktopSizes[key]??=100;document.documentElement.style.setProperty(key,desktopSizes[key]/100);}
function openSettings(){openReactApplication('Settings',reactActions);}
function openCalendar(){
  let month=new Date();const page=element('div','info-page'),head=element('div','calendar-title'),title=element('h2'),grid=element('div','calendar-grid');
  const render=()=>{title.textContent=month.toLocaleDateString(document.documentElement.lang,{month:'long',year:'numeric'});grid.replaceChildren();for(const d of ['S','M','T','W','T','F','S'])grid.append(element('span','weekday',d));const first=new Date(month.getFullYear(),month.getMonth(),1).getDay(),days=new Date(month.getFullYear(),month.getMonth()+1,0).getDate();for(let i=0;i<first;i++)grid.append(element('span'));const today=new Date();for(let d=1;d<=days;d++)grid.append(element('span',d===today.getDate()&&month.getMonth()===today.getMonth()&&month.getFullYear()===today.getFullYear()?'today':'',d));};
  const prev=button('‹',()=>{month=new Date(month.getFullYear(),month.getMonth()-1,1);render();});prev.setAttribute('aria-label','Previous month');const next=button('›',()=>{month=new Date(month.getFullYear(),month.getMonth()+1,1);render();});next.setAttribute('aria-label','Next month');head.append(prev,title,next);page.append(head,grid);render();createWindow({id:'calendar',title:'Calendar',content:page,width:375,height:405});
}

const dock=$('#dock'),dockOrder=['Finder','Launchpad','Safari','Figma','Illustrator','Cursor','ChatGPT','Unity','UnrealEngine','TouchDesigner','Notion','Photos','Music','Terminal','VSCode','GitHub','AppStore','Settings','Trash'];
const allDockIcons=[...systemDockIcons,...dockIcons];
for(const name of dockOrder){
  if(name==='Notion'||name==='Trash')dock.append(element('span','dock-separator'));
  const icon=allDockIcons.find(i=>i.name===name);if(!icon)continue;
  const b=button('',()=>{if(!matchMedia('(prefers-reduced-motion:reduce)').matches&&!document.body.classList.contains('reduce-motion')){const icon=b.querySelector('.dock-icon-surface');icon?.getAnimations().forEach(a=>a.cancel());icon?.animate([{translate:'0 0'},{translate:`0 ${-Math.min(8,b.offsetWidth*.15)}px`,offset:.5},{translate:'0 0'}],{duration:300,easing:'ease-out'});}openTool(name);},'dock-item');b.dataset.windowId=({Photos:'photos',Terminal:'terminal',Trash:'trash',VSCode:'vscode'})[name]||'tool-'+name;b.dataset.label=name==='UnrealEngine'?'Unreal Engine':name;b.dataset.app=name;b.setAttribute('aria-label','Open '+b.dataset.label);const surface=element('span','dock-icon-surface');surface.append(image(icon.src,''));b.append(surface);dock.append(b);
}
for(const icon of systemDockIcons){const item=dock.querySelector(`[data-app="${icon.name}"]`);if(item){item.classList.add('reference-icon');if(icon.name==='Settings')item.dataset.windowId='settings';if(icon.name==='AppStore'){item.dataset.label='App Store';item.setAttribute('aria-label','Open App Store');}}}
const restores=element('div','dock-restores');dock.append(restores);
const mobileNav=element('nav','mobile-bottom-nav');mobileNav.setAttribute('aria-label','Mobile portfolio navigation');
for(const [label,key,action] of [['AboutMe','about',()=>openAbout()],['Project Content','projects',()=>openCollection()],['Gallery','gallery',()=>{}],['Exhibition&Papers','research',()=>openAbout('research')]]){
  const b=button(label,()=>{hideAll();action();b.scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});});
  b.dataset.section=key;b.setAttribute('aria-pressed',String(key==='gallery'));mobileNav.append(b);
}
document.body.append(mobileNav);
function updateMobileNavigation(){
  const id=state.active,key=id==='projects'?'projects':id==='profile-research'?'research':['settings','profile-about','about-label'].includes(id)?'about':'gallery';
  for(const b of mobileNav.children)b.setAttribute('aria-pressed',String(b.dataset.section===key));
}
function fitDock(){requestAnimationFrame(()=>{dock.dispatchEvent(new Event('dock-items-changed'));});}
function updateMenuSelection(){const active=state.active;for(const id of menuOwnership.keys())if(!state.items.has(id))menuOwnership.delete(id);const owner=menuOwnership.get(active);document.querySelectorAll('.menubar [data-action]').forEach(b=>{const a=b.dataset.action;const selected=owner?owner===b:(a==='about'&&['profile-about','profile-research','about-label','content-label'].includes(active))||(a==='research'&&active==='profile-research')||(a==='projects'&&active==='projects')||(a==='search'&&active==='search')||(a==='settings'&&active==='settings')||(a==='calendar'&&active==='calendar')||(a==='network'&&active==='network');b.setAttribute('aria-pressed',String(selected));});}
setWindowChange(items=>{for(const b of dock.querySelectorAll('.dock-item[data-window-id]'))b.classList.toggle('running',items.some(item=>item.id===b.dataset.windowId));restores.replaceChildren();const hidden=items.filter(i=>i.minimized);if(hidden.length)restores.append(element('span','dock-separator'));for(const item of hidden){const b=button('',()=>focusWindow(item.id),'dock-item');b.dataset.restoreId=item.id;b.dataset.label=item.title;b.setAttribute('aria-label','Restore '+item.title);const mini=element('div','dock-minimized');if(item.thumbnail){const preview=image(item.thumbnail,'');preview.loading='eager';mini.append(preview);}else mini.append(element('span','',item.title));b.append(mini);restores.append(b);}fitDock();updateMenuSelection();updateMobileNavigation();});
setupDockMotion(dock);window.addEventListener('resize',fitDock);fitDock();
dock.addEventListener('pointerenter',warmReactApplications,{once:true});dock.addEventListener('focusin',warmReactApplications,{once:true});
document.querySelector('.menu-left').addEventListener('pointerenter',warmReactApplications,{once:true});

let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600);}
const actions={about:()=>openAbout(),education:()=>openAbout('education'),studio:()=>openAbout('studio'),experience:()=>openAbout('experience'),awards:()=>openAbout('awards'),research:()=>openAbout('research'),projects:()=>openCollection(),search:()=>openCollection(true),settings:openSettings,calendar:openCalendar,network:()=>infoWindow('network','About this website',page=>{page.append(element('div','eyebrow','CHANGRAN DESIGN'),element('h1','','A desktop of ideas.'),element('p','','Digital media art, installations and spatial experiences.\n\nExplore the desktop, open a project, and take a closer look.'),button('Explore projects',()=>openCollection(),'action-button'));},440,360)};
actions['research-poster']=()=>openAbout('research-poster');
document.querySelectorAll('[data-action]').forEach(b=>b.addEventListener('click',()=>{actions[b.dataset.action]?.();if(state.active){if(b.closest('.menubar'))menuOwnership.set(state.active,b);else menuOwnership.delete(state.active);}updateMenuSelection();closeMenu();}));
const menu=$('#main-menu'),menuButton=$('#brand-menu');
menu.hidden=true;menuButton.setAttribute('aria-expanded','false');
function closeMenu(){menu.hidden=true;menuButton.setAttribute('aria-expanded','false');}
const showBrandMenu=()=>{document.dispatchEvent(new Event('portfolio-popover-opening'));menu.hidden=false;menuButton.setAttribute('aria-expanded','true');};
menuButton.onclick=()=>{if(menu.hidden)showBrandMenu();else closeMenu();};
menuButton.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&innerWidth>700)showBrandMenu();});
document.addEventListener('portfolio-popover-opening',closeMenu);
menuButton.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();menu.hidden=false;menuButton.setAttribute('aria-expanded','true');menu.querySelector('button')?.focus();}});
document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target)&&!menuButton.contains(e.target))closeMenu();});
menu.addEventListener('keydown',e=>{if(!['ArrowDown','ArrowUp'].includes(e.key))return;e.preventDefault();const options=[...menu.querySelectorAll('button')],index=options.indexOf(document.activeElement);options[(index+(e.key==='ArrowDown'?1:-1)+options.length)%options.length].focus();});
const titleWindow=$('#title-window');$('.close',titleWindow).onclick=()=>{titleWindow.hidden=true;};$('.minimize',titleWindow).onclick=()=>{titleWindow.hidden=true;toast('Title hidden · Restore it in Control Center');};$('.maximize',titleWindow).onclick=()=>openCollection();makeDraggable(titleWindow,$('.title-grip',titleWindow));
decorateWindowControls(titleWindow);
setupApplicationMenus({...actions,photos:openPhotos,figma:()=>openTool('Figma')});
setupControlCenter(document.querySelector('#control-center-trigger'),{...actions,photos:openPhotos,figma:()=>openTool('Figma'),desktop:hideAll});
function updateClock(){const date=new Date();$('#clock').textContent=matchMedia('(max-width:700px)').matches?date.toLocaleTimeString(document.documentElement.lang,{hour:'numeric',minute:'2-digit'}):date.toLocaleDateString(document.documentElement.lang,{month:'short',day:'2-digit'})+'  '+date.toLocaleTimeString(document.documentElement.lang,{hour:'numeric',minute:'2-digit'});}updateClock();setInterval(updateClock,30000);document.addEventListener('portfolio-preferences',updateClock);
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openCollection(true);}
  if(e.key==='Escape'&&!lightbox.open&&!menu.hidden){closeMenu();menuButton.focus({preventScroll:true});}
});
desktop.addEventListener('click',e=>{if(e.target===desktop){document.querySelectorAll('.desktop-icon.selected').forEach(el=>el.classList.remove('selected'));}});
setupDesktopDrift(desktop);
const linkedProject=byId(new URLSearchParams(location.hash.slice(1)).get('project'));if(linkedProject)openDetails(linkedProject);

initGuide({collection:()=>openCollection(),about:()=>openAbout(),research:()=>openAbout("research"),project:()=>openProject("p1"),details:()=>openDetails(byId("p1"))});
window.creativeOSReady=true;
setupLiquidGlass();
window.dispatchEvent(new Event('creativeos-ready'));
