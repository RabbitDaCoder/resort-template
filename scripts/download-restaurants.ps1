$base = "https://www.thunderbird-asia.com/wp-content/uploads"
$root = ".\frontend\public\restaurants"

$map = [ordered]@{
  "olives-restaurant" = @(
    "2017/11/RPF01811.jpg","2017/11/RPF01651.jpg","2017/11/Olives.jpg",
    "2017/11/RPF01666.jpg","2017/11/RPF01680.jpg",
    "2017/11/rashel_79005133_195012894881268_7268350870940781155_n.jpg",
    "2026/03/Olives-Lenten-Menu_620x420px-TPHRI-1.jpg"
  )
  "all-american-diner" = @(
    "2017/11/DSC_0346.jpg","2017/11/RPF00440.jpg","2017/11/RPF00444.jpg",
    "2017/11/Buffalo-Style-Chicken-Wings.jpg"
  )
  "pianosa-deli-shop" = @(
    "2017/11/RPF00557.jpg","2017/11/IMG_0300.jpg","2017/11/pianosa-3.jpg",
    "2017/11/IMG_0318.jpg","2017/11/pianosa-2.jpg","2017/11/IMG_0309.jpg",
    "2017/11/Untitled-1-4.jpg"
  )
  "helios-pool-bar" = @(
    "2017/11/poro-Helios-pool-bar-restaurants.jpg",
    "2017/11/PORO-restaurants-helios-pool-bar-2-min.jpg",
    "2017/11/PORO-restaurants-helios-pool-bar-min.jpg",
    "2017/11/poro-Helios-pool-bar-additional-photo-restaurants_preview-min.jpeg"
  )
  "patio-santorini" = @(
    "2017/11/poro-Patio-Santorini-restaurants.jpg",
    "2017/11/patio-santorini.jpg",
    "2017/11/PORO-restaurants-patio-santorini_preview.jpeg"
  )
  "the-cliffs-restobar" = @(
    "2017/11/snack-bar-2.jpg","2017/11/RGB_1269.jpg",
    "2017/11/snack-bar.jpg","2017/11/The-Cliffs-restaurant-min.jpg",
    "2017/11/RGB_1300.jpg"
  )
  "ivy-bar-lounge" = @(
    "2017/11/PORO-restaurants-ivy-lounge.jpg","2017/11/crispy-pata.jpg",
    "2017/11/ivy-2.jpg","2017/11/laksa.jpg",
    "2017/11/overhead-shotivy-lounge-food.jpg",
    "2017/11/lumpiang-shanghai.jpg","2017/11/Food-3.jpg",
    "2017/11/hinanese-chicken.jpg"
  )
  "mian-bar" = @(
    "2017/11/PORO-restaurants-mian-bar-2-min.jpg",
    "2017/11/PORO-restaurants-mian-bar-min-1.jpg",
    "2017/11/PORO-restaurants-mian-bar-3-min.jpg",
    "2017/11/poro-Mian-Bar-additional-photo-restaurants_preview-min.jpeg"
  )
  "_hero" = @(
    "2017/10/restaurants-page-website-header-announcement-1600-x-649-1.jpg"
  )
}

$total = 0; $fails = 0; $skipped = 0
foreach ($slug in $map.Keys) {
  $dir = Join-Path $root $slug
  New-Item -ItemType Directory -Force -Path $dir | Out-Null
  foreach ($p in $map[$slug]) {
    $name = ($p -split "/")[-1]
    $out = Join-Path $dir $name
    if (Test-Path $out) { $skipped++; continue }
    try {
      Invoke-WebRequest -UseBasicParsing -Uri "$base/$p" -OutFile $out -TimeoutSec 45
      $total++
    } catch {
      Write-Host "FAIL $slug/$name : $($_.Exception.Message)"
      $fails++
    }
  }
}
Write-Host "Done. downloaded=$total skipped=$skipped fail=$fails"
