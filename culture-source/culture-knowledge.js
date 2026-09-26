import {archiveAssets} from './archive-assets.js';

// These are curatorial associations across periods, not claims of provenance.
export const cultureThemes = [
 {cn:'尊贤尚功',en:['VALUING ABILITY','& ACHIEVEMENT'],words:['任能','技艺','创造'],note:'从器物制作与生产技艺，观察知识、能力与创造的价值。',samples:[60,43,17,20,40,52]},
 {cn:'包容开放',en:['INCLUSIVENESS','& OPENNESS'],words:['交流','多元','互通'],note:'从装饰、交通与城市空间，联读齐地交流与多元文化。',samples:[56,49,45,35,24,50]},
 {cn:'务实应变',en:['PRAGMATISM','& ADAPTATION'],words:['器用','因时','革新'],note:'从日用器物到生产设备，理解功能需求与技术适应。',samples:[1,58,19,23,44,51]},
 {cn:'工商兴业',en:['COMMERCE','& INDUSTRY'],words:['交换','制造','流通'],note:'将货币、度量与工业档案并置，呈现生产和交换的主题。',samples:[9,15,11,25,14,42]},
];
const byCategory = [[0,2,3],[1,3],[0,2],[1,2],[1],[1,3],[1,2],[0,2,3]];
export function themesFor(asset){return asset.themes|| (asset.title.includes('铜量')?[2,3]:byCategory[asset.category]||[]);}
export function matchesTheme(asset,theme){return theme===null||themesFor(asset).includes(theme);}
export const themeCounts=cultureThemes.map((_,i)=>archiveAssets.filter(a=>matchesTheme(a,i)).length);
export const knowledgeSources=[
 {label:'齐文化精神 · 淄博市人社局',url:'https://hrss.zibo.gov.cn/art/2020/12/7/art_1060_2054972.html'},
 {label:'创新与重商 · 淄博市文化旅游规划',url:'https://www.zibo.gov.cn/gongkai/site_srmzfbgs/channel_shifubanwenjian/doc_62a19db8410e00ccde4ed511.html'},
];
