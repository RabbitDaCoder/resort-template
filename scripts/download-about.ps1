$base = "https://www.thunderbird-asia.com/wp-content/uploads"
$root = ".\frontend\public\about"

$map = [ordered]@{
  "_hero" = @(
    "2017/10/about-us-page-website-header-announcement-1600-x-649-2.jpg",
    "2017/10/PORO-aerial-property-shot-min.jpg",
    "2017/10/PORO-overview-min.jpg"
  )
  "architecture" = @(
    "2017/10/PORO-resort-overview-min.jpg",
    "2017/10/PORO-Santorini-of-Asia.jpg",
    "2017/10/poro-resort-architecture.jpg"
  )
  "lifestyle" = @(
    "2017/10/PORO-resort-lifestyle-min.jpg",
    "2017/10/PORO-resort-experience-min.jpg"
  )
}

$dl = 0; $skip = 0; $fail = 0
foreach ($slug in $map.Keys) {
  $dir = Join-Path $root $slug
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  foreach ($p in $map[$slug]) {
    $name = ($p -split "/")[-1]
    $out = Join-Path $dir $name
    if (Test-Path $out) { $skip++; continue }
    try {
      Invoke-WebRequest -UseBasicParsing -Uri "$base/$p" -OutFile $out -TimeoutSec 30
      $dl++
    } catch {
      Write-Host "MISS $slug/$name"
      $fail++
    }
  }
}
Write-Host "Done. downloaded=$dl skipped=$skip fail=$fail"
