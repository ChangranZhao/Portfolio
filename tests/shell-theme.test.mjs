import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const source=readFileSync(new URL('../dist/shell-theme.js',import.meta.url),'utf8');
function boot(saved=null,dark=false,blocked=false,material=null){
 const root={dataset:{}},storage=new Map(saved?[['portfolio-shell-theme',saved]]:[]);
 let listener;
 if(material)storage.set('portfolio-shell-material',material);
 const media={matches:dark,addEventListener:(event,fn)=>listener=fn};
 const window={};
 runInNewContext(source,{window,document:{documentElement:root},matchMedia:()=>media,localStorage:{getItem:key=>{if(blocked)throw Error();return storage.get(key)},setItem:(key,value)=>{if(blocked)throw Error();storage.set(key,value)}}});
 return {root,storage,theme:window.creativeOSTheme,material:window.creativeOSMaterial,system(value){media.matches=value;listener();}};
}
test('first visit follows system and responds to system changes',()=>{
 const app=boot();assert.equal(app.theme.mode,'system');assert.equal(app.root.dataset.theme,'light');
 app.system(true);assert.equal(app.root.dataset.theme,'dark');
});
test('material is independent of light/dark preference and survives reload',()=>{
 const app=boot('dark');assert.equal(app.root.dataset.material,'liquid');app.material.set('classic');assert.equal(app.root.dataset.material,'classic');assert.equal(app.root.dataset.theme,'dark');
 const reload=boot('dark',false,false,app.storage.get('portfolio-shell-material'));assert.equal(reload.material.mode,'classic');reload.material.set('liquid');reload.theme.set('light');assert.equal(reload.root.dataset.material,'liquid');
 const blocked=boot(null,false,true);blocked.material.set('classic');assert.equal(blocked.root.dataset.material,'classic');
});
test('explicit theme survives reload and ignores system changes',()=>{
 const app=boot(null,true);app.theme.set('light');app.system(true);
 assert.equal(app.root.dataset.theme,'light');
 const reload=boot(app.storage.get('portfolio-shell-theme'),true);
 assert.equal(reload.theme.mode,'light');assert.equal(reload.root.dataset.theme,'light');
 reload.theme.set('system');assert.equal(reload.root.dataset.theme,'dark');
});
test('invalid preferences and unavailable storage do not break startup',()=>{
 assert.equal(boot('invalid').theme.mode,'system');
 const app=boot(null,false,true);app.theme.set('dark');assert.equal(app.root.dataset.theme,'dark');
 app.theme.set('invalid');assert.equal(app.theme.mode,'system');
});
