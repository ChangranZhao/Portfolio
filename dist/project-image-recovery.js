// A single failed photo must never lock the reader. Retry it once, locally.
export function installProjectImageRecovery(root){
 const doc=root.ownerDocument,win=doc.defaultView,controller=new win.AbortController(),timers=new Set(),watched=new WeakSet();
 const retry=image=>{
  if(!image?.matches?.('img')||image.dataset.readingRetried||!image.complete||image.naturalWidth||win.navigator.onLine===false)return;
  const source=image.currentSrc||image.getAttribute('src');if(!source)return;
  const url=new URL(source,image.ownerDocument.baseURI);if(!/^https?:$/.test(url.protocol)||url.origin!==win.location.origin)return;
  image.dataset.readingRetried='true';
  const timer=win.setTimeout(()=>{timers.delete(timer);if(!image.isConnected)return;url.searchParams.set('_image_retry','1');image.removeAttribute('srcset');image.src=url.href;},800);
  timers.add(timer);
 };
 const watch=container=>{
  if(!watched.has(container)){watched.add(container);container.addEventListener('error',event=>retry(event.target),{capture:true,signal:controller.signal});}
  for(const image of container.querySelectorAll('img'))retry(image);
 };
 const scan=()=>{watch(root);for(const frame of root.querySelectorAll('iframe'))try{if(frame.contentDocument?.body)watch(frame.contentDocument);}catch{}};
 root.addEventListener('load',event=>{if(event.target.matches?.('iframe'))scan();},{capture:true,signal:controller.signal});
 win.addEventListener('online',scan,{signal:controller.signal});scan();
 return()=>{controller.abort();for(const timer of timers)win.clearTimeout(timer);timers.clear();};
}
