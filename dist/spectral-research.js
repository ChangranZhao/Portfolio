import {registerTranslations} from './localization.js';
const cases=[['p10-0.jpeg','01 Hiroshima stone shadow','Presence of Absence'],['p12-0.jpeg','02 Wind Phone / Itaru Sasaki','Illusory Communication'],['p14-0.jpeg','03 Impact Steel','Materiality of Memory'],['p15-0.jpeg','04 Miyazawa manuscript','Traces of Reflection'],['p17-0.jpeg','05 Notre-Dame acoustic context','Remote Time']];
const principleImages=["presence","communication","materiality","reflection","time"];
const principles=[['Presence of Absence','An absent body can remain perceptible through an enduring trace.','M45 70V30a15 15 0 0 1 30 0v40 M35 85h50 M28 90h64'],['Illusory Communication','A familiar ritual can support felt connection without an actual reply.','M20 40h50v30H45L30 85V70H20z M80 55h30m-8-8 8 8-8 8'],['Materiality of Memory','Physical objects retain associations that a generic interface cannot assume.','M30 80 20 45 50 20 90 30 105 75 70 95z M50 20 55 65 70 95 M55 65 105 75 M20 45 55 65'],['Traces of Reflection',"Revisions and gestures reveal a person’s process, not only a finished message.",'M22 15h60v70H22z M38 28h60v70H38z M47 44h42m-42 12h30m-30 12h38m-38 12h25 M42 54l50 6'],['Remote Time','Sensory qualities can evoke a past moment or a remembered place.','M5 60Q20 60 25 25T45 60T65 60T85 60T110 60 M5 70Q20 30 35 70T65 70T95 70T115 70']];
export function spectralResearch(img){return `<section class="sf-page sf-research-editorial" id="sf-02" aria-labelledby="sf-research-title"><div class="sr-layout"><div class="sr-left"><div class="sr-hero">${img('assets/spectral/research/p12-0.jpeg','Wind Phone / Itaru Sasaki · Fig. 3','sr-hero-image')}<div class="sr-hero-text"><span class="sr-tag">TELEABSENCE</span><h2 id="sf-research-title">DESIGNING<br>WITH<br>ABSENCE</h2><p>Memory, material and the feeling of connection.</p></div>${img('assets/spectral/research/p12-0.jpeg','Wind Phone interior · Fig. 3','sr-hero-inset')}<small>Wind Phone / Itaru Sasaki · A ritual without a connected line.</small></div><div class="sr-position"><h3 class="sr-tag">Research position</h3><h4>How can an object invite remembrance without pretending to be a person?</h4><p>TeleAbsence frames connection through traces, rituals and remembered environments. This page translates its principles into questions for interaction design.</p></div></div><div class="sr-principles"><h3 class="sr-tag">Five design principles</h3><ol>${principles.map(([title,text,path],i)=>`<li><span class="sr-number">0${i+1}</span><div><h4>${title}</h4><p>${text}</p></div>${img('assets/spectral/research/principle-'+principleImages[i]+'-line.svg',title,'sr-principle-art')}</li>`).join('')}</ol></div><div class="sr-right"><header><h3 class="sr-tag">Case evidence</h3><p>Historical and cultural cases discussed by Ishii et al.; not five MIT-designed products.</p></header><div class="sr-evidence">${cases.map(([src,title,principle],i)=>`<figure class="sr-case-${i+1}">${img('assets/spectral/research/'+src,title)}<figcaption><span>${title}</span><span>${principle}</span></figcaption></figure>`).join('')}</div><div class="sr-transfer"><h3 class="sr-tag">What I carry forward</h3><div class="sr-transfer-body"><ol>${['Let silence remain part of the experience.','Make initiation and stopping deliberate.','Anchor meaning in personal records and objects.','Preserve originals; separate later interpretation.','Let people choose when to revisit.'].map((x,i)=>`<li><span>0${i+1}</span>${x}</li>`).join('')}</ol><div class="sr-loop"><div><span>TRACE</span><i>→</i><span>ENCOUNTER</span><i>→</i><span>REFLECTION</span></div><div class="sr-return">↶</div><p>user chooses to return</p></div></div></div><aside class="sr-extension"><h3 class="sr-tag">Where this project can go further</h3><div><p>Move from evocative encounters to a legible everyday interaction: clear provenance, adjustable intensity and an explicit ending.</p><em>An everyday ritual grounded in personal records.</em></div></aside></div></div><footer class="sr-footer"><div class="sr-questions"><strong class="sr-tag">Design questions</strong><span>Can people distinguish a record from a system response?</span><span>Can they begin and stop without uncertainty?</span><span>Can a new object acquire personal meaning over time?</span></div><div class="sr-sources"><b>SPECTRAL FLUID / 02 RESEARCH CONTEXT</b><a href="https://trackr-media.tangiblemedia.org/publishedmedia/Papers/731-MTA3N/Published/PDF" target="_blank" rel="noopener noreferrer">Ishii et al. · PRESENCE 34 (2025), §4.1–4.5, Figs. 2–6 ↗</a><a href="assets/spectral/research/SOURCES.txt" target="_blank" rel="noopener">Photo credits & source notes ↗</a></div></footer></section>`;}
registerTranslations(`
TELEABSENCE|跨时缺席感
DESIGNING|为缺席
WITH|而
ABSENCE|设计
Memory, material and the feeling of connection.|记忆、物质与连接的感受。
Wind Phone / Itaru Sasaki · A ritual without a connected line.|风之电话 / 佐佐木格 · 无须接通的倾诉仪式。
Research position|研究立场
How can an object invite remembrance without pretending to be a person?|物件如何唤起怀念，而不假装成为某个人？
TeleAbsence frames connection through traces, rituals and remembered environments. This page translates its principles into questions for interaction design.|TeleAbsence 通过痕迹、仪式与记忆中的环境理解连接。本页将其原则转化为交互设计的问题。
Five design principles|五项设计原则
Presence of Absence|缺席的在场
An absent body can remain perceptible through an enduring trace.|身体虽已缺席，留下的痕迹仍能让其被感知。
Illusory Communication|幻象式交流
A familiar ritual can support felt connection without an actual reply.|即使没有真实回复，熟悉的仪式仍能承载连接感。
Materiality of Memory|记忆的物质性
Physical objects retain associations that a generic interface cannot assume.|实体物件保留个人关联，通用界面不能直接替代。
Traces of Reflection|反思的痕迹
Revisions and gestures reveal a person’s process, not only a finished message.|修改与动作揭示思考过程，而不只是最终信息。
Remote Time|遥远的时间
Sensory qualities can evoke a past moment or a remembered place.|感官特征能够唤起过去的时刻或记忆中的场所。
Case evidence|案例证据
Historical and cultural cases discussed by Ishii et al.; not five MIT-designed products.|Ishii 等讨论的历史与文化案例，并非五个 MIT 产品。
01 Hiroshima stone shadow|01 广岛人影之石
02 Wind Phone / Itaru Sasaki|02 风之电话 / 佐佐木格
03 Impact Steel|03 遗存钢梁
04 Miyazawa manuscript|04 宫泽贤治手稿
05 Notre-Dame acoustic context|05 巴黎圣母院声学语境
What I carry forward|我所汲取的设计启发
Let silence remain part of the experience.|让静默成为体验的一部分。
Make initiation and stopping deliberate.|使开启与停止成为自主动作。
Anchor meaning in personal records and objects.|将意义植根于个人记录与物件。
Preserve originals; separate later interpretation.|保留原始资料，区分后续诠释。
Let people choose when to revisit.|让用户选择何时重访记忆。
TRACE|痕迹
ENCOUNTER|相遇
REFLECTION|反思
user chooses to return|由用户选择再次重访
Where this project can go further|本项目可以进一步推进的方向
Move from evocative encounters to a legible everyday interaction: clear provenance, adjustable intensity and an explicit ending.|将唤起情感的相遇转化为易于理解的日常交互：来源清晰、强度可调、结束明确。
An everyday ritual grounded in personal records.|以个人记录为基础，构建日常中的怀念仪式。
Design questions|设计思考
Can people distinguish a record from a system response?|能否区分原始记录与系统回应？
Can they begin and stop without uncertainty?|能否明确地开始与停止？
Can a new object acquire personal meaning over time?|新物件能否逐渐承载个人意义？
SPECTRAL FLUID / 02 RESEARCH CONTEXT|灵韵光谱 / 02 研究背景
Photo credits & source notes ↗|图片署名与来源说明 ↗
`.trim().split('\n').map(r=>r.split('|')));

