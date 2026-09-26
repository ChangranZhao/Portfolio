import React from 'react';
import {archiveAssets} from './archive-assets.js';
import {cultureThemes,themeCounts} from './culture-knowledge.js';
import {localizeAsset,themeEnglish} from './localization.js';

export default function KnowledgeGraph({active,onTheme,onSelect,lang='zh'}){
 const tr=(zh,en)=>lang==='zh'?zh:en;
 const activate=(e,fn)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn()}};
 // Two opposing archive planes and a third attribute plane form an open volume.
 const planes=[{x:64,y:300,a:.86,b:-.42},{x:64,y:410,a:.86,b:-.42},{x:48,y:523,a:.78,b:.208},{x:48,y:632,a:.78,b:.208}];
 return <svg className="knowledge-graph" viewBox="0 0 1440 940" role="group" aria-label={tr('齐文化资料与文化属性知识图谱','Qi cultural knowledge graph')}>
  <defs><linearGradient id="flow"><stop stopColor="#70808a" stopOpacity=".65"/><stop offset="1" stopColor="#bec4c3" stopOpacity=".28"/></linearGradient></defs>
  <g className="graph-guides" fill="none" stroke="#424749" strokeWidth=".6">
   <path d="M25 289 Q0 229 56 219 M49 214 l7 5 -9 2 M26 317 V794 Q26 839 66 858 M79 830 L339 899 L441 836 L181 767 Z"/>
   {[0,1,2].map(i=><path key={i} d={`M79 ${840+i*9} L339 ${909+i*9} L441 ${846+i*9}`}/>)}
  </g>
  <g transform="matrix(.86 -.42 0 1 64 252)"><text className="graph-kicker">{tr('01 / 文物与工业档案','01 / OBJECTS & INDUSTRIAL ARCHIVES')}</text><text y="20" className="graph-section">{tr('资料输入 · 跨时代的文化切片','ARCHIVE INPUT · CULTURAL FRAGMENTS')}</text></g>
  <g transform="matrix(.9 .24 0 1 465 168)"><text className="graph-kicker">{tr('02 / 文化属性','02 / CULTURAL ATTRIBUTES')}</text><text y="22" className="graph-section">{tr('关联转译 · 多元共生','RELATE · TRANSLATE · CONNECT')}</text></g>
  {cultureThemes.map((theme,i)=>{
   const p=planes[i],y=224+i*133, dim=active!==null&&active!==i;
   return <g key={theme.cn} className={'graph-lane '+(dim?'muted':'')}>
    <g className="graph-connections" fill="none" stroke="url(#flow)" strokeWidth={active===i?1.4:.65}>
     {theme.samples.map((_,j)=>{const x=p.x+(j*59+26)*p.a,sy=p.y+(j*59+26)*p.b+86;return <path key={j} d={`M${x} ${sy} C${x+65} ${sy+100-i*24}, ${402+j*17} ${y-100+j*25}, 465 ${y+45}`}/>})}
     {[0,1,2,3,4].map(j=><path key={j} d={`M642 ${y+83+j*6} C${730+j*16} ${y+83+j*9}, ${765-j*8} ${350+i*50+j*7}, ${913+j*7} ${340+i*65+j*8}`}/>)}
    </g>
    <g transform={`matrix(${p.a} ${p.b} 0 1 ${p.x} ${p.y})`} className="archive-plane">
     <path d="M-8 -10 H354 V96 H-8 Z M-8 96 l6 6 h354 V-4 l-6 -6" fill="#080909" stroke="#515557" strokeWidth=".7"/>
     {theme.samples.map((index,j)=>{const a=localizeAsset(archiveAssets[index],lang),name=a.title.replace(/^(淄博 · |Zibo · )/,'');return <g key={index} transform={`translate(${j*59} 0)`} role="button" tabIndex="0" aria-label={tr('查看资料：','View archive: ')+a.title} className={a.story?"archive-node story-node":"archive-node"} onClick={()=>onSelect(archiveAssets[index])} onKeyDown={e=>activate(e,()=>onSelect(archiveAssets[index]))}>
      <title>{a.title}</title><rect width="53" height="86" fill="#080909" stroke="#767b7c" strokeWidth=".7"/>
      <image href={a.thumb||a.src} width="49" height="57" x="2" y="2" preserveAspectRatio="xMidYMid slice"/>
      <text x="4" y="69" style={{fontSize:lang==='en'?5.5:7}}>{name.length>(lang==='en'?16:7)?name.slice(0,lang==='en'?15:6)+'…':name}</text><text x="4" y="80" className="node-number">{String(index+1).padStart(2,'0')} / {a.story?tr('故事','STORY'):a.src.includes('industry')?tr('工业','IND.'):tr('文物','OBJ.')}</text>
     </g>})}
    </g>
    <g transform={`matrix(.9 .24 0 1 465 ${y})`} role="button" tabIndex="0" aria-label={tr('文化属性：','Cultural theme: ')+tr(theme.cn,themeEnglish[i].short)} aria-pressed={active===i} className={'theme-node '+(active===i?'selected':'')} onClick={()=>onTheme(active===i?null:i)} onKeyDown={e=>activate(e,()=>onTheme(active===i?null:i))}>
     <path d="M0 0 H196 V106 H0 Z M196 0 l8 -6 v106 l-8 6" fill="#080a0a" stroke="currentColor" strokeWidth=".8"/>
     <text x="13" y="18" className="theme-order">0{i+1} / {tr('文化精神','CULTURAL SPIRIT')}</text>
     {lang==='zh'?<text x="13" y="49" className="theme-cn">{theme.cn}</text>:<text x="13" y="41" className="theme-en">{theme.en[0]}<tspan x="13" dy="16">{theme.en[1]}</tspan></text>}
     <path d="M13 68 H182" stroke="currentColor" strokeWidth=".4"/>
     <text x="13" y="84" className="theme-tags">{tr(theme.words.join(' · '),themeEnglish[i].tags)}</text>
     <text x="13" y="98" className="theme-tags">{themeCounts[i]} {tr('份关联资料','RELATED ARCHIVES')}</text>
    </g>
   </g>
  })}
  <g className="graph-foundation" transform="translate(103 833) scale(.72)">
   <text className="graph-kicker">{tr('文化积层','CULTURAL STRATA')}</text>
   {[tr('器物与制度','Objects & order'),tr('技艺与生产','Craft & making'),tr('城市与交流','Cities & exchange')].map((s,i)=><g key={s} transform={`translate(${i*94} ${i*25+22})`}><path d="M0 0 l75 20 26 -16 -75 -20 Z M0 0 v34 l75 20 26 -16 V-16 M75 20 v34" fill="#080a0a" stroke="#5b6264" strokeWidth=".65"/><text x="6" y="26" transform="skewY(15)">{s}</text></g>)}
  </g>
  <text x="494" y="856" className="graph-kicker graph-explanation">{tr('分类 → 关联 → 汇聚','RELATE → TRANSLATE → CONVERGE')}</text>
  <text x="494" y="879" className="graph-caption graph-explanation">{tr('跨越时代，在共同主题下重新相遇。','Across eras, connected through shared themes.')}</text>
 </svg>
}
