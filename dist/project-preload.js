// Readiness is explicit; browsing never creates or unloads a retained board.
const aborted=()=>new DOMException('Project closed','AbortError');
const check=signal=>{if(signal?.aborted)throw aborted();};
const nextTask=()=>new Promise(resolve=>setTimeout(resolve,0));

function bounded(promise,{signal,timeout=25000}={}){
 check(signal);
 return new Promise((resolve,reject)=>{
  const finish=(fn,value)=>{clearTimeout(timer);signal?.removeEventListener('abort',cancel);fn(value);};
  const cancel=()=>finish(reject,aborted());
  const timer=setTimeout(()=>finish(reject,new Error('Resource timed out')),timeout);
  signal?.addEventListener('abort',cancel,{once:true});
  Promise.resolve(promise).then(value=>finish(resolve,value),error=>finish(reject,error));
 });
}

export async function runPreloadTasks(tasks,{concurrency=3,signal,onProgress=()=>{}}={}){
 const failed=[];let cursor=0,done=0;
 await Promise.all(Array.from({length:Math.min(concurrency,tasks.length)},async()=>{
  while(cursor<tasks.length){check(signal);const task=tasks[cursor++];
   try{await task();}catch(error){if(error.name==='AbortError')throw error;failed.push({url:task.url||'',error});}
   check(signal);onProgress(++done,tasks.length);await nextTask();
  }
 }));check(signal);return failed;
}

function htmlFrame(frame){
 const src=frame.getAttribute('data-project-board-src')||frame.getAttribute('src');if(!src)return false;
 try{const url=new URL(src,frame.ownerDocument.baseURI);return url.origin===new URL(frame.ownerDocument.baseURI).origin&&!/\.(pdf|mp4)(?:$|[?#])/i.test(url.href)&&/^https?:$/.test(url.protocol);}catch{return false;}
}

function frameDocument(frame){
 try{const doc=frame.contentDocument;return doc?.body&&doc.URL!=='about:blank'&&doc.readyState==='complete'?doc:null;}catch{return null;}
}

function waitFrame(frame,options){
 const existing=frameDocument(frame);if(existing&&!frame.dataset.projectFrameFailed)return Promise.resolve(existing);
 check(options.signal);
 return new Promise((resolve,reject)=>{
  let timer;
  const cleanup=()=>{clearTimeout(timer);frame.removeEventListener('load',loaded);frame.removeEventListener('error',failed);frame.removeEventListener('portfolio-board-loading',started);options.signal?.removeEventListener('abort',cancel);};
  const loaded=()=>{const doc=frameDocument(frame);if(!doc)return;cleanup();resolve(doc);};
  const failed=()=>{cleanup();reject(new Error('Page unavailable'));};
  const cancel=()=>{cleanup();reject(aborted());};
  // Time queued boards from navigation, not from their place in the queue.
  const started=()=>{clearTimeout(timer);timer=setTimeout(failed,options.timeout);};
  frame.addEventListener('load',loaded);frame.addEventListener('error',failed);frame.addEventListener('portfolio-board-loading',started);options.signal?.addEventListener('abort',cancel,{once:true});
  if(frame.getAttribute('src'))started();
 }).catch(error=>{if(error.name!=='AbortError')frame.dataset.projectFrameFailed='true';throw error;});
}

async function prepareImage(image,options){
 if(options.retry&&image.dataset.projectImageFailed){delete image.dataset.projectImageFailed;const url=new URL(image.currentSrc||image.src);url.searchParams.set('_project_retry',String(Date.now()));image.removeAttribute('srcset');image.src=url.href;}
 image.loading='eager';image.decoding='async';
 try{
  if(image.decode)await bounded(image.decode(),options);
  else if(!image.complete)await bounded(new Promise((resolve,reject)=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',reject,{once:true});}),options);
  if(!image.naturalWidth)throw new Error('Image unavailable');
 }catch(error){if(error.name!=='AbortError')image.dataset.projectImageFailed='true';throw error;}
}

export async function prepareProject(root,{signal,onProgress=()=>{},timeout=25000,retry=false}={}){
 const options={signal,timeout,retry},doc=root.ownerDocument,seenFrames=new Set(),seenImages=new Set(),seenDocuments=new Set(),seenBackgrounds=new Set();
 const containers=[root],failures=[];
 // Install waiters before asking the scheduler to start offscreen documents.
 let frames=[...root.querySelectorAll('iframe')].filter(htmlFrame);
 let complete=0,total=frames.length;
 onProgress({phase:'pages',done:0,total});
 const preloadEvent=()=>new doc.defaultView.CustomEvent('portfolio-project-preload',{detail:{retry}});
 const pending=frames.map(frame=>{
  seenFrames.add(frame);frame.loading='eager';
  return waitFrame(frame,options).then(child=>{containers.push(child);},error=>{if(error.name==='AbortError')throw error;failures.push({url:frame.getAttribute('data-project-board-src')||frame.src,error});}).finally(()=>onProgress({phase:'pages',done:++complete,total}));
 });
 root.dispatchEvent(preloadEvent());
 await Promise.all(pending);check(signal);
 // Nested local HTML is uncommon, but it must obey the same readiness contract.
 for(let depth=0;depth<3;depth++){
  frames=containers.flatMap(c=>[...c.querySelectorAll('iframe')]).filter(f=>!seenFrames.has(f)&&htmlFrame(f));if(!frames.length)break;
  total+=frames.length;
  for(const frame of frames){check(signal);seenFrames.add(frame);frame.loading='eager';try{containers.push(await waitFrame(frame,options));}catch(error){if(error.name==='AbortError')throw error;failures.push({url:frame.src,error});}onProgress({phase:'pages',done:++complete,total});}
 }
 for(let pass=0;pass<3;pass++){
  check(signal);await nextTask();const tasks=[];
  for(const container of containers){
   const owner=container.ownerDocument||container;
   if(!seenDocuments.has(owner)&&owner.fonts){seenDocuments.add(owner);const fontTask=()=>bounded(owner.fonts.ready,options);fontTask.url=owner.URL+'#fonts';tasks.push(fontTask);}
   for(const image of container.querySelectorAll('img')){
    if(seenImages.has(image)||!image.getAttribute('src')&&!image.getAttribute('srcset'))continue;seenImages.add(image);
    const task=()=>prepareImage(image,options);task.url=image.currentSrc||image.src;tasks.push(task);
   }
   // Inline background images are used in some authored visual compositions.
   for(const element of container.querySelectorAll('[style*="url("]'))for(const match of element.style.cssText.matchAll(/url\(["']?([^"')]+)["']?\)/g)){
    if(/^(?:#|%23)/i.test(match[1]))continue; // SVG gradients/masks reference a local definition.
    const url=new URL(match[1],owner.baseURI).href;if(seenBackgrounds.has(url)||url.startsWith('data:'))continue;seenBackgrounds.add(url);
    const task=async()=>{const image=new owner.defaultView.Image();image.src=url;await prepareImage(image,options);};task.url=url;tasks.push(task);
   }
  }
  if(!tasks.length)break;
  onProgress({phase:'assets',done:0,total:tasks.length});
  failures.push(...await runPreloadTasks(tasks,{signal,concurrency:3,onProgress:(done,total)=>onProgress({phase:'assets',done,total})}));
 }
 return failures;
}
