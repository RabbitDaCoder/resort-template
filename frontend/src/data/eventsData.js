// Events & Meetings — Discovery Samal Resort
// Source: https://www.discoverysamal.com/meetings-events

const CDN = "https://image-tc.galaxy.tf";

export const EVENTS_HERO_IMAGE = `${CDN}/wipng-3art0l7rkeb1de20rtob9y7cw/1.png?width=1920`;

export const EVENTS_INTRO = {
  preTitle: "Meetings & Events",
  title: "Excellent facilities for excellent moments",
  body: "Poised to be the newest and premier venue for meetings and events in Davao, Discovery Samal Resort is equipped with world-class event facilities. From the largest convention center in Samal to modern function rooms, there is a venue for every occasion paired with a tropical island ambiance.",
};

export const EVENTS_STATS = [
  { value: "6+", label: "Event Types" },
  { value: "1,000+", label: "Guest Capacity" },
  { value: "Premier", label: "Davao Venue" },
  { value: "Beach", label: "Wedding Setting" },
];

export const EVENT_VENUES = [
  {
    slug: "samal-grand-ballroom",
    name: "Samal Grand Ballroom",
    tagline: "The biggest, most state-of-the-art event space in Davao",
    description:
      "The Samal Grand Ballroom is the biggest, most state-of-the-art event space in Davao. Designed for large-scale events — from grand weddings and conventions to corporate galas — it combines modern audiovisual infrastructure with tropical island elegance.",
    area: "Premier Ballroom",
    capacity: { banquet: 1000, theater: 1200, cocktails: 1500 },
    images: [`${CDN}/wijpeg-e74jrxy6ezvibr2s8gcmfync5/109_standard.jpg`],
  },
  {
    slug: "meetings",
    name: "Meetings",
    tagline: "Spark ideas and inspire people in a tropical island setting",
    description:
      "Spark ideas and inspire people with a productive meeting experience unlike any other. Our modern function rooms are fully equipped for boardroom meetings, training sessions, and corporate workshops — paired with world-class service and a tranquil island ambiance.",
    area: "Function Rooms",
    capacity: { banquet: 200, theater: 300, classroom: 150 },
    images: [`${CDN}/wijpeg-1g0u4me7njuojpjyh7cbaffgg/72_standard.jpg`],
  },
  {
    slug: "beach-wedding",
    name: "Beach Wedding",
    tagline: "Celebrate your dream beach wedding overlooking calm seas",
    description:
      "Make your dream beach wedding a reality at Discovery Samal Resort. Exchange vows with calm turquoise waters as your backdrop, with the island breeze and golden sunset creating an unforgettable ceremony setting on the shores of Samal Island.",
    area: "Beachfront Venue",
    capacity: { banquet: 300, cocktails: 400 },
    images: [`${CDN}/wijpeg-eznmcanzmo9ljqaokct7f6p7y/66_standard.jpg`],
  },
  {
    slug: "destination-weddings",
    name: "Destination Weddings",
    tagline: "Exquisite and endearing — a wedding destination like no other",
    description:
      "Exquisite and endearing — Discovery Samal Resort is the ultimate destination wedding venue. Let the natural beauty of Samal Island become part of your story, with dedicated wedding specialists to ensure every detail is perfectly crafted for your special day.",
    area: "Resort-Wide",
    capacity: { banquet: 500, cocktails: 700 },
    images: [`${CDN}/wijpeg-9o9n6v42y52wdkhazz5z96ajv/dscf3931_standard.jpg`],
  },
  {
    slug: "corporate-events",
    name: "Corporate Events",
    tagline: "A tranquil, rejuvenating escape for corporate teams",
    description:
      "Give your team a corporate event experience they won't forget. Discovery Samal Resort provides a tranquil, rejuvenating escape from the city — the perfect backdrop for incentive trips, team building activities, product launches, and executive retreats.",
    area: "Multiple Venues",
    capacity: { banquet: 400, theater: 600, cocktails: 800 },
    images: [`${CDN}/wijpeg-ezwz0aaorvksxbv6pdur5632k/74_standard.jpg`],
  },
  {
    slug: "social-events",
    name: "Social Events",
    tagline: "Celebrate every bit of life with friends and loved ones",
    description:
      "Celebrate every bit of life — from intimate birthday parties and graduation celebrations to debut ceremonies and anniversaries. Discovery Samal Resort provides the perfect island backdrop for social gatherings of all sizes, with full event planning and catering support.",
    area: "Flexible Venues",
    capacity: { banquet: 200, cocktails: 300 },
    images: [`${CDN}/wijpeg-3xlgnmoh34hheghgnpwtt41ns/70_standard.jpg`],
  },
];

export const OCCASIONS = EVENT_VENUES;
