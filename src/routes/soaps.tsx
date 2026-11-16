import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Heart, Plus, ShoppingBag, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, money, type Product } from "@/lib/products";
import { useWishlist, useShoppingBag, openCartDrawer } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/soaps")({
  head: () => ({
    meta: [
      { title: "Handcrafted Soaps | Artisan Scents" },
      {
        name: "description",
        content:
          "Discover Artisan Scents handcrafted soaps. Botanical bathing bars enriched with pure essential oils for a soft, fragrant cleanse.",
      },
    ],
  }),
  component: SoapsPage,
});

function SoapsPage() {
  const allProducts = useProducts();
  const { saved, toggleSaved, isSaved, wishlistCount } = useWishlist();
  const { bag, addToBag, updateQty: update, totalItems } = useShoppingBag();

  const [selected, setSelected] = useState<Product>();
  const [panel, setPanel] = useState<"bag" | "search" | null>(null);
  const [query, setQuery] = useState("");

  const soaps = allProducts.filter((p) => p.category === "soaps");
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
        Botanical Bathing Bars · Cold-Processed · Pure Essential Oils{" "}
        <span className="ml-3">✦</span>
      </div>
      <Header
        currentPage="Soaps"
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
              src="https://images.unsplash.com/photo-1607006314644-245bfbc0be35?auto=format&fit=crop&w=2400&q=85"
              alt="Handcrafted Soaps Background"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>HANDCRAFTED BOTANICAL SOAPS</span>
            </div>
            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              Handcrafted
              <br />
              <em className="text-[#135d37] font-serif italic">Luxury Soaps</em>
            </h1>
            <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-xl leading-relaxed">
              Cold-processed bathing bars enriched with pure botanical essential oils. Gentle on the
              skin, generous in lather, and quietly luxurious in fragrance.
            </p>
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        {/* Page Info Section - Image Left, Info Right */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#e8e2d8] bg-[#faf8f5]">
              <img
                src="/assets/soap_sectionimage.jpg"
                alt="Bathing as a Daily Ritual - Artisan Soaps"
                className="w-full h-[500px] object-cover p-6"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent pointer-events-none" />
            </div>
            {/* Info Right */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-semibold mb-3">
                <span className="w-5 h-[1.5px] bg-[#d4af37]" />
                <span>PERSONAL CARE</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#111111] leading-tight mb-4">
                Bathing as a<br />
                <em className="text-[#1b5e3f] font-serif italic font-medium">Daily Ritual</em>
              </h2>
              <p className="text-[#2b2b2b] text-sm sm:text-base font-normal leading-relaxed mb-5">
                Our handcrafted bathing bars are made using the traditional cold-process method — slow-cured in small batches to preserve the natural glycerin and essential oil integrity. Enriched with plant-derived butters, these soaps are gentle on the skin, generous in lather, and quietly luxurious in lasting botanical fragrance.
              </p>
              <ul className="space-y-2.5 mb-6">
                {[
                  'Cold-processed — naturally glycerin-rich',
                  'Enriched with pure essential oils',
                  'No synthetic fragrances or harsh SLS',
                  'Gentle for all skin types',
                  'Handcrafted in small batches',
                ].map((item) => (
                  <li key={item} className="text-sm sm:text-[15px] text-[#1a1a1a] font-medium flex items-center gap-2.5">
                    <span className="text-[#1b5e3f] font-bold">✦</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#dcd6cb]" />
                <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] font-bold">Cold Process · Botanical · Artisan</span>
                <div className="h-px flex-1 bg-[#dcd6cb]" />
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid - Synchronized with Delicate Beige Borders */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {soaps.map((p, idx) => {
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
                  freeGiftLabel="Incl. Free Olfactory Sample"
                />
              );
            })}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title mb-8 reveal-on-scroll">The Craft of Cold-Process</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="reveal-on-scroll reveal-delay-100 bg-white/5 p-6 rounded-lg border border-[#1b5e3f]/12">
              <h3 className="font-display text-lg mb-2 text-[#333333]">Pure Botanicals</h3>
              <p className="text-sm text-[#666666]">
                Formulated with plant-derived butters and pure essential oils — no harsh synthetic
                lathering agents.
              </p>
            </div>
            <div className="reveal-on-scroll reveal-delay-200 bg-white/5 p-6 rounded-lg border border-[#1b5e3f]/12">
              <h3 className="font-display text-lg mb-2 text-[#333333]">Hand-Poured</h3>
              <p className="text-sm text-[#666666]">
                Each bar is cured slowly in small batches, preserving the integrity of every
                fragrance note.
              </p>
            </div>
            <div className="reveal-on-scroll reveal-delay-300 bg-white/5 p-6 rounded-lg border border-[#1b5e3f]/12">
              <h3 className="font-display text-lg mb-2 text-[#333333]">Skin Kind</h3>
              <p className="text-sm text-[#666666]">
                Creamy, balanced lather that cleanses gently and leaves a soft, lingering scent.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer tagline="Handcrafted botanical soaps." />

      {(selected || panel) && (
        <div className={`overlay ${panel === "bag" ? "bag-overlay" : ""}`} onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            className={`dialog ${panel === "bag" ? "bag-panel" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header">
              <h2 className="font-display text-3xl">
                {selected ? selected.name : panel === "bag" ? `Your bag (${totalItems})` : "Search"}
              </h2>
              <Button variant="ghost" size="icon" autoFocus onClick={close}>
                <X />
              </Button>
            </div>

            {selected && (
              <div className="detail-grid">
                <img src={selected.image} alt={selected.name} style={{ objectFit: "contain" }} />
                <div>
                  <div className="eyebrow text-muted-foreground">
                    Personal Care · {selected.size}
                  </div>
                  <h3 className="section-title">{selected.name}</h3>
                  <p className="text-sm leading-7 my-5">{selected.description}</p>
                  <p className="product-notes">{selected.notes}</p>
                  <p className="text-sm my-5">{money(selected.price)}</p>
                  <Button className="w-full" onClick={() => add(selected)}>
                    Add to bag <Plus />
                  </Button>
                </div>
              </div>
            )}

            {panel === "bag" && (
              <>
                <div className="bag-list">
                  {totalItems === 0 ? (
                    <div className="py-16 text-center">
                      <ShoppingBag className="mx-auto mb-5 text-muted-foreground" />
                      <h3 className="font-display text-3xl">Your bag is empty</h3>
                      <Button variant="editorial" onClick={close}>
                        Continue shopping <ArrowRight />
                      </Button>
                    </div>
                  ) : (
                    allProducts
                      .filter((p) => (bag[p.id] || 0) > 0)
                      .map((p) => (
                        <div className="bag-item" key={p.id}>
                          <img src={p.image} alt={p.name} style={{ objectFit: "contain" }} />
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-display text-lg">{p.name}</h3>
                              <span className="text-xs">{money(p.price * (bag[p.id] || 0))}</span>
                            </div>
                            <div className="quantity">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => update(p.id, -1)}
                              >
                                <Plus size={14} className="rotate-45" />
                              </Button>
                              <span className="text-xs">{bag[p.id]}</span>
                              <Button variant="outline" size="icon" onClick={() => update(p.id, 1)}>
                                <Plus size={14} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {totalItems > 0 && (
                  <div className="pt-6">
                    <div className="flex justify-between text-sm mb-4">
                      <span>Subtotal</span>
                      <span>{money(total)}</span>
                    </div>
                    <Button
                      className="w-full h-12 bg-[#1b5e3f] hover:bg-[#164a31] text-white rounded-full font-semibold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 mb-2"
                      onClick={() => {
                        window.location.href = "/cart";
                      }}
                    >
                      <MessageCircle size={16} className="text-[#86efac]" />
                      <span>Proceed to WhatsApp Checkout</span>
                      <ArrowRight size={15} />
                    </Button>
                    <p className="status-note mt-2 text-center text-xs">
                      Complimentary Pan-India delivery on orders above ₹999.
                    </p>
                  </div>
                )}
              </>
            )}

            {panel === "search" && (
              <>
                <input
                  className="search-input"
                  placeholder="Search by product name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search-results">
                  {soaps
                    .filter((p) => `${p.name} ${p.notes}`.toLowerCase().includes(query.toLowerCase()))
                    .map((p) => (
                      <a
                        href={`#${p.id}`}
                        key={p.id}
                        className="bag-item"
                        onClick={(e) => {
                          e.preventDefault();
                          setPanel(null);
                          setSelected(p);
                        }}
                      >
                        <img src={p.image} alt={p.name} style={{ objectFit: "contain" }} />
                        <div>
                          <h3 className="font-display text-lg">{p.name}</h3>
                          <p className="product-notes">{p.notes}</p>
                          <span className="text-xs">{money(p.price)}</span>
                        </div>
                      </a>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}





