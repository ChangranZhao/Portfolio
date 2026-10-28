import {registerTranslations} from './localization.js';
const copy=[
['What if consciousness could be uploaded?','假如，意识可以上传？'],
['A vision of digital eternity. A question of freedom.','一个关于数字永生的畅想，一次关于自由的追问。'],
['NEURO IMMERSIVE is a speculative art installation exploring consciousness uploading through an immersive spatial experience. Developed by Changran Zhao and Tiantai Peng, Device No. 42 invites visitors into the imagined digital utopia of Saint Alesia.','NEURO IMMERSIVE 是一件以意识上传为主题的思辨艺术装置。赵昶然与彭天泰共同创作的「第42号装置」，邀请观众进入名为「圣·阿莱西娅」的虚构数字乌托邦。'],
['Design fiction · Immersive installation · BCI / EEG','设计虚构 · 沉浸式装置 · 脑机接口 / 脑电'],
['01 / DESIGN FICTION','01 / 设计虚构'],['Imagining a desirable future. Questioning its promises.','想象理想的未来，追问承诺的背面。'],
['The project began with roughly a month of exploration, moving from broad philosophical questions toward the specific proposition of consciousness uploading. Design fiction became a way to translate existing technologies and social tensions into a possible future that visitors could encounter.','项目初期经历了约一个月的探索，从哲学命题逐步聚焦于「意识上传」。我们以设计虚构为方法，将已有技术与社会矛盾抽象转译为一个观众能够亲身进入的未来情境。'],
['Saint Alesia','圣·阿莱西娅'],
['In this fictional world, uploaded minds inhabit a virtual paradise without pain, illness or death. As class divisions deepen, those living under oppression see uploading as a route to freedom and social mobility. The promise of escape also raises a question: who controls the world they enter?','在这一虚构世界中，意识被上传至没有痛苦、疾病与死亡的虚拟乐园。阶级分化不断加剧，被压迫者将上传视为获得自由、实现身份跃迁的途径。然而，当人们选择逃离现实，又是谁掌握着他们即将进入的世界？'],
['Why 42?','为什么是42？'],
['Device No. 42 takes its name from The Hitchhiker’s Guide to the Galaxy: an ultimate answer whose underlying question remains unknown. Here, 42 becomes a metaphor for the blind pursuit of a promised utopia, and the possibility of entering a deeper form of control.','第42号装置的命名来自《银河系漫游指南》：终极答案已经出现，真正的问题却仍然未知。在这里，「42」成为盲目追逐乌托邦的隐喻，也暗示着更深一层的控制。'],
['02 / EXPERIENCE NARRATIVE','02 / 体验叙事'],['From the promise of escape to the loss of agency.','从逃离现实的承诺，到自主权的失落。'],
['Desire','渴望'],['The desire for immortality, social mobility and escape creates the motivation to upload.','永生、阶级跃迁与逃离现实的愿望，构成上传意识的动机。'],
['Upload','上传'],['Device No. 42 stages the threshold to Saint Alesia, inviting visitors to experience a simulated consciousness upload.','第42号装置构成通往圣·阿莱西娅的入口，邀请观众体验模拟的意识上传过程。'],
['Reveal','揭示'],['The narrative shifts from promoting the benefits of uploading to exposing control, questioning identity rights and the misuse of consciousness copies.','叙事从宣传意识上传的好处转向揭露控制，引导观众反思身份权的丧失与意识副本的滥用。'],
['The installation represents consciousness uploading as design fiction; it does not claim to upload a human mind.','作品以设计虚构呈现意识上传情境，并不代表已经实现人类意识上传。'],
['03 / TECHNICAL SYSTEM','03 / 技术实现'],['Data becomes a spatial image.','让数据成为空间中的影像。'],
['The system combines Python data processing, OSC transmission, TouchDesigner interaction logic and GLSL rendering. A parallel controller path uses PS2 buttons, Arduino and serial communication to switch scenes and map input values in TouchDesigner.','技术流程包括 Python 数据清洗、OSC 传输、TouchDesigner 交互整合与 GLSL 渲染。另一条控制链路通过 PS2 按钮、Arduino 与串口通信，实现画面切换及 TouchDesigner 内的数值映射。'],
['04 / INSTALLATION VIEWS','04 / 现场呈现'],['Inside the image.','置身影像。'],
['Projected imagery wraps the installation and extends into the surrounding room. Multiple viewpoints document the relationship between the projection surfaces, the visitor and the physical space.','投影影像包裹装置，并延伸至周围空间。不同视角的现场记录呈现了投影表面、观众身体与实体空间之间的关系。'],
['World-building film studies','世界观短片视觉片段'],['TouchDesigner interaction network','TouchDesigner 交互网络'],['GLSL rendering studies','GLSL 渲染实验'],['Python data processing','Python 数据处理'],['OSC transmission','OSC 数据传输'],['Controller and serial mapping','控制器与串口映射'],['Installation view','装置现场'],['Creators: Changran Zhao · Tiantai Peng','共同创作：赵昶然 · 彭天泰']
];
registerTranslations(copy);
const t=i=>copy[i][0];
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text)n.textContent=text;return n;};
export const neuroChapters=[['Overview','neuro-overview'],['Design fiction','neuro-fiction'],['Interaction','neuro-experience'],['Technical system','neuro-system'],['Exhibition','neuro-installation']];
export function createNeuroProject(article,{openImage}){
 article.classList.add('neuro-article');
 const figure=(file,caption,wide=false)=>{const f=el('figure',wide?'neuro-figure neuro-wide':'neuro-figure');const b=el('button','neuro-image-button');b.type='button';b.setAttribute('aria-label','Enlarge image: '+caption);const img=el('img');img.src='assets/neuro/'+file;img.alt=caption;img.loading='lazy';img.decoding='async';b.append(img);b.onclick=()=>openImage([{src:img.src,name:caption}],0,'NEURO IMMERSIVE');f.append(b,el('figcaption','',caption));return f;};
 const section=(id,kicker,title,body)=>{const s=el('section','neuro-section');s.id=id;s.append(el('span','neuro-kicker',kicker),el('h2','',title));if(body)s.append(el('p','neuro-lead',body));article.append(s);return s;};
 const hero=section('neuro-overview','NEURO IMMERSIVE / DEVICE NO. 42',t(0),t(2));hero.classList.add('neuro-intro');hero.prepend(el('p','neuro-tags',t(3)));hero.append(el('p','neuro-subtitle',t(1)),el('p','neuro-credit',copy.at(-1)[0]));
 const fiction=section('neuro-fiction',t(4),t(5),t(6));const cols=el('div','neuro-columns');for(const [a,b] of [[7,8],[9,10]]){const block=el('div');block.append(el('h3','',t(a)),el('p','',t(b)),figure(a===7?'0d429.png':'93586.png',t(a)));cols.append(block);}fiction.append(cols);
 const experience=section('neuro-experience',t(11),t(12));const steps=el('ol','neuro-steps');for(const [a,b] of [[13,14],[15,16],[17,18]]){const li=el('li');li.append(el('h3','',t(a)),el('p','',t(b)));steps.append(li);}experience.append(steps,el('p','neuro-note',t(19)));const film=el('div','neuro-film');for(const file of ['b2644.png','0f104.png','5df27.png','e935c.png','5741b.png','05297.png','0587d.png','89b5f.png','82998.png','f1035.png'])film.append(figure(file,t(26)));experience.append(film);
 const system=section('neuro-system',t(20),t(21),t(22));const tech=el('div','neuro-system-board');
 const module=(cls,title)=>{const n=el('div','neuro-module '+cls);n.append(el('h3','',title));return n;};
 const visual=module('neuro-visual','01 / TouchDesigner + GLSL'),render=el('div','neuro-render');
 visual.append(figure('5e873.png',t(27)));render.append(figure('ff688.png',t(28)),figure('2186c.png',t(28)));visual.append(render);
 const data=module('neuro-data','02 / Python → OSC');data.append(figure('c3c74.png',t(29)));const osc=el('div','neuro-osc');osc.append(figure('db24f.png',t(30)),figure('acc05.png',t(30)));data.append(osc);
 const control=module('neuro-control','03 / PS2 → Arduino → TouchDesigner');for(const file of ['97a68.png','5f477.png','24571.png','860ee.png'])control.append(figure(file,t(31)));
 tech.append(visual,data,control);system.append(tech);
 const installationVideo=el('section','mimesis-project-video');const frame=el('iframe');frame.src='https://www.youtube-nocookie.com/embed/TDY263vojzw';frame.title='NEURO IMMERSIVE — Installation Film';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';installationVideo.append(frame);article.append(installationVideo);
 const final=section('neuro-installation',t(23),t(24),t(25));const gallery=el('div','neuro-gallery');for(const file of ['0d429.png','cbe9d.png','0c408.png','e264d.png','a4e56.png','95b6b.png','97475.png','e4e5d.png','d855d.png','899f1.png'])gallery.append(figure(file,t(32)));final.append(gallery);
}
