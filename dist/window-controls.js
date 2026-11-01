// One control treatment for application windows and desktop title cards.
const paths={close:'M3 3l6 6M9 3L3 9',minimize:'M2 6h8',maximize:'M3 2h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z'};
export function decorateWindowControls(root){
 for(const button of root.querySelectorAll('.traffic-lights .light')){
  const type=Object.keys(paths).find(key=>button.classList.contains(key));if(!type)continue;
  const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 12 12');svg.setAttribute('aria-hidden','true');
  const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',paths[type]);path.setAttribute('fill','none');path.setAttribute('stroke','currentColor');path.setAttribute('stroke-width','1.6');path.setAttribute('stroke-linecap','round');path.setAttribute('stroke-linejoin','round');svg.append(path);button.replaceChildren(svg);
 }
}
