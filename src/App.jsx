import React, { useMemo, useState } from "react";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  Home,
  Sofa,
  Droplets,
  Bug,
  BedDouble,
  Refrigerator,
  Snowflake,
  Wind,
  Building2,
  Brush,
  Phone,
  MessageCircle,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Star,
  ArrowRight,
  ArrowLeft,
  Heart,
  HelpCircle,
  Hammer,
  Wrench,
  Zap,
  Menu,
  X,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Sparkles,
  CalendarDays,
  Repeat2,
  Bot,
  Gift,
  FileText,
  BadgeCheck,
  Users,
} from "lucide-react";

const COMPANY_PHONE = "918637414008";

const services = [
  { id: "furnished", cat: "Deep Cleaning", name: "Furnished Deep Cleaning", price: 8.5, unit: "sq.ft", qty: 1000, icon: Home, image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80", tag: "Popular", duration: "5-7 hrs" },
  { id: "unfurnished", cat: "Deep Cleaning", name: "Unfurnished Deep Cleaning", price: 7.5, unit: "sq.ft", qty: 1000, icon: Building2, image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80", tag: "Move-in", duration: "4-6 hrs" },
  { id: "fridge", cat: "Kitchen", name: "Refrigerator Interior Cleaning", price: 850, unit: "unit", qty: 1, icon: Refrigerator, image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80", tag: "Kitchen", duration: "45 min" },
  { id: "ac", cat: "Home Care", name: "AC Filter Cleaning", price: 350, unit: "unit", qty: 1, icon: Snowflake, image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=900&q=80", tag: "AC Care", duration: "30 min" },
  { id: "sofa", cat: "Shampooing", name: "Sofa Shampooing", price: 550, unit: "seat", qty: 2, icon: Sofa, image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80", tag: "Most Loved", duration: "45-90 min" },
  { id: "bed-single", cat: "Shampooing", name: "Bed Shampooing – Single", price: 950, unit: "unit", qty: 1, icon: BedDouble, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", tag: "Hygiene", duration: "45 min" },
  { id: "bed-double", cat: "Shampooing", name: "Bed Shampooing – Double", price: 1100, unit: "unit", qty: 1, icon: BedDouble, image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80", tag: "Family Pick", duration: "60 min" },
  { id: "bed-king", cat: "Shampooing", name: "Bed Shampooing – King / Queen Size", price: 1200, unit: "unit", qty: 1, icon: BedDouble, image: "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80", tag: "Premium", duration: "75 min" },
  { id: "carpet", cat: "Shampooing", name: "Carpet Shampooing", price: 30, unit: "sq.ft", qty: 100, icon: Wind, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=900&q=80", tag: "Area Rate", duration: "1-3 hrs" },
  { id: "tank", cat: "Home Care", name: "Water Tank Cleaning", price: 2, unit: "litre", qty: 1000, icon: Droplets, image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80", tag: "Hygiene", duration: "1-2 hrs" },
  { id: "loft", cat: "Home Care", name: "Loft Interior Cleaning", price: 300, unit: "room", qty: 1, icon: Brush, image: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=900&q=80", tag: "Add-on", duration: "30 min" },
  { id: "pressure", cat: "Outdoor", name: "Exterior Pressure Washing", price: 4, unit: "sq.ft", qty: 500, icon: Droplets, image: "https://images.unsplash.com/photo-1621431794209-9d5e15f53e89?auto=format&fit=crop&w=900&q=80", tag: "Outdoor", duration: "2-4 hrs" },
  { id: "termite", cat: "Pest Control", name: "Termite Control Treatment", price: 14, unit: "sq.ft", qty: 500, icon: Bug, image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?auto=format&fit=crop&w=900&q=80", tag: "Protection", duration: "2-3 hrs" },
  { id: "pest", cat: "Pest Control", name: "General Pest Control Treatment", price: 3000, unit: "service", qty: 1, icon: Bug, image: "https://images.unsplash.com/photo-1601042879364-f3947d3f9c16?auto=format&fit=crop&w=900&q=80", tag: "Starts ₹3000", duration: "1 hr" },
];

const categories = ["All", "Deep Cleaning", "Shampooing", "Home Care", "Kitchen", "Outdoor", "Pest Control"];
const slots = ["08:00 AM", "10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:00 PM"];
const coupons = [
  { code: "FN100", value: 100, min: 999 },
  { code: "FN250", value: 250, min: 2499 },
  { code: "FNFIRST", value: 150, min: 0 },
];

const beforeAfter = [
  { title: "Sofa Shampooing", before: "Dusty sofa", after: "Fresh new-look sofa", b: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=900&q=60", a: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=90" },
  { title: "Kitchen Cleaning", before: "Greasy kitchen", after: "Bright clean kitchen", b: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=60", a: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=900&q=90" },
  { title: "Bedroom Cleaning", before: "Dusty bedroom", after: "Premium clean bedroom", b: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=60", a: "https://images.unsplash.com/photo-1615874694520-474822394e73?auto=format&fit=crop&w=900&q=90" },
  { title: "Hall Cleaning", before: "Dull hall", after: "Luxury clean hall", b: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=60", a: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=90" },
];

function money(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function Card({ children, className = "" }) {
  return <div className={`rounded-[1.7rem] border border-slate-100 bg-white p-5 shadow-sm ${className}`}>{children}</div>;
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#f5b72f] text-[#061b3f] shadow-lg">
        <Home size={30} />
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight">
          <span className="text-white">Fresh</span><span className="text-[#f5b72f]">Nest</span>
        </div>
        <div className="text-[10px] font-black tracking-[0.28em] text-white/70">CLEANING SERVICES</div>
      </div>
    </div>
  );
}

export default function FreshNestCustomerWebsite() {
  const [page, setPage] = useState("home");
  const [menu, setMenu] = useState(false);
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState(["sofa"]);
  const [coupon, setCoupon] = useState("FNFIRST");
  const [slot, setSlot] = useState("");
  const [payment, setPayment] = useState("");
  const [lang, setLang] = useState("EN");
  const [gift, setGift] = useState(false);
  const [photoName, setPhotoName] = useState("");
  const [booking, setBooking] = useState({ name: "", phone: "", address: "", date: "", mapLocation: "", notes: "" });
  const [bookings, setBookings] = useState([]);
  const [showOffer, setShowOffer] = useState(true);
  const [recentIndex, setRecentIndex] = useState(0);
  const [showOtp, setShowOtp] = useState(false);
  const [otpMobile, setOtpMobile] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [callback, setCallback] = useState({ name: "", phone: "", time: "" });
  const firebaseConfig = {
  apiKey: "AIzaSyDRf6GybMLt-vadzBcN9uyn706ipiPf8s",
  authDomain: "freshnest-90da8.firebaseapp.com",
  projectId: "freshnest-90da8",
  storageBucket: "freshnest-90da8.firebasestorage.app",
  messagingSenderId: "805813095058",
  appId: "1:805813095058:web:d8a4cf4da935b47c7db44b"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
  const filtered = category === "All" ? services : services.filter((service) => service.cat === category);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const activeCoupon = coupons.find((item) => item.code === coupon && subtotal >= item.min);
  const discount = activeCoupon ? activeCoupon.value : 0;
  const platformFee = cart.length ? 29 : 0;
  const total = Math.max(0, subtotal - discount + platformFee);
  const canConfirm = cart.length > 0 && booking.name.trim() && booking.phone.length >= 10 && booking.address.trim() && booking.date && slot && payment;
  const latest = bookings[0];
  const latestText = latest?.items?.[0] ? `${latest.items[0].name} • ${money(latest.total)}` : "No booking yet";

  function addService(service) {
    setCart((old) => {
      const found = old.find((item) => item.id === service.id);
      if (found) return old.map((item) => item.id === service.id ? { ...item, qty: item.qty + service.qty } : item);
      return [...old, { ...service, qty: service.qty || 1 }];
    });
  }

  function changeQty(id, delta) {
    setCart((old) => old.map((item) => item.id === id ? { ...item, qty: Math.max(0, Number(item.qty) + delta) } : item).filter((item) => item.qty > 0));
  }

  function setItemQty(id, value) {
    const qty = Math.max(0, Number(String(value).replace(/[^0-9.]/g, "") || 0));
    setCart((old) => old.map((item) => item.id === id ? { ...item, qty } : item).filter((item) => item.qty > 0));
  }

  function toggleFavorite(id) {
    setFavorites((old) => old.includes(id) ? old.filter((item) => item !== id) : [...old, id]);
  }

  function openBooking(service) {
    if (service) addService(service);
    setPage("booking");
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  }

  function useCurrentLocation() {
    if (!navigator.geolocation) return alert("Location not supported. Please type address.");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const value = `${position.coords.latitude.toFixed(6)},${position.coords.longitude.toFixed(6)}`;
        setBooking((old) => ({ ...old, mapLocation: value, address: old.address || value }));
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`;
        const opened = window.open(url, "_blank", "noopener,noreferrer");
        if (!opened) window.location.href = url;
      },
      () => alert("Location permission denied. Please type address.")
    );
  }

  function openGoogleMap() {
    const query = booking.mapLocation || booking.address || "Trichy Tamil Nadu";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  }

  function buildWhatsApp(order) {
    const text = `New FreshNest Booking\nBooking ID: ${order.id}\nCustomer: ${order.name}\nPhone: ${order.phone}\nAddress: ${order.address}\nMap: ${order.mapLocation || "Not shared"}\nDate: ${order.date}\nTime: ${order.slot}\nPayment: ${order.payment}\nGift Booking: ${order.gift ? "Yes" : "No"}\nNotes: ${order.notes || "-"}\n\nServices:\n${order.items.map((item) => `- ${item.name}: ${item.qty} ${item.unit} x ${money(item.price)} = ${money(item.qty * item.price)}`).join("\n")}\n\nSubtotal: ${money(order.subtotal)}\nDiscount: ${money(order.discount)}\nPlatform Fee: ${money(order.platformFee)}\nTotal: ${money(order.total)}`;
    return encodeURIComponent(text);
  }

  function sendWhatsApp(order) {
    if (!order) return;
    const url = `https://wa.me/${COMPANY_PHONE}?text=${buildWhatsApp(order)}`;
    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened) window.location.href = url;
  }

async function confirmBooking() {
    if (!canConfirm) return;
    const order = {
      id: `FN${Date.now().toString().slice(-8)}`,
      name: booking.name,
      phone: booking.phone,
      address: booking.address,
      mapLocation: booking.mapLocation,
      date: booking.date,
      slot,
      payment,
      notes: booking.notes,
      gift,
      photoName,
      items: cart,
      subtotal,
      discount,
      platformFee,
      total,
      status: "Confirmed",
      timeline: ["Booked", "Team Assigned", "On the Way", "Work Started", "Completed"],
    };
    setBookings((old) => [order, ...old]);
  
try {
  await addDoc(collection(db, "bookings"), {
    ...order,
    source: "Website",
    paymentStatus: payment || "Pending",
    createdAt: serverTimestamp()
  });
  alert("Booking saved successfully!");
} catch (error) {
  console.error("Firebase booking save error:", error);
  alert("Firebase error: " + error.message);
}
sendWhatsApp(order);
    setTimeout(() => {
      setPage("home");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  }

  function repeatLast() {
    if (!latest) return;
    setCart(latest.items.map((item) => ({ ...item })));
    setBooking((old) => ({ ...old, name: latest.name, phone: latest.phone, address: latest.address }));
    setPage("booking");
  }

  if (page === "booking") {
    return <BookingPage {...{ cart, addService, changeQty, setItemQty, favorites, toggleFavorite, coupon, setCoupon, subtotal, discount, platformFee, total, booking, setBooking, slot, setSlot, payment, setPayment, canConfirm, confirmBooking, useCurrentLocation, openGoogleMap, latest, repeatLast, setPage, gift, setGift, photoName, setPhotoName }} />;
  }

  if (page === "myBooking") {
    return <MyBookingPage bookings={bookings} setPage={setPage} repeatLast={repeatLast} sendWhatsApp={sendWhatsApp} />;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-[#07162a]">
      <Header {...{ menu, setMenu, latestText, cartCount: cart.length, openBooking, openMyBooking: () => setPage("myBooking"), lang, setLang, setShowOtp, loggedIn }} />
      <StickyBookingBar openBooking={openBooking} />
      <main className="mx-auto max-w-7xl px-5">
        <Hero openBooking={openBooking} latest={latest} repeatLast={repeatLast} />
        <ServicesSection {...{ filtered, category, setCategory, favorites, toggleFavorite, openBooking }} />
        <PremiumFeatureShowcase />
        <PhaseOneGrowthSections openBooking={openBooking} />
        <PhaseTwoPowerSections latest={latest} bookings={bookings} sendWhatsApp={sendWhatsApp} callback={callback} setCallback={setCallback} />
        <PlansSection />
        <HomeSections />
      </main>
      <RecentBookingToast recentIndex={recentIndex} setRecentIndex={setRecentIndex} />
      {showOffer && <LaunchOfferPopup close={() => setShowOffer(false)} openBooking={openBooking} />}
      {showOtp && <OtpLoginModal close={() => setShowOtp(false)} otpMobile={otpMobile} setOtpMobile={setOtpMobile} otpCode={otpCode} setOtpCode={setOtpCode} setLoggedIn={setLoggedIn} />}
      <FloatingSupport />
    </div>
  );
}

function Header({ menu, setMenu, latestText, cartCount, openBooking, openMyBooking, lang, setLang, setShowOtp, loggedIn }) {
  return (
    <header className="sticky top-0 z-40 border-b border-[#15325c] bg-[#061b3f] text-white shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="hidden items-center gap-8 text-sm font-black md:flex">
          <a className="border-b-2 border-[#f5b72f] pb-2 text-[#f5b72f]" href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#plans">Packages</a>
          <button onClick={openMyBooking}>Bookings</button>
          <a href="#reviews">Offers</a>
          <a href="#faq">About Us</a>
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <button onClick={() => setLang(lang === "EN" ? "தமிழ்" : "EN")} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">{lang}</button>
          <button onClick={() => setShowOtp(true)} className="rounded-full bg-white/10 px-4 py-2 text-sm font-black">{loggedIn ? "Profile" : "Login"}</button>
          <button onClick={() => alert("Call FreshNest: 86374 14008")} className="rounded-xl bg-[#f5b72f] px-5 py-3 text-left text-sm font-black text-[#061b3f] shadow-lg">
            <Phone className="mr-2 inline" size={18} /> Call Now<br /><span className="text-xs">86374 14008</span>
          </button>
          <button onClick={openMyBooking} className="rounded-full bg-white/10 px-3 py-2 text-left text-[11px] font-black text-white">
            <ShoppingCart className="mr-1 inline" size={13} /> My Booking<br /><span className="block max-w-[125px] truncate font-bold text-white/60">{latestText}</span>
          </button>
          <button onClick={() => openBooking()} className="relative rounded-xl bg-white px-4 py-3 text-sm font-black text-[#061b3f]">
            Book Now{cartCount > 0 && <span className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full bg-red-600 text-xs text-white">{cartCount}</span>}
          </button>
        </div>
        <button onClick={() => setMenu(!menu)} className="rounded-xl bg-white/10 p-3 md:hidden">{menu ? <X /> : <Menu />}</button>
      </div>
      {menu && (
        <div className="grid gap-2 bg-[#061b3f] p-4 md:hidden">
          <button onClick={openMyBooking} className="rounded-xl bg-white/10 p-3 text-left text-sm font-black">My Booking<br /><span className="text-xs text-white/60">{latestText}</span></button>
          <button onClick={() => openBooking()} className="rounded-xl bg-[#f5b72f] p-3 font-black text-[#061b3f]">Book Now</button>
        </div>
      )}
    </header>
  );
}

function Hero({ openBooking, latest, repeatLast }) {
  return (
    <section id="home" className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden bg-[#061b3f] text-white">
      <div className="absolute inset-0">
        <img className="h-full w-full object-cover opacity-70" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=90" alt="luxury home" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061b3f] via-[#061b3f]/80 to-[#061b3f]/15" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 py-20">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex rounded-full border border-[#f5b72f]/30 bg-[#0a2a5c]/80 px-5 py-3 text-sm font-black text-[#f5b72f] shadow-xl">✨ Premium Cleaning. Pristine Living.</div>
          <h1 className="text-5xl font-black leading-tight md:text-7xl">Professional Cleaning<br /><span className="text-[#f5b72f]">for a Healthier Home</span></h1>
          <p className="mt-6 max-w-xl text-2xl font-semibold leading-10 text-white">Deep Cleaning | Disinfection | Hygiene<br />We bring freshness to your nest.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })} className="rounded-xl bg-[#f5b72f] px-7 py-4 font-black text-[#061b3f] shadow-xl">Book Now <ArrowRight className="ml-2 inline" size={18} /></button>
            {latest && <button onClick={repeatLast} className="rounded-xl bg-white/10 px-7 py-4 font-black text-white"><Repeat2 className="mr-2 inline" size={18} /> Repeat Last Booking</button>}
          </div>
          <div className="mt-8 grid max-w-2xl gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-[#09295a]/90 p-5 shadow-xl"><ShieldCheck className="text-[#f5b72f]" /><p className="mt-2 font-black">Trusted & Verified Professionals</p></div>
            <div className="rounded-2xl bg-[#09295a]/90 p-5 shadow-xl"><Sparkles className="text-[#f5b72f]" /><p className="mt-2 font-black">Eco-Friendly Products</p></div>
            <div className="rounded-2xl bg-[#09295a]/90 p-5 shadow-xl"><CheckCircle2 className="text-[#f5b72f]" /><p className="mt-2 font-black">Satisfaction Guaranteed</p></div>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 bg-[#061b3f]/95 py-6">
        <div className="mx-auto grid max-w-7xl gap-4 px-5 md:grid-cols-5">
          <TrustStatDark n="25,000+" t="Happy Customers" />
          <TrustStatDark n="50,000+" t="Services Completed" />
          <TrustStatDark n="4.8/5" t="Customer Rating" />
          <TrustStatDark n="100%" t="Satisfaction Guarantee" />
          <TrustStatDark n="On-Time" t="Service Delivery" />
        </div>
      </div>
    </section>
  );
}

function BookingPage(props) {
  const { cart, addService, changeQty, setItemQty, favorites, toggleFavorite, coupon, setCoupon, subtotal, discount, platformFee, total, booking, setBooking, slot, setSlot, payment, setPayment, canConfirm, confirmBooking, useCurrentLocation, openGoogleMap, latest, repeatLast, setPage, gift, setGift, photoName, setPhotoName } = props;
  return (
    <div className="min-h-screen bg-[#faf9f5]">
      <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <button onClick={() => setPage("home")} className="rounded-xl bg-slate-100 px-4 py-3 font-black"><ArrowLeft className="mr-1 inline" size={16} /> Home</button>
          <div className="font-black">FreshNest Booking</div>
          <button onClick={() => setPage("myBooking")} className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-black">My Booking</button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <SelectAndCart {...{ cart, addService, changeQty, setItemQty, favorites, toggleFavorite, coupon, setCoupon, subtotal, discount, platformFee, total }} />
            <AddressPaymentConfirm {...{ booking, setBooking, slot, setSlot, payment, setPayment, useCurrentLocation, openGoogleMap, canConfirm, confirmBooking, total, gift, setGift, photoName, setPhotoName }} />
          </div>
          <StickySummary cart={cart} total={total} latest={latest} repeatLast={repeatLast} />
        </div>
      </main>
    </div>
  );
}

function SelectAndCart({ cart, addService, changeQty, setItemQty, favorites, toggleFavorite, coupon, setCoupon, subtotal, discount, platformFee, total }) {
  return (
    <Card>
      <SectionTitle n="1" title="Select Services & Cart" sub="For sq.ft/litre services, type exact quantity." />
      <div className="grid gap-3 md:grid-cols-2">
        {services.map((service) => {
          const item = cart.find((entry) => entry.id === service.id);
          const Icon = service.icon;
          return (
            <div key={service.id} className="rounded-xl border border-slate-100 p-3">
              <div className="flex gap-3">
                <img src={service.image} className="h-16 w-16 rounded-xl object-cover" alt={service.name} />
                <div className="flex-1">
                  <Icon className="text-yellow-600" size={16} />
                  <p className="text-sm font-black">{service.name}</p>
                  <p className="text-xs font-bold text-slate-500">{money(service.price)} / {service.unit}</p>
                </div>
                <button onClick={() => toggleFavorite(service.id)} className={favorites.includes(service.id) ? "text-red-500" : "text-slate-300"}>
                  <Heart fill={favorites.includes(service.id) ? "currentColor" : "none"} />
                </button>
              </div>
              {item ? (
                <div className="mt-3 grid grid-cols-[auto_1fr_auto] gap-2">
                  <button onClick={() => changeQty(service.id, -1)} className="rounded-xl bg-yellow-300 p-2"><Minus size={14} /></button>
                  <input value={item.qty} onChange={(event) => setItemQty(service.id, event.target.value)} className="rounded-xl bg-slate-50 px-3 text-center font-black outline-none" />
                  <button onClick={() => changeQty(service.id, 1)} className="rounded-xl bg-yellow-300 p-2"><Plus size={14} /></button>
                </div>
              ) : (
                <button onClick={() => addService(service)} className="mt-3 rounded-lg bg-yellow-400 px-4 py-2 text-sm font-black">+ Add</button>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl bg-slate-50 p-4">
        <h3 className="mb-3 font-black">Cart Summary</h3>
        {cart.length === 0 ? <p className="text-sm font-bold text-slate-500">No services added.</p> : cart.map((item) => (
          <div key={item.id} className="mb-2 flex items-center gap-3 rounded-xl bg-white p-3">
            <img src={item.image} className="h-12 w-12 rounded-lg object-cover" alt={item.name} />
            <div className="flex-1"><p className="text-sm font-black">{item.name}</p><p className="text-xs font-bold text-slate-500">{item.qty} × {money(item.price)} / {item.unit}</p></div>
            <b>{money(item.price * item.qty)}</b>
            <button onClick={() => changeQty(item.id, -item.qty)} className="rounded-lg bg-red-50 p-2 text-red-600"><Trash2 size={15} /></button>
          </div>
        ))}
        <div className="mt-4 grid gap-2 md:grid-cols-3">{coupons.map((item) => <button key={item.code} onClick={() => setCoupon(item.code)} className={`rounded-xl border p-3 text-left ${coupon === item.code ? "border-yellow-400 bg-yellow-50" : "border-slate-100 bg-white"}`}><p className="font-black">{item.code}</p><p className="text-xs text-slate-500">Off {money(item.value)}</p></button>)}</div>
        <PriceBox {...{ subtotal, discount, platformFee, total }} />
      </div>
    </Card>
  );
}

function AddressPaymentConfirm({ booking, setBooking, slot, setSlot, payment, setPayment, useCurrentLocation, openGoogleMap, canConfirm, confirmBooking, total, gift, setGift, photoName, setPhotoName }) {
  return (
    <Card>
      <SectionTitle n="2" title="Address, Payment & Confirm" sub="Fill all fields to enable WhatsApp booking." />
      <SavedAddressBox setBooking={setBooking} />
      <div className="rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <input value={booking.name} onChange={(event) => setBooking({ ...booking, name: event.target.value })} className="rounded-xl bg-white px-4 py-4 font-bold outline-none" placeholder="Customer name" />
          <input value={booking.phone} onChange={(event) => setBooking({ ...booking, phone: event.target.value.replace(/[^0-9]/g, "") })} className="rounded-xl bg-white px-4 py-4 font-bold outline-none" placeholder="Mobile number" />
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
          <input value={booking.address} onChange={(event) => setBooking({ ...booking, address: event.target.value })} className="rounded-xl bg-white px-4 py-4 font-bold outline-none" placeholder="Full address / Google map location" />
          <div className="grid gap-2">
            <button onClick={useCurrentLocation} className="rounded-xl bg-emerald-600 px-5 py-3 font-black text-white"><MapPin className="mr-1 inline" size={16} /> Use Location</button>
            <button onClick={openGoogleMap} className="rounded-xl bg-blue-600 px-5 py-3 font-black text-white"><MapPin className="mr-1 inline" size={16} /> Open Maps</button>
          </div>
        </div>
        <label className="mt-4 block"><span className="mb-2 block text-sm font-black text-[#111827]">Date</span><input type="date" value={booking.date} onChange={(event) => setBooking({ ...booking, date: event.target.value })} className="w-full rounded-xl border-2 border-yellow-200 bg-white px-4 py-4 font-black text-[#111827] shadow-sm outline-none" /></label>
        <textarea value={booking.notes} onChange={(event) => setBooking({ ...booking, notes: event.target.value })} className="mt-3 min-h-24 w-full rounded-xl bg-white px-4 py-4 font-bold outline-none" placeholder="Booking notes" />
        <label className="mt-3 flex cursor-pointer items-center gap-3 rounded-xl bg-white p-3 font-bold"><FileText size={18} /> Upload dirty area photo<input type="file" className="hidden" onChange={(event) => setPhotoName(event.target.files?.[0]?.name || "photo uploaded")} /><span className="text-xs text-slate-500">{photoName}</span></label>
      </div>
      <div className="mt-5"><p className="mb-2 font-black">Time Slot</p><div className="grid grid-cols-2 gap-2 md:grid-cols-3">{slots.map((item) => <button key={item} onClick={() => setSlot(item)} className={`rounded-xl px-3 py-3 text-xs font-black ${slot === item ? "bg-yellow-100 ring-2 ring-yellow-400" : "bg-slate-50"}`}>{item}</button>)}</div></div>
      <div className="mt-5"><p className="mb-2 font-black">Payment</p>{["UPI", "Card", "Cash"].map((item) => <button key={item} onClick={() => setPayment(item)} className={`mb-3 w-full rounded-xl border p-4 text-left font-black ${payment === item ? "border-yellow-400 bg-yellow-50" : "border-slate-100"}`}>{item}</button>)}</div>
      <label className="mt-3 flex items-center gap-3 rounded-xl bg-pink-50 p-4 font-black"><input type="checkbox" checked={gift} onChange={(event) => setGift(event.target.checked)} /> Gift this cleaning to family</label>
      <div className="mt-6 grid gap-4 md:grid-cols-2"><div className="rounded-xl bg-slate-50 p-4"><p className="text-sm font-black">Total Amount</p><p className="text-3xl font-black">{money(total)}</p></div><button onClick={confirmBooking} disabled={!canConfirm} className="rounded-xl bg-yellow-400 p-4 font-black disabled:bg-slate-300 disabled:text-slate-500">Confirm Booking & Send WhatsApp <MessageCircle className="ml-2 inline" size={16} /></button></div>
      {!canConfirm && <p className="mt-3 text-sm font-bold text-red-500">Fill services, name, phone, address, date, slot and payment to confirm.</p>}
    </Card>
  );
}

function StickySummary({ cart, total, latest, repeatLast }) {
  return <div className="sticky top-24 h-fit rounded-[1.7rem] bg-[#111827] p-5 text-white shadow-2xl"><h3 className="text-xl font-black text-yellow-300">Booking Summary</h3><p className="mt-1 text-sm font-bold text-white/50">{cart.length} services selected</p><div className="mt-4 space-y-3">{cart.length === 0 ? <p className="rounded-xl bg-white/10 p-3 text-sm font-bold text-white/60">No service added.</p> : cart.map((item) => <div key={item.id} className="rounded-xl bg-white/10 p-3"><p className="font-black">{item.name}</p><p className="text-xs text-white/50">{item.qty} {item.unit}</p><p className="font-black text-yellow-300">{money(item.price * item.qty)}</p></div>)}</div><div className="mt-5 border-t border-white/10 pt-4"><p className="text-xs text-white/40">Total</p><p className="text-4xl font-black text-yellow-300">{money(total)}</p></div>{latest && <button onClick={repeatLast} className="mt-4 w-full rounded-xl bg-yellow-400 p-3 font-black text-black">Repeat Last Booking</button>}</div>;
}

function ServicesSection({ filtered, category, setCategory, favorites, toggleFavorite, openBooking }) {
  return <section id="services" className="py-10"><div className="mb-6"><h2 className="text-3xl font-black">Services</h2><p className="text-sm font-bold text-slate-500">Select service and book. Sq.ft services calculate automatically.</p></div><div className="mb-6 flex flex-wrap gap-4">{categories.map((item) => <button onClick={() => setCategory(item)} key={item} className={`rounded-xl px-6 py-3 font-black ${category === item ? "bg-yellow-400" : "bg-white"}`}>{item}</button>)}</div><div className="grid gap-6 md:grid-cols-3">{filtered.map((service) => <ServiceCard key={service.id} service={service} openBooking={openBooking} favorite={favorites.includes(service.id)} toggleFavorite={toggleFavorite} />)}</div></section>;
}

function ServiceCard({ service, openBooking, favorite, toggleFavorite }) {
  const Icon = service.icon;
  return <div className="overflow-hidden rounded-[1.5rem] bg-white shadow-sm"><div className="relative h-44"><img src={service.image} alt={service.name} className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-yellow-300 px-3 py-1 text-xs font-black">{service.tag}</span><button onClick={() => toggleFavorite(service.id)} className={`absolute right-4 top-4 rounded-full bg-white/90 p-2 ${favorite ? "text-red-500" : "text-slate-400"}`}><Heart fill={favorite ? "currentColor" : "none"} /></button></div><div className="p-5"><Icon className="mb-3 text-yellow-600" size={20} /><h3 className="text-xl font-black">{service.name}</h3><p className="mt-2 text-sm font-semibold text-slate-500">{service.duration}</p><div className="mt-4 flex items-end justify-between"><div><p className="text-2xl font-black">{money(service.price)} <span className="text-sm text-slate-500">/ {service.unit}</span></p><p className="mt-1 text-xs font-bold text-slate-500"><Star className="mr-1 inline text-yellow-400" size={13} />4.8</p></div><button onClick={() => openBooking(service)} className="rounded-xl bg-yellow-300 px-5 py-3 font-black">Book</button></div></div></div>;
}

function PriceBox({ subtotal, discount, platformFee, total }) {
  return <div className="mt-5 space-y-2 text-sm font-bold"><div className="flex justify-between"><span>Subtotal</span><b>{money(subtotal)}</b></div><div className="flex justify-between text-emerald-600"><span>Coupon discount</span><b>-{money(discount)}</b></div><div className="flex justify-between"><span>Platform fee</span><b>{money(platformFee)}</b></div><div className="flex justify-between border-t pt-3 text-xl font-black"><span>Total</span><b>{money(total)}</b></div></div>;
}

function SectionTitle({ n, title, sub }) {
  return <div className="mb-5 flex items-start gap-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-yellow-400 text-sm font-black">{n}</div><div><h3 className="text-xl font-black">{title}</h3><p className="text-xs font-bold text-slate-500">{sub}</p></div></div>;
}

function TrustStatDark({ n, t }) {
  return <div className="flex items-center gap-3 text-white"><Star className="text-[#f5b72f]" size={34} /><div><b className="text-2xl font-black">{n}</b><p className="text-sm font-semibold text-white/80">{t}</p></div></div>;
}

function PremiumFeatureShowcase() {
  const items = [
    { title: "Smart Booking", text: "Track every stage from booking confirmation to work completion.", emoji: "⚡" },
    { title: "Repeat Booking", text: "Customers can rebook the same service in one tap.", emoji: "🔁" },
    { title: "WhatsApp Support", text: "Booking details open directly in WhatsApp for fast confirmation.", emoji: "💬" },
    { title: "Warranty Promise", text: "Service support and revisit assurance for customer trust.", emoji: "🛡️" },
    { title: "Live Slots", text: "Available time slots help customers book faster.", emoji: "⏰" },
    { title: "Verified Team", text: "Professional staff workflow with proof-based service.", emoji: "✨" },
  ];
  return <section className="py-14"><div className="mb-10 text-center"><div className="inline-flex rounded-full bg-[#061b3f] px-5 py-2 text-xs font-black tracking-widest text-[#f5b72f] shadow-lg">PREMIUM EXPERIENCE</div><h2 className="mt-5 text-4xl font-black text-[#061b3f] md:text-5xl">Why FreshNest Feels Premium</h2><p className="mt-3 text-base font-semibold text-slate-500">Luxury design, transparent pricing and modern booking flow.</p></div><div className="grid gap-6 md:grid-cols-3">{items.map((item) => <div key={item.title} className="rounded-[2rem] border border-white/70 bg-gradient-to-br from-white to-slate-50 p-7 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl"><div className="mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-[#061b3f] to-[#f5b72f] text-3xl shadow-xl">{item.emoji}</div><h3 className="text-xl font-black text-[#061b3f]">{item.title}</h3><p className="mt-3 font-semibold leading-7 text-slate-500">{item.text}</p></div>)}</div><div className="mt-8 rounded-[2rem] bg-gradient-to-r from-[#061b3f] via-[#0a2a5c] to-[#111827] p-8 text-white shadow-2xl"><div className="grid gap-6 md:grid-cols-4"><div><p className="text-4xl font-black text-[#f5b72f]">4.8★</p><p className="font-semibold text-white/70">Customer Rating</p></div><div><p className="text-4xl font-black text-[#f5b72f]">50K+</p><p className="font-semibold text-white/70">Services Completed</p></div><div><p className="text-4xl font-black text-[#f5b72f]">100%</p><p className="font-semibold text-white/70">Transparent Pricing</p></div><div><p className="text-4xl font-black text-[#f5b72f]">Fast</p><p className="font-semibold text-white/70">WhatsApp Booking</p></div></div></div></section>;
}

function StickyBookingBar({ openBooking }) {
  return <div className="sticky top-[73px] z-30 border-b border-[#f5b72f]/20 bg-[#061b3f]/95 px-4 py-3 text-white shadow-lg backdrop-blur">
    <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-sm font-black"><span className="rounded-full bg-red-500 px-3 py-1 text-white">Launch Offer</span><span>Flat 15% OFF this week • Only 2 premium slots left today</span></div>
      <div className="flex gap-2"><button onClick={() => openBooking()} className="rounded-xl bg-[#f5b72f] px-4 py-2 font-black text-[#061b3f]">Book Now</button><button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE}`, "_blank", "noopener,noreferrer")} className="rounded-xl bg-emerald-600 px-4 py-2 font-black text-white">WhatsApp</button></div>
    </div>
  </div>;
}

function SavedAddressBox({ setBooking }) {
  const addresses = ["Home - Thillai Nagar, Trichy", "Office - Cantonment, Trichy", "Parents Home - Srirangam, Trichy"];
  return <Card className="mb-5 bg-gradient-to-br from-yellow-50 to-white"><h3 className="text-xl font-black text-[#061b3f]">Saved Addresses</h3><p className="mt-1 text-sm font-bold text-slate-500">Choose address quickly for repeat booking.</p><div className="mt-4 grid gap-3 md:grid-cols-3">{addresses.map((address) => <button key={address} onClick={() => setBooking((old) => ({ ...old, address }))} className="rounded-xl border border-yellow-100 bg-white p-3 text-left text-sm font-black shadow-sm">{address}</button>)}</div></Card>;
}

function LaunchOfferPopup({ close, openBooking }) {
  return <div className="fixed inset-0 z-[80] grid place-items-center bg-black/40 p-5 backdrop-blur-sm"><div className="max-w-md rounded-[2rem] bg-white p-8 text-center shadow-2xl"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-yellow-100 text-4xl">🎉</div><h2 className="mt-4 text-3xl font-black text-[#061b3f]">Grand Launch Offer</h2><p className="mt-2 font-bold text-slate-600">Book this week and get instant launch discount on cleaning services.</p><div className="mt-5 rounded-2xl bg-[#061b3f] p-5 text-white"><p className="text-sm font-black text-[#f5b72f]">USE COUPON</p><p className="text-3xl font-black">FNFIRST</p></div><button onClick={() => { close(); openBooking(); }} className="mt-5 w-full rounded-xl bg-[#f5b72f] p-4 font-black text-[#061b3f]">Book Now</button><button onClick={close} className="mt-3 text-sm font-black text-slate-500">Maybe later</button></div></div>;
}

function RecentBookingToast({ recentIndex, setRecentIndex }) {
  const data = ["Arun from Trichy booked Sofa Shampooing", "Priya from Srirangam booked Deep Cleaning", "Vignesh from Woraiyur booked Water Tank Cleaning"];
  React.useEffect(() => { const timer = setInterval(() => setRecentIndex((old) => (old + 1) % data.length), 5000); return () => clearInterval(timer); }, []);
  return <div className="fixed bottom-5 left-5 z-50 hidden rounded-2xl bg-white p-4 text-sm font-black shadow-2xl md:block"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-500" />{data[recentIndex]} <span className="text-slate-400">2 mins ago</span></div>;
}

function PhaseOneGrowthSections({ openBooking }) {
  const reviews = ["4.9 ★ Arun Kumar - Sofa looks brand new", "5.0 ★ Priya S - Kitchen cleaning was excellent", "4.8 ★ Vignesh R - Very professional team"];
  return <section className="py-12"><div className="grid gap-6 lg:grid-cols-2"><Card className="bg-gradient-to-br from-white to-yellow-50"><h2 className="text-3xl font-black text-[#061b3f]">Google Reviews Style Trust</h2><div className="mt-5 grid gap-3">{reviews.map((r) => <div key={r} className="rounded-xl bg-white p-4 font-bold shadow-sm">{r}</div>)}</div></Card><Card className="bg-gradient-to-br from-[#061b3f] to-[#0a2a5c] text-white"><h2 className="text-3xl font-black text-[#f5b72f]">Combo Packages</h2><div className="mt-5 grid gap-3"><div className="rounded-xl bg-white/10 p-4"><b>Home Hygiene Combo</b><p className="text-sm text-white/60">Sofa + Fridge + AC Filter</p></div><div className="rounded-xl bg-white/10 p-4"><b>Move-in Deep Clean</b><p className="text-sm text-white/60">Unfurnished cleaning + tank + pest</p></div></div><button onClick={() => openBooking()} className="mt-5 rounded-xl bg-[#f5b72f] px-5 py-3 font-black text-[#061b3f]">Build My Combo</button></Card></div><Card className="mt-6 bg-gradient-to-br from-blue-50 to-white"><div className="grid gap-5 md:grid-cols-[1fr_auto]"><div><h2 className="text-3xl font-black text-[#061b3f]">Commercial & Apartment Quote</h2><p className="mt-2 font-semibold text-slate-600">Office, apartment, showroom and bulk cleaning enquiry.</p></div><button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent("Hi FreshNest, I need a commercial/apartment bulk cleaning quote")}`, "_blank", "noopener,noreferrer")} className="rounded-xl bg-[#061b3f] px-6 py-4 font-black text-white">Get Quote</button></div></Card></section>;
}

function OtpLoginModal({ close, otpMobile, setOtpMobile, otpCode, setOtpCode, setLoggedIn }) {
  function verify() {
    if (otpMobile.length >= 10 && otpCode.length >= 4) {
      setLoggedIn(true);
      close();
    }
  }
  return <div className="fixed inset-0 z-[90] grid place-items-center bg-black/40 p-5 backdrop-blur-sm"><div className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl"><h2 className="text-3xl font-black text-[#061b3f]">Customer Login</h2><p className="mt-2 font-bold text-slate-500">Login with mobile OTP to view booking history and saved address.</p><input value={otpMobile} onChange={(e) => setOtpMobile(e.target.value.replace(/[^0-9]/g, ""))} className="mt-5 w-full rounded-xl bg-slate-50 px-4 py-4 font-bold outline-none" placeholder="Mobile number" /><div className="mt-3 flex gap-2"><input value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))} className="flex-1 rounded-xl bg-slate-50 px-4 py-4 font-bold outline-none" placeholder="Enter OTP" /><button onClick={() => setOtpCode("1234")} className="rounded-xl bg-yellow-400 px-4 py-3 font-black">Send OTP</button></div><button onClick={verify} className="mt-5 w-full rounded-xl bg-[#061b3f] p-4 font-black text-white">Verify & Login</button><button onClick={close} className="mt-3 w-full text-sm font-black text-slate-500">Close</button></div></div>;
}

function PhaseTwoPowerSections({ latest, bookings, sendWhatsApp, callback, setCallback }) {
  const tracker = latest?.timeline || ["Booked", "Team Assigned", "On the Way", "Work Started", "Completed"];
  return <section className="py-12"><div className="mb-7"><h2 className="text-3xl font-black text-[#061b3f]">Customer Power Tools</h2><p className="text-sm font-bold text-slate-500">Phase 2 features for booking management, invoice, support and payment.</p></div><div className="grid gap-6 lg:grid-cols-2"><Card className="bg-gradient-to-br from-[#061b3f] to-[#0a2a5c] text-white"><h3 className="text-2xl font-black text-[#f5b72f]">Live Booking Tracker</h3><div className="mt-5 grid gap-3">{tracker.map((step, index) => <div key={step} className="flex items-center gap-3 rounded-xl bg-white/10 p-3"><div className="grid h-8 w-8 place-items-center rounded-full bg-[#f5b72f] font-black text-[#061b3f]">{index + 1}</div><b>{step}</b></div>)}</div></Card><Card><h3 className="text-2xl font-black text-[#061b3f]">Invoice & Payment</h3><p className="mt-2 font-semibold text-slate-500">Download invoice, share invoice on WhatsApp and prepare online payment.</p><div className="mt-5 grid gap-3 md:grid-cols-2"><button onClick={() => latest ? sendWhatsApp(latest) : alert("No booking yet")} className="rounded-xl bg-emerald-600 p-4 font-black text-white">WhatsApp Invoice</button><button onClick={() => alert("PDF invoice module ready placeholder")} className="rounded-xl bg-[#061b3f] p-4 font-black text-white">Download Invoice</button><button onClick={() => alert("Razorpay/PhonePe gateway can be connected here")} className="rounded-xl bg-yellow-400 p-4 font-black text-[#061b3f] md:col-span-2">Pay Online</button></div></Card><Card><h3 className="text-2xl font-black text-[#061b3f]">Callback Request</h3><div className="mt-4 grid gap-3"><input value={callback.name} onChange={(e) => setCallback({ ...callback, name: e.target.value })} className="rounded-xl bg-slate-50 p-4 font-bold outline-none" placeholder="Name" /><input value={callback.phone} onChange={(e) => setCallback({ ...callback, phone: e.target.value.replace(/[^0-9]/g, "") })} className="rounded-xl bg-slate-50 p-4 font-bold outline-none" placeholder="Phone" /><select value={callback.time} onChange={(e) => setCallback({ ...callback, time: e.target.value })} className="rounded-xl bg-slate-50 p-4 font-bold outline-none"><option>Call me in 5 mins</option><option>Call me today evening</option><option>Call me tomorrow</option></select><button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent(`Callback request: ${callback.name} ${callback.phone} ${callback.time}`)}`, "_blank", "noopener,noreferrer")} className="rounded-xl bg-[#061b3f] p-4 font-black text-white">Request Callback</button></div></Card><Card className="bg-gradient-to-br from-yellow-50 to-white"><h3 className="text-2xl font-black text-[#061b3f]">Revisit / Complaint Support</h3><p className="mt-2 font-semibold text-slate-600">Not satisfied? Request a revisit or service support through WhatsApp.</p><button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent("Hi FreshNest, I need revisit/support for my booking")}`, "_blank", "noopener,noreferrer")} className="mt-5 rounded-xl bg-yellow-400 px-5 py-4 font-black text-[#061b3f]">Request Support</button><div className="mt-5 rounded-xl bg-white p-4 font-bold text-slate-600">Customer Dashboard: {bookings.length} booking(s) saved</div></Card></div></section>;
}

function PlansSection() {
  return <section id="plans" className="py-10"><h2 className="mb-6 text-3xl font-black">Plans & Future Services</h2><div className="grid gap-5 md:grid-cols-3"><Card><Hammer className="text-yellow-600" /><h3 className="mt-3 text-xl font-black">Home Interior Design</h3></Card><Card><Wrench className="text-yellow-600" /><h3 className="mt-3 text-xl font-black">Plumber Work</h3></Card><Card><Zap className="text-yellow-600" /><h3 className="mt-3 text-xl font-black">Electrician Work</h3></Card></div></section>;
}

function HomeSections() {
  const reviews = [
    { name: "Arun Kumar", area: "Thillai Nagar", text: "FreshNest cleaned my 2BHK very neatly. The sofa shampooing result looked like new." },
    { name: "Priya S", area: "Srirangam", text: "Kitchen and refrigerator cleaning were excellent. Pricing was clear before booking." },
    { name: "Vignesh R", area: "Woraiyur", text: "Deep cleaning was worth the money. Before and after difference was very visible." },
  ];
  return <><section id="how" className="py-10"><h2 className="mb-6 text-3xl font-black">How It Works</h2><div className="grid gap-5 md:grid-cols-4">{[["1", "Choose Service"], ["2", "Fill Details"], ["3", "WhatsApp Confirm"], ["4", "Team Works"]].map(([n, t]) => <Card key={n}><div className="grid h-10 w-10 place-items-center rounded-full bg-yellow-400 font-black">{n}</div><h3 className="mt-3 font-black">{t}</h3></Card>)}</div></section><section className="py-10"><h2 className="mb-6 text-3xl font-black">Before / After Work</h2><div className="grid gap-5 md:grid-cols-2">{beforeAfter.map((item) => <Card key={item.title} className="overflow-hidden p-0"><div className="grid grid-cols-2"><div className="relative"><img src={item.b} className="h-52 w-full object-cover brightness-75" alt={item.before} /><span className="absolute left-2 top-2 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">Before</span></div><div className="relative"><img src={item.a} className="h-52 w-full object-cover" alt={item.after} /><span className="absolute left-2 top-2 rounded-full bg-emerald-600 px-3 py-1 text-xs font-black text-white">After</span></div></div><div className="p-4"><h3 className="font-black">{item.title}</h3><p className="mt-1 text-xs font-bold text-slate-500">{item.before} → {item.after}</p></div></Card>)}</div></section><AboutSection /><section id="reviews" className="py-10"><h2 className="mb-6 text-3xl font-black">People Reviews</h2><div className="grid gap-5 md:grid-cols-3">{reviews.map((item) => <Card key={item.name}><h3 className="font-black">{item.name}</h3><p className="text-xs font-bold text-slate-500">{item.area}</p><p className="mt-3 text-yellow-400">★★★★★</p><p className="mt-3 font-bold text-slate-600">“{item.text}”</p></Card>)}</div></section><section id="faq" className="py-10"><h2 className="mb-6 text-3xl font-black">FAQ</h2><div className="grid gap-4 md:grid-cols-2">{[["How is deep cleaning price calculated?", "Furnished is ₹8.5/sq.ft and unfurnished is ₹7.5/sq.ft."], ["Can I book multiple services?", "Yes, add multiple services in one booking."], ["How do I share location?", "Use current location, type address, or open Google Maps."], ["Will WhatsApp confirmation open?", "Yes, booking details open in WhatsApp to FreshNest number."]].map(([q, a]) => <Card key={q}><h3 className="font-black"><HelpCircle className="mr-1 inline text-yellow-600" /> {q}</h3><p className="mt-2 text-sm font-semibold text-slate-500">{a}</p></Card>)}</div></section></>;
}

function AboutSection() {
  return <section className="py-14"><div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#061b3f] via-[#0a2a5c] to-[#111827] p-8 text-white shadow-2xl md:p-10"><div className="grid items-center gap-10 md:grid-cols-[1.3fr_0.7fr]"><div><div className="inline-flex rounded-full bg-white/10 px-5 py-2 text-xs font-black tracking-widest text-[#f5b72f]">ABOUT FRESHNEST</div><h2 className="mt-5 text-4xl font-black leading-tight md:text-5xl">Premium Home Care Built on Trust & Quality</h2><p className="mt-6 text-lg font-semibold leading-8 text-white/75">FreshNest Cleaning Services delivers a modern premium cleaning experience with trained professionals, transparent pricing, before-after proof, WhatsApp-first booking and customer-focused support built for luxury homes and modern families.</p><div className="mt-8 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-white/10 p-5"><b className="text-[#f5b72f]">Verified Team</b><p className="mt-2 text-sm text-white/60">Trusted professionals with proof-based work.</p></div><div className="rounded-2xl bg-white/10 p-5"><b className="text-[#f5b72f]">Clear Pricing</b><p className="mt-2 text-sm text-white/60">Transparent service costing with no surprises.</p></div><div className="rounded-2xl bg-white/10 p-5"><b className="text-[#f5b72f]">Future Vision</b><p className="mt-2 text-sm text-white/60">Interior design, plumbing and electrician services.</p></div></div></div><div className="grid gap-5"><div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"><p className="text-xs font-black tracking-widest text-[#f5b72f]">CEO & FOUNDER</p><h3 className="mt-3 text-3xl font-black">Neethirajan N</h3></div><div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur"><p className="text-xs font-black tracking-widest text-[#f5b72f]">CO-FOUNDER</p><h3 className="mt-3 text-3xl font-black">Selva Kumar</h3></div></div></div></div></section>;
}

function FloatingSupport() {
  return <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3"><button onClick={() => alert("Call FreshNest: 86374 14008")} className="rounded-full bg-[#111827] p-4 text-white shadow-xl"><Phone /></button><button onClick={() => window.open(`https://wa.me/${COMPANY_PHONE}?text=${encodeURIComponent("Hi FreshNest, I need help booking a service")}`, "_blank", "noopener,noreferrer")} className="rounded-full bg-emerald-600 p-4 text-white shadow-xl"><MessageCircle /></button></div>;
}

function MyBookingPage({ bookings, setPage, repeatLast, sendWhatsApp }) {
  return <div className="min-h-screen bg-[#faf9f5]"><header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur-xl"><div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4"><button onClick={() => setPage("home")} className="rounded-xl bg-slate-100 px-4 py-3 font-black"><ArrowLeft className="mr-1 inline" size={16} /> Home</button><h2 className="font-black">My Booking</h2></div></header><main className="mx-auto max-w-5xl px-5 py-8">{bookings.length === 0 ? <Card><p className="text-center font-bold text-slate-500">No bookings yet.</p></Card> : <div className="grid gap-4">{bookings.map((bookingItem) => <Card key={bookingItem.id}><div className="flex justify-between"><div><p className="text-xs font-black text-slate-400">{bookingItem.id}</p><h3 className="text-xl font-black">{bookingItem.status}</h3><p className="text-sm font-bold text-slate-500">{bookingItem.date} • {bookingItem.slot}</p></div><b className="text-2xl">{money(bookingItem.total)}</b></div><div className="mt-4 grid gap-2">{bookingItem.items.map((item) => <div key={item.id} className="rounded-xl bg-slate-50 p-3 text-sm font-bold">{item.name} • {item.qty} {item.unit} • {money(item.price * item.qty)}</div>)}</div><div className="mt-4 grid gap-2 md:grid-cols-5">{bookingItem.timeline.map((step) => <div key={step} className="rounded-xl bg-emerald-50 p-2 text-xs font-black text-emerald-700">{step}</div>)}</div><div className="mt-4 flex gap-2"><button onClick={repeatLast} className="rounded-xl bg-yellow-400 px-4 py-3 font-black">Repeat Booking</button><button onClick={() => sendWhatsApp(bookingItem)} className="rounded-xl bg-emerald-600 px-4 py-3 font-black text-white">WhatsApp Invoice</button></div></Card>)}</div>}</main></div>;
}
