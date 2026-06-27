const cron = require("node-cron");
const Booking = require("../models/Booking");
const emailService = require("../services/emailService");
const logger = require("../config/logger");

const AUTO_CANCEL_HOURS = 48;

async function processReminders() {
  try {
    const unpaidBookings = await Booking.find({
      paymentStatus: "unpaid",
      status: "pending",
    }).populate("room", "name pricePerNight");

    for (const booking of unpaidBookings) {
      const hoursSinceBooking =
        (Date.now() - new Date(booking.createdAt).getTime()) / (1000 * 60 * 60);

      // Auto-cancel after 48 hours unpaid
      if (hoursSinceBooking >= AUTO_CANCEL_HOURS) {
        booking.status = "cancelled";
        await booking.save();
        logger.info({
          message: "Booking auto-cancelled (48h unpaid)",
          bookingRef: booking.bookingRef,
        });
        continue;
      }

      // 24-hour final reminder
      if (hoursSinceBooking >= 24 && !booking.reminderEmails.secondSent) {
        const result = await emailService.sendPaymentReminder(booking, 24);
        if (result.success) {
          booking.reminderEmails.secondSent = true;
          await booking.save();
          logger.info({
            message: "24h payment reminder sent",
            bookingRef: booking.bookingRef,
          });
        }
        continue;
      }

      // 1-hour reminder
      if (hoursSinceBooking >= 1 && !booking.reminderEmails.firstSent) {
        const result = await emailService.sendPaymentReminder(booking, 1);
        if (result.success) {
          booking.reminderEmails.firstSent = true;
          await booking.save();
          logger.info({
            message: "1h payment reminder sent",
            bookingRef: booking.bookingRef,
          });
        }
      }
    }
  } catch (err) {
    logger.error({ message: "Reminder job failed", error: err.message });
  }
}

function startReminderJob() {
  // Run 5 times daily: 6 AM, 10 AM, 2 PM, 6 PM, 10 PM
  cron.schedule("0 6,10,14,18,22 * * *", () => {
    logger.info({ message: "Running payment reminder job" });
    processReminders();
  });

  logger.info({
    message:
      "Payment reminder cron job registered (5x daily: 6AM, 10AM, 2PM, 6PM, 10PM)",
  });
}

module.exports = { startReminderJob, processReminders };
