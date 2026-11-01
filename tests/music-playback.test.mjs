import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {existsSync,statSync} from 'node:fs';
import {musicLibrary} from '../dist/music-library.js';
const dom=new JSDOM('<html lang="en"><body></body></html>',{url:'http://localhost/'});
const players=[];
class AudioStub extends dom.window.EventTarget {
 constructor(src){super();this.src=String(src);this.currentTime=0;this.duration=30;this.paused=true;this.volume=.2;players.push(this)}
 play(){this.paused=false;this.dispatchEvent(new dom.window.Event('play'));return Promise.resolve()}
 pause(){this.paused=true;this.dispatchEvent(new dom.window.Event('pause'))}
}
Object.assign(globalThis,{window:dom.window,document:dom.window.document,location:dom.window.location,localStorage:dom.window.localStorage,Audio:AudioStub,MutationObserver:dom.window.MutationObserver,Event:dom.window.Event});
const music=await import('../dist/background-music.js');
test('63 reference previews have local small covers and original Apple audio URLs',()=>{
 assert.equal(musicLibrary.length,63);assert.equal(new Set(musicLibrary.map(t=>t.id)).size,63);
 assert.equal(new Set(musicLibrary.map(t=>t.category)).size,8);
 let total=0;for(const track of musicLibrary){assert.match(track.previewUrl,/^https:\/\/audio-ssl\.itunes\.apple\.com\//);assert.ok(existsSync(new URL('../dist/'+track.cover,import.meta.url)));total+=statSync(new URL('../dist/'+track.cover,import.meta.url)).size}
 assert.ok(total<1.5*1024*1024,'All 63 covers stay below 1.5 MiB');
});
test('one audio element advances a queue and respects video suspension and manual pause',()=>{
 const audio=players[0],list=musicLibrary.slice(0,3);
 music.playMusicTrack(list[0],list);assert.equal(players.length,1);assert.equal(audio.preload,'none');assert.equal(audio.src,list[0].previewUrl);assert.equal(audio.loop,false);
 audio.dispatchEvent(new dom.window.Event('ended'));assert.equal(music.musicSettings().trackId,list[1].id);
 const frame=document.createElement('iframe');document.body.append(frame);
 const video=state=>document.dispatchEvent(new dom.window.CustomEvent('portfolio-video-state',{detail:{frame,state}}));
 video(1);assert.equal(audio.paused,true);assert.equal(music.musicSettings().suspended,true);
 video(0);assert.equal(audio.paused,false);assert.equal(music.musicSettings().trackId,list[1].id);
 video(1);music.updateMusicSettings({enabled:false});video(0);assert.equal(audio.paused,true,'Ending a video must not undo an explicit music pause');
 music.playMusicTrack(music.ambientMusicTrack,[music.ambientMusicTrack]);assert.equal(players.length,1);assert.equal(audio.loop,true);assert.equal(audio.src,music.ambientMusicTrack.src);
});
