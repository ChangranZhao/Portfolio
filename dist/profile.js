import {createWindow,focusWindow,hideAll,state} from './windows.js';

// Transcribed from the user's second desktop reference. No external links were supplied.
const roles=[
 'Communication University of China',
 'Digital Media Arts (Network and Intelligent Media Design)',
 'Lead of Digital Art Studio “Atavism”',
 'Research Intern at the Design Futures Research Group, Tsinghua University',
 'Previously worked at the Digital Human Lab and the Intelligent Media Design Lab, Communication University of China'
];
const awards=[
 ['Lumen Prize Finalist 2025','2025.8.15'],
 ['London Design Awards Golden',''],
 ['Muse Creative Awards Golden Prize — Mobile APP','2025.3.27'],
 ['Muse Creative Awards Silver Prize — Experiential & Immersive','2025.3.25'],
 ['Muse Creative Awards Silver Prize — Experiential & Immersive','2024.12.5'],
 ['16th Paris Chinese Film Festival — Best Innovation Award','2025.6.13'],
 ['AIGC Section, 15th Beijing International Film Festival — Best Technology Award','2025.4.25']
];
const commercial=[
 ['Wind Blows from the East Digital Art Exhibition (Qi Culture Classical Museum)','2025.9 – 2026.7','Zibo, Shandong Province, China','p1'],
 ['Digital Media Part in Shanxi Changzhi Museum','2025.6 – 2025.12','Changzhi, Shanxi Province, China','p6'],
 ['Digital Media Part in Wuqiao Acrobatics Museum','2025.9 – 2025.10','Wuqiao, Cangzhou, Hebei, China'],
 ['Five Elements Multimedia Dance “Water Part” (collaboration with Tianjin College of Media & Arts)','2024.11 – 2025.4','Tianjin, China'],
 ['Closing Ceremony of the AIGC Section at the Beijing International Film Festival','2025.4','Beijing, China'],
 ['Miyun Great Wall Castle Digital Smart Exhibition Hall','2025.5 – 2025.7','Beijing, China'],
 ['Electronic Music Stage Visuals, E-Sound Night, Communication University of China','2025.3 – 2025.6','Beijing, China'],
 ['Exhibition in Illuminarium Phaotom Space','2025.3 – 2025.4','Macau, China'],
 ['Echo-Space Interactive Live Performance Series','2024.3 – 2025.3','Beijing, China · London, UK','p4']
];
const exhibitions=[
 ['ICME AI Art Gallery 2025','2025','Nantes, France'],
 ['Emerging Artists Digital Co-Creation Program: Special Exhibition at the National Stadium','2025','National Stadium (Bird’s Nest), Beijing, China'],
 ['Below the Surface, Above the Flows','2025','Cafa Museum, Beijing, China'],
 ['Beijing Design Week 2024','2024','Fangzhuang, Beijing, China'],
 ['What is Visible — Digital Art Exhibition','2024','Hangzhou, Zhejiang, China'],
 ['ChineseCHI Art Gallery 2024','2024','Shenzhen, Guangdong, China']
];
const publications=[
 ['Bodystorming through Disruption: AI-assisted Design Improvisation Pedagogy','DRS 2026'],
 ['Path of Light: Interactive Narrative Design Based on Mix Reality for Silk Road Cultural Perception','UIST 2026'],
 ['Echo-Space: Inclusive Orchestral Performance Space with Visual Media','HCII 2025'],
 ['HISTORICAL-IMMERSION — Immersive Memory Re-production System Based on 3D Scanning and Multi-modal Interaction','HCII 2025'],
 ['UIST Poster','UIST 2025']
];

function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
function btn(text,action,cls=''){const b=el('button',cls,text);b.onclick=action;return b;}
function img(src,alt){const i=el('img');i.src=src;i.alt=alt;i.loading='lazy';return i;}
function bounds(x,y,w,h){if(innerWidth<1100)return undefined;return {x:innerWidth*x,y:innerHeight*y,width:innerWidth*w,height:innerHeight*h};}

export function createProfileWorkspace({projects,cover,openProject,openPhotos,openCollection}){
  function navigation(){
    const nav=el('nav','workspace-navigation');nav.setAttribute('aria-label','About workspace navigation');
    nav.append(btn('About me',()=>openBoard()),btn('Exhibitions & papers',()=>openResearch()),btn('Contents',()=>openContents()),btn('Show desktop',()=>hideAll()));return nav;
  }
  function decorateBrowser(win){
    if(win.existing)return;
    const tools=el('div','browser-controls');
    const back=btn('‹',()=>hideAll());back.setAttribute('aria-label','Back to desktop');
    const forward=btn('›',()=>openContents());forward.setAttribute('aria-label','Browse contents');tools.append(back,forward);win.el.querySelector('.window-titlebar').append(tools);
  }
  function details(title,metadata){
    const page=el('div','info-page');page.append(el('div','eyebrow','CHANGRAN ZHAO'),el('h1','',title),el('p','',metadata),el('p','muted-note','Additional project materials are not included in the current portfolio. / 当前素材中尚未包含该项的详细资料。'));
    createWindow({id:'record-'+title,title,content:page,width:570,height:360});
  }
  function record(title,metadata,onClick){
    const b=btn('',onClick||(()=>details(title,metadata)),'profile-record');b.append(el('span','record-name',title),el('span','record-meta',metadata));return b;
  }
  function openBoard(section){
    if(state.items.has('profile-about')){focusWindow('profile-about');if(section)reveal(section);return;}
    const board=el('div','profile-board');board.append(navigation());
    const columns=el('div','profile-columns'),left=el('div','profile-personal'),right=el('section','profile-commercial');right.id='profile-commercial';
    const roleSection=el('section');roleSection.id='profile-role';roleSection.append(el('h2','','ROLE'));
    const roleList=el('ul','profile-glass role-list');roles.forEach(text=>roleList.append(el('li','',text)));roleSection.append(roleList);
    const awardSection=el('section');awardSection.id='profile-awards';awardSection.append(el('h2','','AWARD'));const awardList=el('div','profile-glass');
    awards.forEach(([title,date])=>awardList.append(record(title,date)));awardSection.append(awardList);left.append(roleSection,awardSection);
    right.append(el('h2','','COMMERCIAL PROJECT'));const projectList=el('div','profile-glass');
    commercial.forEach(([title,date,place,pid])=>projectList.append(record(title,date+'   '+place,pid?()=>openProject(pid):undefined)));right.append(projectList);
    columns.append(left,right);board.append(columns);
    const win=createWindow({id:'profile-about',title:'Changran Zhao / About Me',content:board,width:1000,height:670,className:'about-workspace browser-window profile-window',bounds:bounds(.045,.21,.90,.64)});decorateBrowser(win);if(section)reveal(section);
  }
  function reveal(section){
    requestAnimationFrame(()=>{const node=document.getElementById('profile-'+section);if(node){node.scrollIntoView({block:'nearest',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});node.classList.remove('section-highlight');void node.offsetWidth;node.classList.add('section-highlight');}});
  }
  function openResearch(section){
    if(state.items.has('profile-research')){focusWindow('profile-research');if(section)reveal(section);return;}
    const board=el('div','research-board');board.append(navigation());const cols=el('div','research-columns');
    const exhibition=el('section');exhibition.id='profile-exhibitions';exhibition.append(el('h2','','EXHIBITION'));const list=el('div','exhibition-list');
    exhibitions.forEach(([title,date,place])=>list.append(record(title,date+'   '+place)));exhibition.append(list);
    const papers=el('section');papers.id='profile-publications';papers.append(el('h2','','PAPER PUBLICATION'));publications.forEach(([title,venue])=>{const row=record(title,venue);if(title==='UIST Poster')row.id='profile-uist-poster';papers.append(row);});
    cols.append(exhibition,papers);board.append(cols);
    const win=createWindow({id:'profile-research',title:'Changran Zhao / Exhibitions & Papers',content:board,width:1100,height:440,className:'about-workspace browser-window research-window',bounds:bounds(.225,.043,.67,.285)});decorateBrowser(win);if(section)reveal(section);
  }
  function openDocuments(){
    const page=el('div','info-page');page.append(el('div','eyebrow','PORTFOLIO ARCHIVE'),el('h1','','Documents'));
    for(const p of projects)if(p.documents.length){page.append(el('h2','',p.title));for(const doc of p.documents){const a=el('a','doc-link','↗ '+doc.name);a.href=doc.src;a.target='_blank';a.rel='noopener';page.append(a,el('br'));}}
    createWindow({id:'documents',title:'Documents',content:page,width:520,height:500});
  }
  function openContents(){
    openCollection();
  }
  function sticker(id,word,rect){
    const b=btn(word,word==='ABOUT ME'?()=>openBoard():()=>openContents(),'workspace-word');
    createWindow({id,title:'Changran Zhao (Active)',content:b,width:370,height:105,className:'workspace-sticker',bounds:rect});
  }
  function openWorkspace(){
    if(innerWidth>=1100)sticker('about-label','ABOUT ME',bounds(.017,.055,.23,.10));
    openBoard();
  }
  function openSection(section){
    if(section==='research-poster'){openResearch('uist-poster');return;}
    if(section==='research'){openResearch('publications');return;}
    openBoard({education:'role',experience:'role',studio:'commercial',awards:'awards'}[section]);
  }
  return {openWorkspace,openSection,openContents};
}
