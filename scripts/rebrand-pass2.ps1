$root = "c:\Users\USER\Documents\Projects\Odds\HotelSite\discoverysamal-resort"
$exts = @("*.js","*.jsx","*.md","*.html","*.json","*.yaml","*.yml","*.css")
$files = Get-ChildItem -Path $root -Recurse -File -Include $exts |
  Where-Object {
    $_.FullName -notmatch "\\node_modules\\" -and
    $_.FullName -notmatch "\\dist\\" -and
    $_.FullName -notmatch "\\\.git\\" -and
    $_.FullName -notmatch "package-lock\.json$" -and
    $_.FullName -notmatch "\\backend\\logs\\" -and
    $_.FullName -notmatch "\\backend\\uploads\\" -and
    $_.FullName -notmatch "\\scripts\\rebrand-" -and
    $_.FullName -notmatch "\\rooms\.json$" -and
    $_.FullName -notmatch "\\scripts\\download-"
  }

$count = 0
foreach ($f in $files) {
  $orig = Get-Content -Raw -LiteralPath $f.FullName -ErrorAction SilentlyContinue
  if ($null -eq $orig) { continue }
  $new = $orig
  # Asset folder rename
  $new = $new -creplace 'assets/thunderbird/', 'assets/boracays-sands/'
  # Receipt and PDF filenames
  $new = $new -creplace 'Thunderbird_Resort_Booking', 'BoracaysSandsResort_Booking'
  $new = $new -creplace 'Thunderbird-Receipt', 'BoracaysSandsResort-Receipt'
  # Standalone phrases
  $new = $new -creplace 'About Thunderbird', 'About Discovery Samal'
  $new = $new -creplace 'Discover Thunderbird', 'Discover Discovery Samal'
  $new = $new -creplace 'Life at Thunderbird', 'Life at Discovery Samal'
  $new = $new -creplace 'Dining at Thunderbird', 'Dining at Discovery Samal'
  $new = $new -creplace 'Thunderbird\.', 'Discovery Samal.'
  if ($new -ne $orig) {
    Set-Content -LiteralPath $f.FullName -Value $new -NoNewline -Encoding UTF8
    $count++
    Write-Host ("updated: " + $f.FullName.Substring($root.Length+1))
  }
}
Write-Host ("TOTAL: " + $count)
