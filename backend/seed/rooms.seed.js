const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const https = require("https");
const http = require("http");
const Room = require("../models/Room");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Download image from URL and upload to Cloudinary
async function uploadFromUrl(url, publicId) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    client
      .get(url, (response) => {
        if (
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          // Follow redirect
          return uploadFromUrl(response.headers.location, publicId)
            .then(resolve)
            .catch(reject);
        }
        if (response.statusCode !== 200) {
          return reject(
            new Error(`Failed to download ${url}: ${response.statusCode}`),
          );
        }
        const chunks = [];
        response.on("data", (chunk) => chunks.push(chunk));
        response.on("end", () => {
          const buffer = Buffer.concat(chunks);
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "discoverysamal-resort/rooms",
              public_id: publicId,
              resource_type: "image",
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result.secure_url);
            },
          );
          stream.end(buffer);
        });
        response.on("error", reject);
      })
      .on("error", reject);
  });
}

const roomsData = [
  {
    name: "Premier Room",
    slug: "premier-room",
    category: "Premier",
    description:
      "A comfortable and spacious premier room perfect for small groups. Features a double sized bed and a semi double sized bed with modern amenities and a relaxing beach resort atmosphere.",
    occupancy: 3,
    size: "35 sqm",
    bedType: "1 Double sized and 1 Semi Double sized",
    maxGuests: 3,
    pricePerNight: 11550,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/premier-room-1.jpg",
    imageId: "premier-room",
  },
  {
    name: "Premier Loft Room",
    slug: "premier-loft-room",
    category: "Loft",
    description:
      "A spacious loft room ideal for families or groups of up to 7. Features a double sized bed and 5 semi double sized beds across two levels. Perfect for a fun group getaway by the beach.",
    occupancy: 7,
    size: "35 sqm",
    bedType: "1 Double sized and 5 Semi Double sized",
    maxGuests: 7,
    pricePerNight: 19900,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Loft Layout",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/PREMIERLOFTT.PNG",
    imageId: "premier-loft",
  },
  {
    name: "Annex",
    slug: "annex",
    category: "Annex",
    description:
      "A cozy and comfortable annex room for couples or small groups. Features 2 semi double beds in a well-maintained private space with easy access to the resort facilities.",
    occupancy: 2,
    size: "24 sqm",
    bedType: "2 Semi Double",
    maxGuests: 2,
    pricePerNight: 8500,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/annex1.jpg",
    imageId: "annex",
  },
  {
    name: "Annex Loft Room",
    slug: "annex-loft-room",
    category: "Loft",
    description:
      "A two-level annex loft room that fits up to 7 guests comfortably. Features 6 semi double beds spread across both levels. Great for barkada trips and family reunions.",
    occupancy: 7,
    size: "35 sqm",
    bedType: "6 Semi Double",
    maxGuests: 7,
    pricePerNight: 17800,
    features: [
      "Air Conditioning",
      "Shared Bathroom",
      "Free WiFi",
      "Loft Layout",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/annexloft2.jpg",
    imageId: "annex-loft",
  },
  {
    name: "Annex Dorm",
    slug: "annex-dorm",
    category: "Dormitory",
    description:
      "A dormitory-style annex room with bunk beds for up to 6 guests. Ideal for budget-conscious groups who want to enjoy the beach without compromising on comfort and cleanliness.",
    occupancy: 6,
    size: "35 sqm",
    bedType: "3 Bunk Beds",
    maxGuests: 6,
    pricePerNight: 13300,
    features: [
      "Fan Cooling",
      "Shared Bathroom",
      "Free WiFi",
      "Bunk Beds",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/anndorm1.jpg",
    imageId: "annex-dorm",
  },
  {
    name: "Dormitory Room",
    slug: "dormitory-room",
    category: "Dormitory",
    description:
      "A large dormitory room that accommodates up to 14 guests. Perfect for large groups, team outings, or budget group travel. Features 7 double deck beds in a clean and well-maintained space.",
    occupancy: 14,
    size: "35 sqm",
    bedType: "7 Double Decks",
    maxGuests: 14,
    pricePerNight: 27200,
    features: [
      "Fan Cooling",
      "Shared Bathroom",
      "Free WiFi",
      "Double Deck Beds",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/DORM1.JPG",
    imageId: "dormitory",
  },
  {
    name: "Premier Deluxe",
    slug: "premier-deluxe",
    category: "Deluxe",
    description:
      "A deluxe premier room for up to 4 guests featuring a double bed and 2 wide single beds. Upgraded amenities and finishes make this one of the most comfortable rooms in the resort.",
    occupancy: 4,
    size: "35 sqm",
    bedType: "1 double bed and 2 wide single beds",
    maxGuests: 4,
    pricePerNight: 12600,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Beach Access",
      "Daily Housekeeping",
      "Deluxe Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/Premier-Deluxe-1.jpg",
    imageId: "premier-deluxe",
  },
  {
    name: "Annex Deluxe",
    slug: "annex-deluxe",
    category: "Deluxe",
    description:
      "A deluxe annex room with 3 semi double beds for up to 3 guests. Upgraded from the standard annex with better finishes and more comfortable amenities in a cozy 24 sqm space.",
    occupancy: 3,
    size: "24 sqm",
    bedType: "3 Semi Double",
    maxGuests: 3,
    pricePerNight: 9600,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Beach Access",
      "Daily Housekeeping",
      "Deluxe Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/anndelu2.jpg",
    imageId: "annex-deluxe",
  },
  {
    name: "Cabin 1",
    slug: "cabin-1",
    category: "Cabin",
    description:
      "A charming cabin accommodation for 2 guests featuring 2 semi double beds. Set in a natural cabin-style structure surrounded by trees, offering a unique and peaceful resort experience.",
    occupancy: 2,
    size: "26 sqm",
    bedType: "2 Semi Double",
    maxGuests: 2,
    pricePerNight: 9600,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Cabin Style",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/cabin.jpg",
    imageId: "cabin-1",
  },
  {
    name: "Cabin 2",
    slug: "cabin-2",
    category: "Cabin",
    description:
      "A larger cabin room for up to 4 guests featuring 1 semi double bed and 1 double deck. Perfect for families or groups who prefer the natural cabin atmosphere over standard hotel rooms.",
    occupancy: 4,
    size: "26 sqm",
    bedType: "1 Semi Double 1 Double Deck",
    maxGuests: 4,
    pricePerNight: 10600,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Cabin Style",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/CABINSE.PNG",
    imageId: "cabin-2",
  },
  {
    name: "Private Villa",
    slug: "private-villa",
    category: "Villa",
    description:
      "The crown jewel of Discovery Samal Resort. A massive 130 sqm private villa that accommodates up to 10 guests. Featuring a full private living space, multiple rooms, and exclusive beach access. Perfect for special occasions and luxury group getaways.",
    occupancy: 10,
    size: "130 sqm",
    bedType: "Multiple beds — villa layout",
    maxGuests: 10,
    pricePerNight: 40000,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Private Villa",
      "Exclusive Beach Access",
      "Full Living Space",
      "Daily Housekeeping",
      "Premium Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/PRIVATEVILLA.PNG",
    imageId: "private-villa",
  },
  {
    name: "Standard Room",
    slug: "standard-room",
    category: "Standard",
    description:
      "A clean and comfortable standard room for up to 4 guests featuring 2 double beds. A great value option for families or groups who want a no-frills but well-maintained beach resort experience.",
    occupancy: 4,
    bedType: "2 Double Beds",
    maxGuests: 4,
    pricePerNight: 12500,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Beach Access",
      "Daily Housekeeping",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/STAND1.JPG",
    imageId: "standard-room",
  },
  {
    name: "Ipil Deluxe",
    slug: "ipil-deluxe",
    category: "Deluxe",
    description:
      "A premium deluxe room featuring 2 queen size beds for up to 4 guests. Named after the Ipil tree native to the Philippines, this room blends natural resort charm with upgraded comfort and modern amenities.",
    occupancy: 4,
    bedType: "2 Queen Size Beds",
    maxGuests: 4,
    pricePerNight: 14500,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Queen Size Beds",
      "Beach Access",
      "Daily Housekeeping",
      "Deluxe Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/Ipil1.JPG",
    imageId: "ipil-deluxe",
  },
  {
    name: "Triple Deluxe",
    slug: "triple-deluxe",
    category: "Deluxe",
    description:
      "A generous triple deluxe room featuring 3 queen size beds for up to 4 guests. One of the most spacious standard room options at the resort, offering premium comfort for groups who want extra space and quality beds.",
    occupancy: 4,
    bedType: "3 Queen Size Beds",
    maxGuests: 4,
    pricePerNight: 18500,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Queen Size Beds",
      "Beach Access",
      "Daily Housekeeping",
      "Deluxe Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/TRIDEL1.JPG",
    imageId: "triple-deluxe",
  },
  {
    name: "Loft Deluxe",
    slug: "loft-deluxe",
    category: "Loft",
    description:
      "A spacious loft deluxe room for up to 8 guests featuring 1 queen size bed and 6 single beds across two levels. A perfect blend of luxury and capacity for large groups who want upgraded comfort in a fun loft-style layout.",
    occupancy: 8,
    bedType: "1 Queen Size and 6 Single Beds",
    maxGuests: 8,
    pricePerNight: 26000,
    features: [
      "Air Conditioning",
      "Private Bathroom",
      "Free WiFi",
      "Loft Layout",
      "Queen Size Bed",
      "Beach Access",
      "Daily Housekeeping",
      "Deluxe Amenities",
    ],
    imageUrl: "https://laluzbeachresortandspa.com/images/LOFT.PNG",
    imageId: "loft-deluxe",
  },
];

async function seedRooms() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const existingCount = await Room.countDocuments();
    if (existingCount > 0) {
      console.log(`Found ${existingCount} existing rooms. Clearing...`);
      await Room.deleteMany({});
      console.log("Cleared existing rooms");
    }

    console.log("\nUploading images to Cloudinary...\n");

    const rooms = [];
    for (const room of roomsData) {
      const { imageUrl, imageId, ...roomFields } = room;
      let imageCloudUrl;
      try {
        imageCloudUrl = await uploadFromUrl(imageUrl, imageId);
        console.log(`  Uploaded: ${room.name}`);
      } catch (err) {
        console.error(
          `  Failed to upload image for ${room.name}: ${err.message}`,
        );
        imageCloudUrl = imageUrl; // Fallback to original URL
      }
      rooms.push({ ...roomFields, images: [imageCloudUrl], available: true });
    }

    const inserted = await Room.insertMany(rooms);
    console.log(`\nSeeded ${inserted.length} rooms successfully\n`);

    inserted.forEach((r) =>
      console.log(
        `  ${r.name} — ${r.category} — P${r.pricePerNight.toLocaleString()}`,
      ),
    );

    await mongoose.disconnect();
    console.log("\nDone. Disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seedRooms();
