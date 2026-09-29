import {registerTranslations} from './localization.js';

registerTranslations([
 ['CONSTRUCTION / FROM PLAN TO PLACE','施工落地 / 从图纸到现场'],
 ['FROM DRAWINGS TO BUILT SPACE.','从设计图到建成空间'],
 ['Three stages of construction move from reading the existing shell, through spatial build-out, to exhibit-level refinement. The dates describe project phases, not the timestamps of individual photographs.','搭建过程分为三个阶段：先辨认原建筑的现场条件，再完成空间搭建，最后细化单个展项。日期标示项目阶段，并非每张照片的拍摄时间。'],
 ['01 / EARLY SITE SURVEY','01 / 初步勘探'],['02 / INITIAL BUILD-OUT','02 / 初步搭建'],['03 / EXHIBIT REFINEMENT','03 / 细化搭建'],
 ['READ THE EXISTING SHELL','读懂原有建筑'],['TRANSLATE THE PLAN ON SITE','将平面图落实到现场'],['RESOLVE EACH EXHIBIT','逐一细化展项'],
 ['Demolition exposed the original building. We checked the drawings against the open floor, columns and circulation before locating the new exhibition zones.','拆除后重新辨认原建筑的开敞空间、柱网与动线，将设计平面图和现场条件逐一对照，确定展区位置。'],
 ['After clearing the space, construction followed the design plan: partitions, curved enclosures and routes began to define the visitor journey.','清理后的空间按设计平面图推进，隔墙、弧形界面和通行路径逐渐形成参观动线。'],
 ['With the main spatial structure in place, the work moved to individual installations, surface details, lighting and media checks.','空间主体完成后，工作转向单个装置、界面细节、灯光与数字媒介的现场核对。'],
 ['Open floor after demolition','拆除后的开敞空间'],['Existing shell and site conditions','原建筑与现场条件'],['Survey of circulation and ceiling','动线与天花现场勘探'],
 ['Curved exhibition wall under construction','弧形展墙施工'],['Partition and entry build-out','隔墙与入口搭建'],['On-site scaffold and installation','脚手架与现场安装'],['Construction at exhibition threshold','展区交界处施工'],
 ['Projection and lighting test','投影与灯光测试'],['Media wall installation','媒体墙安装'],['Glass installation detail','玻璃装置细节'],['Ceiling detail and finish','天花细节收口'],['On-site installation coordination','驻地装置协调'],
 ['MY ROLE IN DELIVERY','我在落地阶段的工作'],['DESIGN RESIDENCY','设计驻地'],['MATERIAL SELECTION','材料选型'],['DESIGN COORDINATION','设计对接'],['EXHIBITION EXECUTION','展览执行'],
 ['I stayed involved as the drawings became physical space: reviewing materials, coordinating design decisions on site and following the execution of exhibition details.','从图纸进入实体空间的过程中，我参与设计驻地、材料选择、现场设计对接及展览执行，持续核对设计意图与落地细节。'],
 ['SELECTED SITE RECORDS / 2025.12—2026.04','现场施工记录节选 / 2025.12—2026.04'],['NEXT / EXHIBIT DETAILS →','下一章 / 展项细节 →'],
 ['DRAWING / SITE','设计图 / 现场'],['EXHIBITION / EXPERIENCE','展览 / 体验']
]);

const img=(file,label,cls='')=>`<button class="cd-photo ${cls}" type="button" data-cd-src="assets/construction/${file}.webp" data-cd-label="${label}"><img src="assets/construction/${file}.webp" alt="${label}" loading="lazy"><span>${label} ↗</span></button>`;

export function createConstructionTimeline(openImage){
 const section=document.createElement('section');section.className='cd-section';section.id='case-delivery';
 section.innerHTML=`
  <div class="cd-masthead"><span>WIND FROM THE EAST / QI CULTURE CLASSICS CENTER</span><span>06 / CONSTRUCTION & DELIVERY</span></div>
  <header class="cd-intro"><div><span class="cd-kicker">CONSTRUCTION / FROM PLAN TO PLACE</span><h2>FROM DRAWINGS TO BUILT SPACE.</h2></div><p>Three stages of construction move from reading the existing shell, through spatial build-out, to exhibit-level refinement. The dates describe project phases, not the timestamps of individual photographs.</p></header>
  <div class="cd-perspective" aria-label="Construction timeline, December 2025 to April 2026">
   <svg class="cd-rail" viewBox="0 0 1440 920" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cd-track-fill" x1="0" x2="1" y1="1" y2="0"><stop offset="0" stop-color="#4c575c" stop-opacity=".16"/><stop offset="1" stop-color="#dbe5e7" stop-opacity=".035"/></linearGradient></defs><path d="M-60 835 L1510 565 L1510 620 L-60 890Z" fill="url(#cd-track-fill)" stroke="#667277" stroke-opacity=".4" stroke-width="1"/><path d="M-60 835 L1510 565" fill="none" stroke="#dce4e4" stroke-opacity=".8" stroke-width="2"/><path d="M-60 862 L1510 592" fill="none" stroke="#dce4e4" stroke-opacity=".3" stroke-width="1" stroke-dasharray="6 8"/><path d="M-60 890 L1510 620" fill="none" stroke="#9ba8aa" stroke-opacity=".45" stroke-width="1"/><path d="M235 784 L235 839 M730 699 L730 754 M1215 616 L1215 671" stroke="#c9d1d2" stroke-opacity=".65" stroke-width="1"/><circle cx="235" cy="784" r="8" fill="#f1f5f5"/><circle cx="730" cy="699" r="7" fill="#f1f5f5"/><circle cx="1215" cy="616" r="6" fill="#f1f5f5"/></svg>
   <article class="cd-phase cd-phase-1"><header><span class="cd-phase-no">01 / EARLY SITE SURVEY</span><time>2025.12 — 2026.01</time><h3>READ THE EXISTING SHELL</h3><p>Demolition exposed the original building. We checked the drawings against the open floor, columns and circulation before locating the new exhibition zones.</p></header><div class="cd-photos">${img('survey-01','Open floor after demolition','cd-photo-main')}${img('survey-02','Existing shell and site conditions')}${img('survey-03','Survey of circulation and ceiling')}</div><div class="cd-phase-end"><span>01</span><i></i></div></article>
   <article class="cd-phase cd-phase-2"><header><span class="cd-phase-no">02 / INITIAL BUILD-OUT</span><time>2026.01 — 2026.03</time><h3>TRANSLATE THE PLAN ON SITE</h3><p>After clearing the space, construction followed the design plan: partitions, curved enclosures and routes began to define the visitor journey.</p></header><div class="cd-photos">${img('build-01','Curved exhibition wall under construction','cd-photo-main')}${img('build-02','Partition and entry build-out')}${img('build-03','On-site scaffold and installation')}${img('build-04','Construction at exhibition threshold')}</div><div class="cd-phase-end"><span>02</span><i></i></div></article>
   <article class="cd-phase cd-phase-3"><header><span class="cd-phase-no">03 / EXHIBIT REFINEMENT</span><time>2026.03 — 2026.04</time><h3>RESOLVE EACH EXHIBIT</h3><p>With the main spatial structure in place, the work moved to individual installations, surface details, lighting and media checks.</p></header><div class="cd-photos">${img('refine-01','Projection and lighting test','cd-photo-main')}${img('refine-02','Media wall installation')}${img('refine-03','Glass installation detail')}${img('refine-04','Ceiling detail and finish')}</div><div class="cd-phase-end"><span>03</span><i></i></div></article>
   <div class="cd-depth-label cd-depth-start">DRAWING / SITE</div><div class="cd-depth-label cd-depth-end">EXHIBITION / EXPERIENCE</div>
  </div>
  <div class="cd-role"><div class="cd-role-copy"><span class="cd-kicker">MY ROLE IN DELIVERY</span><p>I stayed involved as the drawings became physical space: reviewing materials, coordinating design decisions on site and following the execution of exhibition details.</p><div class="cd-role-tags"><span>DESIGN RESIDENCY</span><span>MATERIAL SELECTION</span><span>DESIGN COORDINATION</span><span>EXHIBITION EXECUTION</span></div></div>${img('refine-05','On-site installation coordination','cd-role-image')}</div>
  <footer class="cd-footer"><span>SELECTED SITE RECORDS / 2025.12—2026.04</span><a href="#case-exhibits">NEXT / EXHIBIT DETAILS →</a></footer>`;
 section.querySelectorAll('[data-cd-src]').forEach(button=>button.addEventListener('click',()=>openImage([{src:button.dataset.cdSrc,name:button.dataset.cdLabel}],0,'Construction & Delivery')));
 section.querySelector('.cd-footer a').addEventListener('click',event=>{event.preventDefault();section.parentElement.querySelector('#case-exhibits')?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth',block:'start'})});
 return section;
}
