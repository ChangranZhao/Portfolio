import {overviewExhibits} from './exhibit-overview-assets.js';
import {registerTranslations} from './localization.js';
registerTranslations([
 ['MORE EXHIBITS / ONE CULTURAL JOURNEY','更多展项 / 同一段文化旅程'],
 ['Beyond the four featured stories','四个重点展项之外'],
 ['20 EXHIBITS · ON-SITE PHOTOGRAPHS','20 个展项 · 现场影像'],
 ['QI CULTURE CLASSICS CENTER / EXHIBIT ATLAS','齐文化典籍中心 / 展项图集'],
 ...overviewExhibits.map(e=>[e.en,e.zh])
]);
export function createExhibitOverview(){
 const section=document.createElement('section');section.className='exhibit-overview';section.setAttribute('aria-label','More exhibits');
 section.innerHTML=`<div class="overview-board"><header class="overview-header"><div><span>MORE EXHIBITS / ONE CULTURAL JOURNEY</span><h3>Beyond the four featured stories</h3></div><p>20 EXHIBITS · ON-SITE PHOTOGRAPHS</p></header><div class="overview-grid">${overviewExhibits.map(e=>`<figure class="overview-tile" data-overview-exhibit="${e.number}"><div class="overview-images">${e.images.map(i=>`<img src="${i.src}" width="${i.width}" height="${i.height}" alt="${e.en}" loading="lazy" decoding="async">`).join('')}</div><figcaption><span>${e.number}</span><strong>${e.en}</strong></figcaption></figure>`).join('')}</div><footer class="overview-footer"><span>QI CULTURE CLASSICS CENTER / EXHIBIT ATLAS</span><span>07 / DETAILS</span></footer></div>`;
 return section;
}
