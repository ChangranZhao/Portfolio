import React,{useContext,useEffect,useRef} from 'react';
import {APIContext} from './shared';
export function TouchDesigner(){const api=useContext(APIContext),host=useRef<HTMLDivElement>(null);useEffect(()=>{let live=true,dispose:(()=>void)|undefined;const url='./touchdesigner.js';import(url).then(m=>{if(live)dispose=m.mountTD(host.current,api)}).catch(()=>{if(host.current)host.current.textContent='Unable to load workspace / 工作台加载失败'});return()=>{live=false;dispose?.()}},[api]);return <div className="td-host" ref={host}/>}
