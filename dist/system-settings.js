import {preferences,updatePreferences} from './user-guide.js';
const css=()=>document.documentElement.style;
export function getSystemSettings(){const glass=window.creativeOSGlass?.get()||{transparency:36,refraction:71,blur:5};return {glassTransparency:glass.transparency,glassRefraction:glass.refraction,glassBlur:glass.blur,theme:window.creativeOSTheme.mode,material:window.creativeOSMaterial.mode,language:preferences.languageMode,side:preferences.side,startup:preferences.startup,dock:Math.round((parseFloat(css().getPropertyValue('--dock-scale'))||1)*100),desktopIcons:Math.round((parseFloat(css().getPropertyValue('--desktop-icon-scale'))||1)*100),desktopFont:Math.round((parseFloat(css().getPropertyValue('--desktop-font-scale'))||1)*100),brightness:Math.round((parseFloat(css().getPropertyValue('--wall-brightness'))||1)*100),blur:parseFloat(css().getPropertyValue('--wall-blur'))||0};}
export function setSystemSettings(next){
 if(['glassTransparency','glassRefraction','glassBlur'].some(key=>Number.isFinite(next[key])))window.creativeOSGlass?.set({transparency:next.glassTransparency,refraction:next.glassRefraction,blur:next.glassBlur});
 if(next.theme)window.creativeOSTheme.set(next.theme);if(next.material)window.creativeOSMaterial.set(next.material);
 const pref={};if(next.language)pref.languageMode=next.language;if(next.side)pref.side=next.side;if(typeof next.startup==='boolean')pref.startup=next.startup;if(Object.keys(pref).length)updatePreferences(pref);
 let sizes={};try{sizes=JSON.parse(localStorage.getItem('portfolio-desktop-sizes')||'{}');}catch{}
 for(const [key,name,min,max] of [['dock','--dock-scale',70,140],['desktopIcons','--desktop-icon-scale',70,140],['desktopFont','--desktop-font-scale',80,140]])if(Number.isFinite(next[key])){sizes[name]=Math.max(min,Math.min(max,next[key]));css().setProperty(name,sizes[name]/100);}
 if(Number.isFinite(next.brightness))css().setProperty('--wall-brightness',Math.max(50,Math.min(120,next.brightness))/100);
 if(Number.isFinite(next.blur))css().setProperty('--wall-blur',Math.max(0,Math.min(12,next.blur))+'px');
 try{localStorage.setItem('portfolio-desktop-sizes',JSON.stringify(sizes));localStorage.setItem('creativeos-display',JSON.stringify({brightness:getSystemSettings().brightness,blur:getSystemSettings().blur}));}catch{}
 if(Number.isFinite(next.dock))window.dispatchEvent(new Event('resize'));
 document.dispatchEvent(new Event('portfolio-system-settings'));
}
try{const display=JSON.parse(localStorage.getItem('creativeos-display')||'{}');if(Number.isFinite(display.brightness))css().setProperty('--wall-brightness',Math.max(50,Math.min(120,display.brightness))/100);if(Number.isFinite(display.blur))css().setProperty('--wall-blur',Math.max(0,Math.min(12,display.blur))+'px');}catch{}
