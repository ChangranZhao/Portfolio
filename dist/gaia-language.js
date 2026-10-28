import {traditional} from './chinese-traditional.js';
const records=new WeakMap();
const han=/[\u3400-\u9fff]/;
const pairs=[['2001:957','2019:2'],['2001:958','2019:3'],['2001:959','2019:4'],['2001:972','2001:956'],['2001:1063','2001:1024'],['2001:1109','2019:5'],['2001:1162','2019:6'],['2001:1163','2019:7'],['2001:1219','2001:1215'],['2001:1288','2019:8'],['2001:1289','2019:9'],['2001:1290','2019:10'],['2001:1291','2019:11'],['2001:1292','2019:12'],['2001:1293','2019:13'],['2001:1294','2019:14'],['2001:1366','2001:1362'],['2023:12','2023:13'],['2023:14','2023:15'],['2023:16','2023:17'],['2023:18','2023:19'],['2023:20','2023:21'],['2023:22','2023:23'],...Array.from({length:8},(_,i)=>['2014:'+(28+i*4),'2014:'+(29+i*4)])];
const translations={
 '时间状态： 对应不同年份的生态数据状态':'Time State: Ecological data states for different years','扰动程度： 控制粒子分散、结构破碎与 视觉不稳定程度':'Disturbance Level: Controls particle dispersion, fragmentation and visual instability','介入时长： 记录参与者持续介入系统的时间':'Intervention Duration: Tracks sustained intervention','恢复速度： 根据累计扰动决定系统重新聚合的速度与程度':'Recovery Rate: Accumulated disturbance determines the rate and extent of recovery','时间状态：':'Time State:', '对应不同年份的生态数据状态':'Ecological data states for different years',
 '扰动程度：':'Disturbance Level:', '控制粒子分散、结构破碎与 视觉不稳定程度':'Controls particle dispersion, fragmentation and visual instability',
 '介入时长：':'Intervention Duration:', '记录参与者持续介入系统的时间':'Tracks the duration of sustained intervention',
 '恢复速度：':'Recovery Rate:', '根据累计扰动决定系统重新聚合的速度与程度':'Accumulated disturbance determines the rate and extent of recovery',
 '森林面积占陆地面积比例（%）':'Forest area (% of land area)',
 '密度 · 碎裂 · 恢复':'Density · Fragmentation · Recovery', '观察 · 干预 · 反馈':'Observe · Intervene · Feedback',
 '屏幕呈现特定年份的森林数据与视觉化生态状态，建立数据与视觉变化之间的联系。':'The display presents forest data and ecological states for a selected year, connecting data with visible change.',
 '切换不同年份，观察长期森林覆盖变化如何影响生态体的密度、完整性与动态状态。':'Explore different years to see how long-term forest change affects density, integrity and motion.',
 '在 Leap Motion 感应区域抬升或移动手掌，握拳触发粒子碎裂，将手部运动转译为生态反馈。':'Raise or move a palm above Leap Motion; making a fist triggers particle fragmentation, translating hand movement into ecological feedback.',
 '停止介入后，系统根据累计扰动，以不同速度与程度逐步恢复，呈现生态反馈的延迟性。':'After intervention ends, the system gradually recovers at a rate and extent determined by accumulated disturbance, revealing delayed ecological feedback.',
 'Leap Motion · 红外手部追踪 手掌位置 / 运动 / 握拳状态':'Leap Motion · Infrared Hand Tracking\nPalm Position / Motion / Fist State'
};
const normalize=s=>s.replace(/\s+/g,' ').trim();
export function localizeGaia(doc,lang){
 if(!doc?.querySelector('.figma-canvas'))return;
 let blocks=records.get(doc);
 if(!blocks){
  const hidden=new Set(),paired=new Map();
  for(const [zh,en] of pairs){const a=doc.querySelector(`[data-node-id="${zh}"]`),b=doc.querySelector(`[data-node-id="${en}"]`);if(!a||!b)continue;hidden.add(b);paired.set(a,b);}
  const boxes=[...new Set([...doc.querySelectorAll('p')].map(p=>[...p.parentElement.children].every(e=>e.tagName==='P'&&!e.dataset.nodeId)?p.parentElement:p))];
  blocks=boxes.map(el=>{const source=normalize(el.textContent),style=doc.defaultView.getComputedStyle(el.tagName==='P'?el:el.querySelector('p'));let zh=source,en=source;
   const partner=paired.get(el);
   if(partner)en=normalize(partner.textContent);
   else if(han.test(source)){
    en=translations[source];
    const mixed=source.match(/^(.*[\u3400-\u9fff][^A-Za-z]*)([A-Za-z][\s\S]*)$/);
    if(!en&&mixed){zh=mixed[1].replace(/[\s/·]+$/,'');en=mixed[2];}
    if(source.includes('1990–2020'))zh='观测时段：1990–2020';
    if(source.includes('MOothed')||source.includes('M oothed'))en='Smoothed trend';
    if(en&&source.startsWith('Leap Motion')&&!en.startsWith('Leap Motion'))en='Leap Motion · '+en;if(en&&source.startsWith('TouchDesigner')&&!en.startsWith('TouchDesigner'))en='TouchDesigner · '+en;if(en&&source.startsWith('Data Mapping')&&!en.startsWith('Data Mapping'))en='Data Mapping · '+en;if(!en)en=source;
   }
   if(el.dataset.nodeId==='2019:13')en='Tangible Ecological Interface: Moss, soil and transparent structures form the primary physical interaction area.';
   if(el.dataset.nodeId==='2001:1293')en='Tangible Ecological Interface: Moss, soil and transparent structures form the primary physical interaction area.';
   en=en.replace('embodi ed','embodied');
   const height=partner&&Number.isFinite(parseFloat(partner.style.top))&&Number.isFinite(parseFloat(el.style.top))?Math.max(el.clientHeight,parseFloat(partner.style.top)+partner.clientHeight-parseFloat(el.style.top)):partner?Math.max(el.clientHeight,partner.clientHeight):el.clientHeight;
   return {el,zh,en,x:el.offsetLeft-el.clientWidth,pinned:el.style.transform==='translateX(-100%)',width:el.clientWidth,hidden:hidden.has(el),style:el.getAttribute('style'),font:parseFloat(style.fontSize)||parseFloat(doc.defaultView.getComputedStyle(el.querySelector('span')||el).fontSize)||18,color:style.color==='rgb(0, 0, 0)'?'#c7cccf':parseFloat(style.fontSize)?style.color:doc.defaultView.getComputedStyle(el.querySelector('span')||el).color,height};
  });records.set(doc,blocks);
 }
 doc.documentElement.lang=lang==='zh'?'zh-CN':lang;
 for(const b of blocks){const {el}=b;el.setAttribute('style',b.style||'');if(b.hidden){el.style.display='none';continue;}
  if(b.pinned){el.style.left=b.x+'px';el.style.transform='none';el.style.width=b.width+'px';el.style.textAlign='left';}if(el.dataset.nodeId==='2001:972')el.style.width='805px';
  el.textContent=lang==='en'?b.en:lang==='zh-Hant'?[...b.zh].map(c=>traditional[c]||c).join(''):b.zh;
  const rgb=b.color.match(/\d+/g)?.map(Number);el.style.color=rgb&&rgb.slice(0,3).every(v=>v<100)?'#c7cccf':b.color;el.style.fontFamily=lang==='en'?'Arial,sans-serif':'"Microsoft YaHei","PingFang SC",sans-serif';el.style.fontSize=b.font+'px';el.style.lineHeight='1.25';el.style.whiteSpace='normal';el.style.overflowWrap='anywhere';el.style.height=b.height+'px';
  let size=b.font;while(size>Math.max(12,b.font*.6)&&(el.scrollHeight>b.height+2||el.scrollWidth>el.clientWidth+2)){size-=.5;el.style.fontSize=size+'px';}
 }
}
