import {traditional} from './chinese-traditional.js';
const text=(en,zh)=>document.documentElement.lang.startsWith('zh')?(/Hant|TW|HK/i.test(document.documentElement.lang)?[...zh].map(c=>traditional[c]||c).join(''):zh):en;
export function materialControls(host){
 const label=document.createElement('div');label.className='material-setting';label.setAttribute('data-no-localize','');
 const heading=document.createElement('span');heading.textContent=text('Interface material','界面材质');label.append(heading);
 const choices=document.createElement('div');choices.className='material-choices';choices.setAttribute('role','group');choices.setAttribute('aria-label',heading.textContent);
 for(const [value,title] of [['classic',text('Classic','经典')],['liquid','Liquid Glass']]){const button=document.createElement('button');button.type='button';button.dataset.materialOption=value;button.textContent=title;button.setAttribute('aria-pressed',String((window.creativeOSMaterial?.mode||'classic')===value));button.onclick=()=>{window.creativeOSMaterial?.set(value);for(const b of document.querySelectorAll('[data-material-option]'))b.setAttribute('aria-pressed',String(b.dataset.materialOption===value));};choices.append(button);}
 label.append(choices);host.append(label);return label;
}
