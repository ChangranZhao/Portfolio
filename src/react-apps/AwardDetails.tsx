import React,{useContext,useEffect,useState} from 'react';
import {APIContext,Icon,useLanguage,useText} from './shared';
import type {AwardDetail,ProfileRecord} from './types';

export function AwardDetails({record,onBack}:{record:ProfileRecord;onBack:()=>void}){
 const api=useContext(APIContext),t=useText(),zh=useLanguage().startsWith('zh');
 const [detail,setDetail]=useState<AwardDetail|null>(null),[error,setError]=useState(false),[retry,setRetry]=useState(0);
 const label=(v:{en:string;zh:string})=>zh?api.localize(v.zh):v.en;
 useEffect(()=>{let active=true;setDetail(null);setError(false);api.loadAwardDetails().then(records=>{if(active){if(records[record.id])setDetail(records[record.id]);else setError(true)}}).catch(()=>{if(active)setError(true)});return()=>{active=false};},[record.id,retry,api]);
 const project=api.projects.find(p=>p.id===record.projectId),identity=detail?.identity;
 return <div className="award-detail">
  <button className="award-back" onClick={onBack}><span aria-hidden="true">‹</span>{t('Back to awards')}</button>
  <header className="award-detail-header">
   {identity&&<div className="award-brand" style={{background:identity.background}}><div className="award-brand-crop" style={{aspectRatio:identity.aspect,width:Math.min(180,76*identity.aspect)}}><img src={identity.src} alt={identity.kind==='logo'?label(record.title):t('Certificate identity')} style={{width:`${100/identity.w}%`,left:`${-identity.x/identity.w*100}%`,top:`${-identity.y/identity.h*100}%`}}/></div>{identity.kind==='heading'&&<small>{t('Certificate identity')}</small>}</div>}
   <div><h1>{label(record.title)}</h1><p className="award-detail-result">{label(record.result)}</p><div className="award-detail-date">{record.date||t('Date not recorded')}</div></div>
  </header>
  {error?<div role="alert"><p>{t('This app could not be loaded.')}</p><button className="os-button" onClick={()=>setRetry(v=>v+1)}>{t('Retry')}</button></div>:!detail?<p role="status">{t('Loading…')}</p>:<>
   <section className="award-detail-section"><h2>{t('About the award')}</h2><p>{label(detail.about)}</p>{detail.issuer&&<p className="award-issuer"><span>{t('Awarding body')}</span>{zh?api.localize(detail.issuerZh||detail.issuer):detail.issuer}</p>}{detail.officialUrl&&<a className="award-source" href={detail.officialUrl} target="_blank" rel="noopener noreferrer">{t('Official award website')} ↗</a>}</section>
   <section className="award-detail-section"><h2>{t('Recognized project')}</h2><h3>{label(record.work)}</h3>{project&&<button className="award-project-image" onClick={()=>api.openDetails(project.id)} aria-label={t('Open project')+' · '+label(record.work)}><img src={project.images[0].preview||project.images[0].thumb} alt={label(record.work)} loading="lazy" decoding="async"/></button>}<p>{label(detail.description)}</p>{project&&<button className="os-primary" onClick={()=>api.openDetails(project.id)}>{t('Full Project')} ↗</button>}</section>
   <section className="award-detail-section"><h2>{record.id==='aaia'?t('Result announcement'):t('Award certificate')}</h2>{record.note&&<p className="sys-caption">{label(record.note)}</p>}<button className="award-certificate" onClick={()=>api.openImage([{src:detail.certificate.src,path:detail.certificate.src,thumb:detail.certificate.src,name:label(record.title),width:detail.certificate.width,height:detail.certificate.height}],0,label(record.title))} aria-label={t('Enlarge certificate')}><img src={detail.certificate.src} alt={label(record.title)+' · '+label(record.result)} loading="lazy" decoding="async"/><span>{t('Enlarge certificate')} <Icon name="arrow" size={14}/></span></button></section>
  </>}
 </div>;
}
