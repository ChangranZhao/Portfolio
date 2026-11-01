import test from 'node:test';
import assert from 'node:assert/strict';
import {filterProjects,photoKey,readFavorites,toggleFavorite,appWindowId} from '../src/react-apps/model.mjs';
test('project search includes localized titles and preserves order',()=>{
 const projects=[{id:'p1',title:'Wind',category:'Spatial',summary:''},{id:'p2',title:'Gaia',category:'Art',summary:''}];
 assert.deepEqual(filterProjects(projects,'盖亚',s=>s==='Gaia'?'盖亚':s).map(p=>p.id),['p2']);
 assert.deepEqual(filterProjects(projects,'').map(p=>p.id),['p1','p2']);
});
test('photo favorites have stable project and image identities and tolerate corrupt storage',()=>{
 const key=photoKey('p1',2);assert.notEqual(key,photoKey('p2',2));
 const values=toggleFavorite([],key);assert.deepEqual(readFavorites(JSON.stringify(values)),values);
 assert.deepEqual(toggleFavorite(values,key),[]);
 assert.deepEqual(readFavorites('{broken'),[]);assert.deepEqual(readFavorites('{"key":true}'),[]);
 assert.deepEqual(readFavorites('["p1:2",null,4,"p1:2"]'),['p1:2']);
});
test('application registry uses the same window identities as dock restore actions',()=>{
 assert.equal(appWindowId('Terminal'),'terminal');
 assert.equal(appWindowId('Settings'),'settings');assert.equal(appWindowId('Photos'),'photos');assert.equal(appWindowId('Cursor'),'tool-Cursor');
 assert.equal(appWindowId('About'),appWindowId('Settings'),'Profile and preferences share one window identity');assert.equal(appWindowId('Projects'),'projects');
});
