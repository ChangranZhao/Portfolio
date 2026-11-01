import type {createRun} from './runner-model.mjs';
type Run=ReturnType<typeof createRun>;
const colors=['#8ee6b4','#91c9ed','#c4aff1','#f3c583'];
export function drawRun(canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D,g:Run){
 const width=canvas.clientWidth||900,height=canvas.clientHeight||400,dpr=Math.min(window.devicePixelRatio||1,1.5);
 const w=Math.round(width*dpr),h=Math.round(height*dpr);if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle='#0b1110';ctx.fillRect(0,0,width,height);
 const ch=height/26,font=ch*.85;ctx.font=`500 ${font}px ui-monospace,SFMono-Regular,Consolas,monospace`;ctx.textBaseline='top';
 const cw=ctx.measureText('M').width,cols=width/cw,camera=Math.max(0,Math.min(g.player.x-cols*.32,Math.max(0,g.world.length-cols)));
 const text=(value:string,x:number,y:number,color='#8ee6b4')=>{if(x+value.length<camera-2||x>camera+cols+2)return;ctx.fillStyle=color;ctx.fillText(value,(x-camera)*cw,y*ch)};
 const sky=(value:string,x:number,y:number)=>{ctx.fillStyle='#203e35';ctx.fillText(value,x*cw,y*ch)};
 for(let i=0;i<7;i++){const x=((i*23-camera*.16)%(cols+25)+(cols+25))%(cols+25)-10;sky(i%2?'     .--.     ':' .   .  .    ',x,1+i%3);sky(i%2?'  .-(    ).   ':'     .    .  ',x,2+i%3)}
 for(const [index,section] of g.world.sections.entries()){
  const base=section.x,color=colors[index%colors.length];if(base>camera+cols+4||base+44<camera-4)continue;
  text(String(index+1).padStart(2,'0')+' / '+section.title.slice(0,26),base+3,5,color);
  if(section.title.length>26)text(section.title.slice(26),base+8,6,'#57776b');
  text('        /\\       ',base+3,13,'#1d352e');text('       /::\\      ',base+3,14,'#1d352e');text('      /::::\\     ',base+3,15,'#1d352e');text('_____/::::::\\____',base+3,16,'#1d352e');
  text(' [ '+section.id.toUpperCase()+' ] ',base+2,19,'#547968');
  const gaps=g.world.gaps.filter((gap:{x:number;w:number})=>gap.x>=base&&gap.x<base+44),pieces=gaps.length?[[base,gaps[0].x-base],[gaps[0].x+gaps[0].w,base+44-gaps[0].x-gaps[0].w]]:[[base,44]];
  for(const [x,length] of pieces){text('='.repeat(length),x,22,color);const title=(section.title.replace(/[^A-Z0-9]+/g,'.')+'.').repeat(5);text(title.slice(Math.round(x-base),Math.round(x-base)+length),x,23,'#426455');text(':'.repeat(length),x,24,'#244538');text('#'.repeat(length),x,25,'#173326')}
 }
 for(const platform of g.world.platforms){text(platform.label.slice(0,platform.w).padEnd(platform.w,'_'),platform.x,platform.y,'#a6dcc2');text('['+'-'.repeat(Math.max(0,platform.w-2))+']',platform.x,platform.y+1,'#3d6654')}
 for(const coin of g.world.pickups)if(!g.coins.has(coin.id))text(Math.floor(g.time*4)%2?'*':'+',coin.x,coin.y,'#f3c583');
 for(const bug of g.world.bugs)text('xx',bug.x+Math.sin(g.time*1.7+bug.x)*2,bug.y,'#f08d8d');
 const goal=g.world.finish;text('|> FINISH',goal,14,'#f3c583');for(let y=15;y<22;y++)text('|',goal,y,'#f3c583');
 if(g.invincible<=0||Math.floor(g.time*12)%2===0){const p=g.player,walk=Math.abs(p.vx)>1&&p.grounded&&Math.floor(g.time*10)%2===0;text(' o ',p.x-.6,p.y,'#f2fff7');text('/|\\',p.x-.6,p.y+1,'#f2fff7');text(p.grounded?(walk?' \\/':'/ \\'):'< >',p.x-.6,p.y+2,'#f2fff7')}
}
