import {createMimesis,mimesisChapters} from './mimesis-project.js';

// Let scrolling use the compositor without competing with the 3D archive.
function pauseCultureWhileScrolling(frame,signal){
 if(!frame)return;
 let timer=0,scrolling=false;
 const notify=value=>frame.contentWindow?.postMessage({type:'portfolio-culture-scrolling',scrolling:value},location.origin);
 window.addEventListener('scroll',()=>{
  if(!scrolling){scrolling=true;notify(true);}
  clearTimeout(timer);timer=setTimeout(()=>{scrolling=false;notify(false);},180);
 },{capture:true,passive:true,signal});
 frame.addEventListener('load',()=>notify(scrolling),{signal});
 signal.addEventListener('abort',()=>clearTimeout(timer),{once:true});
}
import {createBlueCalico,blueChapters} from './blue-calico.js';
import {createNeuroProject,neuroChapters} from './neuro-project.js';
import {addPotatoStory} from './potato-story.js';
import {createYouTubeFacade} from './video-facade.js';
import {registerTranslations} from './localization.js';
import {papers} from './papers.js';
import {createExhibitOverview} from './exhibit-overview.js';
import {createChangzhiProject,changzhiChapters} from './changzhi-project.js';
import {createWindow,closeWindow} from './windows.js';
import {archiveAssets} from './culture-assets.js';
import {nextChapters} from './project-chapters.js';
import {createFieldResearch} from './project-field-research.js';
import {createSpatialDesign} from './project-spatial-design.js';
import {createConstructionTimeline} from './project-construction.js';
import {createExhibitReader} from './project-exhibit-reader.js';
import {createGanshiDetails} from './ganshi-details.js';
import {createYanziDetails} from './yanzi-details.js';
import {hasFigmaDetails,figmaChapters,createFigmaDetails} from './figma-project-details.js';
const el=(tag,cls,text)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(text!==undefined)node.textContent=text;return node;};
registerTranslations([["This AI-generated short film takes viewers on a whimsical journey to Mars, imagining a world where potatoes have developed consciousness and built their own civilization. Through the absurd premise of potato rule on the Red Planet, the film explores the human dream of space colonization from a fresh, non-human perspective.","这部由 AI 生成的短片带领观众踏上一段异想天开的火星之旅，想象土豆拥有了意识，并建立起属于自己的文明。通过“土豆统治红色星球”这一荒诞设定，影片从新鲜的非人类视角，探索人类对太空殖民的梦想。"],["Blending satire with sci-fi, the film offers a humorous yet thought-provoking reflection on humanity’s quest to explore the cosmos. By reinterpreting serious themes like aerospace ambition through the lens of playful storytelling, it brings space exploration closer to everyday audiences, igniting curiosity and celebrating the spirit of human imagination and perseverance — all while making us laugh.","影片融合讽刺与科幻，以幽默而引人深思的方式，反思人类探索宇宙的追求。它借助轻松诙谐的叙事，重新诠释航天抱负等严肃主题，拉近太空探索与日常观众之间的距离，激发好奇心，礼赞人类的想象力与坚持不懈的精神，也让我们在思考之余会心一笑。"]]);
const btn=(text,fn,cls='')=>{const node=el('button',cls,text);node.type='button';node.onclick=fn;return node;};
const photo=(src,alt,cls='')=>{const node=el('img',cls);node.src=src;node.alt=alt;node.loading='lazy';node.decoding='async';return node;};
registerTranslations([["Full screen ↗","全屏阅读 ↗"],["Research & Publication","研究与论文"],["Read paper ↗","阅读全文 ↗"],["Download PDF","下载 PDF"],["Path of Light transforms Silk Road mythology into an embodied mixed reality journey. Guided by a mythical bird, participants become Light Seekers, exploring stories inspired by the Chinese Golden Crow, Persian Simurgh and Sumerian Shamash. Shared motifs of light connect these cultural narratives while preserving their distinct visual identities.","《光之路》将丝绸之路神话转化为具身参与的混合现实旅程。观众化身“寻光者”，在神鸟引导下，探索以中国金乌、波斯西穆尔格和苏美尔沙玛什神话为原型的故事。作品以“光”这一共同母题连接不同文化叙事，同时保留各自的视觉特色。"],["Developed with Unity and Apple Vision Pro, the experience unfolds through three modules: assembling and personalizing a mythical bird, touching objects to advance spatial narratives, and performing culturally inspired greeting gestures. A workflow combining LoRA, ComfyUI, manual refinement and Unity animation translates researched visual references into animated scenes situated in the physical environment.","体验基于 Unity 与 Apple Vision Pro 开发，包含三个模块：组装并定制神鸟、触碰物件推进空间叙事，以及完成受当地文化启发的问候手势。创作流程结合 LoRA、ComfyUI、人工修整与 Unity 动画，将研究所得的视觉参考转化为融入真实环境的动态场景。"],["Published at UIST Adjunct 2025, the paper documents the design process, system prototype and a pilot study with 10 participants aged 19–52. Initial interview feedback suggests increased interest in Silk Road mythology and cross-cultural connections; larger studies are needed to evaluate the impact more rigorously.","发表于 UIST Adjunct 2025 的论文记录了设计流程、系统原型，以及一项面向 10 名参与者（19–52 岁）的初步研究。访谈反馈显示，体验激发了参与者对丝路神话及跨文化关联的兴趣；其实际影响仍需更大规模的研究进一步验证。"]]);
const themes=[['VALUING ABILITY & ACHIEVEMENT','Skill · Merit · Creation','Craft and production offer a lens on knowledge, ability and creative achievement.'],['INCLUSIVENESS & OPENNESS','Exchange · Diversity · Connection','Ornaments, transport and urban spaces are linked through exchange and cultural diversity.'],['PRAGMATISM & ADAPTATION','Utility · Change · Innovation','Everyday objects and industrial equipment reveal changing needs and technical adaptation.'],['COMMERCE & INDUSTRY','Trade · Making · Circulation','Coins, measures and industrial archives are brought together around production and exchange.']];
function panel(title,content){const node=el('section','case-panel');node.append(el('header','case-panel-bar','● ● ●     '+title),content);return node;}
export function openProjectDetails(project,{openImage,openGallery,mount}){
 if(project.id==='p14')project={...project,introduction:"This AI-generated short film takes viewers on a whimsical journey to Mars, imagining a world where potatoes have developed consciousness and built their own civilization. Through the absurd premise of potato rule on the Red Planet, the film explores the human dream of space colonization from a fresh, non-human perspective.\n\nBlending satire with sci-fi, the film offers a humorous yet thought-provoking reflection on humanity’s quest to explore the cosmos. By reinterpreting serious themes like aerospace ambition through the lens of playful storytelling, it brings space exploration closer to everyday audiences, igniting curiosity and celebrating the spirit of human imagination and perseverance — all while making us laugh."};
 let featuredExhibitReader=null,disposeFigma=null;
 const id='case-'+project.id,root=el('div','case-reader'),toolbar=el('div','case-browser-toolbar');
 const back=btn('‹',()=>{closeWindow(id);history.replaceState(null,'',location.pathname+location.search);},'case-back');back.setAttribute('aria-label','Back to project gallery');
 const address=el('span','case-address','▣  '+project.title+' / Project details');
 const status=el('span','case-status');status.setAttribute('role','status');toolbar.append(back,address);
 const chapters=el('nav','case-chapters');chapters.setAttribute('aria-label','Project chapters');
 const article=el('article','case-article');
 if(project.id==='p14')article.classList.add('potato-article');
 if(project.id==='p7'||project.id==='p9'||project.id==='p14'){
  const video=el('section','mimesis-project-video');
  const frame=el('iframe');frame.src='https://www.youtube-nocookie.com/embed/Ctcd_OK9tAo';frame.title='MIMESIS — The Shape of AI';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
  if(project.id==='p14'){frame.src='https://www.youtube-nocookie.com/embed/8b1TP04Dqwg';frame.title='What if Potatoes Ruled Mars — Project Video';}
  if(project.id==='p9'){frame.src='https://www.youtube-nocookie.com/embed/AzF4V8WeWqg';frame.title='NEURO IMMERSIVE — Concept Film';}
  video.append(createYouTubeFacade(frame,{poster:project.images[0]?.preview||project.images[0]?.src}));article.append(video);
 }

 const jump=(target)=>article.querySelector('#'+target)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches||document.body.classList.contains('reduce-motion')?'instant':'smooth',block:'start'});
 const chapterList=project.id==='p7'?mimesisChapters:project.id==='p12'?blueChapters:project.id==='p9'?neuroChapters:project.id==='p6'?changzhiChapters:hasFigmaDetails(project.id)?figmaChapters(project.id):project.id==='p1'?[['Overview','case-overview'],['Family Factors','case-family'],['Cultural Research','case-culture'],...nextChapters.map(c=>[c.nav,c.id])]:[['Overview','case-overview'],['Project Images','case-images']];
 for(const [label,target] of chapterList)chapters.append(btn(label,()=>jump(target)));
 chapters.append(btn('Project Photos ↗',()=>openGallery(project.id),'case-photos'));
 root.append(toolbar,chapters,status,article);
 if(project.id==='p7'){disposeFigma=createMimesis(article,project,{openImage});
 }else if(project.id==='p12'){
  createBlueCalico(article,project,openImage);
 }else if(project.id==='p9'){
  createNeuroProject(article,{openImage});
 }else if(project.id==='p6'){
  disposeFigma=createChangzhiProject(article,{openImage});
 }else if(hasFigmaDetails(project.id)){
  disposeFigma=createFigmaDetails(article,project,{openImage});
 }else if(project.id==='p1'){
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
  const projectVideo=el('section','mimesis-project-video');projectVideo.id='case-project-video';
  const projectVideoFrame=el('iframe');projectVideoFrame.src='https://www.youtube-nocookie.com/embed/Jj-pVt7dwis';projectVideoFrame.title='Wind Blows from the East — Project Video';projectVideoFrame.loading='lazy';projectVideoFrame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';projectVideoFrame.allowFullscreen=true;projectVideoFrame.referrerPolicy='strict-origin-when-cross-origin';
  projectVideo.append(createYouTubeFacade(projectVideoFrame,{poster:project.images[0]?.preview||project.images[0]?.src}));article.append(projectVideo);
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
  article.append(createConstructionTimeline(openImage));
  for(const chapter of nextChapters.filter(c=>!['case-interview','case-narrative'].includes(c.id))){
   if(chapter.id==='case-delivery')continue;
   const section=el('section','case-planned-chapter');section.id=chapter.id;
   section.append(el('span','case-kicker',chapter.number+' / '+chapter.nav.toUpperCase()),el('h2','',chapter.title),el('p','case-chapter-question',chapter.question));
   const flow=el('ol','case-chapter-flow');chapter.steps.forEach(step=>flow.append(el('li','',step)));section.append(flow);
   const slots=el('div','case-material-slots'+(chapter.id==='case-exhibits'?' case-exhibit-slots':''));chapter.slots.forEach(([title,description],i)=>{
    if(chapter.id==='case-exhibits'&&i===0){
     const slot=el('a','case-material-slot case-featured-exhibit');slot.href='#exhibit-01';slot.dataset.exhibit='01';slot.setAttribute('aria-haspopup','dialog');
     slot.append(el('span','case-slot-number','01'),photo('assets/exhibit-01/scene-built.webp','Curved projection wall for Adapt customs, simplify rites','case-featured-image'),el('span','case-featured-zone','UNIT 01 / THE SPIRIT OF QI'),el('h3','',title),el('p','',description),el('span','case-featured-link','View exhibit details ↗'));
     slot.onclick=e=>{e.preventDefault();featuredExhibitReader??=createExhibitReader();featuredExhibitReader.open('01',slot);};
     slots.append(slot);return;
    }
    if(chapter.id==='case-exhibits'&&i===1){
     const slot=el('a','case-material-slot case-featured-exhibit');slot.href='#ganshi-details';slot.dataset.case='ganshi';slot.setAttribute('aria-haspopup','dialog');
     slot.append(el('span','case-slot-number','02'),photo('assets/ganshi/outcome-01.webp','Completed Star Catalogue of Gan and Shi installation','case-featured-image'),el('span','case-featured-zone','CASE 02 / THE STAR CATALOGUE'),el('h3','',title),el('p','',description),el('span','case-featured-link','View exhibit details ↗'));
     slot.onclick=e=>{e.preventDefault();featuredExhibitReader??=createExhibitReader();featuredExhibitReader.open('16',slot);};
     slots.append(slot);return;
    }
    if(chapter.id==='case-exhibits'&&i===2){
     const slot=el('a','case-material-slot case-featured-exhibit');slot.href='#qizhiweiqi-details';slot.dataset.case='qizhiweiqi';slot.setAttribute('aria-haspopup','dialog');
     slot.append(el('span','case-slot-number','03'),photo('assets/qizhiweiqi/final-01.webp','Completed immersive mirror hall','case-featured-image'),el('span','case-featured-zone','CASE 03 / IMMERSIVE MIRROR HALL'),el('h3','',title),el('p','',description),el('span','case-featured-link','View exhibit details ↗'));
     slot.onclick=e=>{e.preventDefault();featuredExhibitReader??=createExhibitReader();featuredExhibitReader.open('preface',slot);};
     slots.append(slot);return;
    }
    if(chapter.id==='case-exhibits'&&i===3){
const slot=el('a','case-material-slot case-featured-exhibit');slot.href='#yanzi-details';slot.dataset.case='yanzi';slot.setAttribute('aria-haspopup','dialog');
slot.append(el('span','case-slot-number','04'),photo('assets/yanzi/site-05.webp','Visitor in conversation with the digital Yan Zi','case-featured-image'),el('span','case-featured-zone','CASE 04 / CONVERSATIONAL DIGITAL HUMAN'),el('h3','',title),el('p','',description),el('span','case-featured-link','View exhibit details ↗'));
slot.onclick=e=>{e.preventDefault();featuredExhibitReader??=createExhibitReader();featuredExhibitReader.open('06',slot);};slots.append(slot);return;
}
const slot=el('section','case-material-slot');slot.append(el('span','case-slot-number',String(i+1).padStart(2,'0')),el('h3','',title),el('p','',description));if(chapter.id!=='case-reflection')slot.append(el('span','case-pending-note','Materials to be added'));slots.append(slot);
   });section.append(slots);if(chapter.id==='case-exhibits')section.append(createExhibitOverview());
   const next=nextChapters[nextChapters.indexOf(chapter)+1];if(next)section.append(btn('Next / '+next.nav+' →',()=>jump(next.id),'case-next-chapter'));article.append(section);
  }
 }else{
  const overview=el('section','case-generic');overview.id='case-overview';if(project.id==='p11')project={...project,introduction:"Path of Light transforms Silk Road mythology into an embodied mixed reality journey. Guided by a mythical bird, participants become Light Seekers, exploring stories inspired by the Chinese Golden Crow, Persian Simurgh and Sumerian Shamash. Shared motifs of light connect these cultural narratives while preserving their distinct visual identities.\n\nDeveloped with Unity and Apple Vision Pro, the experience unfolds through three modules: assembling and personalizing a mythical bird, touching objects to advance spatial narratives, and performing culturally inspired greeting gestures. A workflow combining LoRA, ComfyUI, manual refinement and Unity animation translates researched visual references into animated scenes situated in the physical environment."};overview.append(el('span','case-kicker',project.category),el('h1','',project.title));for(const text of (project.introduction||project.summary||'Selected images and project materials.').split(/\r?\n\s*\r?\n/))overview.append(el('p','',text));for(const doc of project.documents){const a=el('a','case-document',doc.name+' ↗');a.href=doc.src;a.target='_blank';a.rel='noopener';overview.append(a);}article.append(overview);
  if(project.id==='p14'){addPotatoStory(article,{openImage});chapters.append(btn('Film stills',()=>jump('potato-stills')),btn('Making the film',()=>jump('potato-process')));}
  const images=el('section','case-image-story');images.id='case-images';for(const im of project.images){const b=btn('',()=>openImage([im],0,project.title));b.append(photo(im.preview||im.src,im.name),el('span','',im.name));images.append(b);}article.append(images);
  if(project.id==='p11'){const paper=papers.find(p=>p.id==='path-of-light');const section=el('section','case-generic');section.id='case-publication';section.style.cssText='max-width:none;width:100%;box-sizing:border-box;padding:40px clamp(16px,3vw,48px)';section.append(el('span','case-kicker','UIST Adjunct 2025'),el('h2','','Research & Publication'),el('h3','',paper.title),el('p','',"Published at UIST Adjunct 2025, the paper documents the design process, system prototype and a pilot study with 10 participants aged 19–52. Initial interview feedback suggests increased interest in Silk Road mythology and cross-cultural connections; larger studies are needed to evaluate the impact more rigorously."));const link=el('a','case-document','Read paper ↗');link.href=paper.pdf;link.target='_blank';link.rel='noopener';const download=el('a','case-document','Download PDF');download.href=paper.pdf;download.download='Path-of-Light-UIST-2025.pdf';section.append(link,document.createTextNode(' · '),download);const frame=el('iframe');frame.src=paper.pdf+'#view=FitH&pagemode=none';frame.title=paper.title;frame.loading='lazy';frame.style.cssText='display:block;width:100%;height: min(80vh, 900px);min-height:420px;border:1px solid #ddd;margin-top:24px;border-radius:8px;background:white';const full=btn('Full screen ↗',async()=>{if(document.fullscreenElement){await document.exitFullscreen();return;}if(viewer.requestFullscreen){try{await viewer.requestFullscreen();}catch{window.open(paper.pdf,'_blank','noopener');}}else window.open(paper.pdf,'_blank','noopener');},'case-document');section.insertBefore(full,link);const viewer=el('div','path-paper-viewer');viewer.append(frame);section.append(viewer);article.append(section);chapters.append(btn('Research & Publication',()=>jump('case-publication')));}

 }
 if(mount){
  toolbar.remove();mount.append(root);
  const embedded=root.querySelector('.culture-embed');let visible=false;
  const controller=new AbortController();
  pauseCultureWhileScrolling(embedded,controller.signal);
  const notify=()=>{embedded?.contentWindow?.postMessage({type:'portfolio-preferences',lang:'zh',motion:document.body.classList.contains('reduce-motion')},location.origin);embedded?.contentWindow?.postMessage({type:'portfolio-culture-active',active:visible&&!document.hidden&&!document.body.classList.contains('project-suspended')},location.origin);};
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;notify();});
  if(embedded){observer.observe(embedded);embedded.addEventListener('load',notify,{signal:controller.signal});}
  document.addEventListener('visibilitychange',notify,{signal:controller.signal});
  document.addEventListener('portfolio-preferences',notify,{signal:controller.signal});
  return ()=>{observer.disconnect();controller.abort();featuredExhibitReader?.destroy();article.querySelector('#case-interview')?.disposeReveal?.();disposeFigma?.();root.remove();};
 }
 const win=createWindow({id,title:project.title+' — Full Project',content:root,width:Math.min(1380,innerWidth-40),height:innerHeight-130,className:'case-window',onMaximize:toggleFullscreen});
 if(win.existing){disposeFigma?.();return;}
 const shell=win.el,green=shell.querySelector('.maximize'),bar=shell.querySelector('.window-titlebar');
 bar.querySelector('.window-title').remove();bar.classList.add('case-unified-bar');bar.append(back,address);toolbar.remove();
 const edge=el('div','case-fullscreen-edge');edge.setAttribute('aria-hidden','true');shell.append(edge);
 const controller=new AbortController();let hideTimer;
 const cultureFrame=shell.querySelector('.culture-embed');
 pauseCultureWhileScrolling(cultureFrame,controller.signal);
 let frameVisible=false;
 const notifyCulture=()=>cultureFrame?.contentWindow?.postMessage({type:'portfolio-culture-active',active:frameVisible&&!shell.hidden&&!shell.classList.contains('inactive')&&!shell.classList.contains('minimizing')&&!document.hidden},location.origin);
 const frameObserver=cultureFrame?new IntersectionObserver(([entry])=>{frameVisible=entry.isIntersecting;notifyCulture();},{threshold:0}):null;
 if(cultureFrame){frameObserver.observe(cultureFrame);cultureFrame.addEventListener('load',()=>{notifyCulture();cultureFrame.contentWindow?.postMessage({type:'portfolio-preferences',lang:document.documentElement.lang==='zh-CN'?'zh':document.documentElement.lang,motion:document.body.classList.contains('reduce-motion')},location.origin);});}
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
 shell.addEventListener('window-closing',()=>{featuredExhibitReader?.destroy();article.querySelector('#case-interview')?.disposeReveal?.();disposeFigma?.();},{once:true});
 update();
 const url=new URL(location.href);url.hash='project='+project.id;history.replaceState(null,'',url);
 win.el.querySelector('.close').addEventListener('click',()=>{if(location.hash==='#project='+project.id)history.replaceState(null,'',location.pathname+location.search);});
}

