import React,{useContext,useEffect,useRef,useState} from 'react';
import {APIContext} from './shared';
import {useSystemText} from './system-shared';
import {createRun,respawnRun,stepRun} from './runner-model.mjs';
import {drawRun} from './runner-draw';
type Run=ReturnType<typeof createRun>;
const snapshot=(g:Run)=>({phase:g.phase,score:g.score,lives:g.lives,coins:g.coins.size,visited:g.visited.size,checkpoint:g.checkpoint,auto:g.auto});
function Runner({game}:{game:Run}){
 const api=useContext(APIContext),t=useSystemText(),canvas=useRef<HTMLCanvasElement>(null),[hud,setHud]=useState(()=>snapshot(game)),[unsupported,setUnsupported]=useState(false);
 const input=useRef({left:false,right:false,jump:false,jumpPressed:false}),actions=useRef({start:()=>{},pause:()=>{},restart:()=>{},auto:()=>{}});
 useEffect(()=>{
  const screen=canvas.current!,ctx=screen.getContext('2d');if(!ctx){setUnsupported(true);return}
  const owner=screen.closest('.window');let frame=0,last=0,accumulator=0,published=0,disposed=false;
  const redraw=()=>drawRun(screen,ctx,game),publish=()=>setHud(snapshot(game));
  const stop=()=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;accumulator=0;Object.assign(input.current,{left:false,right:false,jump:false,jumpPressed:false})};
  const active=()=>!document.hidden&&!owner?.classList.contains('inactive')&&!owner?.classList.contains('closing')&&!owner?.hasAttribute('hidden');
  const pause=()=>{stop();if(game.phase==='playing'){game.phase='paused';publish()}redraw()};
  const tick=(now:number)=>{
   frame=0;if(disposed)return;if(!active()){pause();return}
   accumulator+=last?Math.min(.06,(now-last)/1000):1/60;last=now;
   while(accumulator>=1/120&&game.phase==='playing'){stepRun(game,input.current,1/120);input.current.jumpPressed=false;accumulator-=1/120}
   redraw();if(now-published>180||game.phase!=='playing'){published=now;publish()}
   if(game.phase==='playing')frame=requestAnimationFrame(tick);else stop();
  };
  const start=()=>{if(disposed||!active())return;game.phase='playing';publish();screen.focus({preventScroll:true});if(!frame)frame=requestAnimationFrame(tick)};
  const restart=()=>{stop();respawnRun(game);start()};
  actions.current={start,pause,restart,auto:()=>{game.auto=!game.auto;publish();screen.focus({preventScroll:true})}};
  const jump=(down:boolean)=>{if(down&&!input.current.jump)input.current.jumpPressed=true;input.current.jump=down};
  const keydown=(e:KeyboardEvent)=>{
   if(!active()||!owner?.contains(document.activeElement))return;
   const key=e.key.toLowerCase();if(!['arrowleft','arrowright','a','d','arrowup','w',' ','p','escape','r','e'].includes(key))return;
   e.preventDefault();if(key==='r'){if(!e.repeat)restart();return}if(['p','escape'].includes(key)){if(!e.repeat){if(game.phase==='playing')pause();else if(game.phase==='paused')start()}return}
   if(key==='e'){pause();const id=game.world.sections[game.checkpoint]?.id;if(id)api.openDetails(id);return}
   if([' ','arrowup','w'].includes(key)){if(game.phase==='ready'&&!e.repeat)start();jump(true)}
   if(['arrowleft','a'].includes(key))input.current.left=true;if(['arrowright','d'].includes(key))input.current.right=true;
  };
  const keyup=(e:KeyboardEvent)=>{const key=e.key.toLowerCase();if([' ','arrowup','w'].includes(key))jump(false);if(['arrowleft','a'].includes(key))input.current.left=false;if(['arrowright','d'].includes(key))input.current.right=false};
  const check=()=>{if(!active())pause()},close=()=>{stop();if(game.phase==='playing')game.phase='paused'};
  const resize=new ResizeObserver(redraw);resize.observe(screen);
  document.addEventListener('keydown',keydown);document.addEventListener('keyup',keyup);document.addEventListener('portfolio-windows-changed',check);document.addEventListener('visibilitychange',check);window.addEventListener('blur',pause);owner?.addEventListener('window-closing',close);redraw();
  return()=>{disposed=true;close();resize.disconnect();document.removeEventListener('keydown',keydown);document.removeEventListener('keyup',keyup);document.removeEventListener('portfolio-windows-changed',check);document.removeEventListener('visibilitychange',check);window.removeEventListener('blur',pause);owner?.removeEventListener('window-closing',close)};
 },[api,game]);
 const current=game.world.sections[hud.checkpoint],openProject=()=>{actions.current.pause();if(current.id)api.openDetails(current.id)};
 const touch=(key:'left'|'right'|'jump',down:boolean)=>{if(key==='jump'&&down&&!input.current.jump)input.current.jumpPressed=true;input.current[key]=down};
 return <div className="runner-game"><div className="runner-hud"><span>SCORE <b>{String(hud.score).padStart(6,'0')}</b></span><span>MARKS <b>{String(hud.coins).padStart(2,'0')}</b></span><span>WORKS <b>{hud.visited}/{game.world.sections.length}</b></span><span className="runner-lives">{'♥ '.repeat(hud.lives)}</span><button aria-pressed={hud.auto} onClick={()=>actions.current.auto()}>{t('Auto run','自动前进')} {hud.auto?'ON':'OFF'}</button><button onClick={()=>hud.phase==='playing'?actions.current.pause():actions.current.start()} disabled={!['playing','paused'].includes(hud.phase)}>{hud.phase==='playing'?t('Pause','暂停'):t('Resume','继续')}</button><button onClick={()=>actions.current.restart()}>{t('Restart','重开')}</button></div>
 <div className="runner-screen"><canvas ref={canvas} tabIndex={0} aria-label={t('ASCII platform game. Arrow keys move; Space jumps; P pauses; R restarts; E opens the current project.','字符跑酷游戏。方向键移动，空格跳跃，P 暂停，R 重开，E 打开当前作品。')}/>{(hud.phase!=='playing'||unsupported)&&<div className="runner-overlay"><div><small>CHANGRAN ZHAO / INTERACTIVE PLAYGROUND</small><h1>{unsupported?'CANVAS UNAVAILABLE':hud.phase==='ready'?'PORTFOLIO RUN':hud.phase==='paused'?'PAUSED':hud.phase==='won'?'RUN COMPLETE':'TRY AGAIN'}</h1><p>{hud.phase==='ready'?t('A small adventure through my works, one character at a time.','用字符穿越我的作品，一路探索、跳跃和收集。'):hud.phase==='paused'?t('Your journey is waiting right here.','你的旅程停在这里，随时继续。'):hud.phase==='won'?t('You made it through every world. Explore the projects behind the names.','你已穿越全部作品世界，去看看名字背后的创作吧。'):t('Every good idea deserves another run.','每个好点子，都值得再试一次。')}</p>{!unsupported&&<button className="runner-start" onClick={()=>['over','won'].includes(hud.phase)?actions.current.restart():actions.current.start()}>{hud.phase==='ready'?t('Start adventure','开始冒险'):hud.phase==='paused'?t('Resume adventure','继续冒险'):t('Run again','再跑一次')} <span>↗</span></button>}{hud.phase==='won'&&<button className="runner-project" onClick={openProject}>{t('Explore the project','探索作品')} ↗</button>}<div className="runner-key-hints"><span><kbd>←</kbd><kbd>→</kbd> / A D</span><span><kbd>SPACE</kbd> {t('Jump','跳跃')}</span><span><kbd>P</kbd> {t('Pause','暂停')}</span></div></div></div>}</div>
 <div className="runner-footer"><span><i/> {current.title}</span><button onClick={openProject}>{t('View this project','查看当前作品')} <kbd>E</kbd> ↗</button></div><div className="runner-touch" aria-label={t('Game controls','游戏控制')}>{(['left','right','jump'] as const).map(key=><button key={key} aria-label={t(key==='jump'?'Jump':key==='left'?'Move left':'Move right',key==='jump'?'跳跃':key==='left'?'向左移动':'向右移动')} onPointerDown={e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);touch(key,true)}} onPointerUp={()=>touch(key,false)} onPointerCancel={()=>touch(key,false)} onLostPointerCapture={()=>touch(key,false)}>{key==='left'?'←':key==='right'?'→':'↑'}</button>)}</div></div>;
}
export function Terminal(){
 const api=useContext(APIContext),t=useSystemText(),[tab,setTab]=useState('game'),[command,setCommand]=useState(''),[output,setOutput]=useState('Creative OS / Changran Zhao\nType help to explore.\n'),game=useRef<Run>(null!);if(!game.current)game.current=createRun(api.projects);
 const submit=(e:React.FormEvent)=>{e.preventDefault();const raw=command.trim(),value=raw.toLowerCase();setCommand('');let response='';if(value==='help')response='play          Start the character adventure\nls            List projects\nopen <id>     Open a Full Project\nabout         About Changran Zhao\nclear         Clear terminal';else if(value==='ls')response=api.projects.map(p=>p.id.padEnd(5)+p.title).join('\n');else if(value==='play'){setTab('game');response='Opening PORTFOLIO RUN…'}else if(value==='about'){api.openApp('About');response='Opened About Me.'}else if(value==='clear'){setOutput('');return}else if(value.startsWith('open ')){const project=api.projects.find(p=>p.id===value.slice(5).trim());if(project){api.openDetails(project.id);response='Opened '+project.title}else response='Unknown project. Type ls to see project IDs.'}else if(value)response='Command not found. Type help.';setOutput(previous=>(previous+'\nvisitor ~ % '+raw+'\n'+response+'\n').slice(-18000))};
 return <main className="terminal-playground"><header className="os-toolbar runner-toolbar"><span>visitor@creativeos <b>~/playground</b></span><div><button aria-pressed={tab==='game'} onClick={()=>setTab('game')}>{t('Adventure','字符冒险')}</button><button aria-pressed={tab==='shell'} onClick={()=>setTab('shell')}>{t('Command line','命令行')}</button></div></header>{tab==='game'?<Runner game={game.current}/>:<div className="runner-shell"><pre aria-live="polite">{output}</pre><form onSubmit={submit}><label htmlFor="runner-command">visitor ~ %</label><input id="runner-command" autoFocus autoComplete="off" spellCheck={false} aria-label={t('Terminal command','终端命令')} value={command} onChange={e=>setCommand(e.target.value)}/></form></div>}</main>;
}
