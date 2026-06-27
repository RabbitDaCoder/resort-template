/**
 * Discovery Samal Resort — Global Resort Inclusions & Policies
 *
 * Single source of truth for resort-wide booking inclusions and guest policies.
 * All room cards, room detail pages, booking flows and SEO surfaces should
 * import from here instead of duplicating arrays.
 *
 * Mirrors the `_meta.globalInclusions`, `_meta.extraGuestPolicy` and
 * `_meta.discountSystem` blocks in /rooms.json (kept in sync intentionally
 * so the backend seeder and frontend share the same vocabulary).
 */

export const RESORT_ADDRESS =
  "Samal Island, Island Garden City of Samal, Davao del Norte, Philippines";

export const RESORT_ADDRESS_SHORT = "Samal Island, Davao del Norte";

export const RESORT_MAP_QUERY =
  "Samal+Island+Island+Garden+City+of+Samal+Davao+del+Norte";

export const RESORT_MAP_EMBED_URL = `https://www.google.com/maps?q=${RESORT_MAP_QUERY}&output=embed`;

export const RESORT_MAP_DIRECTIONS_URL = `https://www.google.com/maps?q=${RESORT_MAP_QUERY}`;

/**
 * Inclusions that apply to EVERY room booking.
 * Use these in room cards, booking summaries and policy pages.
 */
export const GLOBAL_RESORT_INCLUSIONS = [
  "Breakfast (Included)",
  "Roundtrip Davao Airport transfer",
  "Unlimited bottomless drinks during meals",
  "Exclusive access to swimming pool",
  "Beachfront access",
  "Multipurpose Pavilion access",
  "Free parking",
  "Free WiFi",
  "Pet friendly",
];

/**
 * Categorised version for richer UI layouts (icons, grids, columns).
 */
export const GLOBAL_RESORT_INCLUSIONS_DETAILED = [
  {
    key: "meals",
    icon: "Utensils",
    title: "Breakfast Included",
    description: "Complimentary breakfast buffet daily.",
  },
  {
    key: "drinks",
    icon: "GlassWater",
    title: "Bottomless Drinks",
    description: "Unlimited beverages during meal service.",
  },
  {
    key: "transfer",
    icon: "Plane",
    title: "Airport Transfers",
    description: "Roundtrip transfers from Francisco Bangoy International Airport, Davao City.",
  },
  {
    key: "pool",
    icon: "Waves",
    title: "Swimming Pool",
    description: "Exclusive access to the resort pool.",
  },
  {
    key: "beach",
    icon: "Sun",
    title: "Beachfront Access",
    description: "Direct beachfront access on Samal Island.",
  },
  {
    key: "pavilion",
    icon: "LandPlot",
    title: "Multipurpose Pavilion",
    description: "Reserved access for resort guests.",
  },
  {
    key: "wifi",
    icon: "Wifi",
    title: "Free WiFi",
    description: "Property-wide high-speed connectivity.",
  },
  {
    key: "parking",
    icon: "ParkingCircle",
    title: "Free Parking",
    description: "On-site parking included.",
  },
  {
    key: "pet",
    icon: "PawPrint",
    title: "Pet Friendly",
    description: "Travel with your companion — pets welcome.",
  },
];

/**
 * Extra guest policy applied at booking-time and shown on room cards.
 */
export const EXTRA_GUEST_POLICY = {
  extraAdultRate: 1500,
  currency: "PHP",
  extraAdultLine:
    "₱1,500 per person per night beyond the room's base capacity (includes full board meals).",
  kidsFreeAge: 6,
  kidsFreeLine: "Kids aged 6 and below stay FREE — including full board meals.",
};

/**
 * Marketing discount system — generates the slashed "published" price client-side.
 *
 *   currentPrice = 4000  (real client selling price)
 *   oldPrice     = 8000  (currentPrice × 2)
 *   discount     = 50%   (permanent marketing badge)
 */
export const DISCOUNT_SYSTEM = {
  percentage: 50,
  label: "50% OFF",
  multiplier: 2,
};

/**
 * Derive marketing pricing from a real selling price.
 * Returns a stable shape used by RoomCard / BookingSummary / SEO.
 */
export function deriveRoomPricing(currentPrice) {
  const current = Number(currentPrice) || 0;
  const old = current * DISCOUNT_SYSTEM.multiplier;
  return {
    currentPrice: current,
    oldPrice: old,
    discountPercentage: DISCOUNT_SYSTEM.percentage,
    discountLabel: DISCOUNT_SYSTEM.label,
    savings: old - current,
  };
}

/**
 * Format peso amount with `₱` prefix and locale separators.
 */
export function formatPeso(value) {
  const n = Number(value) || 0;
  return `₱${n.toLocaleString("en-PH")}`;
}

/**
 * Resolve a room's display pricing from any of the supported field shapes
 * (client schema, legacy seeder schema, backend Room model).
 */
export function resolveRoomPricing(room = {}) {
  // Prefer explicit client fields.
  if (room.currentPrice != null) {
    return {
      currentPrice: Number(room.currentPrice),
      oldPrice: Number(room.oldPrice ?? room.currentPrice * 2),
      discountPercentage: Number(room.discountPercentage ?? 50),
      discountLabel: room.discountLabel || "50% OFF",
      savings:
        Number(room.oldPrice ?? room.currentPrice * 2) -
        Number(room.currentPrice),
    };
  }

  // Backend Room model fallback (pricePerNight + discountPrice).
  if (room.discountPrice && room.pricePerNight) {
    const current = Number(room.discountPrice);
    const old = Number(room.pricePerNight);
    return {
      currentPrice: current,
      oldPrice: old,
      discountPercentage: Math.round(((old - current) / old) * 100),
      discountLabel: room.discountLabel || "50% OFF",
      savings: old - current,
    };
  }

  const flat = Number(room.pricePerNight || room.bestRate || 0);
  return {
    currentPrice: flat,
    oldPrice: flat,
    discountPercentage: 0,
    discountLabel: "",
    savings: 0,
  };
}

const _exports = {
  RESORT_ADDRESS,
  RESORT_ADDRESS_SHORT,
  RESORT_MAP_QUERY,
  RESORT_MAP_EMBED_URL,
  RESORT_MAP_DIRECTIONS_URL,
  GLOBAL_RESORT_INCLUSIONS,
  GLOBAL_RESORT_INCLUSIONS_DETAILED,
  EXTRA_GUEST_POLICY,
  DISCOUNT_SYSTEM,
  deriveRoomPricing,
  resolveRoomPricing,
  formatPeso,
};

export default _exports;
