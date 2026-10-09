export const spaceChapters = [
 ['Overview','space-page-1'],['Inspiration','space-page-2'],
 ['Speculative World','space-page-3'],['Script Design','space-page-4'],
 ['Interaction','space-page-5'],['Development','space-page-6'],
 ['Exhibition','space-page-7'],['Reflection','space-page-8']
];
export function createSpaceChronicles(article){
 const source=new URL('space-chronicles.html',import.meta.url);
 for(const [index,[label,id]] of spaceChapters.entries()){
  const section=document.createElement('section');
  section.id=id;
  section.style.cssText='width:100%;aspect-ratio:16/9;position:relative;background:#08090a';
  section.setAttribute('aria-label',label);
  const frame=document.createElement('iframe');
  frame.title='Space Chronicles — '+label;
  frame.src=source.href+'?page='+(index+1);
  frame.loading=index===0?'eager':'lazy';
  frame.addEventListener('load',()=>{
   const lang=document.documentElement.lang;
   frame.contentWindow?.postMessage({type:'portfolio-preferences',lang:lang==='zh-CN'?'zh':lang},location.origin);
  });
  frame.style.cssText='display:block;width:100%;height:100%;border:0;position:absolute;inset:0';
  section.append(frame);article.append(section);
 }
}
