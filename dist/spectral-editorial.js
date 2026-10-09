import {registerTranslations} from './localization.js';
const notes={
1:[['The product proposition','A physical object for recalling selected memories, with an app for curation and preferences.'],['Three connected layers','The archive holds the record. The object shapes the encounter. The service supports ownership.']],
3:[['Form follows the encounter','An inclined surface makes the response visible; a rounded body supports a deliberate two-handed hold.'],['Designing for the body','Body proportions, hand contact and viewing angles guide the transition from gesture to form.']],
4:[['From shell to system','Separate the viewing surface, actuation, optics and control electronics into legible functional layers.'],['Integration questions','Layered organization separates magnetic actuation, optics and control while leaving space for airflow and access.']],
5:[['A ritual with an ending','Each gesture has a clear place in the sequence. Releasing the object should bring the experience to a close.'],['User control','The interaction is initiated by the person. Duration and intensity are preferences, not obligations.']],
6:[['Intelligence as coordination','The system connects a chosen record with restrained physical feedback. It does not need to perform a person.'],['A readable response','Make the relationship between gesture and response legible, with a clear return to rest.']],
7:[['Two complementary interfaces','The app handles deliberate decisions. The object offers a quiet encounter away from the screen.'],['Content before response','Select and review the original record, then choose how it may appear during a physical interaction.']],
9:[['A journey beyond unboxing','An intelligent object needs a clear beginning, an adjustable everyday rhythm and a supported exit.'],['Different paths are valid','Some people return regularly; others use it occasionally or choose to stop. The journey should support each choice.']],
10:[['The service behind the object','Pairing, archive care and recovery make the product usable over time. They support the physical experience.'],['Designing for interruption','A failed connection, missing record or decision to leave should lead to an understandable next step.']],
11:[['From prototype to form','Component-level experiments inform the three-layer architecture and the enclosure design.'],['Integration priorities','Connect sensing, magnetic actuation and projection around a deliberate beginning and a quiet ending.']]
};
export function editorialNotes(n){return notes[n]?`<aside class="sf-editorial-notes">${notes[n].map(([h,p],i)=>`<div><span>0${i+1}</span><h3>${h}</h3><p>${p}</p></div>`).join('')}</aside>`:'';}
registerTranslations(`
The product proposition|产品主张
A physical object for recalling selected memories, with an app for curation and preferences.|以实体物件承载被选择的记忆，由应用支持内容整理与偏好设置。
Three connected layers|三个相互连接的层次
The archive holds the record. The object shapes the encounter. The service supports ownership.|档案保存记录，物件塑造相遇，服务支持持续拥有与使用。
Form follows the encounter|形态回应交互
An inclined surface makes the response visible; a rounded body supports a deliberate two-handed hold.|倾斜表面让回应可见，圆润体量支持主动而专注的双手握持。
Designing for the body|围绕身体设计
Body proportions, hand contact and viewing angles guide the transition from gesture to form.|以体量比例、手部接触和观察角度，引导从动作到形态的转译。
From shell to system|从外壳到系统
Separate the viewing surface, actuation, optics and control electronics into legible functional layers.|将观察表面、驱动、光学与控制电子元件划分为清晰的功能层。
Integration questions|集成中的问题
Layered organization separates magnetic actuation, optics and control while leaving space for airflow and access.|通过分层组织电磁驱动、光学与控制，为气流与维护留出空间。
A ritual with an ending|有始有终的仪式
Each gesture has a clear place in the sequence. Releasing the object should bring the experience to a close.|每个动作在序列中都有明确的位置；松开物件应使体验自然结束。
User control|用户掌控
The interaction is initiated by the person. Duration and intensity are preferences, not obligations.|由人主动开启交互，时长与强度由偏好决定，而非使用义务。
Intelligence as coordination|作为协调的智能
The system connects a chosen record with restrained physical feedback. It does not need to perform a person.|系统将选定记录与克制的物理反馈连接，而无需扮演某个人。
A readable response|可被理解的回应
Make the relationship between gesture and response legible, with a clear return to rest.|让动作与回应的关系清晰可读，并以回归静止传达结束。
Two complementary interfaces|相互补充的两种界面
The app handles deliberate decisions. The object offers a quiet encounter away from the screen.|应用承载审慎的选择，物件提供远离屏幕的安静相遇。
Content before response|先选择内容，再定义回应
Select and review the original record, then choose how it may appear during a physical interaction.|先选择并查看原始记录，再决定它如何进入实体交互。
A journey beyond unboxing|不止于开箱的旅程
An intelligent object needs a clear beginning, an adjustable everyday rhythm and a supported exit.|智能物件需要清晰的开始、可调节的日常节奏，以及有支持的退出。
Different paths are valid|容纳不同的使用路径
Some people return regularly; others use it occasionally or choose to stop. The journey should support each choice.|有人经常重访，有人偶尔使用，也有人选择停止；流程应容纳每种选择。
The service behind the object|物件背后的服务
Pairing, archive care and recovery make the product usable over time. They support the physical experience.|配对、档案维护与故障恢复，让产品能够持续使用，支持实体体验。
Designing for interruption|为中断设计
A failed connection, missing record or decision to leave should lead to an understandable next step.|连接失败、记录缺失或决定离开，都应有清晰可理解的下一步。
From prototype to form|从原型到形态
Component-level experiments inform the three-layer architecture and the enclosure design.|元件层面的原型探索，推动三层架构与外壳设计。
Integration priorities|整合思路
Connect sensing, magnetic actuation and projection around a deliberate beginning and a quiet ending.|围绕主动开启与安静结束，整合感知、电磁驱动和投影。
`.trim().split('\n').map(r=>r.split('|')));
