import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../dist/glass-settings.js',import.meta.url),'utf8');
function boot(raw=null,blocked=false,theme='dark'){
 const values=new Map(),events=[],storage=new Map(raw?[['creativeos-glass-settings',raw]]:[]),window={};
 const root={dataset:{theme},style:{setProperty:(k,v)=>values.set(k,String(v))}};
 runInNewContext(source,{window,Event,document:{documentElement:root,dispatchEvent:e=>events.push(e.type)},localStorage:{getItem:k=>{if(blocked)throw Error();return storage.get(k)},setItem:(k,v)=>{if(blocked)throw Error();storage.set(k,v)}}});
 return {glass:window.creativeOSGlass,values,events,storage,theme(value){root.dataset.theme=value;window.creativeOSGlass.syncTheme();}};
}
test('glass preferences restore before paint and transparency does not fade content',()=>{
 const app=boot('{"transparency":80,"refraction":140,"blur":14}');
 assert.equal(app.glass.get().transparency,80);assert.equal(app.values.get('--lg-blur'),'14px');
 assert.ok(Math.abs(Number(app.values.get('--lg-opacity'))-.2)<1e-8);assert.equal(app.values.has('opacity'),false);
 app.glass.set({blur:0});assert.equal(app.glass.get().transparency,80);assert.equal(app.values.get('--lg-blur'),'0px');
 assert.equal(app.events.at(-1),'portfolio-glass-settings');
 assert.equal(boot(app.storage.get('creativeos-glass-settings')).glass.get().blur,0);
});
test('invalid and unavailable storage remain usable; values are bounded',()=>{
 for(const raw of ['null','[]','{broken','{"blur":"large"}'])assert.equal(boot(raw).glass.get().blur,5);
 const app=boot(null,true);app.glass.set({transparency:999,refraction:-3,blur:Infinity});
 assert.equal(app.glass.get().transparency,100);assert.equal(app.glass.get().refraction,0);assert.equal(app.glass.get().blur,5);
 app.glass.reset();assert.equal(app.glass.get().transparency,36);assert.equal(app.glass.get().refraction,71);
});
test('light and dark have independent defaults, custom values and current-theme reset',()=>{
 const app=boot();assert.equal(app.glass.get().transparency,36);
 app.glass.set({blur:12});app.theme('light');assert.equal(app.glass.get().transparency,28);assert.equal(app.glass.get().blur,8);
 app.glass.set({transparency:45});app.theme('dark');assert.equal(app.glass.get().blur,12);
 app.glass.reset();assert.equal(app.glass.get().blur,5);app.theme('light');assert.equal(app.glass.get().transparency,45);
 const reloaded=boot(app.storage.get('creativeos-glass-settings'),false,'light');assert.equal(reloaded.glass.get().transparency,45);reloaded.theme('dark');assert.equal(reloaded.glass.get().blur,5);
});
test('legacy custom values migrate only to the active theme',()=>{
 const app=boot('{"transparency":55,"refraction":120,"blur":3}',false,'light');
 assert.equal(boot(app.storage.get('creativeos-glass-settings'),false,'dark').glass.get().transparency,36);
 assert.equal(app.glass.get().transparency,55);app.theme('dark');assert.equal(app.glass.get().transparency,36);app.theme('light');assert.equal(app.glass.get().refraction,120);
 app.glass.set({blur:4});const next=boot(app.storage.get('creativeos-glass-settings'),false,'dark');assert.equal(next.glass.get().refraction,71);next.theme('light');assert.equal(next.glass.get().blur,4);
});
