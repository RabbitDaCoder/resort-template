const nodemailer = require("nodemailer");
const https = require("https");
const http = require("http");

// ── Social config cache (fetched from backend DB, not .env) ──────────────────
let _socialConfigCache = null;
let _socialConfigFetchedAt = 0;
const SOCIAL_CONFIG_TTL_MS = 5 * 60 * 1000; // 5 minutes

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith("https") ? https : http;
    lib
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(
              new Error("Invalid JSON from backend: " + data.slice(0, 100)),
            );
          }
        });
      })
      .on("error", reject);
  });
}

async function getSocialConfig() {
  const now = Date.now();
  if (
    _socialConfigCache &&
    now - _socialConfigFetchedAt < SOCIAL_CONFIG_TTL_MS
  ) {
    return _socialConfigCache;
  }
  const backendUrl = process.env.BACKEND_URL || "";
  if (!backendUrl) {
    console.warn(
      "[email-service] BACKEND_URL not set — using .env fallbacks for contact info",
    );
    return null;
  }
  try {
    const json = await fetchJson(`${backendUrl}/api/social/links`);
    if (json && json.success && json.data) {
      _socialConfigCache = json.data;
      _socialConfigFetchedAt = now;
      return _socialConfigCache;
    }
  } catch (err) {
    console.error(
      "[email-service] Failed to fetch social config from backend:",
      err.message,
    );
  }
  return null;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
function checkApiKey(req) {
  return req.headers["x-api-key"] === process.env.EMAIL_API_KEY;
}

// ── Transporter (lazy, reused across warm invocations) ───────────────────────
let _transporter;
function getTransporter() {
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return _transporter;
}

const fromAddress = () =>
  process.env.EMAIL_FROM ||
  `"Discovery Samal Resort" <${process.env.SMTP_USER}>`;

// ── Helpers ───────────────────────────────────────────────────────────────────
const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatCurrency = (amount) =>
  `&#x20B1;${Number(amount || 0).toLocaleString("en-PH")}`;

const optionalEnv = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "null") return null;
  return normalized;
};

// Convert HTML to plain text for multipart/alternative (critical for spam score)
const htmlToPlainText = (html) => {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x20B1;/g, "PHP")
    .replace(/&copy;/g, "(c)")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

// ── Email shell (shared layout) ───────────────────────────────────────────────
const emailShell = (content, socialCfg = {}) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Georgia, serif; line-height: 1.6; color: #1a1a1a; background-color: #f7f7f5; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
    .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #008c8c; }
    .logo { font-size: 26px; font-weight: 400; color: #111111; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .tagline { font-size: 11px; color: #008c8c; letter-spacing: 3px; text-transform: uppercase; margin-top: 5px; }
    .content { background: #ffffff; padding: 40px; margin-top: 20px; border: 1px solid #e8e4dd; }
    .title { font-size: 22px; color: #111111; text-align: center; margin-bottom: 10px; }
    .subtitle { text-align: center; color: #008c8c; font-size: 14px; margin-bottom: 30px; }
    .ref-box { background: #f7f7f5; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #e8e4dd; }
    .ref-label { font-size: 11px; color: #008c8c; letter-spacing: 2px; text-transform: uppercase; }
    .ref-number { font-size: 24px; font-weight: bold; color: #111111; font-family: 'Courier New', monospace; letter-spacing: 2px; margin-top: 8px; }
    .details { margin: 30px 0; }
    .detail-row { padding: 12px 0; border-bottom: 1px solid #e8e4dd; }
    .detail-label { color: #008c8c; font-size: 13px; display: inline-block; width: 140px; }
    .detail-value { color: #1a1a1a; font-weight: 500; }
    .total-row { font-size: 16px; font-weight: bold; border-bottom: none; padding-top: 20px; }
    .btn { display: inline-block; background: #111111; color: #ffffff !important; padding: 14px 28px; text-decoration: none; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; }
    .footer { text-align: center; padding: 30px 0; color: #008c8c; font-size: 12px; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">Discovery Samal Resort</h1>
      <p class="tagline">Your Island Discovery in Samal</p>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p><strong>Need assistance?</strong></p>
      ${socialCfg.phone ? `<p>${socialCfg.phone}</p>` : ""}
      <p>${socialCfg.email || process.env.SMTP_USER}</p>
      <p><a href="${socialCfg.facebookUrl || "https://www.facebook.com"}" style="color:#008c8c;">Visit us on Facebook</a></p>
      <p style="margin-top: 20px; color: #008c8c;">
        &copy; ${new Date().getFullYear()} Discovery Samal Resort. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;

// ── Email builders ────────────────────────────────────────────────────────────

function buildBookingReceived(b, clientUrl, socialCfg) {
  const paymentUrl = `${clientUrl}/booking/${b._id}/payment`;
  return {
    to: b.guestEmail,
    subject: `Booking Received � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">Booking Received</h2>
      <p class="subtitle">Thank you for choosing Discovery Samal Resort, ${b.guestName}</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${b.nights}</span></div>
        <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${b.numberOfGuests}</span></div>
        <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:14px;">
        Please proceed with payment to confirm your reservation.
      </p>
      <div style="text-align:center; margin:25px 0;">
        <a href="${paymentUrl}" class="btn">Complete Payment</a>
      </div>
    `,
      socialCfg,
    ),
  };
}

function buildAdminNewBooking(b, clientUrl, socialCfg) {
  return {
    to: process.env.ADMIN_EMAIL,
    subject: `New Booking � ${b.bookingRef} � ${b.guestName}`,
    html: emailShell(
      `
      <h2 class="title">New Booking Received</h2>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${b.guestName}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${b.guestEmail}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${b.guestPhone || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${b.nights}</span></div>
        <div class="detail-row total-row"><span class="detail-label">Total</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      <div style="text-align:center; margin-top:30px;">
        <a href="${clientUrl}/owner/bookings" class="btn">View in Dashboard</a>
      </div>
    `,
      socialCfg,
    ),
  };
}

function buildPaymentReminder(b, reminderType, clientUrl, socialCfg) {
  const paymentUrl = `${clientUrl}/booking/${b._id}/payment`;
  const isFinal = reminderType === 2;
  const resortPhone = socialCfg?.phone || null;
  const resortEmail = socialCfg?.email || process.env.SMTP_USER;
  return {
    to: b.guestEmail,
    subject: isFinal
      ? `Final Reminder: Payment Due Today — ${b.bookingRef} | Discovery Samal Resort`
      : `Friendly Reminder: Your Payment is Due Today — ${b.bookingRef}`,
    html: emailShell(
      `
      <h2 class="title">${isFinal ? "Final Payment Reminder" : "Payment Reminder"}</h2>
      <p class="subtitle">A friendly reminder about your upcoming stay, ${b.guestName}</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${b.nights}</span></div>
        <div class="detail-row total-row"><span class="detail-label">Total Amount Due</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      <div style="background:#f7f7f5; border:1px solid #e8e4dd; padding:20px 24px; margin:24px 0; text-align:center;">
        <p style="color:#333333; font-size:14px; line-height:1.7; margin:0;">
          ${
            isFinal
              ? `Dear <strong>${b.guestName}</strong>, this is a gentle final reminder that your payment for booking <strong>${b.bookingRef}</strong> is due today. To ensure your reservation remains active, please settle your balance as soon as possible. If you have already paid, kindly disregard this message.`
              : `Dear <strong>${b.guestName}</strong>, just a friendly reminder that your booking payment is due <strong>today</strong>. Please complete your payment at your earliest convenience to keep your reservation confirmed and your room secured.`
          }
        </p>
      </div>
      <div style="text-align:center; margin:25px 0;">
        <a href="${paymentUrl}" class="btn">Complete My Payment</a>
      </div>
      <p style="text-align:center; color:#888888; font-size:12px; margin:16px 0 0 0;">
        Questions? We're happy to help.
        ${resortPhone ? `<br/><a href="tel:${resortPhone.replace(/\s/g, "")}" style="color:#008c8c;">${resortPhone}</a>` : ""}
        ${resortEmail ? `&nbsp;·&nbsp;<a href="mailto:${resortEmail}" style="color:#008c8c;">${resortEmail}</a>` : ""}
      </p>
    `,
      socialCfg,
    ),
  };
}

function buildPaymentReceived(b, screenshotUrl, socialCfg) {
  const resortPhone = socialCfg?.phone || null;
  const resortEmail = socialCfg?.email || process.env.SMTP_USER;
  const facebookPageUrl = socialCfg?.facebookUrl || "https://www.facebook.com";
  return {
    to: b.guestEmail,
    subject: `Payment Received � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">Payment Proof Submitted</h2>
      <p class="subtitle">Thank you for your payment, ${b.guestName}</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${b.guestName}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${b.guestEmail}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${b.guestPhone || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${b.nights}</span></div>
        <div class="detail-row"><span class="detail-label">Guests</span><span class="detail-value">${b.numberOfGuests}</span></div>
        ${b.specialRequests ? `<div class="detail-row"><span class="detail-label">Requests</span><span class="detail-value">${b.specialRequests}</span></div>` : ""}
        <div class="detail-row total-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      <div style="background:#f7f7f5; padding:20px; margin-top:25px; border:1px solid #e8e4dd; text-align:center;">
        <p style="color:#111111; font-size:14px; font-weight:bold; margin:0 0 10px 0;">Payment Proof Received</p>
        <p style="color:#008c8c; font-size:13px; margin:0;">
          Your screenshot has been received and is under review.<br/>We will confirm your booking within 24 hours.
        </p>
      </div>
      <div style="background:#111111; padding:25px; margin-top:25px; text-align:center;">
        <p style="color:#008c8c; font-size:11px; letter-spacing:2px; text-transform:uppercase; margin:0 0 15px 0;">Contact Us</p>
        ${resortPhone ? `<p style="color:#ffffff; font-size:14px; margin:0 0 8px 0;"><a href="tel:${resortPhone.replace(/\s/g, "")}" style="color:#ffffff; text-decoration:none;">${resortPhone}</a></p>` : ""}
        <p style="color:#ffffff; font-size:14px; margin:0 0 15px 0;"><a href="mailto:${resortEmail}" style="color:#ffffff; text-decoration:none;">${resortEmail}</a></p>
        <a href="${facebookPageUrl}" style="display:inline-block; background:#008c8c; color:#ffffff; padding:12px 24px; text-decoration:none; letter-spacing:1px; text-transform:uppercase; font-size:11px; font-weight:bold;">Visit us on Facebook</a>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:13px; margin-top:25px;">
        Your receipt is attached to this email as a PDF.
      </p>
    `,
      socialCfg,
    ),
  };
}

function buildAdminPaymentAlert(b, screenshotUrl, clientUrl, socialCfg) {
  return {
    to: process.env.ADMIN_EMAIL,
    subject: `Payment Proof � ${b.bookingRef} � ${b.guestName}`,
    html: emailShell(
      `
      <h2 class="title">Payment Proof Received</h2>
      <p class="subtitle">A guest has uploaded payment for review</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Guest</span><span class="detail-value">${b.guestName}</span></div>
        <div class="detail-row"><span class="detail-label">Email</span><span class="detail-value">${b.guestEmail}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${b.guestPhone || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row total-row"><span class="detail-label">Amount</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      ${
        screenshotUrl
          ? `
      <div style="text-align:center; margin:25px 0;">
        <p style="color:#008c8c; font-size:13px; margin-bottom:10px;">Payment Screenshot:</p>
        <a href="${screenshotUrl}"><img src="${screenshotUrl}" style="max-width:400px; border:1px solid #e8e4dd;" /></a>
      </div>`
          : ""
      }
      <div style="text-align:center; margin-top:20px;">
        <a href="${clientUrl}/owner/payments" class="btn">Review Payment</a>
      </div>
    `,
      socialCfg,
    ),
  };
}

function buildPartialPayment(b, continuationUrl, socialCfg) {
  const installment = b.installment || {};
  const amountPaid = installment.firstPaymentAmount || 0;
  const amountRemaining = installment.secondPaymentAmount || 0;
  const dueDate = installment.secondPaymentDueDate
    ? formatDate(installment.secondPaymentDueDate)
    : "on check-in day";
  return {
    to: b.guestEmail,
    subject: `First Payment Received � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">First Payment Received</h2>
      <p class="subtitle">Your first installment has been submitted for review</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <p>Dear ${b.guestName},</p>
      <p>We have received your first installment payment proof and it is currently under review. Here's your payment summary:</p>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Total Amount</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
        <div class="detail-row"><span class="detail-label">1st Payment</span><span class="detail-value">${formatCurrency(amountPaid)} � Under Review</span></div>
        <div class="detail-row total-row"><span class="detail-label">Remaining</span><span class="detail-value">${formatCurrency(amountRemaining)} (due ${dueDate})</span></div>
      </div>
      <div style="background:#f7f7f5; padding:20px; margin-top:25px; border:1px solid #e8e4dd; border-left:4px solid #008c8c;">
        <p style="color:#111111; font-size:13px; margin:0 0 8px 0;"><strong>Second Payment Reminder</strong></p>
        <p style="color:#008c8c; font-size:13px; margin:0;">
          Your remaining balance of ${formatCurrency(amountRemaining)} is due ${dueDate}. Use the link below when you're ready to submit your second payment.
        </p>
      </div>
      ${
        continuationUrl
          ? `
      <div style="text-align:center; margin:30px 0;">
        <a href="${continuationUrl}" class="btn">Pay Remaining Balance</a>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:11px;">This payment link is valid for 72 hours.</p>
      `
          : ""
      }
    `,
      socialCfg,
    ),
  };
}

function buildRemainingBalanceReminder(b, continuationUrl, socialCfg) {
  const installment = b.installment || {};
  const amountRemaining = installment.secondPaymentAmount || 0;
  return {
    to: b.guestEmail,
    subject: `Balance Due � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">Balance Payment Due</h2>
      <p class="subtitle">Your remaining balance is ready to be settled</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <p>Dear ${b.guestName},</p>
      <p>This is a friendly reminder that your remaining balance for your upcoming stay at Discovery Samal Resort is now due. Please settle it at your earliest convenience to secure your reservation.</p>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">1st Payment</span><span class="detail-value">${formatCurrency(installment.firstPaymentAmount || 0)} � Confirmed</span></div>
        <div class="detail-row total-row"><span class="detail-label">Remaining Balance</span><span class="detail-value">${formatCurrency(amountRemaining)}</span></div>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:14px; margin:20px 0;">
        Complete your payment now to guarantee a smooth and hassle-free check-in.
      </p>
      <div style="text-align:center; margin:25px 0;">
        <a href="${continuationUrl}" class="btn">Pay Remaining Balance</a>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:11px;">This payment link is valid for 72 hours from the time it was generated.</p>
    `,
      socialCfg,
    ),
  };
}

function buildBookingCancelled(b, reason, clientUrl, socialCfg) {
  const newBookingUrl = `${clientUrl}/booking`;
  return {
    to: b.guestEmail,
    subject: `Booking Cancelled � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">Booking Cancelled</h2>
      <p class="subtitle">Your reservation has been cancelled</p>
      <div class="ref-box">
        <p class="ref-label">Booking Reference</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <p>Dear ${b.guestName},</p>
      <p>We regret to inform you that your reservation at Discovery Samal Resort has been cancelled.</p>
      ${
        reason
          ? `
      <div style="background:#f7f7f5; padding:15px 20px; margin:20px 0; border-left:4px solid #e8866a;">
        <p style="color:#008c8c; font-size:13px; margin:0;"><strong>Reason:</strong> ${reason}</p>
      </div>
      `
          : ""
      }
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:14px; margin:20px 0;">
        We hope to welcome you another time. Feel free to make a new booking whenever you're ready.
      </p>
      <div style="text-align:center; margin:25px 0;">
        <a href="${newBookingUrl}" class="btn">Book Again</a>
      </div>
    `,
      socialCfg,
    ),
  };
}

function buildBookingConfirmed(b, socialCfg) {
  return {
    to: b.guestEmail,
    subject: `Reservation Confirmed � ${b.bookingRef} | Discovery Samal Resort`,
    html: emailShell(
      `
      <h2 class="title">Reservation Confirmed &#10003;</h2>
      <p class="subtitle">Your stay at Discovery Samal Resort has been confirmed</p>
      <div class="ref-box">
        <p class="ref-label">Confirmation Number</p>
        <p class="ref-number">${b.bookingRef}</p>
      </div>
      <p>Dear ${b.guestName},</p>
      <p>We are delighted to confirm your reservation. Below are your booking details:</p>
      <div class="details">
        <div class="detail-row"><span class="detail-label">Room</span><span class="detail-value">${b.room?.name || "N/A"}</span></div>
        <div class="detail-row"><span class="detail-label">Check-in</span><span class="detail-value">${formatDate(b.checkIn)}</span></div>
        <div class="detail-row"><span class="detail-label">Check-out</span><span class="detail-value">${formatDate(b.checkOut)}</span></div>
        <div class="detail-row"><span class="detail-label">Nights</span><span class="detail-value">${b.nights}</span></div>
        <div class="detail-row total-row"><span class="detail-label">Total Paid</span><span class="detail-value">${formatCurrency(b.totalAmount)}</span></div>
      </div>
      <p style="text-align:center; color:#008c8c; font-size:14px; margin-top:20px;">
        Your receipt is attached. We look forward to welcoming you!
      </p>
    `,
      socialCfg,
    ),
  };
}

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
  if (!checkApiKey(req)) return res.status(401).json({ error: "Unauthorized" });

  const {
    type,
    booking,
    pdfBase64,
    screenshotUrl,
    reminderType,
    continuationUrl,
    reason,
  } = req.body;

  if (!type || !booking) {
    return res
      .status(400)
      .json({ error: "Missing required fields: type, booking" });
  }

  const clientUrl = (
    process.env.CLIENT_URL || "https://www.discoverysamal-resort.org"
  )
    .split(",")[0]
    .trim();

  // Fetch live social config (phone, Facebook URL) from backend DB
  const socialCfg = (await getSocialConfig()) || {};

  let mailOptions;
  try {
    switch (type) {
      case "booking_received":
        mailOptions = buildBookingReceived(booking, clientUrl, socialCfg);
        break;
      case "admin_new_booking":
        mailOptions = buildAdminNewBooking(booking, clientUrl, socialCfg);
        break;
      case "payment_reminder":
        mailOptions = buildPaymentReminder(
          booking,
          reminderType || 1,
          clientUrl,
          socialCfg,
        );
        break;
      case "payment_received":
        mailOptions = buildPaymentReceived(booking, screenshotUrl, socialCfg);
        break;
      case "admin_payment_alert":
        mailOptions = buildAdminPaymentAlert(
          booking,
          screenshotUrl,
          clientUrl,
          socialCfg,
        );
        break;
      case "booking_confirmed":
        mailOptions = buildBookingConfirmed(booking, socialCfg);
        break;
      case "partial_payment":
        mailOptions = buildPartialPayment(booking, continuationUrl, socialCfg);
        break;
      case "remaining_balance_reminder":
        mailOptions = buildRemainingBalanceReminder(
          booking,
          continuationUrl,
          socialCfg,
        );
        break;
      case "booking_cancelled":
        mailOptions = buildBookingCancelled(
          booking,
          reason,
          clientUrl,
          socialCfg,
        );
        break;
      default:
        return res.status(400).json({ error: `Unknown email type: ${type}` });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Failed to build email: " + err.message });
  }

  // Attach PDF if provided
  if (pdfBase64) {
    const pdfBuffer = Buffer.from(pdfBase64, "base64");
    mailOptions.attachments = [
      {
        filename: `Receipt_${booking.bookingRef}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ];
  }

  // Auto-generate plain text if not provided (required for good spam score)
  if (mailOptions.html && !mailOptions.text) {
    mailOptions.text = htmlToPlainText(mailOptions.html);
  }

  try {
    const info = await getTransporter().sendMail({
      from: fromAddress(),
      replyTo: socialCfg?.email || process.env.SMTP_USER,
      headers: {
        "X-Mailer": "Discovery Samal Resort Booking System",
        "X-Entity-Ref-ID": `dscv-${Date.now()}`,
        Precedence: "transactional",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
      },
      ...mailOptions,
    });
    return res.status(200).json({ success: true, messageId: info.messageId });
  } catch (err) {
    console.error(`[email-service] send failed (${type}):`, err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
};
