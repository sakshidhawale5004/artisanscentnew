import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useShoppingBag, addOrderToCRM } from "@/lib/store";
import { useProducts, money, type Product } from "@/lib/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Lock,
  MessageCircle,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  QrCode,
  Package,
  CreditCard,
} from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Artisan Scent Haute Parfumerie" },
      {
        name: "description",
        content:
          "Secure luxury checkout for Artisan Scent perfumes, essence oils, and handcrafted botanicals.",
      },
    ],
  }),
  component: CheckoutPage,
});

const INDIAN_STATES = [
  "Maharashtra",
  "Delhi",
  "Karnataka",
  "Tamil Nadu",
  "Gujarat",
  "Uttar Pradesh",
  "Telangana",
  "West Bengal",
  "Rajasthan",
  "Kerala",
  "Punjab",
  "Haryana",
  "Madhya Pradesh",
  "Bihar",
  "Andhra Pradesh",
  "Goa",
  "Assam",
  "Chandigarh",
  "Chhattisgarh",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Odisha",
  "Puducherry",
  "Uttarakhand",
];

function CheckoutPage() {
  const { bag, updateQty, removeItem, clearBag, totalItems } = useShoppingBag();
  const products = useProducts();

  // Card 1: Customer & Contact Information
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Card 2: Doorstep Delivery Address
  const [houseNo, setHouseNo] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [bespokeNote, setBespokeNote] = useState("");

  // Card 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "cod" | "card">("upi");

  // Coupon / Promo
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Placed Order State
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Cart Items
  const cartProducts = products.filter((p) => (bag[p.id] || 0) > 0);
  const totalCartCount = cartProducts.reduce((sum, p) => sum + (bag[p.id] || 0), 0);

  const cartSubtotal = cartProducts.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);
  const originalSubtotal = cartProducts.reduce((sum, p) => {
    const orig = (p as any).originalPrice || (p.salePrice ? p.price : Math.round((p.price * 2) / 10) * 10 - 1);
    return sum + orig * (bag[p.id] || 0);
  }, 0);

  const productSavings = Math.max(0, originalSubtotal - cartSubtotal);
  const couponDiscount = Math.round((cartSubtotal * discountPercent) / 100);
  const totalSavings = productSavings + couponDiscount;

  const total = Math.max(0, cartSubtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === "ARTISAN10" || code === "FIRST10") {
      setDiscountPercent(10);
      setCouponStatus({ type: "success", text: "10% Privilege Discount Applied!" });
    } else if (code === "BOTANICAL15") {
      setDiscountPercent(15);
      setCouponStatus({ type: "success", text: "15% Botanical Privilege Applied!" });
    } else if (code === "VASTU500" || code === "CASHBACK500") {
      setDiscountPercent(20);
      setCouponStatus({ type: "success", text: "Flat Cashback Privilege Applied!" });
    } else {
      setCouponStatus({ type: "error", text: "Invalid code. Try 'ARTISAN10' for 10% off." });
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartProducts.length === 0) return;

    if (!fullName.trim()) {
      alert("Please enter your Full Name.");
      return;
    }
    if (!phone.trim()) {
      alert("Please enter your Phone / WhatsApp Number.");
      return;
    }
    if (!houseNo.trim()) {
      alert("Please enter your Flat / House No. / Building / Floor.");
      return;
    }
    if (!pincode.trim()) {
      alert("Please enter your PIN Code.");
      return;
    }
    if (!city.trim()) {
      alert("Please enter your City.");
      return;
    }

    setIsSubmitting(true);

    const itemsSummary = cartProducts
      .map((p) => `${p.name} (${p.size || "Standard"}) x${bag[p.id]} [${money(p.price * (bag[p.id] || 0))}]`)
      .join(", ");

    const fullDeliveryAddress = `${houseNo.trim()}${streetAddress.trim() ? `, ${streetAddress.trim()}` : ""}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`;

    const fullNotes = [
      bespokeNote.trim() ? `Olfactory / Bespoke Note: ${bespokeNote.trim()}` : "",
      `Address: ${fullDeliveryAddress}`,
      `Payment Method: ${paymentMethod.toUpperCase()}`,
      discountPercent > 0 ? `Coupon Privilege: ${discountPercent}%` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    // Register into CRM Order ledger & cloud persistence
    const newOrder = addOrderToCRM({
      customer: fullName.trim(),
      email: email.trim() || "patron@artisanscent.com",
      phone: phone.trim().startsWith("+91") ? phone.trim() : `+91 ${phone.trim()}`,
      items: itemsSummary,
      total: total,
      note: fullNotes,
      source: "VastuAdda Style Checkout",
    });

    const orderDetails = {
      orderId: newOrder.id,
      customer: fullName.trim(),
      phone: phone.trim().startsWith("+91") ? phone.trim() : `+91 ${phone.trim()}`,
      email: email.trim(),
      address: fullDeliveryAddress,
      items: itemsSummary,
      total: total,
      paymentMethod,
      bespokeNote: bespokeNote.trim(),
    };

    setOrderConfirmed(orderDetails);
    clearBag();
    setIsSubmitting(false);

    // Prepare WhatsApp Message for direct Concierge confirmation
    const paymentLabel =
      paymentMethod === "upi"
        ? "UPI / QR (Instant Cashback)"
        : paymentMethod === "cod"
        ? "Cash on Delivery (Doorstep COD)"
        : "Credit / Debit Card or Net Banking";

    const whatsappMsg = `✦ Artisan Scent Haute Parfumerie Order Confirmation ✦\n\nReference: ${newOrder.id}\nPatron: ${fullName.trim()}\nContact: ${phone.trim()}${email.trim() ? `\nEmail: ${email.trim()}` : ""}\n\nDelivery Address:\n${fullDeliveryAddress}\n\nOrder Items:\n${itemsSummary}\n\nSubtotal: ${money(cartSubtotal)}${totalSavings > 0 ? `\nSavings: -${money(totalSavings)}` : ""}\nExpress Pan-India Delivery: FREE\nOlfactory Sample: FREE\nTotal Payable: ${money(total)}\nPayment Method: ${paymentLabel}${bespokeNote.trim() ? `\n\nOlfactory Gifting Note: ${bespokeNote.trim()}` : ""}\n\nPlease confirm availability and dispatch schedule.`;

    // Open WhatsApp in new tab for direct patron assistance
    const whatsappUrl = `https://wa.me/919820252868?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Top Offer Banner matching Screenshot */}
      <div className="bg-[#072416] text-[#e8e2d8] text-[10px] sm:text-[11px] font-semibold py-2 px-4 overflow-hidden border-b border-[#1b5e3f]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 whitespace-nowrap overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-4 mx-auto tracking-wider uppercase">
            <span>OFFER: FREE BESPOKE DISCOVERY SAMPLE WITH EVERY ORDER</span>
            <span className="text-[#d4af37]">✦</span>
            <span>FREE PAN-INDIA DELIVERY &amp; CASH ON DELIVERY AVAILABLE</span>
            <span className="text-[#d4af37]">✦</span>
            <span>WHATSAPP ATELIER SUPPORT: +91 98202 52868</span>
            <span className="text-[#d4af37]">✦</span>
            <span>FLAT ₹500 CASHBACK ON ALL PREPAID ORDERS</span>
            <span className="text-[#d4af37]">✦</span>
            <span>100% CERTIFIED BOTANICAL ESSENCES</span>
          </div>
        </div>
      </div>

      <Header currentPage="Cart" />

      <main className="min-h-screen bg-[#faf8f5] text-[#222222] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {orderConfirmed ? (
            /* Order Placed Success State */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#2d8659]/30 p-8 sm:p-12 shadow-xl text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] border border-[#2d8659]/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={36} />
              </div>

              <div className="text-[10px] uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-1">
                ORDER CONFIRMED
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[#072416] mb-2 font-normal">
                Thank You, {orderConfirmed.customer}
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#faf9f5] border border-[#e8e2d8] font-mono text-sm font-semibold text-[#1b5e3f] mb-6">
                Order #{orderConfirmed.orderId}
              </div>

              <p className="text-[#555555] text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-6">
                Your luxury fragrance order is now being curated in our atelier queue. Our master perfumer has assigned your complimentary olfactory discovery sample and insured dispatch.
              </p>

              <div className="p-5 rounded-2xl bg-[#faf9f5] border border-[#e8e2d8] text-left text-xs mb-8 space-y-2.5">
                <div className="flex justify-between border-b border-[#e8e2d8] pb-2">
                  <span className="text-[#777777]">Destination:</span>
                  <span className="font-medium text-[#222222] text-right max-w-xs">{orderConfirmed.address}</span>
                </div>
                <div className="flex justify-between border-b border-[#e8e2d8] pb-2">
                  <span className="text-[#777777]">Contact:</span>
                  <span className="font-medium text-[#222222]">{orderConfirmed.phone}</span>
                </div>
                <div className="flex justify-between border-b border-[#e8e2d8] pb-2">
                  <span className="text-[#777777]">Payment Method:</span>
                  <span className="font-medium uppercase text-[#072416]">{orderConfirmed.paymentMethod}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-[#777777]">Total Payable:</span>
                  <span className="font-mono font-bold text-base text-[#1b5e3f]">{money(orderConfirmed.total)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    const msg = `✦ Artisan Scent Order Concierge ✦\nChecking dispatch status for Order #${orderConfirmed.orderId} placed for ${orderConfirmed.customer}.`;
                    window.open(`https://wa.me/919820252868?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="w-full sm:w-auto h-12 px-8 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="text-[#86efac]" />
                  <span>Open WhatsApp Atelier Concierge</span>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-8 border-[#d5cebf] rounded-full text-xs font-medium text-[#222222] hover:border-[#1b5e3f]"
                >
                  <Link to="/products">
                    <span>Continue Exploring</span>
                  </Link>
                </Button>
              </div>
            </div>
          ) : cartProducts.length === 0 ? (
            /* Empty Cart Notice */
            <div className="text-center py-20 px-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e8e2d8] flex items-center justify-center mx-auto mb-5 text-[#1b5e3f] shadow-xs">
                <ShoppingBag size={24} className="text-[#1b5e3f] stroke-1" />
              </div>
              <h2 className="font-display text-2xl text-[#072416] mb-2 font-normal">
                Your Shopping Bag is Empty
              </h2>
              <p className="text-[#777777] text-xs sm:text-sm font-light leading-relaxed mb-6">
                Explore our artisanal perfumes, handcrafted soaps, and essence oils to begin your olfactory journey.
              </p>
              <Button
                asChild
                className="h-11 px-8 bg-black hover:bg-neutral-800 text-white rounded-full font-medium text-xs shadow-sm transition-all"
              >
                <Link to="/products">
                  <span>Explore Fragrances</span>
                  <ArrowRight size={14} className="ml-2 text-[#86efac]" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Main 2-Column VastuAdda-Style Checkout Grid */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: 3 Numbered Cards (approx 7.2 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* ============================================================== */}
                {/* CARD 1: Customer & Contact Information */}
                {/* ============================================================== */}
                <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      1
                    </span>
                    <h2 className="font-display text-lg text-[#111111] font-medium tracking-tight">
                      Customer &amp; Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Phone Number with +91 Prefix */}
                    <div>
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Phone Number (WhatsApp) <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#d8d2c5] bg-[#eee9df] text-xs font-semibold text-[#555555]">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="9876543210"
                          className="w-full text-xs px-3.5 py-3 rounded-r-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Email Address <span className="text-[11px] text-[#777777] font-normal">(For tracking &amp; authenticity certificate)</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ramesh@gmail.com"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* CARD 2: Doorstep Delivery Address */}
                {/* ============================================================== */}
                <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      2
                    </span>
                    <h2 className="font-display text-lg text-[#111111] font-medium tracking-tight">
                      Doorstep Delivery Address
                    </h2>
                  </div>

                  <div className="space-y-4">
                    {/* Flat / House No */}
                    <div>
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Flat / House No. / Building / Floor <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={houseNo}
                        onChange={(e) => setHouseNo(e.target.value)}
                        placeholder="e.g. Flat 402, Shivam Heights"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* Street Address */}
                    <div>
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Street Address / Colony / Area
                      </label>
                      <input
                        type="text"
                        value={streetAddress}
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="e.g. MG Road, Near City Mall"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                      />
                    </div>

                    {/* PIN Code, City, State Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[#444444] mb-1.5">
                          PIN Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="400001"
                          className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#444444] mb-1.5">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Mumbai"
                          className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-[#444444] mb-1.5">
                          State <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors appearance-none cursor-pointer"
                        >
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Bespoke Olfactory / Gifting Name */}
                    <div>
                      <label className="block text-xs font-medium text-[#444444] mb-1.5">
                        Name for Olfactory Gifting Note <span className="text-[11px] text-[#777777] font-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        value={bespokeNote}
                        onChange={(e) => setBespokeNote(e.target.value)}
                        placeholder="e.g. Ramesh & Priya Sharma"
                        className="w-full text-xs px-3.5 py-3 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] focus:outline-none focus:border-[#1b5e3f] focus:bg-white transition-colors"
                      />
                      <p className="text-[11px] text-[#777777] mt-1.5 font-light leading-relaxed">
                        Our Master Perfumer will curate your dispatch with this name and include a complimentary personalized discovery vial.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ============================================================== */}
                {/* CARD 3: Select Payment Method */}
                {/* ============================================================== */}
                <div className="bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-7 shadow-xs">
                  <div className="flex items-center gap-3 mb-5">
                    <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-bold shrink-0">
                      3
                    </span>
                    <h2 className="font-display text-lg text-[#111111] font-medium tracking-tight">
                      Select Payment Method
                    </h2>
                  </div>

                  <div className="space-y-3.5">
                    {/* Method 1: Instant UPI / QR */}
                    <div
                      onClick={() => setPaymentMethod("upi")}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        paymentMethod === "upi"
                          ? "border-2 border-[#1b5e3f] bg-[#f4f9f6] shadow-2xs"
                          : "border-[#e0d9cd] bg-[#faf8f5] hover:border-[#1b5e3f]/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            checked={paymentMethod === "upi"}
                            onChange={() => setPaymentMethod("upi")}
                            className="mt-1 accent-[#1b5e3f] cursor-pointer"
                          />
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs sm:text-sm font-bold text-[#111111]">
                                UPI / QR (GPay, PhonePe, Paytm)
                              </span>
                              <span className="bg-[#1b5e3f] text-white text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                                FLAT ₹500 CASHBACK
                              </span>
                            </div>
                            <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                              Instant payment via QR code or UPI app with fastest priority dispatch.
                            </p>
                          </div>
                        </div>

                        {/* Payment Badges */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="bg-white border border-[#d8d2c5] text-[#002e6e] text-[10px] font-black px-2 py-0.5 rounded shadow-2xs font-sans tracking-tight">
                            paytm
                          </span>
                          <span className="w-5 h-5 rounded-full bg-[#5f259f] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                            पे
                          </span>
                          <span className="bg-white border border-[#d8d2c5] text-[#5f6368] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs font-sans flex items-center gap-0.5">
                            <span className="text-[#4285f4] font-black">G</span> Pay
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Method 2: Cash on Delivery (COD) */}
                    <div
                      onClick={() => setPaymentMethod("cod")}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        paymentMethod === "cod"
                          ? "border-2 border-[#1b5e3f] bg-[#f4f9f6] shadow-2xs"
                          : "border-[#e0d9cd] bg-[#faf8f5] hover:border-[#1b5e3f]/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "cod"}
                          onChange={() => setPaymentMethod("cod")}
                          className="mt-1 accent-[#1b5e3f] cursor-pointer"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs sm:text-sm font-bold text-[#111111]">
                              Cash on Delivery (COD)
                            </span>
                            <span className="bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[9px] font-extrabold px-2 py-0.5 rounded tracking-wide uppercase">
                              AVAILABLE
                            </span>
                          </div>
                          <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                            Pay in cash or UPI directly at your doorstep when the parcel arrives.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Method 3: Credit / Debit Card or Net Banking */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
                        paymentMethod === "card"
                          ? "border-2 border-[#1b5e3f] bg-[#f4f9f6] shadow-2xs"
                          : "border-[#e0d9cd] bg-[#faf8f5] hover:border-[#1b5e3f]/40"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="mt-1 accent-[#1b5e3f] cursor-pointer"
                        />
                        <div>
                          <span className="text-xs sm:text-sm font-bold text-[#111111]">
                            Credit / Debit Card or Net Banking
                          </span>
                          <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                            Visa, MasterCard, RuPay &amp; all major Indian banks supported.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Order Summary Card (approx 4.8 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl border border-[#e8e2d8] p-6 shadow-sm sticky top-24 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
                    <h3 className="font-display text-base sm:text-lg text-[#111111] font-medium">
                      Order Summary ({totalCartCount} Items)
                    </h3>
                    <Link to="/cart" className="text-xs text-[#1b5e3f] hover:underline font-medium">
                      Edit Bag
                    </Link>
                  </div>

                  {/* Cart Items List */}
                  <div className="max-h-72 overflow-y-auto space-y-3.5 pr-1 divide-y divide-[#f5f2eb]">
                    {cartProducts.map((product) => {
                      const qty = bag[product.id] || 0;
                      return (
                        <div key={product.id} className="pt-3.5 first:pt-0 flex items-start gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-14 h-14 object-contain bg-[#faf8f5] rounded-xl border border-[#e8e2d8] p-1 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-[#111111] truncate">
                              {product.name}
                            </h4>
                            <div className="text-[11px] text-[#666666] mt-0.5">
                              {money(product.price)} each · <span className="text-[#1b5e3f] font-medium">Free Olfactory Sample</span>
                            </div>

                            {/* Stepper & Remove */}
                            <div className="flex items-center gap-2 mt-2">
                              <div className="inline-flex items-center border border-[#d5cfc2] rounded-lg bg-white overflow-hidden shadow-2xs">
                                <button
                                  type="button"
                                  onClick={() => updateQty(product.id, Math.max(0, qty - 1))}
                                  className="w-6 h-6 flex items-center justify-center text-[#555555] hover:bg-[#faf8f5] transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={11} />
                                </button>
                                <span className="w-7 text-center font-mono text-xs font-semibold text-[#111111]">
                                  {qty}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => updateQty(product.id, qty + 1)}
                                  className="w-6 h-6 flex items-center justify-center text-[#555555] hover:bg-[#faf8f5] transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={11} />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeItem(product.id)}
                                className="text-[11px] text-[#999999] hover:text-rose-600 transition-colors ml-1"
                              >
                                Remove
                              </button>
                            </div>
                          </div>

                          <div className="font-mono text-xs font-bold text-[#111111]">
                            {money(product.price * qty)}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Coupon Code Input matching Screenshot */}
                  <div className="pt-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="COUPON CODE (E.G. ARTISAN10)"
                        className="flex-1 text-xs px-3 py-2.5 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] placeholder:text-[#999999] uppercase tracking-wider font-mono focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    {couponStatus && (
                      <div
                        className={`text-[11px] mt-1.5 font-medium ${
                          couponStatus.type === "success" ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {couponStatus.text}
                      </div>
                    )}
                  </div>

                  {/* Pricing Breakdown matching Screenshot */}
                  <div className="pt-4 border-t border-[#f0ede6] space-y-2.5 text-xs">
                    <div className="flex justify-between text-[#555555]">
                      <span>Subtotal</span>
                      <span className="font-mono font-medium text-[#111111]">
                        {originalSubtotal > cartSubtotal ? money(originalSubtotal) : money(cartSubtotal)}
                      </span>
                    </div>

                    {totalSavings > 0 && (
                      <div className="flex justify-between text-[#0d6e43] font-semibold">
                        <span>Product Savings</span>
                        <span className="font-mono">-{money(totalSavings)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#555555]">
                      <span>Express Shipping</span>
                      <span className="font-semibold text-[#0d6e43]">FREE</span>
                    </div>

                    <div className="flex justify-between text-[#555555]">
                      <span>Olfactory Sample &amp; Atelier Gift Packaging</span>
                      <span className="font-semibold text-[#0d6e43]">FREE</span>
                    </div>

                    {/* Total Payable Row */}
                    <div className="flex justify-between items-baseline pt-3 border-t border-[#e8e2d8]">
                      <span className="font-display text-base font-bold text-[#111111]">Total Payable</span>
                      <div className="flex items-baseline gap-2">
                        {originalSubtotal > total && (
                          <span className="font-mono text-xs text-[#999999] line-through">
                            {money(originalSubtotal)}
                          </span>
                        )}
                        <span className="font-mono font-extrabold text-2xl text-[#111111]">
                          {money(total)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Big Black Proceed to Pay Action Button matching Screenshot */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-2xl font-extrabold uppercase tracking-wider text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>PROCEED TO PAY {money(total)}</span>
                  </button>

                  {/* Reassurance Footer text matching Screenshot */}
                  <div className="text-[11px] text-center text-[#555555] font-medium pt-1">
                    7-Day Hassle-Free Returns &amp; Pan-India Insured Coverage
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
