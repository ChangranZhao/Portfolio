// Warm the HTTP cache without mounting hidden projects or keeping decoded photos.
export async function preloadResources(urls,{load=url=>fetch(url,{priority:'low'}).then(r=>{if(!r.ok)throw Error(r.status);return r.arrayBuffer();}),concurrency=3,signal,onProgress=()=>{}}={}){
 const queue=[...new Set(urls)],stats={total:queue.length,completed:0,loaded:0,failed:0};let index=0,aborted=signal?.aborted||false,resolveAbort;
 const stopped=Symbol('stopped'),abortPromise=new Promise(resolve=>{resolveAbort=resolve;});
 const abort=()=>{aborted=true;resolveAbort(stopped);};signal?.addEventListener('abort',abort,{once:true});if(aborted)abort();
 // Start each loader immediately so the concurrency limit is observable and predictable.
 async function immediateWorker(){while(index<queue.length&&!aborted){const url=queue[index++];try{const result=await Promise.race([load(url),abortPromise]);if(result===stopped||aborted)return;stats.loaded++;}catch{if(aborted)return;stats.failed++;}stats.completed++;onProgress({...stats});}}
 try{await Promise.all(Array.from({length:Math.min(concurrency,queue.length)},immediateWorker));return stats;}finally{signal?.removeEventListener('abort',abort);}
}
