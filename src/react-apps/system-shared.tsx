import {useContext,useEffect,useState} from 'react';
import {APIContext,useLanguage} from './shared';
import {installedProjects} from './system-model.mjs';
export function useSystemText(){const api=useContext(APIContext),lang=useLanguage();return (en:string,zh:string)=>lang.startsWith('zh')?api.localize(zh):en;}
export function useInstalled(){
 const api=useContext(APIContext),ids=api.projects.map(p=>p.id);
 const read=()=>{try{return installedProjects(localStorage.getItem('creativeos-installed-projects'),ids);}catch{return [] as string[];}};
 const [installed,setInstalled]=useState<string[]>(read),[error,setError]=useState(false);
 useEffect(()=>{const sync=()=>setInstalled(read());document.addEventListener('creativeos-apps-changed',sync);window.addEventListener('storage',sync);return()=>{document.removeEventListener('creativeos-apps-changed',sync);window.removeEventListener('storage',sync)}},[]);
 function toggle(id:string){const current=read(),next=current.includes(id)?current.filter(v=>v!==id):[...current,id];try{localStorage.setItem('creativeos-installed-projects',JSON.stringify(next));setInstalled(next);setError(false);document.dispatchEvent(new Event('creativeos-apps-changed'));}catch{setError(true);}}
 return {installed,toggle,error};
}
export function useMusic(transport=true){const api=useContext(APIContext),[state,setState]=useState(api.music.get);useEffect(()=>api.music.subscribe(()=>{const next=api.music.get();setState(current=>!transport&&(['enabled','volume','paused','suspended','title','artist','cover','trackId','error','buffering','loop','duration'] as const).every(key=>current[key]===next[key])?current:next)}),[api,transport]);return state;}
export const timeLabel=(seconds:number)=>`${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
export function safeRead<T>(key:string,fallback:T):T{try{return JSON.parse(localStorage.getItem(key)||'null')??fallback;}catch{return fallback;}}
export function safeWrite(key:string,value:unknown){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
