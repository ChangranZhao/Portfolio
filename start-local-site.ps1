param([switch]$NoBrowser)

$ErrorActionPreference = 'Stop'
$siteRoot = $PSScriptRoot
$siteUrl = 'http://127.0.0.1:4173/#project=p1'
$healthUrl = 'http://127.0.0.1:4173/'
$nodePath = 'C:\Program Files\nodejs\node.exe'
$chromePath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
$logRoot = Join-Path $env:LOCALAPPDATA 'QiPortfolio'

function Test-PortfolioServer {
    try {
        $response = Invoke-WebRequest -Uri $healthUrl -UseBasicParsing -TimeoutSec 2
        return $response.StatusCode -eq 200 -and $response.Content -match 'portfolio|作品集|Wind From The East'
    } catch {
        return $false
    }
}

try {
    if (-not (Test-Path -LiteralPath $nodePath)) {
        throw "Node.js was not found at $nodePath"
    }
    if (-not (Test-Path -LiteralPath (Join-Path $siteRoot 'server.mjs'))) {
        throw "Portfolio server was not found in $siteRoot"
    }

    if (-not (Test-PortfolioServer)) {
        New-Item -ItemType Directory -Path $logRoot -Force | Out-Null
        $serverPath = Join-Path $siteRoot 'server.mjs'
        $server = Start-Process -FilePath $nodePath -ArgumentList @($serverPath) `
            -WorkingDirectory $siteRoot -WindowStyle Hidden -PassThru `
            -RedirectStandardOutput (Join-Path $logRoot 'server.log') `
            -RedirectStandardError (Join-Path $logRoot 'server-error.log')

        for ($attempt = 0; $attempt -lt 40 -and -not (Test-PortfolioServer); $attempt++) {
            if ($server.HasExited) { break }
            Start-Sleep -Milliseconds 250
        }
        if (-not (Test-PortfolioServer)) {
            throw "The website did not start. See $logRoot\server-error.log"
        }
    }

    if (-not $NoBrowser) {
        if (Test-Path -LiteralPath $chromePath) {
            Start-Process -FilePath $chromePath -ArgumentList @('--new-tab', $siteUrl)
        } else {
            Start-Process $siteUrl
        }
    }
} catch {
    Add-Type -AssemblyName PresentationFramework
    [System.Windows.MessageBox]::Show($_.Exception.Message, '风从东方来 · 启动失败') | Out-Null
    exit 1
}
