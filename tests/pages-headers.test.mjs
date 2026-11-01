import test from 'node:test';
import assert from 'node:assert/strict';
import {pagesHeaders} from '../scripts/pages-headers.mjs';
test('hashed application assets receive one unambiguous immutable cache policy',()=>{
 const lines=pagesHeaders().trim().split('\n'),rules=[];for(let i=0;i<lines.length;i+=2)rules.push([new RegExp('^'+lines[i].split('*').map(s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*')+'$'),lines[i+1]]);
 for(const url of ['/assets/photo.123.webp','/chunk-XYZ.js','/bundle-app-XYZ.js','/site-styles.123.css','/shell-theme.123.js','/touchdesigner.123.js','/td-model.123.js','/figma-board.123.css','/changzhi-atlas.123.js']){const match=rules.filter(([pattern])=>pattern.test(url));assert.equal(match.length,1,url);assert.match(match[0][1],/31536000, immutable/);}
 for(const url of ['/','/index.html','/gaia-boards/board.123.html']){const match=rules.filter(([pattern])=>pattern.test(url));assert.equal(match.length,1,url);assert.match(match[0][1],/max-age=0/);}
});
