export interface PortfolioImage {src:string;thumb:string;small?:string;preview?:string;name:string;path:string;width:number;height:number;smallWidth?:number;thumbWidth?:number;previewWidth?:number;fullWidth?:number}
export interface Project {id:string;title:string;category:string;summary?:string;introduction?:string;images:PortfolioImage[];documents:{name:string;src:string}[]}
export interface Board {id:string;name:string;page:string;width:number;height:number}
export interface SourceFile {name:string;description:string;language:string;content:string}
export interface MusicTrack {id:string;title:string;artist:string;category:string;cover:string;album?:string;previewUrl?:string;src?:string}
export interface ProfileRecord {id:string;date:string;title:{en:string;zh:string};result:{en:string;zh:string};work:{en:string;zh:string};place?:{en:string;zh:string};note?:{en:string;zh:string};projectId?:string}
export interface AwardDetail {description:{en:string;zh:string};about:{en:string;zh:string};issuer:string|null;issuerZh?:string|null;officialUrl:string|null;certificate:{src:string;width:number;height:number};identity:{src:string;x:number;y:number;w:number;h:number;aspect:number;kind:string;background?:string}}
export interface ProfileData {roles:string[];awards:string[][];commercial:string[][];exhibitions:string[][];publications:string[][];awardRecords:ProfileRecord[];exhibitionRecords:ProfileRecord[];innovationRecords:ProfileRecord[]}
export interface AppAPI {
 apps:{name:string;src:string}[];artwork:{folder:string;document:string;license:string};
 openApp:(name:string)=>void;closeApp:(name:string)=>void;
 getSettings:()=>SystemSettings;setSettings:(next:Partial<SystemSettings>)=>void;
 music:{get:()=>MusicState;update:(next:{enabled?:boolean;volume?:number;time?:number;loop?:boolean})=>void;subscribe:(fn:()=>void)=>()=>void;loadFile:(file:File)=>void;loadLibrary:()=>Promise<MusicTrack[]>;playTrack:(track:MusicTrack,queue?:MusicTrack[])=>void;next:()=>void;previous:()=>void;ambient:MusicTrack};
 projects:Project[];profile:ProfileData;logo:string;
 localize:(text:string)=>string;
 loadAwardDetails:()=>Promise<Record<string,AwardDetail>>;
 openProject:(id:string)=>void;openDetails:(id:string)=>void;
 openImage:(images:PortfolioImage[],index:number,title:string)=>void;
 openPaper:(title:string)=>void;hasPaper:(title:string)=>boolean;
 loadBoards:()=>Promise<Record<string,Board[]>>;loadCode:()=>Promise<SourceFile[]>;
 mountMuseum:(host:HTMLElement)=>Promise<()=>void>;
 mountGallery:(host:HTMLElement)=>Promise<()=>void>;
 prepareBoard?:(frame:HTMLIFrameElement,projectId:string,language:string)=>Promise<void>;
 createWindow:(options:{id:string;title:string;content:HTMLElement;width:number;height:number;className:string})=>{el:HTMLElement;existing:boolean};
 focusWindow:(id:string)=>void;updateWindowMetadata:(id:string,title:string,thumbnail?:string)=>void;
}
export interface SystemSettings {theme:string;material:string;language:string;side:string;startup:boolean;dock:number;brightness:number;blur:number;desktopIcons:number;desktopFont:number;glassTransparency:number;glassRefraction:number;glassBlur:number}
export interface GlassSettings {transparency:number;refraction:number;blur:number}
declare global {interface Window {creativeOSGlass?:{get:()=>GlassSettings;set:(next:Partial<GlassSettings>)=>void;reset:()=>void;syncTheme:()=>void}}}
export interface MusicState {enabled:boolean;volume:number;paused:boolean;time:number;duration:number;suspended:boolean;title:string;artist:string;cover:string;trackId:string;error:boolean;buffering:boolean;loop:boolean}
export interface AppOptions {section?:string;search?:boolean}
