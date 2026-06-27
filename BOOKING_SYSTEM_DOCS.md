# Booking & Admin System Documentation

Full reference for the booking process, payment flows, installment handling, email system, and admin confirmation logic. Intended for reuse in other projects.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Booking Model](#2-booking-model)
3. [Booking Process — Full Flow](#3-booking-process--full-flow)
4. [Payment Options](#4-payment-options)
5. [Installment / Partial Payments](#5-installment--partial-payments)
6. [Admin Actions](#6-admin-actions)
7. [Continuation / Payment Link System](#7-continuation--payment-link-system)
8. [Email System](#8-email-system)
9. [Automated Reminder Job](#9-automated-reminder-job)
10. [API Routes Reference](#10-api-routes-reference)
11. [Full Source Code Copies](#11-full-source-code-copies)

---

## 1. Architecture Overview

```
Guest (Frontend)
    │
    ├─ POST /api/bookings          → creates booking, emails sent to guest + admin
    ├─ POST /api/payments/proof    → uploads payment screenshot
    └─ GET  /api/bookings/continue/:token  → resumes payment via secure link

Admin (Frontend /owner/*)
    │
    ├─ PATCH /api/bookings/:id/status              → confirm or cancel booking
    ├─ PATCH /api/bookings/:id/confirm-installment → confirm 1st or 2nd installment
    ├─ PATCH /api/bookings/:id/send-reminder       → manually send balance due email
    └─ POST  /api/bookings/:id/generate-payment-link → generate + optionally email link

Email Service (Separate microservice / Vercel function)
    └─ POST /api/send   → receives { type, booking, ... } and sends email via Nodemailer
```

The backend never sends email directly — it always calls an external **email service** via HTTP POST with an `x-api-key` header. This allows the email service to be deployed independently (e.g., on Vercel serverless).

---

## 2. Booking Model

**File:** `backend/models/Booking.js`

### Key Fields

| Field                     | Type                                                                     | Description                                           |
| ------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------- |
| `guestName`               | String                                                                   | Guest full name                                       |
| `guestEmail`              | String                                                                   | Guest email (lowercase, validated)                    |
| `guestPhone`              | String                                                                   | Guest phone                                           |
| `numberOfGuests`          | Number                                                                   | Headcount                                             |
| `specialRequests`         | String                                                                   | Optional notes                                        |
| `room`                    | ObjectId → Room                                                          | Reference to room                                     |
| `checkIn` / `checkOut`    | Date                                                                     | Stay dates                                            |
| `nights`                  | Number                                                                   | Auto-calculated                                       |
| `totalAmount`             | Number                                                                   | Computed from nights × pricePerNight (after discount) |
| `amountPaid`              | Number                                                                   | Tracks confirmed paid amount                          |
| `status`                  | enum: `pending`, `confirmed`, `cancelled`                                | Booking lifecycle status                              |
| `paymentStatus`           | enum: `unpaid`, `pending`, `partial`, `confirmed`, `failed`, `cancelled` | Payment lifecycle                                     |
| `paymentOption`           | enum: `full`, `installment`                                              | Payment mode chosen by guest                          |
| `paymentScreenshot`       | String                                                                   | Cloudinary URL (full payment)                         |
| `paymentRef`              | String                                                                   | Optional payment reference                            |
| `continuationToken`       | String                                                                   | SHA-256 hash of the JWT for payment links             |
| `continuationTokenExpiry` | Date                                                                     | Token expiry (72h)                                    |
| `payments[]`              | Embedded                                                                 | Payment history records                               |
| `installment`             | Embedded                                                                 | All installment-specific data                         |
| `bookingRef`              | String                                                                   | Auto-generated unique ref (e.g., `BSR-M2X9K3`)        |
| `reminderEmails`          | `{ firstSent, secondSent }`                                              | Tracks automated reminder state                       |

### Installment Sub-document

```js
installment: {
  firstPaymentAmount: Number,
  secondPaymentAmount: Number,
  firstPaymentStatus: 'unpaid' | 'pending' | 'confirmed',
  firstPaymentScreenshot: String,
  firstPaymentDate: Date,
  firstPaymentConfirmedAt: Date,
  secondPaymentStatus: 'unpaid' | 'pending' | 'confirmed',
  secondPaymentScreenshot: String,
  secondPaymentDueDate: Date,      // defaults to check-in date
  secondPaymentDate: Date,
  secondPaymentConfirmedAt: Date,
  secondPaymentReminderSent: Boolean,
}
```

### Payment History Record (embedded array)

```js
payments: [
  {
    amount: Number,
    type: "first" | "second" | "full",
    status: "pending" | "confirmed" | "failed" | "cancelled",
    screenshotUrl: String,
    reference: String,
    paidAt: Date,
    confirmedAt: Date,
  },
];
```

---

## 3. Booking Process — Full Flow

### Step 1 — Guest Submits Booking

`POST /api/bookings`

```
1. Validate input (guestName, guestEmail, guestPhone, numberOfGuests, room, checkIn, checkOut, paymentOption)
2. Look up Room by ID — throw 404 if not found
3. Calculate nights = ceil((checkOut - checkIn) / ms_per_day)
4. Get effective price via discountService.getRoomPricing() (handles active promos/discounts)
5. totalAmount = nights × effectivePrice
6. If paymentOption === 'installment':
     firstPaymentAmount  = ceil(totalAmount / 2)
     secondPaymentAmount = totalAmount - firstPaymentAmount
     secondPaymentDueDate = checkIn date
7. Create booking in a Mongoose transaction (startSession + commitTransaction)
8. Populate room data
9. Fire (non-blocking):
     emailService.sendBookingNotification(booking)        → admin alert email
     emailService.sendBookingConfirmationToGuest(booking) → guest "booking received" + payment link
10. Return 201 with booking data
```

### Step 2 — Guest Uploads Payment Proof

`POST /api/payments/proof` _(paymentService.uploadProof)_

```
1. Validate file exists
2. If paymentOption switch happens here (guest picks installment at payment time):
     - recalculate installment amounts and set on booking
3. Upload screenshot to Cloudinary → get secure_url
4. If installment:
     installmentNumber === 1:
       - set firstPaymentScreenshot, firstPaymentStatus = 'pending', firstPaymentDate
       - push to payments[] with type='first', status='pending'
       - set booking.paymentStatus = 'partial'
     installmentNumber === 2:
       - set secondPaymentScreenshot, secondPaymentStatus = 'pending', secondPaymentDate
       - push to payments[] with type='second', status='pending'
       - set booking.paymentStatus = 'pending'
   Else (full):
       - set paymentScreenshot, paymentStatus = 'pending'
       - push to payments[] with type='full', status='pending'
5. Save booking
6. Fire (non-blocking):
     emailService.sendAdminPaymentAlert({ booking, screenshotUrl }) → admin sees screenshot + PDF
     emailService.sendAutoReceipt(booking)                          → guest receipt email + PDF
```

---

## 4. Payment Options

### Full Payment

- Guest pays the entire `totalAmount` in one go
- Uploads one screenshot
- Admin confirms → `paymentStatus = 'confirmed'`, `status = 'confirmed'`
- Confirmation email + PDF sent to guest

### Installment Payment

- Split exactly: `firstPayment = ceil(total / 2)`, `secondPayment = total - firstPayment`
- Two separate upload steps (1st, then 2nd later)
- Each step goes through admin review

---

## 5. Installment / Partial Payments

### Confirm 1st Installment (Admin)

`PATCH /api/bookings/:id/confirm-installment` with `{ installmentNumber: 1 }`

```
1. Validate booking exists + is installment type
2. Set:
     installment.firstPaymentStatus = 'confirmed'
     installment.firstPaymentConfirmedAt = now
     paymentStatus = 'partial'
     amountPaid = firstPaymentAmount
3. Save
4. Generate a continuation URL (signed JWT, 72h expiry)
5. emailService.sendPartialPaymentEmail(booking, continuationUrl)
   → Guest receives "1st payment confirmed, here's your link to pay the rest"
```

### Confirm 2nd Installment (Admin)

`PATCH /api/bookings/:id/confirm-installment` with `{ installmentNumber: 2 }`

```
1. Set:
     installment.secondPaymentStatus = 'confirmed'
     installment.secondPaymentConfirmedAt = now
2. If firstPaymentStatus is also 'confirmed':
     paymentStatus = 'confirmed'
     status = 'confirmed'
3. Save
4. Because status is now 'confirmed':
     emailService.sendGuestConfirmation(booking) → full confirmation email + PDF receipt
```

### paymentStatus State Machine

```
unpaid
  └─ (upload full proof)     → pending
  └─ (upload installment 1)  → partial

pending
  └─ (admin confirms full)   → confirmed
  └─ (admin cancels)         → cancelled

partial
  └─ (upload installment 2)  → pending
  └─ (admin sends reminder)  → [no status change, email sent]

pending (2nd installment uploaded)
  └─ (admin confirms 2nd)    → confirmed (if 1st also confirmed)
```

---

## 6. Admin Actions

### Confirm / Cancel Booking

`PATCH /api/bookings/:id/status` body: `{ status: 'confirmed' | 'cancelled' }`

```js
// bookingService.updateStatus
const update = { status };
if (status === "confirmed") update.paymentStatus = "confirmed";
if (status === "cancelled") update.paymentStatus = "unpaid";

// After update:
if (status === "confirmed") {
  emailService.sendGuestConfirmation(booking); // confirmation + PDF
}
```

This is the primary "manual confirm" path for **full payments**. For installment bookings, use `confirm-installment` instead.

Audit log is written for every status change: `BOOKING_CONFIRMED`, `BOOKING_CANCELLED`, etc.

### Send Reminder Email (Manual)

`PATCH /api/bookings/:id/send-reminder`

```
Logic branches based on payment state:

Case A — installment + paymentStatus === 'partial'
  → sendRemainingBalanceReminder(booking, continuationUrl)
  → sets installment.secondPaymentReminderSent = true

Case B — anything else (full unpaid, installment 1st not paid)
  → sendPaymentReminder(booking, 1, continuationUrl)
  → sets reminderEmails.firstSent = true

Guards:
  - paymentStatus === 'confirmed' → throws "already fully paid"
  - status === 'cancelled'        → throws "booking is cancelled"
  - secondPaymentStatus === 'confirmed' → throws "second payment already confirmed"
```

### Generate Payment Link (Admin)

`POST /api/bookings/:id/generate-payment-link` body: `{ sendEmail: true|false }`

```
1. Generate continuation URL (new signed JWT, stored hash on booking)
2. If sendEmail === true:
     - paymentStatus === 'partial' → sendRemainingBalanceReminder
     - otherwise → sendPaymentReminder
3. Return continuationUrl in response
```

### Dashboard Data

`GET /api/auth/dashboard` (auth required)

Returns aggregated stats used by the admin dashboard (booking counts, revenue, pending payments, etc.)

---

## 7. Continuation / Payment Link System

This allows guests to return and pay the second installment (or any unpaid balance) via a secure link without requiring login.

### How It Works

```
1. Admin confirms 1st installment OR manually generates link
2. A JWT is signed with:
     { bookingId, purpose: 'payment_continuation' }
     expiry: 72 hours
     secret: process.env.JWT_SECRET
3. SHA-256 hash of the raw token is stored on booking.continuationToken
4. Token expiry stored in booking.continuationTokenExpiry
5. URL sent to guest: ${CLIENT_URL}/booking/continue/${token}
```

### Guest Resumes Payment

`GET /api/bookings/continue/:token` (public, no auth)

```
1. jwt.verify(token, JWT_SECRET) — throws if expired/invalid
2. Check payload.purpose === 'payment_continuation'
3. Hash the token and look up:
     Booking.findOne({
       _id: payload.bookingId,
       continuationToken: tokenHash,
       continuationTokenExpiry: { $gt: new Date() }
     })
4. Returns populated booking if valid
5. Guest sees second payment form pre-filled with booking details
```

Security properties:

- Raw JWT never stored in DB (only hash)
- Expiry checked both by JWT and DB field
- Re-generating a new link invalidates the old one (hash overwritten)

---

## 8. Email System

### Architecture

The backend (`backend/services/emailService.js`) never sends email directly. It makes HTTP POST calls to a separate email microservice:

```js
async function callEmailService(payload) {
  await fetch(EMAIL_SERVICE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": EMAIL_SERVICE_API_KEY,
    },
    body: JSON.stringify(payload),
  });
}
```

The email service (`email-service/api/send.js`) handles all 9 email types, builds the HTML, attaches PDFs, and sends via Nodemailer (Zoho SMTP by default).

### Email Types

| `type` value                 | Trigger                                               | Recipients                  |
| ---------------------------- | ----------------------------------------------------- | --------------------------- |
| `booking_received`           | Booking created                                       | Guest                       |
| `admin_new_booking`          | Booking created                                       | Admin                       |
| `payment_received`           | Payment proof uploaded                                | Guest (+ PDF receipt)       |
| `admin_payment_alert`        | Payment proof uploaded                                | Admin (screenshot + PDF)    |
| `booking_confirmed`          | Admin confirms booking or both installments confirmed | Guest (+ PDF receipt)       |
| `payment_reminder`           | Cron job (1h, 24h) or admin manual send               | Guest                       |
| `partial_payment`            | Admin confirms 1st installment                        | Guest (+ continuation link) |
| `remaining_balance_reminder` | Admin "Send Reminder" on partial bookings             | Guest (+ continuation link) |
| `booking_cancelled`          | Admin cancels booking                                 | Guest                       |

### Email Design System

All emails share a single `emailShell(content)` function that injects HTML into a styled wrapper:

- **Color palette:** Forest green `#2C4A2E`, olive `#6B7C3E`, warm tan `#C4A882`, off-white `#F5F4F0`
- **Font:** Georgia serif
- **Layout:** 600px max-width centered container
- **Components:** `.ref-box` (booking ref highlight), `.detail-row` (key-value pairs), `.btn` (CTA button), `.footer` (contact info)

The footer renders dynamic content from env vars: `RESORT_PHONE`, `RESORT_EMAIL`, `FACEBOOK_PAGE_URL`.

### PDF Receipts

Generated via `generateReceipt(booking)` which returns a Buffer. Attached to emails that need them via `base64` encoding passed in the `pdfBase64` field of the email service payload.

---

## 9. Automated Reminder Job

**File:** `backend/jobs/reminderJob.js`

Runs via `node-cron` 5× daily at: **6 AM, 10 AM, 2 PM, 6 PM, 10 PM**

```js
cron.schedule("0 6,10,14,18,22 * * *", processReminders);
```

### processReminders Logic

```
For every booking where paymentStatus === 'unpaid' AND status === 'pending':

  hoursSinceBooking = (now - createdAt) / 3,600,000

  if hoursSinceBooking >= 48:
    → Auto-cancel: status = 'cancelled'
    → Log: "Booking auto-cancelled (48h unpaid)"
    → continue (skip reminder)

  if hoursSinceBooking >= 24 AND reminderEmails.secondSent === false:
    → sendPaymentReminder(booking, 24)  ← "Final Reminder" email
    → reminderEmails.secondSent = true
    → continue

  if hoursSinceBooking >= 1 AND reminderEmails.firstSent === false:
    → sendPaymentReminder(booking, 1)   ← "Payment Reminder" email
    → reminderEmails.firstSent = true
```

### Timeline for an Unpaid Booking

```
T+0h   Booking created → "Booking Received" email sent
T+1h   Cron fires → 1st reminder sent (if not already sent)
T+24h  Cron fires → Final reminder sent (if not already sent)
T+48h  Cron fires → Booking auto-cancelled
```

---

## 10. API Routes Reference

### Booking Routes (`/api/bookings`)

| Method   | Path                         | Auth   | Description                                     |
| -------- | ---------------------------- | ------ | ----------------------------------------------- |
| `POST`   | `/`                          | Public | Create booking (rate-limited, idempotency key)  |
| `GET`    | `/availability`              | Public | Check date availability                         |
| `GET`    | `/booked-dates`              | Public | Get all booked dates (for calendar)             |
| `GET`    | `/continue/:token`           | Public | Resume payment via continuation link            |
| `GET`    | `/`                          | Admin  | List all bookings (filterable, paginated)       |
| `GET`    | `/:id`                       | Public | Get booking by ID                               |
| `GET`    | `/:id/receipt`               | Admin  | Download PDF receipt                            |
| `PATCH`  | `/:id/status`                | Admin  | Confirm or cancel booking                       |
| `PATCH`  | `/:id/confirm-installment`   | Admin  | Confirm installment 1 or 2                      |
| `PATCH`  | `/:id/send-reminder`         | Admin  | Send balance/payment reminder email             |
| `POST`   | `/:id/generate-payment-link` | Admin  | Generate continuation URL (optionally email it) |
| `POST`   | `/send-receipt`              | Public | Manually send receipt email                     |
| `DELETE` | `/:id`                       | Admin  | Delete booking                                  |

### Auth Routes (`/api/auth`)

| Method | Path         | Auth   | Description                       |
| ------ | ------------ | ------ | --------------------------------- |
| `POST` | `/login`     | Public | Admin login (rate-limited)        |
| `POST` | `/refresh`   | Public | Refresh access token              |
| `POST` | `/logout`    | Public | Logout (invalidate refresh token) |
| `GET`  | `/me`        | Admin  | Get current admin info            |
| `GET`  | `/dashboard` | Admin  | Dashboard stats                   |
| `POST` | `/seed`      | Public | Seed initial admin (dev only)     |

### Payment Routes (`/api/payments`)

| Method | Path       | Auth   | Description                              |
| ------ | ---------- | ------ | ---------------------------------------- |
| `POST` | `/proof`   | Public | Upload payment screenshot                |
| `GET`  | `/details` | Public | Get payment account details (bank/GCash) |
| `PUT`  | `/details` | Admin  | Update payment account details           |

---

## 11. Full Source Code Copies

### `backend/models/Booking.js`

```js
const mongoose = require("mongoose");

function bookingRefPrefix() {
  const configuredId = String(process.env.PROJECT_ID || "").toUpperCase();
  const candidate = configuredId.split("-")[0] || "BOOK";
  const safe = candidate.replace(/[^A-Z0-9]/g, "").slice(0, 8);
  return safe || "BOOK";
}

const paymentRecordSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    type: { type: String, enum: ["first", "second", "full"], required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "failed", "cancelled"],
      default: "pending",
    },
    screenshotUrl: String,
    reference: String,
    paidAt: Date,
    confirmedAt: Date,
  },
  { _id: true },
);

const bookingSchema = new mongoose.Schema(
  {
    guestName: { type: String, required: true, trim: true },
    guestEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    guestPhone: { type: String, required: true, trim: true },
    numberOfGuests: { type: Number, required: true },
    specialRequests: { type: String, trim: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    nights: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "pending",
        "partial",
        "confirmed",
        "failed",
        "cancelled",
      ],
      default: "unpaid",
    },
    paymentOption: {
      type: String,
      enum: ["full", "installment"],
      default: "full",
    },
    paymentScreenshot: String,
    paymentRef: String,
    continuationToken: { type: String, index: { sparse: true } },
    continuationTokenExpiry: Date,
    payments: [paymentRecordSchema],
    installment: {
      firstPaymentAmount: Number,
      secondPaymentAmount: Number,
      firstPaymentStatus: {
        type: String,
        enum: ["unpaid", "pending", "confirmed"],
        default: "unpaid",
      },
      firstPaymentScreenshot: String,
      firstPaymentDate: Date,
      firstPaymentConfirmedAt: Date,
      secondPaymentStatus: {
        type: String,
        enum: ["unpaid", "pending", "confirmed"],
        default: "unpaid",
      },
      secondPaymentScreenshot: String,
      secondPaymentDueDate: Date,
      secondPaymentDate: Date,
      secondPaymentConfirmedAt: Date,
      secondPaymentReminderSent: { type: Boolean, default: false },
    },
    bookingRef: {
      type: String,
      unique: true,
      default: () =>
        `${bookingRefPrefix()}-${Date.now().toString(36).toUpperCase()}`,
    },
    reminderEmails: {
      firstSent: { type: Boolean, default: false },
      secondSent: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

bookingSchema.pre("validate", function () {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    this.invalidate("checkOut", "Check-out must be after check-in");
  }
});

bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ status: 1, paymentStatus: 1 });
bookingSchema.index({ guestEmail: 1 });

module.exports = mongoose.model("Booking", bookingSchema);
```

---

### `backend/services/bookingService.js`

```js
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const AppError = require("../utils/AppError");
const emailService = require("./emailService");
const discountService = require("./discountService");

const CLIENT_URL = () =>
  (process.env.CLIENT_URL || "http://localhost:5173").split(",")[0].trim();

const TOKEN_TTL_HOURS = 72;

const bookingService = {
  async create(data) {
    const roomDoc = await Room.findById(data.room);
    if (!roomDoc) throw new AppError("Room not found", 404);

    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24),
    );
    if (nights < 1) throw new AppError("Check-out must be after check-in", 400);

    const pricing = await discountService.getRoomPricing(roomDoc, {
      checkIn: checkInDate,
      checkOut: checkOutDate,
    });
    const pricePerNight = pricing.effectivePrice;
    const totalAmount = nights * pricePerNight;

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const bookingData = {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        numberOfGuests: data.numberOfGuests,
        specialRequests: data.specialRequests,
        room: data.room,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        nights,
        totalAmount,
        paymentOption: data.paymentOption || "full",
      };

      if (bookingData.paymentOption === "installment") {
        const firstHalf = Math.ceil(totalAmount / 2);
        bookingData.installment = {
          firstPaymentAmount: firstHalf,
          secondPaymentAmount: totalAmount - firstHalf,
          firstPaymentStatus: "unpaid",
          secondPaymentStatus: "unpaid",
          secondPaymentDueDate: checkInDate,
        };
      }

      const [booking] = await Booking.create([bookingData], { session });
      await session.commitTransaction();

      const populated = await booking.populate(
        "room",
        "name pricePerNight images",
      );
      emailService.sendBookingNotification(populated);
      emailService.sendBookingConfirmationToGuest(populated);

      return populated;
    } catch (err) {
      if (session.inTransaction()) await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  async checkAvailability({ checkIn, checkOut, roomId }) {
    const filter = {
      status: { $ne: "cancelled" },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    };
    if (roomId) filter.room = roomId;
    const conflicts = await Booking.find(filter).select("room");
    return { bookedRoomIds: conflicts.map((b) => b.room.toString()) };
  },

  async getAll(query) {
    const filter = {};
    if (query.status) filter.status = query.status;
    if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
    if (query.search) {
      filter.$or = [
        { guestName: { $regex: query.search, $options: "i" } },
        { bookingRef: { $regex: query.search, $options: "i" } },
      ];
    }

    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate("room", "name pricePerNight category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Booking.countDocuments(filter),
    ]);

    return {
      bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  },

  async getById(id) {
    const booking = await Booking.findById(id).populate(
      "room",
      "name pricePerNight images category",
    );
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
  },

  async updateStatus(id, status) {
    const update = { status };
    if (status === "confirmed") update.paymentStatus = "confirmed";
    if (status === "cancelled") update.paymentStatus = "unpaid";

    const booking = await Booking.findByIdAndUpdate(id, update, {
      new: true,
    }).populate("room", "name pricePerNight");
    if (!booking) throw new AppError("Booking not found", 404);

    if (status === "confirmed") {
      emailService.sendGuestConfirmation(booking);
    }

    return booking;
  },

  async confirmInstallment(id, installmentNumber) {
    const booking = await Booking.findById(id);
    if (!booking) throw new AppError("Booking not found", 404);
    if (booking.paymentOption !== "installment") {
      throw new AppError("This booking does not use installment payment", 400);
    }

    const now = new Date();
    if (installmentNumber === 1) {
      booking.installment.firstPaymentStatus = "confirmed";
      booking.installment.firstPaymentConfirmedAt = now;
      booking.paymentStatus = "partial";
      booking.amountPaid = booking.installment.firstPaymentAmount || 0;
    } else if (installmentNumber === 2) {
      booking.installment.secondPaymentStatus = "confirmed";
      booking.installment.secondPaymentConfirmedAt = now;
      if (booking.installment.firstPaymentStatus === "confirmed") {
        booking.paymentStatus = "confirmed";
        booking.status = "confirmed";
      }
    } else {
      throw new AppError("Invalid installment number", 400);
    }

    await booking.save();
    const populated = await booking.populate("room", "name pricePerNight");

    if (booking.status === "confirmed") {
      emailService.sendGuestConfirmation(populated);
    } else if (installmentNumber === 1) {
      try {
        const continuationUrl = await bookingService.generateContinuationUrl(
          populated._id,
        );
        emailService.sendPartialPaymentEmail(populated, continuationUrl);
      } catch (err) {
        console.error("Failed to send partial payment email:", err.message);
      }
    }

    return populated;
  },

  async delete(id) {
    const booking = await Booking.findByIdAndDelete(id);
    if (!booking) throw new AppError("Booking not found", 404);
    return booking;
  },

  async sendInstallmentReminder(id) {
    const booking = await Booking.findById(id).populate(
      "room",
      "name pricePerNight",
    );
    if (!booking) throw new AppError("Booking not found", 404);

    if (booking.paymentStatus === "confirmed") {
      throw new AppError("Booking already fully paid", 400);
    }
    if (booking.status === "cancelled") {
      throw new AppError("Booking is cancelled", 400);
    }

    const continuationUrl = await bookingService.generateContinuationUrl(
      booking._id,
    );

    if (
      booking.paymentOption === "installment" &&
      booking.paymentStatus === "partial"
    ) {
      if (booking.installment?.secondPaymentStatus === "confirmed") {
        throw new AppError("Second payment already confirmed", 400);
      }
      await emailService.sendRemainingBalanceReminder(booking, continuationUrl);
      booking.installment.secondPaymentReminderSent = true;
    } else {
      await emailService.sendPaymentReminder(booking, 1, continuationUrl);
      booking.reminderEmails = booking.reminderEmails || {};
      booking.reminderEmails.firstSent = true;
    }

    await booking.save();
    return { booking, continuationUrl };
  },

  async generateContinuationUrl(bookingId) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("JWT_SECRET is not configured");

    const token = jwt.sign(
      { bookingId: bookingId.toString(), purpose: "payment_continuation" },
      secret,
      { expiresIn: `${TOKEN_TTL_HOURS}h` },
    );

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const expiry = new Date(Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000);

    await Booking.findByIdAndUpdate(bookingId, {
      continuationToken: tokenHash,
      continuationTokenExpiry: expiry,
    });

    return `${CLIENT_URL()}/booking/continue/${token}`;
  },

  async verifyContinuationToken(token) {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new AppError("Server misconfiguration", 500);

    let payload;
    try {
      payload = jwt.verify(token, secret);
    } catch {
      throw new AppError("Payment link is invalid or has expired", 401);
    }

    if (payload.purpose !== "payment_continuation") {
      throw new AppError("Invalid token purpose", 401);
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const booking = await Booking.findOne({
      _id: payload.bookingId,
      continuationToken: tokenHash,
      continuationTokenExpiry: { $gt: new Date() },
    }).populate("room", "name pricePerNight images category");

    if (!booking) {
      throw new AppError(
        "Payment link is invalid or has already been used",
        401,
      );
    }

    return booking;
  },

  async getBookedDates({ roomId, year, month }) {
    let dateFilter;
    let filterMonth = null;
    let filterYear = null;

    if (year && month) {
      const y = parseInt(year);
      const m = parseInt(month) - 1;
      filterYear = y;
      filterMonth = m;
      const startOfMonth = new Date(y, m, 1);
      const endOfMonth = new Date(y, m + 1, 0, 23, 59, 59);
      dateFilter = {
        $or: [
          { checkIn: { $gte: startOfMonth, $lte: endOfMonth } },
          { checkOut: { $gte: startOfMonth, $lte: endOfMonth } },
          { checkIn: { $lte: startOfMonth }, checkOut: { $gte: endOfMonth } },
        ],
      };
    } else {
      dateFilter = { checkOut: { $gte: new Date() } };
    }

    const query = {
      ...(roomId && { room: roomId }),
      status: { $in: ["pending", "confirmed"] },
      ...dateFilter,
    };

    const bookings = await Booking.find(query)
      .select("checkIn checkOut room status")
      .lean();
    const bookedDates = new Set();

    for (const b of bookings) {
      const d = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      d.setUTCHours(0, 0, 0, 0);
      end.setUTCHours(0, 0, 0, 0);
      const current = new Date(d);
      while (current <= end) {
        if (
          filterMonth === null ||
          (current.getUTCMonth() === filterMonth &&
            current.getUTCFullYear() === filterYear)
        ) {
          const yy = current.getUTCFullYear();
          const mm = String(current.getUTCMonth() + 1).padStart(2, "0");
          const dd = String(current.getUTCDate()).padStart(2, "0");
          bookedDates.add(`${yy}-${mm}-${dd}`);
        }
        current.setUTCDate(current.getUTCDate() + 1);
      }
    }

    return { dates: [...bookedDates], count: bookedDates.size };
  },
};

module.exports = bookingService;
```

---

### `backend/services/emailService.js`

```js
const logger = require("../config/logger");
const generateReceipt = require("../utils/generateReceipt");

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL;
const EMAIL_SERVICE_API_KEY = process.env.EMAIL_SERVICE_API_KEY;

async function callEmailService(payload) {
  if (!EMAIL_SERVICE_URL || !EMAIL_SERVICE_API_KEY) {
    logger.warn({ message: "Email service not configured" });
    return { success: false, error: "Email service not configured" };
  }
  try {
    const res = await fetch(EMAIL_SERVICE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": EMAIL_SERVICE_API_KEY,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      logger.error({ message: `Email service error (${payload.type})`, data });
      return { success: false, error: data.error || "Email service error" };
    }
    return data;
  } catch (err) {
    logger.error({
      message: `Email service unreachable (${payload.type})`,
      err: err.message,
    });
    return { success: false, error: err.message };
  }
}

async function toPdfBase64(booking, label) {
  try {
    const buf = await generateReceipt(booking);
    return buf.toString("base64");
  } catch (err) {
    logger.error({
      message: `PDF generation failed (${label})`,
      err: err.message,
    });
    return undefined;
  }
}

const emailService = {
  // 1. Guest gets booking received + payment link
  sendBookingConfirmationToGuest(booking) {
    callEmailService({ type: "booking_received", booking }).catch(() => {});
  },

  // 2. Admin notified of new booking
  sendBookingNotification(booking) {
    callEmailService({ type: "admin_new_booking", booking }).catch(() => {});
  },

  // 3. Guest receipt when payment proof uploaded (PDF attached)
  async sendAutoReceipt(booking) {
    const pdfBase64 = await toPdfBase64(booking, "auto receipt");
    callEmailService({ type: "payment_received", booking, pdfBase64 }).catch(
      () => {},
    );
  },

  // 4. Admin notified of payment proof upload (PDF attached)
  async sendAdminPaymentAlert({ booking, screenshotUrl }) {
    const pdfBase64 = await toPdfBase64(booking, "admin payment alert");
    callEmailService({
      type: "admin_payment_alert",
      booking,
      screenshotUrl,
      pdfBase64,
    }).catch(() => {});
  },

  // 5. Guest gets confirmation when admin confirms booking (PDF attached)
  async sendGuestConfirmation(booking) {
    const pdfBase64 = await toPdfBase64(booking, "guest confirmation");
    callEmailService({ type: "booking_confirmed", booking, pdfBase64 }).catch(
      () => {},
    );
  },

  // 6. Manual receipt send — awaitable, reports success/failure
  async sendReceiptEmail(booking, pdfBuffer) {
    const pdfBase64 = Buffer.isBuffer(pdfBuffer)
      ? pdfBuffer.toString("base64")
      : pdfBuffer;
    return callEmailService({ type: "payment_received", booking, pdfBase64 });
  },

  // 7. Payment reminder (reminderType 1 = first, 2 = final; optional continuationUrl)
  async sendPaymentReminder(booking, reminderType, continuationUrl) {
    return callEmailService({
      type: "payment_reminder",
      booking,
      reminderType,
      continuationUrl,
    });
  },

  // 8. Installment due reminder
  async sendInstallmentReminder(id) {
    const Booking = require("../models/Booking");
    const AppError = require("../utils/AppError");
    const booking = await Booking.findById(id).populate(
      "room",
      "name pricePerNight",
    );
    if (!booking) throw new AppError("Booking not found", 404);
    await callEmailService({
      type: "payment_reminder",
      booking,
      reminderType: 1,
    });
    return booking;
  },

  // 9. Partial payment email (sent after 1st installment confirmed, includes continuation link)
  async sendPartialPaymentEmail(booking, continuationUrl) {
    return callEmailService({
      type: "partial_payment",
      booking,
      continuationUrl,
    });
  },

  // 10. Remaining balance reminder (targeted installment reminder with continuation link)
  async sendRemainingBalanceReminder(booking, continuationUrl) {
    return callEmailService({
      type: "remaining_balance_reminder",
      booking,
      continuationUrl,
    });
  },

  // 11. Booking cancelled notification
  async sendPaymentCancelledEmail(booking, reason) {
    return callEmailService({ type: "booking_cancelled", booking, reason });
  },
};

module.exports = emailService;
```

---

### `backend/jobs/reminderJob.js`

```js
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

      if (hoursSinceBooking >= AUTO_CANCEL_HOURS) {
        booking.status = "cancelled";
        await booking.save();
        logger.info({
          message: "Booking auto-cancelled (48h unpaid)",
          bookingRef: booking.bookingRef,
        });
        continue;
      }

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
```

---

### `email-service/api/send.js` — Email Builder Patterns

The email service uses a **builder function** pattern. Each email type is a pure function that receives booking data and returns `{ to, subject, html }`.

**Shared shell (copy this for new projects):**

```js
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
    .btn { display: inline-block; background: #2C4A2E; color: #ffffff !important; padding: 14px 28px; text-decoration: none; letter-spacing: 1px; text-transform: uppercase; font-size: 12px; }
    .footer { text-align: center; padding: 30px 0; color: #6B7C3E; font-size: 12px; }
    .footer p { margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">YOUR RESORT NAME</h1>
      <p class="tagline">Your tagline here</p>
    </div>
    <div class="content">${content}</div>
    <div class="footer">
      <p><strong>Need assistance?</strong></p>
      <p>your@email.com</p>
      <p style="margin-top: 20px; color: #C4A882;">
        &copy; ${new Date().getFullYear()} Your Resort. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>`;
```

**Main handler dispatch (email service entry point):**

```js
switch (type) {
  case "booking_received":
    mailOptions = buildBookingReceived(booking, clientUrl);
    break;
  case "admin_new_booking":
    mailOptions = buildAdminNewBooking(booking, clientUrl);
    break;
  case "payment_reminder":
    mailOptions = buildPaymentReminder(booking, reminderType, clientUrl);
    break;
  case "payment_received":
    mailOptions = buildPaymentReceived(booking, screenshotUrl);
    break;
  case "admin_payment_alert":
    mailOptions = buildAdminPaymentAlert(booking, screenshotUrl, clientUrl);
    break;
  case "booking_confirmed":
    mailOptions = buildBookingConfirmed(booking);
    break;
  case "partial_payment":
    mailOptions = buildPartialPayment(booking, continuationUrl);
    break;
  case "remaining_balance_reminder":
    mailOptions = buildRemainingBalanceReminder(booking, continuationUrl);
    break;
  case "booking_cancelled":
    mailOptions = buildBookingCancelled(booking, reason, clientUrl);
    break;
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

await getTransporter().sendMail({ from: fromAddress(), ...mailOptions });
```

---

## Environment Variables Required

```env
# Backend
MONGODB_URI=
JWT_SECRET=
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CLIENT_URL=https://yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com
EMAIL_SERVICE_URL=https://your-email-service.vercel.app/api/send
EMAIL_SERVICE_API_KEY=your-secret-key
PROJECT_ID=BSR   # used for booking ref prefix (e.g. BSR-M2X9K3)

# Email Service
EMAIL_API_KEY=your-secret-key   # must match EMAIL_SERVICE_API_KEY above
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=reservations@yourdomain.com
SMTP_PASS=your-smtp-password
EMAIL_FROM="Your Resort" <reservations@yourdomain.com>
RESORT_EMAIL=reservations@yourdomain.com
RESORT_PHONE=+63 XXX XXX XXXX
FACEBOOK_PAGE_URL=https://facebook.com/yourpage
```
