import {createActivityClock} from './runtime-scheduling.js';
export function setupSpectralPrinciples(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:13927"]')||reduced())return;
 const rows=[[13931,13932,13933,13937,13979],[13938,13939,13940,13944,13980],[13945,13946,13947,13952,13981],[13953,13954,13955,13961,13982],[13962,13963,13964,13968,13983]];
 setupSpectralSequence(doc,section,article,signal,reduced,rows.map((ids,i)=>[ids,i*2.1]));
}
export function setupSpectralPosition(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:13004"]')||reduced())return;
 setupSpectralSequence(doc,section,article,signal,reduced,[
  [[13007,13010,13011],0],[[13012],.9],[[13013,13015,13016],1.8],[[13017],2.7],[[13018,13021,13022],3.6],[[13023],5],
  [[13055],.1],[[13058,13061],.5],[[13062,13064],1.2],[[13065,13067],1.9],[[13085],2.6],
  [[13056,13080,13084],3.1],[[13086],4.3],[[13057],4.8],[[13068,13071],5],[[13072,13075],6.1],[[13076,13079],7.2],
  [[13087,13088,13089],2.2],[[13090],4],[[13094],8]
 ]);
}
export function setupSpectralForm(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:13452"]')||reduced())return;
 setupSpectralSequence(doc,section,article,signal,reduced,[
  [[13465],0],[[13473],.8],[[13483],1.6],[[13492],2.1],
  [[13496,13528],2.4],[[13504,13529],3.2],[[13511],4],[[13519,13530],4.8],[[13526],5.6],
  [[13535,13537],5.5],[[13543,13544],6],[[13545,13546],6.3],[[13547,13548],6.6],
  [[13549,13552],7],[[13591,13558],7.4],[[13592,13564],7.8],[[13570],8.2],
  [[13571,13572],8.5],[[13573,13574],8.65],[[13575,13576,13534,13577],8.8]
 ]);
}
export function setupSpectralResearch(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:13298"]')||reduced())return;
 setupSpectralSequence(doc,section,article,signal,reduced,[
  [[13306],0],[[13313],.6],[[13319],1.2],[[13326],1.6],
  [[13327],2],[[13336],3.3],[[13345],4.6],[[13354],5.9],
  [[13363,13364],7.2],[[13365],7.6],[[13370],8],[[13375],8.4],[[13380],8.8]
 ],[[13369,7.75],[13374,8.15],[13379,8.55]]);
}
export function setupSpectralOutput(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:13384"]')||reduced())return;
 setupSpectralSequence(doc,section,article,signal,reduced,[
  [[13390,13391],0],[[13392],.3],[[13398],1.3],[[13404],2.3],
  [[13410,13411],3.2],[[13412],3.6],[[13419],4.4],[[13427],5.2],[[13436],6],
  [[13451,13442,13443],6.3],[[13444],6.9],[[13445,13446],7.2],
  [[13450,13447],7.6],[[13448,13449],8.4],[[13437],8.8]
 ]);
}
export function setupSpectralJourney(doc,section,article,signal,reduced){
 if(!doc.querySelector('[data-node-id="678:15235"]')||reduced())return;
 setupSpectralSequence(doc,section,article,signal,reduced,[
  [[15240,15241],0],[[15246,15247,15290],1.1],[[15252,15253],2.2],
  [[15258,15259],3.3],[[15312,15264],4.4],[[15269,15270],5.5],[[15275,15276],6.6],
  [[15236,15288,15289],7.2],[[15237,15238],7.8],[[15239,15293],8.4],
  [[15294,15295,15297,15298,15299,15300,15301,15302,15303,15304,15305],8.8]
 ]);
}
function setupSpectralSequence(doc,section,article,signal,reduced,groups,bars=[]){
 const pieces=[],barPieces=[],clock=createActivityClock(doc,signal);let played=false;
 const style=doc.createElement('style');style.textContent=`
 .spectral-principle-piece{opacity:0}
 .spectral-principles-playing .spectral-principle-piece{animation:spectral-principle-in .7s cubic-bezier(.22,.7,.22,1) both;animation-delay:var(--principle-delay)}
 @keyframes spectral-principle-in{from{opacity:0;translate:0 7px}to{opacity:1;translate:0 0}}
 .spectral-result-bar{scale:0 1;transform-origin:left center}
 .spectral-principles-playing .spectral-result-bar{animation:spectral-result-grow .9s cubic-bezier(.22,.7,.22,1) both;animation-delay:var(--result-delay)}
 @keyframes spectral-result-grow{from{scale:0 1}to{scale:1 1}}
 `;doc.head.append(style);
 groups.forEach(([ids,delay])=>ids.forEach(id=>{const el=doc.querySelector(`[data-node-id="678:${id}"]`);if(el){el.classList.add('spectral-principle-piece');el.style.setProperty('--principle-delay',delay+'s');pieces.push(el);}}));
 bars.forEach(([id,delay])=>{const el=doc.querySelector(`[data-node-id="678:${id}"]`);if(el){el.classList.add('spectral-result-bar');el.style.setProperty('--result-delay',delay+'s');barPieces.push(el);}});
 const finish=()=>{clock.dispose();pieces.forEach(el=>{el.classList.remove('spectral-principle-piece');el.style.removeProperty('--principle-delay');});barPieces.forEach(el=>{el.classList.remove('spectral-result-bar');el.style.removeProperty('--result-delay');});doc.body.classList.remove('spectral-principles-playing');style.remove();};
 const observer=new article.ownerDocument.defaultView.IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.25))return;played=true;observer.disconnect();
  if(reduced()){finish();return;}doc.body.classList.add('spectral-principles-playing');clock.setTimeout(finish,9500);
 },{root:article,threshold:.25});observer.observe(section);
 article.ownerDocument.addEventListener('portfolio-preferences',()=>{if(reduced()){played=true;observer.disconnect();finish();}},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();finish();},{once:true});
}
