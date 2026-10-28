import {localizeChangzhi} from './changzhi-language.js';
import {changzhiPages} from './changzhi-assets.js';
export const changzhiChapters=[['项目概览','cz-overview'],['全馆关联图谱','cz-atlas'],['龙门寺','cz-longmen'],['观音堂悬塑','cz-guanyin'],['法华罐','cz-fahua'],['良候店石窟','cz-particles']];
const get=id=>changzhiPages.find(p=>p.id==='928:'+id);
export const czImage=(id,index=0)=>get(id).images.filter(s=>!s.endsWith('.svg'))[index];
const groups=['山川与时间','器物与历史','神圣空间','彩绘记忆','工艺与结构','神话与游玩','活态文化'];
const methods=['采集','重建','动画','投影','交互'];
const titles={853:'遗产再发现',973:'全馆展项关联图谱',1130:'从现场到数字证据',956:'多路径采集',1292:'龙门寺现场档案',1341:'从摄影到点云',1372:'高斯泼溅重建',867:'从数字文件到现场',822:'与悬塑近距离相遇',837:'表面采集与空间记录',880:'从形态到意义',899:'让影像进入空间',906:'法华罐的数字重建',913:'扫描、修补与纹样重绘',814:'良候店石窟：粒子重建',933:'从历史资料到粒子转场'};
function board(id,number){const p=get(id);return `<figure class="cz-primary-board" data-board-id="${id}"><figcaption><span>${String(number).padStart(2,'0')} / ${titles[id]}</span><button type="button" data-zoom aria-pressed="false">放大阅读 ↗</button></figcaption><div class="cz-board-scroll"><iframe class="cz-primary-frame" data-board-frame src="${p.page}" title="${titles[id]} · 原始设计图板" loading="${number<3?'eager':'lazy'}"></iframe></div></figure>`;}
const chapter=(id,no,title,copy,boards)=>`<section class="cz-primary-chapter" id="${id}"><header class="cz-primary-heading"><span>${no}</span><div><h2>${title}</h2><p>${copy}</p></div></header>${boards.map(([id,n])=>board(id,n)).join('')}</section>`;
export function createChangzhiProject(root,{openImage}={}){
 root.classList.add('cz-project','cz-board-led');
 root.innerHTML=`<section id="cz-overview" class="cz-primary-intro">${board(853,1)}<div class="cz-primary-abstract"><span>长治博物馆 / 数字遗产</span><p>从现场采集到数字重建，再到空间中的相遇。通过全馆展项图谱，理解文化内容如何连接不同的数字表达方法。</p><a href="#cz-atlas">从全馆图谱开始 ↓</a></div></section>
 <section id="cz-atlas" class="cz-primary-atlas"><header class="cz-primary-heading"><span>01 / 全馆展项图谱</span><div><h2>23 个展项，<br>一张相互关联的文化网络。</h2><p>沿着连线，从文化主题读到展项，再读到数字方法。悬停展项或点击主题、方法，查看它们在整个博物馆中的关系。</p></div></header><div class="cz-atlas-controls"><div class="cz-atlas-control-row"><span>文化主题</span><button type="button" data-atlas-mode="all" data-value="-1" aria-pressed="true" class="is-active">全部</button>${groups.map((n,i)=>`<button type="button" data-atlas-mode="theme" data-value="${i}" aria-pressed="false">${n}</button>`).join('')}</div><div class="cz-atlas-control-row"><span>数字方法</span>${methods.map((n,i)=>`<button type="button" data-atlas-mode="method" data-value="${i}" aria-pressed="false">${n}</button>`).join('')}</div></div>${board(973,2)}<div class="cz-atlas-inspector" aria-live="polite"><div><span class="cz-atlas-status">全馆关联 / 23 个展项</span><p class="cz-atlas-caption">保留图板中的文化主题、展项图像和原始连线。选择一个展项，查看它所关联的数字方法。</p></div><div class="cz-atlas-actions"><button type="button" data-atlas-image hidden>放大展项图像 ↗</button><a data-atlas-jump hidden>阅读案例 ↓</a></div></div></section>
 ${chapter('cz-longmen','02 / 龙门寺','龙门寺：从场所到数字证据','采集整体空间与建筑细部，在现场与模型之间反复核对，逐步建立完整的数字表达。',[[1130,3],[956,4],[1292,5],[1341,6],[1372,7],[867,8]])}
 ${chapter('cz-guanyin','03 / 观音堂','观音堂：从表面到空间','记录悬塑的细节与殿堂中的关系，再通过光、动态影像和半透明屏幕重新组织观看。',[[822,9],[837,10],[880,11],[899,12]])}
 ${chapter('cz-fahua','04 / 法华罐','法华罐：从形态到纹样','从影像扫描、几何修补到纹样重绘，沿着器物的结构与装饰展开数字重建。',[[906,13],[913,14]])}
 ${chapter('cz-particles','05 / 良候店石窟','良候店石窟：从记录到重现','将现场观察与历史资料连接起来，以粒子系统研究形态的生成与转场。',[[814,15],[933,16]])}
 <footer class="cz-primary-footer"><span>长治博物馆 / 文化内容 → 展项 → 数字方法</span><a href="#cz-atlas">回到全馆关联图谱 ↑</a></footer>`;
 const language=()=>document.documentElement.lang==='zh-CN'?'zh':document.documentElement.lang;
 localizeChangzhi(root,language());
 const controller=new AbortController(),signal=controller.signal;let dialog,selected=null;
 const frames=[...root.querySelectorAll('[data-board-frame]')],atlas=root.querySelector('[data-board-id="973"] iframe');
 const motion=()=>!matchMedia('(prefers-reduced-motion: reduce)').matches&&!document.body.classList.contains('reduce-motion');
 function showImage(src,name){if(openImage){openImage([{src,name}],0,name);return;}dialog??=document.createElement('dialog');dialog.className='cz-lightbox';dialog.innerHTML='<button type="button" aria-label="关闭图片">×</button><img><p></p>';dialog.querySelector('img').src=src;dialog.querySelector('img').alt=name;dialog.querySelector('p').textContent=name;document.body.append(dialog);dialog.querySelector('button').onclick=()=>dialog.close();dialog.onclick=e=>{if(e.target===dialog)dialog.close();};dialog.showModal();}
 function activeButtons(mode,value){root.querySelectorAll('[data-atlas-mode]').forEach(b=>{const active=b.dataset.atlasMode===mode&&Number(b.dataset.value)===value;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active));});}
 function notify(frame,active){if(frame.contentDocument?.body)localizeChangzhi(frame.contentDocument,language());frame.contentWindow?.postMessage({type:'portfolio-preferences',motion:!motion()},location.origin);frame.contentWindow?.postMessage({type:'changzhi-board-visible',active},location.origin);}
 const visible=new Set(),observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting)visible.add(e.target);else visible.delete(e.target);notify(e.target,e.isIntersecting);}},{threshold:.05});
 frames.forEach(f=>{observer.observe(f);f.addEventListener('load',()=>notify(f,visible.has(f)),{signal});});
 document.addEventListener('portfolio-preferences',()=>{localizeChangzhi(root,language());frames.forEach(f=>notify(f,visible.has(f)));},{signal});
 matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>frames.forEach(f=>notify(f,visible.has(f))),{signal});
 root.addEventListener('click',e=>{const filter=e.target.closest('[data-atlas-mode]');if(filter){const mode=filter.dataset.atlasMode,selection=Number(filter.dataset.value);activeButtons(mode,selection);atlas.contentWindow?.postMessage({type:'changzhi-atlas-filter',mode,selection},location.origin);}
 const zoom=e.target.closest('[data-zoom]');if(zoom){const figure=zoom.closest('figure'),wide=figure.classList.toggle('cz-board-zoomed');zoom.setAttribute('aria-pressed',String(wide));zoom.textContent=wide?'适应宽度 ↙':'放大阅读 ↗';}
 if(e.target.closest('[data-atlas-image]')&&selected)showImage(selected.image,selected.name);
 const link=e.target.closest('a[href^="#cz-"]');if(link){e.preventDefault();root.querySelector(link.getAttribute('href'))?.scrollIntoView({behavior:motion()?'smooth':'instant',block:'start'});}
 },{signal});
 window.addEventListener('message',e=>{if(e.origin!==location.origin||!frames.some(f=>f.contentWindow===e.source))return;const d=e.data;
 if(d?.type==='changzhi-board-image'){showImage(d.src,d.name);return;}
 if(d?.type!=='changzhi-atlas'||e.source!==atlas.contentWindow)return;
 if(d.filter){activeButtons(d.filter,d.selection);return;}
 if(d.ready){atlas.dataset.ready='true';return;}
 const status=root.querySelector('.cz-atlas-status'),caption=root.querySelector('.cz-atlas-caption'),imageButton=root.querySelector('[data-atlas-image]'),jump=root.querySelector('[data-atlas-jump]');
 if(Number.isInteger(d.index)){selected=d;status.textContent=String(d.index+1).padStart(2,'0')+' / '+d.name;caption.textContent='关联的数字方法：'+d.methods.join(' · ');imageButton.hidden=false;const target={8:'cz-particles',9:'cz-longmen',10:'cz-guanyin',14:'cz-fahua'}[d.index];jump.hidden=!target;if(target){jump.href='#'+target;jump.textContent='阅读'+d.name+'案例 ↓';}}
 else if(typeof d.count==='number'){selected=null;imageButton.hidden=true;jump.hidden=true;status.textContent=(d.mode==='theme'?groups[d.selection]:d.mode==='method'?methods[d.selection]:'全馆关联')+' / '+d.count+' 个展项';caption.textContent='高亮连线保留原图板的对应关系；其余展项淡出，便于追踪内容如何转化为数字表达。';}
 },{signal});
 return ()=>{controller.abort();observer.disconnect();dialog?.remove();root.classList.remove('cz-project','cz-board-led');};
}
