// React's first commit and the loading fallback race to reveal exactly once.
export function prepareWindowReveal(show,{schedule=setTimeout,cancel=clearTimeout,delay=180}={}){
 let finished=false;
 const reveal=()=>{if(finished)return;finished=true;cancel(timer);show();};
 const timer=schedule(reveal,delay);
 return {ready:reveal,cancel(){finished=true;cancel(timer);}};
}
