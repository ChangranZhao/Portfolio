import {traditional} from './chinese-traditional.js';

const media={
 'research-text-07':'assets/ganshi/research-text-07.webp',
 'research-text-08':'assets/ganshi/research-text-08.webp',
 'research-text-09':'assets/ganshi/research-text-09.webp',
 'research-chart-09':'assets/ganshi/research-chart-09.webp',
 'research-chart-10':'assets/ganshi/research-chart-10.webp',
 'reference-04':'assets/ganshi/reference-04.webp',
 'reference-05':'assets/ganshi/reference-05.webp',
 'atlas-15':'assets/ganshi/atlas-15.webp',
 'atlas-17':'assets/ganshi/atlas-17.webp',
 'atlas-18':'assets/ganshi/atlas-18.webp',
 'traced-star-groups':'assets/ganshi/traced-star-groups.png',
 'traced-star-combinations':'assets/ganshi/traced-star-combinations.png',
 'model-01':'assets/ganshi/model-01.webp',
 'model-02':'assets/ganshi/model-02.webp',
 'model-03':'assets/ganshi/model-03.webp',
 'model-05':'assets/ganshi/model-05.webp',
 'model-07':'assets/ganshi/model-07.webp',
 'model-workspace':'assets/ganshi/model-workspace.webp',
 'glass-build-01':'assets/ganshi/glass-build-01.webp',
 'glass-build-02':'assets/ganshi/glass-build-02.webp',
 'glass-build-03':'assets/ganshi/glass-build-03.webp',
 'water-particle-screen':'assets/ganshi/water-particle-screen.webp',
 'water-particle-output':'assets/ganshi/water-particle-output.webp',
 'water-simulation-screen':'assets/ganshi/water-simulation-screen.webp',
 'water-simulation-output':'assets/ganshi/water-simulation-output.webp',
 'water-site':'assets/ganshi/water-site.webp',
 'water-sky':'assets/ganshi/water-sky.webp',
 'bamboo-workspace':'assets/ganshi/bamboo-workspace.webp',
 'bamboo-output':'assets/ganshi/bamboo-output.webp',
 'outcome-01':'assets/ganshi/outcome-01.webp',
 'outcome-02':'assets/ganshi/outcome-02.webp',
 'outcome-03':'assets/ganshi/outcome-03.webp',
 'outcome-04':'assets/ganshi/outcome-04.webp',
 'outcome-05':'assets/ganshi/outcome-05.webp',
 'outcome-person':'assets/ganshi/outcome-person.webp',
 'glass-film':'assets/ganshi/glass-film.mp4',
 'final-film':'assets/ganshi/final-film.mp4',
 'water-sky-film':'assets/ganshi/water-sky-film.mp4',
 'water-interaction-film':'assets/ganshi/water-interaction-film.mp4'
};
const figma='https://www.figma.com/design/jYVYgsY7VL8qlxmNeQR1PD/%E7%94%98%E7%9F%B3%E6%98%9F%E7%BB%8F_%E7%94%A8%E4%BA%8E%E7%BD%91%E9%A1%B5%E5%88%B6%E4%BD%9C?node-id=1-2&m=dev';

export function createGanshiDetails(){
 let dialog=null,opener=null,mediaObserver=null;
 const t=(zh,en)=>{
  const lang=document.documentElement.lang;
  return lang==='en'?en:lang==='zh-Hant'?[...zh].map(char=>traditional[char]||char).join(''):zh;
 };
 const photo=(name,zh,en,cls='')=>`<button class="ex-gs-photo ${cls}" data-gs-asset="${media[name]}" type="button"><img src="${media[name]}" alt="${t(zh,en)}" loading="lazy"><span>${t(zh,en)} ↗</span></button>`;
 const head=(number,zh,en,subtitle)=>`<div class="ex-gs-section-head"><span>${number} / ${subtitle}</span><h3>${t(zh,en)}</h3></div>`;
 function dismissAsset(){dialog?.querySelector('.ex-asset-viewer')?.remove()}
 function showAsset(src,alt){
  dismissAsset();
  const viewer=document.createElement('div');viewer.className='ex-asset-viewer';viewer.setAttribute('role','dialog');viewer.setAttribute('aria-label',alt);viewer.tabIndex=-1;
  viewer.innerHTML=`<div class="ex-asset-bar"><span></span><button type="button" class="ex-gs-zoom"></button><button type="button" class="ex-gs-asset-close"></button></div><div class="ex-asset-stage"><img alt=""></div>`;
  viewer.querySelector('.ex-asset-bar span').textContent=alt;
  const image=viewer.querySelector('img');image.src=src;image.alt=alt;
  const zoom=viewer.querySelector('.ex-gs-zoom');zoom.textContent=t('原尺寸查看','View at full size');zoom.onclick=()=>{const active=viewer.classList.toggle('is-zoomed');zoom.textContent=t(active?'适应窗口':'原尺寸查看',active?'Fit to window':'View at full size')};
  const close=viewer.querySelector('.ex-gs-asset-close');close.textContent=t('返回展项 ×','Back to exhibit ×');close.onclick=dismissAsset;
  dialog.append(viewer);viewer.focus({preventScroll:true});
 }
 function close(){
  if(!dialog)return;
  mediaObserver?.disconnect();mediaObserver=null;
  dialog.querySelectorAll('video').forEach(video=>video.pause());dismissAsset();dialog.close();dialog.remove();dialog=null;
  if(opener?.isConnected)opener.focus({preventScroll:true});
 }
 function render(){
  if(!dialog)return;
  mediaObserver?.disconnect();mediaObserver=null;
  dialog.querySelectorAll('video').forEach(video=>video.pause());
  dialog.setAttribute('aria-label',t('展项详情 · 甘石星经','Exhibit details · The Star Catalogue of Gan and Shi'));
  dialog.innerHTML=`
   <header class="ex-window-bar"><span>${t('风从东方来 / 展项详情','WIND FROM THE EAST / EXHIBIT DETAILS')}</span><button class="ex-close" type="button">${t('关闭 ×','Close ×')}</button></header>
   <div class="ex-reader-body ex-gs-body">
    <section class="ex-gs">
     <header class="ex-hi-masthead"><span>WIND FROM THE EAST / QI CULTURE CLASSICS CENTER</span><span>${t('案例 02 · 甘石星经','CASE 02 · GAN SHI XING JING')}</span></header>
     <div class="ex-gs-hero">
      <div class="ex-gs-hero-copy"><span class="ex-hi-kicker">07 / EXHIBIT DETAILS · 02</span><h1>${t('甘石星经','THE STAR CATALOGUE\nOF GAN AND SHI')}</h1><p class="ex-gs-hero-en">FROM ANCIENT STAR RECORDS TO AN IMMERSIVE FIELD OF LIGHT</p><p>${t('以古代星官记载为线索，将文字、星图与空间中的十片玻璃连接起来。光在玻璃、水面和天幕间传递，让观众从阅读走向置身其中。','Ancient star records become a spatial sequence across ten glass panels. Light passes through glass, water and a projected sky, moving the visitor from reading to immersion.')}</p><div class="ex-gs-hero-index"><span>01—03 ${t('研究与定位','RESEARCH')}</span><span>04—07 ${t('转译与落地','TRANSLATION')}</span><span>08—09 ${t('交互与成果','EXPERIENCE')}</span></div></div>
      ${photo('outcome-01','落地空间总览','Completed installation','ex-gs-hero-image')}
     </div>
     <nav class="ex-gs-index" aria-label="${t('甘石星经案例模块','Gan Shi Xing Jing case sections')}">
      ${[['01',t('背景','Context')],['02',t('视觉参考','References')],['03',t('星图定位','Star atlas')],['04',t('描摹','Tracing')],['05',t('十片玻璃','Ten panels')],['06',t('空间预演','Preview')],['07',t('搭建与灯光','Fabrication')],['08',t('水与天幕','Water & sky')],['09',t('成果','Outcome')]].map(([id,label])=>`<button type="button" data-gs-jump="gs-${id}">${id} / ${label}</button>`).join('')}
     </nav>
     <div class="ex-gs-opening">
      <section id="gs-01" class="ex-gs-block ex-gs-context">${head('01', '从典籍开始', 'Beginning with the text', 'CULTURAL SOURCE')}
       <p>${t('研究首先回到《甘石星经》的星官记载：名称、相对方位与观测描述，成为后续图案和空间组织的依据。这里展示的是研究使用的文献图像；它们与后世星图分别承担“文本”和“定位”的角色。','The research begins with records of star groups—their names, relative positions and observational descriptions. These source pages inform the later visual language, while historical atlases serve separately as spatial references.')}</p>
       <div class="ex-gs-context-grid">${photo('research-text-07','典籍研究页 01','Classical source page 01')}${photo('research-text-08','典籍研究页 02','Classical source page 02')}${photo('research-text-09','典籍研究页 03','Classical source page 03')}</div>
      </section>
      <section id="gs-02" class="ex-gs-block ex-gs-reference">${head('02','先确定视觉方向','Testing a visual direction','VISUAL REFERENCE')}
       <p>${t('在进入玻璃与灯光设计之前，参考圆形天体图案、轨道和发光线条的视觉关系，试探黑白对比、图案密度与空间光感。参考图是形式研究，不作为古代星图的史料。','Before designing the glass and lighting, circular celestial motifs and luminous lines were used to test density, contrast and atmosphere. These are formal references, not historical evidence.')}</p>
       <div class="ex-gs-reference-grid">${photo('reference-04','星象视觉参考 01','Celestial visual reference 01')}${photo('reference-05','星象视觉参考 02','Celestial visual reference 02')}</div>
      </section>
     </div>
     <section id="gs-03" class="ex-gs-block ex-gs-atlas">${head('03','从星图寻找位置','Locating the stars','HISTORICAL ATLAS')}
      <div class="ex-gs-atlas-layout"><div class="ex-gs-atlas-copy"><p>${t('结合前期文本研究，选择可考的存世星图作为方位参照，再梳理图中星点、连线与星区的关系。此处的星图属于后世图像资料，用于设计定位，并不等同于《甘石星经》的原图。','Surviving historical atlases provide a positional reference for stars, links and regions. These later images guide the design mapping; they are not presented as the original illustrations of the ancient text.')}</p><div class="ex-gs-atlas-note"><b>TEXT → ATLAS → SPACE</b><span>${t('文字给出线索；星图帮助定位；空间承载观看。','Text provides the clues. Atlases assist orientation. Space makes the relationships visible.')}</span></div></div><div class="ex-gs-atlas-images">${photo('atlas-15','历史星图图像 01','Historical star atlas 01')}${photo('atlas-17','历史星图图像 02','Historical star atlas 02')}${photo('atlas-18','历史星图图像 03','Historical star atlas 03')}</div></div>
     </section>
     <div class="ex-gs-translation">
      <section id="gs-04" class="ex-gs-block">${head('04','描摹并重组星官','Tracing the star groups','VISUAL TRANSLATION')}
       <p>${t('依据典籍与星图的关系描摹星点，再把线与圆环转为适合玻璃表面呈现的图案语言。下方展示原始描摹与重组的星官线稿。','Star positions and relationships were traced, then translated into lines and concentric marks suited to glass. The original traced and recomposed artwork appears below.')}</p>
       ${photo('traced-star-groups','星官图案描摹与处理原图','Original traced and recomposed star groups','ex-gs-wide-photo ex-gs-tracing-photo')}
       <a class="ex-gs-figma" href="${figma}" target="_blank" rel="noopener noreferrer">${t('查看 Figma 描摹原稿 ↗','View the traced artwork in Figma ↗')}</a>
      </section>
      <section id="gs-05" class="ex-gs-block">${head('05','把图案分配到十片玻璃','Mapping across ten glass panels','SPATIAL PLACEMENT')}
       <p>${t('描摹后的星点与平面位置对位，分配到十片玻璃。下方并置重组图案和更新后的空间预演：单片上可以读到局部星官，穿过多片玻璃又形成更密的星空。','The traced positions are assigned across ten glass panels. The recomposed artwork sits beside the updated spatial preview: each panel carries a local group, while multiple layers form a denser field of stars.')}</p>
       <div class="ex-gs-ten"><strong>10</strong><span>${t('片玻璃 / 十个承载单元','GLASS PANELS / TEN VISUAL UNITS')}</span></div>
       <div class="ex-gs-mapping-grid">${photo('traced-star-combinations','星官图案重组','Recomposed star groups')}${photo('model-03','玻璃图案空间对位','Glass pattern placement in space')}</div>
      </section>
     </div>
     <section id="gs-06" class="ex-gs-block ex-gs-preview">${head('06','在空间中预演','Testing the spatial sequence','3D MODEL PREVIEW')}
      <p>${t('将导出的图案放入三维场景，从入口、正面、侧向和近距离四种视角检查玻璃的穿透关系、光线强弱及中央装置的位置。','The exported patterns were placed in a 3D scene to inspect transparency, light density and the central installation from frontal, oblique and close-up viewpoints.')}</p>
      <div class="ex-gs-preview-grid">${photo('model-01','正面空间预演','Frontal spatial preview','ex-gs-preview-main')}${photo('model-03','侧向空间预演','Oblique spatial preview')}${photo('model-02','中央水槽与玻璃近景','Central water installation and glass detail')}${photo('model-workspace','Blender 空间预演工程画面','Blender spatial preview workspace')}${photo('model-07','入口侧空间预演','Entrance-side spatial preview')}</div>
     </section>
     <section id="gs-07" class="ex-gs-block ex-gs-build">${head('07','玻璃搭建与灯光编程','Building glass and programming light','FABRICATION / LIGHT')}
      <div class="ex-gs-build-layout"><div><p>${t('现场将带图案的玻璃逐片安装、校准与布光。施工记录与落地照片并置，说明图案从三维预演进入真实尺度后的层次变化。','The patterned glass was installed, aligned and lit on site. Construction records sit beside the completed room, making the transition from model to full scale visible.')}</p><div class="ex-gs-build-label"><span>01 / ${t('安装玻璃','GLASS ASSEMBLY')}</span><span>02 / ${t('调试光效','LIGHT PROGRAMMING')}</span><span>03 / ${t('落地核对','ON-SITE REVIEW')}</span></div></div><div class="ex-gs-build-images">${photo('glass-build-01','玻璃安装现场','Glass installation on site')}${photo('glass-build-02','装置安装细节','Installation detail')}${photo('glass-build-03','落地光效检查','Completed lighting review')}</div></div>
     </section>
     <section id="gs-08" class="ex-gs-block ex-gs-water">${head('08','让水面把星光送向天幕','Water carries the stars upward','WATER / SKY PROJECTION')}
      <div class="ex-gs-water-why"><b>${t('为什么选择水作为影像媒介？','WHY WATER AS THE IMAGE MEDIUM?')}</b><p>${t('静水如镜，让星光有了可被观看的倒影；水波则会随着观众的敲击改变光的折射与反射。它既是把水下投影送向天幕的光学界面，也在概念上连接古代观星的想象与当代观众的参与。固定的星图因此成为会随动作变化的画面。','Still water acts as a mirror for the stars; ripples created by a visitor alter how light refracts and reflects. The surface is both the optical link between the underwater projection and the sky above, and a conceptual bridge between historical sky watching and present-day participation. A fixed star map becomes an image changed by action.')}</p></div>
      <p>${t('中央水槽两端的敲击激起水波，波纹在水面相遇；水下投影经水面折射与反射，向上进入天幕画面。下方并置工程截图、影像输出与现场记录。','Strikes at either end of the central pool create intersecting ripples. Underwater projection is refracted and reflected toward the overhead sky. Engineering views, image outputs and on-site records appear together below.')}</p>
      <div class="ex-gs-water-grid"><div class="ex-gs-water-diagram"><span class="ex-gs-diagram-title">${t('交互与光路示意','INTERACTION / LIGHT PATH')}</span><div class="ex-gs-sky">${t('天幕影像','SKY PROJECTION')}</div><div class="ex-gs-light">↑ &nbsp; ↑ &nbsp; ↑</div><div class="ex-gs-surface"><i></i><span>${t('敲击 → 水波相遇 → 折射 / 反射','STRIKE → RIPPLE → REFRACTION / REFLECTION')}</span><i></i></div><div class="ex-gs-projector">${t('水下投影光源','PROJECTOR BENEATH WATER')} ↑</div><small>${t('示意图表达作品关系，不代表设备施工尺寸。','Concept diagram, not a measured installation drawing.')}</small></div><div class="ex-gs-water-images">${photo('water-particle-output','人物粒子影像效果','Particle figure output')}${photo('water-simulation-output','实时水面影像效果','Live water simulation output')}${photo('water-particle-screen','人物粒子系统工程画面','Particle system project view')}${photo('water-simulation-screen','水面实时模拟工程画面','Water simulation project view')}</div></div>
      <div class="ex-gs-water-site">${photo('water-site','观众敲击与水面投影现场','Visitor interaction with the water projection')}${photo('water-sky','水面映射到天幕的现场效果','Water image mapped to the sky ceiling')}${photo('bamboo-output','竹简展开的影像输出','Bamboo-slip image output')}${photo('bamboo-workspace','竹简展开的工程画面','Bamboo-slip animation workspace')}</div>
      <div class="ex-gs-film-grid"><figure class="ex-gs-video"><video controls autoplay muted loop preload="none" playsinline poster="${media['water-site']}"><source src="${media['water-interaction-film']}" type="video/mp4"></video><figcaption>${t('水槽交互现场 / 静音自动循环','Water interaction on site / muted loop')}</figcaption></figure><figure class="ex-gs-video"><video controls autoplay muted loop preload="none" playsinline poster="${media['water-sky']}"><source src="${media['water-sky-film']}" type="video/mp4"></video><figcaption>${t('水面光影映射至天幕 / 静音自动循环','Water light mapped to the ceiling / muted loop')}</figcaption></figure></div>
     </section>
     <section id="gs-09" class="ex-gs-block ex-gs-outcome">${head('09','最终空间','The completed installation','OUTCOME')}
      <p>${t('星官图案在玻璃上叠合，中央装置与空间影像形成同一观看场域。以下为现场照片和视频记录。','Constellation marks overlap across glass while the central installation and projected light create a shared field of view. The photographs and short video document the completed space.')}</p>
      <div class="ex-gs-outcome-grid">${photo('outcome-01','甘石星经落地空间全景 01','Completed space, view 01','ex-gs-outcome-main')}${photo('outcome-02','甘石星经落地空间全景 02','Completed space, view 02')}${photo('outcome-person','观众与中央水槽的互动','Visitor interacting with the central pool')}${photo('outcome-04','星官图案近景','Constellation pattern detail')}${photo('outcome-05','灯光与投影的空间效果','Lighting and projection on site')}</div>
      <div class="ex-gs-film-grid"><figure class="ex-gs-video"><video controls autoplay muted loop preload="none" playsinline poster="${media['outcome-01']}"><source src="${media['final-film']}" type="video/mp4"></video><figcaption>${t('最终空间效果 / 静音自动循环','Final installation / muted loop')}</figcaption></figure><figure class="ex-gs-video"><video controls autoplay muted loop preload="none" playsinline poster="${media['outcome-person']}"><source src="${media['glass-film']}" type="video/mp4"></video><figcaption>${t('玻璃光影效果 / 静音自动循环','Glass and light sequence / muted loop')}</figcaption></figure></div>
     </section>
     <footer class="ex-gs-source">${t('素材来源：项目研究页、建模预演、施工记录与落地照片；水槽互动说明据《甘石星经装置解释》整理。','Sources: project research, 3D previews, installation records and completed photographs. Water interaction text is adapted from the supplied installation notes.')}</footer>
    </section>
   </div>
   <footer class="ex-reader-footer ex-gs-footer"><button type="button" class="ex-gs-back">${t('← 返回第 7 页','← Back to page 7')}</button><span>02 / ${t('甘石星经','GAN SHI XING JING')}</span></footer>`;
  dialog.querySelector('.ex-close').onclick=close;
  dialog.querySelector('.ex-gs-back').onclick=close;
  dialog.querySelectorAll('[data-gs-asset]').forEach(button=>button.onclick=()=>{const image=button.querySelector('img');showAsset(button.dataset.gsAsset,image.alt)});
  mediaObserver=new IntersectionObserver(entries=>entries.forEach(({target,intersectionRatio})=>{
   if(intersectionRatio>=0.45&&dialog?.open)target.play().catch(()=>{});
   else target.pause();
  }),{root:dialog.querySelector('.ex-gs-body'),threshold:[0,0.45]});
  dialog.querySelectorAll('video').forEach(video=>mediaObserver.observe(video));
  dialog.querySelectorAll('[data-gs-jump]').forEach(button=>button.onclick=()=>dialog.querySelector('#'+button.dataset.gsJump).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'}));
 }
 function open(trigger){
  opener=trigger;
  if(!dialog){dialog=document.createElement('dialog');dialog.className='ex-reader ex-gs-reader';dialog.setAttribute('data-no-localize','');dialog.addEventListener('cancel',event=>{event.preventDefault();if(dialog.querySelector('.ex-asset-viewer'))dismissAsset();else close()});document.body.append(dialog);render();dialog.showModal()}
  else{render();dialog.querySelector('.ex-reader-body').scrollTop=0}
 }
 const onPreferences=()=>{if(dialog)render()};document.addEventListener('portfolio-preferences',onPreferences);
 return {open,close,destroy(){close();document.removeEventListener('portfolio-preferences',onPreferences)}};
}
