export function setupSpectralSystem(doc, section, root, signal, reduced) {
  const board=doc.querySelector('[data-node-id="678:14011"]');
  if(!board)return;
  const entries=[];
  const add=(ids,delay,step=0)=>ids.forEach((id,i)=>{
    const el=board.querySelector(`[data-node-id="678:${id}"]`);
    if(el)entries.push({el,delay:delay+i*step,line:el.dataset.name?.includes('Divider')});
  });
  add([14020,14022],100,220);
  add([14024,14025],650,140);
  // Each branch arrives as a module, with its smaller nodes following the heading.
  const branches=[
    {head:[14026,14027,14029],rows:[[14030,14031],[14033,14034],[14036,14037]]},
    {head:[14039,14040,14042],rows:[[14043,14044],[14046,14047],[14049,14050],[14052,14053]]},
    {head:[14055,14056,14058],rows:[[14059,14060],[14062,14063],[14065,14066],[14068,14069],[14071,14072],[14074,14075,14076]]},
    {head:[14078,14079,14081],rows:[[14082,14083],[14085,14086],[14088,14089]]}
  ];
  branches.forEach((branch,i)=>{
    const start=1050+i*850;
    add(branch.head,start,60);
    branch.rows.forEach((row,j)=>add(row,start+200+j*105));
  });
  add([14091,14092,14094,14095,14097,14099],4200,120);
  let played=false,animations=[];
  const show=()=>{
    animations.forEach(a=>a.cancel());animations=[];
    entries.forEach(({el})=>{el.style.opacity='';});
  };
  if(!reduced())entries.forEach(({el})=>el.style.opacity='0');
  const observer=new IntersectionObserver(events=>{
    if(played||!events.some(e=>e.isIntersecting))return;
    played=true;observer.disconnect();
    if(reduced()){show();return;}
    animations=entries.map(({el,delay,line})=>el.animate(
      line?[{opacity:0},{opacity:1}]:[{opacity:0,translate:'0 12px'},{opacity:1,translate:'0 0'}],
      {duration:line?350:560,delay,easing:'cubic-bezier(.22,.7,.22,1)',fill:'both'}));
    Promise.all(animations.map(a=>a.finished)).then(show).catch(()=>{});
  },{root,threshold:.35});
  observer.observe(section);
  const preferences=()=>{if(reduced()){played=true;observer.disconnect();show();}};
  document.addEventListener('portfolio-preferences',preferences,{signal});
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',preferences,{signal});
  signal.addEventListener('abort',()=>{observer.disconnect();show();},{once:true});
}
