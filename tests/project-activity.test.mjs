import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {manageProjectActivity} from '../dist/project-activity.js';

test('native sections retain their content while offscreen, scrolling and background motion pauses',async()=>{
 const dom=new JSDOM('<div class="window" data-suspended="false"><article><section><img src="/one.webp"></section><section>Two</section></article></div>',{url:'http://localhost'});
 const {document}=dom.window,article=document.querySelector('article'),sections=[...article.children],image=article.querySelector('img');let visible;
 Object.defineProperty(document,'hidden',{value:false,configurable:true});
 dom.window.IntersectionObserver=class{constructor(cb){visible=cb;}observe(){}disconnect(){}};
 const abort=new dom.window.AbortController();manageProjectActivity(article,abort.signal);
 visible([{target:sections[0],isIntersecting:true},{target:sections[1],isIntersecting:false}]);
 assert.equal(sections[0].classList.contains('project-section-paused'),false);assert.equal(sections[1].classList.contains('project-section-paused'),true);
 article.dispatchEvent(new dom.window.Event('scroll'));assert.equal(article.classList.contains('project-scroll-paused'),true);
 await new Promise(r=>setTimeout(r,180));assert.equal(article.classList.contains('project-scroll-paused'),false);
 document.querySelector('.window').dataset.suspended='true';document.dispatchEvent(new dom.window.Event('portfolio-windows-changed'));assert.equal(article.classList.contains('project-background-paused'),true);
 assert.equal(article.querySelector('img'),image);assert.equal(article.children.length,2);
 abort.abort();dom.window.close();
});
