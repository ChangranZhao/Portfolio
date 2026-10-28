// The environment board retains its imported geometry; animate independent layers.
export function setupEnvironmentMotion(doc,section,article,signal,reduced){
 const isLanguage=!!doc.querySelector('[aria-label="4_page6"]');
 if(!isLanguage&&!doc.querySelector('[aria-label="4_page5"]'))return;
 const scheduled=new Map(),animations=[],timers=new Set(),wrappers=[];
 const node=id=>doc.querySelector(`[data-node-id="747:${id}"]`);
 const add=(el,time,kind='rise',duration=.8)=>{
  if(!el)return;
  if(doc.defaultView.getComputedStyle(el).display==='contents'){
   [...el.children].forEach(child=>add(child,time,kind,duration));return;
  }
  scheduled.set(el,{time,kind,duration});
 };
 const ids=(values,time,kind,duration)=>values.forEach(id=>add(node(id),time,kind,duration));
 const range=(a,b,time,kind,duration)=>{for(let n=a;n<=b;n++)add(node(n),time,kind,duration);};
 if(!isLanguage){
 // Shared intention, three branches, shared reference; the blue bus draws through them.
 ids([22335],0);
 ids([22338,22350],.7);ids([22341,22352],1.3);ids([22344,22354],1.9);
 ids([22347],2.6);ids([22331,22333],2.9);
 ids([22319,22325],.35,'line',3.1);
 // Open each browser frame, load its contents, then reveal its three-step strip.
 for(const [index,base] of [22085,22148,22211].entries()){
  const panel=node(base),start=3.8+index*2.8;
  add(panel,start,'window',.9);
  for(const child of panel?.children||[]){
   const n=Number(child.dataset.nodeId?.split(':')[1]);
   const offset=n-base;
   if(offset>=43){
    const step=offset<48?0:offset<56?1:offset<60?2:3;
    add(child,start+1.15+step*.45,child.textContent.trim()==='→'?'line':'rise',.65);
   }else if(offset>=15){add(child,start+.45+(offset===15?0:.18),'rise',.8);}
  }
  // Text loads with its module, avoiding a compositor layer for every paragraph.
 }
 // Source -> selection -> contour.
 ids([22360],12.7);ids([22358],13.4,'line');
 ids([22363],13.9);ids([22369],14.6,'line');ids([22366],15.1);
 ids([22373,22372,22371],15.6);
 // Four planes rise from the bottom, with their matching annotations.
 [22277,22280,22283,22286].forEach((id,i)=>add(node(id),16.3+i*.85,'rise',1));
 [22310,22303,22296,22289].forEach((id,i)=>add(node(id),16.7+i*.85));
 ids([22314],16.7);ids([22307],17.55);ids([22300],18.4);ids([22293],19.25);
 ids([22275,22276],16.4,'line',3.4);
 }else{
 // Begin on the central lunar surface, then propagate through the connected studies.
 ids([21738,21740],0,'rise',1.1);ids([21743,21745],.6,'line',1);
 ids([21742],.8,'line',1.4);
 range(21747,21751,2,'rise',.8);
 range(21752,21756,3.2,'rise',.8);
 range(21757,21761,4.4,'rise',.8);
 range(21762,21775,1.1,'branch',4.5);
 range(21802,21831,5.8,'rise',.8);
 ids([21776],6.4,'line',1.1);range(21832,21861,7.3,'rise',.8);
 ids([21788],7.9,'line',1.1);range(21862,21891,8.8,'rise',.8);
 range(21778,21787,8.9,'branch',2.6);
 range(21790,21801,9.3,'line',2.4);
 range(21892,21982,11.5,'rise',.9);
 range(21983,21993,12.9,'rise',.8);
 range(21994,22004,13.7,'rise',.8);
 range(22005,22015,14.5,'rise',.8);
 range(22016,22039,1.2,'rise',1);
 }
 // Give every connector its own cue; draw actual paths, never a faded base image.
 if(isLanguage){
  let next=1.1;
  for(const [el,cue] of scheduled){
   if(cue.kind!=='line'&&cue.kind!=='branch')continue;
   cue.time=next;cue.duration=.75;next+=.85;
   const paths=[...el.querySelectorAll('path[stroke]')];
   for(const path of paths){const length=path.getTotalLength();path.style.strokeDasharray=String(length);path.style.strokeDashoffset=String(length);}
   cue.paths=paths;
  }
 }
 // Coalesce siblings that share a cue into one composited layer.
 const before=scheduled.size,parents=new Map();
 for(const [el,cue] of scheduled){
  const parent=el.parentElement;if(!parents.has(parent))parents.set(parent,new Map());
  const key=cue.time+':'+cue.duration;
  const buckets=parents.get(parent);if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push([el,cue]);
 }
 for(const buckets of parents.values())for(const entries of buckets.values()){
  if(entries.length<2||entries.some(([,cue])=>cue.paths))continue;
  const [first,cue]=entries[0];const wrapper=doc.createElement('div');
  wrapper.style.cssText='position:absolute;inset:0;pointer-events:none';wrapper.dataset.spaceMotionGroup='';
  first.before(wrapper);for(const [el] of entries){wrapper.append(el);scheduled.delete(el);}
  wrappers.push(wrapper);scheduled.set(wrapper,cue);
 }
 doc.body.dataset.motionLayers=before+' → '+scheduled.size;
 const original=new Map();
 for(const el of scheduled.keys()){original.set(el,el.style.opacity);el.style.opacity='0';}
 doc.documentElement.setAttribute('data-lines-ready','');
 const restore=()=>{for(const cue of scheduled.values())for(const path of cue.paths||[])path.style.strokeDashoffset='0';for(const timer of timers)clearTimeout(timer);timers.clear();for(const a of animations)a.cancel();animations.length=0;for(const [el,value] of original)el.style.opacity=value;for(const wrapper of wrappers)if(wrapper.isConnected)wrapper.replaceWith(...wrapper.childNodes);};
 let played=false;
 const observer=new IntersectionObserver(entries=>{
  if(played||!entries.some(e=>e.isIntersecting&&e.intersectionRatio>=.35))return;
  played=true;observer.disconnect();if(reduced()){restore();return;}
  for(const [el,{time,kind,duration,paths}] of scheduled){
   const timer=setTimeout(()=>{
    timers.delete(timer);if(signal.aborted)return;
    if(paths?.length){
     el.style.opacity='1';
     for(const path of paths){const a=path.animate([{strokeDashoffset:path.style.strokeDashoffset},{strokeDashoffset:'0'}],{duration:duration*1000,easing:'linear',fill:'forwards'});animations.push(a);a.finished.then(()=>{path.style.strokeDashoffset='0';a.cancel();}).catch(()=>{});}
     return;
    }
    el.style.willChange='opacity, translate';
    // Opacity/translation avoid repainting large SVG clips on every frame.
    const animation=el.animate([{opacity:0,translate:kind==='line'?'0 0':'0 10px'},{opacity:1,translate:'0 0'}],{duration:Math.min(duration,1.1)*1000,easing:'ease-out',fill:'both'});
    animations.push(animation);
    animation.finished.then(()=>{el.style.opacity='1';animation.cancel();el.style.removeProperty('will-change');const i=animations.indexOf(animation);if(i>=0)animations.splice(i,1);}).catch(()=>{});
   },time*1000);timers.add(timer);
  }
 },{root:article,threshold:.35});observer.observe(section);
 document.addEventListener('portfolio-preferences',()=>{if(reduced()){played=true;observer.disconnect();restore();}},{signal});
 signal.addEventListener('abort',()=>{observer.disconnect();restore();},{once:true});
}
