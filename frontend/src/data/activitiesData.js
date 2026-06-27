// Activities & Recreation — content map (Discovery Samal Resort, Samal Island, Davao del Norte
// Imagery sourced and stored locally under /activities/.

export const ACTIVITIES_HERO_IMAGE =
  "/activities/_hero/recreation-facilities-page-website-header-announcement-1600-x-649-2.jpg";

export const ACTIVITIES_SECONDARY_HERO =
  "/activities/_hero/recreation-fitness-wellness-page-website-header-announcement-1600-x-649-2.jpg";

export const ACTIVITIES_INTRO = {
  preTitle: "Activities & Recreation",
  title: "Where leisure meets adventure",
  body: "Discovery Samal Resort offers its guests an ultimate relaxation package that includes access to world-class facilities. Unleash the wanderlust in you as you explore and unwind on these facilities designed with the most discerning of tastes in mind. Where leisure meets adventure, the unpretentiously luxurious extras are not extra — they are part of the basics, only here at Discovery Samal Resort on Samal Island, Davao del Norte.",
};

export const ACTIVITIES_STATS = [
  { value: "20+", label: "Curated Experiences" },
  { value: "153", label: "Villas & Suites" },
  { value: "3 ha", label: "Beachfront Grounds" },
  { value: "5", label: "Watersports Activities" },
];

export const CATEGORIES = [
  { id: "wellness", label: "Wellness & Indoor", caption: "Restore" },
  { id: "water", label: "Water & Pools", caption: "Refresh" },
  { id: "sports", label: "Sports & Courts", caption: "Play" },
  { id: "scenery", label: "Scenery & Walks", caption: "Wander" },
];

export const ACTIVITIES = [
  // Wellness
  {
    slug: "the-spa",
    name: "The Spa",
    category: "wellness",
    tagline: "A sanctuary of stillness",
    description:
      "An intimate spa retreat blending traditional Filipino hilot with contemporary therapies. Indulge in signature massages, body rituals, and quiet hours framed by warm timber and soft lantern light.",
    images: [
      "https://image-tc.galaxy.tf/wijpeg-e9e3fi5ee3nudxmag9mtxp6bm/aerial-1.jpg",
    ],
  },
  {
    slug: "fitness-gym",
    name: "Fitness Gym",
    category: "wellness",
    tagline: "Strength with a sea-view",
    description:
      "A fully appointed fitness studio outfitted with modern cardio and strength equipment. Whether your morning ritual is a quiet stretch or a full circuit, the gym is open for guests at their convenience.",
    images: [
      "/activities/wellness/gym/poro-gym-recreations.jpg",
      "/activities/wellness/gym/NIK_5236.jpg",
      "/activities/wellness/gym/NIK_5370.jpg",
    ],
  },
  {
    slug: "teenagers-club",
    name: "Teenagers Club",
    category: "wellness",
    tagline: "A space made for them",
    description:
      "A relaxed lounge designed with teen guests in mind — gaming corners, music, and casual hangout zones that keep young travellers entertained between resort adventures.",
    images: [
      "/activities/wellness/teenagers-club/poro-teenagers-club-recreations.jpg",
    ],
  },
  {
    slug: "kids-club",
    name: "Kids Club",
    category: "wellness",
    tagline: "Where little adventures begin",
    description:
      "A bright, supervised play space full of creative corners, soft play, and themed activities. Parents enjoy quiet time while children make new friends in a safe, joyful environment.",
    images: ["/activities/wellness/kids-club/Thunderbirdd-6301-1-min.jpg"],
  },

  // Water
  {
    slug: "main-pool",
    name: "Main Pool & Beach Garden",
    category: "water",
    tagline: "Sun, water, garden",
    description:
      "The main pool sits within a lush beach garden — generous loungers, dappled palms, and a sweeping deck made for slow afternoons under the Davao Gulf sky.",
    images: ["/activities/water/main-pool/poro-beachclubgarden.jpg"],
  },
  {
    slug: "infinity-pool",
    name: "Infinity Pool",
    category: "water",
    tagline: "An edge that meets the horizon",
    description:
      "A stunning infinity pool perched above the bay overlooking the Davao Gulf. The water spills toward the horizon, dissolving the line between resort and ocean.",
    images: ["/activities/water/fira-infinity-pool/slider-image1.jpg"],
  },
  {
    slug: "watersports",
    name: "Watersports",
    category: "water",
    tagline: "Salt, wind, momentum",
    description:
      "Kayaking, paddle boarding, and sea-side adventures along the resort's calm cove waters. A curated lineup of watersports guided by the resort recreation team.",
    images: [
      "/activities/water/watersports/PORO-recreations-facilities-watersport-amenities-min.jpg",
    ],
  },
  {
    slug: "private-beach",
    name: "Private Beach",
    category: "water",
    tagline: "Your own quiet shoreline",
    description:
      "A secluded stretch of sand reserved for resort guests — soft daylight strolls, golden-hour silhouettes, and tranquil evenings beside lapping water.",
    images: [
      "/activities/water/private-beach/Poro-private-beachfacilities-min.jpg",
    ],
  },

  // Sports
  {
    slug: "volleyball-court",
    name: "Volleyball Court",
    category: "sports",
    tagline: "300 sqm of friendly competition",
    description:
      "An open-air volleyball court designed for casual matches between friends and family. Sunlit by day, lit by resort lights into the evening.",
    images: [
      "/activities/sports/volleyball-court/Poro-volleyballfacilities-min.jpg",
    ],
  },
  {
    slug: "basketball-court",
    name: "Basketball Court",
    category: "sports",
    tagline: "600 sqm under open skies",
    description:
      "A full outdoor basketball court inviting pick-up games and group play, framed by tropical greens and the resort's lush island landscaping.",
    images: [
      "/activities/sports/basketball-court/poro-basketball-court-recreations.jpg",
    ],
  },
  {
    slug: "tennis-court",
    name: "Tennis Court",
    category: "sports",
    tagline: "Rallies with a sea breeze",
    description:
      "A regulation tennis court for guests who play. Schedule a morning set or an evening rally — racquets and balls available through the recreation desk.",
    images: [
      "/activities/sports/tennis-court/Poro-Tennis-courtfacilities-min.jpg",
    ],
  },
  {
    slug: "mini-golf",
    name: "9-Hole Mini Golf",
    category: "sports",
    tagline: "A short course, a long laugh",
    description:
      "A whimsical 9-hole mini golf course winding through landscaped gardens — an easy favourite for families and groups of friends.",
    images: ["/activities/sports/mini-golf/poro-mini-golf-recreations.jpg"],
  },

  // Scenery
  {
    slug: "boardwalk",
    name: "Seaside Boardwalk",
    category: "scenery",
    tagline: "A path along the shoreline",
    description:
      "A jogging and strolling boardwalk that hugs the coast — perfect for sunrise runs, sunset walks, and quiet conversations beside the sea.",
    images: [
      "/activities/scenery/boardwalk/poro-boardwalk-jogging-path-recreations.jpg",
    ],
  },
  {
    slug: "urban-lights",
    name: "Urban Lights Gardens",
    category: "scenery",
    tagline: "Evenings lit like a postcard",
    description:
      "Whitewashed walkways and Mediterranean lanterns turn the resort grounds into a soft-lit garden city after dusk — endlessly photographable.",
    images: ["/activities/scenery/urban-lights/026A0533-low-res.jpg"],
  },
  {
    slug: "led-roses",
    name: "Field of 11,000 LED Roses",
    category: "scenery",
    tagline: "A garden that glows",
    description:
      "Eleven thousand illuminated roses bloom across a dedicated garden — a signature evening attraction and one of the resort's most loved photo moments.",
    images: [
      "/activities/scenery/led-roses/viber_image_2019-11-12_15-42-26.jpg",
    ],
  },
  {
    slug: "tulips-by-the-sea",
    name: "10,000 Tulips by the Sea",
    category: "scenery",
    tagline: "Colour against the blue",
    description:
      "Ten thousand tulip blooms set against the Davao Gulf — a vivid seasonal display where the colours of a European spring meet a Filipino shoreline.",
    images: [
      "/activities/scenery/tulips-by-the-sea/viber_image_2019-11-12_14-03-34.jpg",
    ],
  },
  {
    slug: "saint-pio-chapel",
    name: "Saint Pio Chapel",
    category: "scenery",
    tagline: "Quiet, light, reflection",
    description:
      "A serene whitewashed chapel set within the resort grounds — a place of stillness for prayer, weddings, and reflection. Mass is celebrated every Saturday at 6:30 PM.",
    images: ["/activities/scenery/saint-pio-chapel/chapel-low-res.jpg"],
  },
];

export const ACTIVITIES_BY_CATEGORY = CATEGORIES.map((cat) => ({
  ...cat,
  items: ACTIVITIES.filter((a) => a.category === cat.id),
}));
