import React,{createContext,useContext,useSyncExternalStore} from 'react';
import type {AppAPI} from './types';
export const APIContext=createContext<AppAPI>(null!);
const strings:Record<string,string>={
 'Pages':'页面','Layers':'图层','Design':'设计','Page':'页面','Selection':'所选画板','Project':'项目','Design canvas':'设计画布','Double-click a board to fit it':'双击画板以适应窗口','Select tool':'选择工具','Hand tool':'抓手工具','Zoom out':'缩小','Zoom in':'放大','Fit all boards':'总览全部画板','Fit selection':'适应所选画板','Drag to pan':'拖动以平移画布','Ctrl / ⌘ + scroll to zoom':'Ctrl / ⌘ + 滚轮缩放',
 'Select an award to explore the project and certificate.':'选择奖项，查看获奖作品与证书。','Award details':'奖项详情','Back to awards':'返回奖项','About the award':'奖项介绍','Recognized project':'获奖／入围作品','Awarding body':'颁发机构','Official award website':'奖项官方网站','Award certificate':'获奖证书','Result announcement':'结果公示','Enlarge certificate':'放大查看证明','Certificate identity':'证书标识',
 'Awards & selections':'获奖与入围','award and selection records':'条获奖与入围记录','Prizes, finalist selections and nominations are listed separately.':'分别标明获奖、入围及提名结果。','Date not recorded':'日期未注明','National undergraduate innovation projects':'国家级大学生创新训练项目','Exhibitions & presentations':'展览与现场呈现',
 'Exhibitions':'展览','Papers':'论文','Could not save. Browser storage is unavailable.':'无法保存，浏览器存储不可用。','Overview':'概览','Education & Experience':'教育与经历','Awards':'奖项','Commercial Projects':'商业项目','Exhibitions & Papers':'展览与论文','Creative Toolkit':'创作工具','Selected works':'精选作品','All projects':'全部项目','Search projects':'搜索项目','Search':'搜索','Favorites':'个人收藏','Albums':'相册','Library':'图库','All Photos':'所有照片','Photos':'照片','Projects':'项目','About Me':'个人介绍','Open project':'打开项目','Full Project':'完整项目','Quick Look':'快速查看','Grid view':'网格视图','List view':'列表视图','No results':'没有匹配内容','Try another search or album.':'试试其他关键词或相册。','No favorites yet':'还没有收藏','Use the heart beside a photo to save it here.':'点击照片旁的爱心，将它收藏到这里。','Add to favorites':'加入收藏','Remove from favorites':'取消收藏','Thumbnail size':'缩略图大小','Details':'详细信息','Digital media artist & interaction designer':'数字媒体艺术与交互设计','Education':'教育','Experience':'经历','Research & practice':'研究与实践','Browse selected works':'浏览精选作品','Read paper':'阅读论文','Project archive':'项目档案','Design files':'设计文件','Boards':'图版','Images':'图片','Fit':'适合窗口','Previous board':'上一张图版','Next board':'下一张图版','Select a project':'选择项目','Loading…':'正在加载…','Preview':'预览','Source explorer':'源码浏览器','Read only':'只读','Copy code':'复制代码','Copied':'已复制','Copy unavailable':'复制失败，请选择文字复制','Find in file':'在文件中查找','Search files':'搜索文件','No files match':'没有匹配的文件','Project notebook':'项目笔记','Notes':'笔记','Your notes':'你的笔记','Saved on this device':'保存在此浏览器','Write a note about this project…':'记录你对这个项目的想法…','Creative workspace':'创作工作区','Scene library':'场景库','Media lab':'媒体实验室','Visual studies':'视觉研究','Explore':'探索','Related projects':'相关项目','Code':'代码','Close preview':'关闭预览','Image':'图片','Open original':'打开原图','Retry':'重试','This app could not be loaded.':'此应用暂时无法加载。','Static board preview':'静态图版预览','Interactive version in Full Project':'交互版本请打开完整项目','No source file selected':'选择一个源文件','Notes are stored only in this browser.':'笔记仅保存在此浏览器。','View code':'查看代码','Library size':'图库数量','Contact & documents':'联系与文档','Documents':'文档','Creative OS · Portfolio':'Creative OS · 作品集','Made with':'创作工具','Project information':'项目信息','All':'全部','Files':'文件','Presentation':'演示','View project photos':'查看项目照片','Next match':'下一个匹配','matches':'处匹配','No matches':'没有匹配'};
const subscribe=(cb:()=>void)=>{document.addEventListener('portfolio-preferences',cb);return()=>document.removeEventListener('portfolio-preferences',cb);};
export function useLanguage(){return useSyncExternalStore(subscribe,()=>document.documentElement.lang,()=> 'en');}
export function useText(){const api=useContext(APIContext);const lang=useLanguage();return (text:string)=>lang.startsWith('zh')?api.localize(strings[text]||text):text;}
export function Icon({name,size=17}:{name:string;size?:number}){const paths:Record<string,React.ReactNode>={
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 3"/></>,
 disc:<><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5"/></>,
 microphone:<><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>,
 chart:<><path d="M4 3v18h17M8 16V9M13 16V5M18 16v-5"/></>,
 film:<><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4"/></>,
 applications:<><path d="m8 3 11 18M16 3 7 18M3 16h12M18 16h3" strokeWidth="2.5"/></>,
 appearance:<><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18Z" fill="currentColor" stroke="none"/></>,
 desktop:<><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 8h18M8 8v13"/></>,
 sound:<><path d="M3 9h4l5-4v14l-5-4H3Z" fill="currentColor" stroke="none"/><path d="M16 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></>,
 globe:<><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18M5 6.5h14M5 17.5h14"/></>,
 gear:<><path d="m10 2-.6 2.4-2 .9-2.1-1.2-2.1 3.6 2 1.6-.2 2.3L3 13l1.5 3.9 2.5-.3 1.6 1.5.1 2.6 4.1.6.9-2.4 2-.9 2.3 1.2 2.2-3.5-1.8-1.8.2-2.2 1.9-1.5-1.5-3.8-2.6.2L15 5.1 14.4 2Z"/><circle cx="12" cy="11.5" r="3.5"/></>,
 grid:<><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
 list:<><path d="M8 5h13M8 12h13M8 19h13"/><path d="M3 5h.1M3 12h.1M3 19h.1"/></>,
 folder:<path d="M3 7V5a1 1 0 0 1 1-1h6l2 3h8a1 1 0 0 1 1 1v11H3Z"/>,
 photo:<><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/></>,
 person:<><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/></>,
 heart:<path d="M20 5c-3-3-7-1-8 1-1-2-5-4-8-1-4 4 1 9 8 15 7-6 12-11 8-15Z"/>,
 search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
 code:<><path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/></>,
 award:<><circle cx="12" cy="8" r="5"/><path d="m8 12-2 9 6-3 6 3-2-9"/></>,
 book:<><path d="M12 5c-3-3-7-3-10-2v16c4-1 7 0 10 2 3-2 6-3 10-2V3c-3-1-7-1-10 2Z"/><path d="M12 5v16"/></>,
 briefcase:<><rect x="2" y="7" width="20" height="14" rx="3"/><path d="M8 7V3h8v4M2 13h20M10 13v3h4v-3"/></>,
 arrow:<path d="m9 5 7 7-7 7"/>,spark:<path d="m12 2 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z"/>,
 file:<><path d="M5 2h9l5 5v15H5Z"/><path d="M14 2v6h5M8 13h8M8 17h8"/></>,
 sliders:<><path d="M4 3v18M12 3v18M20 3v18"/><path d="M1 8h6M9 16h6M17 7h6"/></>
 };return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]||paths.folder}</svg>;}
export function SideButton({active,icon,label,onClick,count}:{active?:boolean;icon?:string;label:string;onClick:()=>void;count?:number}){return <button type="button" title={label} className={'os-side-item'+(active?' selected':'')} aria-pressed={!!active} onClick={onClick}>{icon&&<Icon name={icon}/>}<span>{label}</span>{count!==undefined&&<small>{count}</small>}</button>;}
export function Sidebar({children,footer}:{children:React.ReactNode;footer?:React.ReactNode}){return <aside className="os-sidebar"><div className="os-side-scroll">{children}</div>{footer&&<div className="os-side-footer">{footer}</div>}</aside>;}
export function Toolbar({title,children}:{title:string;children?:React.ReactNode}){return <header className="os-toolbar"><strong>{title}</strong><div className="os-toolbar-actions">{children}</div></header>;}
export function Search({value,onChange,label,autoFocus=false,inputRef}:{value:string;onChange:(q:string)=>void;label:string;autoFocus?:boolean;inputRef?:React.Ref<HTMLInputElement>}){return <label className="os-search"><Icon name="search" size={14}/><input ref={inputRef} type="search" aria-label={label} placeholder={label} value={value} onChange={e=>onChange(e.target.value)} autoFocus={autoFocus}/></label>;}
export function Empty({title,detail}:{title:string;detail?:string}){return <div className="os-empty"><Icon name="search" size={34}/><h2>{title}</h2>{detail&&<p>{detail}</p>}</div>;}
export function SmallButton({label,icon,onClick,active}:{label:string;icon:string;onClick:()=>void;active?:boolean}){return <button className="os-icon-button" type="button" title={label} aria-label={label} aria-pressed={active} onClick={onClick}><Icon name={icon}/></button>;}
