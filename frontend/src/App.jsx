import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Amenities from "./pages/Amenities";
import Rooms from "./pages/Rooms";
import Activities from "./pages/Activities";
import Restaurants from "./pages/Restaurants";
import Events from "./pages/Events";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Offer from "./pages/Offer";
import Booking from "./pages/Booking";
import BookingPayment from "./pages/BookingPayment";
import BookingSuccess from "./pages/BookingSuccess";
import ContinuePayment from "./pages/ContinuePayment";
import Login from "./pages/Login";
import RoomDetails from "./pages/RoomDetails";
import Dashboard from "./pages/admin/Dashboard";
import ManageRooms from "./pages/admin/ManageRooms";
import ViewBookings from "./pages/admin/ViewBookings";
import PendingPayments from "./pages/admin/PendingPayments";
import PaymentSettingsPage from "./pages/admin/PaymentSettingsPage";
import AdminDiscounts from "./pages/admin/AdminDiscounts";
import SocialManager from "./pages/admin/SocialManager";

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:slug" element={<RoomDetails />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/events" element={<Events />} />
          <Route path="/about" element={<About />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/offers" element={<Offer />} />
          <Route path="/offers/:slug" element={<Offer />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/booking/:id/payment" element={<BookingPayment />} />
          <Route path="/booking/:id/success" element={<BookingSuccess />} />
          <Route
            path="/booking/continue/:token"
            element={<ContinuePayment />}
          />
        </Route>
        <Route path="/owner/login" element={<Login />} />
        <Route path="/owner" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="rooms" element={<ManageRooms />} />
          <Route path="bookings" element={<ViewBookings />} />
          <Route path="payments" element={<PendingPayments />} />
          <Route path="discounts" element={<AdminDiscounts />} />
          <Route path="settings" element={<PaymentSettingsPage />} />
          <Route path="social" element={<SocialManager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
