// Runs before styles, so saved glass values apply to the very first paint.
(()=>{
 const key='creativeos-glass-settings',defaults={dark:{transparency:36,refraction:71,blur:5},light:{transparency:28,refraction:60,blur:8}};
 const limits={transparency:[0,100],refraction:[0,200],blur:[0,30]};
 const theme=()=>document.documentElement.dataset.theme==='light'?'light':'dark';
 const profiles={dark:{...defaults.dark},light:{...defaults.light}};
 const merge=(target,next)=>{if(!next||typeof next!=='object'||Array.isArray(next))return;for(const name of Object.keys(limits)){if(Number.isFinite(next[name]))target[name]=Math.max(limits[name][0],Math.min(limits[name][1],next[name]));}};
 const apply=()=>{const current=profiles[theme()],style=document.documentElement.style;style.setProperty('--lg-opacity',String(1-current.transparency/100));style.setProperty('--lg-blur',current.blur+'px');};
 try{const saved=JSON.parse(localStorage.getItem(key)||'null');if(saved?.version===2){for(const mode of ['dark','light'])merge(profiles[mode],saved.profiles?.[mode]);}else merge(profiles[theme()],saved);}catch{}
 const notify=()=>{apply();document.dispatchEvent(new Event('portfolio-glass-settings'));};
 const save=()=>{try{localStorage.setItem(key,JSON.stringify({version:2,profiles}));}catch{}notify();};
 window.creativeOSGlass={get:()=>({...profiles[theme()]}),set(next){merge(profiles[theme()],next);save();},reset(){profiles[theme()]={...defaults[theme()]};save();},syncTheme:notify};
 // Persist the migration now: changing appearance before moving a slider must
 // not reinterpret a legacy profile as belonging to the other theme on reload.
 try{localStorage.setItem(key,JSON.stringify({version:2,profiles}));}catch{}
 apply();
})();
