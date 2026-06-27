const { z } = require("zod");

const discountSchema = z
  .object({
    name: z.string().trim().min(1, "Discount name is required").max(200),
    label: z.string().trim().max(100).optional().or(z.literal("")),
    type: z.enum(["percentage", "fixed"]),
    value: z.coerce.number().positive("Discount value must be greater than 0"),
    appliesTo: z.enum(["all", "specific_rooms", "categories"]).default("all"),
    rooms: z.array(z.string().min(1)).optional().default([]),
    categories: z.array(z.string().min(1)).optional().default([]),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    minimumNights: z.coerce.number().int().min(1).default(1),
    active: z.boolean().optional().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.type === "percentage" && data.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "Percentage discount cannot exceed 100",
      });
    }

    if (data.startDate > data.endDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "End date must be on or after start date",
      });
    }

    if (data.appliesTo === "specific_rooms" && data.rooms.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["rooms"],
        message: "Select at least one room for a room-specific discount",
      });
    }

    if (data.appliesTo === "categories" && data.categories.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categories"],
        message: "Select at least one category for a category discount",
      });
    }
  });

module.exports = {
  createDiscountSchema: discountSchema,
  updateDiscountSchema: discountSchema,
};
