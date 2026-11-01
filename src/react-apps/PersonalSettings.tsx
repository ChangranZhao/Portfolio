import React,{useContext,useEffect,useState} from 'react';
import {APIContext,Sidebar,SideButton,Toolbar,Search,useText} from './shared';
import {useSystemText} from './system-shared';
import {ProfileContent} from './About';
import {SettingsContent} from './Settings';

export function PersonalSettings({initial='overview',request=0,navigate}:{initial?:string;request?:number;navigate:(app:string)=>void}){
 const api=useContext(APIContext),t=useText(),s=useSystemText();
 const profile=[['overview','person',t('Overview'),'#3889e8'],['experience','briefcase',t('Education & Experience'),'#de8b2c'],['awards','award',t('Awards'),'#d4a137'],['commercial','folder',t('Commercial Projects'),'#398cce'],['research','book',t('Exhibitions & Papers'),'#8e66ce'],['toolkit','sliders',t('Creative Toolkit'),'#33a690']];
 const preferences=[['appearance','appearance',s('Appearance','外观'),'#424247'],['desktop','desktop',s('Desktop & Dock','桌面与程序坞'),'#8e8e93'],['sound','sound',s('Sound','声音'),'#ff375f'],['language','globe',s('Language & Region','语言与地区'),'#007aff'],['general','gear',s('General','通用'),'#8e8e93']];
 const all=[...profile,...preferences],valid=(id:string)=>all.some(item=>item[0]===id)?id:'overview';
 const [section,setSection]=useState(()=>valid(initial)),[query,setQuery]=useState('');
 useEffect(()=>{setSection(valid(initial));setQuery('');},[initial,request]);
 const selected=all.find(item=>item[0]===section)!,q=query.trim().toLocaleLowerCase();
 const matches=(items:string[][])=>items.filter(item=>item[2].toLocaleLowerCase().includes(q));
 const choose=(id:string)=>{setSection(id);setQuery('');};
 const group=(label:string,items:string[][])=>{const visible=matches(items);return visible.length?<section className="personal-nav-group" aria-label={label}><div className="os-side-heading">{label}</div>{visible.map(([id,icon,label,color])=><div className="personal-nav-item" style={{'--settings-icon':color} as React.CSSProperties} key={id}><SideButton icon={icon} label={label} active={section===id} onClick={()=>choose(id)}/></div>)}</section>:null;};
 return <><Sidebar footer="Creative OS · Changran Zhao"><div className="personal-sidebar">
 <Search value={query} onChange={setQuery} label={s('Search profile & settings','搜索个人介绍与设置')}/>
 <button className={'os-account'+(section==='overview'?' selected':'')} aria-pressed={section==='overview'} onClick={()=>choose('overview')}><span className="os-avatar small"><img src={api.logo} alt=""/></span><span><strong>Changran Zhao</strong><small>{t('About Me')}</small></span></button>
 {group(s('Portfolio','个人与作品'),profile.slice(1))}{group(s('System preferences','系统偏好'),preferences)}
 {q&&!matches(all.slice(1)).length&&<p className="personal-search-empty">{t('No results')}</p>}
 </div></Sidebar><main className="os-main"><Toolbar title={selected[2]}><select className="personal-section-picker" aria-label={s('Section','栏目')} value={section} onChange={e=>choose(e.target.value)}>{all.map(([id,,label])=><option key={id} value={id}>{label}</option>)}</select></Toolbar>{profile.some(item=>item[0]===section)?<ProfileContent section={section} setSection={choose} navigate={navigate}/>:<SettingsContent key={section} section={section}/>}</main></>;
}
