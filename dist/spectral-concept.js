import {registerTranslations} from './localization.js';

const archive='assets/spectral/concept/mirrorfugue.jpg';
const sounds='assets/spectral/concept/sound-hd.jpg';
const writing='assets/spectral/concept/writing-hd.jpg';
const vector=(paths,cls='')=>`<svg class="sc-vector ${cls}" viewBox="0 0 120 90" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">${paths}</svg>`;
const record=()=>vector('<path d="M15 15h48v57H15z M22 25h33m-33 8h27m-27 8h33m-33 8h24 M42 42h62v40H42z M47 73l14-18 13 10 9-6 16 14"/><circle cx="89" cy="51" r="4"/>');
const gesture=()=>vector('<path d="M24 76q-7-15 3-28l17-25q4-6 7-2t-7 21l21-29q5-6 8-1t-16 31l23-25q6-5 8 0t-22 29l23-17q7-4 7 2T73 59q17-10 20-5t-20 18l-9 10"/>');
const layers=()=>vector('<path d="M20 33 58 13v51L20 84z M40 33 78 13v51L40 84z M60 33 98 13v51L60 84z"/><path d="M18 55h15l4-14 6 27 5-22 5 14h20l4-17 5 26 5-20 5 6h15" stroke="#aaa"/>');
const wave=()=>vector('<path d="M8 45h104 M18 38v14m7-22v30m7-37v43m7-33v23m7-17v11m7-35v48m7-58v65m7-51v38m7-27v21m7-29v35m7-21v15m7-26v34"/>');
const listening=()=>vector('<path d="M43 75V56q-18-7-16-27t25-19q21 1 21 22l9 13-12 3v12H54v15 M82 25q15 17 0 34m8-43q23 25 0 50"/>');
const book=()=>vector('<path d="M60 24q-22-12-43-6v55q24-7 43 6 19-13 43-6V18q-21-6-43 6v55 M25 29l25 4m-25 6 25 4m-25 6 25 4m-25 6 25 4m20-30 25-4m-25 14 25-4m-25 14 25-4m-25 14 25-4"/>');
function framework(){return `<div class="sc-framework"><div class="sc-diagram-head"><span>Different memories</span><span>Adaptable framework</span><span>Individual experiences</span></div><div class="sc-diagram-body"><div class="sc-inputs"><div>${record()}<span>A place</span></div><div>${vector('<path d="M18 15h85v61H18z M27 30q10-10 15 0t15 0 15 0 19 0 M27 45q10-10 15 0t15 0 15 0 19 0 M27 60q10-10 15 0t15 0 15 0"/>')}<span>A written memory</span></div><div>${wave()}<span>A sound</span></div></div><div class="sc-shared"><span class="sc-incoming" aria-hidden="true">→</span>${layers()}<b>Shared interaction framework</b><span class="sc-outgoing" aria-hidden="true">→</span></div><div class="sc-outputs"><div>${listening()}<span>A moment of listening</span></div><div>${gesture()}<span>A moment of making</span></div><div>${book()}<span>A moment of reflecting</span></div></div></div></div>`;}

export function spectralConcept(img){return `<section class="sf-page sf-concept-editorial" id="sf-concept" aria-labelledby="sc-title">
<header class="sc-running"><span>SPECTRAL FLUID / FROM PRECEDENT TO POSITION</span><i></i><span>03 / CONCEPT TO DESIGN POSITION</span></header>
<div class="sc-layout"><div class="sc-left"><h3 class="sr-tag">TeleAbsence in practice</h3><h2 id="sc-title"><span>PERSONAL STORIES.</span><span>SHARED POSSIBILITIES.</span></h2><p class="sc-deck">Connections with past people, places and selves, made tangible.</p>
<figure class="sc-piano">${img(archive,'MirrorFugue — image courtesy of MIT Tangible Media Group','sc-photo sc-photo-piano')}<figcaption><h4>01 / MirrorFugue</h4><p>Recorded performance brings gesture, sound and a physical piano together. Its meaning changes with the viewer’s relationship to the pianist.</p><small>Image courtesy of MIT Tangible Media Group</small></figcaption></figure>
<p class="sc-insight"><b>My insight:</b> <span>The same interface can hold very different personal meanings.</span></p>
<aside class="sc-synthesis"><h3 class="sr-tag">Concept synthesis</h3><div class="sc-equation"><div>${record()}<b>PERSONAL TRACE</b><p>Records, traces and fragments from a past relationship.</p></div><i>+</i><div>${gesture()}<b>EMBODIED ENCOUNTER</b><p>Physical and sensory interaction brings the past into the present.</p></div><i>+</i><div>${layers()}<b>RELATIONSHIP</b><p>Meaning emerges through the person’s unique context.</p></div></div><p>TeleAbsence is a way of encountering a past relationship through media and objects.</p></aside></div>
<div class="sc-middle"><h3 class="sr-tag">What the cases reveal</h3><article class="sc-case"><div class="sc-sound-pair">${img(sounds,'musicBottles — photograph by NTT ICC','sc-photo sc-photo-bottles')}${img(sounds,'ambientPhone — photograph by Hiroshi Ishii','sc-photo sc-photo-phone')}</div><h4>02 / musicBottles &amp; ambientPhone</h4><p>A familiar act — opening or lifting — becomes an entry into remembered sound.</p><div class="sc-findings"><p><b>Specific:</b> <span>The sound and its personal associations.</span></p><p><b>Transferable:</b> <span>An intuitive gesture that opens an encounter.</span></p></div><small>Photos: NTT ICC; Hiroshi Ishii</small></article>
<article class="sc-case">${img(writing,'ColloGraphy — photograph by Cathy Fang; calligraphy by Kazuko Ishii','sc-photo sc-photo-calligraphy')}<h4>03 / ColloGraphy</h4><p>Brush movement and pressure draw attention to the person behind the written mark.</p><div class="sc-findings"><p><b>Specific:</b> <span>A relationship carried by handwriting.</span></p><p><b>Transferable:</b> <span>Process and gesture can carry meaning beyond the finished image.</span></p></div><small>Photo: Cathy Fang. Calligraphy: Kazuko Ishii.</small></article><p class="sc-insight"><b>My question:</b> <span>Which parts should remain unique, and which parts can become adaptable?</span></p></div>
<div class="sc-right"><h3 class="sr-tag">My design position</h3><h2 class="sc-position-title"><span>DESIGN FOR ONE</span><span><i aria-hidden="true">→</i> DESIGN FOR ALL</span></h2><p class="sc-position-deck">Scale the framework. Keep the relationship personal.</p>${framework()}<div class="sc-decisions">${[['PERSONAL CONTENT','People choose whose records to include, with permission and context.'],['ADAPTABLE INTERACTION','Offer alternative inputs and sensory outputs; let people adjust pace and intensity.'],['CONTINUOUS OWNERSHIP','Support setup, everyday recall, reflection, transfer and deletion.']].map(([a,b],i)=>`<div><span>0${i+1}</span><h4>${a}</h4><p>${b}</p></div>`).join('')}</div><aside class="sc-conclusion"><h3>Design for all begins with respect for each one.</h3><div><p>Let abilities, cultures and personal relationships shape different ways of remembering.</p><p>MIT already explores shareable memory tools; this is my proposed product translation.</p></div></aside></div></div>
<footer class="sc-footer"><div><span>Sources:</span> <a href="https://www.media.mit.edu/articles/teleabsence-communicating-across-time/" target="_blank" rel="noopener">MIT Arts (2023) ↗</a><a href="https://www.media.mit.edu/articles/teleabsence-poetic-encounters-with-the-past/" target="_blank" rel="noopener">MIT News (2025) ↗</a><a href="https://www.media.mit.edu/articles/teleabsence/" target="_blank" rel="noopener">Ishii et al., PRESENCE (2025) ↗</a><a href="https://tangible.media.mit.edu/project/teleabsence/" target="_blank" rel="noopener">MIT Tangible Media Group ↗</a></div><span>Precedents: MIT research / Insights and design direction: author’s synthesis.</span></footer></section>`;}

registerTranslations(`
Concept to design position|从概念到设计立场
SPECTRAL FLUID / FROM PRECEDENT TO POSITION|灵韵光谱 / 从案例到设计立场
03 / CONCEPT TO DESIGN POSITION|03 / 从概念到设计立场
TeleAbsence in practice|TeleAbsence 的交互实践
PERSONAL STORIES.|个人故事。
SHARED POSSIBILITIES.|共同的可能性。
Connections with past people, places and selves, made tangible.|让与过去的人、场所和自我的连接成为可感知的体验。
Recorded performance brings gesture, sound and a physical piano together. Its meaning changes with the viewer’s relationship to the pianist.|记录的演奏将动作、声音与实体钢琴相连；观者与演奏者的关系赋予体验不同的意义。
Image courtesy of MIT Tangible Media Group|图片由 MIT 有形媒体组提供
My insight:|我的启发：
The same interface can hold very different personal meanings.|同一种界面，可以承载截然不同的个人意义。
Concept synthesis|概念总结
PERSONAL TRACE|个人痕迹
EMBODIED ENCOUNTER|具身相遇
RELATIONSHIP|关系语境
Records, traces and fragments from a past relationship.|一段过去关系中的记录、痕迹与片段。
Physical and sensory interaction brings the past into the present.|身体与感官的交互，让过去进入当下。
Meaning emerges through the person’s unique context.|意义源于每个人独有的关系与经历。
TeleAbsence is a way of encountering a past relationship through media and objects.|TeleAbsence 是通过媒介与物件，重新感受过去关系的一种方式。
What the cases reveal|案例揭示了什么
A familiar act — opening or lifting — becomes an entry into remembered sound.|打开瓶子或拿起听筒：一个熟悉的动作成为进入声音记忆的入口。
Specific:|独有之处：
Transferable:|可迁移之处：
The sound and its personal associations.|声音及其承载的个人关联。
An intuitive gesture that opens an encounter.|以直觉动作开启一次相遇。
Photos: NTT ICC; Hiroshi Ishii|摄影：NTT ICC；Hiroshi Ishii
Brush movement and pressure draw attention to the person behind the written mark.|笔锋的运动与力度，让人关注书写痕迹背后的那个人。
A relationship carried by handwriting.|由笔迹承载的个人关系。
Process and gesture can carry meaning beyond the finished image.|过程与动作所传递的意义，可以超越最终图像。
Photo: Cathy Fang. Calligraphy: Kazuko Ishii.|摄影：Cathy Fang。书法：Kazuko Ishii。
My question:|我的问题：
Which parts should remain unique, and which parts can become adaptable?|哪些部分应保持独特，哪些部分可以转化为可适应的框架？
My design position|我的设计立场
DESIGN FOR ONE|为一个人设计
DESIGN FOR ALL|让更多人参与
Scale the framework. Keep the relationship personal.|拓展交互框架，保留关系的个人意义。
Different memories|不同的记忆
Adaptable framework|可适应的框架
Individual experiences|各自的体验
A place|一个场所
A written memory|一段文字记忆
A sound|一段声音
Shared interaction framework|共享交互框架
A moment of listening|聆听的时刻
A moment of making|参与的时刻
A moment of reflecting|回顾的时刻
PERSONAL CONTENT|个人内容
ADAPTABLE INTERACTION|可适应的交互
CONTINUOUS OWNERSHIP|持续的自主权
People choose whose records to include, with permission and context.|由用户选择保留谁的记录，并明确授权与来源语境。
Offer alternative inputs and sensory outputs; let people adjust pace and intensity.|提供不同输入与感官反馈，让用户调节节奏与强度。
Support setup, everyday recall, reflection, transfer and deletion.|支持初次设置、日常回忆、反思、转移与删除。
Design for all begins with respect for each one.|为更多人设计，始于尊重每一个人。
Let abilities, cultures and personal relationships shape different ways of remembering.|让不同能力、文化与个人关系，塑造各自的怀念方式。
MIT already explores shareable memory tools; this is my proposed product translation.|MIT 已在探索可共享的记忆工具；这里是我提出的产品转化方向。
Sources:|资料来源：
Precedents: MIT research / Insights and design direction: author’s synthesis.|案例：MIT 研究 / 启发与设计方向：作者的归纳与推论。
`.trim().split('\n').map(r=>r.split('|')));
