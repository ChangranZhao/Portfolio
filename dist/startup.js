import {projects} from './data.js';
import {projectWarmups} from './startup-assets.js';
import {preloadResources} from './startup-preload.js';
const screen=document.getElementById('startup-screen'),controller=new AbortController();
let finished=!screen,timer;
const finish=()=>{finished=true;clearTimeout(timer);controller.abort();screen?.remove();};
window.addEventListener('creativeos-startup-finished',finish,{once:true});
async function preload(){
 if(finished)return;
 const chinese=document.documentElement.lang.startsWith('zh');
 const label=screen.querySelector('.startup-label'),phase=document.getElementById('startup-phase'),count=document.getElementById('startup-count');
 label.textContent=chinese?'正在为你准备 Creative OS…':'Preparing your Creative OS…';
 screen.setAttribute('aria-label',chinese?'正在启动 Creative OS…':'Starting Creative OS…');
 document.getElementById('startup-skip').textContent=chinese?'直接进入 ↗':'Enter now ↗';
 const fonts=['assets/inter-latin.woff2','assets/figma-fonts/Arimo-400.woff2','assets/figma-fonts/Arimo-700.woff2','assets/figma-fonts/IBMPlexMono-400.woff2'];
 if(chinese)fonts.unshift('assets/fonts/source-han-sans-cn-400.woff2');
 const desktop=[...document.querySelectorAll('#desktop img,.menubar img,#dock img')].map(img=>img.currentSrc||img.src).filter(Boolean);
 const wallpaper=getComputedStyle(document.querySelector('.wallpaper')).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
 const linked=new URLSearchParams(location.hash.slice(1)).get('project');
 const selected=[...(projectWarmups[linked]||[]),...Object.values(projectWarmups).map(images=>images[0]).filter(Boolean)];
 const covers=projects.slice(0,8).map(p=>p.images[0]?.preview||p.images[0]?.thumb).filter(Boolean);
 const tasks=[...fonts,...(wallpaper?[wallpaper]:[]),...selected.slice(0,8),...desktop,...covers].map(url=>new URL(url,location.href).href);
 phase.textContent=chinese?'正在准备你的桌面':'Preparing your workspace';
 const result=await preloadResources(tasks,{signal:controller.signal,concurrency:3,
  load:async url=>{const response=await fetch(url,{signal:controller.signal,priority:'low',cache:'force-cache'});if(!response.ok)throw Error(response.status);await response.arrayBuffer();},
  onProgress:({total,completed})=>{if(finished)return;const value=Math.round(completed/total*100);document.getElementById('startup-fill').style.transform='scaleX('+value/100+')';document.getElementById('startup-percent').textContent=String(value).padStart(2,'0')+'%';screen.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',value);count.textContent=String(completed).padStart(2,'0')+' / '+total;phase.textContent=value<30?(chinese?'正在准备你的桌面':'Preparing your workspace'):value<85?(chinese?'正在加载精选作品':'Loading selected works'):(chinese?'即将开启探索':'Ready to explore');}
 });
 if(finished)return;
 phase.textContent=result.failed?(chinese?'部分资源将在浏览时继续加载':'Remaining resources load as you browse'):(chinese?'准备就绪，欢迎到来':'Ready. Make yourself at home.');
 timer=setTimeout(()=>window.finishCreativeOSStartup?.(),Math.max(0,5000-(Date.now()-window.creativeOSBootStarted)));
}
if(window.creativeOSReady)preload();else window.addEventListener('creativeos-ready',preload,{once:true});
