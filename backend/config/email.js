const nodemailer = require("nodemailer");
const generateReceipt = require("../utils/generateReceipt");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.zoho.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const fromAddress =
  process.env.EMAIL_FROM ||
  `"Discovery Samal Resort" <${
    process.env.SMTP_USER ||
    process.env.RESORT_EMAIL ||
    "reservations@discoverysamal-resort.org"
  }>";

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatCurrency = (amount) =>
  `₱${Number(amount || 0).toLocaleString("en-PH")}`;

const optionalEnv = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "null") return null;
  return normalized;
};

// ── Shared email wrapper ────────────────────────────────
const emailShell = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #2c2a26; background-color: #F5F4F0; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #C4A882; }
    .logo { font-size: 26px; font-weight: 400; color: #2C4A2E; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .tagline { font-size: 11px; color: #6B7C3E; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px; }
    .content { background: #ffffff; padding: 40px; margin-top: 20px; border: 1px solid #e8e4dd; }
    .title { font-size: 22px; color: #2C4A2E; text-align: center; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #6B7C3E; font-size: 14px; margin-bottom: 30px; }
    .ref-box { background: #F5F4F0; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #e8e4dd; }
    .ref-label { font-size: 11px; color: #6B7C3E; letter-spacing: 2px; text-transform: uppercase; }
    .ref-number { font-size: 24px; font-weight: bold; color: #2C4A2E; font-family: 'Courier New', monospace; letter-spacing: 2px; margin-top: 8px; }
    .details { margin: 30px 0; }
    .detail-row { padding: 12px 0; border-bottom: 1px solid #e8e4dd; }
    .detail-label { color: #6B7C3E; font-size: 13px; display: inline-block; width: 140px; }
    .detail-value { color: #2c2a26; font-weight: 500; }
    .total-row { font-size: 16px; font-weight: bold; border-bottom: none; padding-top: 20px; }
    .btn { display: inline-block; background: #2C4A2E; color: #ffffff; padding: 14px 28px; text-decoration: none; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; }
    .footer { text-align: center; padding: 30px 0; color: #6B7C3E; font-size: 12px; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Discovery Samal Resort</h1>
      <p class="tagline">Your ultimate beachside playground</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p><strong>Need assistance?</strong></p>
      ${optionalEnv(process.env.RESORT_PHONE) ? `<p>📞 ${optionalEnv(process.env.RESORT_PHONE)}</p>` : ""}
      <p>✉️ ${optionalEnv(process.env.RESORT_EMAIL) || process.env.SMTP_USER || "reservations@discoverysamal-resort.org"}</p>
      <p>💬 <a href="${optionalEnv(process.env.FACEBOOK_PAGE_URL) || "https://www.facebook.com"}" style="color:#6B7C3E;">Visit us on Facebook</a></p>
      <p style="margin-top: 20px; color: #C4A882;">
        &copy; ${new Date().getFullYear()} Discovery Samal Resort. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

// ── 1. Guest booking confirmation email (sent when booking is created) ──
const sendBookingConfirmationToGuest = async (booking) => {
  const paymentUrl = `${process.env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:5173"}/booking/${booking._id}/payment`;

  const html = emailShell(`
    <h2 class="title">Booking Received</h2>
    <p class="subtitle">Thank you for choosing Discovery Samal Resort, ${booking.guestName}</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${booking.numberOfGuests}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:14px;">
      Please proceed with payment to confirm your reservation.
    </p>

    <div style="text-align:center; margin:25px 0;">
      <a href="${paymentUrl}" class="btn">Complete Payment</a>
    </div>
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Booking Received – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Guest booking email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// ── 2. Admin notification: new booking ──
const sendBookingNotification = async (booking) => {
  const html = emailShell(`
    <h2 class="title">New Booking Received</h2>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${booking.guestName}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${booking.guestEmail}</span></div>
      <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${booking.guestPhone || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Total</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <div style="text-align:center; margin-top:30px;">
      <a href="${process.env.CLIENT_URL}/owner/bookings" class="btn">View in Dashboard</a>
    </div>
  `);

  try {
    await transporter.sendMail({
      from: fromAddress,
      to: process.env.ADMIN_EMAIL,
      subject: `New Booking – ${booking.bookingRef} – ${booking.guestName}`,
      html,
    });
  } catch (error) {
    console.error("Admin booking notification failed:", error.message);
  }
};

// ── 3. Admin notification: payment proof uploaded (with PDF receipt attached) ──
const sendAdminPaymentAlert = async ({ booking, screenshotUrl }) => {
  const html = emailShell(`
    <h2 class="title">Payment Proof Received</h2>
    <p class="subtitle">A guest has uploaded payment for review</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${booking.guestName}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${booking.guestEmail}</span></div>
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <div style="text-align:center; margin:30px 0;">
      <p style="color:#6B7C3E; font-size:13px;">Payment Screenshot:</p>
      <a href="${screenshotUrl}"><img src="${screenshotUrl}" style="max-width:400px; border:1px solid #e8e4dd;" /></a>
    </div>

    <div style="background:#F5F4F0; padding:15px 20px; text-align:center; font-size:13px; color:#6B7C3E; margin-top:25px; border-radius:4px;">
      📎 The booking receipt is attached to this email as a PDF.
    </div>

    <div style="text-align:center; margin-top:20px;">
      <a href="${process.env.CLIENT_URL}/owner/payments" class="btn">Review Payment</a>
    </div>
  `);

  try {
    // Generate PDF receipt
    const pdfBuffer = await generateReceipt(booking);

    await transporter.sendMail({
      from: fromAddress,
      to: process.env.ADMIN_EMAIL,
      subject: `Payment Proof – ${booking.bookingRef} – ${booking.guestName}`,
      html,
      attachments: [
        {
          filename: `Receipt_${booking.bookingRef}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
  } catch (error) {
    console.error("Admin payment alert failed:", error.message);
  }
};

// ── 4. Guest confirmation email (sent when admin confirms booking) ──
const sendGuestConfirmation = async (booking) => {
  // Generate PDF receipt to attach
  let pdfBuffer;
  try {
    pdfBuffer = await generateReceipt(booking);
  } catch (err) {
    console.error("PDF generation for guest confirmation failed:", err.message);
  }

  const html = emailShell(`
    <h2 class="title">Reservation Confirmed</h2>
    <p class="subtitle">Your stay at Discovery Samal Resort has been confirmed</p>

    <div class="ref-box">
      <p class="ref-label">Confirmation Number</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <p>Dear ${booking.guestName},</p>
    <p>We are delighted to confirm your reservation. Below are your booking details:</p>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Total Paid</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:14px; margin-top:20px;">
      We look forward to welcoming you at Discovery Samal Resort!
    </p>
  `);

  try {
    const mailOptions = {
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Reservation Confirmed – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Receipt_${booking.bookingRef}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Guest confirmation email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// ── 5. Auto receipt email (sent automatically after payment proof upload) ──
const sendAutoReceipt = async (booking) => {
  const resortPhone = optionalEnv(process.env.RESORT_PHONE);
  const resortEmail =
    optionalEnv(process.env.RESORT_EMAIL) || process.env.SMTP_USER;
  const facebookPageUrl =
    optionalEnv(process.env.FACEBOOK_PAGE_URL) || "https://www.facebook.com";

  // Generate PDF receipt to attach
  let pdfBuffer;
  try {
    pdfBuffer = await generateReceipt(booking);
  } catch (err) {
    console.error("PDF generation for auto receipt failed:", err.message);
  }

  const html = emailShell(`
    <h2 class="title">Booking Receipt</h2>
    <p class="subtitle">Thank you for your payment, ${booking.guestName}</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${booking.guestName}</span></div>
      <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${booking.guestEmail}</span></div>
      <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${booking.guestPhone || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${booking.numberOfGuests}</span></div>
      ${booking.specialRequests ? `<div class="detail-row"><span class="detail-label">Special Requests</span><span class="detail-value">${booking.specialRequests}</span></div>` : ""}
      <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <div style="background:#F5F4F0; padding:20px; margin-top:25px; border:1px solid #e8e4dd;">
      <p style="text-align:center; color:#2C4A2E; font-size:14px; font-weight:bold; margin:0 0 10px 0;">
        Payment Proof Submitted
      </p>
      <p style="text-align:center; color:#6B7C3E; font-size:13px; margin:0;">
        Your payment screenshot has been received and is under review.<br/>
        We will confirm your booking within 24 hours.
      </p>
    </div>

    <div style="background:#2C4A2E; padding:25px; margin-top:25px; text-align:center;">
      <p style="color:#C4A882; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 15px 0;">
        Contact Us
      </p>
      ${resortPhone ? `<p style="color:#ffffff; font-size:14px; margin:0 0 8px 0;">📞 <a href="tel:${resortPhone.replace(/\s/g, "")}" style="color:#ffffff; text-decoration:none;">${resortPhone}</a></p>` : ""}
      <p style="color:#ffffff; font-size:14px; margin:0 0 8px 0;">
        ✉️ <a href="mailto:${resortEmail}" style="color:#ffffff; text-decoration:none;">${resortEmail}</a>
      </p>
      <p style="color:#ffffff; font-size:14px; margin:0 0 15px 0;">
        💬 <a href="${facebookPageUrl}" style="color:#C4A882; text-decoration:underline;">Visit us on Facebook</a>
      </p>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:13px; margin-top:25px;">
      We look forward to welcoming you at Discovery Samal Resort!
    </p>
  `);

  try {
    const mailOptions = {
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Booking Receipt – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    };

    if (pdfBuffer) {
      mailOptions.attachments = [
        {
          filename: `Receipt_${booking.bookingRef}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Auto receipt email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// ── 6. Receipt email with PDF attachment (manual send from frontend) ──
const sendReceiptEmail = async (booking, pdfData) => {
  let pdfBuffer;
  if (typeof pdfData === "string") {
    pdfBuffer = Buffer.from(pdfData, "base64");
  } else if (Buffer.isBuffer(pdfData)) {
    pdfBuffer = pdfData;
  } else {
    throw new Error("Invalid PDF data format");
  }

  const html = emailShell(`
    <h2 class="title">Booking Confirmation</h2>
    <p class="subtitle">Thank you for your payment, ${booking.guestName}</p>

    <div class="ref-box">
      <p class="ref-label">Confirmation Number</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <div style="background:#F5F4F0; padding:15px 20px; text-align:center; font-size:13px; color:#6B7C3E; margin-top:25px; border-radius:4px;">
      📎 Your detailed booking confirmation receipt is attached to this email as a PDF.
    </div>
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Booking Receipt – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
      attachments: [
        {
          filename: `Booking_${booking.bookingRef}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Receipt email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Generic send wrapper for custom emails (e.g., installment reminders)
const sendMail = (options) =>
  transporter.sendMail({ from: fromAddress, ...options });

// ── 7. Payment reminder email (automated, 1h and 24h after booking) ──
const sendPaymentReminder = async (booking, type, continuationUrl = null) => {
  const paymentUrl =
    continuationUrl ||
    `${process.env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:5173"}/booking/${booking._id}/payment`;

  const isFirst = type === 1;
  const subject = isFirst
    ? `Reminder: Complete Your Payment – ${booking.bookingRef}`
    : `Final Reminder: Your Booking is Still Unpaid – ${booking.bookingRef}`;

  const heading = isFirst ? "Payment Reminder" : "Final Payment Reminder";

  const message = isFirst
    ? "Your booking is still pending because payment has not yet been completed. Please complete your payment to secure your reservation."
    : "This is a final reminder that your booking remains unpaid. If payment is not received soon, your reservation may be cancelled.";

  const html = emailShell(`
    <h2 class="title">${heading}</h2>
    <p class="subtitle">${booking.guestName}, your reservation is awaiting payment</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${booking.nights}</span></div>
      <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:14px; margin:20px 0;">
      ${message}
    </p>

    <div style="text-align:center; margin:25px 0;">
      <a href="${paymentUrl}" class="btn">Complete Payment</a>
    </div>
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`Payment reminder (${type}) failed:`, error.message);
    return { success: false, error: error.message };
  }
};

// ── 8. Partial payment confirmation (sent after 1st installment proof uploaded) ──
const sendPartialPaymentEmail = async (booking, continuationUrl) => {
  const installment = booking.installment || {};
  const amountPaid = installment.firstPaymentAmount || 0;
  const amountRemaining = installment.secondPaymentAmount || 0;
  const dueDate = installment.secondPaymentDueDate
    ? formatDate(installment.secondPaymentDueDate)
    : "on check-in day";

  const html = emailShell(`
    <h2 class="title">First Payment Received</h2>
    <p class="subtitle">Your first installment has been submitted for review</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <p>Dear ${booking.guestName},</p>
    <p>We have received your first installment payment proof and it is currently under review. Here's your payment summary:</p>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(booking.totalAmount)}</span></div>
      <div class="detail-row"><span class="detail-label">1st Payment</span><span class="detail-value">${formatCurrency(amountPaid)} — Under Review</span></div>
      <div class="detail-row total-row"><span class="detail-label">Remaining</span><span class="detail-value">${formatCurrency(amountRemaining)} (due ${dueDate})</span></div>
    </div>

    <div style="background:#F5F4F0; padding:20px; margin-top:25px; border:1px solid #e8e4dd; border-left:4px solid #C4A882;">
      <p style="color:#2C4A2E; font-size:13px; margin:0 0 8px 0;"><strong>Second Payment Reminder</strong></p>
      <p style="color:#6B7C3E; font-size:13px; margin:0;">
        Your remaining balance of ${formatCurrency(amountRemaining)} is due ${dueDate}. Use the link below when you're ready to submit your second payment.
      </p>
    </div>

    ${
      continuationUrl
        ? `
    <div style="text-align:center; margin:30px 0;">
      <a href="${continuationUrl}" class="btn">Pay Remaining Balance</a>
    </div>
    <p style="text-align:center; color:#6B7C3E; font-size:11px;">This payment link is valid for 72 hours.</p>
    `
        : ""
    }
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject: `First Payment Received – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Partial payment email failed:", error.message);
    return { success: false, error: error.message };
  }
};

// ── 9. Remaining balance reminder (sent to installment guests before due date) ──
const sendRemainingBalanceReminder = async (booking, continuationUrl) => {
  const installment = booking.installment || {};
  const amountRemaining = installment.secondPaymentAmount || 0;

  const html = emailShell(`
    <h2 class="title">Balance Payment Due</h2>
    <p class="subtitle">Your remaining balance is ready to be settled</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <p>Dear ${booking.guestName},</p>
    <p>This is a friendly reminder that your remaining balance for your upcoming stay at Discovery Samal Resort is now due. Please settle it at your earliest convenience to secure your reservation.</p>

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
      <div class="detail-row"><span class="detail-label">1st Payment</span><span class="detail-value">${formatCurrency(installment.firstPaymentAmount || 0)} — Confirmed</span></div>
      <div class="detail-row total-row"><span class="detail-label">Remaining Balance</span><span class="detail-value">${formatCurrency(amountRemaining)}</span></div>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:14px; margin:20px 0;">
      Complete your payment now to guarantee a smooth and hassle-free check-in.
    </p>

    <div style="text-align:center; margin:25px 0;">
      <a href="${continuationUrl}" class="btn">Pay Remaining Balance</a>
    </div>
    <p style="text-align:center; color:#6B7C3E; font-size:11px;">This payment link is valid for 72 hours from the time it was generated.</p>
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Balance Due – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Remaining balance reminder failed:", error.message);
    return { success: false, error: error.message };
  }
};

// ── 10. Payment cancelled notification ──
const sendPaymentCancelledEmail = async (booking, reason = null) => {
  const newBookingUrl = `${process.env.CLIENT_URL?.split(",")[0]?.trim() || "http://localhost:5173"}/booking`;

  const html = emailShell(`
    <h2 class="title">Booking Cancelled</h2>
    <p class="subtitle">Your reservation has been cancelled</p>

    <div class="ref-box">
      <p class="ref-label">Booking Reference</p>
      <p class="ref-number">${booking.bookingRef}</p>
    </div>

    <p>Dear ${booking.guestName},</p>
    <p>We regret to inform you that your reservation at Discovery Samal Resort has been cancelled.</p>

    ${
      reason
        ? `
    <div style="background:#F5F4F0; padding:15px 20px; margin:20px 0; border-left:4px solid #e8866a;">
      <p style="color:#6B7C3E; font-size:13px; margin:0;"><strong>Reason:</strong> ${reason}</p>
    </div>
    `
        : ""
    }

    <div class="details">
      <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${booking.room?.name || "N/A"}</span></div>
      <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(booking.checkIn)}</span></div>
      <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(booking.checkOut)}</span></div>
    </div>

    <p style="text-align:center; color:#6B7C3E; font-size:14px; margin:20px 0;">
      We hope to welcome you another time. Feel free to make a new booking whenever you're ready.
    </p>

    <div style="text-align:center; margin:25px 0;">
      <a href="${newBookingUrl}" class="btn">Book Again</a>
    </div>
  `);

  try {
    const info = await transporter.sendMail({
      from: fromAddress,
      to: booking.guestEmail,
      subject: `Booking Cancelled – ${booking.bookingRef} | Discovery Samal Resort`,
      html,
    });
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Payment cancelled email failed:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendBookingConfirmationToGuest,
  sendBookingNotification,
  sendAdminPaymentAlert,
  sendGuestConfirmation,
  sendAutoReceipt,
  sendReceiptEmail,
  sendMail,
  sendPaymentReminder,
  sendPartialPaymentEmail,
  sendRemainingBalanceReminder,
  sendPaymentCancelledEmail,
};
