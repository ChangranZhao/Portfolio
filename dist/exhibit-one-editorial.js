const root='assets/exhibit-01/';

export function createExhibitOneEditorial(wording,openAsset){
 const t=(zh,en)=>wording(zh,en);
 const section=document.createElement('section');
 section.className='ex-hi';
 section.innerHTML=`
  <header class="ex-hi-masthead"><span>WIND FROM THE EAST / QI CULTURE CLASSICS CENTER</span><span>${t('展项 01 · 空间体验与数字内容','EXHIBIT 01 · SPATIAL EXPERIENCE & DIGITAL CONTENT')}</span></header>
  <div class="ex-hi-upper">
   <section class="ex-hi-space">
    <div class="ex-hi-intro"><div><span class="ex-hi-kicker">01 / THE SPIRIT OF QI</span><h2>${t('因其俗，简其礼','Adapt customs, simplify rites')}</h2></div><p>${t('以一面弧形长屏组织空间体验；静态浮雕底图、局部触发与全屏动画，在观众靠近时形成递进的历史叙事。','A curved panoramic wall connects a relief base, proximity-triggered stories and full-screen motion into a progressive encounter with Qi history.')}</p></div>
    <div class="ex-hi-photo-grid">
     <button class="ex-hi-photo ex-hi-photo-main" data-asset="scene-built.webp" type="button"><img src="${root}scene-built.webp" alt="${t('因其俗展项的实景空间','Built curved-wall installation for the exhibit')}" loading="eager"><span>${t('现场实拍 / BUILT SPACE','BUILT SPACE / ON SITE')} ↗</span></button>
     <button class="ex-hi-photo ex-hi-photo-concept" data-asset="scene-concept.webp" type="button"><img src="${root}scene-concept.webp" alt="${t('弧形屏幕空间效果图','Curved-screen spatial proposal')}" loading="lazy"><span>${t('空间效果图 / PROPOSED SPACE','PROPOSED SPACE')} ↗</span></button>
     <button class="ex-hi-photo ex-hi-photo-action" data-asset="scene-interaction.webp" type="button"><img src="${root}scene-interaction.webp" alt="${t('观众触发数字画面的现场照片','Visitor triggering a digital projection on site')}" loading="lazy"><span>${t('现场交互 / ON-SITE INTERACTION','ON-SITE INTERACTION')} ↗</span></button>
    </div>
   </section>
   <section class="ex-hi-digital">
    <div class="ex-hi-section-head"><h3>${t('数字内容与交互','Digital content & interaction')}</h3><span>DIGITAL CONTENT / INTERACTION</span></div>
    <p class="ex-hi-lead">${t('以连续的浮雕画面作为静态底层。观众靠近后，局部人物与故事被唤起，最终扩展为覆盖长屏的影像。','A continuous relief forms the static base. Proximity reveals local characters and stories before the imagery expands across the panoramic wall.')}</p>
    <div class="ex-hi-image-source">
     <button class="ex-hi-digital-image ex-hi-source-base" data-asset="media-base.webp" type="button"><img src="${root}media-base.webp" alt="${t('7680像素原始浮雕底图','Panoramic relief base image')}" loading="lazy"><span>01 / ${t('底图','BASE')}</span></button>
     <button class="ex-hi-digital-image ex-hi-source-trigger" data-asset="media-trigger.webp" type="button"><img src="${root}media-trigger.webp" alt="${t('局部触发数字画面','Local interaction frame')}" loading="lazy"><span>02 / ${t('局部触发','LOCAL TRIGGER')}</span></button>
     <button class="ex-hi-digital-image ex-hi-source-full" data-asset="media-full.webp" type="button"><img src="${root}media-full.webp" alt="${t('全屏响应数字画面','Full-screen response frame')}" loading="lazy"><span>03 / ${t('全屏响应','FULL SCREEN')}</span></button>
    </div>
    <p class="ex-hi-small-label">IMAGE SOURCE → UNITY / SHADER</p>
    <div class="ex-hi-process-grid">
     <button data-asset="process-code.webp" type="button"><img src="${root}process-code.webp" alt="${t('交互触发代码截图','Interaction trigger code screenshot')}" loading="lazy"><span>${t('交互脚本','INTERACTION SCRIPT')}</span></button>
     <button data-asset="process-shader.webp" type="button"><img src="${root}process-shader.webp" alt="${t('图层Shader代码截图','Layer shader screenshot')}" loading="lazy"><span>SHADER</span></button>
     <button data-asset="process-unity.webp" type="button"><img src="${root}process-unity.webp" alt="${t('Unity场景与画面截图','Unity scene and output screenshot')}" loading="lazy"><span>UNITY SCENE</span></button>
     <button data-asset="process-layers.webp" type="button"><img src="${root}process-layers.webp" alt="${t('触发图层文件截图','Trigger layer files screenshot')}" loading="lazy"><span>${t('触发图层','TRIGGER LAYERS')}</span></button>
    </div>
   </section>
  </div>
  <div class="ex-hi-lower">
   <aside class="ex-hi-story"><span class="ex-hi-kicker">01 / FIRST UNIT · THE SPIRIT OF QI</span><h2>${t('因其俗，\n简其礼','Adapt customs,\nsimplify rites')}</h2><p>${t('从《史记·鲁周公世家》中的选择出发：保留当地习俗、简化礼制，让观众在靠近与触发中进入故事。','The story begins with a choice recorded in the Records of the Grand Historian: adapt to local customs and simplify rites. Visitors enter through proximity and response.')}</p><button class="ex-hi-story-photo" data-asset="scene-concept.webp" type="button"><img src="${root}scene-concept.webp" alt="${t('因其俗展项空间设计效果','Exhibit spatial design proposal')}" loading="lazy"><span>${t('空间与内容的关系','SPACE × CONTENT')} ↗</span></button></aside>
   <section class="ex-hi-breakdown"><div class="ex-hi-section-head"><h3>${t('空间分解与体验结构','Spatial breakdown & experience')}</h3><span>SPATIAL BREAKDOWN / EXPERIENCE</span></div><p class="ex-hi-lead">${t('以弧形屏幕为核心，将三种画面状态与观众的接近动作分层呈现。','The curved screen becomes a stage for three image states, activated as visitors approach.')}</p>
    <div class="ex-hi-layer-stage" role="group" aria-label="${t('弧形投影屏幕的底图、局部触发与全屏响应三层空间分解图','Exploded view of the curved wall with base, local trigger and full-screen layers')}">
     <button class="ex-hi-layer-image" data-asset="spatial-breakdown-generated.png" type="button"><img src="${root}spatial-breakdown-generated.png" alt="${t('三层弧形屏幕、金色浮雕、蓝金色全屏画面与现场观众的高清空间拆解图','High-resolution exploded spatial view of three curved screens, golden relief, blue-and-gold full-screen image and visitors')}" loading="lazy"></button>
     <div class="ex-hi-callout ex-hi-callout-full"><i></i><span>03 / ${t('全屏响应','FULL SCREEN')}</span></div>
     <div class="ex-hi-callout ex-hi-callout-local"><i></i><span>02 / ${t('局部触发','LOCAL TRIGGER')}</span></div>
     <div class="ex-hi-callout ex-hi-callout-base"><i></i><span>01 / ${t('浮雕底图','RELIEF BASE')}</span></div>
    </div>
    <div class="ex-hi-layer-strip"><button data-asset="media-base.webp" type="button"><img src="${root}media-base.webp" alt="${t('静态浮雕底图','Static relief base')}" loading="lazy"><span>01 / ${t('底图','BASE')}</span></button><button data-asset="media-trigger.webp" type="button"><img src="${root}media-trigger.webp" alt="${t('局部响应画面','Local response')}" loading="lazy"><span>02 / ${t('局部触发','LOCAL')}</span></button><button data-asset="media-full.webp" type="button"><img src="${root}media-full.webp" alt="${t('全屏叙事画面','Full-screen narrative')}" loading="lazy"><span>03 / ${t('全屏响应','FULL SCREEN')}</span></button></div>
   </section>
   <aside class="ex-hi-tech"><div class="ex-hi-section-head"><h3>${t('空间投影与感知规划','Projection & sensing plan')}</h3><span>4-CHANNEL PROJECTION / INFRARED SENSING</span></div><p>${t('四路投影覆盖弧形长屏；上方红外感应获取观众位置，Unity 与 Shader 控制局部故事图层的响应。','Four projection channels cover the curved wall. An overhead infrared sensor detects visitors; Unity and a shader control the local story layers.')}</p>
    <svg class="ex-hi-projection" viewBox="0 0 420 330" role="img" aria-label="${t('四台投影机与屏幕上方红外传感器的空间示意图','Diagram of four projectors and overhead infrared sensor')}">
     <defs><linearGradient id="ex-hi-wall-fill" x1="0" x2="0" y1="0" y2="1"><stop stop-color="#bc9160" stop-opacity=".8"/><stop offset="1" stop-color="#6e533a" stop-opacity=".5"/></linearGradient></defs>
     <path d="M34 112 Q210 30 386 112 L386 195 Q210 120 34 195 Z" fill="url(#ex-hi-wall-fill)" stroke="#d1b185" stroke-width="2"/>
     <path d="M34 112 Q210 30 386 112" fill="none" stroke="#f7dfb4" stroke-width="2"/>
     <path d="M120 78 L120 161 M210 57 L210 143 M300 78 L300 161" stroke="#d6c6af" stroke-width="1" stroke-dasharray="4 5"/>
     <g fill="#d5c0a0" font-size="12" text-anchor="middle"><text x="72" y="149">Z1</text><text x="163" y="121">Z2</text><text x="257" y="121">Z3</text><text x="348" y="149">Z4</text></g>
     <g fill="none" stroke="#b5aaa0" stroke-width="1" stroke-dasharray="4 5"><path d="M65 275 L77 163 L166 134 Z"/><path d="M155 275 L128 139 L252 134 Z"/><path d="M265 275 L167 134 L292 139 Z"/><path d="M355 275 L255 134 L342 163 Z"/><path d="M210 31 L146 171 M210 31 L274 171"/></g>
     <g fill="#0f0f0f" stroke="#eee" stroke-width="2"><rect x="51" y="266" width="28" height="17" rx="2"/><rect x="141" y="266" width="28" height="17" rx="2"/><rect x="251" y="266" width="28" height="17" rx="2"/><rect x="341" y="266" width="28" height="17" rx="2"/><rect x="198" y="17" width="24" height="13" rx="2"/></g>
     <g fill="#eee" font-size="11" text-anchor="middle"><text x="65" y="303">P1</text><text x="155" y="303">P2</text><text x="265" y="303">P3</text><text x="355" y="303">P4</text><text x="210" y="12">IR / LiDAR</text></g>
    </svg>
    <ol class="ex-hi-tech-steps"><li><b>01</b><span>${t('红外感知观众位置','Infrared detects visitor position')}</span></li><li><b>02</b><span>${t('Unity 读取触发区域','Unity reads the trigger zone')}</span></li><li><b>03</b><span>${t('Shader 显现对应故事图层','Shader reveals the story layer')}</span></li></ol>
    <div class="ex-hi-tech-files"><button data-asset="process-code.webp" type="button"><img src="${root}process-code.webp" alt="${t('交互脚本截图','Interaction script screenshot')}" loading="lazy"><span>${t('交互脚本','SCRIPT')}</span></button><button data-asset="process-shader.webp" type="button"><img src="${root}process-shader.webp" alt="${t('Shader截图','Shader screenshot')}" loading="lazy"><span>SHADER</span></button></div>
    <small>${t('投影示意仅表达设备与感应关系，并非施工尺寸图。','Planning schematic, not a measured installation drawing.')}</small>
   </aside>
  </div>`;
 for(const button of section.querySelectorAll('[data-asset]')){
  const image=button.querySelector('img');
  button.setAttribute('aria-label',t('放大查看：','Enlarge: ')+image.alt);
  button.onclick=()=>openAsset(root+button.dataset.asset,image.alt);
 }
 return section;
}
