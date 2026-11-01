export const FLOOR=22;
export const SEGMENT=44;
export function createRun(projects){
 const source=projects.length?projects:[{id:'',title:'CREATIVE OS'}];
 const sections=source.map((p,i)=>({id:p.id,title:p.title.toUpperCase(),x:i*SEGMENT}));
 return {phase:'ready',world:{sections,length:source.length*SEGMENT+6,finish:source.length*SEGMENT-3,
  gaps:sections.filter((_,i)=>i>0).map(s=>({x:s.x+34,w:3})),
  platforms:sections.flatMap(s=>[{x:s.x+11,y:18,w:Math.max(11,Math.min(24,s.title.length)),label:s.title},{x:s.x+25,y:14,w:11,label:'<'+(s.id||'RUN').toUpperCase()+'>'}]),
  pickups:sections.flatMap((s,i)=>[{id:i+'a',x:s.x+8,y:20},{id:i+'b',x:s.x+18,y:16.5},{id:i+'c',x:s.x+29,y:12.5}]),
  bugs:sections.filter((_,i)=>i>0).map(s=>({x:s.x+27,y:21,w:2,h:1}))},
 player:{x:4,y:FLOOR-3,w:1.6,h:3,vx:0,vy:0,grounded:true},coins:new Set(),visited:new Set([0]),lives:3,score:0,time:0,checkpoint:0,invincible:0,coyote:.1,jumpBuffer:0,auto:true};
}
export function respawnRun(g){const fresh=createRun(g.world.sections.map(s=>({id:s.id,title:s.title})));Object.assign(g,fresh);}
const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function damage(g){g.lives--;if(g.lives<=0){g.phase='over';return}Object.assign(g.player,{x:g.checkpoint*SEGMENT+3,y:FLOOR-3,vx:0,vy:0,grounded:true});g.invincible=1.5;g.coyote=.1;g.jumpBuffer=0;}
export function stepRun(g,input,delta){
 if(g.phase!=='playing')return;
 const dt=Math.min(1/30,Math.max(0,delta)),p=g.player;g.time+=dt;g.invincible=Math.max(0,g.invincible-dt);
 g.coyote=p.grounded?.11:Math.max(0,g.coyote-dt);g.jumpBuffer=input.jumpPressed?.12:Math.max(0,g.jumpBuffer-dt);
 const direction=(input.right||g.auto?1:0)-(input.left?1:0),target=direction*11;
 p.vx=g.auto?11:p.vx+(target-p.vx)*Math.min(1,dt*19);
 if(g.jumpBuffer>0&&g.coyote>0){p.vy=-24;g.coyote=0;g.jumpBuffer=0;p.grounded=false;}
 if(!input.jump&&p.vy< -8)p.vy+=22*dt;
 p.x=Math.max(0,Math.min(g.world.length-p.w,p.x+p.vx*dt));
 const previousBottom=p.y+p.h;p.vy=Math.min(28,p.vy+44*dt);p.y+=p.vy*dt;p.grounded=false;
 if(p.vy>=0){
  const surfaces=g.world.platforms.filter(platform=>p.x+p.w>platform.x&&p.x<platform.x+platform.w&&previousBottom<=platform.y+.08&&p.y+p.h>=platform.y);
  const overGap=g.world.gaps.some(gap=>p.x+p.w*.6>gap.x&&p.x+p.w*.4<gap.x+gap.w);
  if(!overGap&&previousBottom<=FLOOR+.08&&p.y+p.h>=FLOOR)surfaces.push({y:FLOOR});
  if(surfaces.length){const top=Math.min(...surfaces.map(s=>s.y));p.y=top-p.h;p.vy=0;p.grounded=true;}
 }
 const section=Math.min(g.world.sections.length-1,Math.floor((p.x+1)/SEGMENT));
 if(section>g.checkpoint){g.checkpoint=section;for(let i=0;i<=section;i++)g.visited.add(i)}
 for(const coin of g.world.pickups)if(!g.coins.has(coin.id)&&overlap(p,{...coin,w:1,h:1})){g.coins.add(coin.id);g.score+=100}
 for(const bug of g.world.bugs){const enemy={...bug,x:bug.x+Math.sin(g.time*1.7+bug.x)*2};if(g.invincible<=0&&overlap(p,enemy)){if(p.vy>0&&previousBottom<=enemy.y+.7){p.y=enemy.y-p.h;p.vy=-12;g.score+=50;g.invincible=.35}else{damage(g);return}}}
 if(p.y>31){damage(g);return}
 if(p.x>=g.world.finish){for(let i=0;i<g.world.sections.length;i++)g.visited.add(i);g.phase='won';g.score+=g.lives*500}
}
