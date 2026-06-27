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
    $_.FullName -notmatch "\\scripts\\rebrand-bulk\.ps1$"
  }

$count = 0
foreach ($f in $files) {
  $orig = Get-Content -Raw -LiteralPath $f.FullName -ErrorAction SilentlyContinue
  if ($null -eq $orig) { continue }
  $new = $orig
  $new = $new -creplace 'Thunderbird Resort', 'Discovery Samal Resort'
  $new = $new -creplace 'Thunderbird Pilipinas Hotels & Resorts, Inc\.', 'Discovery Samal Hospitality Group, Inc.'
  $new = $new -creplace 'Thunderbird Villas', 'Discovery Samal Villas'
  $new = $new -creplace 'Thunderbird Beach Club', 'Sands Beach Club'
  $new = $new -creplace 'Thunderbird&nbsp;Villas', 'Discovery Samal&nbsp;Villas'
  $new = $new -creplace 'Thunderbird ', 'Discovery Samal '
  $new = $new -creplace 'thunderbird-resort', 'discoverysamal-resort'
  $new = $new -creplace 'thunderbird_resort', 'boracays_sands_resort'
  $new = $new -creplace 'thunderbirdresort', 'sandshotelboracay'
  $new = $new -creplace 'THUN-T4B9R2X7', 'DSCV-S4ML0R7X'
  if ($new -ne $orig) {
    Set-Content -LiteralPath $f.FullName -Value $new -NoNewline -Encoding UTF8
    $count++
    Write-Host ("updated: " + $f.FullName.Substring($root.Length+1))
  }
}
Write-Host ("TOTAL FILES UPDATED: " + $count)
