let apiPromise;
function api(){
 if(window.YT?.Player)return Promise.resolve();
 return apiPromise??=new Promise((resolve,reject)=>{
  const previous=window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady=()=>{previous?.();resolve();};
  const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.onerror=()=>{apiPromise=null;reject(new Error('YouTube API unavailable'));};document.head.append(script);
 });
}
export function connectYouTubePlayer(frame,onState){
 const url=new URL(frame.src);url.searchParams.set('enablejsapi','1');url.searchParams.set('origin',location.origin);frame.src=url.href;
 const notify=state=>onState?.(frame,state);
 // Reserve the audio channel immediately; iframe events may arrive after playback starts.
 notify(3);
 api().then(()=>{
  if(!frame.isConnected){notify(0);return;}
  const controller=new AbortController(),options={signal:controller.signal};
  const inactive=()=>document.hidden||frame.closest('.window')?.dataset.suspended==='true'||document.body.classList.contains('portfolio-board-paused');
  const player=new window.YT.Player(frame,{events:{onReady(e){notify(e.target.getPlayerState());if(inactive())e.target.pauseVideo?.();},onStateChange(e){notify(e.data);if((e.data===1||e.data===3)&&inactive())e.target.pauseVideo?.();},onAutoplayBlocked(){notify(2);},onError(){notify(-1);}}});
  const pause=()=>{if(inactive())player.pauseVideo?.();};
  document.addEventListener('visibilitychange',pause,options);document.addEventListener('portfolio-windows-changed',pause,options);document.addEventListener('portfolio-board-activity',pause,options);
  frame.closest('.window')?.addEventListener('window-closing',()=>{controller.abort();notify(0);player.destroy?.();},{once:true});
  window.addEventListener('pagehide',()=>{controller.abort();notify(0);},{once:true,signal:controller.signal});
 }).catch(()=>{frame.setAttribute('data-player-api-unavailable','true');});
}
