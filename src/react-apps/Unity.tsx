import React,{useContext,useEffect,useRef,useState} from 'react';
import {APIContext,useText} from './shared';
export function Unity({gallery=false}:{gallery?:boolean}={}){const api=useContext(APIContext),t=useText(),host=useRef<HTMLDivElement>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);useEffect(()=>{let live=true,dispose:(()=>void)|undefined;setError(false);(gallery?api.mountGallery:api.mountMuseum)(host.current!).then(fn=>{if(live)dispose=fn;else fn()}).catch(()=>{if(live)setError(true)});return()=>{live=false;dispose?.()}},[api,retry,gallery]);return <div className="museum-host" ref={host}>{error?<div className="os-empty"><p>{t('This app could not be loaded.')}</p><button onClick={()=>setRetry(n=>n+1)}>{t('Retry')}</button></div>:null}</div>}

export function UnrealEngine(){return <Unity gallery/>}
