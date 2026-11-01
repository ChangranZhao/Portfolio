import {registerTranslations} from './localization.js';
registerTranslations([
 ['Background music','背景音乐'],
 ['Enable background music','开启背景音乐'],
 ['Background music volume','背景音乐音量'],
 ['Volume','音量'],
 ['Music could not load. Please refresh the page and try again.','音乐加载失败，请刷新页面重试。'],
 ['Music source / Download','音乐来源 / 下载']
]);
export const ambientMusicTrack={id:'creative-ambient',title:'The Soft Tech Ambient',artist:'MomotMusic',cover:'assets/thanas/apple-music.png',category:'Creative Ambient',src:new URL('./assets/music/the-soft-tech-ambient.mp3',import.meta.url).href};
const audio=new Audio(ambientMusicTrack.src);audio.loop=true;audio.preload='none';
let enabled=localStorage.getItem('portfolio-music-enabled')!=='false';
audio.volume=Math.max(0,Math.min(1,Number(localStorage.getItem('portfolio-music-volume')??.2)));
const playing=new Set();
let currentTrack=ambientMusicTrack,queue=[ambientMusicTrack],trackURL=null,musicError=false,buffering=false,playRequest=0;
const notify=()=>document.dispatchEvent(new Event('portfolio-music-settings'));
const validTrack=track=>track?.id&&track.title&&(track.src===ambientMusicTrack.src||/^https:\/\/audio-ssl\.itunes\.apple\.com\//.test(track.previewUrl||''));
audio.addEventListener('error',()=>{musicError=true;buffering=false;notify()});
audio.addEventListener('waiting',()=>{buffering=true;notify()});
for(const event of ['playing','canplay'])audio.addEventListener(event,()=>{buffering=false;notify()});
audio.addEventListener('ended',()=>{if(enabled&&!audio.loop&&queue.length>1)stepMusicTrack(1);else{enabled=false;localStorage.setItem('portfolio-music-enabled','false');notify()}});
export function musicSettings(){return {enabled,volume:audio.volume,paused:audio.paused,time:audio.currentTime,duration:Number.isFinite(audio.duration)?audio.duration:0,suspended:playing.size>0,title:currentTrack.title,artist:currentTrack.artist,cover:currentTrack.cover,trackId:currentTrack.id,error:musicError,buffering,loop:audio.loop};}
export function subscribeMusic(listener){const events=['timeupdate','play','pause','loadedmetadata','ended','waiting','canplay'];for(const event of events)audio.addEventListener(event,listener);document.addEventListener('portfolio-music-settings',listener);return()=>{for(const event of events)audio.removeEventListener(event,listener);document.removeEventListener('portfolio-music-settings',listener)}}
export function playMusicTrack(track,nextQueue){
 if(!validTrack(track))return;
 if(trackURL){URL.revokeObjectURL(trackURL);trackURL=null}
 if(nextQueue)queue=nextQueue.filter(validTrack);if(!queue.some(item=>item.id===track.id))queue=[track];
 if(currentTrack.id!==track.id){audio.pause();audio.src=track.previewUrl||track.src;audio.currentTime=0;audio.loop=!track.previewUrl;currentTrack=track}
 musicError=false;buffering=true;enabled=true;localStorage.setItem('portfolio-music-enabled','true');sync();notify();
}
export function stepMusicTrack(direction){
 if(!queue.length)return;
 if(direction<0&&audio.currentTime>3){audio.currentTime=0;notify();return}
 const index=queue.findIndex(item=>item.id===currentTrack.id);const next=queue[(Math.max(0,index)+direction+queue.length)%queue.length];
 if(next.id===currentTrack.id)audio.currentTime=0;
 playMusicTrack(next);
}
export function loadMusicFile(file){if(!file.type.startsWith('audio/')&&!/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(file.name))return;if(trackURL)URL.revokeObjectURL(trackURL);trackURL=URL.createObjectURL(file);audio.pause();audio.src=trackURL;audio.currentTime=0;audio.loop=true;currentTrack={id:'local-audio',title:file.name.replace(/\.[^.]+$/,''),artist:'Local audio',cover:ambientMusicTrack.cover};queue=[];musicError=false;enabled=true;sync();notify()}
export function updateMusicSettings(next){
 if(typeof next.enabled==='boolean'){enabled=next.enabled;localStorage.setItem('portfolio-music-enabled',String(enabled));musicError=false;if(!enabled)buffering=false;sync()}
 if(Number.isFinite(next.volume)){audio.volume=Math.max(0,Math.min(1,next.volume));localStorage.setItem('portfolio-music-volume',audio.volume)}
 if(Number.isFinite(next.time)&&Number.isFinite(audio.duration))audio.currentTime=Math.max(0,Math.min(audio.duration,next.time));
 if(typeof next.loop==='boolean')audio.loop=next.loop;
 notify();
}
function sync(){const request=++playRequest;if(enabled&&!playing.size)audio.play().catch(error=>{if(request===playRequest&&error.name!=='AbortError'&&error.name!=='NotAllowedError'){musicError=true;notify()}});else audio.pause()}
document.addEventListener('pointerdown',()=>{if(enabled&&audio.paused&&!musicError)sync()});
function videoState(frame,state){if(state===1||state===3)playing.add(frame);else playing.delete(frame);sync();notify()}
document.addEventListener('portfolio-video-state',e=>videoState(e.detail.frame,e.detail.state));
window.addEventListener('message',e=>{if(e.origin!==location.origin||e.data?.type!=='portfolio-video-state')return;const frame=[...document.querySelectorAll('iframe')].find(f=>f.contentWindow===e.source);if(frame)videoState(frame,e.data.state)});
new MutationObserver(()=>{let changed=false;for(const frame of playing)if(!frame.isConnected){playing.delete(frame);changed=true}if(changed){sync();notify()}}).observe(document.documentElement,{childList:true,subtree:true});
export function addMusicSettings(page){
 const title=document.createElement('h2');title.textContent='Background music';page.append(title);
 const row=document.createElement('div');row.className='settings-row';
 const label=document.createElement('label');label.textContent='Enable background music';const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=enabled;toggle.setAttribute('aria-label','Enable background music');
 toggle.onchange=()=>{enabled=toggle.checked;localStorage.setItem('portfolio-music-enabled',String(enabled));sync();};row.append(label,toggle);page.append(row);
 const volumeRow=document.createElement('div');volumeRow.className='settings-row';const volumeLabel=document.createElement('label');volumeLabel.textContent='Volume';const output=document.createElement('output');const range=document.createElement('input');range.type='range';range.min=0;range.max=100;range.value=Math.round(audio.volume*100);range.setAttribute('aria-label','Background music volume');output.value=range.value+'%';range.oninput=()=>{audio.volume=Number(range.value)/100;output.value=range.value+'%';localStorage.setItem('portfolio-music-volume',audio.volume);};volumeLabel.append(output);volumeRow.append(volumeLabel,range);page.append(volumeRow);
 const status=document.createElement('p');status.textContent='The Soft Tech Ambient — MomotMusic';audio.addEventListener('error',()=>{status.textContent='Music could not load. Please refresh the page and try again.';});page.append(status);
 const link=document.createElement('a');link.href='https://pixabay.com/music/corporate-the-soft-tech-ambient-201093/';link.target='_blank';link.rel='noopener';link.textContent='Music source / Download';page.append(link);
}
