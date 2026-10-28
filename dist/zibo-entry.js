import {createZiboProject} from './zibo-project.js';
createZiboProject(document.querySelector('#zibo-root'));
function preferences(motion){document.body.classList.toggle('reduce-motion',motion);document.dispatchEvent(new Event('portfolio-preferences'));}
preferences(matchMedia('(prefers-reduced-motion: reduce)').matches);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>preferences(e.matches));
addEventListener('message',e=>{if(e.source!==parent||e.origin!==location.origin)return;if(e.data?.type==='portfolio-preferences')preferences(Boolean(e.data.motion));if(e.data?.type==='portfolio-culture-active'){document.body.classList.toggle('project-suspended',!e.data.active);document.dispatchEvent(new Event('portfolio-preferences'));}});
