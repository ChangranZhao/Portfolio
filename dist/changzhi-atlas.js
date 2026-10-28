// Enrich the original Figma composition; all connecting paths retain their authored geometry.
const canvas=document.querySelector('.figma-canvas');
const node=id=>document.querySelector(`[data-node-id="928:${id}"]`);
const cards=[...document.querySelectorAll('[data-name]')].filter(n=>/^\d{2} \/ /.test(n.dataset.name));
const methods=[1122,1123,1124,1125,1126].map(node);
const themes=[1046,1047,1048,1049,1050,1051,1052].map(node);
const groupFor=i=>i<3?0:i<8?1:i<11?2:i<13?3:i<17?4:i<20?5:6;
const names=['地质史诗剧场','上党高地','飞越上党','玉戚 · 透明屏','小神与二里头','钟磬和鸣','分水岭车马坑','繁盛潞州','良候店石窟','龙门寺','观音堂悬塑','大云院壁画','孝义叙事','五凤楼藻井','法华镂空罐','火与砂工坊','琉璃无限空间','后羿射日','精卫填海','女娲补天','上党戏曲','美食投影','方言互动'];
const methodNames=['采集','重建','动画','投影','交互'];
const diagram=node(977),original=diagram.querySelector('img'),object=document.createElement('object');
object.type='image/svg+xml';object.data=original.getAttribute('src');object.style.cssText=original.style.cssText;object.style.pointerEvents='none';object.setAttribute('aria-hidden','true');original.replaceWith(object);
let links=[],mode='all',selection=-1,hover=-1;
const post=data=>parent.postMessage({type:'changzhi-atlas',...data},location.origin);
const box=el=>{const r=el.getBoundingClientRect(),c=canvas.getBoundingClientRect(),scale=c.width/1920;return {x:(r.x-c.x)/scale,y:(r.y-c.y)/scale,w:r.width/scale,h:r.height/scale};};
const nearest=(p,points)=>points.reduce((best,q,i)=>{const d=Math.hypot(p.x-q.x,p.y-q.y);return d<best.d?{i,d}:best;},{i:-1,d:Infinity});
function mapPaths(){const svg=object.contentDocument?.querySelector('svg');if(!svg)return;const d=box(diagram),v=svg.viewBox.baseVal;
 const positions=cards.map(box),methodPositions=methods.map(box);
 links=[...svg.querySelectorAll('path')].map(path=>{const a=path.getPointAtLength(0),b=path.getPointAtLength(path.getTotalLength()),global=p=>({x:d.x+p.x*d.w/v.width,y:d.y+p.y*d.h/v.height});const start=global(a),end=global(b);const outgoing=nearest(start,positions.map(r=>({x:r.x+r.w/2,y:r.y+r.h})));const incoming=nearest(end,positions.map(r=>({x:r.x+r.w/2,y:r.y})));const isMethod=end.y>940;const method=isMethod?nearest(end,methodPositions.map(r=>({x:r.x+r.w/2,y:r.y}))).i:-1;const owner=isMethod?outgoing.i:incoming.i;path.style.transition=document.body.classList.contains('reduce-motion')?'none':'opacity .25s,stroke-width .25s';return {path,owner,method,opacity:path.getAttribute('opacity')||'1',width:path.getAttribute('stroke-width')||'1'};});
 post({ready:true,links:links.length});render();}
function render(){const focused=hover>=0?hover:mode==='exhibit'?selection:-1;const matched=i=>focused>=0?i===focused:mode==='theme'?groupFor(i)===selection:mode==='method'?links.some(l=>l.owner===i&&l.method===selection):true;
 cards.forEach((c,i)=>{const yes=matched(i);c.style.opacity=yes?'1':'.17';c.style.filter=yes?'none':'saturate(.25)';c.classList.toggle('atlas-selected',focused===i);c.setAttribute('aria-pressed',String(mode==='exhibit'&&selection===i));});
 links.forEach(l=>{const active=mode!=='all'||focused>=0,yes=matched(l.owner)&&(mode!=='method'||l.method===selection||l.method<0);l.path.style.opacity=active?(yes?'1':'.025'):l.opacity;l.path.style.strokeWidth=active&&yes?'2.5':l.width;});
 methods.forEach((m,i)=>{const yes=mode==='all'&&focused<0||links.some(l=>matched(l.owner)&&l.method===i&&(mode!=='method'||i===selection));m.style.opacity=yes?'1':'.25';m.classList.toggle('atlas-selected',mode==='method'&&selection===i);});
 themes.forEach((t,i)=>{t.style.opacity=cards.some((_,j)=>groupFor(j)===i&&matched(j))?'1':'.25';});
 if(focused>=0)post({index:focused,name:names[focused],methods:[...new Set(links.filter(l=>l.owner===focused&&l.method>=0).map(l=>methodNames[l.method]))],image:cards[focused].querySelector('img').src});
 else post({mode,selection,count:cards.filter((_,i)=>matched(i)).length});
}
function button(el,label,fn){el.tabIndex=0;el.setAttribute('role','button');el.setAttribute('aria-label',label);el.style.cursor='pointer';el.addEventListener('click',fn);el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();fn();}});}
cards.forEach((c,i)=>{button(c,names[i]+'：查看数字方法关联',()=>{mode='exhibit';selection=i;hover=-1;render();post({filter:mode,selection});});c.addEventListener('pointerenter',()=>{hover=i;render();});c.addEventListener('pointerleave',()=>{hover=-1;render();});c.addEventListener('focus',()=>{hover=i;render();});c.addEventListener('blur',()=>{hover=-1;render();});c.querySelector('img').alt=names[i];});
themes.forEach((t,i)=>button(t,t.textContent.trim(),()=>{mode='theme';selection=i;hover=-1;render();post({filter:mode,selection});}));
methods.forEach((m,i)=>button(m,methodNames[i],()=>{mode='method';selection=i;hover=-1;render();post({filter:mode,selection});}));
const style=document.createElement('style');style.textContent='[role=button]{transition:opacity .25s,filter .25s;outline-offset:7px}[role=button]:focus-visible,.atlas-selected{outline:2px solid #c5a779}body.reduce-motion *{transition:none!important}';document.head.append(style);
object.addEventListener('load',mapPaths);
addEventListener('message',e=>{if(e.origin!==location.origin||e.source!==parent)return;if(e.data?.type==='changzhi-atlas-filter'){mode=e.data.mode;selection=e.data.selection;hover=-1;render();}if(e.data?.type==='portfolio-preferences'){document.body.classList.toggle('reduce-motion',Boolean(e.data.motion));links.forEach(l=>l.path.style.transition=e.data.motion?'none':'opacity .25s,stroke-width .25s');}});
