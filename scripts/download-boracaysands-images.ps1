# Downloads all Boracay Sands hero/room/amenity images locally so the site
# is fully self-hosted instead of hot-linking to discoverysamal.com.

$ErrorActionPreference = 'Stop'

$root  = Split-Path -Parent $PSScriptRoot
$dest  = Join-Path $root 'frontend\public\images\discoverysamal'
New-Item -ItemType Directory -Force -Path $dest | Out-Null

# Main media library (year/month folder used by WordPress)
$base = 'https://discoverysamal.com/wp-content/uploads/2026/03'
# Slider cache (each image lives behind its own hashed folder)
$sliderCache = 'https://discoverysamal.com/wp-content/uploads/slider/cache'

$mediaLibrary = @(
  'Sands-Logo-new-scaled.png',
  'RCHG-1.png',
  'RCB08324-Edit-3.jpg',
  'RCB05376-edited-2-1024x768.jpg',
  'RCB05072-1024x682.jpg',
  'RCB04907-1.jpg',
  'RCB05328.jpg',
  'RCB04810.jpg',
  'RCB05581-2.jpg',
  'RCB05299.jpg',
  'RCB05411.jpg',
  'RCB08432-Edit-Edit.jpg',
  'RCB05063-1.jpg',
  'RCB04943-1.jpg',
  'RCB05072-1.jpg'
)

# Slider cache entries (hash dir -> filename) - reproduced from the scraped HTML
$sliderEntries = @(
  @{ Hash = '0d3b7fcc43d9ff234e39323d1d5867f7'; File = 'RCB04907-1.jpg' },
  @{ Hash = '2655f5101fc1dea7370ea357cb1068cb'; File = 'RCB04943-1.jpg' },
  @{ Hash = 'd6173989794dc856e70a21057b87b988'; File = 'RCB05072-1.jpg' },
  @{ Hash = '9c01427815f3f53f6d9940cb92e32344'; File = 'RCB05063-1.jpg' },
  @{ Hash = 'b2e1dbc92049aefef3b589927c712352'; File = 'RCB05328.jpg' },
  @{ Hash = '542fb3788cc8d9d498b21e2065384abf'; File = 'RCB04810.jpg' },
  @{ Hash = '54af27ddd9833713997b7758dcb2842a'; File = 'RCB05581-2.jpg' },
  @{ Hash = '54254ce006194575954d38495a62b6cc'; File = 'RCB05299.jpg' },
  @{ Hash = '2fac34f99e114d1f997483c9ca087bb3'; File = 'RCB08432-Edit-Edit.jpg' },
  @{ Hash = 'd13d2b72ebdc5620a94572640bfa16e4'; File = 'RCB05411.jpg' }
)

function Save-Image([string]$url, [string]$outPath) {
  if (Test-Path $outPath) {
    Write-Host "  SKIP $([System.IO.Path]::GetFileName($outPath)) (exists)"
    return
  }
  try {
    Invoke-WebRequest -Uri $url -OutFile $outPath -UseBasicParsing -ErrorAction Stop
    Write-Host "  OK   $([System.IO.Path]::GetFileName($outPath))"
  } catch {
    Write-Warning "FAIL $url -> $($_.Exception.Message)"
  }
}

Write-Host "Downloading $($mediaLibrary.Count) media library images..."
foreach ($name in $mediaLibrary) {
  Save-Image "$base/$name" (Join-Path $dest $name)
}

Write-Host "Downloading $($sliderEntries.Count) slider cache fallbacks..."
foreach ($e in $sliderEntries) {
  $target = Join-Path $dest $e.File
  if (-not (Test-Path $target) -or (Get-Item $target).Length -lt 1024) {
    Save-Image "$sliderCache/$($e.Hash)/$($e.File)" $target
  }
}

Write-Host "Done. Files saved to $dest"
Get-ChildItem $dest | Select-Object Name, @{N='KB';E={[math]::Round($_.Length/1024,1)}} | Format-Table -AutoSize
