import {createWindow} from './windows.js';
export function openPaper(paper){
 const content=document.createElement('div');content.className='paper-reader';
 const toolbar=document.createElement('div');toolbar.className='paper-reader-toolbar';
 const label=document.createElement('span');label.textContent=paper.venue+' · '+paper.pages+' pages';
 const original=document.createElement('a');original.href=paper.pdf;original.target='_blank';original.rel='noopener';original.textContent='独立打开 / Open PDF ↗';
 const download=document.createElement('a');download.href=paper.pdf;download.download=paper.id+'.pdf';download.textContent='下载 / Download ↓';toolbar.append(label,original,download);
 const frame=document.createElement('iframe');frame.className='paper-reader-frame';frame.title=paper.title+' — PDF';frame.src=paper.pdf+'#view=FitH&toolbar=1&navpanes=0';
 content.append(toolbar,frame);
 return createWindow({id:'paper-'+paper.id,title:paper.title,content,width:Math.min(820,Math.max(480,(innerHeight-200)*0.773+32)),height:innerHeight-130,className:'paper-reader-window'});
}
