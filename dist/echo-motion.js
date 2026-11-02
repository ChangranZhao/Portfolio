import {createActivityClock} from './runtime-scheduling.js';

// A few quiet pauses in the performance album; documentary spreads stay still.
const sequences = {
 15774: [
  [[15780,15781],0],[[15778,15779],.8],[[15785,15786],1.8],
  [[15787],3,'line'],[[15788],3.4],[[15789],4.5],[[15790],5.6]
 ],
 15675: [
  [[15680,15681,15682,15683],0],[[15684,15685,15686,15687],1.6],
  [[15689],2.5],[[15690],3.5],[[15693],4.5],[[15696],5.5],[[15699,15700],6.5]
 ],
 15550: [
  [[15555,15556,15557],0],[[15558,15559,15560,15561],1.1],[[15562,15563,15564,15565],2.2],
  [[15566],3.2],[[15569],4.2],[[15572],5.2],[[15575],6.2],[[15578,15579],7.2]
 ],
 15507: [
  [[15510],0],[[15513],1.2],[[15516],2.4],[[15519,15520,15521],3.6],
  [[15522],4.8],[[15526],6],[[15530],7.2]
 ]
};

export function setupEchoMotion(doc,section,article,signal,reduced){
 const groups=Object.entries(sequences).find(([id])=>doc.querySelector(`[data-node-id="678:${id}"]`))?.[1];
 if(!groups||reduced()||signal.aborted)return;
 const clock=createActivityClock(doc,signal),pieces=[];
 const style=doc.createElement('style');
 style.textContent=`
 .echo-album-piece{opacity:0}
 .echo-album-playing .echo-album-piece{animation:echo-album-develop 1.3s ease-out both;animation-delay:var(--echo-delay)}
 .echo-album-playing .echo-album-line{animation-name:echo-album-rule}
 @keyframes echo-album-develop{from{opacity:0}to{opacity:1}}
 @keyframes echo-album-rule{from{opacity:0;clip-path:inset(0 100% 0 0)}to{opacity:1;clip-path:inset(0)}}
 `;
 doc.head.append(style);
 for(const [ids,delay,kind] of groups)for(const id of ids){
  const el=doc.querySelector(`[data-node-id="678:${id}"]`);
  if(!el)continue;
  el.classList.add('echo-album-piece');
  if(kind==='line')el.classList.add('echo-album-line');
  el.style.setProperty('--echo-delay',delay+'s');pieces.push(el);
 }
 let played=false;
 const finish=()=>{
  clock.dispose();
  for(const el of pieces){el.classList.remove('echo-album-piece','echo-album-line');el.style.removeProperty('--echo-delay');}
  doc.body.classList.remove('echo-album-playing');style.remove();
 };
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;
  played=true;observer.disconnect();
  if(reduced()){finish();return;}
  doc.body.classList.add('echo-album-playing');clock.setTimeout(finish,9000);
 },{root:article,threshold:.25});
 observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{if(reduced()){played=true;observer.disconnect();finish();}},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
