// Apply before styles paint; keep appearance independent of language preferences.
(()=>{
 const key='portfolio-shell-theme';
 const media=matchMedia('(prefers-color-scheme: dark)');
 const valid=value=>['light','dark','system'].includes(value)?value:'system';
 let mode='system';
 let material='liquid';
 try{mode=valid(localStorage.getItem(key));}catch{}
 try{const saved=localStorage.getItem('portfolio-shell-material');if(saved==='classic'||saved==='liquid')material=saved;}catch{}
 const apply=()=>{document.documentElement.dataset.theme=mode==='system'?(media.matches?'dark':'light'):mode;window.creativeOSGlass?.syncTheme();document.dispatchEvent?.(new Event('portfolio-theme'));};
 window.creativeOSTheme={get mode(){return mode;},set(value){mode=valid(value);try{localStorage.setItem(key,mode);}catch{}apply();}};
 window.creativeOSMaterial={get mode(){return material;},set(value){material=value==='classic'?'classic':'liquid';try{localStorage.setItem('portfolio-shell-material',material);}catch{}document.documentElement.dataset.material=material;document.dispatchEvent?.(new Event('portfolio-material'));}};
 document.documentElement.dataset.material=material;
 media.addEventListener('change',()=>{if(mode==='system')apply();});
 apply();
})();
