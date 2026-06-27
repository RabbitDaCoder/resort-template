$base = "https://www.thunderbird-asia.com/wp-content/uploads"
$root = ".\frontend\public\activities"

$map = [ordered]@{
  "_hero" = @(
    "2017/10/recreation-facilities-page-website-header-announcement-1600-x-649-2.jpg",
    "2017/11/recreation-fitness-wellness-page-website-header-announcement-1600-x-649-2.jpg"
  )
  "wellness/zaphira-spa" = @("2017/10/article-image2.jpg")
  "wellness/gym" = @(
    "2017/10/poro-gym-recreations.jpg",
    "2017/11/NIK_5236.jpg",
    "2017/11/NIK_5370.jpg"
  )
  "wellness/teenagers-club" = @("2017/10/poro-teenagers-club-recreations.jpg")
  "wellness/kids-club" = @("2017/10/Thunderbirdd-6301-1-min.jpg")
  "water/main-pool" = @("2017/10/poro-beachclubgarden.jpg")
  "water/fira-infinity-pool" = @("2017/10/slider-image1.jpg")
  "water/watersports" = @("2017/10/PORO-recreations-facilities-watersport-amenities-min.jpg")
  "water/private-beach" = @("2017/10/Poro-private-beachfacilities-min.jpg")
  "sports/volleyball-court" = @("2017/10/Poro-volleyballfacilities-min.jpg")
  "sports/basketball-court" = @("2017/10/poro-basketball-court-recreations.jpg")
  "sports/tennis-court" = @("2017/10/Poro-Tennis-courtfacilities-min.jpg")
  "sports/mini-golf" = @("2017/10/poro-mini-golf-recreations.jpg")
  "scenery/boardwalk" = @("2017/10/poro-boardwalk-jogging-path-recreations.jpg")
  "scenery/urban-lights" = @("2017/10/026A0533-low-res.jpg")
  "scenery/led-roses" = @("2017/10/viber_image_2019-11-12_15-42-26.jpg")
  "scenery/tulips-by-the-sea" = @("2017/10/viber_image_2019-11-12_14-03-34.jpg")
  "scenery/saint-pio-chapel" = @("2017/10/chapel-low-res.jpg")
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
      Invoke-WebRequest -UseBasicParsing -Uri "$base/$p" -OutFile $out -TimeoutSec 45
      $dl++
    } catch {
      Write-Host "FAIL $slug/$name : $($_.Exception.Message)"
      $fail++
    }
  }
}
Write-Host "Done. downloaded=$dl skipped=$skip fail=$fail"
