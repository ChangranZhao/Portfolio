import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {createReadStream} from 'node:fs';
import {gzipSync} from 'node:zlib';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const production=process.argv.includes('--production');
const root=fileURLToPath(new URL(production?'./site/':'./dist/',import.meta.url));
const port=Number(process.env.PORT||(production?4174:4173));
const base=process.argv.find(arg=>arg.startsWith('--base='))?.slice(7)||'/';
if(!base.startsWith('/')||!base.endsWith('/'))throw Error('Base must begin and end with /');
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.txt':'text/plain; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml','.pdf':'application/pdf','.woff2':'font/woff2'};
const compressed=new Map();
const server=http.createServer(async(req,res)=>{
  try{
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
    const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(!pathname.startsWith(base)){res.writeHead(404);res.end();return;}
    const file=path.resolve(root,pathname.slice(base.length)||'index.html');
    const relative=path.relative(root,file);
    if(relative.startsWith('..')||path.isAbsolute(relative)){res.writeHead(403);res.end();return;}
    const info=await stat(file);if(!info.isFile()){res.writeHead(404);res.end();return;}
    const etag=`"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`;
    const headers={'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':production&&/\.[a-f0-9]{12}\./.test(file)?'public, max-age=31536000, immutable':'no-cache','ETag':etag,'X-Content-Type-Options':'nosniff'};
    if(req.headers['if-none-match']===etag){res.writeHead(304,headers);res.end();return;}
    if(path.extname(file)==='.pdf'){
      headers['Accept-Ranges']='bytes';
      const range=req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      let start=0,end=info.size-1;
      if(range){
        start=range[1]?Number(range[1]):Math.max(0,info.size-Number(range[2]));
        end=range[1]&&range[2]?Math.min(Number(range[2]),end):end;
        if(start>end||start>=info.size){res.writeHead(416,{'Content-Range':`bytes */${info.size}`});res.end();return;}
        headers['Content-Range']=`bytes ${start}-${end}/${info.size}`;
      }
      headers['Content-Length']=end-start+1;res.writeHead(range?206:200,headers);
      if(req.method==='HEAD')res.end();else createReadStream(file,{start,end}).on('error',()=>res.destroy()).pipe(res);return;
    }
    let data;
    const text=/\.(html|css|m?js|json|svg|txt)$/.test(file);
    if(text)headers.Vary='Accept-Encoding';
    if(production&&text&&/\bgzip\b/.test(req.headers['accept-encoding']||'')){
      const key=file+etag;data=compressed.get(key);
      if(!data){data=gzipSync(await readFile(file));compressed.set(key,data);}
      headers['Content-Encoding']='gzip';
    }else data=await readFile(file);
    headers['Content-Length']=data.length;res.writeHead(200,headers);res.end(req.method==='HEAD'?undefined:data);
  }catch(error){res.writeHead(error instanceof URIError?400:404,{'Content-Type':'text/plain'});res.end('Not found');}
});
server.listen(port,'127.0.0.1',()=>console.log(`Portfolio ${production?'production':'development'} preview: http://127.0.0.1:${port}${base}`));
