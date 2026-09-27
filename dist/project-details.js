import {createWindow,closeWindow} from './windows.js';
import {archiveAssets} from './culture-assets.js';
import {nextChapters} from './project-chapters.js';
import {createFieldResearch} from './project-field-research.js';
import {createSpatialDesign} from './project-spatial-design.js';
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
const btn=(text,fn,cls='')=>{const node=el('button',cls,text);node.type='button';node.onclick=fn;return node;};
const photo=(src,alt,cls='')=>{const node=el('img',cls);node.src=src;node.alt=alt;node.loading='lazy';node.decoding='async';return node;};
const themes=[['VALUING ABILITY & ACHIEVEMENT','Skill · Merit · Creation','Craft and production offer a lens on knowledge, ability and creative achievement.'],['INCLUSIVENESS & OPENNESS','Exchange · Diversity · Connection','Ornaments, transport and urban spaces are linked through exchange and cultural diversity.'],['PRAGMATISM & ADAPTATION','Utility · Change · Innovation','Everyday objects and industrial equipment reveal changing needs and technical adaptation.'],['COMMERCE & INDUSTRY','Trade · Making · Circulation','Coins, measures and industrial archives are brought together around production and exchange.']];
function panel(title,content){const node=el('section','case-panel');node.append(el('header','case-panel-bar','● ● ●     '+title),content);return node;}
export function openProjectDetails(project,{openImage,openGallery}){
 const id='case-'+project.id,root=el('div','case-reader'),toolbar=el('div','case-browser-toolbar');
 const back=btn('‹',()=>{closeWindow(id);history.replaceState(null,'',location.pathname+location.search);},'case-back');back.setAttribute('aria-label','Back to project gallery');
 const address=el('span','case-address','▣  '+project.title+' / Project details');
 const status=el('span','case-status');status.setAttribute('role','status');toolbar.append(back,address);
 const chapters=el('nav','case-chapters');chapters.setAttribute('aria-label','Project chapters');
 const article=el('article','case-article');
 const jump=(target)=>article.querySelector('#'+target)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
 const chapterList=project.id==='p1'?[['Overview','case-overview'],['Family Factors','case-family'],['Cultural Research','case-culture'],...nextChapters.map(c=>[c.nav,c.id])]:[['Overview','case-overview'],['Project Images','case-images']];
 for(const [label,target] of chapterList)chapters.append(btn(label,()=>jump(target)));
 chapters.append(btn('Project Photos ↗',()=>openGallery(project.id),'case-photos'));
 root.append(toolbar,chapters,status,article);
 if(project.id==='p1'){
  const find=(term)=>project.images.find(im=>im.path.toLowerCase().includes(term.toLowerCase()))||project.images[0];
  const hero=el('section','case-hero');hero.id='case-overview';
  const backdrop=photo(find('Qi_Culture_Immersive_Mirror').preview||find('Qi_Culture_Immersive_Mirror').src,'Qi Culture immersive mirror hall','case-backdrop');backdrop.loading='eager';hero.append(backdrop);
  const tiles=el('div','case-hero-tiles');
  for(const [term,label] of [['Interactive_Digital_Sand','Interactive Digital Sand Table'],['The_Star_Catalogue','The Star Catalogue of Gan and Shi'],['Tianqiyuan','Tianqiyuan Lighting Installation']]){const im=find(term);const b=btn('',()=>openImage([im],0,project.title),'case-photo-tile');b.append(photo(im.thumb,label),el('span','',label));tiles.append(b);}
  hero.append(tiles);
  const role=el('p','','My Role: Lead Designer, Media Designer, Exhibition Curation & Execution');hero.append(panel('My Role',role));
  const meta=el('div','case-meta');meta.append(el('span','','#Project 01   #Team Work'),el('span','','2025.9 – 2026.8'));hero.append(meta);
  const intro=el('div','case-intro'),title=el('div');title.append(el('h1','','WIND BLOWS\nFROM THE\nEAST'),el('p','case-subtitle','Qi Culture Classic Museum\nDigital Arts Museum Design & Implementation'));
  const copy=el('div','case-intro-copy');for(const text of project.introduction.split(/\r?\n\s*\r?\n/).slice(0,2))copy.append(el('p','',text));intro.append(title,copy);hero.append(intro);article.append(hero);
  const family=el('section','case-family');family.id='case-family';
  const collage=el('div','case-collage');collage.append(el('h2','case-label case-family-label','FAMILY FACTORS.'));
  const familyText=el('div','case-family-copy');familyText.append(el('h3','',"Family’s Customs and Traditions"),el('h4','','#Grow up in a Shandong Family'),el('p','','Growing up in Shandong shaped my interest in Qi culture. During field research in Zibo, I collected local industrial archives and read them alongside the city’s cultural history. These first-hand materials and my personal perspective informed a provisional four-quadrant framework, to be explored and refined through further cultural analysis.'));
  collage.append(panel('Family Factors',familyText));
  const industrial=archiveAssets.filter(a=>a.src.includes('industry'));
  const photoLayer=el('div','case-family-photos');family.append(photoLayer);
  industrial.forEach((asset,i)=>{const card=btn('',()=>openImage([{src:asset.src,name:asset.title}],0,'Industrial archive'),'case-archive-photo photo-'+i);card.append(photo(asset.src,asset.title));card.title=asset.title;photoLayer.append(card);});
  collage.append(el('h2','case-label case-history-label','HISTORICAL CONTEXT.'),el('h2','case-label case-century-label','A CENTURY OF\nINDUSTRY.'));
  const research=el('div','case-family-research'),columns=el('div','case-research-columns');
  for(const [heading,text] of [['From Qi Culture to a Century of Industry','Zibo is not only a major birthplace of Qi culture, but also a city shaped by more than a century of industrial development. Over two thousand years ago, the State of Qi developed commerce, craftsmanship, and the salt industry according to local conditions, forming a cultural ethos of pragmatism, adaptability, openness, and respect for commerce and industry. Today, these values remain an important lens through which Zibo understands its urban identity.'],['Pragmatism Translated into Industrial Development','In the modern era, Zibo developed into one of China’s major industrial cities. Coal mining, ceramics, glass, silk, chemicals, and machinery reshaped both its urban landscape and social structure. With more than 110 years of modern industrial history, industry became another powerful expression of the city’s pragmatic and productive character.']]){const col=el('section');col.append(el('h3','',heading),el('p','',text));columns.append(col);}research.append(columns);
  research.append(panel('Provisional framework',el('h3','','An initial reading of field research: four cultural themes connect values and practice, internal capability and external exchange. This framework remains open to revision.')));
  const matrix=el('div','case-matrix quadrant-chart');matrix.setAttribute('aria-label','Cultural continuity: values and practice, internal capability and external connection');
  const comparisons=[
   ['Respect for talent and ability.\n\nMerit and contribution are highly valued.','Emphasis on technical experts, skilled workers, engineers and tangible achievements.'],
   ['Inclusive of diverse ideas and people.\n\nEncourages dialogue and embraces differences.','Exchange of technology, flow of talent, collaboration between industries and regions.'],
   ['Adapt to circumstances.\n\nPractical, flexible and action-oriented.','Continuous adjustment of production methods, technological innovation and industrial upgrading.'],
   ['Emphasis on commerce, craftsmanship and productive activities.','Ceramics, glass, mining, chemicals, machinery and manufacturing formed a strong industrial foundation.']
  ];
  themes.forEach(([title],i)=>{const card=btn('',()=>jump('case-culture'),'quadrant quadrant-'+i);card.setAttribute('aria-label',title+' — explore research');const heading=el('h4','',title);const table=el('div','quadrant-comparison');['QI CULTURE','INDUSTRIAL CONTINUITY'].forEach((label,j)=>{const col=el('div');col.append(el('h5','',label),el('p','',comparisons[i][j]));table.append(col);});card.append(heading,table);if(i===0)card.append(el('p','quadrant-keywords','Keywords: Talent  Skill  Achievement'));matrix.append(card);});
  matrix.append(el('div','quadrant-axis axis-horizontal'),el('div','quadrant-axis axis-vertical'),el('strong','quadrant-center','CULTURAL\nCONTINUITY'));
  for(const [position,title,subtitle] of [['top','VALUES & MINDSET','Beliefs / Attitudes / Orientation'],['bottom','PRACTICE & PRODUCTION','Action / Implementation / Output'],['left','INTERNAL\nCAPABILITY','Focus on people & internal strength'],['right','EXTERNAL\nCONNECTION','Focus on exchange & outside world']]){const label=el('div','axis-label axis-'+position);label.append(el('strong','',title),el('small','',subtitle));matrix.append(label);}
  research.append(matrix);family.append(collage,research);article.append(family);
  const culture=el('section','case-culture');culture.id='case-culture';culture.append(el('span','case-kicker','03 / CULTURAL BACKGROUND RESEARCH'),el('h2','','FROM CULTURAL ROOTS\nTO A SHARED FIELD.'),el('p','case-lead','This chapter applies the provisional four-quadrant framework developed from field research in Zibo. Objects, industrial archives and cultural stories are compared through the framework, with each association explained as an interpretation rather than a fixed rule.'));
  const note=el('p','case-method','6 cultural stories · 4 provisional themes · 240 spherical fragments. Historical figures are represented by later portraits.');culture.append(note);
  const frame=el('iframe','culture-embed');frame.title='Qi culture research — interactive archives, themes and cultural sphere';frame.loading='lazy';frame.setAttribute('allow','fullscreen');
  frame.src='culture.html';culture.append(frame);
  const sources=el('div','case-sources');sources.append(el('span','','Research sources: '));for(const [label,url] of [['Qi Heritage Museum','https://www.qiheritagemuseum.com/'],['Qi cultural spirit · Zibo','https://hrss.zibo.gov.cn/art/2020/12/7/art_1060_2054972.html']]){const a=el('a','',label+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';sources.append(a);}culture.append(sources);article.append(culture);
  article.append(createFieldResearch(openImage));
  article.append(createSpatialDesign());
  for(const chapter of nextChapters.filter(c=>!['case-interview','case-narrative'].includes(c.id))){
   const section=el('section','case-planned-chapter');section.id=chapter.id;
   section.append(el('span','case-kicker',chapter.number+' / '+chapter.nav.toUpperCase()),el('h2','',chapter.title),el('p','case-chapter-question',chapter.question));
   const flow=el('ol','case-chapter-flow');chapter.steps.forEach(step=>flow.append(el('li','',step)));section.append(flow);
   const slots=el('div','case-material-slots');chapter.slots.forEach(([title,description],i)=>{const slot=el('section','case-material-slot');slot.append(el('span','case-slot-number',String(i+1).padStart(2,'0')),el('h3','',title),el('p','',description),el('span','case-pending-note','Materials to be added'));slots.append(slot);});section.append(slots);
   const next=nextChapters[nextChapters.indexOf(chapter)+1];if(next)section.append(btn('Next / '+next.nav+' →',()=>jump(next.id),'case-next-chapter'));article.append(section);
  }
  const originals=el('footer','case-originals');originals.append(el('span','','Original portfolio layouts'),btn('Cover ↗',()=>openImage([{src:'assets/culture/portfolio_design1.webp',name:'Original cover'}],0,project.title)),btn('Family Factors ↗',()=>openImage([{src:'assets/culture/portfolio_design2.webp',name:'Original Family Factors layout'}],0,project.title)));article.append(originals);
 }else{
  const overview=el('section','case-generic');overview.id='case-overview';overview.append(el('span','case-kicker',project.category),el('h1','',project.title));for(const text of (project.introduction||project.summary||'Selected images and project materials.').split(/\r?\n\s*\r?\n/))overview.append(el('p','',text));for(const doc of project.documents){const a=el('a','case-document',doc.name+' ↗');a.href=doc.src;a.target='_blank';a.rel='noopener';overview.append(a);}article.append(overview);
  const images=el('section','case-image-story');images.id='case-images';for(const im of project.images){const b=btn('',()=>openImage([im],0,project.title));b.append(photo(im.preview||im.src,im.name),el('span','',im.name));images.append(b);}article.append(images);
 }
 const win=createWindow({id,title:project.title+' — Full Project',content:root,width:Math.min(1380,innerWidth-40),height:innerHeight-130,className:'case-window',onMaximize:toggleFullscreen});
 if(win.existing)return;
 const shell=win.el,green=shell.querySelector('.maximize'),bar=shell.querySelector('.window-titlebar');
 bar.querySelector('.window-title').remove();bar.classList.add('case-unified-bar');bar.append(back,address);toolbar.remove();
 const edge=el('div','case-fullscreen-edge');edge.setAttribute('aria-hidden','true');shell.append(edge);
 const controller=new AbortController();let hideTimer;
 const cultureFrame=shell.querySelector('.culture-embed');
 let frameVisible=false;
 const notifyCulture=()=>cultureFrame?.contentWindow?.postMessage({type:'portfolio-culture-active',active:frameVisible&&!shell.hidden&&!shell.classList.contains('inactive')&&!shell.classList.contains('minimizing')&&!document.hidden},location.origin);
 const frameObserver=cultureFrame?new IntersectionObserver(([entry])=>{frameVisible=entry.isIntersecting;notifyCulture();},{threshold:0}):null;
 if(cultureFrame){frameObserver.observe(cultureFrame);cultureFrame.addEventListener('load',notifyCulture);}
 document.addEventListener('portfolio-windows-changed',notifyCulture,{signal:controller.signal});
 document.addEventListener('visibilitychange',notifyCulture,{signal:controller.signal});

 const update=()=>{const active=document.fullscreenElement===shell||shell.classList.contains('case-fullscreen');shell.classList.toggle('case-immersive',active);green.setAttribute('aria-label',(active?'Exit full screen ':'Enter full screen ')+project.title);green.setAttribute('aria-pressed',String(active));shell.classList.remove('case-controls-visible');};
 async function toggleFullscreen(target){
  if(document.fullscreenElement===target){await document.exitFullscreen();return;}
  if(target.classList.contains('case-fullscreen')){target.classList.remove('case-fullscreen');update();return;}
  try{await target.requestFullscreen();}catch{target.classList.add('case-fullscreen');update();}
  green.blur();
 }
 const reveal=()=>{clearTimeout(hideTimer);shell.classList.add('case-controls-visible');};
 const hide=()=>{clearTimeout(hideTimer);hideTimer=setTimeout(()=>shell.classList.remove('case-controls-visible'),350);};
 edge.addEventListener('pointerenter',reveal);edge.addEventListener('pointerdown',reveal);bar.addEventListener('pointerenter',reveal);bar.addEventListener('pointerleave',hide);edge.addEventListener('pointerleave',hide);
 document.addEventListener('fullscreenchange',update,{signal:controller.signal});
 shell.addEventListener('keydown',e=>{if(e.key==='Tab'){reveal();}if(e.key==='Escape'&&shell.classList.contains('case-fullscreen')){shell.classList.remove('case-fullscreen');update();}});
 shell.addEventListener('window-closing',()=>{clearTimeout(hideTimer);frameObserver?.disconnect();controller.abort();},{once:true});
 update();
 const url=new URL(location.href);url.hash='project='+project.id;history.replaceState(null,'',url);
 win.el.querySelector('.close').addEventListener('click',()=>{if(location.hash==='#project='+project.id)history.replaceState(null,'',location.pathname+location.search);});
}
