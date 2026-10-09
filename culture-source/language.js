import {resolveLanguage,languagePreference} from '../dist/language-preference.js';
import {traditional} from '../dist/chinese-traditional.js';
export function cultureLanguage(preferences){
 return resolveLanguage(languagePreference(preferences),navigator.languages?.length?navigator.languages:[navigator.language]);
}
export const cultureText=(zh,en,lang)=>lang==='en'?en:lang==='zh-Hant'?[...zh].map(c=>traditional[c]||c).join(''):zh;
