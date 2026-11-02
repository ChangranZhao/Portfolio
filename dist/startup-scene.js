// Decode only the visible desktop, with bounded work, before the welcome moves.
export function welcomeTiming(elapsed){
 const available=8000-Math.max(0,elapsed)-1100;
 return available<1100?{duration:0,settle:0}:{duration:Math.min(4100,available-200),settle:400};
}
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
