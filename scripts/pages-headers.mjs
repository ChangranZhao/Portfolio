export function pagesHeaders(){
 const fresh=['/','/*.html','/asset-manifest.json'];
 const immutable=['/assets/*','/bundle-*','/chunk-*','/site-styles.*','/shell-theme.*','/touchdesigner.*','/td-model.*','/figma-board.*','/figma-board-language.*','/changzhi-language.*','/changzhi-atlas.*','/changzhi-translations.*'];
 // Cloudflare combines duplicate matching headers; do not put max-age=0 on /*.
 return fresh.map(route=>`${route}\n  Cache-Control: public, max-age=0, must-revalidate\n`).concat(immutable.map(route=>`${route}\n  Cache-Control: public, max-age=31536000, immutable\n`)).join('');
}
