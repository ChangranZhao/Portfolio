// Decode only the visible desktop, with bounded work, before the welcome moves.
export async function prepareStartupScene({images=[],fontsReady,signal,nextFrame}={}){
 let aborted=signal?.aborted||false,stop;
 const cancelled=new Promise(resolve=>{stop=resolve;});
 const abort=()=>{aborted=true;stop();};
 signal?.addEventListener('abort',abort,{once:true});
 if(aborted)abort();
 let index=0;
 const settle=promise=>Promise.race([Promise.resolve(promise).catch(()=>{}),cancelled]);
 try{
  await settle(fontsReady);
  const queue=[...new Set(images)];
  await Promise.all(Array.from({length:Math.min(2,queue.length)},async()=>{
   while(index<queue.length&&!aborted){const image=queue[index++];await settle(image.decode?.());}
  }));
  // Separate resource completion, style/layout and the first painted frame.
  if(!aborted)await settle(nextFrame());
  if(!aborted)await settle(nextFrame());
  return !aborted;
 }finally{signal?.removeEventListener('abort',abort);}
}
