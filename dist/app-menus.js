import {state,closeWindow,minimizeWindow,hideAll,focusWindow} from './windows.js';
import {traditional} from './chinese-traditional.js';
// Native-style menus use the existing window manager; no second window state.
export function setupApplicationMenus(actions){
 const nav=document.querySelector('.menu-left'),brand=document.querySelector('#brand-menu');
 if(!nav||!brand)return;
 const original=[...nav.querySelectorAll('[data-action]')];original.forEach(el=>el.classList.add('desktop-quick-link'));
 const host=document.createElement('div');host.className='application-menus';host.setAttribute('role','menubar');host.setAttribute('data-no-localize','');nav.append(host);
 const panel=document.createElement('div');panel.className='dropdown application-menu';panel.hidden=true;panel.setAttribute('role','menu');panel.setAttribute('data-no-localize','');document.body.append(panel);
 let opened=null,definitions=[],returnFocus=null,lastEditor=null,lastRender='';
 const t=(en,zh)=>document.documentElement.lang.startsWith('zh')?(/Hant|TW|HK/i.test(document.documentElement.lang)?[...zh].map(c=>traditional[c]||c).join(''):zh):en;
 const active=()=>[...document.querySelectorAll('#windows>.window')].find(el=>el.dataset.windowId===state.active);
 const button=(label,run,disabled=false,shortcut='')=>({label,run,disabled,shortcut});
 function close(restore=false){panel.hidden=true;opened?.setAttribute('aria-expanded','false');opened=null;if(restore)returnFocus?.focus({preventScroll:true});}
 function open(trigger,index,focus=false){
  close();document.dispatchEvent(new Event('portfolio-popover-opening'));document.querySelector('#main-menu').hidden=true;brand.setAttribute('aria-expanded','false');opened=trigger;returnFocus=trigger;trigger.setAttribute('aria-expanded','true');panel.replaceChildren();
  for(const item of definitions[index].items){if(!item){const line=document.createElement('div');line.className='menu-divider';line.setAttribute('role','separator');panel.append(line);continue;}
   const el=document.createElement('button');el.type='button';el.role='menuitem';el.textContent=item.label;el.disabled=item.disabled;el.onclick=()=>{close();item.run();};if(item.shortcut){const key=document.createElement('span');key.className='shortcut';key.setAttribute('aria-hidden','true');key.textContent=item.shortcut;el.append(key);}panel.append(el);
  }
  const rect=trigger.getBoundingClientRect();panel.style.left=Math.max(8,Math.min(rect.left,innerWidth-252))+'px';panel.style.top=(rect.bottom+5)+'px';panel.hidden=false;
  if(focus)panel.querySelector('button:not(:disabled)')?.focus();
 }
 function render(){
  const win=active(),id=state.active,name=win?.dataset.appName||win?.querySelector('.window-title')?.textContent||win?.getAttribute('aria-label')||'Finder';
  const editable=!!(lastEditor?.isConnected&&win?.contains(lastEditor));
  const snapshot=JSON.stringify([id,name,document.documentElement.lang,editable,win?.classList.contains('maximized'),[...state.items.values()].map(item=>[item.id,item.minimized,document.querySelector(`[data-window-id="${CSS.escape(item.id)}"] .window-title`)?.textContent])]);
  // Loading/metadata notifications often repeat without changing the menu.
  // Replacing the hovered button would restart pointer-enter and popup motion.
  if(snapshot===lastRender)return;lastRender=snapshot;
  if(opened)close();
  const search=()=>{const input=win?.querySelector('input[type=search]');if(input){input.focus();input.select();}else actions.search();};
  const closeCurrent=()=>id&&closeWindow(id),minimize=()=>id&&minimizeWindow(id),maximize=()=>win?.querySelector('.light.maximize')?.click();
  const edit=command=>{if(editable)lastEditor.focus();if(document.execCommand?.(command)===false){const status=document.querySelector('#toast');if(status){status.textContent=t('Use the keyboard shortcut in the text field.','请在文本框中使用键盘快捷键。');status.classList.add('visible');setTimeout(()=>status.classList.remove('visible'),2600);}}};
  definitions=[
   {name,items:[button(t('About Me','关于我'),actions.about),null,button(t('System Settings…','系统设置…'),actions.settings),null,button(t('Hide '+name,'隐藏 '+name),minimize,!win),button(t('Close '+name,'关闭 '+name),closeCurrent,!win)]},
   {name:t('File','文件'),items:[button(t('Open Portfolio','打开作品集'),actions.projects),button(t('Open Photos','打开照片'),actions.photos),button(t('Open Design Boards','打开项目图版'),actions.figma),null,button(t('Close Window','关闭窗口'),closeCurrent,!win)]},
   {name:t('Edit','编辑'),items:[button(t('Undo','撤销'),()=>edit('undo'),!editable,'⌘Z'),button(t('Redo','重做'),()=>edit('redo'),!editable,'⇧⌘Z'),null,button(t('Cut','剪切'),()=>edit('cut'),!editable,'⌘X'),button(t('Copy','复制'),()=>edit('copy'),false,'⌘C'),button(t('Paste','粘贴'),()=>edit('paste'),!editable,'⌘V'),button(t('Select All','全选'),()=>edit('selectAll'),!editable,'⌘A')]},
   {name:t('View','显示'),items:[button(t('Search…','搜索…'),search),button(t(win?.classList.contains('maximized')?'Restore Window':'Zoom Window',win?.classList.contains('maximized')?'还原窗口':'放大窗口'),maximize,!win),null,button(t('Show Desktop','显示桌面'),hideAll)]},
   {name:t('Window','窗口'),items:[button(t('Minimize','最小化'),minimize,!win),null,...[...state.items.values()].map(item=>button((item.id===id?'✓  ':'')+(document.querySelector(`[data-window-id="${CSS.escape(item.id)}"] .window-title`)?.textContent||item.id),()=>focusWindow(item.id)))]},
   {name:t('Help','帮助'),items:[button(t('About Creative OS','关于 Creative OS'),actions.network),button(t('Exhibitions & Papers','展览与论文'),actions.research)]}
  ];
  // Keep menu surfaces and pointer targets stable across window closes.
  // Replacing these nodes can leave a stale hover/compositing rectangle in a glass menubar.
  definitions.forEach((item,index)=>{let el=host.children[index];if(!el){el=document.createElement('button');el.type='button';el.role='menuitem';el.setAttribute('aria-haspopup','menu');el.setAttribute('aria-expanded','false');el.onclick=()=>opened===el?close():open(el,index);el.onpointerenter=e=>{if(e.pointerType!=='touch'&&innerWidth>700&&opened!==el)open(el,index);};el.onkeydown=e=>{if(['ArrowDown','Enter',' '].includes(e.key)){e.preventDefault();open(el,index,true);}else if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();host.children[(index+(e.key==='ArrowRight'?1:-1)+definitions.length)%definitions.length].focus();}};host.append(el);}if(el.textContent!==item.name)el.textContent=item.name;});
 }
 panel.addEventListener('keydown',e=>{const items=[...panel.querySelectorAll('button:not(:disabled)')],index=items.indexOf(document.activeElement);if(['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();items[e.key==='Home'?0:e.key==='End'?items.length-1:(index+(e.key==='ArrowDown'?1:-1)+items.length)%items.length]?.focus();}else if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const next=([...host.children].indexOf(opened)+(e.key==='ArrowRight'?1:-1)+definitions.length)%definitions.length;open(host.children[next],next,true);}else if(e.key==='Escape'){e.preventDefault();close(true);}});
 document.addEventListener('pointerdown',e=>{if(!host.contains(e.target)&&!panel.contains(e.target))close();});
 document.addEventListener('focusin',e=>{if(opened&&!host.contains(e.target)&&!panel.contains(e.target))close();if(e.target.matches('input:not([type=range]):not([type=checkbox]),textarea,[contenteditable=true]')){lastEditor=e.target;render();}});
 document.addEventListener('portfolio-popover-opening',()=>close());
 document.addEventListener('pointermove',e=>{if(!opened||e.pointerType==='touch'||panel.contains(e.target))return;const r=nav.getBoundingClientRect();if(e.clientY>r.bottom+265||e.clientY<r.top-20)close();},{passive:true});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&opened)close(true);});
 document.addEventListener('portfolio-windows-changed',render);document.addEventListener('portfolio-preferences',render);window.addEventListener('resize',()=>close());render();
}
