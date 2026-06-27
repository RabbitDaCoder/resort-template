$base = "https://www.thunderbird-asia.com/wp-content/uploads"
$root = ".\frontend\public\events"

$map = [ordered]@{
  "_hero" = @(
    "2017/10/event-venues-page-website-header-announcement-1600-x-649-1.jpg",
    "2017/11/events-occassions-page-website-header-announcement-1600-x-649-1.jpg"
  )
  "venues/agora-event-center" = @("2017/10/poro-agora-event-center-events-place-venues.jpg")
  "venues/crete-function-room" = @("2017/10/poro-crete.jpg")
  "venues/premiere-lounge" = @("2017/10/poro-Premiere-Loungeevents-place-venue_preview-min.jpeg")
  "venues/santorini-veranda" = @("2017/10/poro-santorini-veranda-events-place-venues.jpg")
  "venues/olives-garden" = @("2017/10/poro-Olives-garden-upper-levelevents-place-venue_preview-min.jpeg")
  "venues/ocean-wing-view-deck" = @("2017/10/poro-ocean-wing-view-deck-events-place-venues.jpg")
  "venues/poolside-fira-beach-club" = @("2017/10/PORO-events-place-venues-poolside-fira-beach-club-min.jpg")
  "venues/clubhouse-function-rooms" = @("2017/10/PORO-events-place-venues-clubhouse-function-room-A-B_preview-min.jpeg")
  "occasions/weddings" = @(
    "2017/11/PORO-events-place-occasions-header-1.jpg",
    "2017/11/poro-Wedding-additional-photo2-events-place-occasions_preview-min.jpeg",
    "2017/11/poro-wedding-1-events-place-occasions.jpg",
    "2017/11/poro-Wedding-additional-photo-1-events-place-occasions_preview-min.jpeg",
    "2017/11/poro-wedding-2-events-place-occasions.jpg"
  )
  "occasions/debut" = @(
    "2017/11/PORO-events-place-occasions-debut-additional-pic-min.jpg",
    "2017/11/poro-Debut-additional-photoevents-place-occasions_preview-min.jpeg",
    "2017/11/poro-debbut-1-events-place-occasions.jpg",
    "2017/11/poro-debbut-2-events-place-occasions.jpg"
  )
  "occasions/baptism" = @(
    "2017/11/Poro-baptismEvents-occasions-min.jpg",
    "2017/11/Poro-baptism-2Events-occasions-min.jpg",
    "2017/11/poro-baptism-events-place-occasions.jpg"
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
      Invoke-WebRequest -UseBasicParsing -Uri "$base/$p" -OutFile $out -TimeoutSec 45
      $dl++
    } catch {
      Write-Host "FAIL $slug/$name : $($_.Exception.Message)"
      $fail++
    }
  }
}
Write-Host "Done. downloaded=$dl skipped=$skip fail=$fail"
