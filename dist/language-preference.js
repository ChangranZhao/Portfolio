const supported=['system','en','zh','zh-Hant'];
export function languagePreference(saved={}){
 return supported.includes(saved?.languageMode)?saved.languageMode:'system';
}
export function resolveLanguage(mode,locales=[]){
 if(mode!=='system'&&supported.includes(mode))return mode;
 const locale=String(locales[0]||'en').replaceAll('_','-').toLowerCase();
 if(!/^zh(?:-|$)/.test(locale))return 'en';
 return /(?:^|-)(hant|tw|hk|mo)(?:-|$)/.test(locale)?'zh-Hant':'zh';
}
