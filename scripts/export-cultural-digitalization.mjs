import {cp,readFile,writeFile,mkdir,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const output=path.resolve(root,'../导出/1013分享');
const web=path.join(output,'website');
await mkdir(web,{recursive:true});
await cp(path.join(root,'site'),web,{recursive:true});
// Keep the original portfolio available under its own name; the share entry is the new presentation.
await cp(path.join(web,'index.html'),path.join(web,'portfolio.html'));
const landing=await readFile(path.join(web,'cultural-digitalization.html'),'utf8');
await writeFile(path.join(web,'cultural-digitalization.html'),landing.replaceAll('index.html#project=p1','portfolio.html#project=p1'));
await writeFile(path.join(web,'index.html'),'<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=cultural-digitalization.html"><title>文化数字化</title><a href="cultural-digitalization.html">进入文化数字化</a></html>');
await writeFile(path.join(output,'server.ps1'),'\ufeff'+await readFile(path.join(root,'scripts/culture-server.ps1'),'utf8'));
const ps=`$ErrorActionPreference = 'Stop'
$cultureRoot = $PSScriptRoot
$cultureUrl = 'http://localhost:10130/'
$cultureReady = $false
try { $cultureReady = (Invoke-WebRequest ($cultureUrl + '__culture_identity') -UseBasicParsing -TimeoutSec 2).Content -eq 'culture-1013' } catch {}
if (-not $cultureReady) {
  $cultureProcess = Start-Process -FilePath 'powershell.exe' -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File server.ps1' -WorkingDirectory $cultureRoot -WindowStyle Hidden -PassThru
  for ($cultureAttempt = 0; $cultureAttempt -lt 30; $cultureAttempt++) {
    Start-Sleep -Milliseconds 200
    try { $cultureReady = (Invoke-WebRequest ($cultureUrl + '__culture_identity') -UseBasicParsing -TimeoutSec 1).Content -eq 'culture-1013' } catch {}
    if ($cultureReady) { break }
  }
}
if (-not $cultureReady) { throw 'Cannot start local preview on port 10130.' }
Start-Process $cultureUrl
`;
await writeFile(path.join(output,'start.ps1'),'\ufeff'+ps);
await writeFile(path.join(output,'启动网站.cmd'),'@echo off\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1"\r\n');
await writeFile(path.join(output,'stop.ps1'),'\ufeff'+`$culturePidFile = Join-Path $PSScriptRoot 'server.pid'
if (Test-Path -LiteralPath $culturePidFile) {
 $cultureInfo = Get-Content -Raw -LiteralPath $culturePidFile | ConvertFrom-Json
 $cultureProc = Get-Process -Id $cultureInfo.id -ErrorAction SilentlyContinue
 if ($cultureProc -and $cultureProc.StartTime.ToUniversalTime().Ticks.ToString() -eq $cultureInfo.started) { Stop-Process -Id $cultureInfo.id }
 Remove-Item -LiteralPath $culturePidFile
}
`);
await writeFile(path.join(output,'停止网站.cmd'),'@echo off\r\npowershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"\r\n');
await writeFile(path.join(output,'使用说明.txt'),'\ufeff'+`文化数字化 · 长治 × 淄博

1. 双击“启动网站.cmd”，浏览器会打开文化数字化网站。
2. 演示结束后，可双击“停止网站.cmd”关闭本地服务。
3. 分享时请复制整个“1013分享”文件夹。使用 Windows 自带组件启动，无需安装依赖；本地图片、字体和交互可离线使用。研究来源等外部链接需要联网。
4. 请不要直接双击 website 内的 HTML：浏览器对本地模块有安全限制，需要上面的启动入口。

主要页面
文化数字化：http://localhost:10130/
长治独立项目：http://localhost:10130/changzhi.html
原个人网站（含长治更新）：http://localhost:10130/portfolio.html#project=p6
淄博原 Full Project：http://localhost:10130/portfolio.html#project=p1
淄博独立阅读：http://localhost:10130/zibo.html

交互：概念切换、长治原始信息图谱的主题/数字方法筛选、展项连线高亮、详细案例跳转、16张正文图板与放大阅读、图片放大、淄博三页导读与直接铺开的完整项目、文化球旋转/主题筛选、展项详情、减少动态效果。
内容来源：用户提供的16个Figma节点与既有个人网站。图板使用可选择文字及本地原始素材，未以整页截图替代。
运行方式：仅监听本机 127.0.0.1:10130，不会发布到互联网。
`);
console.log('Exported '+output+' (uses built-in Windows PowerShell).');
