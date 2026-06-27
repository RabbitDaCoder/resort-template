const { z } = require("zod");

const createRoomSchema = z
  .object({
    name: z.string().trim().min(1, "Room name is required").max(200),
    description: z.string().trim().min(1, "Description is required").max(2000),
    minGuests: z.coerce.number().int().min(1).max(50),
    capacity: z.coerce.number().int().min(1).max(100).optional(),
    occupancy: z.coerce.number().int().min(1).max(100).optional(),
    size: z.string().trim().max(50).optional(),
    bedType: z.string().trim().max(200).optional(),
    pricePerNight: z.coerce.number().min(0),
    discountPrice: z.coerce.number().min(0).optional(),
    discountLabel: z.string().trim().max(50).optional(),
    weekendPrice: z.coerce.number().min(0).optional(),
    features: z.string().optional(),
    category: z.enum([
      "Standard",
      "Deluxe",
      "Premier",
      "Loft",
      "Annex",
      "Villa",
      "Dormitory",
      "Cabin",
    ]),
    maxGuests: z.coerce.number().int().min(1).max(50),
    available: z.string().optional(),
  })
  .refine((data) => data.maxGuests >= data.minGuests, {
    path: ["maxGuests"],
    message: "Max guests must be greater than or equal to min guests",
  });

const updatePriceSchema = z.object({
  pricePerNight: z.coerce.number().min(0),
  weekendPrice: z.coerce.number().min(0).optional(),
});

module.exports = { createRoomSchema, updatePriceSchema };
