/** @param {import('./types').Project[]} projects */
export function filterProjects(projects,query='',localize=text=>text){const q=query.trim().toLocaleLowerCase();return projects.filter(p=>[p.title,p.category,p.summary||'',localize(p.title),localize(p.category)].join(' ').toLocaleLowerCase().includes(q));}
export const photoKey=(projectId,index)=>`${projectId}:${index}`;
export function readFavorites(raw){try{const data=JSON.parse(raw||'[]');return Array.isArray(data)?[...new Set(data.filter(v=>typeof v==='string'&&/^p\d+:\d+$/.test(v)))]:[];}catch{return [];}}
export function toggleFavorite(values,key){return values.includes(key)?values.filter(v=>v!==key):[...values,key];}
export function appWindowId(name){return ({Settings:'settings',About:'settings',Terminal:'terminal',Projects:'projects',Photos:'photos',VSCode:'vscode'})[name]||'tool-'+name;}
