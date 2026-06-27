/* ------------------------------------------------------------------ */
/*  Discovery Samal Resort — Restaurants & Bars                       */
/*  Source: https://www.discoverysamal.com/dining                     */
/* ------------------------------------------------------------------ */

const CDN = "https://image-tc.galaxy.tf";

export const RESTAURANTS_HERO_IMAGE = `${CDN}/wijpeg-c0uod09o6y7vac02bhqv4q7u0/untitled-design-4.jpg?width=1920`;

export const RESTAURANTS_INTRO = `Featuring a wide selection of carefully-curated dining experiences to satisfy your palate, every restaurant and bar is a haven for fresh, distinctive, and prepared-to-perfection dishes — a true flavorful culinary paradise on Samal Island.`;

export const DINING_STATS = [
  { value: "3", label: "Venues" },
  { value: "All-Day", label: "Dining" },
  { value: "Fresh", label: "Seafood" },
  { value: "Island", label: "Ambiance" },
];

export const RESTAURANTS = [
  {
    slug: "the-bistro",
    name: "The Bistro",
    cuisine: "All-Day Dining • Filipino & International",
    atmosphere: "Poolside • Relaxed",
    tagline: "Your island home for every meal of the day",
    description:
      "Located by the villa pool, The Bistro offers a relaxed all-day dining experience featuring freshly prepared Filipino favorites and international classics. Start your morning with a hearty breakfast, enjoy a leisurely poolside lunch, or cap your day with a satisfying dinner — all in a warm, welcoming atmosphere.",
    highlights: [
      "All-day breakfast",
      "Filipino & international menu",
      "Poolside setting",
      "Family-friendly",
    ],
    hours: "Open All Day",
    location: "Villa Pool Area",
    images: [
      `${CDN}/wipng-cn1xwe8oz6c74bztnpequs8sy/3_standard.png`,
      `${CDN}/wipng-2uh7dwjqwm652z96t7wku7fyj/file.png`,
    ],
  },
  {
    slug: "morning-catch",
    name: "Morning Catch",
    cuisine: "Seafood • Filipino Specialties",
    atmosphere: "Fresh • Coastal",
    tagline: "The freshest catch from Samal Island's waters",
    description:
      "Morning Catch celebrates the bounty of Samal Island's surrounding seas with a menu built around the day's freshest catch. From grilled seafood platters to traditional Filipino seafood dishes, every plate tells the story of the island's rich coastal heritage.",
    highlights: [
      "Fresh daily catch",
      "Grilled seafood specialties",
      "Filipino classics",
      "Buffet options available",
    ],
    hours: "Lunch & Dinner",
    location: "Resort Beachfront",
    images: [
      `${CDN}/wipng-bfd4lwzedw9f1ywur94lwqiup/morning-catch_standard.png`,
      `${CDN}/wijpeg-jd33yv34hbjgw3lw8cx21chv/discovery-samal-09301-compressed_standard.jpg`,
    ],
  },
  {
    slug: "haribar-lounge",
    name: "Haribar Lounge",
    cuisine: "Cocktails • Bar Bites • BBQ",
    atmosphere: "Outdoor • Tropical Evening",
    tagline: "Sundowners, cocktails, and island barbecue nights",
    description:
      "Haribar Lounge is the perfect spot to unwind with signature cocktails, cold drinks, and flavorful barbecue in an open-air tropical setting. As the sun sets over Samal Island, gather with friends and family for the resort's signature Happy Hour and evening BBQ nights by the beach.",
    highlights: [
      "Signature cocktails",
      "BBQ buffet nights",
      "Happy Hour specials",
      "Outdoor tropical setting",
    ],
    hours: "Afternoon & Evening",
    location: "Beachside",
    images: [
      `${CDN}/wijpeg-c18fahf956puhoiw93d1h3jxn/haribar-lounge-interior_standard.jpg`,
      `${CDN}/wigif-a6760me6xtiyn171mrol2pl9g/best-dinner-barbecue-buffet-at-haribar-lounge-discovery-samal1_standard.gif`,
    ],
  },
];
