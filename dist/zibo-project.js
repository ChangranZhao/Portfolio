import {projects} from './data.js';
import {openProjectDetails} from './project-details.js';
import {initGlobalLanguage} from './localization.js';
const project=projects.find(p=>p.id==='p1');
function openImage(images,index=0){
 const dialog=document.createElement('dialog');dialog.className='zibo-images';
 dialog.innerHTML='<img><footer><button type="button" data-prev aria-label="上一张">←</button><span></span><button type="button" data-next aria-label="下一张">→</button><button type="button" data-close>关闭 ×</button></footer>';
 const render=()=>{const item=images[index];dialog.querySelector('img').src=item.src||item.preview;dialog.querySelector('img').alt=item.name||project.title;dialog.querySelector('span').textContent=`${index+1} / ${images.length}`;dialog.querySelector('[data-prev]').disabled=images.length<2;dialog.querySelector('[data-next]').disabled=images.length<2;};
 dialog.querySelector('[data-prev]').onclick=()=>{index=(index-1+images.length)%images.length;render();};dialog.querySelector('[data-next]').onclick=()=>{index=(index+1)%images.length;render();};dialog.querySelector('[data-close]').onclick=()=>dialog.close();dialog.addEventListener('close',()=>dialog.remove(),{once:true});dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});document.body.append(dialog);render();dialog.showModal();
}
export function createZiboProject(mount){const dispose=openProjectDetails(project,{mount,openImage,openGallery:()=>openImage(project.images)});initGlobalLanguage('zh');return dispose;}
