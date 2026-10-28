import {createZiboProject} from './zibo-project.js';
import {createChangzhiProject,czImage} from './changzhi-project.js';
import {projects} from './data.js';
const zibo=projects.find(p=>p.id==='p1');
const ziboImage=term=>{const im=zibo.images.find(im=>im.path.includes(term))||zibo.images[0];return im.preview||im.src;};
const img=(src,alt)=>{const image=document.createElement('img');image.src=src;image.alt=alt;image.loading='lazy';return image;};
document.querySelector('.cd-hero-media').append(img(czImage(853),'悬塑的数字光影'));
document.querySelector('[data-case="changzhi"]').append(img(czImage(837,1),'观音堂悬塑细节'));
document.querySelector('[data-case="zibo"]').append(img(ziboImage('Qi_Culture_Immersive_Mirror'),'齐文化沉浸空间'));
const concepts=[['01 / 文化资源','文化资源','先理解，才有转化。','文化的起点可能是实体遗产，也可能是文本、故事和观念。长治从造像、古建与器物出发；淄博从齐文化典籍、地方档案与文化知识出发。'],['02 / 数字记录','数字记录','让资源进入可研究的形态。','实体遗产通过影像与扫描形成数字记录；典籍与档案通过整理、比照和关系梳理形成研究材料。记录的方法不同，都需要保留内容的来处。'],['03 / 文化阐释','文化阐释','在信息之间，建立可理解的关系。','从悬塑的个体细节与整体语境，到齐文化的价值主题与历史联系，设计选择观看的尺度、组织叙事的顺序，让信息逐步转化为理解。'],['04 / 公共体验','公共体验','让内容与人真正相遇。','实时影像、交互装置、投影与空间组织，让文化不只停留在文件里。观看、行走、探索与选择，把数字表达转化为个人经验。']];
const flow=document.querySelector('.cd-concept-flow'),detail=document.querySelector('.cd-concept-detail');
function showConcept(i){flow.querySelectorAll('button').forEach((b,j)=>{b.classList.toggle('is-active',i===j);b.setAttribute('aria-pressed',String(i===j));});detail.innerHTML=`<h3>${concepts[i][2]}</h3><p>${concepts[i][3]}</p>`;}
concepts.forEach((c,i)=>{const b=document.createElement('button');b.type='button';b.innerHTML=`<small>${c[0]}</small><strong>${c[1]}</strong>`;b.onclick=()=>showConcept(i);flow.append(b);});showConcept(0);
createChangzhiProject(document.querySelector('#cd-changzhi'));
document.querySelector('#toggle-changzhi').onclick=e=>{const section=document.querySelector('#cd-changzhi');section.hidden=!section.hidden;e.currentTarget.setAttribute('aria-expanded',String(!section.hidden));e.currentTarget.textContent=section.hidden?'展开完整项目 +':'收起完整项目 −';};
createZiboProject(document.querySelector('#cd-zibo'));
let paused=matchMedia('(prefers-reduced-motion: reduce)').matches;
function setMotion(){document.documentElement.classList.toggle('cd-pause',paused);document.body.classList.toggle('cd-pause',paused);document.body.classList.toggle('reduce-motion',paused);const b=document.querySelector('#cd-motion');b.setAttribute('aria-pressed',String(paused));b.textContent=paused?'开启动效':'暂停动效';document.dispatchEvent(new CustomEvent('portfolio-preferences'));}
document.querySelector('#cd-motion').onclick=()=>{paused=!paused;setMotion();};matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{paused=e.matches;setMotion();});setMotion();
let queued=false;function progress(){queued=false;const h=document.documentElement.scrollHeight-innerHeight;document.querySelector('.cd-progress').style.transform=`scaleX(${h>0?scrollY/h:0})`;const ids=['concept','changzhi','zibo','compare'];let active='';for(const id of ids)if(document.getElementById(id).getBoundingClientRect().top<innerHeight*.4)active=id;document.querySelectorAll('.cd-nav nav a').forEach(a=>{a.classList.toggle('is-active',a.hash==='#'+active);if(a.hash==='#'+active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}
addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(progress);}},{passive:true});addEventListener('resize',progress);progress();
