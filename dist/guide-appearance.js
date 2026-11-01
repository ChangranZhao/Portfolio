// One short-lived view; the pre-paint controllers own all saved preferences.
export function appearanceGuide(host,text){
 const node=(tag,label,cls)=>{const el=document.createElement(tag);if(label)el.textContent=label;if(cls)el.className=cls;return el;};
 const button=(label,fn)=>{const el=node('button',label);el.type='button';el.onclick=fn;return el;};
 const layout=node('div',null,'guide-appearance-layout');layout.setAttribute('data-no-localize','');
 const preview=node('div',null,'guide-material-preview');preview.setAttribute('aria-hidden','true');
 const demo=node('div',null,'guide-preview-window'),bar=node('div','● ● ●','guide-preview-bar');
 demo.append(bar,node('small','CREATIVE OS'),node('h2',text('你的创作空间','你的創作空間','Your creative space')));
 for(const title of [text('作品集','作品集','Portfolio'),text('照片图库','照片圖庫','Photos'),text('个人介绍','個人介紹','About Me')])demo.append(node('div',title,'guide-preview-row'));
 preview.append(demo,node('p',text('让界面成为你喜欢的样子。','讓介面成為你喜歡的樣子。','Make yourself at home.')));
 const controls=node('div',null,'guide-appearance-controls'),themes=node('div',null,'guide-choices');
 themes.setAttribute('role','group');themes.setAttribute('aria-label',text('外观','外觀','Appearance'));
 for(const [mode,label] of [['light',text('浅色','淺色','Light')],['dark',text('深色','深色','Dark')],['system',text('跟随系统','跟隨系統','System')]]){const b=button(label,()=>window.creativeOSTheme.set(mode));b.dataset.themeOption=mode;themes.append(b);}
 controls.append(node('h2',text('外观','外觀','Appearance')),themes,node('h2',text('界面材质','介面材質','Interface material')));
 const materials=node('div',null,'guide-material-options');materials.setAttribute('role','group');materials.setAttribute('aria-label',text('界面材质','介面材質','Interface material'));
 for(const [mode,title,note] of [['classic','Classic',text('熟悉、简洁的桌面质感','熟悉、簡潔的桌面質感','Familiar, quiet surfaces')],['liquid','Liquid Glass',text('透光、折射与细腻的层次','透光、折射與細膩的層次','Translucency, depth and light')]]){const b=button('',()=>window.creativeOSMaterial.set(mode));b.dataset.materialOption=mode;b.append(node('strong',title),node('small',note));materials.append(b);}
 const tuning=node('div',null,'guide-glass-tuning'),rows=[];
 for(const [key,label,max,unit] of [['transparency',text('玻璃透明度','玻璃透明度','Glass transparency'),100,'%'],['refraction',text('折射强度','折射強度','Refraction strength'),200,'%'],['blur',text('背景模糊','背景模糊','Background blur'),30,' px']]){
  const row=node('label',null,'guide-glass-row'),input=node('input'),output=node('output');input.type='range';input.min=0;input.max=max;input.step=1;input.setAttribute('aria-label',label);
  input.oninput=()=>window.creativeOSGlass.set({[key]:Number(input.value)});row.append(node('span',label),input,output);tuning.append(row);rows.push({key,input,output,unit});
 }
 tuning.append(button(text('恢复当前主题默认值','恢復目前主題預設值','Reset this theme'),()=>window.creativeOSGlass.reset()));
 controls.append(materials,tuning,node('p',text('实时预览并自动保存。深浅色分别记忆，之后可在系统设置中修改。','即時預覽並自動儲存。深淺色分別記憶，之後可在系統設定中修改。','Preview live and save automatically. Light and dark remember their own values. You can change these later in Settings.')));
 layout.append(preview,controls);host.append(layout);
 function sync(){const settings=window.creativeOSGlass.get();tuning.hidden=window.creativeOSMaterial.mode!=='liquid';for(const b of themes.children)b.setAttribute('aria-pressed',String(b.dataset.themeOption===window.creativeOSTheme.mode));for(const b of materials.children)b.setAttribute('aria-pressed',String(b.dataset.materialOption===window.creativeOSMaterial.mode));for(const {key,input,output,unit} of rows){input.value=settings[key];output.value=settings[key]+unit;}}
 const events=['portfolio-theme','portfolio-material','portfolio-glass-settings'];events.forEach(e=>document.addEventListener(e,sync));sync();
 return ()=>events.forEach(e=>document.removeEventListener(e,sync));
}
