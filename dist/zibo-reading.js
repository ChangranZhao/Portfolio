import {readingImages} from './zibo-reading-data.js';
export {readingImages};
export function optimizeZiboReading(root){
 for(const image of root.querySelectorAll('img,image')){
  const attribute=image.tagName.toLowerCase()==='img'?'src':'href',source=image.getAttribute(attribute),small=readingImages[source];
  if(!small)continue;
  image.dataset.readingOriginal=source;image.setAttribute(attribute,small);
 }
 root.classList.add('zibo-reading');
}
