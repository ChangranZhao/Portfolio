// Safari history and installed-project behavior adapted from ThanasOS (MIT).
export const START_PAGE='creativeos://favorites';
export function browserAddress(raw){
 const value=raw.trim();if(!value||value===START_PAGE||value==='favorites')return START_PAGE;
 if(/^creativeos:\/\/project\/p\d+$/.test(value))return value;
 if(/^[a-z][a-z\d+.-]*:/i.test(value)&&!/^https?:\/\//i.test(value))return null;
 if(/^https?:\/\//i.test(value)||/^[\w-]+(\.[\w-]+)+(\/.*)?$/.test(value)){
  try{const url=new URL(/^https?:\/\//i.test(value)?value:'https://'+value);if(!['http:','https:'].includes(url.protocol)||url.username||url.password)return null;return url.href;}catch{return null;}
 }
 return 'https://duckduckgo.com/?q='+encodeURIComponent(value);
}
export function newBrowserTab(id,url=START_PAGE){return {id,url,history:[url],index:0};}
export function visitTab(tab,url){const history=[...tab.history.slice(0,tab.index+1),url];return {...tab,url,history,index:history.length-1};}
export function stepTab(tab,delta){const index=Math.max(0,Math.min(tab.history.length-1,tab.index+delta));return {...tab,index,url:tab.history[index]};}
export function installedProjects(raw,ids){try{const value=JSON.parse(raw||'[]');return Array.isArray(value)?[...new Set(value.filter(id=>ids.includes(id)))]:[];}catch{return [];}}
