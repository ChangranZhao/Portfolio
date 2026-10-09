import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveLanguage,languagePreference} from '../dist/language-preference.js';
test('system language uses the primary browser locale',()=>{
 assert.equal(resolveLanguage('system',['en-US','zh-CN']),'en');
 assert.equal(resolveLanguage('system',['zh-CN','en-US']),'zh');
 for(const locale of ['zh-TW','zh-HK','zh-Hant'])assert.equal(resolveLanguage('system',[locale]),'zh-Hant');
 assert.equal(resolveLanguage('system',['fr-FR','zh-CN']),'en');
 assert.equal(resolveLanguage('system',[]),'en');
});
test('legacy default does not override system; explicit choices persist',()=>{
 assert.equal(languagePreference({lang:'zh'}),'system');
 assert.equal(languagePreference({languageMode:'en'}),'en');
 assert.equal(resolveLanguage('zh',['en-US']),'zh');
 assert.equal(languagePreference({languageMode:'invalid'}),'system');
});
