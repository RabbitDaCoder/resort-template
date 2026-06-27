import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Upload,
  Building2,
  Smartphone,
  CheckCircle2,
  CalendarDays,
  Users,
  Bed,
  Hash,
  Lock,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  getBookingById,
  getPaymentDetails,
  uploadPaymentProof,
} from "../services/api";

const fmtMoney = (n) => `₱${Number(n || 0).toLocaleString("en-PH")}`;
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-PH", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function BookingPayment() {
  const { id } = useParams();
  const navigate = useNavigate();

  /* ---------- State (logic preserved exactly) ---------- */
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [error, setError] = useState("");
  const [paymentOption, setPaymentOption] = useState("full");
  const [paymentMethod, setPaymentMethod] = useState("bank");

  useEffect(() => {
    Promise.all([getBookingById(id), getPaymentDetails()]).then(
      ([bookingRes, paymentRes]) => {
        const b = bookingRes.data.data || bookingRes.data;
        const p = paymentRes.data.data || paymentRes.data;
        setBooking(b);
        setPayment(p);
        if (b.paymentOption) setPaymentOption(b.paymentOption);
        if (b.paymentScreenshot) setUploaded(true);
        if (
          b.paymentOption === "installment" &&
          b.installment?.firstPaymentScreenshot
        ) {
          // Show "Payment received" only if BOTH payments are submitted/confirmed,
          // or if only first exists and second has also been submitted.
          // Allow second payment upload as soon as first screenshot is uploaded
          // (no need to wait for admin confirmation of first payment).
          const secondSubmitted =
            b.installment?.secondPaymentScreenshot ||
            b.installment?.secondPaymentStatus === "confirmed" ||
            b.installment?.secondPaymentStatus === "pending";
          if (secondSubmitted) setUploaded(true);
        }
      },
    );
  }, [id]);

  const isInstallment = booking?.paymentOption === "installment";
  const installment = booking?.installment;

  // Second payment is available as soon as the first screenshot has been uploaded
  // (does NOT require admin to confirm first payment).
  const needsSecondPayment =
    isInstallment &&
    installment?.firstPaymentScreenshot &&
    installment?.secondPaymentStatus !== "confirmed" &&
    installment?.secondPaymentStatus !== "pending";

  const currentInstallmentNumber = needsSecondPayment ? 2 : 1;

  const amountDue = isInstallment
    ? needsSecondPayment
      ? installment?.secondPaymentAmount
      : installment?.firstPaymentAmount
    : booking?.totalAmount;

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(f);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a payment screenshot.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("paymentScreenshot", file);
      if (!isInstallment && paymentOption) {
        formData.append("paymentOption", paymentOption);
      }
      if (paymentOption === "installment" || isInstallment) {
        formData.append("installmentNumber", currentInstallmentNumber);
      }
      await uploadPaymentProof(id, formData);
      setUploaded(true);
      toast.success("Payment received. Confirming your stay…");
      navigate(`/booking/${id}/success`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  if (!booking || !payment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-warm-white">
        <div className="text-center">
          <div className="w-9 h-9 border border-teal/30 border-t-teal rounded-full animate-spin mx-auto mb-5" />
          <p className="text-[11px] tracking-[0.3em] uppercase text-charcoal/40">
            Preparing your reservation
          </p>
        </div>
      </div>
    );
  }

  const showOptionPicker =
    !booking.paymentOption ||
    (booking.paymentOption === "full" &&
      !booking.paymentScreenshot &&
      booking.paymentStatus === "unpaid");

  return (
    <div className="bg-warm-white">
      <PaymentHero stepLabel="Step 02 · Payment" />

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* ---------- LEFT: payment flow ---------- */}
            <div className="lg:col-span-7 space-y-8">
              {/* Payment option picker */}
              {showOptionPicker && (
                <Card>
                  <Eyebrow>Payment Option</Eyebrow>
                  <CardTitle>How would you like to settle?</CardTitle>
                  <div className="mt-7 grid sm:grid-cols-2 gap-4">
                    <ChoiceTile
                      active={paymentOption === "full"}
                      onClick={() => setPaymentOption("full")}
                      title="Full payment"
                      subtitle={`Pay ${fmtMoney(booking.totalAmount)} now and you're set.`}
                    />
                    <ChoiceTile
                      active={paymentOption === "installment"}
                      onClick={() => setPaymentOption("installment")}
                      title="Pay half now"
                      subtitle={`${fmtMoney(Math.ceil(booking.totalAmount / 2))} now, balance on arrival.`}
                    />
                  </div>
                  {paymentOption === "installment" && (
                    <div className="mt-6 bg-seafoam/50 px-5 py-4 text-sm text-charcoal/75 leading-relaxed">
                      <p>
                        <span className="font-medium text-teal-dark">
                          1st payment:
                        </span>{" "}
                        {fmtMoney(Math.ceil(booking.totalAmount / 2))} (now)
                      </p>
                      <p className="mt-1">
                        <span className="font-medium text-teal-dark">
                          2nd payment:
                        </span>{" "}
                        {fmtMoney(
                          booking.totalAmount -
                            Math.ceil(booking.totalAmount / 2),
                        )}{" "}
                        (on check-in day)
                      </p>
                    </div>
                  )}
                </Card>
              )}

              {/* Installment status */}
              {isInstallment && (
                <Card>
                  <Eyebrow>Installment Progress</Eyebrow>
                  <CardTitle>Your payment timeline</CardTitle>
                  <div className="mt-7 space-y-5">
                    <InstallmentRow
                      label="1st payment"
                      amount={installment?.firstPaymentAmount}
                      status={installment?.firstPaymentStatus}
                    />
                    <InstallmentRow
                      label="2nd payment"
                      amount={installment?.secondPaymentAmount}
                      status={installment?.secondPaymentStatus}
                      due={installment?.secondPaymentDueDate}
                    />
                  </div>
                </Card>
              )}

              {/* Amount due */}
              {!uploaded && (
                <div className="bg-teal-dark text-white p-8 lg:p-10">
                  <div className="flex items-start justify-between gap-6 flex-wrap">
                    <div>
                      <p className="text-[11px] tracking-[0.32em] uppercase text-sage font-medium">
                        {isInstallment
                          ? `${currentInstallmentNumber === 1 ? "First" : "Second"} installment`
                          : "Amount due today"}
                      </p>
                      <p className="mt-3 font-serif text-5xl">
                        {fmtMoney(amountDue)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] tracking-[0.28em] uppercase text-white/70">
                      <Lock size={12} /> Secure
                    </div>
                  </div>
                </div>
              )}

              {/* Method picker */}
              <Card>
                <Eyebrow>Payment Method</Eyebrow>
                <CardTitle>Choose how to pay</CardTitle>
                <div className="mt-7 grid sm:grid-cols-2 gap-4">
                  <MethodTile
                    icon={Building2}
                    active={paymentMethod === "bank"}
                    onClick={() => setPaymentMethod("bank")}
                    title="Online Transfer"
                    subtitle="Direct deposit"
                  />
                  {payment.gcashNumber && (
                    <MethodTile
                      icon={Smartphone}
                      active={paymentMethod === "gcash"}
                      onClick={() => setPaymentMethod("gcash")}
                      title="GCash"
                      subtitle="Mobile transfer"
                    />
                  )}
                </div>

                {/* Coming-soon payment rails */}
                <div className="mt-6 pt-6 border-t border-charcoal/8">
                  <p className="text-[10px] tracking-[0.28em] uppercase text-charcoal/40 font-medium mb-3">
                    Arriving soon
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {["Visa / Mastercard", "Stripe", "PayPal", "Paystack"].map(
                      (m) => (
                        <div
                          key={m}
                          className="text-[10px] tracking-[0.14em] uppercase text-charcoal/40 border border-dashed border-charcoal/15 px-3 py-2.5 text-center bg-warm-white"
                        >
                          {m}
                        </div>
                      ),
                    )}
                  </div>
                  <p className="mt-3 text-[11px] text-charcoal/45 leading-relaxed">
                    Instant card & wallet checkout is in the works. For now,
                    transfers are confirmed by our concierge within 24 hours.
                  </p>
                </div>
              </Card>

              {/* Method details */}
              <Card>
                {paymentMethod === "bank" ? (
                  <>
                    <Eyebrow>Online Transfer Details</Eyebrow>
                    <CardTitle>Send to</CardTitle>
                    <DetailGrid
                      items={[
                        ["Bank", payment.bankName],
                        ["Account name", payment.accountName],
                        ["Account number", payment.accountNumber, true],
                      ]}
                    />
                    {payment.instructions && (
                      <Note>{payment.instructions}</Note>
                    )}
                  </>
                ) : (
                  <>
                    <Eyebrow>GCash Details</Eyebrow>
                    <CardTitle>Send to</CardTitle>
                    <DetailGrid
                      items={[
                        ["GCash name", payment.gcashName],
                        ["GCash number", payment.gcashNumber, true],
                      ]}
                    />
                    {payment.gcashInstructions && (
                      <Note>{payment.gcashInstructions}</Note>
                    )}
                  </>
                )}
              </Card>

              {/* Upload */}
              {uploaded ? (
                <Card>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0">
                      <CheckCircle2 size={22} />
                    </div>
                    <div>
                      <CardTitle small>Payment received</CardTitle>
                      <p className="mt-3 text-charcoal/65 leading-relaxed">
                        We've received your screenshot and our concierge will
                        confirm your booking within 24 hours.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card>
                  <Eyebrow>Upload Proof</Eyebrow>
                  <CardTitle>Submit your payment screenshot</CardTitle>
                  <p className="mt-3 text-charcoal/55 text-sm leading-relaxed">
                    After completing the transfer, upload a screenshot or photo
                    of your payment confirmation for {fmtMoney(amountDue)}.
                  </p>

                  <form onSubmit={handleUpload} className="mt-7 space-y-5">
                    <label className="block cursor-pointer">
                      <div
                        className={`border-2 border-dashed p-10 text-center transition-colors ${
                          file
                            ? "border-teal bg-teal/5"
                            : "border-charcoal/15 hover:border-teal/50 bg-warm-white"
                        }`}
                      >
                        {preview ? (
                          <img
                            src={preview}
                            alt="Preview"
                            className="max-h-56 mx-auto object-contain mb-4"
                          />
                        ) : (
                          <Upload
                            size={32}
                            strokeWidth={1.4}
                            className="mx-auto text-charcoal/30 mb-3"
                          />
                        )}
                        <p className="text-sm text-charcoal/70">
                          {file
                            ? file.name
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-[11px] text-charcoal/40 mt-1.5 tracking-wider">
                          PNG · JPG · WEBP — up to 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="sr-only"
                        onChange={handleFileChange}
                      />
                    </label>

                    {error && (
                      <div className="border-l-2 border-red-400 bg-red-50/60 px-5 py-4 text-sm text-red-700">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={uploading || !file}
                      className="w-full bg-teal-dark text-white py-4 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-teal transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {uploading ? "Submitting…" : "Submit payment"}
                      {!uploading && <ShieldCheck size={14} />}
                    </button>
                    <p className="text-[11px] text-charcoal/45 leading-relaxed text-center">
                      Submissions are encrypted in transit. Your concierge
                      reviews every booking personally.
                    </p>
                  </form>
                </Card>
              )}
            </div>

            {/* ---------- RIGHT: reservation summary ---------- */}
            <aside className="lg:col-span-5">
              <ReservationSummary booking={booking} />
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared layout                                                       */
/* ------------------------------------------------------------------ */

export function PaymentHero({
  stepLabel,
  title = "Complete your reservation",
}) {
  return (
    <section className="relative h-[42vh] min-h-[300px] overflow-hidden bg-teal-dark">
      <img
        src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />
      <div className="absolute inset-0 flex items-end">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-7xl mx-auto px-6 lg:px-10 w-full pb-14 lg:pb-20 text-white"
        >
          <p className="text-[11px] tracking-[0.35em] uppercase text-white/75 font-medium">
            {stepLabel}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mt-5 leading-[1.05]">
            {title}
          </h1>
        </motion.div>
      </div>
    </section>
  );
}

function Card({ children }) {
  return (
    <div className="bg-warm-white border border-charcoal/10 p-8 lg:p-10">
      {children}
    </div>
  );
}

function Eyebrow({ children }) {
  return (
    <p className="text-[11px] tracking-[0.32em] uppercase text-tan font-medium">
      {children}
    </p>
  );
}

function CardTitle({ children, small }) {
  return (
    <h2
      className={`font-serif text-teal-dark mt-3 leading-tight ${
        small ? "text-2xl" : "text-3xl"
      }`}
    >
      {children}
    </h2>
  );
}

function ChoiceTile({ active, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-6 transition-all ${
        active
          ? "bg-teal-dark text-white"
          : "bg-warm-white border border-charcoal/15 text-charcoal hover:border-teal/40"
      }`}
    >
      <p
        className={`font-serif text-xl ${active ? "text-white" : "text-teal-dark"}`}
      >
        {title}
      </p>
      <p
        className={`mt-2 text-sm leading-relaxed ${
          active ? "text-white/80" : "text-charcoal/55"
        }`}
      >
        {subtitle}
      </p>
    </button>
  );
}

function MethodTile({ icon: Icon, active, onClick, title, subtitle }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-6 transition-all flex items-start gap-4 ${
        active
          ? "bg-teal-dark text-white"
          : "bg-warm-white border border-charcoal/15 text-charcoal hover:border-teal/40"
      }`}
    >
      <div
        className={`w-11 h-11 flex items-center justify-center shrink-0 ${
          active ? "bg-white/15" : "bg-seafoam"
        }`}
      >
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div>
        <p
          className={`font-medium ${active ? "text-white" : "text-teal-dark"}`}
        >
          {title}
        </p>
        <p
          className={`mt-1 text-xs ${
            active ? "text-white/70" : "text-charcoal/50"
          }`}
        >
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function DetailGrid({ items }) {
  return (
    <dl className="mt-7 divide-y divide-charcoal/8">
      {items.map(([label, value, mono]) => (
        <div
          key={label}
          className="grid grid-cols-[1fr_auto] gap-6 items-center py-3.5"
        >
          <dt className="text-[10px] tracking-[0.28em] uppercase text-charcoal/45 font-medium">
            {label}
          </dt>
          <dd
            className={`text-charcoal/85 text-right ${mono ? "font-mono text-sm" : ""}`}
          >
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function Note({ children }) {
  return (
    <div className="mt-6 bg-seafoam/50 border-l-2 border-tan px-5 py-4 text-sm text-charcoal/70 leading-relaxed">
      {children}
    </div>
  );
}

function InstallmentRow({ label, amount, status, due }) {
  const styles = {
    confirmed: "bg-teal/10 text-teal-dark",
    pending: "bg-tan/15 text-tan",
  };
  const labels = {
    confirmed: "Confirmed",
    pending: "Under Review",
  };
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-charcoal/8 last:border-b-0">
      <div>
        <p className="text-charcoal font-medium">{label}</p>
        <p className="text-xs text-charcoal/50 mt-0.5">
          {fmtMoney(amount)}
          {due && (
            <span className="ml-2 text-charcoal/40">
              · due {new Date(due).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
      <span
        className={`text-[10px] tracking-[0.22em] uppercase px-3 py-1.5 ${
          styles[status] || "bg-charcoal/8 text-charcoal/55"
        }`}
      >
        {labels[status] || "Unpaid"}
      </span>
    </div>
  );
}

function ReservationSummary({ booking }) {
  return (
    <div className="lg:sticky lg:top-28 bg-warm-white border border-charcoal/10 p-8 lg:p-10 shadow-[0_20px_50px_-30px_rgba(13,59,66,0.2)]">
      <Eyebrow>Reservation</Eyebrow>
      <h3 className="font-serif text-2xl text-teal-dark mt-3">Your stay</h3>

      {booking.room?.images?.[0] && (
        <div className="mt-6 aspect-[4/3] overflow-hidden">
          <img
            src={booking.room.images[0]}
            alt={booking.room.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="mt-6">
        <p className="text-[10px] tracking-[0.28em] uppercase text-tan font-medium">
          {booking.room?.category}
        </p>
        <p className="mt-2 font-serif text-2xl text-teal-dark">
          {booking.room?.name}
        </p>
      </div>

      <dl className="mt-7 space-y-4 text-sm border-t border-charcoal/10 pt-6">
        <SummaryLine icon={Hash} label="Reference">
          <span className="font-mono text-teal-dark">{booking.bookingRef}</span>
        </SummaryLine>
        <SummaryLine icon={Users} label="Guest">
          {booking.guestName}
        </SummaryLine>
        <SummaryLine icon={CalendarDays} label="Check-in">
          {fmtDate(booking.checkIn)}
        </SummaryLine>
        <SummaryLine icon={CalendarDays} label="Check-out">
          {fmtDate(booking.checkOut)}
        </SummaryLine>
        <SummaryLine icon={Bed} label="Nights">
          {booking.nights}
        </SummaryLine>
      </dl>

      <div className="mt-7 pt-6 border-t border-charcoal/10 flex items-baseline justify-between">
        <span className="text-[10px] tracking-[0.28em] uppercase text-charcoal/45 font-medium">
          Total
        </span>
        <span className="font-serif text-3xl text-teal-dark">
          {fmtMoney(booking.totalAmount)}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-charcoal/55">
        <ShieldCheck size={13} className="text-teal" />
        Best rate guaranteed · concierge support 24/7
      </div>
    </div>
  );
}

function SummaryLine({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <Icon size={14} className="text-tan mt-1 shrink-0" />
      <div className="flex-1">
        <p className="text-[10px] tracking-[0.28em] uppercase text-charcoal/45 font-medium">
          {label}
        </p>
        <p className="mt-1 text-charcoal/85">{children}</p>
      </div>
    </div>
  );
}
