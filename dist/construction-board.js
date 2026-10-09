import {registerTranslations} from './localization.js';
import {constructionPhotos} from './construction-assets.js';

const stages=[['SITE SURVEY','初步勘探','2025.12 — 2026.01'],['INITIAL BUILD','初步搭建','2026.01 — 2026.03'],['DETAILING','细化搭建','2026.03 — 2026.04']];
const captions=[
 ['Existing interior','原建筑空间'],['Site conditions','现场条件'],['Open floor survey','开敞空间勘探'],['Wall and ceiling','墙面与天花'],['Existing gallery','原有展厅'],
 ['Demolition work','拆除施工'],['Interior construction','室内搭建'],['Partition framing','隔墙框架'],['Wall opening','墙体开口'],['Stair installation','楼梯安装'],['Scaffold assembly','脚手架搭建'],['Ceiling construction','天花施工'],['On-site build','现场搭建'],['Installation team','安装团队'],['Curved wall framing','弧形展墙搭建'],
 ['Material verification','材料核对'],['Feature wall installation','主题墙安装'],['Glass installation','玻璃安装'],['Screen detail','屏风细节'],['Signage installation','导视安装'],['Lighting test','灯光测试'],['Projection setup','投影调试'],['Media wall installation','媒体墙安装'],['Graphic panel installation','图文展板安装'],['Entrance detail','入口细节'],['Display panel','展示面板'],['Interior finishing','室内收口'],['Media testing','媒介测试'],['Lighting coordination','灯光协调'],['Ceiling detail','天花细节'],['Electrical coordination','电气协调'],['Material delivery','材料搬运'],['On-site coordination','现场协调']
];
registerTranslations([
 ['CONSTRUCTION','施工落地'],['Qi Culture Classics Center','齐文化典籍中心'],...stages.map(([en,zh])=>[en,zh]),...captions,
 ['MY ROLE','我的工作'],['On-site design · Material selection · Design coordination · Exhibition execution','设计驻地 · 材料选型 · 设计对接 · 展览执行'],
 ['33 SITE RECORDS','33 张现场记录'],['Click a photograph to view the original.','点击照片查看原图。'],['Scroll sideways to explore the timeline.','左右滑动浏览时间轴。'],
 ['Zoom out construction timeline','缩小施工时间轴'],['Zoom in construction timeline','放大施工时间轴'],['Reset construction view','还原施工视图'],
 ['Construction timeline','施工时间轴'],['NEXT / EXHIBIT DETAILS →','下一章 / 展项细节 →']
]);

// Base composition; project into a deeper 1920 × 1440 drawing space below.
const slots=[
 [68,255,255,260], [320,315,125,105], [48,595,158,175], [219,553,146,181], [360,765,115,90,'floor'],
 [373,453,99,122], [460,544,126,134], [600,372,103,153], [531,784,116,92], [817,198,145,166],
 [715,352,101,159], [866,701,100,111], [670,514,122,115], [940,418,112,100,'floor'], [593,259,121,122],
 [1283,187,120,107], [1139,144,150,207], [1008,292,113,105], [1368,287,117,130], [970,166,84,106],
 [1201,322,88,120], [1000,860,116,95,'floor'], [1367,529,128,136], [1248,519,113,157], [1099,657,125,159],
 [1110,555,120,95], [967,660,100,113], [997,490,102,85,'floor'], [1110,396,105,77,'floor'], [1332,705,133,167],
 [1298,392,112,118], [1408,169,90,68], [1080,115,58,72]
];
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const people=['assets/construction-people/standing.png','assets/construction-people/walking.png'];
function layout(index){
 const [x,y,w,h,plane]=slots[index];
 const depth=y>600?'front':y<420?'back':'middle';
 const size=index===0?1.35:depth==='front'?1.28:depth==='back'?.94:1.12;
 return {x:x*1.22+18,y:index===0?y*1.1+30:y*1.2+25+(depth==='front'?70:depth==='back'?-8:10),
  maxW:w*size,maxH:h*size,flat:plane==='floor',depth,
  slope:depth==='front'?-.42:depth==='back'?-.26:-.34};
}
const point=(u,v)=>[75+1.17*u+.83*v,1090-.37*u+.62*v];
const xy=p=>p.map(n=>n.toFixed(1)).join(',');
const line=(a,b,cls='')=>`<path class="${cls}" d="M${xy(a)} L${xy(b)}"/>`;
function ground(){
 let out='';
 for(let u=0;u<=1400;u+=100)out+=line(point(u,-700),point(u,280),u%400===0?'cd-grid-crosswise-solid':'cd-grid-crosswise');
 for(let v=-700;v<=280;v+=50)out+=line(point(0,v),point(1400,v),v%200===0?'cd-grid-major':'');
 return `<g class="cd-grid">${out}</g>`;
}
// All technical guides are drawn behind the photographs and share their projection.
function photoGuides(photo,index){
 const {x,y,maxW,maxH,flat,depth,slope}=layout(index);
 const scale=Math.min(maxW/photo.width,maxH/photo.height),w=photo.width*scale,h=photo.height*scale;
 const sideFacing=[10,29].includes(index);
 const left=flat?[x+.83*h,y+.62*h]:sideFacing?[x,y+h-w*.5]:[x,y+h];
 const right=flat?[left[0]+.94*w,left[1]-.37*w]:sideFacing?[x+.85*w,y+h+.02*w]:[x+w,y+h+w*slope];
 const lift=flat?20:depth==='back'?125:depth==='front'?82:105;
 const a=[left[0],Math.min(left[1]+lift,1315)],b=[right[0],Math.min(right[1]+lift,1315)];
 const offset=[36,27],c=[b[0]+offset[0],b[1]+offset[1]],d=[a[0]+offset[0],a[1]+offset[1]];
 const center=[(a[0]+b[0])/2+18,(a[1]+b[1])/2+13.5];
 const railSlope=600/1820;
 const t=(1150-railSlope*(center[0]-50)-center[1])/(.62+railSlope*.83);
 const rail=[center[0]+.83*t,center[1]+.62*t];
 const cross=p=>`${line([p[0]-4,p[1]],[p[0]+4,p[1]])}${line([p[0],p[1]-4],[p[0],p[1]+4])}`;
 return `<g class="cd-guide-set" aria-hidden="true">
  <g class="cd-guide-vertical">${line(left,a)}${line(right,b)}</g>
  <g class="cd-guide-footprint"><polygon points="${[a,b,c,d].map(xy).join(' ')}"/>${line(a,c)}${line(b,d)}</g>
  <g class="cd-guide-link">${line(center,rail)}<circle cx="${rail[0]}" cy="${rail[1]}" r="2.2"/></g>
  <g class="cd-guide-cross">${cross(a)}${cross(b)}</g>
 </g>`;
}
function frame(u,v,w,d,h){
 const corners=[point(u,v),point(u+w,v),point(u+w,v+d),point(u,v+d)];
 const roof=corners.map(([x,y])=>[x,y-h]);
 return `<g class="cd-frame"><polygon points="${corners.map(xy).join(' ')}"/><polygon points="${roof.map(xy).join(' ')}"/>${corners.map((p,i)=>line(p,roof[i])).join('')}</g>`;
}
function person(x,y,s=1,index=0){
 const height=52*s;
 return `<g class="cd-person" aria-hidden="true" transform="translate(${x*1.22+18} ${y*1.24+55})"><ellipse cx="4" cy="-1" rx="${height*.16}" ry="2"/><image href="${people[index%2]}" x="${-height/3}" y="${-height}" width="${height*2/3}" height="${height}"/></g>`;
}
function photoPanel(photo,index){
 const {x,y,maxW,maxH,flat,depth,slope}=layout(index);
 const scale=Math.min(maxW/photo.width,maxH/photo.height);
 const w=photo.width*scale,h=photo.height*scale;
 const sideFacing=[10,29].includes(index);
 const transform=flat?`matrix(.94 -.37 .83 .62 ${x} ${y})`:sideFacing?`matrix(.85 .52 0 1 ${x} ${y-w*.5})`:`matrix(1 ${slope} 0 1 ${x} ${y})`;
 const bottom=sideFacing?[x+w*.425,y+h-w*.24]:[x+w/2,y+h+w*slope/2];
 const floorY=Math.min(bottom[1]+(depth==='back'?125:depth==='front'?82:105),1320);
 const drop=flat?'':`${line(bottom,[bottom[0],floorY],'cd-drop')}<path class="cd-contact" d="M${bottom[0]-26},${floorY+8} l52,-16 l24,18 l-52,16 Z"/>`;
 const label=captions[index][0];
 const labelY=flat?y+h*.62+18:y+h+15;
 return `<g class="cd-record cd-depth-${depth}" data-source-id="${photo.id}">${drop}
  <g class="cd-photo" role="button" tabindex="0" aria-label="${esc(label)}" data-photo-index="${index}" transform="${transform}">
   <title>${esc(label)}</title><rect class="cd-photo-back" width="${w}" height="${h}"/>
   <image href="${photo.preview}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>
   <rect class="cd-photo-border" width="${w}" height="${h}"/>
  </g>
  <text class="cd-photo-id" x="${x}" y="${labelY}">${photo.id}</text>
 </g>`;
}
function annotation(x,y,toX,toY,text){
 return `<g class="cd-annotation">${line([x,y+9],[toX,toY])}<text x="${x}" y="${y}">${esc(text)}</text></g>`;
}
function drawBoard(){
 const railStart=[50,1150],railEnd=[1870,550];
 let ticks='';
 for(let i=0;i<=100;i++){
  const x=railStart[0]+(railEnd[0]-railStart[0])*i/100,y=railStart[1]+(railEnd[1]-railStart[1])*i/100;
  ticks+=line([x,y],[x-3,y-5]);
 }
 const stageMarkup=stages.map(([title,,date],i)=>{
  const x=[65,690,1325][i];
  return `<g class="cd-stage"><path d="M${x} 1355 H${x+530}"/><circle cx="${x}" cy="1355" r="3"/><text class="cd-stage-number" x="${x}" y="1390">0${i+1}</text><text class="cd-stage-title" x="${x+43}" y="1388">${title}</text><text class="cd-stage-date" x="${x+43}" y="1415">${date}</text></g>`;
 }).join('');
 return `<svg class="cd-canvas" viewBox="0 0 1920 1440" xmlns="http://www.w3.org/2000/svg" aria-label="Construction timeline">
 <defs><clipPath id="cd-ground-clip"><rect x="22" y="125" width="1876" height="1203"/></clipPath></defs>
 <text class="cd-title" x="40" y="45">CONSTRUCTION</text><text class="cd-subtitle" x="40" y="72">Qi Culture Classics Center</text><text class="cd-page" x="1865" y="45">06</text>
 <g clip-path="url(#cd-ground-clip)">${ground()}
 ${[[280,-380,160,85,60],[650,-370,170,90,110],[820,-360,70,70,150],[1170,-220,140,65,80],[350,-280,10,10,90],[600,-200,12,12,130],[1000,-380,10,10,115],
 [270,-120,180,70,65],[440,-180,95,60,110],[760,-130,130,80,80],[1080,-100,150,75,110],[620,110,160,60,70],[1120,130,140,75,85]].map(args=>frame(...args)).join('')}
 ${constructionPhotos.map(photoGuides).join('')}
 <g class="cd-stage-guides">${[65,690,1325].map(x=>{const y=1150-(x-50)*600/1820;return `${line([x,y],[x,1340])}<circle cx="${x}" cy="${y}" r="4"/>${line([x-7,1339],[x+7,1339])}`;}).join('')}</g></g>
 <g class="cd-rail">${line(railStart,railEnd)}${line([68,1175],[1888,575],'cd-rail-secondary')}${ticks}<path d="M57 1143 L50 1150 L61 1149 M1861 549 L1870 550 L1864 558"/></g>
 ${[[125,726,1.15],[204,514,.8],[380,707,1.1],[487,501,.8],[591,664,1],[667,581,.85],[799,864,1.2],[929,400,.7],[1054,622,.9],[1105,295,.65],[1270,774,1.1],[1450,425,.75]].map((args,i)=>person(...args,i)).join('')}
 ${constructionPhotos.map(photoPanel).join('')}
 ${annotation(175,171,175,277,'Existing interior')}${annotation(475,211,475,358,'Site conditions')}${annotation(740,172,740,296,'Curved wall framing')}${annotation(1040,110,1040,230,'Stair installation')}${annotation(1425,102,1425,171,'Feature wall installation')}${annotation(1650,130,1650,216,'Material verification')}
 ${stageMarkup}
 </svg>`;
}
export function createConstructionTimeline(openImage){
 const section=document.createElement('section');section.className='cd-section';section.id='case-delivery';
 section.setAttribute('aria-label','Construction timeline');
 section.innerHTML=`<h2 class="cd-sr-only">CONSTRUCTION</h2>
  <div class="cd-toolbar"><span>33 SITE RECORDS</span><span class="cd-help">Click a photograph to view the original.</span><div class="cd-controls"><button type="button" data-zoom="out" aria-label="Zoom out construction timeline">−</button><button type="button" data-zoom="reset" aria-label="Reset construction view">100%</button><button type="button" data-zoom="in" aria-label="Zoom in construction timeline">+</button></div></div>
  <p class="cd-mobile-hint">Scroll sideways to explore the timeline.</p>
  <div class="cd-viewport" tabindex="0" role="region" aria-label="Construction timeline">${drawBoard()}</div>
  <footer class="cd-footer"><div><span class="cd-role-label">MY ROLE</span><span>On-site design · Material selection · Design coordination · Exhibition execution</span></div><a href="#case-exhibits">NEXT / EXHIBIT DETAILS →</a></footer>`;
 const gallery=constructionPhotos.map((photo,index)=>({src:photo.src,name:captions[index][0]}));
 section.querySelectorAll('[data-photo-index]').forEach(button=>{
  const open=()=>openImage(gallery,Number(button.dataset.photoIndex),'Construction & Delivery');
  button.addEventListener('click',open);
  button.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
 });
 let zoom=1;
 const viewport=section.querySelector('.cd-viewport');
 section.querySelectorAll('[data-zoom]').forEach(button=>button.addEventListener('click',()=>{
  zoom=button.dataset.zoom==='reset'?1:Math.max(1,Math.min(2,zoom+(button.dataset.zoom==='in'?.25:-.25)));
  viewport.style.setProperty('--cd-zoom',zoom);
  section.querySelector('[data-zoom="reset"]').textContent=Math.round(zoom*100)+'%';
  section.querySelector('[data-zoom="out"]').disabled=zoom===1;
  section.querySelector('[data-zoom="in"]').disabled=zoom===2;
  if(zoom===1)viewport.scrollLeft=0;
 }));
 section.querySelector('[data-zoom="out"]').disabled=true;
 section.querySelector('.cd-footer a').addEventListener('click',event=>{event.preventDefault();section.parentElement?.querySelector('#case-exhibits')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'});});
 return section;
}

