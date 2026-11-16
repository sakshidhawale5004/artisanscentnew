import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useShoppingBag, useWishlist, addOrderToCRM } from "@/lib/store";
import { useProducts, money, type Product } from "@/lib/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Sparkles,
  CheckCircle2,
  Lock,
  MessageCircle,
  ShoppingBag,
  CreditCard,
  QrCode,
  Package,
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

function CheckoutPage() {
  const { bag, clearBag, totalItems } = useShoppingBag();
  const products = useProducts();

  // Customer Details Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Maharashtra");
  const [pincode, setPincode] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"whatsapp" | "upi" | "cod">("whatsapp");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);

  // Placed Order State
  const [orderConfirmed, setOrderConfirmed] = useState<any | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate Cart Items
  const cartProducts = products.filter((p) => (bag[p.id] || 0) > 0);
  const cartSubtotal = cartProducts.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);
  const discountAmount = Math.round((cartSubtotal * discountPercent) / 100);
  const discountedSubtotal = cartSubtotal - discountAmount;
  const isFreeShipping = discountedSubtotal >= 999;
  const shipping = cartProducts.length === 0 ? 0 : isFreeShipping ? 0 : 99;
  const total = discountedSubtotal + shipping;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === "ARTISAN10" || code === "FIRST10") {
      setDiscountPercent(10);
    } else if (code === "BOTANICAL15") {
      setDiscountPercent(15);
    } else {
      setPromoError("Invalid code. Try 'ARTISAN10' for 10% privilege.");
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartProducts.length === 0) return;
    if (!fullName.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      alert("Please complete all delivery address fields.");
      return;
    }

    setIsSubmitting(true);

    const itemsSummary = cartProducts
      .map((p) => `${p.name} (${p.size || "Standard"}) x${bag[p.id]} [${money(p.price * (bag[p.id] || 0))}]`)
      .join(", ");

    const fullDeliveryAddress = `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`;
    const fullNotes = [
      orderNote.trim() ? `Instructions: ${orderNote.trim()}` : "",
      `Address: ${fullDeliveryAddress}`,
      `Payment Method: ${paymentMethod.toUpperCase()}`,
      discountPercent > 0 ? `Privilege Discount: ${discountPercent}%` : "",
    ]
      .filter(Boolean)
      .join(" | ");

    // Register into CRM Order ledger & cloud persistence
    const newOrder = addOrderToCRM({
      customer: fullName.trim(),
      email: email.trim() || "checkout.patron@artisanscent.com",
      phone: phone.trim(),
      items: itemsSummary,
      total: total,
      note: fullNotes,
      source: "Online Store Checkout",
    });

    const orderDetails = {
      orderId: newOrder.id,
      customer: fullName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: fullDeliveryAddress,
      items: itemsSummary,
      total: total,
      paymentMethod,
    };

    setOrderConfirmed(orderDetails);
    clearBag();
    setIsSubmitting(false);

    // Prepare WhatsApp Message
    const whatsappMsg = `✦ Artisan Scent Haute Parfumerie Order Confirmation ✦\n\nReference: ${newOrder.id}\nPatron: ${fullName.trim()}\nContact: ${phone.trim()}${email.trim() ? `\nEmail: ${email.trim()}` : ""}\n\nDelivery Address:\n${fullDeliveryAddress}\n\nOrder Items:\n${itemsSummary}\n\nSubtotal: ${money(cartSubtotal)}${discountAmount > 0 ? `\nPrivilege Discount (${discountPercent}%): -${money(discountAmount)}` : ""}\nPan-India Delivery: ${shipping === 0 ? "Complimentary (FREE)" : money(shipping)}\nTotal Valuation: ${money(total)}\nPayment Preference: ${paymentMethod.toUpperCase()}${orderNote.trim() ? `\n\nNotes: ${orderNote.trim()}` : ""}\n\nPlease confirm availability and dispatch schedule.`;

    // If WhatsApp method selected, open WhatsApp directly
    if (paymentMethod === "whatsapp") {
      const whatsappUrl = `https://wa.me/919820252868?text=${encodeURIComponent(whatsappMsg)}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <>
      <div className="announcement">
        Complimentary Pan-India Delivery on Orders ₹999+ <span className="ml-3">✦</span> Botanical Haute Parfumerie
      </div>

      <Header currentPage="Cart" />

      <main className="min-h-screen bg-[#faf9f5] text-[#222222]">
        {/* Minimal Breadcrumb & Page Title */}
        <section className="pt-10 pb-6 px-6 sm:px-12 max-w-6xl mx-auto border-b border-[#e8e2d8]">
          <nav className="flex items-center gap-2 text-xs text-[#777777] mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-[#1b5e3f] transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/cart" className="hover:text-[#1b5e3f] transition-colors">
              Shopping Bag
            </Link>
            <span>/</span>
            <span className="text-[#1b5e3f] font-medium">Checkout</span>
          </nav>

          <h1 className="font-display text-3xl sm:text-4xl text-[#072416] font-normal tracking-tight">
            Checkout &amp; Delivery
          </h1>
          <p className="mt-1 text-xs text-[#666666] font-light">
            Secure order fulfillment with insured door-to-door courier dispatch.
          </p>
        </section>

        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-10">
          {orderConfirmed ? (
            /* Order Placed Success State */
            <div className="max-w-2xl mx-auto bg-white rounded-3xl border border-[#2d8659]/30 p-8 sm:p-10 shadow-lg text-center animate-in fade-in">
              <div className="w-16 h-16 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] border border-[#2d8659]/30 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 size={32} />
              </div>

              <div className="text-[10px] uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-1">
                ORDER REGISTERED
              </div>
              <h2 className="font-display text-3xl text-[#072416] mb-2 font-normal">
                Thank You, {orderConfirmed.customer}
              </h2>
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#faf9f5] border border-[#e8e2d8] font-mono text-sm font-semibold text-[#1b5e3f] mb-6">
                Reference #{orderConfirmed.orderId}
              </div>

              <p className="text-[#555555] text-xs sm:text-sm font-light leading-relaxed max-w-md mx-auto mb-6">
                Your luxury fragrance order has been recorded in the Artisan Scent Atelier queue. Our concierge team is preparing your dispatch with complimentary sample vials.
              </p>

              <div className="p-4 rounded-2xl bg-[#faf9f5] border border-[#e8e2d8] text-left text-xs mb-8 space-y-2">
                <div className="flex justify-between border-b border-[#e8e2d8] pb-2">
                  <span className="text-[#777777]">Destination:</span>
                  <span className="font-medium text-[#222222]">{orderConfirmed.address}</span>
                </div>
                <div className="flex justify-between border-b border-[#e8e2d8] pb-2">
                  <span className="text-[#777777]">Contact:</span>
                  <span className="font-medium text-[#222222]">{orderConfirmed.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#777777]">Total Valuation:</span>
                  <span className="font-mono font-bold text-[#1b5e3f]">{money(orderConfirmed.total)}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  onClick={() => {
                    const msg = `✦ Artisan Scent Order Concierge ✦\nChecking status for Order Reference #${orderConfirmed.orderId} placed for ${orderConfirmed.customer}.`;
                    window.open(`https://wa.me/919820252868?text=${encodeURIComponent(msg)}`, "_blank");
                  }}
                  className="w-full sm:w-auto h-12 px-7 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-medium text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={16} className="text-[#86efac]" />
                  <span>Open WhatsApp Concierge</span>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-12 px-7 border-[#d5cebf] rounded-full text-xs font-medium text-[#222222] hover:border-[#1b5e3f]"
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
                Please add items to your shopping bag before proceeding to checkout.
              </p>
              <Button
                asChild
                className="h-11 px-8 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-medium text-xs shadow-sm transition-all"
              >
                <Link to="/products">
                  <span>Explore Fragrances</span>
                  <ArrowRight size={14} className="ml-2 text-[#86efac]" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Main 2-Column Checkout Grid */
            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: Form Details (7 cols) */}
              <div className="lg:col-span-7 space-y-8">
                {/* 1. Contact Information */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8e2d8] shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1b5e3f] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-[11px]">
                      1
                    </span>
                    <span>Contact Information</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g., Vaishali Chavan"
                        className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        WhatsApp / Phone <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g., +91 98202 52868"
                        className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Email Address (for dispatch updates)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g., patron@example.com"
                        className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Delivery Address */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8e2d8] shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1b5e3f] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-[11px]">
                      2
                    </span>
                    <span>Shipping Address</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Street Address / Apartment / Landmark <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g., 402, Lotus Residency, Airoli Sector 8"
                        className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                          City <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g., Navi Mumbai"
                          className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="e.g., Maharashtra"
                          className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                          PIN Code <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          placeholder="e.g., 400708"
                          className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#666666] font-semibold mb-1">
                        Special Delivery Instructions or Gift Note (Optional)
                      </label>
                      <textarea
                        value={orderNote}
                        onChange={(e) => setOrderNote(e.target.value)}
                        placeholder="e.g., Include handwritten gift card, leave at security desk..."
                        rows={2}
                        className="w-full text-xs p-3 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Payment / Order Method */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#e8e2d8] shadow-2xs">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#1b5e3f] mb-4 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-[11px]">
                      3
                    </span>
                    <span>Order Confirmation Method</span>
                  </div>

                  <div className="space-y-3">
                    {/* Method 1: WhatsApp Concierge */}
                    <label
                      onClick={() => setPaymentMethod("whatsapp")}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "whatsapp"
                          ? "border-[#1b5e3f] bg-[#1b5e3f]/5 ring-1 ring-[#1b5e3f]"
                          : "border-[#e8e2d8] bg-white hover:border-[#1b5e3f]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "whatsapp"}
                        onChange={() => setPaymentMethod("whatsapp")}
                        className="mt-1 accent-[#1b5e3f]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <MessageCircle size={16} className="text-[#1b5e3f]" />
                          <span className="text-xs font-semibold text-[#072416]">
                            WhatsApp Atelier Concierge (Recommended)
                          </span>
                          <span className="text-[9px] uppercase tracking-wider bg-[#1b5e3f] text-white px-2 py-0.5 rounded-full font-bold">
                            Direct Atelier
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                          Your order is sent directly to the Artisan Scent atelier staff on WhatsApp for rapid confirmation, delivery scheduling, and personalized concierge care.
                        </p>
                      </div>
                    </label>

                    {/* Method 2: Instant UPI / QR */}
                    <label
                      onClick={() => setPaymentMethod("upi")}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "upi"
                          ? "border-[#1b5e3f] bg-[#1b5e3f]/5 ring-1 ring-[#1b5e3f]"
                          : "border-[#e8e2d8] bg-white hover:border-[#1b5e3f]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "upi"}
                        onChange={() => setPaymentMethod("upi")}
                        className="mt-1 accent-[#1b5e3f]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <QrCode size={16} className="text-[#1b5e3f]" />
                          <span className="text-xs font-semibold text-[#072416]">
                            UPI / GPay / PhonePe / QR
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                          Pay directly via Indian UPI apps. Order reference number generated instantly.
                        </p>
                      </div>
                    </label>

                    {/* Method 3: Cash on Delivery */}
                    <label
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === "cod"
                          ? "border-[#1b5e3f] bg-[#1b5e3f]/5 ring-1 ring-[#1b5e3f]"
                          : "border-[#e8e2d8] bg-white hover:border-[#1b5e3f]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="mt-1 accent-[#1b5e3f]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Package size={16} className="text-[#1b5e3f]" />
                          <span className="text-xs font-semibold text-[#072416]">
                            Pay on Delivery (COD)
                          </span>
                        </div>
                        <p className="text-[11px] text-[#666666] mt-1 font-light leading-relaxed">
                          Pay via cash or UPI upon courier doorstep handover. Confirmed by WhatsApp call.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Submit Action */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-semibold tracking-wide shadow-lg transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={16} className="text-[#86efac]" />
                  <span>
                    {paymentMethod === "whatsapp"
                      ? "Place Order & Open WhatsApp Concierge"
                      : "Confirm & Complete Order"}
                  </span>
                  <ArrowRight size={16} />
                </Button>
              </div>

              {/* Right Column: Order Summary Sidebar (5 cols) */}
              <div className="lg:col-span-5">
                <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#e8e2d8] shadow-2xs sticky top-28 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#072416]">
                      Order Summary ({totalItems})
                    </div>
                    <Link to="/cart" className="text-xs text-[#1b5e3f] hover:underline font-medium">
                      Edit Bag
                    </Link>
                  </div>

                  {/* Items List */}
                  <div className="max-h-72 overflow-y-auto space-y-3 pr-1 divide-y divide-[#f5f2eb]">
                    {cartProducts.map((product) => (
                      <div key={product.id} className="pt-3 first:pt-0 flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-contain bg-[#faf8f5] rounded-lg border border-[#e8e2d8] p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-medium text-[#072416] truncate">
                            {product.name}
                          </h4>
                          <div className="text-[10px] text-[#777777]">
                            Qty: {bag[product.id]} · {product.size || "Standard"}
                          </div>
                        </div>
                        <div className="font-mono text-xs font-semibold text-[#072416]">
                          {money(product.price * (bag[product.id] || 0))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Privilege Promo Code */}
                  <form onSubmit={handleApplyPromo} className="pt-2">
                    <label className="block text-[10px] uppercase tracking-wider text-[#666666] font-semibold mb-1.5">
                      Privilege Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. ARTISAN10"
                        className="flex-1 text-xs p-2.5 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f] uppercase tracking-wider font-mono"
                      />
                      <Button
                        type="submit"
                        variant="outline"
                        className="h-10 px-4 border-[#1b5e3f] text-[#1b5e3f] hover:bg-[#1b5e3f]/5 rounded-xl text-xs font-medium"
                      >
                        Apply
                      </Button>
                    </div>
                    {promoError && (
                      <div className="text-[11px] text-rose-600 mt-1 font-light">{promoError}</div>
                    )}
                    {discountPercent > 0 && (
                      <div className="text-[11px] text-emerald-700 mt-1 font-medium">
                        ✓ {discountPercent}% Privilege Discount Applied!
                      </div>
                    )}
                  </form>

                  {/* Valuation Breakdown */}
                  <div className="pt-4 border-t border-[#f0ede6] space-y-2 text-xs">
                    <div className="flex justify-between text-[#666666]">
                      <span>Subtotal:</span>
                      <span className="font-mono text-[#222222]">{money(cartSubtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-medium">
                        <span>Privilege Discount ({discountPercent}%):</span>
                        <span className="font-mono">-{money(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#666666]">
                      <span>Pan-India Insured Delivery:</span>
                      <span className="font-mono text-[#222222]">
                        {shipping === 0 ? (
                          <span className="text-emerald-700 font-semibold">FREE</span>
                        ) : (
                          money(shipping)
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-[#666666]">
                      <span>GST &amp; Taxes:</span>
                      <span className="text-[#888888]">Included in valuation</span>
                    </div>

                    <div className="flex justify-between items-baseline pt-3 border-t border-[#e8e2d8] text-sm">
                      <span className="font-bold text-[#072416]">Total Valuation:</span>
                      <span className="font-mono font-bold text-xl text-[#072416]">
                        {money(total)}
                      </span>
                    </div>
                  </div>

                  {/* Value Assurance Badges */}
                  <div className="pt-4 border-t border-[#f0ede6] space-y-2 text-[11px] text-[#555555]">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={14} className="text-[#1b5e3f] shrink-0" />
                      <span>100% Rare Botanical Extracts Guarantee</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-[#d4af37] shrink-0" />
                      <span>Free Curated Olfactory Vial Sample Included</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-[#1b5e3f] shrink-0" />
                      <span>Insured Doorstep Pan-India Courier</span>
                    </div>
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
