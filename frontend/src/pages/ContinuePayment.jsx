import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { getContinuationBooking } from "../services/api";

/**
 * ContinuePayment
 * --------------------------------------------------------------
 * Resumes a payment flow from a secure email link (`/booking/continue/:token`).
 * The token is exchanged for the booking, then the guest is forwarded to the
 * standard `/booking/:id/payment` experience — preserving all payment logic.
 */
export default function ContinuePayment() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getContinuationBooking(token)
      .then((res) => {
        if (cancelled) return;
        const booking = res.data.data || res.data;
        if (booking?._id) {
          navigate(`/booking/${booking._id}/payment`, { replace: true });
        } else {
          setError("This link is no longer valid.");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err.response?.data?.message ||
            "This payment link has expired or is invalid.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [token, navigate]);

  if (error) {
    return (
      <div className="min-h-[80vh] bg-warm-white flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg w-full text-center"
        >
          <p className="text-[11px] tracking-[0.32em] uppercase text-tan font-medium">
            Payment Link
          </p>
          <h1 className="mt-5 font-serif text-4xl text-teal-dark leading-tight">
            This link can't be opened.
          </h1>
          <p className="mt-5 text-charcoal/60 leading-relaxed font-light">
            {error} If you believe this is in error, please reach our concierge
            and we'll help right away.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="border border-charcoal/20 text-charcoal/75 px-7 py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-charcoal/5 transition-colors"
            >
              Contact concierge
            </Link>
            <Link
              to="/"
              className="bg-teal text-white px-7 py-3.5 text-[11px] tracking-[0.28em] uppercase font-semibold hover:bg-teal-dark transition-colors flex items-center gap-2"
            >
              Return home <ArrowRight size={13} />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-warm-white flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-md"
      >
        <div className="w-12 h-12 mx-auto rounded-full bg-teal/10 text-teal flex items-center justify-center mb-7">
          <ShieldCheck size={20} strokeWidth={1.5} />
        </div>
        <p className="text-[11px] tracking-[0.32em] uppercase text-tan font-medium">
          Verifying your link
        </p>
        <h1 className="mt-5 font-serif text-3xl lg:text-4xl text-teal-dark leading-tight">
          Re-opening your reservation…
        </h1>
        <p className="mt-5 text-charcoal/55 leading-relaxed font-light">
          One quiet moment while we securely retrieve your stay and guide you
          back to payment.
        </p>
        <div className="mt-9 w-9 h-9 mx-auto border border-teal/30 border-t-teal rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}
