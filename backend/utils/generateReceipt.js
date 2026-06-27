const PDFDocument = require("pdfkit");

const optionalEnv = (value) => {
  const normalized = String(value || "").trim();
  if (!normalized || normalized.toLowerCase() === "null") return null;
  return normalized;
};

/**
 * Generate a PDF receipt buffer for a booking.
 * @param {Object} booking - Populated booking document (with room)
 * @returns {Promise<Buffer>} PDF as a Buffer
 */
function generateReceipt(booking) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const forest = "#2C4A2E";
    const olive = "#6B7C3E";
    const sand = "#C4A882";
    const charcoal = "#1A1A1A";
    const lightGray = "#F5F4F0";

    const pageWidth = doc.page.width - 100; // 50 margin each side

    // ── Header ──
    doc.fontSize(24).fillColor(forest).text("Discovery Samal Resort", 50, 50, {
      align: "center",
      characterSpacing: 4,
    });

    doc
      .fontSize(9)
      .fillColor(olive)
      .text("Your ultimate beachside playground", {
        align: "center",
        characterSpacing: 2,
      });

    doc.moveDown(0.5);

    // Divider
    doc
      .strokeColor(sand)
      .lineWidth(1.5)
      .moveTo(50, doc.y)
      .lineTo(50 + pageWidth, doc.y)
      .stroke();

    doc.moveDown(1);

    // ── Title ──
    doc
      .fontSize(18)
      .fillColor(forest)
      .text("BOOKING RECEIPT", { align: "center" });
    doc.moveDown(1.5);

    // ── Reference box ──
    const refBoxY = doc.y;
    doc.rect(150, refBoxY, pageWidth - 200, 50).fill(lightGray);

    doc
      .fontSize(8)
      .fillColor(olive)
      .text("BOOKING REFERENCE", 150, refBoxY + 10, {
        align: "center",
        width: pageWidth - 200,
      });

    doc
      .fontSize(16)
      .fillColor(forest)
      .font("Courier-Bold")
      .text(booking.bookingRef || "N/A", 150, refBoxY + 25, {
        align: "center",
        width: pageWidth - 200,
      });

    doc.font("Helvetica");
    doc.y = refBoxY + 65;
    doc.moveDown(1);

    // ── Booking Details ──
    const formatDate = (date) =>
      new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    const formatCurrency = (amount) =>
      `₱${Number(amount || 0).toLocaleString("en-PH")}`;

    const details = [
      ["Guest Name", booking.guestName],
      ["Email", booking.guestEmail],
      ["Phone", booking.guestPhone || "N/A"],
      ["Room", booking.room?.name || "N/A"],
      ["Category", booking.room?.category || "N/A"],
      ["Check-in", formatDate(booking.checkIn)],
      ["Check-out", formatDate(booking.checkOut)],
      ["Nights", String(booking.nights)],
      ["Guests", String(booking.numberOfGuests)],
    ];

    if (booking.specialRequests) {
      details.push(["Special Requests", booking.specialRequests]);
    }

    const labelX = 80;
    const valueX = 230;
    const rowHeight = 28;

    details.forEach(([label, value], i) => {
      const rowY = doc.y;

      // Alternate row background
      if (i % 2 === 0) {
        doc.rect(50, rowY - 4, pageWidth, rowHeight).fill(lightGray);
      }

      doc
        .fontSize(10)
        .fillColor(olive)
        .text(label, labelX, rowY, { width: 140 });

      doc
        .fontSize(10)
        .fillColor(charcoal)
        .font("Helvetica-Bold")
        .text(value, valueX, rowY, { width: pageWidth - 200 });

      doc.font("Helvetica");
      doc.y = rowY + rowHeight;
    });

    // ── Total Amount ──
    doc.moveDown(0.5);
    doc
      .strokeColor(sand)
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(50 + pageWidth, doc.y)
      .stroke();
    doc.moveDown(0.5);

    const totalY = doc.y;
    doc
      .fontSize(12)
      .fillColor(olive)
      .text("Total Amount", labelX, totalY, { width: 140 });
    doc
      .fontSize(16)
      .fillColor(forest)
      .font("Helvetica-Bold")
      .text(formatCurrency(booking.totalAmount), valueX, totalY - 2, {
        width: pageWidth - 200,
      });
    doc.font("Helvetica");
    doc.moveDown(1.5);

    // ── Payment Status ──
    const statusY = doc.y;
    doc.rect(50, statusY, pageWidth, 50).fill(lightGray);

    const paymentLabel =
      booking.paymentStatus === "confirmed"
        ? "Payment Confirmed"
        : "Payment Proof Submitted — Under Review";

    doc
      .fontSize(11)
      .fillColor(forest)
      .font("Helvetica-Bold")
      .text(paymentLabel, 50, statusY + 12, {
        align: "center",
        width: pageWidth,
      });

    doc
      .fontSize(9)
      .fillColor(olive)
      .font("Helvetica")
      .text(
        `Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`,
        50,
        statusY + 30,
        { align: "center", width: pageWidth },
      );

    doc.y = statusY + 65;
    doc.moveDown(1);

    // ── Contact Info ──
    const contactY = doc.y;
    doc.rect(50, contactY, pageWidth, 70).fill(forest);

    const resortPhone = optionalEnv(process.env.RESORT_PHONE);
    const resortEmail =
      optionalEnv(process.env.RESORT_EMAIL) ||
      process.env.SMTP_USER ||
      "reservations@discoverysamal-resort.org";
    const facebookPageUrl =
      optionalEnv(process.env.FACEBOOK_PAGE_URL) || "facebook.com";

    doc
      .fontSize(8)
      .fillColor(sand)
      .text("CONTACT US", 50, contactY + 10, {
        align: "center",
        width: pageWidth,
        characterSpacing: 2,
      });

    doc
      .fontSize(10)
      .fillColor("#ffffff")
      .text(
        `${resortPhone ? `${resortPhone}  |  ` : ""}${resortEmail}`,
        50,
        contactY + 28,
        {
          align: "center",
          width: pageWidth,
        },
      );

    doc
      .fontSize(9)
      .fillColor(sand)
      .text(facebookPageUrl.replace(/^https?:\/\//, ""), 50, contactY + 46, {
        align: "center",
        width: pageWidth,
      });

    // ── Footer ──
    doc.moveDown(3);
    doc
      .fontSize(8)
      .fillColor(sand)
      .text(
        `© ${new Date().getFullYear()} Discovery Samal Resort. All rights reserved.`,
        { align: "center" },
      );

    doc.end();
  });
}

module.exports = generateReceipt;
