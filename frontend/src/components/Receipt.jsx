import { forwardRef } from "react";
import { brand } from "../lib/brand";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0,
  }).format(amount || 0);

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const Receipt = forwardRef(({ booking }, ref) => {
  if (!booking) return null;

  const room = booking.room || {};
  const ratePerNight =
    room.pricePerNight || booking.totalAmount / booking.nights;

  return (
    <div
      ref={ref}
      style={{
        width: "595px",
        padding: "50px 45px",
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        color: "#1A1A1A",
        backgroundColor: "#ffffff",
        lineHeight: 1.5,
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          borderBottom: "2px solid #C4A882",
          paddingBottom: "25px",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "28px",
            fontWeight: 400,
            color: "#2C4A2E",
            letterSpacing: "4px",
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          {brand.displayName}
        </h1>
        <p
          style={{
            fontSize: "11px",
            color: "#6B7C3E",
            letterSpacing: "3px",
            textTransform: "uppercase",
            marginTop: "6px",
          }}
        >
          {brand.tagline}
        </p>
      </div>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "20px",
            color: "#2C4A2E",
            margin: "0 0 5px",
          }}
        >
          Booking Confirmation
        </h2>
        <p style={{ fontSize: "12px", color: "#6B7C3E" }}>
          {new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Reference Box */}
      <div
        style={{
          background: "#F5F4F0",
          padding: "18px",
          textAlign: "center",
          border: "1px solid #e8e4dd",
          marginBottom: "30px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            color: "#6B7C3E",
            letterSpacing: "2px",
            textTransform: "uppercase",
            margin: "0 0 6px",
          }}
        >
          Booking Reference
        </p>
        <p
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#2C4A2E",
            fontFamily: "'Courier New', monospace",
            letterSpacing: "2px",
            margin: 0,
          }}
        >
          {booking.bookingRef}
        </p>
      </div>

      {/* Guest Details */}
      <div style={{ marginBottom: "25px" }}>
        <h3
          style={{
            fontSize: "11px",
            color: "#6B7C3E",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px",
            borderBottom: "1px solid #e8e4dd",
            paddingBottom: "8px",
          }}
        >
          Guest Details
        </h3>
        <table
          style={{
            width: "100%",
            fontSize: "13px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ padding: "6px 0", color: "#6B7C3E", width: "140px" }}
              >
                Name
              </td>
              <td style={{ padding: "6px 0", fontWeight: 500 }}>
                {booking.guestName}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Email</td>
              <td style={{ padding: "6px 0" }}>{booking.guestEmail}</td>
            </tr>
            {booking.guestPhone && (
              <tr>
                <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Phone</td>
                <td style={{ padding: "6px 0" }}>{booking.guestPhone}</td>
              </tr>
            )}
            {booking.numberOfGuests && (
              <tr>
                <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Guests</td>
                <td style={{ padding: "6px 0" }}>{booking.numberOfGuests}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Reservation Details */}
      <div style={{ marginBottom: "25px" }}>
        <h3
          style={{
            fontSize: "11px",
            color: "#6B7C3E",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px",
            borderBottom: "1px solid #e8e4dd",
            paddingBottom: "8px",
          }}
        >
          Reservation Details
        </h3>
        <table
          style={{
            width: "100%",
            fontSize: "13px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ padding: "6px 0", color: "#6B7C3E", width: "140px" }}
              >
                Room
              </td>
              <td style={{ padding: "6px 0", fontWeight: 500 }}>
                {room.name || "N/A"}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Check-in</td>
              <td style={{ padding: "6px 0" }}>
                {formatDate(booking.checkIn)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Check-out</td>
              <td style={{ padding: "6px 0" }}>
                {formatDate(booking.checkOut)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Nights</td>
              <td style={{ padding: "6px 0" }}>{booking.nights}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment Summary */}
      <div style={{ marginBottom: "30px" }}>
        <h3
          style={{
            fontSize: "11px",
            color: "#6B7C3E",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "12px",
            borderBottom: "1px solid #e8e4dd",
            paddingBottom: "8px",
          }}
        >
          Payment Summary
        </h3>
        <table
          style={{
            width: "100%",
            fontSize: "13px",
            borderCollapse: "collapse",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{ padding: "6px 0", color: "#6B7C3E", width: "140px" }}
              >
                Rate per Night
              </td>
              <td style={{ padding: "6px 0" }}>
                {formatCurrency(ratePerNight)}
              </td>
            </tr>
            <tr>
              <td style={{ padding: "6px 0", color: "#6B7C3E" }}>Nights</td>
              <td style={{ padding: "6px 0" }}>× {booking.nights}</td>
            </tr>
            <tr>
              <td
                style={{
                  padding: "12px 0 6px",
                  color: "#2C4A2E",
                  fontWeight: "bold",
                  fontSize: "15px",
                  borderTop: "2px solid #C4A882",
                }}
              >
                Total Amount
              </td>
              <td
                style={{
                  padding: "12px 0 6px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  color: "#2C4A2E",
                  borderTop: "2px solid #C4A882",
                }}
              >
                {formatCurrency(booking.totalAmount)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Special Requests */}
      {booking.specialRequests && (
        <div style={{ marginBottom: "30px" }}>
          <h3
            style={{
              fontSize: "11px",
              color: "#6B7C3E",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            Special Requests
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#1A1A1A",
              background: "#F5F4F0",
              padding: "12px 16px",
              border: "1px solid #e8e4dd",
              margin: 0,
            }}
          >
            {booking.specialRequests}
          </p>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          borderTop: "2px solid #C4A882",
          paddingTop: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "11px", color: "#6B7C3E", marginBottom: "3px" }}>
          Thank you for choosing {brand.displayName}
        </p>
        <p style={{ fontSize: "11px", color: "#999", margin: 0 }}>
          {brand.email} &nbsp;|&nbsp; {brand.domain}
        </p>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export default Receipt;
