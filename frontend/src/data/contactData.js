// Contact Us — content map for Discovery Samal Resort.
// Brand identity comes from `frontend/src/lib/brand.js`.

import { brand } from "../lib/brand";

const CDN = "https://image-tc.galaxy.tf";

export const CONTACT_HERO_IMAGE = "${CDN}/wijpeg-aeexb9m4bu60ndq3vcdnb7l9o/discovery-samal-08124-2_standard.jpg";
export const CONCIERGE_IMAGE = "${CDN}/wijpeg-jd33yv34hbjgw3lw8cx21chv/discovery-samal-09301-compressed_standard.jpg";
export const LOCATION_IMAGE = "${CDN}/wijpeg-e9e3fi5ee3nudxmag9mtxp6bm/aerial-1.jpg";
export const SOCIAL_PREVIEW_IMAGES = [
  "${CDN}/wijpeg-9g0c8e4jia8i8dw5hv5xd3r05/dss-website-banner-home-page-2.jpg",
  "${CDN}/wijpeg-75f73vymu5o1t89ryvtwcmpug/girl-enjoying-the-pool-in-the-best-luxury-resort-in-davao-discovery-samal-tablet-size.jpg",
  "${CDN}/wijpeg-7jtyjnoy3zk9ji5fg7szxfttb/dss-website-banner-home-page.jpg",
  "${CDN}/wijpeg-e74jrxy6ezvibr2s8gcmfync5/109_standard.jpg",
  "${CDN}/wijpeg-7bqiwwh88twoyx3ckq1s6rk7/98_standard.jpg",
  "${CDN}/wipng-cn1xwe8oz6c74bztnpequs8sy/3_standard.png",
];

export const CONTACT_HERO = {
  preTitle: "Let's Plan Together",
  title: "Let's plan your",
  titleAccent: "island escape",
  body: "Our concierge team is ready to help you craft the perfect Samal Island experience — from beachfront arrivals to sunset reservations.",
};

export const WELCOME = {
  preTitle: "A Warm Welcome",
  title: "Hospitality, attentive",
  titleAccent: "to the smallest detail",
  body: "Whether you are planning a quiet retreat, hosting a celebration, or arranging a private island experience, our team is here to make every moment effortless. Reach us through the form below or any of the channels listed — we respond within one business day.",
};

// â”€â”€â”€ FORM OPTIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const INQUIRY_TYPES = [
  "Hotel Reservation",
  "Dining Reservation",
  "Events & Celebrations",
  "Group & Corporate",
  "Spa & Wellness",
  "VIP Guest Services",
  "Special Offers Inquiry",
  "General Inquiry",
];

export const TITLES = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prefer not to say"];

export const COUNTRIES = [
  "Philippines",
  "Australia",
  "Canada",
  "China",
  "France",
  "Germany",
  "Hong Kong",
  "India",
  "Indonesia",
  "Italy",
  "Japan",
  "Malaysia",
  "Netherlands",
  "New Zealand",
  "Singapore",
  "South Korea",
  "Spain",
  "Switzerland",
  "Taiwan",
  "Thailand",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Vietnam",
  "Other",
];

export const GUEST_OPTIONS = [
  "1 Guest",
  "2 Guests",
  "3 Guests",
  "4 Guests",
  "5+ Guests",
];

// â”€â”€â”€ CONTACT CHANNELS (concierge cards) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const PRIMARY_EMAIL = brand.email;
const PHONE = brand.phone;
const PHONE_HREF = `tel:${(brand.phone || "").replace(/\s/g, "")}`;

export const CONTACT_CHANNELS = [
  {
    id: "reservations",
    iconKey: "phone",
    title: "Reservations Hotline",
    blurb:
      "Available daily · 24/7 concierge support for bookings and guest requests.",
    items: [
      { label: "Phone", value: PHONE, href: PHONE_HREF },
      { label: "Mobile", value: PHONE, href: PHONE_HREF },
    ],
  },
  {
    id: "email",
    iconKey: "mail",
    title: "Email Concierge",
    blurb:
      "Send us your inquiry and our reservations desk will respond within one business day.",
    items: [
      { label: "Email", value: PRIMARY_EMAIL, href: `mailto:${PRIMARY_EMAIL}` },
    ],
  },
  {
    id: "events",
    iconKey: "sparkles",
    title: "Events & Celebrations",
    blurb:
      "Weddings, debuts, conferences and milestone gatherings on the shores of Samal Island, Davao del Norte.",
    items: [
      { label: "Email", value: PRIMARY_EMAIL, href: `mailto:${PRIMARY_EMAIL}` },
    ],
  },
  {
    id: "vip",
    iconKey: "crown",
    title: "VIP Guest Services",
    blurb:
      "Premium concierge assistance — itineraries, transfers, exclusive island experiences.",
    items: [
      { label: "Email", value: PRIMARY_EMAIL, href: `mailto:${PRIMARY_EMAIL}` },
    ],
  },
];

// â”€â”€â”€ LOCATION â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LOCATIONS = [
  {
    id: "white-beach",
    name: brand.displayName,
    addressLines: brand.address.split(",").map((s) => s.trim()),
    email: brand.email,
    phone: brand.phone,
    landmarks: [
      "Beachfront property on Samal Island, Davao del Norte",
      "30 minutes from Francisco Bangoy International Airport, Davao",
      "5-minute boat ride from Sta. Ana Wharf, Davao City",
      "Accessible from Sasa Wharf and Island City Mall Pier",
    ],
    image: LOCATION_IMAGE,
    mapEmbed:
      "https://www.google.com/maps?q=Samal+Island+Island+Garden+City+of+Samal+Davao+del+Norte&output=embed",
    mapLink:
      "https://maps.google.com/?q=Samal+Island+Island+Garden+City+of+Samal+Davao+del+Norte",
  },
];

// â”€â”€â”€ CONCIERGE PROMISE â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const CONCIERGE = {
  preTitle: "The Concierge",
  title: "From arrival to farewell,",
  titleAccent: "every detail composed",
  body: "From airport transfers to beachfront dining reservations, our concierge team ensures every moment of your island stay feels effortless and unforgettable.",
  bullets: [
    "Roundtrip transfers from Davao City pier terminals",
    "Private dining and sunset cocktail arrangements",
    "Spa, island-hopping and excursion bookings",
    "Curated itineraries for couples, families and groups",
  ],
};

// â”€â”€â”€ FAQ â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const FAQ = [
  {
    q: "Are airport and jetty port transfers included?",
    a: "Yes — we can arrange roundtrip transfers between Francisco Bangoy International Airport in Davao City and the resort, plus a boat transfer across the Davao Gulf to Samal Island. Contact our concierge for arrangements.",
  },
  {
    q: "What are your check-in and check-out times?",
    a: "Standard check-in is from 2:00 PM and check-out is until 12:00 noon. Early check-in and late check-out can be arranged on request, subject to availability.",
  },
  {
    q: "How do I get to Discovery Samal from Davao City?",
    a: "Discovery Samal is located on Samal Island — from Davao City, take a short ferry ride across the Davao Gulf (approximately 15–20 minutes from Sasa Wharf), then a short drive to the resort.",
  },
  {
    q: "What are your reservation and cancellation policies?",
    a: "Reservations are confirmed once payment or a deposit is received. Specific cancellation terms depend on the rate or package booked — our reservations team will share the details with your confirmation.",
  },
  {
    q: "Do you accommodate group bookings?",
    a: "Yes. Our Group Beachfront Getaway accommodates up to four guests, and larger groups can be arranged through our events team. Select 'Group & Corporate' in the inquiry form.",
  },
  {
    q: "What activities are available on the island?",
    a: "Island hopping, snorkeling, kayaking, beach volleyball, and various watersports are available. Our concierge can arrange excursions around Davao del Norte and Samal Island. Our concierge will tailor the itinerary to your stay.",
  },
  {
    q: "Do you offer spa and wellness services?",
    a: "Yes — in-room and beachside massage treatments are available daily. Our beachfront packages include one-hour massages for each guest.",
  },
];

// â”€â”€â”€ SOCIAL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const SOCIAL = [
  {
    name: "Facebook",
    handle: brand.socialHandle,
    href: brand.facebookPageUrl,
  },
  {
    name: "Instagram",
    handle: brand.socialHandle,
    href: "https://www.instagram.com/",
  },
];

