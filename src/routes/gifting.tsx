import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Heart, Plus, Search, ShoppingBag, X, MessageCircle, Gift, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, money, type Product } from "@/lib/products";
import { useWishlist, useShoppingBag, openCartDrawer } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Luxury Fragrance Gifting & Bespoke Sets | Artisan Scents" },
      {
        name: "description",
        content:
          "Discover Artisan Scents luxury gift sets, perfume coffrets, and bespoke hampers. Handcrafted botanical presentations for weddings, festive milestones, and corporate gifting.",
      },
    ],
  }),
  component: GiftingPage,
});

function GiftingPage() {
  const allProducts = useProducts();
  const { saved, toggleSaved, isSaved, wishlistCount } = useWishlist();
  const { bag, addToBag, updateQty: update, totalItems } = useShoppingBag();

  const [selected, setSelected] = useState<Product>();
  const [panel, setPanel] = useState<"bag" | "search" | null>(null);

  const giftProducts = allProducts.filter((p) => p.category === "gifting");
  const close = () => {
    setPanel(null);
    setSelected(undefined);
  };
  const total = allProducts.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);

  const add = (p: Product) => {
    addToBag(p.id, 1);
    setSelected(undefined);
    openCartDrawer(p);
  };

  return (
    <>
      <div className="announcement">
        Bespoke Fragrance Gift Boxes · Festive Hampers · Corporate Curations{" "}
        <span className="ml-3">✦</span>
      </div>
      <Header
        currentPage="Gifting"
        onSearchClick={() => setPanel("search")}
        onBagClick={() => setPanel("bag")}
        totalItems={totalItems}
        wishlistCount={wishlistCount}
      />

      <main className="bg-[#fafaf8] text-[#333333] min-h-screen">
        {/* Category Hero Banner */}
        <section className="relative overflow-hidden text-[#072416] bg-[#faf9f5] border-b border-[#1b5e3f]/20 py-20 sm:py-28 px-6 sm:px-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/Artisan Scents Luxury Fragrance Gift Set.png"
              alt="Artisan Scents Luxury Gifting Background"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>BESPOKE LUXURY GIFTING</span>
            </div>
            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              Curated Elegance,
              <br />
              <em className="text-[#135d37] font-serif italic">Timeless Impressions</em>
            </h1>
            <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-xl leading-relaxed">
              Celebrate weddings, anniversaries, executive milestones, and sacred moments with bespoke
              Artisan Scents presentation boxes and gold-embossed fragrance coffrets.
            </p>
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        {/* Page Info Section - Image Left, Info Right */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/assets/Artisan Scents Luxury Gift Set.png"
                alt="Artisan Scents Bespoke Luxury Gift Set"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>

            {/* Info Right */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-medium mb-4">
                <span className="w-5 h-[1px] bg-[#d4af37]" />
                <span>BESPOKE GIFTING COLLECTION</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#1a1a1a] mb-4">
                Memorable Fragrances,<br />
                <em className="text-[#1b5e3f] font-serif italic">Impeccable Packaging</em>
              </h2>
              <p className="text-[#555555] text-sm sm:text-base font-light leading-relaxed mb-4">
                Every Artisan Scents gift hamper is an artful union of Indian aromatic heritage and modern luxury.
                From hand-blown flacons and cold-process soaps to artisanal hanging diffusers, each presentation is
                housed in satin-lined, gold-foil embossed keepsake packaging tailored to leave an unforgettable impression.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  "✦ Luxe rigid keepsake boxes with signature gold-foil hot stamping",
                  "✦ Bespoke pairings of extrait perfumes, soaps, diffusers & oils",
                  "✦ Personalised calligraphy gift cards and message sleeves",
                  "✦ Curated wedding favors, executive gifts & festive hampers",
                  "✦ Custom corporate branding and concierge distribution available",
                ].map((item) => (
                  <li key={item} className="text-sm text-[#444444] font-light flex items-start gap-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e8e2d8]" />
                <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] font-semibold">Artisanal Gifting · Bespoke Concierge</span>
                <div className="h-px flex-1 bg-[#e8e2d8]" />
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#e8e2d8]">
            <div>
              <div className="text-xs uppercase tracking-widest text-[#1b5e3f] font-semibold">CURATED SELECTION</div>
              <h3 className="font-display text-2xl sm:text-3xl font-normal text-[#111111]">Signature Gift Boxes</h3>
            </div>
            <div className="text-xs text-[#777777] font-light">
              Showing <span className="text-[#1b5e3f] font-medium">{giftProducts.length}</span> luxury sets
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {giftProducts.map((p, idx) => {
              const delayClass =
                idx % 3 === 0
                  ? "reveal-delay-50"
                  : idx % 3 === 1
                    ? "reveal-delay-150"
                    : "reveal-delay-250";
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  isSaved={saved.includes(p.id)}
                  onToggleSaved={toggleSaved}
                  onAddToCart={add}
                  delayClass={delayClass}
                  freeGiftLabel="Incl. Bespoke Ribbon & Card"
                />
              );
            })}
          </div>
        </section>

        {/* Corporate & Bulk Bespoke Inquiries */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 pb-20">
          <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#0c2e1f] via-[#134730] to-[#0a2318] text-white border border-[#2d8659]/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#d4af37]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-[#d4af37]/40 text-[#f6e05e] text-xs font-semibold tracking-wider uppercase mb-4">
                <Gift size={13} className="text-[#f6e05e]" />
                Corporate &amp; Wedding Concierge
              </span>
              <h3 className="font-display text-3xl sm:text-4xl text-white font-normal mb-4">
                Looking for Bespoke Custom Gifting?
              </h3>
              <p className="text-[#d1e7dc] text-sm sm:text-base font-light leading-relaxed mb-6">
                From luxury wedding favors to high-tier executive corporate hampers, our concierge team
                crafts bespoke fragrance assortments with custom branding, wax-sealed certificates,
                and personalized notes.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-12 px-8 rounded-full bg-[#d4af37] hover:bg-[#c29d29] text-[#072416] font-semibold text-sm shadow-xl"
                >
                  <a
                    href="https://wa.me/918104506318?text=Hello%20Artisan%20Scents%2C%20I%20would%20like%20to%20inquire%20about%20bespoke%20corporate%20and%20wedding%20gifting%20sets."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    <MessageCircle size={17} />
                    Inquire via WhatsApp
                  </a>
                </Button>
                <a
                  href="/contact"
                  className="h-12 px-7 rounded-full border border-white/70 bg-transparent hover:bg-white/15 text-white inline-flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
                >
                  Contact Atelier <ArrowRight size={15} />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer tagline="Bespoke luxury gifting and artisanal fragrance hampers." />

      {(selected || panel) && (
        <div className={`overlay ${panel === "bag" ? "bag-overlay" : ""}`} onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            className={`dialog ${panel === "bag" ? "bag-panel" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {panel === "bag" && (
              <div className="cart-content">
                <div className="cart-header">
                  <div className="cart-title">Your Shopping Bag</div>
                  <button className="cart-close-btn" onClick={close}>
                    <X size={18} />
                  </button>
                </div>
                <div className="cart-items">
                  {giftProducts
                    .filter((p) => (bag[p.id] || 0) > 0)
                    .map((p) => (
                      <div key={p.id} className="cart-item">
                        <img src={p.image} alt={p.name} />
                        <div className="cart-item-details">
                          <div className="cart-item-name">{p.name}</div>
                          <div className="cart-item-price">{money(p.price)}</div>
                          <div className="cart-item-quantity">
                            <button onClick={() => update(p.id, Math.max(0, (bag[p.id] || 0) - 1))}>-</button>
                            <span>{bag[p.id]}</span>
                            <button onClick={() => update(p.id, (bag[p.id] || 0) + 1)}>+</button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Subtotal</span>
                    <span>{money(total)}</span>
                  </div>
                  <Button asChild className="cart-checkout-btn">
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
