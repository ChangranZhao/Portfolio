import {registerTranslations} from './localization.js';
registerTranslations([
 ['Background music','背景音乐'],
 ['Enable background music','开启背景音乐'],
 ['Background music volume','背景音乐音量'],
 ['Volume','音量'],
 ['Music could not load. Please refresh the page and try again.','音乐加载失败，请刷新页面重试。'],
 ['Music source / Download','音乐来源 / 下载']
]);
const audio=new Audio(new URL('./assets/music/the-soft-tech-ambient.mp3',import.meta.url));
audio.loop=true;audio.preload='none';
let enabled=localStorage.getItem('portfolio-music-enabled')!=='false';
audio.volume=Math.max(0,Math.min(1,Number(localStorage.getItem('portfolio-music-volume')??.2)));
const playing=new Set();
let apiPromise;
function sync(){if(enabled&&!playing.size)audio.play().catch(()=>{});else audio.pause();}
document.addEventListener('pointerdown',()=>{if(enabled&&audio.paused)sync();});
function api(){if(window.YT?.Player)return Promise.resolve();return apiPromise??=new Promise(resolve=>{const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{previous?.();resolve();};const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';document.head.append(script);});}
export function connectYouTube(frame){
 const url=new URL(frame.src);url.searchParams.set('enablejsapi','1');url.searchParams.set('origin',location.origin);frame.src=url.href;
 api().then(()=>{if(!frame.isConnected)return;new window.YT.Player(frame,{events:{onStateChange(event){if(event.data===1||event.data===3)playing.add(frame);else playing.delete(frame);sync();},onError(){playing.delete(frame);sync();}}});});
}
new MutationObserver(()=>{let changed=false;for(const frame of playing)if(!frame.isConnected){playing.delete(frame);changed=true;}if(changed)sync();}).observe(document.documentElement,{childList:true,subtree:true});
export function addMusicSettings(page){
 const title=document.createElement('h2');title.textContent='Background music';page.append(title);
 const row=document.createElement('div');row.className='settings-row';
 const label=document.createElement('label');label.textContent='Enable background music';const toggle=document.createElement('input');toggle.type='checkbox';toggle.checked=enabled;toggle.setAttribute('aria-label','Enable background music');
 toggle.onchange=()=>{enabled=toggle.checked;localStorage.setItem('portfolio-music-enabled',String(enabled));sync();};row.append(label,toggle);page.append(row);
 const volumeRow=document.createElement('div');volumeRow.className='settings-row';const volumeLabel=document.createElement('label');volumeLabel.textContent='Volume';const output=document.createElement('output');const range=document.createElement('input');range.type='range';range.min=0;range.max=100;range.value=Math.round(audio.volume*100);range.setAttribute('aria-label','Background music volume');output.value=range.value+'%';range.oninput=()=>{audio.volume=Number(range.value)/100;output.value=range.value+'%';localStorage.setItem('portfolio-music-volume',audio.volume);};volumeLabel.append(output);volumeRow.append(volumeLabel,range);page.append(volumeRow);
 const status=document.createElement('p');status.textContent='The Soft Tech Ambient — MomotMusic';audio.addEventListener('error',()=>{status.textContent='Music could not load. Please refresh the page and try again.';});page.append(status);
 const link=document.createElement('a');link.href='https://pixabay.com/music/corporate-the-soft-tech-ambient-201093/';link.target='_blank';link.rel='noopener';link.textContent='Music source / Download';page.append(link);
}