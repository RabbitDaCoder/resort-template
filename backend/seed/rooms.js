/**
 * Discovery Samal Resort — Rooms & Villas Data
 * Source: https://www.discoverysamal.com/villa
 * 153 lush villas and suites total across 12 room types
 */

const LIRP = "https://lirp.cdn-website.com/b434b26a/dms3rep/multi/opt";
const CDN = "https://image-tc.galaxy.tf";

const rooms = [
  // ─────────────────────────────────────────────────────
  // SUITES — Hotel Towers
  // ─────────────────────────────────────────────────────
  {
    name: "Junior Suite",
    slug: "junior-suite",
    category: "Standard",
    tagline: "Your gateway to Discovery Samal",
    location: "Hotel Towers — Heart of the Resort",
    description:
      "Begin your Discovery Samal journey with a peek of the panoramic vistas of the whole estate in your own suite. Our Junior Suite offers traveler essentials and more.",
    intro:
      "Located in the middle level and right in the heart of the resort, this is where modern interiors meet comfort and convenience. These suites showcase contemporary designs with progressive furnishings and state-of-the-art amenities to provide guests with the ultimate comfort and relaxation. Being in the two hotel towers, they provide an elevated view of the entire resort — a unique perspective of the beautiful structures and the tropical paradise all while relaxing in the comfort of your room.",
    bedType: "Double beds",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 12627,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Panoramic Estate View",
      "Ensuite Bathroom",
      "Private Balcony",
    ],
    images: [
      `${CDN}/wijpeg-72wmo9jujemi0ao9zojzdghd2/hotel-twin-pool-view-balcony_wide.jpg`,
      `${CDN}/wijpeg-3qsaxg2i3b09o6hcg17w98bao/hotel-twin-bedroom-with-garden-view_wide.jpg`,
      `${CDN}/wijpeg-bs55hh24i0m79snv7ssiphj2x/hotel-twin-bedroom_wide.jpg`,
      `${CDN}/wijpeg-cduu6k71jlq164yjkqkj4q119/hotel-king-with-garden-view_wide.jpg`,
      `${CDN}/wijpeg-2eejko3nepkilxn4uhho4sk5e/hotel-king-bed_wide.jpg`,
      `${CDN}/wijpeg-90pwzkpc5wpuuczdagzwl1zlw/hotel-king-balcony_wide.jpg`,
      `${CDN}/wijpeg-br9pjx02kcqxjf6b7by7tk0ub/hotel-king-bed_wide.jpg`,
      `${CDN}/wijpeg-114s18p5ah92wsbxnorun0o80/hotel-twin-pool-view-bathroom_wide.jpg`,
      `${CDN}/wijpeg-72ukfecw9g964r8tv782niju4/hotel-twin-with-pool-view_wide.jpg`,
    ],
    available: true,
  },

  {
    name: "Premiere Suite",
    slug: "premiere-suite",
    category: "Premier",
    tagline: "Extravagance and luxury — intimately yours",
    location: "Level 7, Hotel Tower",
    description:
      "The Premier Suite provides a quality and exclusive feel, ensuring a serene and intimate experience for solo travelers or couples seeking a cozy and comfortable haven.",
    intro:
      "Located at Level 7, the Premiere Suite provides a quality and exclusive feel, ensuring a serene and intimate experience for solo travelers or couples seeking a cozy and comfortable haven. As soon as one steps inside, they are transported to a world of extravagance and luxury with the suite's meticulously designed interiors featuring two plush twin-sized beds adorned with premium linens. Featuring contemporary furnishings, warm earth tones and tasteful accents, the suite is a haven of sophistication created with a sense of serenity and refinement. Its ensuite bathroom is nothing short of lavish, complete with a rejuvenating rain shower, luxurious bath amenities and plush bathrobes.",
    bedType: "Two twin-sized beds",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 19950,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Rain Shower",
      "Plush Bathrobes",
      "Complimentary Bath Amenities",
      "Private Balcony",
      "Level 7 Panoramic Views",
    ],
    images: [
      `${CDN}/wijpeg-2wdnpm1e9w9znaa0fnn5soumr/img-0861-2_wide.jpg`,
      `${CDN}/wijpeg-ebi1bkxcqlmakelvq896f48up/img-0858-3_wide.jpg`,
    ],
    available: true,
  },

  {
    name: "One Bedroom Suite",
    slug: "one-bedroom-suite",
    category: "Premium",
    tagline: "Where nature meets luxury",
    location: "Hotel Towers",
    description:
      "Reconnect with your inner wanderer through all the best of what Discovery Samal has to offer. Stays at our One-Bedroom Suites bring unforgettable experiences where nature meets luxury.",
    intro:
      "Located in the two hotel towers, the One-Bedroom Suite features a comfortable king-sized bed, calling you to relax and unwind in its cozy embrace, and will make you linger more. This well-appointed suite highlights modern amenities to ensure maximum comfort and convenience for our guests, with a separate living and dining room so you can move and travel with ease. Right outside the hotel towers is a massive infinity pool that seamlessly flows with the view of the Davao Gulf.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 19360,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Separate Living Room",
      "Separate Dining Room",
      "King-Sized Bed",
      "Infinity Pool Access",
      "Davao Gulf View",
    ],
    images: [
      `${CDN}/wijpeg-7ag5ej1eccv4jjh3jwhg9mg84/hotel-one-bedroom_wide.jpg`,
      `${CDN}/wijpeg-1cl137mjvwqn50s8y2gbldva8/hotel-one-bedroom-living-area_wide.jpg`,
    ],
    available: true,
  },

  // ─────────────────────────────────────────────────────
  // EXECUTIVE SUITES — Beneath the Villas
  // ─────────────────────────────────────────────────────
  {
    name: "Executive Suite Garden",
    slug: "executive-suite-garden",
    category: "Premium",
    tagline: "A tranquil escape into lush greenery",
    location: "Beneath the Villas — Garden Wing",
    description:
      "Away from the bustling city and into the perfect getaway, the Executive Suite Garden is an excellent choice for those who are looking for an escape.",
    intro:
      "Tucked just below the villas, the Executive Suite Garden provides a luxurious private experience. Well-equipped with modern and premium amenities, you'll enjoy the ultimate comfort and ensure a rejuvenating stay. Featuring a living area furnished with modern tones and bright accents, the Executive Suite Garden gives a sense of home away from home. The plush beds, premium linens, and soft pillows will lull you into a restful sleep, making the suite feel like a warm embrace after a long day of recreational activities.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 15320,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Private Terrace",
      "Garden View",
      "Premium Linens",
      "Plush Pillows",
      "Living Area",
    ],
    images: [
      `${CDN}/wijpeg-di1v6xqyi4ka92qdwg975kfql/executive-suite-garden-bathroom_wide.jpg`,
      `${CDN}/wipng-aqn292ud2zpv06f1btwa6qwwo/untitled-design-2_wide.png`,
      `${CDN}/wipng-507dc5qpdead8kupdzwmyfrlk/untitled-design_wide.png`,
    ],
    available: true,
  },

  {
    name: "Executive Suite Beach",
    slug: "executive-suite-beach",
    category: "Premium",
    tagline: "Island getaway at the Garden City of Samal",
    location: "Beneath the Villas — Beach Wing",
    description:
      "Reconnect with the traveler in you and wander in an island getaway at the Island Garden City of Samal. Discovery Samal's Executive Suites bring marvelous experiences for all the things you yearn for.",
    intro:
      "Spread beneath the villas, the Executive Suites create an undisturbed space, offering guests a quiet and serene expanse away from the common areas, allowing for a truly private and exclusive experience. The spacious rooms are designed to provide guests with maximum comfort and relaxation, with modern amenities, plush bedding, smart TV in all spaces, and the luxury of space for the living, bed, and bathroom. The private terraces in our Executive Suites offer the perfect spot for spending quality time with family and friends in a cozy and intimate setting.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 16667,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Private Terrace",
      "Beach View",
      "Plush Bedding",
      "Living Area",
      "Ensuite Bathroom",
    ],
    images: [
      `${CDN}/wijpeg-8nqrczjkfzh67hscq1dd7iwn1/executive-suite-king-bedroom-view_wide.jpg`,
      `${CDN}/wijpeg-2jct4zgskj1iaxbbuhm99w2yo/executive-suite-twin-living-area_wide.jpg`,
      `${CDN}/wijpeg-1sair0dbi17gmzlsshilo9eiq/executive-suite-twin-bathroom_wide.jpg`,
    ],
    available: true,
  },

  {
    name: "Executive Suite Premiere",
    slug: "executive-suite-premiere",
    category: "Premium",
    tagline: "Private. Exclusive. Refreshing.",
    location: "Beneath the Villas — Premiere Level",
    description:
      "The Executive Suite Premiere offers a peaceful and quiet escape, creating a truly private and exclusive experience.",
    intro:
      "Spread beneath the villas, the Executive Suite Premiere offers a peaceful and quiet escape away from the crowd, creating a truly private and exclusive experience. To provide the comfort and relaxation that everyone yearns for, the Executive Suite Premiere is equipped with modern and smart amenities and a wide space for a living, bed, and bathroom. The breathtaking view from the spacious private terrace is perfect for spending quality time with family and friends — whether you want to listen to the calm lullaby of the crystal waters or enjoy a sip of your favorite wine and simply relax with a good book.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 17500,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Spacious Private Terrace",
      "Crystal Water Views",
      "Living Area",
      "Bathroom",
    ],
    images: [
      `${CDN}/wijpeg-46jcl7sqvuaghpheqx2qld34r/executive-suite-twin-bed-with-view_wide.jpg`,
      `${CDN}/wijpeg-36ynx4uax9dhbxzp553v6f25b/execuite-suite-twin-balcony_wide.jpg`,
      `${CDN}/wijpeg-2jct4zgskj1iaxbbuhm99w2yo/executive-suite-twin-living-area_wide.jpg`,
      `${CDN}/wijpeg-1sair0dbi17gmzlsshilo9eiq/executive-suite-twin-bathroom_wide.jpg`,
    ],
    available: true,
  },

  // ─────────────────────────────────────────────────────
  // SAMAL SUITE — Level 6
  // ─────────────────────────────────────────────────────
  {
    name: "Samal Suite",
    slug: "samal-suite",
    category: "Luxury",
    tagline: "The epitome of luxury and comfort",
    location: "Level 6 — Davao Gulf Views",
    description:
      "Immerse yourself in the beauty of nature with personalized service in our Samal Suite — the epitome of luxury and comfort.",
    intro:
      "Escape the hustle and bustle of everyday life and immerse yourself in the beauty of nature with the finest amenities and personalized service in our Samal Suite. Each of our six rooms offers breathtaking views of Davao Gulf to provide a tranquil backdrop for your stay. Located on Level 6, Samal Suite is designed with sophistication and elegance in mind. The room opens to a spacious living area furnished with the finest amenities to keep you comfortable and relaxed, offering an exceptional experience. The suite has modern amenities including a flat-screen TV, minibar, safety deposit box and air conditioning, and the bathroom features a shower, hairdryer and complimentary toiletries.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 17340,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Flat-Screen TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Davao Gulf Views",
      "Level 6 Location",
      "Spacious Living Area",
      "Shower",
      "Hairdryer",
      "Complimentary Toiletries",
      "Personalized Service",
    ],
    images: [
      `${CDN}/wijpeg-5qsn0vn9x6ol8q4t3k8607n7f/img-3382_wide.jpg`,
      `${CDN}/wijpeg-paz64oo0p8ipd96l1ovrwl6p/img-3407_wide.jpg`,
    ],
    available: true,
  },

  // ─────────────────────────────────────────────────────
  // PREMIERE ONE BEDROOM SUITE — Villa Wing
  // ─────────────────────────────────────────────────────
  {
    name: "Premiere One Bedroom Suite",
    slug: "premiere-one-bedroom-suite",
    category: "Premier",
    tagline: "A tranquil retreat to an overlooking paradise",
    location: "Villa Wing — Overlooking Paradise",
    description:
      "Begin an astounding journey to an overlooking paradise surrounded by lush greeneries and crystal clear waters. Our Premiere One Bedroom Suite provides a peaceful and secluded space for those who would like to go on a tranquil retreat.",
    intro:
      "The Premiere One Bedroom Suite offers a luxurious experience, with a sense of wonder and anticipation that begins upon arrival. The modern elegance and impeccable design of the space are immediately captivating to the senses, with every detail carefully crafted to provide unparalleled comfort and sophistication. As the sun sets, retire to a luxurious king-sized bed, surrounded by the gentle whispers of the sea and cocoon in plush linens while enjoying a restful slumber. Upon awakening, feel refreshed and rejuvenated as you get ready to indulge on a culinary journey — choose to dine in one of the onsite restaurants or opt for a private al fresco meal on the terrace.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 2,
    capacity: 2,
    occupancy: 2,
    pricePerNight: 20707,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Lush Greenery Views",
      "Crystal Clear Water Views",
      "King-Sized Bed",
      "Premium Linens",
      "Private Terrace",
      "Al Fresco Dining Option",
    ],
    images: [
      `${CDN}/wijpeg-1yug51pm8nfy9bz8k3wyygay9/img-0696_wide.jpg`,
      `${CDN}/wijpeg-6bra35j8v4fym7bsl97rclc40/img-0795_wide.jpg`,
    ],
    available: true,
  },

  // ─────────────────────────────────────────────────────
  // VILLAS — Private Pool & Yard
  // ─────────────────────────────────────────────────────
  {
    name: "One Bedroom Villa",
    slug: "one-bedroom-villa",
    category: "Villa",
    tagline: "Your private villa of dreams",
    location: "Villa Estate",
    description:
      "With its private yard and private pool, this elegant villa is perfect for those looking for a tranquil escape.",
    intro:
      "Step into the villa of your dreams at Discovery Samal's luxurious One-Bedroom Villa. With its private yard, private pool, and stunning view of the villa amenity and Davao Gulf, this elegant and spacious villa is perfect for honeymooners looking for a romantic escape in a serene and tranquil environment, or solo travelers who are on a hunt to that splendid lifestyle. The bedroom features a plush king-sized bed with superior linens and the softest pillows. This villa is equipped with a smart TV, a mini-bar, and a full-set living room to enjoy a cup of coffee or tea as you savor the sweet villa life. The private pool is just a few steps away from your bedroom.",
    bedType: "King-sized bed",
    minGuests: 1,
    maxGuests: 3,
    capacity: 3,
    occupancy: 2,
    pricePerNight: 41140,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Private Pool",
      "Private Yard",
      "Davao Gulf View",
      "Villa Amenity Pool Access",
      "Full Living Room",
      "Superior Linens",
      "Plush Pillows",
    ],
    images: [
      `${CDN}/wijpeg-d2yei7hsfwpzuvq4912gh7u07/14-villa-one-bedroom-0001-7m-1_wide.jpg`,
      `${CDN}/wijpeg-4u6ghewve5huk2qqjhkqslh6y/one-bedroom-villa-living-area_wide.jpg`,
      `${CDN}/wijpeg-9yvifouodjsg43ggk02pp2k63/14-villa-one-bedroom-0004-7ms00942-11zon-min-1-70_wide.jpg`,
      `${CDN}/wijpeg-34x80d2n26osb9vjatru8gj2f/one-bedroom-villa-bathroom_wide.jpg`,
    ],
    available: true,
  },

  {
    name: "Two Bedroom Villa",
    slug: "two-bedroom-villa",
    category: "Villa",
    tagline: "Where comfort, relaxation, and luxury come together",
    location: "Villa Estate",
    description:
      "With impressive accommodations and stunning views, this villa is where comfort and luxury come together.",
    intro:
      "Impressive accommodations with an abundance of posh amenities — the Two-Bedroom Villa is where comfort, relaxation, and luxury come together. From the main door, guests are welcomed with the open floor plan of the dining and living room, with the extension of the private terrace. A few steps and you're in your private pool for a dip under the glistening sun. The villa houses a master bedroom and a guest room, both with garden and ocean views. Large windows that serve as pathways to the garden bring illumination from the natural light, altogether creating a warm and welcoming ambiance at every corner. Pair that with the luxurious linens, smart TV in every room, and opulent spaces for your utmost comfort.",
    bedType: "King-sized bed (master) + Queen-sized bed (guest room)",
    minGuests: 1,
    maxGuests: 4,
    capacity: 4,
    occupancy: 4,
    pricePerNight: 70083,
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "Private Pool",
      "Private Terrace",
      "Garden View",
      "Ocean View",
      "Open Floor Plan",
      "Dining Area",
      "Full Living Room",
      "Luxurious Linens",
    ],
    images: [
      `${CDN}/wijpeg-aiz03nlmni81qusxjobzuofw2/two-bedrom-villa_wide.jpg`,
      `${CDN}/wijpeg-ev5lloxguvr01njwvwn3lzay9/15-villa-two-bedroom-0015-7m_wide.jpg`,
      `${CDN}/wijpeg-bjzp5lahaonb3hmf2xfog47qb/two-bedroom-villa-king-bed_wide.jpg`,
      `${CDN}/wijpeg-e1g86z426nc5tb38o4v495vm0/two-bedroom-villa-twin-bed_wide.jpg`,
      `${CDN}/wijpeg-6uxtpx13ev8ys6d14og8m02j0/two-bedroom-villa-bathroom_wide.jpg`,
    ],
    available: true,
  },

  {
    name: "Three Bedroom Villa",
    slug: "three-bedroom-villa",
    category: "Villa",
    tagline: "The most lavish accommodation in the estate",
    location: "Villa Estate — Top of the Beach Club",
    description:
      "Perched on top of the beach club, this sprawling villa is the most lavish accommodation in the estate.",
    intro:
      "Perched on top of the beach club, and tucked on the side for ultimate privacy, this sprawling villa is the most lavish accommodation in the estate with bedrooms each with its distinct orientation and luxuries. The master bedroom is detached from the others, providing complete privacy and seclusion. It has its private dip pool and an enormous bathroom for his and hers with glass walls for that outdoor shower feel. The two other rooms both feature floor-to-ceiling windows that when wide opened, the fresh ocean breeze comes in. Dine with family, friends, and other guests with the ten-seater standalone dining room perfect for private dining. The accommodation also features a separate living room with glass doors opening the pathway to the outdoor deck for al fresco dining and lazing on the lounge beds. It boasts the biggest L-shaped private plunge pool in the entire estate, with the most breathtaking and unobstructed view of the Davao Gulf, Davao City, and the whole estate.",
    bedType: "1 Master Suite + 2 King-sized bedrooms",
    minGuests: 2,
    maxGuests: 6,
    capacity: 6,
    occupancy: 6,
    pricePerNight: 120000,
    note: "Price on request. Contact reservations@discoverysamal.com for exclusive rates.",
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "L-Shaped Private Plunge Pool",
      "Private Master Dip Pool",
      "10-Seater Private Dining Room",
      "Separate Living Room",
      "Outdoor Deck",
      "Al Fresco Dining",
      "Floor-to-Ceiling Windows",
      "Glass-Walled Bathroom",
      "Unobstructed Davao Gulf View",
      "Davao City View",
      "Panoramic Estate View",
    ],
    images: [
      `${CDN}/wijpeg-3bxkz5nvh6l0wnybzlbjqmlrq/aerial-shot-of-three-bedroom-villa_wide.jpg`,
      `${CDN}/wijpeg-7ergalxhkol3d96h59o3fgidj/three-bedroom-villa-dining-area_wide.jpg`,
      `${CDN}/wijpeg-7fc2hgqv7p0h4wub01bohz2pd/three-bedroom-villa-bathroom_wide.jpg`,
    ],
    available: true,
  },

  // ─────────────────────────────────────────────────────
  // GRAND SIGNATURE SUITE — Pinnacle
  // ─────────────────────────────────────────────────────
  {
    name: "Grand Signature Suite",
    slug: "grand-signature-suite",
    category: "Presidential",
    tagline: "The pinnacle of opulence",
    location: "Villa Estate — Pinnacle Level",
    description:
      "Nestled at the pinnacle of opulence, our Grand Signature Suite is a sanctuary of sophistication, offering an unrivaled fusion of comfort and grandeur.",
    intro:
      "Spanning a palatial expanse, this 4-bedroom suite is the epitome of luxurious living, where every detail is meticulously crafted to ensure an exclusive retreat for those with discerning taste. As you step through the doors, you are greeted by the warm embrace of bespoke interiors that blend contemporary elegance with touches of local artistry. The expansive living and dining area unfolds into a panorama of breathtaking views, where the azure embrace of the ocean meets the vibrant tapestry of Davao City's lights twinkling in the distance. The dining area, serviced by our gourmet chefs, sets the stage for memorable feasts. Each bedroom is a private haven, designed with sumptuous bedding, plush furnishings, and state-of-the-art amenities. The suite's expansive balconies offer a front-row seat to the theater of the sea and sky.",
    bedType: "4 King-sized bedrooms",
    minGuests: 2,
    maxGuests: 8,
    capacity: 8,
    occupancy: 8,
    pricePerNight: 180000,
    note: "Price on request. Contact reservations@discoverysamal.com for exclusive rates.",
    features: [
      "Air Conditioning",
      "Free WiFi",
      "Smart TV",
      "Minibar",
      "Safety Deposit Box",
      "Daily Housekeeping",
      "4 Private Bedrooms",
      "Panoramic Ocean Views",
      "Expansive Living & Dining Area",
      "Gourmet Dining Service",
      "Spacious Balconies",
      "Bespoke Interiors",
      "Local Artistry Accents",
      "Davao City Skyline Views",
      "Butler Service",
      "Premium Concierge",
    ],
    images: [
      `${CDN}/wijpeg-9xv7hnl5z1z0wwdd1achiybea/cam05149-hdr-copy_wide.jpg`,
      `${CDN}/wijpeg-rpd9skgvwdrietq8ay07ascu/cam05185-hdr-copy_wide.jpg`,
      `${CDN}/wijpeg-7qyzdg4ttt2kov2hgqclomm1k/cam04967-hdr-copy_wide.jpg`,
      `${CDN}/wijpeg-ahuaxv7x7mq8yiri8vntspebp/cam05009-hdr-copy_wide.jpg`,
      `${CDN}/wijpeg-buwqz3xt8sxomnir1govjmved/cam04963-hdr-copy_wide.jpg`,
      `${CDN}/wijpeg-cmts1ncpbq919ie4sou41aymr/cam05023-hdr-copy_wide.jpg`,
    ],
    available: true,
  },
];

module.exports = rooms;
