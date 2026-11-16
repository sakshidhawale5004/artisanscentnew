import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, Sparkles } from "lucide-react";
import { useShoppingBag, addOrderToCRM } from "@/lib/store";
import { useProducts, money, type Product } from "@/lib/products";
import { triggerSprinkles } from "@/lib/sprinkles";
import { Button } from "@/components/ui/button";

type CartDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  lastAddedProduct?: Product | null;
};

// Luxury curated add-ons matching Screenshot 2
const ADD_ONS = [
  {
    id: "addon-discovery-flacon",
    name: "Mini Extrait Discovery Flacon (10ml)",
    price: 149,
    originalPrice: 299,
    image: "/assets/body perform/Luxurious Ivory Amber Perfume Display.png",
    category: "perfumes" as const,
    notes: "Complimentary Olfactory Sampler",
  },
  {
    id: "addon-wooden-vent-clip",
    name: "Artisan Wooden Car Diffuser Clip",
    price: 199,
    originalPrice: 399,
    image: "/assets/car perfurm/Arctic Mist Luxury Car Fragrance.png",
    category: "car-perfumes" as const,
    notes: "Natural Beechwood Diffuser Ring",
  },
];

export function CartDrawer({ isOpen, onClose, lastAddedProduct }: CartDrawerProps) {
  const { bag, updateQty, removeItem, addToBag, totalItems } = useShoppingBag();
  const products = useProducts();

  const [showToast, setShowToast] = useState(true);
  const [activeTab, setActiveTab] = useState<"cart" | "address">("cart");

  // Address form fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"prepaid" | "cod">("prepaid");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lastAddedProduct) {
      setShowToast(true);
    }
  }, [lastAddedProduct]);

  useEffect(() => {
    if (!isOpen) {
      setActiveTab("cart");
    }
  }, [isOpen]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Gather cart products (including add-ons if selected)
  const allAvailable = [...products, ...ADD_ONS.map((a) => ({
    ...a,
    family: "Add-on",
    badge: "50% OFF",
    description: a.notes,
  }))];

  const cartItems = allAvailable.filter((p) => (bag[p.id] || 0) > 0);

  const subtotal = cartItems.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);
  const originalSubtotal = cartItems.reduce((sum, p) => {
    const orig = (p as any).originalPrice || (p.salePrice ? p.price : Math.round((p.price * 2) / 10) * 10 - 1);
    return sum + orig * (bag[p.id] || 0);
  }, 0);

  const totalSaved = Math.max(0, originalSubtotal - subtotal);
  const freeThreshold = 999;
  const isFreeDelivery = subtotal >= freeThreshold;
  const progressRatio = Math.min(100, Math.round((subtotal / freeThreshold) * 100));

  const handleAddOn = (addon: typeof ADD_ONS[number], e: React.MouseEvent) => {
    triggerSprinkles(e);
    addToBag(addon.id, 1);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);

    const itemsSummary = cartItems
      .map((p) => `${p.name} x${bag[p.id]} (${money(p.price * (bag[p.id] || 0))})`)
      .join(", ");

    const finalTotal = subtotal;

    const newOrder = addOrderToCRM({
      customer: name.trim() || "Valued Patron",
      email: "order@artisanscent.com",
      phone: phone.trim() || "+91 (Mobile)",
      items: itemsSummary,
      total: finalTotal,
      note: `Address: ${address.trim()}, Pincode: ${pincode.trim()} | Method: ${paymentMethod.toUpperCase()}`,
      source: "Quick Cart Checkout",
    });

    // WhatsApp Concierge message
    const message = `✦ Artisan Scent Haute Parfumerie Order Confirmation ✦\n\nReference: ${newOrder.id}\nPatron: ${name.trim() || "Customer"}\nContact: ${phone.trim()}\nShipping Address: ${address.trim()}, Pincode: ${pincode.trim()}\nPayment Preference: ${paymentMethod === "prepaid" ? "Prepaid (UPI / Card)" : "Cash on Delivery"}\n\nItems:\n${itemsSummary}\n\nSubtotal: ${money(subtotal)}\nValuation Saved: ${money(totalSaved)}\nPan-India Delivery: FREE\nFinal Payable: ${money(finalTotal)}\n\nPlease dispatch my order.`;

    const whatsappUrl = `https://wa.me/919820252868?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] flex justify-end">
      {/* Dark Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Drawer Panel */}
      <div className="relative w-full max-w-[460px] h-full bg-[#fbf9f5] shadow-2xl flex flex-col z-10 overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Subtle decorative floating sprinkles in background matching Screenshot 2 */}
        <div className="absolute inset-0 pointer-events-none opacity-35 overflow-hidden">
          <div className="absolute top-12 right-6 w-2.5 h-2.5 rounded-full bg-[#d4af37]/60" />
          <div className="absolute top-28 left-8 w-2 h-2 rounded-full bg-[#1b5e3f]/40" />
          <div className="absolute top-44 right-14 w-3 h-1.5 rounded-full rotate-45 bg-[#f472b6]/50" />
          <div className="absolute top-80 left-4 w-2 h-3 rounded-full -rotate-12 bg-[#86efac]/50" />
          <div className="absolute bottom-52 right-8 w-2.5 h-2.5 rounded-full bg-[#d4af37]/50" />
        </div>

        {/* 1. Header (Matching Screenshot 2: "My Cart (1)  Save ₹900  ✕") */}
        <div className="relative px-5 py-4 bg-[#fbf9f5] border-b border-[#ece7de] flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2.5">
            <h2 className="font-display text-2xl font-medium text-[#111111] tracking-tight">
              My Cart ({totalItems})
            </h2>
            {totalSaved > 0 && (
              <span className="bg-[#d7f5e5] text-[#1b5e3f] text-xs font-semibold px-2.5 py-0.5 rounded-full tracking-wide">
                Save {money(totalSaved)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#555555] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X size={20} strokeWidth={1.8} />
          </button>
        </div>

        {/* 2. Scrollable Body Area */}
        <div className="relative flex-1 overflow-y-auto px-5 py-3 space-y-3 z-10">
          {activeTab === "cart" ? (
            <>
              {/* Recently Added Toast Notification (Matching Screenshot 2) */}
              {lastAddedProduct && showToast && (
                <div className="rounded-2xl bg-white border border-[#ece7de] shadow-sm p-3 flex items-center justify-between gap-3 animate-in fade-in duration-200">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={lastAddedProduct.image}
                      alt={lastAddedProduct.name}
                      className="w-12 h-12 object-contain rounded-xl bg-[#faf8f5] p-1 border border-[#eeebe5] shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#d97706] tracking-wide">
                        Added to cart!
                      </div>
                      <div className="text-xs font-medium text-[#111111] truncate mt-0.5">
                        {lastAddedProduct.name}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowToast(false)}
                    className="text-[#999999] hover:text-[#111111] p-1 cursor-pointer shrink-0"
                    aria-label="Dismiss banner"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              {/* Free Delivery & Free Gift Progress Bar (Matching Screenshot 2) */}
              <div className="space-y-1.5 pt-1 pb-1">
                <div className="text-xs font-semibold text-[#111111] leading-tight">
                  {isFreeDelivery ? (
                    <span>
                      You&apos;ve unlocked{" "}
                      <strong className="text-[#1b5e3f] uppercase font-bold">
                        FREE Pan-India Delivery + Free Olfactory Sample!
                      </strong>
                    </span>
                  ) : (
                    <span>
                      Add{" "}
                      <strong className="text-[#1b5e3f] font-bold">
                        {money(freeThreshold - subtotal)}
                      </strong>{" "}
                      more to unlock{" "}
                      <strong className="text-[#1b5e3f]">FREE Delivery + Free Sample!</strong>
                    </span>
                  )}
                </div>
                <div className="w-full h-1.5 bg-[#e8e3d8] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d4af37] via-[#2ec486] to-[#1b5e3f] rounded-full transition-all duration-500"
                    style={{ width: `${progressRatio}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              {cartItems.length === 0 ? (
                <div className="py-16 text-center">
                  <ShoppingBag size={44} className="mx-auto mb-3 text-[#aaa7a0] opacity-40" />
                  <h3 className="font-display text-xl text-[#111111]">Your cart is empty</h3>
                  <p className="text-xs text-[#777777] mt-1 mb-6">
                    Explore our collection of haute parfumerie and artisanal botanicals.
                  </p>
                  <Button
                    onClick={onClose}
                    className="rounded-full bg-[#1b5e3f] hover:bg-[#154a31] text-white text-xs px-6 h-10 font-medium"
                  >
                    Explore Creations
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cartItems.map((p) => {
                    const qty = bag[p.id] || 0;
                    const origPrice =
                      (p as any).originalPrice ||
                      (p.salePrice ? p.price : Math.round((p.price * 2) / 10) * 10 - 1);

                    return (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-[#ece7de] bg-white p-3.5 shadow-2xs flex gap-3.5 items-center justify-between"
                      >
                        {/* Thumbnail */}
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-18 h-18 sm:w-20 sm:h-20 object-contain rounded-xl bg-[#faf8f5] p-1.5 border border-[#eeebe5] shrink-0"
                        />

                        {/* Middle Info */}
                        <div className="flex-1 min-w-0 pr-1">
                          <div className="flex items-start justify-between gap-1">
                            <h4 className="font-display text-sm sm:text-base font-semibold text-[#111111] leading-snug truncate">
                              {p.name}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeItem(p.id)}
                              className="text-[#999999] hover:text-rose-600 transition-colors p-0.5 cursor-pointer shrink-0"
                              aria-label={`Remove ${p.name}`}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="mt-1">
                            <span className="text-[10px] font-bold text-[#1b5e3f] bg-[#e8f6ef] px-2 py-0.5 rounded uppercase">
                              50% OFF
                            </span>
                          </div>

                          {/* Controls Row */}
                          <div className="flex items-center justify-between mt-3">
                            {/* Pill Quantity Selector (Matching Screenshot 2) */}
                            <div className="rounded-full bg-[#f6f4ee] border border-[#e5e0d4] px-2.5 py-1 flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateQty(p.id, -1)}
                                className="text-xs text-[#555555] hover:text-[#111111] cursor-pointer"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="font-mono text-xs font-bold text-[#111111]">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  triggerSprinkles(e);
                                  updateQty(p.id, 1);
                                }}
                                className="text-xs text-[#555555] hover:text-[#111111] cursor-pointer"
                                aria-label="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <div className="font-display text-base font-bold text-[#111111]">
                                {money(p.price * qty)}
                              </div>
                              <div className="text-[11px] text-[#999999] line-through font-mono">
                                {money(origPrice * qty)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. AVAILABLE ADD-ONS Section (Matching Screenshot 2) */}
              <div className="rounded-2xl border border-[#bbf0d2] bg-[#f2faf5]/70 p-3.5 mt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#1b5e3f] mb-2.5 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#d4af37]" />
                  <span>AVAILABLE ADD-ONS</span>
                </div>

                <div className="space-y-2">
                  {ADD_ONS.map((addon) => {
                    const isAdded = (bag[addon.id] || 0) > 0;
                    return (
                      <div
                        key={addon.id}
                        className="rounded-xl bg-white border border-[#e2ece5] p-2.5 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={addon.image}
                            alt={addon.name}
                            className="w-12 h-12 object-contain rounded-lg bg-[#faf8f5] p-1 border border-[#eeebe5] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-[#111111] truncate">
                              {addon.name}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="font-bold text-xs text-[#111111]">
                                {money(addon.price)}
                              </span>
                              <span className="text-[10px] text-[#999999] line-through font-mono">
                                {money(addon.originalPrice)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {isAdded ? (
                          <span className="text-xs font-bold text-[#1b5e3f] flex items-center gap-1 px-3 py-1 bg-[#d7f5e5] rounded-full">
                            <Check size={12} /> Added
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleAddOn(addon, e)}
                            className="bg-[#1b5e3f] hover:bg-[#154a31] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                          >
                            + Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Address & Delivery Step */
            <form onSubmit={handleCheckoutSubmit} className="space-y-3 pt-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#ece7de]">
                <h3 className="font-display text-lg font-semibold text-[#111111]">
                  Delivery Address &amp; Details
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("cart")}
                  className="text-xs text-[#1b5e3f] font-medium hover:underline cursor-pointer"
                >
                  ← Back to cart
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aditi Sharma"
                  className="w-full bg-white border border-[#d5cebf] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#1b5e3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1">
                  Mobile / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-white border border-[#d5cebf] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#1b5e3f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1">
                  Delivery Address (House/Street/Area) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Apartment, Street name, Landmark"
                  className="w-full bg-white border border-[#d5cebf] rounded-xl px-3.5 py-2 text-xs text-[#111111] focus:outline-none focus:border-[#1b5e3f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="400001"
                    className="w-full bg-white border border-[#d5cebf] rounded-xl px-3.5 py-2.5 text-xs text-[#111111] focus:outline-none focus:border-[#1b5e3f]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#444444] mb-1">
                    Pan-India Delivery
                  </label>
                  <div className="bg-[#e8f6ef] text-[#1b5e3f] font-bold text-xs py-2.5 px-3 rounded-xl border border-[#bbf0d2] text-center">
                    FREE
                  </div>
                </div>
              </div>

              {/* Payment Preference */}
              <div>
                <label className="block text-xs font-semibold text-[#444444] mb-1.5">
                  Payment Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("prepaid")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "prepaid"
                        ? "border-[#1b5e3f] bg-[#e8f6ef] text-[#1b5e3f] shadow-2xs"
                        : "border-[#d5cebf] bg-white text-[#666666]"
                    }`}
                  >
                    <span>UPI / GPay / Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-[#1b5e3f] bg-[#e8f6ef] text-[#1b5e3f] shadow-2xs"
                        : "border-[#d5cebf] bg-white text-[#666666]"
                    }`}
                  >
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-13 mt-4 rounded-2xl bg-black hover:bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <span>Confirm &amp; Place Order ({money(subtotal)})</span>
                <ArrowRight size={15} />
              </Button>
            </form>
          )}
        </div>

        {/* 4. Bottom Footer Strip (Matching Screenshot 2) */}
        {cartItems.length > 0 && activeTab === "cart" && (
          <div className="relative border-t border-[#ece7de] bg-white shadow-lg shrink-0 z-20">
            {/* Savings Green Bar (Matching Screenshot 2) */}
            {totalSaved > 0 && (
              <div className="bg-[#0d6e43] text-white text-center py-2 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-1.5">
                <span>✦</span>
                <span>{money(totalSaved)} Saved so far!</span>
                <span>✦</span>
              </div>
            )}

            <div className="p-4 sm:p-5 space-y-3">
              {/* Subtotal Row */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#111111]">Subtotal</span>
                <div className="flex items-center gap-2">
                  {originalSubtotal > subtotal && (
                    <span className="font-mono text-sm text-[#999999] line-through">
                      {money(originalSubtotal)}
                    </span>
                  )}
                  <span className="font-display text-2xl font-bold text-[#111111]">
                    {money(subtotal)}
                  </span>
                </div>
              </div>

              {/* Big Black Action Button with Payment Logos (Matching Screenshot 2) */}
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full h-14 bg-black hover:bg-neutral-900 active:scale-[0.99] text-white rounded-2xl flex items-center justify-between px-5 shadow-md transition-all cursor-pointer no-underline"
              >
                <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white">
                  PROCEED TO CHECKOUT
                </span>

                {/* Payment Brand Badges */}
                <div className="flex items-center gap-1.5">
                  {/* Paytm pill */}
                  <span className="bg-white text-[#002e6e] text-[10px] font-black px-2 py-0.5 rounded shadow-2xs font-sans tracking-tight">
                    paytm
                  </span>
                  {/* PhonePe badge */}
                  <span className="w-5 h-5 rounded-full bg-[#5f259f] text-white text-[11px] font-bold flex items-center justify-center shadow-2xs">
                    पे
                  </span>
                  {/* G Pay badge */}
                  <span className="bg-white text-[#5f6368] text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs font-sans flex items-center gap-0.5">
                    <span className="text-[#4285f4] font-black">G</span> Pay
                  </span>
                </div>
              </Link>

              {/* Reassurance text (Matching Screenshot 2) */}
              <div className="text-[11px] text-center text-[#555555] font-medium leading-tight">
                Flat ₹500 Cashback on all Prepaid Orders · Cash on Delivery Available
              </div>

              {/* Continue Shopping button (Matching Screenshot 2) */}
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 rounded-2xl border border-[#d5cfc2] bg-white hover:bg-[#faf8f4] text-xs font-semibold text-[#333333] transition-colors text-center cursor-pointer block"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
