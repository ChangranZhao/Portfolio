$ErrorActionPreference = 'Stop'
$cultureWeb = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot 'website'))
$cultureListener = [Net.HttpListener]::new()
$cultureListener.Prefixes.Add('http://localhost:10130/')
$cultureListener.Start()
$cultureSelf = Get-Process -Id $PID
@{id=$PID;started=$cultureSelf.StartTime.ToUniversalTime().Ticks.ToString()} | ConvertTo-Json | Set-Content (Join-Path $PSScriptRoot 'server.pid')
$cultureTypes = @{'.html'='text/html; charset=utf-8';'.js'='text/javascript; charset=utf-8';'.mjs'='text/javascript; charset=utf-8';'.css'='text/css; charset=utf-8';'.json'='application/json';'.svg'='image/svg+xml';'.png'='image/png';'.webp'='image/webp';'.jpg'='image/jpeg';'.woff2'='font/woff2';'.ttf'='font/ttf';'.pdf'='application/pdf';'.mp4'='video/mp4'}
try {
 while ($cultureListener.IsListening) {
  $cultureContext = $cultureListener.GetContext()
  $cultureResponse = $cultureContext.Response
  try {
   if ($cultureContext.Request.Url.AbsolutePath -eq '/__culture_identity') {
    $cultureResponse.ContentType='text/plain; charset=utf-8'
    $cultureBytes = [Text.Encoding]::UTF8.GetBytes('culture-1013')
    $cultureResponse.ContentLength64 = $cultureBytes.Length
    $cultureResponse.OutputStream.Write($cultureBytes,0,$cultureBytes.Length)
    continue
   }
   if ($cultureContext.Request.HttpMethod -notin @('GET','HEAD')) {$cultureResponse.StatusCode=405;continue}
   $cultureRelative = [Uri]::UnescapeDataString($cultureContext.Request.Url.AbsolutePath).TrimStart('/')
   if (-not $cultureRelative) {$cultureRelative='index.html'}
   $cultureFile = [IO.Path]::GetFullPath((Join-Path $cultureWeb $cultureRelative))
   if (-not $cultureFile.StartsWith($cultureWeb + [IO.Path]::DirectorySeparatorChar,[StringComparison]::OrdinalIgnoreCase)) {$cultureResponse.StatusCode=403;continue}
   if (-not [IO.File]::Exists($cultureFile)) {$cultureResponse.StatusCode=404;continue}
   $cultureResponse.ContentType=$cultureTypes[[IO.Path]::GetExtension($cultureFile)]
   if (-not $cultureResponse.ContentType) {$cultureResponse.ContentType='application/octet-stream'}
   $cultureResponse.Headers['Cache-Control']='no-cache'
   $cultureStream=[IO.File]::OpenRead($cultureFile)
   try {
    $cultureResponse.ContentLength64=$cultureStream.Length
    if ($cultureContext.Request.HttpMethod -ne 'HEAD') {$cultureStream.CopyTo($cultureResponse.OutputStream)}
   } finally {$cultureStream.Dispose()}
  } catch {
   try {$cultureResponse.StatusCode=500} catch {}
  } finally {
   try {$cultureResponse.Close()} catch {}
  }
 }
} finally {$cultureListener.Close()}
