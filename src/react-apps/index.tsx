import {TouchDesigner} from './TouchDesigner';
import React,{Component,useLayoutEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {APIContext} from './shared';
import {PersonalSettings} from './PersonalSettings';
import {Photos,Projects} from './Library';
import {Figma} from './Figma';
import {Code} from './Code';
import {Studio} from './Studio';
import {Finder} from './Finder';
import {Music} from './Music';
import {Terminal} from './Terminal';
import {Chat} from './Chat';
import {Cursor} from './Cursor';
import {Unity,UnrealEngine} from './Unity';
import {Safari} from './Safari';
import {GitHub} from './GitHub';
import {AppStore,Launchpad} from './AppStore';
import type {AppAPI,AppOptions} from './types';
export {appWindowId} from './model.mjs';
export {mountLiquidGlass} from './LiquidGlass';
class AppBoundary extends Component<{children:React.ReactNode},{failed:boolean}>{state={failed:false};static getDerivedStateFromError(){return {failed:true}}render(){return this.state.failed?<div className="os-empty" role="alert"><h2>Unable to display this app / 暂时无法显示此应用</h2><button className="os-button" onClick={()=>this.setState({failed:false})}>Retry / 重试</button></div>:this.props.children;}}
function Ready({ready,children}:{ready?:()=>void;children:React.ReactNode}){useLayoutEffect(()=>{ready?.()},[ready]);return children;}
export function mountApplication(host:HTMLElement,api:AppAPI,name:string,options:AppOptions,navigate:(app:string)=>void,ready?:()=>void){
 host.setAttribute('data-no-localize','');host.className='os-app';
 const root=createRoot(host);let current=options,disposed=false,request=0;
 const systemApps:Record<string,React.ComponentType>={TouchDesigner,Finder,Music,Safari,GitHub,AppStore,Launchpad,Terminal,ChatGPT:Chat,Cursor,Unity,UnrealEngine};
 const render=()=>{if(disposed)return;const SystemApp=systemApps[name];const content=SystemApp?<SystemApp/>:(name==='About'||name==='Settings')?<PersonalSettings request={request} initial={current.section||(name==='About'?'overview':'appearance')} navigate={navigate}/>:name==='Projects'?<Projects request={request} search={current.search}/>:name==='Photos'?<Photos/>:name==='Figma'?<Figma/>:name==='Cursor'||name==='VSCode'?<Code name={name}/>:<Studio name={name}/>;root.render(<AppBoundary><APIContext.Provider value={api}><Ready ready={ready}>{content}</Ready></APIContext.Provider></AppBoundary>);};
 render();return {update(next:AppOptions){current={...current,...next};request++;render()},unmount(){if(!disposed){disposed=true;root.unmount()}}};
}
