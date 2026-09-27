import React, {useEffect,useRef,useState} from 'react';
import {createRoot} from 'react-dom/client';
import './style.css';
import './board.css';
import CultureBoard from './CultureBoard.jsx';
import {localizeAsset} from './localization.js';
import {matchesTheme} from './culture-knowledge.js';
import {captureViewport,downloadImage} from './capture.js';

const categories = [['工业记忆','Industrial Memory'],['城市发展','Urban Development'],['青铜器物','Bronze Objects'],['陶瓷器物','Pottery & Porcelain'],['玉石佩饰','Jade & Ornaments'],['古代货币','Coins & Moulds'],['建筑瓦当','Architectural Tiles'],['制造工艺','Manufacturing']];
import {photos,cardGeometry} from './sphere-layout.js';

function CultureSphere({playing,depth,reset,onSelect,selectedCategory,frozen,pure,lang}){
 const tr=(zh,en)=>lang==='zh'?zh:en;
 const stage=useRef(), globe=useRef(), rotation=useRef({x:-9,y:18}), drag=useRef(null), velocity=useRef({x:0,y:0}), moved=useRef(false),[scale,setScale]=useState(1);
 useEffect(()=>{const observer=new ResizeObserver(([e])=>setScale(Math.min(e.contentRect.width/720,e.contentRect.height/720)));observer.observe(stage.current);return()=>observer.disconnect()},[pure]);
 useEffect(()=>{rotation.current={x:-9,y:18};velocity.current={x:0,y:0}},[reset]);
 const wake=useRef(()=>{});
 useEffect(()=>{
  let frame=0,timer=0,last=0,visible=false,hostActive=true,dirty=true;
  const paint=()=>{globe.current.style.transform=`rotateX(${rotation.current.x}deg) rotateY(${rotation.current.y}deg)`;};
  const stop=()=>{cancelAnimationFrame(frame);clearTimeout(timer);frame=timer=0;last=0;};
  const active=()=>visible&&hostActive&&!document.hidden;
  function tick(time){
   frame=0;if(!active())return;
   const dt=last?Math.min((time-last)/16.67,3):1;last=time;
   if(!frozen.current){
    if(!drag.current){rotation.current.y+=(playing?.075:0)*dt+velocity.current.y*dt;rotation.current.x=Math.max(-65,Math.min(65,rotation.current.x+velocity.current.x*dt));velocity.current.x*=Math.pow(.94,dt);velocity.current.y*=Math.pow(.94,dt);}
    const moving=playing||drag.current||Math.abs(velocity.current.x)+Math.abs(velocity.current.y)>.002;
    if(dirty||moving){paint();dirty=false;}
    if(!moving)return;
   }
   timer=setTimeout(()=>{timer=0;frame=requestAnimationFrame(tick)},1000/30);
  }
  const start=()=>{dirty=true;if(active()&&!frame&&!timer)frame=requestAnimationFrame(tick);};
  wake.current=start;paint();
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible)start();else stop();},{threshold:0});observer.observe(stage.current);
  const visibility=()=>{if(document.hidden)stop();else start();};document.addEventListener('visibilitychange',visibility);
  const message=e=>{if(e.source!==parent||e.origin!==location.origin||e.data?.type!=='portfolio-culture-active')return;hostActive=!!e.data.active;if(hostActive)start();else stop();};window.addEventListener('message',message);
  return()=>{stop();observer.disconnect();document.removeEventListener('visibilitychange',visibility);window.removeEventListener('message',message);wake.current=()=>{};};
 },[playing,depth,reset]);
 useEffect(()=>{wake.current()},[reset,depth]);
 const down=e=>{if(frozen.current||e.button!==0)return;drag.current={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY};moved.current=false;velocity.current={x:0,y:0};stage.current.setPointerCapture(e.pointerId);wake.current()};
 const move=e=>{if(frozen.current||!drag.current)return;const dx=e.clientX-drag.current.x,dy=e.clientY-drag.current.y;if(Math.hypot(e.clientX-drag.current.startX,e.clientY-drag.current.startY)>5)moved.current=true;rotation.current.y+=dx*.26;rotation.current.x=Math.max(-65,Math.min(65,rotation.current.x-dy*.24));velocity.current={x:-dy*.05,y:dx*.05};drag.current.x=e.clientX;drag.current.y=e.clientY;wake.current()};
 const up=e=>{if(frozen.current||!drag.current)return;if(!moved.current){const target=document.elementFromPoint(e.clientX,e.clientY)?.closest('[data-photo]');if(target)onSelect(photos[Number(target.dataset.photo)])}drag.current=null};
 return <div className="sphere-stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={()=>drag.current=null} tabIndex={0} role="region" aria-label={tr('文化球，拖动或使用方向键旋转','Culture sphere: drag or use arrow keys to rotate')} onKeyDown={e=>{if(!frozen.current&&e.key.startsWith('Arrow')){e.preventDefault();rotation.current.y+=e.key==='ArrowLeft'?-12:e.key==='ArrowRight'?12:0;rotation.current.x=Math.max(-65,Math.min(65,rotation.current.x+(e.key==='ArrowUp'?-8:e.key==='ArrowDown'?8:0)));wake.current()}}}>
 <div className="sphere-scaler" style={{transform:`scale(${scale})`}}><div className="crosshair horizontal"/><div className="crosshair vertical"/><div className="outer-ring"/><div className="outer-ring second"/>
 <div className="perspective"><div ref={globe} className="globe">
 {Array.from({length:9},(_,i)=><div className="wire-ring" key={'ring'+i} style={{transform:`translate(-50%,-50%) rotateY(${i*20}deg)`}}/>)}
 {[-60,-30,0,30,60].map(lat=><div className="wire-ring latitude" key={lat} style={{width:520*Math.cos(lat*Math.PI/180),height:520*Math.cos(lat*Math.PI/180),transform:`translate(-50%,-50%) translateY(${260*Math.sin(lat*Math.PI/180)}px) rotateX(90deg)`}}/>)}
 <div className="orbit" style={{transform:'translate(-50%,-50%) rotateX(68deg) rotateY(20deg)'}}><i/></div><div className="orbit orbit-two" style={{transform:'translate(-50%,-50%) rotateX(-35deg) rotateY(65deg)'}}><i/></div>
 {photos.map(p=>{const g=cardGeometry(p,depth),asset=localizeAsset(p,lang);return <button type="button" key={p.id} data-photo={p.id} aria-label={`${tr('查看','View ')}${asset.title} · ${p.id+1}`} className={`photo-card ${p.story?'story-photo':''} ${!matchesTheme(p,selectedCategory)?'dimmed':''}`} style={{width:g.width,height:g.height,'--thickness':g.thickness+'px',transform:`translate(-50%,-50%) rotateY(${p.longitude}deg) rotateX(${p.latitude}deg) translateZ(${g.radius}px) rotateZ(${g.roll}deg)`}} onClick={e=>{if(e.detail===0)onSelect(p)}}><span className="photo-face face-front" data-face="front"><img src={p.thumb||p.src} decoding="async" alt={asset.title} draggable="false"/></span>{['right','bottom','back'].map(side=><i key={side} className={'photo-face face-'+side} data-face={side} aria-hidden="true"/>)}</button>})}
 </div></div>
 {categories.map(([cn,en],i)=><div className={`sphere-label label-${i}`} key={en}><i/><div>{tr(cn,en)}</div></div>)}
 <div className="sphere-coordinate">{tr('北纬 36°48′ / 东经 118°03′','36°48′ N / 118°03′ E')}</div>
 </div></div>
}

function App(){
 const [lang,setLang]=useState(()=>{try{return localStorage.getItem('culture-language')==='zh'?'zh':'en'}catch{return 'zh'}});
 const tr=(zh,en)=>lang==='zh'?zh:en;
 useEffect(()=>{document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.title=tr('齐文化 · 空间知识图谱','Qi Culture · Spatial Knowledge Atlas');try{localStorage.setItem('culture-language',lang)}catch{}},[lang]);
 const [pure,setPure]=useState(false),[hideNotes,setHideNotes]=useState(false),[saving,setSaving]=useState(false),[notice,setNotice]=useState(null);
 const frozen=useRef(false);
 useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(null),5000);return()=>clearTimeout(timer)},[notice]);
 async function saveFrame(){
  if(frozen.current)return;
  frozen.current=true;setSaving(true);setNotice(null);
  const name=tr('文化球-','Culture-sphere-')+new Date().toISOString().replace(/[:.]/g,'-')+'.png';
  try{
   let handle=null;
   if(typeof window.showSaveFilePicker==='function'){
    try{handle=await window.showSaveFilePicker({suggestedName:name,types:[{description:tr('图片','PNG image'),accept:{'image/png':['.png']}}]})}
    catch(error){if(error.name!=='SecurityError')throw error}
   }
   const blob=await captureViewport();
   if(handle){const file=await handle.createWritable();await file.write(blob);await file.close()}
   else downloadImage(blob,name);
   setNotice({text:handle?tr('画面已保存','Image saved'):tr('图片已下载，请在浏览器下载文件夹中查看','Image downloaded. Check your browser downloads folder.'),error:false});
  }catch(error){if(error.name!=='AbortError'){console.error(error);setNotice({text:tr('保存失败，请重试或换用其他浏览器','Save failed. Please try again or use another browser.'),error:true})}}
  finally{frozen.current=false;setSaving(false)}
 }

 const [playing,setPlaying]=useState(()=>!window.matchMedia('(prefers-reduced-motion: reduce)').matches),[depth,setDepth]=useState(0.2),[reset,setReset]=useState(0),[category,setCategory]=useState(null),[selected,setSelected]=useState(null);const dialog=useRef();
 useEffect(()=>{const apply=p=>{if(p.lang)setLang(p.lang==='en'?'en':'zh');if(typeof p.motion==='boolean')setPlaying(!p.motion);};try{apply(JSON.parse(localStorage.getItem('portfolio-preferences')||'{}'))}catch{}const handle=e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='portfolio-preferences')apply(e.data)};window.addEventListener('message',handle);return()=>window.removeEventListener('message',handle);},[]);
 useEffect(()=>{const handle=e=>{if(e.source===parent&&e.origin===location.origin&&e.data?.type==='portfolio-culture-theme'&&Number.isInteger(e.data.theme)&&e.data.theme>=0&&e.data.theme<4)setCategory(e.data.theme);};window.addEventListener('message',handle);return()=>window.removeEventListener('message',handle);},[]);
 useEffect(()=>{if(selected)dialog.current.showModal();else if(dialog.current.open)dialog.current.close()},[selected]);
 const selectedAsset=selected?localizeAsset(selected,lang):null;
 return <div className={'app '+(pure?'pure-mode ':'')+(hideNotes?'notes-hidden':'')} data-language={lang}>
 <div className="capture-tools" data-capture-exclude="" aria-label={tr('画面工具','View tools')}>
  <button className="language-toggle" type="button" disabled={saving} aria-label={tr('切换为英文','Switch to Chinese')} onClick={()=>{setLang(lang==='zh'?'en':'zh');setNotice(null)}}>{tr('语言：中文','Language: English')} ↔</button>
  <button type="button" className="notes-toggle" disabled={saving||pure} aria-pressed={hideNotes} aria-label={hideNotes?tr('显示说明','Show captions'):tr('隐藏说明','Hide captions')} onClick={()=>{setHideNotes(!hideNotes);setSelected(null);setNotice(null)}}>{hideNotes?tr('显示说明','Show captions'):tr('隐藏说明','Hide captions')}</button>
  <button type="button" aria-label={pure?tr('恢复界面','Restore interface'):tr('纯球模式','Sphere only')} title={pure?tr('恢复界面','Restore interface'):tr('纯球模式','Sphere only')} aria-pressed={pure} disabled={saving} onClick={()=>{setPure(!pure);setSelected(null);setNotice(null)}}>
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>{pure&&<path d="m3 3 18 18"/>}</svg><span>{pure?tr('恢复界面','Restore interface'):tr('纯球模式','Sphere only')}</span>
  </button>
  <button type="button" aria-label={tr('保存画面','Save image')} title={saving?tr('正在保存…','Saving…'):tr('保存画面为图片','Save image as PNG')} disabled={saving} onClick={saveFrame}>
   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/></svg><span>{saving?tr('正在保存…','Saving…'):tr('保存画面','Save image')}</span>
  </button>
 </div>
 {notice&&<div className="capture-notice" data-capture-exclude="" role={notice.error?'alert':'status'}>{notice.text}</div>}
 <CultureBoard {...{lang,category,setCategory,setSelected,playing,setPlaying,depth,setDepth,setReset}}><CultureSphere playing={playing&&!selected} depth={depth} reset={reset} onSelect={pure?()=>{}:setSelected} selectedCategory={category} frozen={frozen} pure={pure} lang={lang}/></CultureBoard>
 <dialog ref={dialog} onCancel={()=>setSelected(null)} onClick={e=>{if(e.target===dialog.current)setSelected(null)}}>{selected&&<div className="detail"><button className="close" aria-label={tr('关闭图片','Close image')} onClick={()=>setSelected(null)}>×</button><img src={selected.src} alt={selectedAsset.title}/><div className="detail-meta"><span>{tr('影像','FRAGMENT')} {String(selected.id+1).padStart(2,'0')} / {photos.length}</span><h2>{selectedAsset.title}</h2><p>{selectedAsset.description}</p><p className="archive-source">{selected.sourceUrl?<a href={selected.sourceUrl} target="_blank" rel="noreferrer">{tr('来源：','Source: ')}{selectedAsset.source} ↗</a>:<>{tr('来源：','Source: ')}{selectedAsset.source}</>}</p></div></div>}</dialog>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
