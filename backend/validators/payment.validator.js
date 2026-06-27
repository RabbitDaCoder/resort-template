const { z } = require("zod");

const updatePaymentDetailsSchema = z.object({
  bankName: z.string().trim().min(1, "Bank name is required").max(200),
  accountName: z.string().trim().min(1, "Account name is required").max(200),
  accountNumber: z.string().trim().min(1, "Account number is required").max(50),
  instructions: z.string().trim().max(2000).optional().default(""),
  gcashName: z.string().trim().max(200).optional().default(""),
  gcashNumber: z.string().trim().max(20).optional().default(""),
  gcashInstructions: z.string().trim().max(2000).optional().default(""),
});

module.exports = { updatePaymentDetailsSchema };
