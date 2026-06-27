import { useState } from "react";

export default function ContactStrip() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    checkin: "",
    checkout: "",
  });

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // placeholder — wire up later
    alert("Thank you! We will get back to you soon.");
    setForm({ name: "", email: "", phone: "", checkin: "", checkout: "" });
  };

  return (
    <section className="bg-forest py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl text-white mb-2">Get In Touch</h2>
          <p className="text-sm text-white/60">Plan your stay with us</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-sand"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-sand"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="bg-white/10 border border-white/20 text-white placeholder-white/40 px-4 py-3 text-sm focus:outline-none focus:border-sand"
          />
          <input
            type="date"
            name="checkin"
            value={form.checkin}
            onChange={handleChange}
            required
            className="bg-white/10 border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-sand"
          />
          <input
            type="date"
            name="checkout"
            value={form.checkout}
            onChange={handleChange}
            required
            className="bg-white/10 border border-white/20 text-white px-4 py-3 text-sm focus:outline-none focus:border-sand"
          />
          <button
            type="submit"
            className="bg-sand text-charcoal font-medium uppercase tracking-[0.12em] text-sm py-3 hover:bg-white hover:text-forest transition-colors duration-300"
          >
            Send
          </button>
        </form>
      </div>
    </section>
  );
}
