import test from 'node:test';import assert from 'node:assert/strict';
import {browserAddress,newBrowserTab,visitTab,stepTab,installedProjects,START_PAGE} from '../src/react-apps/system-model.mjs';
test('Safari only permits http(s), internal project links and searches',()=>{
 for(const raw of ['javascript:alert(1)','data:text/html,hi','file:///etc/passwd','https://user:secret@example.com'])assert.equal(browserAddress(raw),null);
 assert.equal(browserAddress('example.com'),'https://example.com/');assert.equal(browserAddress('creativeos://project/p8'),'creativeos://project/p8');assert.match(browserAddress('digital art'),/q=digital%20art/);
});
test('Safari navigation drops forward branch after a new visit',()=>{let tab=newBrowserTab('one');tab=visitTab(tab,'https://a.example/');tab=visitTab(tab,'https://b.example/');tab=stepTab(tab,-1);tab=visitTab(tab,'https://c.example/');assert.deepEqual(tab.history,[START_PAGE,'https://a.example/','https://c.example/']);assert.equal(stepTab(tab,99).url,'https://c.example/');assert.equal(stepTab(tab,-99).url,START_PAGE);});
test('installed project shortcuts tolerate stale and corrupt storage',()=>{assert.deepEqual(installedProjects('["p1","p1","p9",null]',['p1']),['p1']);assert.deepEqual(installedProjects('{}',['p1']),[]);assert.deepEqual(installedProjects('broken',['p1']),[]);});
