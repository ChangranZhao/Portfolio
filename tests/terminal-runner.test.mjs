import test from 'node:test';
import assert from 'node:assert/strict';
import {createRun,stepRun,respawnRun} from '../src/react-apps/runner-model.mjs';
import {projects as portfolio} from '../dist/data.js';
const projects=[{id:'p7',title:'MIMESIS — The Shape of AI'},{id:'p8',title:'GAIA HYPOTHESIS'},{id:'p4',title:'ECHO-SPACE'}];
const idle={left:false,right:false,jump:false,jumpPressed:false};
test('world is built from actual project names and a finished run can open its projects',()=>{
 const g=createRun(projects);assert.deepEqual(g.world.sections.map(s=>s.id),['p7','p8','p4']);assert.ok(g.world.platforms.some(p=>p.label.includes('MIMESIS')));assert.equal(g.phase,'ready');
 g.phase='playing';g.player.x=g.world.finish+1;stepRun(g,idle,1/120);assert.equal(g.phase,'won');assert.equal(g.visited.size,3);
});
test('jumping leaves the ground and lands on a named platform without tunnelling',()=>{
 const g=createRun(projects);g.phase='playing';g.player.x=12;g.player.y=19;g.player.grounded=true;
 stepRun(g,{...idle,jump:true,jumpPressed:true},1/120);assert.ok(g.player.vy<0);
 for(let i=0;i<130;i++)stepRun(g,{...idle,jump:true},1/120);
 assert.equal(g.player.grounded,true);assert.equal(g.player.y+g.player.h,18);
});
test('damage respawns at a checkpoint, preserves collected marks, and ends after three falls',()=>{
 const g=createRun(projects);g.phase='playing';g.coins.add('test');
 for(let i=0;i<3;i++){g.player.y=40;g.invincible=0;stepRun(g,idle,1/120)}
 assert.equal(g.phase,'over');assert.equal(g.lives,0);assert.ok(g.coins.has('test'));
 respawnRun(g);assert.equal(g.phase,'ready');assert.equal(g.lives,3);assert.equal(g.coins.size,0);
});
test('paused worlds do not advance and position never depends on the screen size',()=>{
 const g=createRun(projects),before=g.player.x;g.phase='paused';stepRun(g,{...idle,right:true},1/30);assert.equal(g.player.x,before);assert.equal(g.time,0);
 g.phase='playing';for(let i=0;i<60;i++)stepRun(g,{...idle,right:true},1/120);assert.ok(g.player.x>before);assert.ok(g.player.x<before+10);
});
test('a quick tap reaches the first platform, and a deterministic run can finish all 14 projects',()=>{
 const tap=createRun(projects);tap.phase='playing';tap.player.x=12;stepRun(tap,{...idle,jumpPressed:true},1/120);
 for(let i=0;i<140;i++)stepRun(tap,idle,1/120);
 assert.equal(tap.player.y+tap.player.h,18,'A normal tap can land on the first project platform');
 const g=createRun(portfolio);g.phase='playing';for(let i=0;i<18000&&g.phase==='playing';i++)stepRun(g,{...idle,right:true,jump:true,jumpPressed:g.player.grounded},1/120);
 assert.equal(g.phase,'won');assert.equal(g.visited.size,14);assert.ok(g.lives>0);
});
test('new and restarted games default to constant-speed forward motion without directional input',()=>{const g=createRun(projects);assert.equal(g.auto,true);g.phase='playing';const start=g.player.x;for(let i=0;i<60;i++){stepRun(g,idle,1/120);assert.equal(g.player.vx,11)}assert.ok(Math.abs(g.player.x-start-5.5)<1e-8);g.auto=false;respawnRun(g);assert.equal(g.auto,true)});
test('automatic speed is independent of frame rate and manual mode still allows directional control',()=>{const positions=[30,60,120].map(fps=>{const g=createRun(projects);g.phase='playing';for(let i=0;i<fps;i++)stepRun(g,idle,1/fps);return g.player.x});assert.ok(Math.max(...positions)-Math.min(...positions)<1e-8);const g=createRun(projects);g.auto=false;g.phase='playing';stepRun(g,{...idle,left:true},1/120);assert.ok(g.player.vx<0)});
