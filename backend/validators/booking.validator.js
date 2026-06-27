const { z } = require("zod");

const createBookingSchema = z.object({
  guestName: z.string().trim().min(1, "Guest name is required").max(100),
  guestEmail: z.string().trim().email("Invalid email address"),
  guestPhone: z.string().trim().min(1, "Phone number is required").max(20),
  numberOfGuests: z.coerce.number().int().min(1).max(50),
  specialRequests: z.string().trim().max(1000).optional().default(""),
  room: z.string().min(1, "Room ID is required"),
  checkIn: z.string().min(1, "Check-in date is required"),
  checkOut: z.string().min(1, "Check-out date is required"),
});

const checkAvailabilitySchema = z.object({
  checkIn: z.string().min(1),
  checkOut: z.string().min(1),
  roomId: z.string().optional(),
});

const updateBookingStatusSchema = z.object({
  status: z.enum(["confirmed", "cancelled"], {
    errorMap: () => ({ message: "Status must be confirmed or cancelled" }),
  }),
});

const sendReceiptSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
});

module.exports = {
  createBookingSchema,
  checkAvailabilitySchema,
  updateBookingStatusSchema,
  sendReceiptSchema,
};
