import {connectYouTubePlayer} from './youtube-player.js';

function reportState(frame,state){
 document.dispatchEvent(new CustomEvent('portfolio-video-state',{detail:{frame,state}}));
 if(window.parent!==window)window.parent.postMessage({type:'portfolio-video-state',state},location.origin);
}
export function createYouTubeFacade(frame,{poster,connect=connectYouTubePlayer}={}){
 const doc=frame.ownerDocument,button=doc.createElement('button');
 button.type='button';button.className='video-facade';button.setAttribute('aria-label',frame.title);button.setAttribute('data-no-localize','');
 if(poster){const img=doc.createElement('img');img.src=poster;img.alt='';img.loading='lazy';img.decoding='async';button.append(img);}
 const play=doc.createElement('span');play.className='video-facade-play';play.textContent='▶';play.setAttribute('aria-hidden','true');
 const caption=doc.createElement('span');caption.className='video-facade-title';caption.textContent=frame.title;button.append(play,caption);
 button.addEventListener('click',()=>{
  const url=new URL(frame.src);url.searchParams.set('autoplay','1');frame.src=url.href;
  // Set API parameters while detached, then make the single iframe request.
  connect(frame,reportState);button.replaceWith(frame);
 },{once:true});
 return button;
}
export function mountYouTubeFacades(){
 for(const placeholder of document.querySelectorAll('[data-youtube-src]')){
  const frame=document.createElement('iframe');frame.src=placeholder.dataset.youtubeSrc;frame.title=placeholder.dataset.title||'YouTube';
  frame.allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
  placeholder.replaceWith(createYouTubeFacade(frame,{poster:placeholder.dataset.poster}));
 }
}
