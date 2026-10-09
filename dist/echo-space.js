import {registerTranslations} from './localization.js';
import {createEchoProcessBoard} from './echo-process-board.js';

const pairs=[];
const copy=(en,zh)=>{pairs.push([en,zh]);return en;};
export const echoChapters=[
 ['01 / Echo Space','case-overview'],
 [copy('02 / Listening','02 / 聆听'),'echo-listening'],
 [copy('03 / Space','03 / 空间'),'echo-space'],
 [copy('04 / Visual language','04 / 视觉语言'),'echo-visual'],
 [copy('05 / Making','05 / 制作'),'echo-making'],
 [copy('06 / Live','06 / 现场'),'echo-live'],
 [copy('07 / Next','07 / 下一步'),'echo-next']
];
const content={
 eyebrow:copy('PROJECT 04 — AUDIOVISUAL PERFORMANCE','项目 04 — 视听现场'),
 subtitle:copy('A space to see sound.','一个看见声音的空间。'),
 intro:copy('Live music, moving images and translucent screens come together in a shared space. Echo Space explores how a performance can be heard, seen and felt.','现场音乐、动态影像与半透明纱幕汇聚在同一个空间。Echo Space 探索一场演出如何被聆听、观看与感受。'),
 discipline:copy('Spatial design / Moving image / Live performance','空间设计 / 动态影像 / 现场演出'),
 explore:copy('Enter the experience ↓','进入现场 ↓'),
 listening:copy('An invitation\nto listen differently.','以另一种方式，\n走近音乐。'),
 listeningLead:copy('What if a concert could open another way into music?','如果一场音乐会，能为感受音乐打开另一扇门？'),
 listeningBody:copy('The project begins with a wish to make classical music more approachable through new media. Images offer an additional point of connection: a sense of atmosphere, a change of pace, a space shared with the performers.','项目源于一个愿望：通过新媒体，让更多人愿意走近古典音乐。影像提供了另一种连接方式——一种氛围、一次节奏变化，以及一个与演奏者共享的空间。'),
 question:copy('How can rhythm, emotion and musical layers become a spatial experience?','如何让节奏、情绪与音乐层次，成为一种空间体验？'),
 space:copy('A translucent\nspace for sound.','让声音拥有\n半透明的空间。'),
 spaceBody:copy('Four gauze screens form the central enclosure. Projections sit across their surfaces while instruments and performers remain visible through the fabric. In the documented performance, imagery also extends onto the surrounding walls.','四面纱幕围合成中央舞台。投影落在纱幕表面，观众仍能透过织物看见乐器与演奏者。在现场记录中，影像也延伸至周围墙面。'),
 conceptNote:copy('Spatial concept · A relationship diagram, not a measured layout','空间概念 · 关系示意，非实测布局'),
 gauze:copy('TRANSLUCENT SCREENS','半透明纱幕'),
 performer:copy('LIVE MUSICIANS','现场演奏者'),
 projection:copy('PROJECTED IMAGE','投影影像'),
 audience:copy('AUDIENCE','观众'),
 visual:copy('One stage.\nMany visual worlds.','同一个舞台，\n不同的视觉世界。'),
 visualBody:copy('The project introduces a collection of visual scenes for different musical moods. These three selections reveal its range: flowing colour, luminous lines and imagined environments.','项目为不同音乐情绪构建了一组视觉场景。这里选取三种具有代表性的表达：流动色彩、发光线条与想象中的环境。'),
 select:copy('SELECT A VISUAL STUDY','选择视觉场景'),
 making:copy('From a musical idea\nto a live environment.','从音乐意象，\n到现场环境。'),
 makingBody:copy('The project proposal connects music research, visual production and on-site staging. Visual sequences become a scene library, with live cueing allowing the imagery to follow the unfolding performance.','项目方案将音乐研究、视觉制作与现场搭建连接起来。视觉片段组成场景库，通过现场切换与编排，让影像跟随演出的展开。'),
 makingNote:copy('Production approach described in the project proposal. Specific tools and control mappings depend on the performance setup.','以上为项目方案中的制作思路；具体工具与控制映射取决于演出配置。'),
 live:copy('Inside\nthe performance.','走进\n演出现场。'),
 liveBody:copy('Light meets fabric, bodies and architecture. The photographs move between the whole room and the intimacy of a musician within the projected image.','光线与织物、身体和建筑相遇。这组照片在整个场地与演奏者的近景之间切换，呈现影像如何进入现场。'),
 next:copy('Where does\nthe echo go next?','回响，\n还将去向哪里？'),
 nextBody:copy('The next stage is to investigate how the experience is received. These are directions for further development, rather than measured audience outcomes.','下一步是探索观众如何感受这一体验。以下是后续发展的方向，而非已经测得的观众反馈。'),
 end:copy('Music becomes a place.','让音乐，成为一个空间。'),
 top:copy('Back to the beginning ↑','回到开篇 ↑'),
 source:copy('Original project concept ↗','原始项目介绍 ↗'),
 imageHint:copy('VIEW PHOTOGRAPH ↗','放大查看 ↗')
};
const coverCopy={
 focus:copy('Project Focus','项目重点'),
 meta:copy('#Project 04   #Live Performance','#项目 04   #现场表演'),
 subtitle:copy('Immersive Audiovisual Performance\nMusic, Moving Image & Spatial Design','沉浸式视听演出\n音乐、动态影像与空间设计'),
 introduction:copy('Echo Space brings live music into a three-dimensional environment of projections and translucent gauze. Musicians remain visible within the moving images, while colour, light and visual narratives unfold across the screens and the surrounding room.','Echo Space 通过投影与半透明纱幕，将现场音乐带入一个立体环境。演奏者显现在动态影像之中，色彩、光线与视觉叙事在纱幕及周围空间中展开。'),
 paragraph:copy('The project explores how new media can offer another way into classical music. A collection of visual scenes is composed for the performance, connecting musical atmosphere with the spatial experience of the audience.','项目探索新媒体如何为感受古典音乐提供另一种入口。不同视觉场景围绕演出展开，将音乐氛围与观众的空间体验连接起来。'),
 musician:copy('Music & Moving Image','音乐与动态影像'),
 gauze:copy('Translucent Performance Space','半透明演出空间'),
 live:copy('An Expanded Visual Field','延展的视觉场域'),
 makingTitle:copy('How we do · 05 / Making','制作过程 · 05 / 制作'),
 plan:copy('We have two implementation plans. The first involves creating a three-dimensional space enclosed by four sheer curtains. The second is to design a unique narrative space tailored to the characteristics of the local venue.','我们提出两种实施方案：一是利用四面纱幕围合三维空间；二是结合场地特征，设计独特的叙事空间。'),
 processIntro:copy('We have divided the stage preparation into three parts:','舞台准备分为三个部分：'),
 process1:copy('Conduct background research on the venue and music selection to select appropriate elements for creation, ensuring a cohesive theme between music and visuals.','围绕场地与曲目开展背景研究，选取适合的创作元素，让音乐与视觉保持主题上的连贯。'),
 process2:copy('Produce pre-visual effects using software like TouchDesigner, Blender, Unity, and Unreal to create diverse visual content for the concert.','通过 TouchDesigner、Blender、Unity、Unreal 等软件制作视觉预演，为演出创作多样化的影像内容。'),
 process3:copy('Choose a pre-packaged toolkit for on-site construction, either quadripartite continuous or random arrangement, to create a suitable spatial narrative for the performance venue.','利用模块化工具进行现场搭建，选择四面连续围合或自由组合的方式，为演出场地构建适合的空间叙事。')
};
for(const pair of [['Background Research','背景研究'],['On-site construction','现场搭建'],['Real-time Interaction','实时交互'],['Real-time Performance','现场演出'],['Using TD’s Music panel','使用 TD 音乐面板'],['Using Sensors','使用传感器'],['Video Generation','影像生成'],['We use the curtain as a medium for the production of live installations','我们以纱幕作为现场装置的媒介'],['We use Touchdesigner & Unity & Unreal to generate our video source','我们使用 TouchDesigner、Unity 与 Unreal 制作视觉素材'],['View process photograph','查看制作过程照片']])copy(...pair);
const principles=[
 [copy('01 / CONNECTION','01 / 连接'),copy('A sensory entry point','感官的入口'),copy('Use visual atmosphere to invite attention and curiosity.','以视觉氛围邀请观众靠近，激发注意与好奇。')],
 [copy('02 / COEXISTENCE','02 / 共存'),copy('Keep the performer present','让演奏者始终在场'),copy('Let the image and the live musician remain visible together.','让影像与现场演奏者同时被看见。')],
 [copy('03 / SPACE','03 / 空间'),copy('Extend beyond the screen','延伸至屏幕之外'),copy('Bring projected imagery into the surrounding environment.','让投影影像进入周围环境。')]
];
const scenes=[
 {name:copy('Chromatic flow','色彩流动'),file:'page_7.png',tag:copy('01 — COLOUR / LAYERS / MOTION','01 — 色彩 / 层次 / 运动'),title:copy('Colour as atmosphere.','以色彩构成氛围。'),body:copy('Broad fields of colour overlap on the gauze. The translucent surface lets the musicians appear within the image, bringing the performance and the visual field into one composition.','大面积色彩在纱幕上交叠。半透明表面让演奏者显现在影像之中，将表演与视觉场域纳入同一个画面。')},
 {name:copy('Luminous lines','发光线条'),file:'page_12.png',tag:copy('02 — LINE / REPETITION / DEPTH','02 — 线条 / 重复 / 纵深'),title:copy('Drawing through space.','在空间中绘出线条。'),body:copy('Repeated luminous curves wrap across the enclosure. Their intersections reveal the different surfaces, giving a flat graphic pattern a spatial presence.','重复的发光曲线环绕纱幕空间。线条的交叠显现出不同表面，让平面图形具有空间中的存在感。')},
 {name:copy('Imagined worlds','想象世界'),file:'page_3.png',tag:copy('03 — SCENE / ASSOCIATION / NARRATIVE','03 — 场景 / 联想 / 叙事'),title:copy('An image to enter.','进入影像中的场景。'),body:copy('Figurative imagery introduces another register: environments and unexpected characters. These scenes extend the visual vocabulary from abstract motion to associative storytelling.','具象影像引入了另一种表达：环境与意想不到的角色。这些场景将视觉语言从抽象运动延伸至联想式叙事。')}
];
const stages=[
 [copy('Listen & research','聆听与研究'),copy('Explore the music, its atmosphere and the conditions of the venue.','理解音乐及其氛围，并研究场地条件。')],
 [copy('Build a visual library','构建视觉素材库'),copy('Develop moving-image sequences through generative and digital media methods.','通过生成式与数字媒体方法，制作动态影像片段。')],
 [copy('Compose in space','在空间中编排'),copy('Arrange the gauze surfaces and adapt the projections to the site.','布置纱幕表面，让投影适应现场空间。')],
 [copy('Perform & cue','表演与现场控制'),copy('Select and transition between scenes in response to the live performance.','根据现场演出选择场景，并控制段落间的切换。')]
];
const questions=[
 [copy('ATTENTION','注意力'),copy('When should an image step back?','影像何时应该退后？'),copy('Explore how visual intensity can support the music while keeping the performer at the centre of attention.','探索视觉强度如何配合音乐，让演奏者保持在注意力中心。')],
 [copy('VIEWPOINT','观看角度'),copy('Does every seat share the experience?','每个座位的体验是否相同？'),copy('Compare sightlines, transparency and image legibility from different audience positions.','从不同观众位置比较视线、透明度与影像的可读性。')],
 [copy('UNDERSTANDING','理解'),copy('What remains after the performance?','演出之后，什么被记住？'),copy('Use future audience conversations and observation to explore what viewers notice, feel and remember.','通过后续观众交流与观察，了解人们注意到什么、感受到什么、又记住什么。')]
];
const captions={
 cover:copy('A musician within the projected image','投影影像中的演奏者'),
 detail:copy('The performer and the visual field','演奏者与视觉场域'),
 structure:copy('The gauze enclosure and instruments within','纱幕围合与内部乐器'),
 wide:copy('The stage extends into the surrounding room','舞台向周围空间延伸'),
 colour:copy('Colour across the screens and surrounding walls','色彩穿过纱幕，延伸至周围墙面'),
 lines:copy('A field of light around the musicians','环绕演奏者的光线场域')
};
registerTranslations(pairs);

const node=(tag,cls,text)=>{const e=document.createElement(tag);e.className=cls||'';if(text!==undefined)e.textContent=text;return e;};
export function createEchoSpace(project,{openImage,jump}){
 const root=node('div','echo-project');
 const find=file=>{const im=project.images.find(i=>i.path.endsWith('/'+file));if(!im)throw Error('Missing Echo Space image: '+file);return im;};
 const image=(file,alt,cls='',eager=false)=>{const im=find(file),e=node('img',cls);e.src=im.preview||im.src;e.alt=alt;e.width=im.width;e.height=im.height;e.loading=eager?'eager':'lazy';e.decoding='async';return e;};
 const photo=(file,alt,cls='')=>{const im=find(file),fig=node('figure','echo-photo '+cls),b=node('button','echo-photo-button');b.type='button';b.setAttribute('aria-label',alt+' ↗');b.onclick=()=>openImage([{...im,name:alt}],0,project.title);b.append(image(file,alt),node('span','echo-photo-hint',content.imageHint));fig.append(b,node('figcaption','',alt));return fig;};
 const section=(id,num,label,cls='')=>{const e=node('section','echo-section '+cls);e.id=id;e.append(node('div','echo-eyebrow',num+' / '+label));return e;};
 const heading=(s,title,body)=>{const h=node('header','echo-heading');h.append(node('h2','',title),node('p','echo-lead',body));s.append(h);};
 const hero=node('section','echo-section echo-cover');hero.id='case-overview';
 hero.append(image('page_7.png',captions.structure,'echo-cover-backdrop',true));
 const tiles=node('div','echo-cover-tiles');
 for(const [file,label] of [['Front_page.png',coverCopy.musician],['page_12.png',coverCopy.gauze],['page_9.png',coverCopy.live]]){
  const tile=node('button','echo-cover-tile');tile.type='button';tile.append(image(file,label),node('span','',label));tile.onclick=()=>openImage([{...find(file),name:label}],0,project.title);tiles.append(tile);
 }
 hero.append(tiles);
 const focus=node('aside','echo-cover-focus');focus.append(node('header','','● ● ●   '+coverCopy.focus),node('p','',content.discipline));hero.append(focus);
 const meta=node('div','echo-cover-meta');meta.append(node('span','',coverCopy.meta),node('span','','2024.3 – 2025.3'));hero.append(meta);
 const intro=node('div','echo-cover-intro'),titleColumn=node('div','echo-cover-title-column'),title=node('h1','echo-cover-title');title.setAttribute('data-no-localize','');title.textContent='ECHO\nSPACE';titleColumn.append(title,node('p','echo-cover-subtitle',coverCopy.subtitle));
 const textColumn=node('div','echo-cover-copy');textColumn.append(node('p','',coverCopy.introduction),node('p','',coverCopy.paragraph));intro.append(titleColumn,textColumn);hero.append(intro);root.append(hero);

 const listening=section('echo-listening','02',echoChapters[1][0].split(' / ')[1],'echo-paper');
 heading(listening,content.listening,content.listeningLead);
 const listeningGrid=node('div','echo-listening-grid');listeningGrid.append(photo('page_2.png',captions.detail));
 const listeningText=node('div','echo-listening-copy');listeningText.append(node('p','echo-body',content.listeningBody),node('blockquote','echo-question',content.question));listeningGrid.append(listeningText);listening.append(listeningGrid);
 const principleGrid=node('div','echo-principles');for(const [label,title,body] of principles){const item=node('div');item.append(node('span','echo-eyebrow',label),node('h3','',title),node('p','',body));principleGrid.append(item);}listening.append(principleGrid);root.append(listening);

 const space=section('echo-space','03',echoChapters[2][0].split(' / ')[1],'echo-dark');heading(space,content.space,content.spaceBody);
 const spaceGrid=node('div','echo-space-grid');spaceGrid.append(photo('page_1.png',captions.structure));
 const diagram=node('div','echo-diagram');
 diagram.innerHTML='<svg viewBox="0 0 460 360" aria-hidden="true"><defs><pattern id="echo-gauze" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0V7" stroke="currentColor" stroke-width=".4"/></pattern></defs><g fill="url(#echo-gauze)" stroke="currentColor" stroke-width="1"><path d="M90 100 230 44 370 100 230 164Z" fill="none" stroke-dasharray="4 5"/><path d="M90 100 230 164V290L90 226Z"/><path d="M230 164 370 100V226L230 290Z"/><path d="M90 100V226L230 170 370 226V100" fill="none" opacity=".3"/></g><g fill="#ee8e61"><circle cx="224" cy="173" r="8"/><path d="M212 199Q224 173 236 199Z"/></g><g stroke="#ee8e61" fill="none"><ellipse cx="227" cy="215" rx="44" ry="17" opacity=".6"/><ellipse cx="227" cy="215" rx="63" ry="25" opacity=".3"/><path d="M41 180 144 190M330 251 400 287" stroke-dasharray="3 5"/></g><g fill="currentColor" opacity=".5"><circle cx="152" cy="307" r="4"/><circle cx="172" cy="315" r="4"/><circle cx="193" cy="323" r="4"/><circle cx="258" cy="325" r="4"/><circle cx="279" cy="317" r="4"/><circle cx="300" cy="309" r="4"/></g></svg>';
 const legend=node('div','echo-diagram-legend');for(const [i,label] of [content.gauze,content.performer,content.projection,content.audience].entries())legend.append(node('span','',String(i+1).padStart(2,'0')+' / '+label));diagram.append(legend,node('p','echo-note',content.conceptNote));spaceGrid.append(diagram);space.append(spaceGrid);root.append(space);

 const visual=section('echo-visual','04',echoChapters[3][0].split(' / ')[1],'echo-dark echo-visual');heading(visual,content.visual,content.visualBody);
 const controls=node('div','echo-scene-controls');controls.setAttribute('role','group');controls.setAttribute('aria-label',content.select);
 const stage=node('div','echo-scene-stage'),display=node('button','echo-scene-display');display.type='button';const sceneCopy=node('div','echo-scene-copy');sceneCopy.setAttribute('aria-live','polite');
 const select=i=>{const s=scenes[i],im=find(s.file);for(const [j,b] of [...controls.children].entries())b.setAttribute('aria-pressed',String(i===j));display.replaceChildren(image(s.file,s.title,'echo-scene-image',true),node('span','echo-photo-hint',content.imageHint));display.setAttribute('aria-label',s.title+' ↗');display.onclick=()=>openImage([{...im,name:s.title}],0,project.title);sceneCopy.replaceChildren(node('span','echo-eyebrow',s.tag),node('h3','',s.title),node('p','',s.body));};
 scenes.forEach((s,i)=>{const b=node('button','echo-scene-choice',s.name);b.type='button';b.onclick=()=>select(i);controls.append(b)});
 stage.append(display,sceneCopy);select(0);visual.append(controls,stage);root.append(visual);

 const making=node('section','echo-section echo-making-figma');making.id='echo-making';making.append(createEchoProcessBoard(openImage));
 const mobileProcess=node('div','echo-process-mobile');mobileProcess.append(node('h3','',coverCopy.makingTitle),node('p','',coverCopy.plan),node('h4','',coverCopy.processIntro));const steps=node('ol');for(const text of [coverCopy.process1,coverCopy.process2,coverCopy.process3])steps.append(node('li','',text));mobileProcess.append(steps);making.append(mobileProcess,node('p','echo-note echo-making-note',content.makingNote));root.append(making);

 const live=section('echo-live','06',echoChapters[5][0].split(' / ')[1],'echo-dark echo-live');heading(live,content.live,content.liveBody);live.append(photo('page_8.png',captions.wide,'echo-live-wide'));
 const livePair=node('div','echo-live-pair');livePair.append(photo('page_9.png',captions.colour),photo('page_6.png',captions.lines));live.append(livePair);root.append(live);

 const next=section('echo-next','07',echoChapters[6][0].split(' / ')[1],'echo-paper');heading(next,content.next,content.nextBody);
 const nextGrid=node('div','echo-next-grid');questions.forEach(([label,title,body])=>{const item=node('div');item.append(node('span','echo-eyebrow',label),node('h3','',title),node('p','',body));nextGrid.append(item)});next.append(nextGrid);
 const end=node('footer','echo-footer');end.append(node('p','',content.end));const links=node('div');const source=node('a','',content.source);source.href='https://www.figma.com/design/NfnByM83GH0177KTHZjQW0/Echospace?node-id=0-1';source.target='_blank';source.rel='noopener noreferrer';const top=node('button','',content.top);top.type='button';top.onclick=()=>jump('case-overview');links.append(source,top);end.append(links);next.append(end);root.append(next);return root;
}
