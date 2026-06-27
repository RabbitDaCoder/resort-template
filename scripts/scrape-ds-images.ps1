$html = Get-Content 'C:\Users\USER\Documents\Projects\Odds\HotelSite\discoverysamal-resort\example.html' -Raw

Write-Host '=== HEADINGS ==='
$titles = [regex]::Matches($html, '<h[1-6][^>]*>(.*?)</h[1-6]>') | ForEach-Object {
  [regex]::Replace($_.Groups[1].Value, '<[^>]+>', '').Trim()
} | Where-Object { $_.Length -gt 2 } | Select-Object -Unique
$titles | ForEach-Object { Write-Host $_ }

Write-Host ''
Write-Host '=== PARAGRAPHS (first 120 chars) ==='
$paras = [regex]::Matches($html, '<p[^>]*>(.*?)</p>') | ForEach-Object {
  [regex]::Replace($_.Groups[1].Value, '<[^>]+>', '').Trim()
} | Where-Object { $_.Length -gt 30 } | Select-Object -Unique -First 30
$paras | ForEach-Object { Write-Host ($_.Substring(0, [Math]::Min(150, $_.Length))) }

exit

$ErrorActionPreference = 'SilentlyContinue'
function Get-FirstHero($url) {
  try {
    $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 25).Content
    $m = [regex]::Matches($html, 'https?://image-tc\.galaxy\.tf/[A-Za-z0-9\-_/?=&%.,]+\.(?:jpg|jpeg|png)')
    $urls = $m | ForEach-Object { $_.Value } | Where-Object { $_ -notmatch 'favicon|logo|icon-|sprite' } | Select-Object -Unique
    return ($urls -join '||')
  } catch { return "ERR" }
}
function Get-Og($url) {
  try {
    $html = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20).Content
    $m = [regex]::Match($html, 'property="og:image"[^>]*content="([^"]+)"')
    if (-not $m.Success) { $m = [regex]::Match($html, '"og:image"[^}]*"([^"]+image-tc[^"]+)"') }
    if (-not $m.Success) { $m = [regex]::Match($html, '(https?://image-tc\.galaxy\.tf/[^"\s<>]+\.(?:jpg|png))') }
    if ($m.Success) { return $m.Groups[1].Value } else { return '' }
  } catch { return "ERR" }
}
$villas = 'grand-signature-suite','three-bedroom-villa','two-bedroom-villa','one-bedroom-villa','premiere-one-bedroom-suite','one-bedroom-suite','executive-suite-premiere','samal-suite','executive-suite-beach','executive-suite-garden','premiere-suite','junior-suite'
foreach ($p in $villas) {
  Write-Host "==VILLA: $p =="
  Write-Host (Get-FirstHero "https://www.discoverysamal.com/villa/$p")
  Write-Host ""
}
foreach ($p in 'the-bistro','morning-catch','haribar-lounge') {
  Write-Host "==DINING: $p =="
  Write-Host (Get-FirstHero "https://www.discoverysamal.com/dining/$p")
  Write-Host ""
}
Write-Host "==SPA=="; Write-Host (Get-FirstHero 'https://www.discoverysamal.com/discover/experiences/samal-escape'); Write-Host ""
Write-Host "==PAV=="; Write-Host (Get-FirstHero 'https://www.discoverysamal.com/discover/experiences/mindanao-pavilion'); Write-Host ""
Write-Host "==HOME=="; Write-Host (Get-FirstHero 'https://www.discoverysamal.com/')
