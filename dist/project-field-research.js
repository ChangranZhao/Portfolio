import {registerTranslations} from './localization.js';

const sites = [
 ['assets/field-research/site-01.webp','Open floor'],
 ['assets/field-research/site-02.webp','Daylight & windows'],
 ['assets/field-research/site-03.webp','Column grid'],
 ['assets/field-research/site-04.webp','On-site observation'],
 ['assets/field-research/site-05.webp','Existing structure'],
 ['assets/field-research/site-06.webp','Construction context'],
 ['assets/field-research/site-07.webp','People & scale'],
 ['assets/field-research/site-08.webp','Access & connections'],
 ['assets/field-research/site-09.webp','Ceiling services'],
 ['assets/field-research/site-10.webp','Spatial continuity'],
 ['assets/field-research/site-11.webp','Field discussion'],
 ['assets/field-research/site-12.webp','Material & atmosphere']
];
const priorities=[['Clear cultural storyline','Connect people, texts and events into a coherent reading of Qi culture.'],['Accessible historical stories','Give audiences a clear entry point into complex historical material.'],['Digital media with a narrative purpose','Choose media that help explain the story and its cultural meaning.']];
const interviewQuestions=['How do the stories connect?','Where does the visitor begin?','What should digital media do?'];
registerTranslations([
 ['DESIGN QUESTIONS / RESPONSES','设计提问 / 回应'],
 ['How do the stories connect?','故事如何串联？'],
 ['Where does the visitor begin?','观众从哪里进入？'],
 ['What should digital media do?','数字媒介承担什么？'],
 ['Synthesis of interview and site observations','访谈与现场观察的设计归纳'],
 ['01 / SITE DISCUSSION','01 / 现场讨论'],['02 / CURATOR CONVERSATION','02 / 馆方访谈']
]);
export function createFieldResearch(openImage){
 const section=document.createElement('section');section.id='case-interview';section.className='field-page';
 section.innerHTML=`
 <header class="field-masthead"><div>WIND FROM THE EAST<small>Qi Culture Classics Center</small></div><span></span><b>PAGE 04</b><small>PEOPLE<br>PLACE<br>CONTENT</small></header>
 <div class="field-upper">
  <section class="field-interview">
   <div class="field-person"><span class="field-eyebrow">04 / Field Research</span><h2>FIELD<br>RESEARCH</h2><p class="field-tracking">PEOPLE / PLACE / CONTEXT / INSIGHTS</p><div class="field-interview-collage" aria-label="Interview and site discussion photographs"><figure class="field-interview-photo field-interview-photo-site"><img src="assets/field-research/interview-site-discussion.jpg" alt="Team discussing the exhibition on site" loading="lazy" decoding="async"><figcaption>01 / SITE DISCUSSION</figcaption></figure><figure class="field-interview-photo field-interview-photo-talk"><img src="assets/field-research/interview-conversation.jpg" alt="Conversation with the museum team" loading="lazy" decoding="async"><figcaption>02 / CURATOR CONVERSATION</figcaption></figure><span class="field-interview-stamp">CURATOR<br>INTERVIEW</span></div><p class="field-portrait-caption">Understanding the museum’s perspective.</p></div>
   <div class="field-priorities"><p class="field-tracking">DESIGN QUESTIONS / RESPONSES</p>${priorities.map(([title,copy],i)=>`<article class="field-dialogue"><span class="field-dialogue-index">0${i+1}</span><div class="field-dialogue-pair"><p class="field-question"><small>Q</small>${interviewQuestions[i]}</p><div class="field-answer"><small>A</small><h3>${title}</h3><p>${copy}</p></div></div></article>`).join('')}<small class="field-draft">Synthesis of interview and site observations</small></div>
  </section>
  <section class="field-survey"><header><h2>SITE SURVEY</h2><p class="field-tracking">EXISTING CONDITIONS<br>POTENTIALS & CONSTRAINTS</p></header><div class="field-collage"><svg class="field-traces" viewBox="0 0 900 480" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width=".6">${Array.from({length:19},(_,i)=>`<path d="M ${i*47} 460 L ${110+i*31} 50 L ${820-i*19} 420 L ${50+i*29} 100"/>`).join('')}<path d="M0 120H900M0 280H900M0 400H900M100 0V480M420 0V480M760 0V480"/></g></svg></div><p class="field-survey-note">A record of the existing site · Select a photo to explore</p></section>
 </div>
 <section class="field-insights"><header><h2>DESIGN INSIGHTS</h2><p class="field-tracking">CONTENT FIRST. PLACE INFORMED.</p></header>
 <div class="field-insight-grid">
 <article class="field-content"><h3><b>1</b> CURATOR PRIORITIES + CULTURAL CONTENT</h3><div class="field-content-flow"><div class="field-mini-needs"><h4>CURATOR PRIORITIES</h4>${priorities.map(([t],i)=>`<p><span>0${i+1}</span>${t}</p>`).join('')}</div><span class="field-plus">+</span><div class="field-themes"><h4>FOUR CULTURAL SPIRITS<small>Content themes</small></h4><p><img src="assets/field-research/theme-1.webp" alt="Layered mountains — conceptual illustration" loading="lazy">Talent & achievement</p><p><img src="assets/field-research/theme-2.webp" alt="Open water — conceptual illustration" loading="lazy">Inclusiveness & openness</p><p><img src="assets/field-research/theme-3.webp" alt="Reeds in the wind — conceptual illustration" loading="lazy">Pragmatism & adaptation</p><p><img src="assets/field-research/theme-4.webp" alt="Merchant harbor — conceptual illustration" loading="lazy">Commerce & industry</p></div><svg class="field-convergence" viewBox="0 0 120 240" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.4"><path d="M0 48 C48 48 49 130 118 130"/><path d="M0 104 C47 104 65 130 118 130"/><path d="M0 160 C47 160 65 130 118 130"/><path d="M0 216 C48 216 49 130 118 130"/></g></svg><div class="field-sequence"><h4>NARRATIVE SEQUENCE</h4><div class="field-planes"><span><img src="assets/field-research/theme-1.webp" alt="Mountain narrative layer" loading="lazy"></span><span><img src="assets/field-research/theme-4.webp" alt="Commerce narrative layer" loading="lazy"></span><span><img src="assets/field-research/theme-2.webp" alt="Water narrative layer" loading="lazy"></span><span><img src="assets/field-research/theme-3.webp" alt="Adaptation narrative layer" loading="lazy"></span><svg viewBox="0 0 300 170" preserveAspectRatio="none" aria-hidden="true"><path d="M0 125 Q155 38 294 87" fill="none" stroke="currentColor" stroke-width="2"/><path d="m284 79 10 8-13 0" fill="currentColor"/></svg></div><p>Weave overlapping themes into a connected storyline.</p></div></div></article>
 <article class="field-place"><h3><b>2</b> SITE CONDITIONS → SPATIAL PLACEMENT</h3><div class="field-place-flow"><div class="field-observations"><h4>SITE OBSERVATIONS</h4><p>01 / Open floor</p><p>02 / Structural columns</p><p>03 / Natural daylight</p><p>04 / Ceiling services</p><p>05 / Access & connections</p></div><div class="field-spatial"><h4>SPATIAL PLACEMENT</h4><button class="field-generated-view" type="button" data-field-visual="structure" aria-label="Enlarge circular two-floor museum diagram"><img src="assets/field-research/circular-structure.webp" alt="Conceptual exploded axonometric of the circular museum: second floor above first floor" loading="lazy" decoding="async"></button><small>Conceptual diagram · Not a measured plan</small></div></div><p>Use site conditions to place and pace the narrative.</p></article>
 <article class="field-outcome"><h3><b>3</b> CLEAR STORYTELLING</h3><button class="field-generated-view field-experience" type="button" data-field-visual="experience" aria-label="Enlarge storytelling experience illustration"><img src="assets/field-research/storytelling-experience.webp" alt="Concept illustration of a visitor entering an immersive Qi culture storytelling space" loading="lazy" decoding="async"><span>A MEMORABLE<br>QI CULTURE<br>EXPERIENCE</span></button><small class="field-concept-label">Concept visualization</small><p>A coherent journey through Qi culture.</p></article>
 </div></section><footer class="field-footer"><span>QI CULTURE CLASSICS CENTER</span><span>RESEARCH → NARRATIVE → SPACE</span><a href="#case-narrative">NEXT / NARRATIVE & SPACE →</a></footer>`;
 for(const button of section.querySelectorAll('[data-field-visual]'))button.onclick=()=>openImage([{src:button.querySelector('img').getAttribute('src'),name:button.querySelector('img').alt}],0,'Design concept');
 const collage=section.querySelector('.field-collage');sites.forEach(([src,name],i)=>{const b=document.createElement('button');b.className='field-site field-site-'+i;b.type='button';b.setAttribute('aria-label','View site photo: '+name);b.innerHTML=`<img src="${src}" alt="${name}" loading="lazy" decoding="async"><span>${String(i+1).padStart(2,'0')} / ${name}</span>`;b.onclick=()=>openImage(sites.map(([src,name])=>({src,name})),i,'Site survey');collage.append(b);});
 section.querySelector('.field-footer a').onclick=e=>{e.preventDefault();section.parentElement.querySelector('#case-narrative')?.scrollIntoView({behavior:'instant',block:'start'});};return section;
}
