import {createSpatialDiagram} from './spatial-diagram.js';
import {createSpatialDiagram2} from './spatial-diagram2.js';
import {registerTranslations,localizeText} from './localization.js';
import {traditional} from './chinese-traditional.js';
import {createExhibitReader} from './project-exhibit-reader.js';

const copy=[
 ['SPATIAL DESIGN','空间设计'],
 ['From field research to a spatial narrative','从实地调研，走向空间叙事'],
 ['The previous chapter brings together the museum’s communication needs and the conditions of the existing site. Here, cultural stories are arranged into a connected sequence, then placed within the circular building to establish transitions, pauses and moments of participation.','承接上一页的馆方需求与现场调研，先将文化故事组织成连贯的参观线索，再结合圆形建筑的现有条件，安排内容的位置、衔接、停留与参与方式。'],
 ['FIRST FLOOR / SPATIAL COMPOSITION','一层 / 空间与展项编排'],
 ['Enlarge spatial diagram','放大空间图'],
 ['Close spatial diagram','关闭空间图'],
 ['Fit to screen','适应屏幕'],
 ['Zoom in','放大'],['Zoom out','缩小'],
 ['Enlarge to read the exhibit labels. Drag the scrollbars or swipe to explore.','放大后可阅读展项标注，滑动查看空间细节。'],
 ['A continuous narrative, distinct experiences','叙事相连，体验各有侧重'],
 ['Content threads','内容线索'],['Spatial rhythm','空间节奏'],['Media placement','媒介落位'],
 ['Talent and achievement, openness, adaptation, and commerce recur across the stories. They provide connected ways of reading Qi culture throughout the exhibition.','尊贤尚功、包容开放、务实应变与工商兴业交织于不同故事，成为贯穿展览的内容线索。'],
 ['The lobby introduces the experience; the preface hall establishes its cultural context; the first unit unfolds through people, choices and events. The circular arrangement connects these episodes into a legible journey.','前厅建立感知，序厅引入文化背景，第一单元通过人物、选择与事件展开故事。同心圆结构将这些片段串联为层次清晰的参观体验。'],
 ['Mirror spaces, digital sand tables, projections and conversations offer different encounters with the same cultural narrative. Their placement considers circulation and the separation of light, sound and visitor activity.','镜厅、数字沙盘、投影与对话提供不同的故事入口；结合动线以及光、声与停留的相互影响，安排各展项的位置与衔接。'],
 ['THE COMPLETE EXHIBITION SEQUENCE','整体展览序列'],
 ['Lobby','前厅'],['Preface hall','序厅'],['01 / The Spirit of Qi','第一单元 / 泱泱齐风'],['02 / The Broad Thoroughfare','第二单元 / 康庄之衢'],['03 / The Historical Record','第三单元 / 皇皇史册'],['04 / Across Past and Present','第四单元 / 贯烁古今'],
 ['The diagram above details the first floor: the lobby, preface hall and first unit.','上图展开一层的前厅、序厅与第一单元。'],
 ['NEXT / CONSTRUCTION & DELIVERY →','下一章 / 施工与落地 →']
];
registerTranslations(copy);
// The drawing has authored bilingual typography; switch its labels as a unit so
// the global text observer does not rewrite fixed-position labels piecemeal.
const diagramEnglish={
 '返祖现象':'ATAVISM','落地案例 齐文化典籍中心':'QI CULTURE CLASSICS CENTER',
 '以圆为脉，叙齐韵千年':'Circles connect a millennium of Qi',
 "Circles as the Vein, Chronicles Qi's Millennium Grace":'Spatial narrative / First floor',
 '前厅 天齐渊':'Lobby · Tianqiyuan','天齐渊':'Tianqiyuan','沉浸式天气模拟展厅':'Immersive weather simulation',
 '齐之为齐':'What makes Qi, Qi','光影镜厅空间':'Immersive mirror hall',
 '因其俗，简其礼':'Adapt customs, simplify rites','数字交互长屏':'Interactive panoramic screen',
 '人民多归齐':'People gather in Qi','数字孪生沙盘':'Digital twin sand table',
 '一乘者有食':'Hospitality for merchants','沉浸式光影立柱':'Immersive projection columns',
 '九合诸侯':'The assembly of rulers','三折幕投影空间':'Three-sided projection space',
 '齐事成语':'Stories and idioms of Qi','双屏协同互动':'Coordinated dual-screen interaction',
 '晏子说':'A conversation with Yan Zi','可交互对话型数字人':'Conversational digital character',
 '孔子适齐':'Confucius visits Qi','圆环形灯箱展示':'Circular lightbox display',
 '序厅':'Preface','第一单元':'Unit 01','泱泱齐风':'The Spirit of Qi',
 '面刺寡人之过':'Speaking truth to the king','高清数字环幕':'Panoramic digital screen',
 '以“同心圆”空间为核心的数字展项设计':'Digital exhibits within a concentric spatial layout',
 '各展项脉络互联互通，空间运行相互独立、互不干涉':'Connected stories; distinct spaces and experiences'
};
const secondaryNodes=['272:704','272:707','272:743','272:748','272:749','272:766','272:767'];
const secondSecondaryNodes=['272:500','272:503','272:544','272:545','272:548','272:592','272:593'];
Object.assign(diagramEnglish,{
 '光栅灯箱':'Lenticular lightbox',
 '第二单元':'Unit 02','康庄之衢':'The Broad Thoroughfare','第三单元':'Unit 03','皇皇史册':'The Historical Record','第四单元':'Unit 04','贯烁古今':'Across Past and Present',
 '典籍阅读区':'Classics reading','盲盒式交互抽屉':'Interactive discovery drawers','古今诵读区':'Reading across time','CAVE沉浸式体验空间':'Immersive CAVE experience',
 '诸子时代':'The age of philosophers','三角灯箱展示区':'Triangular lightbox displays','齐风民俗':'Folk traditions of Qi','灯箱装饰型休息区':'Lightbox seating area',
 '一印千年':'Impressions across time','非遗拓印体验':'Traditional rubbing experience','孙子兵法':'The Art of War','VR虚拟现实体验':'Virtual reality experience',
 '甘石星经':'The star catalogue of Gan and Shi','实体艺术装置体验':'Physical art installation','医脉千年':'A millennium of medicine','平面展板展示':'Interpretive display panels',
 '考工记 齐民要术':'Craft and agriculture classics','可交互数字古窗':'Interactive digital windows','百工传薪':'Crafts across generations','灯箱阵列展示空间':'Lightbox array',
 '聊斋魔盒':'Liaozhai magic box','可交互数字魔盒':'Interactive digital box','齐国蹴鞠':'Cuju in Qi','Kinect体感互动':'Kinect motion interaction','烧烤特色区':'Local barbecue culture','DIY定制化数字打印体验':'Custom digital printing',
 '展厅内总计95分钟的数字资产':'95 minutes of digital content throughout the museum',
 '搭配艺术装置与装饰灯箱，构建简约精致、内涵丰富的展陈结构':'Art installations and lightboxes create a layered exhibition.'
});
registerTranslations([
 ['SECOND FLOOR / SPATIAL COMPOSITION','二层 / 空间与展项编排'],
 ['The two diagrams connect the lobby and first unit on the first floor with units two to four on the second floor.','两张空间图共同呈现由一层前厅、序厅与第一单元，延续至二层第二至第四单元的整体编排。']
]);
const secondExhibits=[
 ['481:362','康庄之衢','光栅灯箱'],
 ['549','典籍阅读区','盲盒式交互抽屉'],['550','古今诵读区','CAVE沉浸式体验空间'],['555','诸子时代','三角灯箱展示区'],['558','齐风民俗','灯箱装饰型休息区'],
 ['561','一印千年','非遗拓印体验'],['564','孙子兵法','VR虚拟现实体验'],['567','甘石星经','实体艺术装置体验'],['570','医脉千年','平面展板展示'],
 ['571','考工记 齐民要术','可交互数字古窗'],['576','百工传薪','灯箱阵列展示空间'],['579','聊斋魔盒','可交互数字魔盒'],['582','齐国蹴鞠','Kinect体感互动'],['585','烧烤特色区','DIY定制化数字打印体验']
];
const exhibits=[
 ['750','天齐渊','沉浸式天气模拟展厅'],['751','齐之为齐','光影镜厅空间'],
 ['752','因其俗，简其礼','数字交互长屏'],['753','人民多归齐','数字孪生沙盘'],
 ['754','一乘者有食','沉浸式光影立柱'],['755','九合诸侯','三折幕投影空间'],
 ['756','齐事成语','双屏协同互动'],['757','晏子说','可交互对话型数字人'],
 ['758','孔子适齐','圆环形灯箱展示'],['761','面刺寡人之过','高清数字环幕']
];
registerTranslations([['Select a white point to explore the exhibit, photographs and story.','点击白色节点，查看展项介绍与照片。']]);
function prepareDiagram(onSelect=()=>{},floor=1,onOpen=()=>{}){
 const drawing=floor===1?createSpatialDiagram():createSpatialDiagram2();drawing.classList.add('sp-drawing');drawing.dataset.floor=floor;
 const floorExhibits=floor===1?exhibits:secondExhibits;
 if(floor===1){const visitors=document.createElement('img');visitors.className='sp-visitor-overlay';visitors.src='assets/spatial-design/visitor-silhouettes.png';visitors.alt='';visitors.setAttribute('aria-hidden','true');visitors.loading='lazy';visitors.decoding='async';visitors.draggable=false;drawing.append(visitors);}
 const labels=[...drawing.querySelectorAll('p')].map(node=>({node,source:node.textContent.trim(),host:node.hasAttribute('data-node-id')?node:node.parentElement}));
 let selected=null;
 const pointButtons=floorExhibits.map(([id,title,medium],index)=>{
  const point=drawing.querySelector(`[data-node-id="${id.includes(':')?id:'272:'+id}"]`),button=document.createElement('button');
  button.type='button';button.className='sp-point';button.setAttribute('aria-pressed','false');
  const exhibitId=floor===1?(index===0?'lobby':index===1?'preface':String(index-1).padStart(2,'0')):String(index+9).padStart(2,'0');
  button.dataset.exhibit=exhibitId;button.setAttribute('aria-haspopup','dialog');
  button.onclick=()=>{selected=[title,medium];for(const other of pointButtons)other.setAttribute('aria-pressed',String(other===button));translate();onOpen(exhibitId,button);};
  point.append(button);return button;
 });
 function translate(){
  const english=document.documentElement.lang==='en',hant=document.documentElement.lang==='zh-Hant';
  drawing.dataset.language=english?'en':'zh';
  for(const {node,source,host} of labels){
   let text=english?(diagramEnglish[source]||source):source;
   if(source.startsWith('Circles as'))text=english?`Spatial narrative / ${floor===1?'First':'Second'} floor`:`空间叙事 / ${floor===1?'一':'二'}层`;
   if(!english){if(source===' QI CULTURE'.trim()||source==='QI CULTURE')text='齐文化';if(source==='classic center')text='典籍中心';}
   node.textContent=hant?[...text].map(c=>traditional[c]||c).join(''):text;
   host.classList.toggle('sp-translated-label',english&&Boolean(diagramEnglish[source]));
  }
  for(const id of floor===1?secondaryNodes:secondSecondaryNodes)drawing.querySelector(`[data-node-id="${id}"]`)?.classList.add('sp-secondary-label');
  const display=text=>english?(diagramEnglish[text]||text):hant?[...text].map(c=>traditional[c]||c).join(''):text;
  pointButtons.forEach((b,i)=>b.setAttribute('aria-label',display(floorExhibits[i][1])+' · '+display(floorExhibits[i][2])));
  if(selected)onSelect(selected.map(display).join(' · '));
 }
 translate();return {drawing,translate};
}
export function createSpatialDesign(){
 const section=document.createElement('section');section.id='case-narrative';section.className='spatial-page';
 section.innerHTML=`<header class="sp-masthead"><span>WIND FROM THE EAST</span><i></i><b>PAGE 05</b><span>SPATIAL DESIGN</span></header>
 <div class="sp-intro"><h2>From field research to a spatial narrative</h2><p>The previous chapter brings together the museum’s communication needs and the conditions of the existing site. Here, cultural stories are arranged into a connected sequence, then placed within the circular building to establish transitions, pauses and moments of participation.</p></div>
 ${[1,2].map(floor=>`<section class="sp-floor" data-floor="${floor}"><div class="sp-diagram-tools"><span>${floor===1?'FIRST':'SECOND'} FLOOR / SPATIAL COMPOSITION</span><button type="button" class="sp-enlarge">Enlarge spatial diagram</button></div><figure class="sp-figure"><div class="sp-diagram" data-no-localize></div><p class="sp-exhibit-caption" aria-live="polite" data-no-localize></p><figcaption>Enlarge to read the exhibit labels. Drag the scrollbars or swipe to explore.</figcaption></figure></section>`).join('')}
 <section class="sp-reading"><h3>A continuous narrative, distinct experiences</h3><div>${[0,1,2].map(i=>`<article><span>0${i+1}</span><h4>${copy[11+i][0]}</h4><p>${copy[14+i][0]}</p></article>`).join('')}</div></section>
 <section class="sp-sequence"><h3>THE COMPLETE EXHIBITION SEQUENCE</h3><ol>${copy.slice(18,24).map(([en])=>`<li>${en}</li>`).join('')}</ol><p>The two diagrams connect the lobby and first unit on the first floor with units two to four on the second floor.</p></section>
 <footer class="sp-footer"><span>QI CULTURE CLASSICS CENTER</span><a href="#case-delivery">NEXT / CONSTRUCTION & DELIVERY →</a></footer>`;
 const reader=createExhibitReader();
 const cleanups=[()=>reader.destroy()];
 for(const block of section.querySelectorAll('.sp-floor')){
 const floor=Number(block.dataset.floor);
 const frame=block.querySelector('.sp-diagram'),caption=block.querySelector('.sp-exhibit-caption');let chosen=false;
 const diagram=prepareDiagram(text=>{chosen=true;caption.textContent=text;},floor,reader.open);frame.append(diagram.drawing);
 caption.textContent=localizeText('Select a white point to explore the exhibit, photographs and story.');
 const resize=new ResizeObserver(()=>{diagram.drawing.style.transform=`scale(${frame.clientWidth/3840})`;});resize.observe(frame);
 let viewer=null;
 const update=()=>{diagram.translate();viewer?.translate();if(!chosen)caption.textContent=localizeText('Select a white point to explore the exhibit, photographs and story.');};
 document.addEventListener('portfolio-preferences',update);
 block.querySelector('.sp-enlarge').onclick=()=>{
  if(viewer)return;
  const dialog=document.createElement('dialog');dialog.className='sp-viewer';dialog.setAttribute('aria-label',localizeText('Enlarge spatial diagram'));
  dialog.innerHTML='<header><strong>'+ (floor===1?'FIRST':'SECOND')+' FLOOR / SPATIAL COMPOSITION</strong><div><button type="button" data-action="out" aria-label="Zoom out">−</button><button type="button" data-action="fit">Fit to screen</button><button type="button" data-action="in" aria-label="Zoom in">+</button><button type="button" data-action="close">Close spatial diagram</button></div></header><div class="sp-pan" tabindex="0"><div class="sp-zoom-canvas sp-diagram" data-no-localize></div></div>';
  const detailCaption=document.createElement('p');detailCaption.className='sp-exhibit-caption';detailCaption.setAttribute('data-no-localize','');detailCaption.setAttribute('aria-live','polite');dialog.append(detailCaption);
  const detail=prepareDiagram(text=>{detailCaption.textContent=text;},floor,reader.open),canvas=dialog.querySelector('.sp-zoom-canvas'),pan=dialog.querySelector('.sp-pan');canvas.append(detail.drawing);
  const trigger=block.querySelector('.sp-enlarge');let zoom=1;
  function fit(){const width=pan.clientWidth*zoom;canvas.style.width=width+'px';canvas.style.height=width*2160/3840+'px';detail.drawing.style.transform=`scale(${width/3840})`;dialog.querySelector('[data-action="out"]').disabled=zoom<=1;dialog.querySelector('[data-action="in"]').disabled=zoom>=6;}
  function close(){observer.disconnect();dialog.close();dialog.remove();viewer=null;trigger.focus({preventScroll:true});}
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.querySelector('header').onclick=e=>{const action=e.target.closest('button')?.dataset.action;if(!action)return;if(action==='close')return close();zoom=action==='fit'?1:Math.min(6,Math.max(1,zoom+(action==='in'?1:-1)));fit();};
  const observer=new ResizeObserver(fit);document.body.append(dialog);dialog.showModal();observer.observe(pan);fit();viewer={translate:detail.translate,close};
 };
 cleanups.push(()=>{resize.disconnect();document.removeEventListener('portfolio-preferences',update);viewer?.close();});
 }
 section.querySelector('.sp-footer a').onclick=e=>{e.preventDefault();section.parentElement.querySelector('#case-delivery')?.scrollIntoView({behavior:'instant',block:'start'});};
 // Window cleanup also stops observers when this chapter is off screen.
 requestAnimationFrame(()=>section.closest('.window')?.addEventListener('window-closing',()=>cleanups.forEach(cleanup=>cleanup()),{once:true}));
 return section;
}
