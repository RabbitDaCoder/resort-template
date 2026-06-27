const Discount = require("../models/Discount");

function normalizeDate(value, fallback = new Date()) {
  if (!value) return fallback;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? fallback : date;
}

function getNights(checkIn, checkOut) {
  const start = normalizeDate(checkIn);
  const end = normalizeDate(checkOut, start);
  const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff || 1);
}

function buildDiscountLabel(discount) {
  return (
    discount.label ||
    (discount.type === "percentage"
      ? `${discount.value}% OFF`
      : `₱${discount.value} OFF/night`)
  );
}

function getDiscountAmountPerNight(originalPrice, discount) {
  if (!discount) return 0;
  if (discount.type === "percentage") {
    return originalPrice * (discount.value / 100);
  }
  return discount.value;
}

function getDiscountedNightlyPrice(originalPrice, discount) {
  return Math.max(
    0,
    originalPrice - getDiscountAmountPerNight(originalPrice, discount),
  );
}

function appliesToRoom(discount, room, nights) {
  if (!discount.active) return false;
  if (nights < (discount.minimumNights || 1)) return false;

  if (discount.appliesTo === "all") return true;

  if (discount.appliesTo === "specific_rooms") {
    return (discount.rooms || [])
      .map((id) => id.toString())
      .includes(room._id.toString());
  }

  if (discount.appliesTo === "categories") {
    return (discount.categories || []).includes(room.category);
  }

  return false;
}

async function getActiveDiscounts(onDate = new Date()) {
  const date = normalizeDate(onDate);
  return Discount.find({
    active: true,
    startDate: { $lte: date },
    endDate: { $gte: date },
  }).lean();
}

function chooseBestDiscount(discounts, room, options = {}) {
  const nights = getNights(options.checkIn, options.checkOut);
  const originalPrice = Number(room.pricePerNight || 0);
  if (!originalPrice || !Array.isArray(discounts) || discounts.length === 0) {
    return null;
  }

  let bestDiscount = null;
  let bestSavings = 0;

  for (const discount of discounts) {
    if (!appliesToRoom(discount, room, nights)) continue;

    const savings = getDiscountAmountPerNight(originalPrice, discount);
    if (savings > bestSavings) {
      bestSavings = savings;
      bestDiscount = discount;
    }
  }

  return bestDiscount;
}

async function getRoomPricing(room, options = {}) {
  const originalPrice = Number(room.pricePerNight || 0);
  const discounts =
    options.discounts || (await getActiveDiscounts(options.checkIn));
  const activeDiscount = chooseBestDiscount(discounts, room, options);

  if (activeDiscount) {
    return {
      originalPrice,
      effectivePrice: Math.round(
        getDiscountedNightlyPrice(originalPrice, activeDiscount),
      ),
      discountPrice: Math.round(
        getDiscountedNightlyPrice(originalPrice, activeDiscount),
      ),
      discountLabel: buildDiscountLabel(activeDiscount),
      activeDiscount,
      hasDiscount: true,
      source: "rule",
    };
  }

  if (
    options.includeLegacyFallback !== false &&
    room.discountPrice &&
    Number(room.discountPrice) > 0 &&
    Number(room.discountPrice) < originalPrice
  ) {
    return {
      originalPrice,
      effectivePrice: Number(room.discountPrice),
      discountPrice: Number(room.discountPrice),
      discountLabel: room.discountLabel || "Special Offer",
      activeDiscount: null,
      hasDiscount: true,
      source: "legacy",
    };
  }

  return {
    originalPrice,
    effectivePrice: originalPrice,
    discountPrice: null,
    discountLabel: null,
    activeDiscount: null,
    hasDiscount: false,
    source: null,
  };
}

async function enrichRoom(room, options = {}) {
  const baseRoom = room?.toObject ? room.toObject() : { ...room };
  const pricing = await getRoomPricing(baseRoom, options);

  return {
    ...baseRoom,
    originalPricePerNight: pricing.originalPrice,
    effectivePricePerNight: pricing.effectivePrice,
    discountPrice: pricing.discountPrice,
    discountLabel: pricing.discountLabel,
    hasDiscount: pricing.hasDiscount,
  };
}

async function enrichRooms(rooms, options = {}) {
  const discounts = await getActiveDiscounts(options.checkIn);
  return Promise.all(
    rooms.map((room) => enrichRoom(room, { ...options, discounts })),
  );
}

exports.getActiveDiscount = async (
  roomId,
  category,
  checkIn,
  checkOut,
  basePrice,
) => {
  const discounts = await getActiveDiscounts(checkIn);
  return chooseBestDiscount(
    discounts,
    { _id: roomId, category, pricePerNight: basePrice || 0 },
    { checkIn, checkOut },
  );
};

exports.applyDiscount = (originalPrice, discount, nights) => {
  if (!discount)
    return {
      originalTotal: originalPrice * nights,
      discountedTotal: originalPrice * nights,
      discountAmount: 0,
      discountLabel: null,
    };

  const total = originalPrice * nights;
  const discountedTotal = Math.max(
    0,
    getDiscountedNightlyPrice(originalPrice, discount) * nights,
  );
  const discountAmount = total - discountedTotal;

  return {
    originalTotal: Math.round(total),
    discountedTotal: Math.round(discountedTotal),
    discountAmount: Math.round(discountAmount),
    discountLabel: buildDiscountLabel(discount),
    discountId: discount._id,
    discountName: discount.name,
  };
};

exports.getRoomPricing = getRoomPricing;
exports.enrichRoom = enrichRoom;
exports.enrichRooms = enrichRooms;
