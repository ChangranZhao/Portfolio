import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const source=(await readFile(new URL('../dist/background-music.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'').replaceAll('export function ','function ').replaceAll('import.meta.url',"'https://portfolio.test/background-music.js'");
function setup(enabled=true){
 const doc=new EventTarget(),win=new EventTarget(),players=[];let audio,mutation;
 doc.documentElement={};doc.querySelectorAll=()=>players;
 const storage=new Map([['portfolio-music-enabled',String(enabled)]]);
 vm.runInNewContext(source,{document:doc,window:win,location:{origin:'https://portfolio.test'},URL,registerTranslations(){},localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)},Audio:class{constructor(){audio=this;this.paused=true;}play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}},MutationObserver:class{constructor(fn){mutation=fn;}observe(){}}});
 const event=(target,type,extra)=>{const e=new Event(type);Object.assign(e,extra);target.dispatchEvent(e);};
 return {audio,players,mutation:()=>mutation(),state(frame,state){event(doc,'portfolio-video-state',{detail:{frame,state}});},message(source,state,origin='https://portfolio.test'){event(win,'message',{source,origin,data:{type:'portfolio-video-state',state}});},gesture(){event(doc,'pointerdown',{});}};
}
test('music stays paused until all videos end and resumes after a playing window closes',()=>{
 const t=setup(),a={isConnected:true},b={isConnected:true};t.gesture();assert.equal(t.audio.paused,false);
 t.state(a,1);t.state(b,3);t.gesture();assert.equal(t.audio.paused,true);
 t.state(a,0);assert.equal(t.audio.paused,true);t.state(b,0);assert.equal(t.audio.paused,false);
 t.state(a,1);a.isConnected=false;t.mutation();assert.equal(t.audio.paused,false);
});
test('nested videos coordinate audio only through an existing same-origin board',()=>{
 const t=setup(),source={},frame={contentWindow:source,isConnected:true};t.players.push(frame);t.gesture();
 t.message(source,1,'https://other.test');assert.equal(t.audio.paused,false);
 t.message({},1);assert.equal(t.audio.paused,false);
 t.message(source,1);assert.equal(t.audio.paused,true);t.message(source,0);assert.equal(t.audio.paused,false);
});
test('video completion does not enable music that the user disabled',()=>{
 const t=setup(false),frame={isConnected:true};t.gesture();t.state(frame,1);t.state(frame,0);assert.equal(t.audio.paused,true);
});
