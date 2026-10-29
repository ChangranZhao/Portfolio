// A short, bounded first-screen preload. Never download all full-size works here.
const screen=document.getElementById('startup-screen');
const fill=document.getElementById('startup-fill');
const percent=document.getElementById('startup-percent');
let finished=false;
const finish=()=>{if(finished)return;finished=true;screen?.remove();};
window.addEventListener('creativeos-startup-finished',finish,{once:true});
function preload(){
 if(finished)return;
 const urls=[...new Set([...document.querySelectorAll('#desktop img,.menubar img,#dock img')].map(img=>img.currentSrc||img.src).filter(Boolean))];
 const wallpaper=getComputedStyle(document.querySelector('.wallpaper')).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
 if(wallpaper)urls.unshift(wallpaper);
 let completed=0,index=0;
 const update=()=>{if(finished)return;const value=urls.length?Math.round(completed/urls.length*100):100;fill.style.width=value+'%';percent.textContent=value+'%';screen.querySelector('[role="progressbar"]').setAttribute('aria-valuenow',value);};
 async function worker(){while(index<urls.length&&!finished){const src=urls[index++];await new Promise(resolve=>{const image=new Image();image.onload=image.onerror=()=>{image.onload=image.onerror=null;resolve();};image.src=src;if(image.complete)resolve();});completed++;update();}}
 update();Promise.all(Array.from({length:4},worker)).then(()=>{if(!finished)window.finishCreativeOSStartup?.();});
}
if(window.creativeOSReady)preload();else window.addEventListener('creativeos-ready',preload,{once:true});
