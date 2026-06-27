import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PromoModal from "../components/PromoModal";
import MobileBookingBar from "../components/booking/MobileBookingBar";
import { getSocialLinks } from "../services/api";
import { brand } from "../lib/brand";

const DEFAULTS = {
  phone: brand.phone,
  whatsapp: brand.phone,
  email: brand.email,
  facebookUrl: brand.facebookPageUrl,
};

export default function MainLayout() {
  const [social, setSocial] = useState(DEFAULTS);

  useEffect(() => {
    getSocialLinks()
      .then((res) => {
        const d = res.data.data || {};
        setSocial({
          phone: d.phone || DEFAULTS.phone,
          whatsapp: d.whatsapp || DEFAULTS.whatsapp,
          email: d.email || DEFAULTS.email,
          facebookUrl: d.facebookUrl || DEFAULTS.facebookUrl,
        });
      })
      .catch(() => {}); // keep brand defaults on failure
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer social={social} />
      <PromoModal />
      <MobileBookingBar />
    </div>
  );
}
