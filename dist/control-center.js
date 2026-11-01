import {musicSettings,updateMusicSettings} from './background-music.js';
import {traditional} from './chinese-traditional.js';
import {materialControls} from './material-controls.js';
export function setupControlCenter(trigger,actions){
 const panel=document.createElement('section');panel.className='system-control-center';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('data-no-localize','');document.body.append(panel);
 trigger.setAttribute('aria-haspopup','dialog');trigger.setAttribute('aria-expanded','false');
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?(/Hant|TW|HK/i.test(document.documentElement.lang)?[...zh].map(c=>traditional[c]||c).join(''):zh):en;
 const make=(tag,cls,text)=>{const el=document.createElement(tag);el.className=cls;if(text)el.textContent=text;return el;};
 const icon=type=>{const el=make('span','cc-symbol');el.setAttribute('aria-hidden','true');const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');const p=document.createElementNS(svg.namespaceURI,'path');p.setAttribute('d',({projects:'M3 3h18v18H3ZM3 9h18M9 3v18M15 3v18M3 15h18',photos:'M3 3h18v18H3ZM3 17l5-6 4 4 3-3 6 7M16 7h.01',figma:'M12 2l10 10-10 10L2 12ZM12 7l5 5-5 5-5-5Z',theme:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM12 2v20M8 4v16M5 7v10',desktop:'M2 4h20v14H2ZM8 22h8M12 18v4',music:'M9 17V5l11-2v12M9 17c0 4-6 5-6 2s6-5 6-2ZM20 15c0 4-6 5-6 2s6-5 6-2Z',display:'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10ZM12 1v3M12 20v3M1 12h3M20 12h3M4 4l2 2M18 18l2 2M4 20l2-2M18 6l2-2',sound:'M3 9h4l5-5v16l-5-5H3ZM16 8a6 6 0 0 1 0 8M19 4a11 11 0 0 1 0 16'})[type]);p.setAttribute('fill','none');p.setAttribute('stroke','currentColor');p.setAttribute('stroke-width','1.6');p.setAttribute('stroke-linejoin','round');p.setAttribute('stroke-linecap','round');svg.append(p);el.append(svg);return el;};
 const close=(focus=false)=>{panel.hidden=true;trigger.setAttribute('aria-expanded','false');if(focus)trigger.focus({preventScroll:true});};
 function tile(type,label,detail,run){const b=make('button','cc-tile');b.type='button';b.append(icon(type));const text=make('span','');text.append(make('strong','',label),make('small','',detail));b.append(text);b.onclick=run;return b;}
 function slider(label,value,min,max,step,onInput,type){const card=make('label','cc-card cc-slider'),caption=make('span','cc-caption',label),output=make('output','',Math.round(value)+'%'),track=make('span','cc-track'),range=make('input','');range.type='range';range.min=min;range.max=max;range.step=step;range.value=value;range.setAttribute('aria-label',label);caption.append(output);const fill=()=>track.style.setProperty('--cc-fill',(Number(range.value)-min)/(max-min)*100+'%');fill();range.oninput=()=>{output.value=range.value+'%';fill();onInput(Number(range.value));};track.append(icon(type),range);card.append(caption,track);return card;}
 function render(){
  panel.replaceChildren();panel.setAttribute('aria-label',t('Control Center','控制中心'));
  const top=make('div','cc-top'),apps=make('div','cc-card cc-apps'),right=make('div','cc-actions');
  for(const [type,label,detail,action] of [['projects',t('Portfolio','作品集'),t('Selected works','精选项目'),actions.projects],['photos',t('Photos','照片'),t('Albums & favorites','相簿与收藏'),actions.photos],['figma',t('Design boards','项目图版'),'Figma',actions.figma]])apps.append(tile(type,label,detail,()=>{close();action();}));
  right.append(tile('theme',t('Appearance','外观'),document.documentElement.dataset.theme==='dark'?t('Dark','深色'):t('Light','浅色'),()=>{window.creativeOSTheme.set(document.documentElement.dataset.theme==='dark'?'light':'dark');render();panel.querySelector('.cc-actions button')?.focus({preventScroll:true});}),tile('desktop',t('Show Desktop','显示桌面'),t('Minimize windows','最小化窗口'),()=>{close();actions.desktop();}));top.append(apps,right);panel.append(top);
  panel.append(slider(t('Display','显示亮度'),Math.round((parseFloat(document.documentElement.style.getPropertyValue('--wall-brightness'))||1)*100),50,120,5,v=>document.documentElement.style.setProperty('--wall-brightness',v/100),'display'));
  panel.append(slider(t('Sound','音量'),Math.round(musicSettings().volume*100),0,100,1,v=>updateMusicSettings({volume:v/100}),'sound'));
  const music=make('div','cc-card cc-player'),copy=make('span','');copy.append(make('strong','',musicSettings().title),make('small','',musicSettings().artist));const play=make('button','cc-play');play.type='button';play.textContent=musicSettings().enabled?'Ⅱ':'▶';play.setAttribute('aria-label',musicSettings().enabled?t('Pause background music','暂停背景音乐'):t('Play background music','播放背景音乐'));play.onclick=()=>{updateMusicSettings({enabled:!musicSettings().enabled});render();};music.append(icon('music'),copy,play);panel.append(music);
  const material=make('div','cc-card cc-material');materialControls(material);panel.append(material);
  const settings=make('button','cc-settings',t('System Settings…','系统设置…'));settings.type='button';settings.onclick=()=>{close();actions.settings();};panel.append(settings);
 }
 const open=()=>{document.dispatchEvent(new Event('portfolio-popover-opening'));render();panel.hidden=false;trigger.setAttribute('aria-expanded','true');panel.querySelector('button')?.focus({preventScroll:true});};
 trigger.addEventListener('click',()=>panel.hidden?open():close());
 document.addEventListener('pointerdown',e=>{if(!panel.contains(e.target)&&!trigger.contains(e.target))close();});
 document.addEventListener('portfolio-popover-opening',()=>close());
 document.addEventListener('portfolio-preferences',()=>{if(!panel.hidden)render();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){e.preventDefault();close(true);}});
 document.addEventListener('focusin',e=>{if(!panel.hidden&&!panel.contains(e.target)&&!trigger.contains(e.target))close();});
 return {close};
}
