import {traditional} from './chinese-traditional.js';
import {resolveLanguage,languagePreference} from './language-preference.js';
const pairs=[
['地球公民的信笺 · 16:9 排版方案','Space Chronicles — Full Project'],
['地球公民的信笺 / View Full Project','Space Chronicles / View Full Project'],
['当距离改变语言','When distance changes language'],
['语言如何承载','How does language carry'],['一个社群的经验？','a community’s experience?'],
['将星际迁徙作为想象场景，观察表达方式、认知与身份之间的关系。','Interstellar migration offers a setting to explore expression, cognition and identity.'],
['01  语言与认知','01  Language & cognition'],
['语言相对论提供了一个切入点：不同的表达方式，如何影响我们描述与理解世界？','Linguistic relativity asks how different forms of expression shape our understanding of the world.'],
['02  距离与交流','02  Distance & communication'],
['长期隔离与通信延迟构成项目的未来情境，推动我们想象新的交流节奏与文化边界。','Isolation and communication delays frame a future of changing rhythms of exchange and cultural boundaries.'],
['03  媒介与转译','03  Media & translation'],
['Katie Paterson 的月球通信作品启发了对传输、停顿与变化的关注。媒介留下的痕迹也能成为表达的一部分。','Katie Paterson’s lunar communication work inspired an interest in transmission, pauses and change as forms of expression.'],
['DESIGN QUESTION / 环境改变后，文字将如何继续讲述人的故事？','DESIGN QUESTION / How will writing tell our stories as environments change?'],
['三个星球，三种语言情境','Three worlds, three language contexts'],
['星际迁徙  →  社群隔离与交流条件变化  →  共同经验分化  →  新的语言身份','Migration  →  Isolation & changing communication  →  Diverging experiences  →  New linguistic identities'],
['月球','Moon'],['火星','Mars'],['海王星','Neptune'],
['情感与连接','Emotion & connection'],['协作与生产','Work & cooperation'],['遥远与抽象','Distance & abstraction'],
['以情感短语优先的社群设定，讨论语言如何维系归属。','A community prioritizing emotional phrases explores language and belonging.'],
['以技术密集型表达，想象协作需求对交流方式的影响。','Technical expression imagines how cooperation shapes communication.'],
['将极远距离与隔离转化为抽象表达的叙事线索。','Extreme distance and isolation inspire abstract expression.'],
['SPECULATIVE PREMISE / 本页为项目的虚构世界设定；字形系统与语义规则的关系将在后续深化。','SPECULATIVE PREMISE / A fictional world; the relationship between glyphs and meaning remains open to further development.'],
['从环境意象到未来文字','Imagining scripts through landscapes'],
['图像素材  →  纹理与轮廓提取  →  线条简化  →  字形构成  →  字符集','Source images  →  Textures & contours  →  Simplified lines  →  Glyphs  →  Character sets'],
['保留地貌纹理中的方向、疏密与转折，使环境的视觉特征成为字形的构成依据。','Direction, density and turns in landscape textures inform the construction of each glyph.'],
['每个字形都是环境的转译','Each glyph translates an environment'],
['用统一的生成方法维持系统感，同时让三个字符集保留各自的视觉特征。','A shared method gives the three character sets coherence while preserving their distinct visual qualities.'],
['探索、书写、汇入','Explore, write, merge'],
['观众从陌生世界的观察者，逐渐成为其中的书写者。','Visitors become writers within a world they first encounter as observers.'],
['进入星球环境','Explore a planetary environment'],
['在不同的场景中漫游，感受孕育文字的环境意象。','Roam through planetary scenes and encounter the environments that inspire each script.'],
['用陌生字形表达','Write with unfamiliar glyphs'],
['键盘输入转化为未来文字，熟悉的表达获得新的视觉形式。','Keyboard input becomes a future script, giving familiar expression a new visual form.'],
['释放到共同画面','Join a shared visual field'],
['按下按钮，文字进入流动的粒子场，形成共同记忆的视觉隐喻。','A button releases text into a particle field: a visual metaphor for collective memory.'],
['让文字具有运动与空间感','Giving text motion and spatial presence'],
['键盘输入文字；Arduino 外接控制触发场景与互动状态的切换。','Keyboard input creates text; Arduino controls switch scenes and interaction states.'],
['通过下落、碰撞与反弹，赋予文字运动状态与空间关系。','Falling, colliding and bouncing give text motion and spatial relationships.'],
['通过聚集、分散与连续流动，构建文字释放后的视觉场。','Gathering, dispersing and flowing create a visual field of released text.'],
['技术说明与体验对应：输入什么 → 如何变化 → 观众看到什么','INPUT & EXPERIENCE / What is entered → How it changes → What visitors see'],
['文字进入现场','Writing in the exhibition space'],
['01 / 空间全景：发光字形、互动终端与现场观看关系','01 / Spatial view: illuminated glyphs, interactive terminals and viewing positions'],
['以不同尺度阅读文字','Reading text at different scales'],
['全景呈现装置之间的关系，局部呈现字形与材料，终端画面连接观众的输入和输出。','Wide views connect the installations; details reveal glyphs and materials. Terminals connect visitor input to visual output.'],
['当文字变得陌生','When writing becomes unfamiliar'],
['我们还会通过什么','How will we recognize'],['认出彼此？','one another?'],
['环境、字形与参与式体验构成了一条设计路径，也留下了关于理解、语义与文化归属的开放问题。','Environment, glyphs and participation shape a design process, leaving open questions about meaning and cultural belonging.'],
['下一阶段 / 从视觉映射，走向参与者共同约定符号的含义。','NEXT / Beyond visual mapping: participants agree on meanings together.'],
['REFLECTION / 讨论稿，待结合个人贡献完善','REFLECTION / Draft to develop alongside individual contributions'],
['项目原始素材','Original project material'],['原图、纹理处理与轮廓提取','Source images, texture processing and contour extraction']
];
const translations=new Map(pairs);
const style=document.createElement('style');
style.textContent='html[lang="en"] .panelbody{padding:18px 24px}html[lang="en"] .panel h3{font-size:24px;line-height:1.3}html[lang="en"] .panel p{font-size:19px;line-height:1.45}html[lang="en"] #page-3 .body{font-size:20px;line-height:1.5}html[lang="en"] #page-3 .body.muted{top:490px!important}html[lang="en"] #page-5 .subheading{font-size:24px}';
document.head.append(style);
const textNodes=[];
const walker=document.createTreeWalker(document.documentElement,NodeFilter.SHOW_TEXT);
while(walker.nextNode()){
 const n=walker.currentNode;
 if(!['SCRIPT','STYLE'].includes(n.parentElement?.tagName))textNodes.push([n,n.textContent]);
}
const attributes=[...document.querySelectorAll('[alt]')].map(n=>[n,n.alt]);
function translated(text,lang){
 if(lang==='en')return translations.get(text.trim())??text;
 return lang==='zh-Hant'?[...text].map(c=>traditional[c]||c).join(''):text;
}
function applyLanguage(lang){
 if(!['en','zh','zh-Hant'].includes(lang))return;
 document.documentElement.lang=lang==='zh'?'zh-CN':lang;
 for(const [n,text] of textNodes)n.textContent=translated(text,lang);
 for(const [n,text] of attributes)n.alt=translated(text,lang);
}
let saved={};try{saved=JSON.parse(localStorage.getItem('portfolio-preferences')||'{}')}catch{}
let initial=resolveLanguage(languagePreference(saved),navigator.languages||[navigator.language]);
try{if(parent!==window){const p=parent.document.documentElement.lang;initial=p==='zh-CN'?'zh':p;}}catch{}
applyLanguage(initial);
window.addEventListener('message',event=>{
 if(event.origin===location.origin&&event.source===parent&&event.data?.type==='portfolio-preferences')applyLanguage(event.data.lang);
});

