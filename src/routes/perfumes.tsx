import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Heart, Plus, Search, ShoppingBag, X, ChevronRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, money, type Product } from "@/lib/products";
import { useWishlist, useShoppingBag, openCartDrawer } from "@/lib/store";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/perfumes")({
  head: () => ({
    meta: [
      { title: "Luxury Perfumes | Artisan Scents" },
      {
        name: "description",
        content:
          "Discover our collection of luxury perfumes. Sophisticated compositions crafted for special occasions and personal wear.",
      },
    ],
  }),
  component: PerfumesPage,
});

function PerfumesPage() {
  const allProducts = useProducts();
  const { saved, toggleSaved, isSaved, wishlistCount } = useWishlist();
  const { bag, addToBag, updateQty: update, totalItems } = useShoppingBag();

  const [selected, setSelected] = useState<Product>();
  const [panel, setPanel] = useState<"bag" | "search" | null>(null);
  const [query, setQuery] = useState("");

  const perfumes = allProducts.filter((p) => p.category === "perfumes");
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
        Luxury Fragrances. Premium Expressions. <span className="ml-3">✦</span>
      </div>
      <Header
        currentPage="Perfumes"
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
              src="/assets/shopimages/perfume sectionimage.png"
              alt="Luxury Perfumes Background"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>HAUTE PARFUMERIE</span>
            </div>
            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              Discover Your
              <br />
              <em className="text-[#135d37] font-serif italic">Signature Scent</em>
            </h1>
            <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-xl leading-relaxed">
              Explore our curated collection of luxury perfumes, crafted for every mood, every
              moment. Hand-blended with high-concentration rare essences.
            </p>
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        {/* Filter Bar & Controls */}
        <div className="reveal-fade max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e2d8]">
          <div className="flex flex-wrap items-center gap-2">
            {["All", "Floral", "Woody", "Amber", "Oriental"].map((mood) => (
              <button
                key={mood}
                onClick={() => setQuery(mood === "All" ? "" : mood)}
                className={`px-4 py-1.5 text-xs rounded-full border transition-all ${
                  (mood === "All" && !query) || query === mood
                    ? "bg-[#1b5e3f] border-[#1b5e3f] text-white shadow-md font-medium"
                    : "border-[#e8e2d8] bg-white text-[#666666] hover:text-[#1b5e3f] hover:border-[#1b5e3f]/40"
                }`}
              >
                {mood}
              </button>
            ))}
          </div>
          <div className="text-xs text-[#777777] font-light">
            Showing <span className="text-[#1b5e3f] font-medium">{perfumes.length}</span> luxury
            fragrances
          </div>
        </div>


        {/* Page Info Section - Image Left, Info Right */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image Left */}
            <div className="relative rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/assets/shopimages/perfume sectionimage.png"
                alt="Artisan Perfumes Collection"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            </div>
            {/* Info Right */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-medium mb-4">
                <span className="w-5 h-[1px] bg-[#d4af37]" />
                <span>LUXURY PERFUMES</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-tight text-[#1a1a1a] mb-4">
                Crafted for the<br />
                <em className="text-[#1b5e3f] font-serif italic">Discerning Soul</em>
              </h2>
              <p className="text-[#555555] text-sm sm:text-base font-light leading-relaxed mb-4">
                Our luxury perfume collection is the crowning jewel of Artisan Scents. Each fragrance is a complex composition of high-concentration rare essences — sourced from KEOMC's botanical labs, hand-blended, and presented in premium glass flacons. From soft florals to deep woody ambers, every bottle tells a story.
              </p>
              <ul className="space-y-2 mb-6">
                {[
                  '✦ High Extrait Concentration (30–40% pure essence)',
                  '✦ Long-lasting sillage — up to 12 hours',
                  '✦ Handcrafted in small batches',
                  '✦ Luxury glass flacons with wooden caps',
                  '✦ Perfect for gifting & personal wear',
                ].map((item) => (
                  <li key={item} className="text-sm text-[#444444] font-light flex items-start gap-2">
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-[#e8e2d8]" />
                <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] font-semibold">Est. 2020 · Premium House</span>
                <div className="h-px flex-1 bg-[#e8e2d8]" />
              </div>
            </div>
          </div>
        </section>

        {/* Product Grid - Synchronized with Delicate Beige Borders */}
        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {perfumes
              .filter((p) =>
                query
                  ? p.notes.toLowerCase().includes(query.toLowerCase()) ||
                    p.family.toLowerCase().includes(query.toLowerCase())
                  : true,
              )
              .map((p, idx) => {
                const delayClass =
                  idx % 4 === 0
                    ? "reveal-delay-50"
                    : idx % 4 === 1
                      ? "reveal-delay-150"
                      : idx % 4 === 2
                        ? "reveal-delay-250"
                        : "reveal-delay-350";
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
      </main>

      <Footer tagline="Luxury fragrances. Premium expressions." />

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
                {selected
                  ? selected.name
                  : panel === "bag"
                    ? `Your bag (${totalItems})`
                    : "Search fragrances"}
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close" autoFocus onClick={close}>
                <X />
              </Button>
            </div>

            {selected && (
              <div className="detail-grid">
                <img src={selected.image} alt={selected.name} style={{ objectFit: "contain" }} />
                <div>
                  <div className="eyebrow text-muted-foreground">Luxury · Eau de parfum</div>
                  <h3 className="section-title">{selected.name}</h3>
                  <p className="text-sm leading-7 my-5">{selected.description}</p>
                  <p className="product-notes">{selected.notes}</p>
                  <p className="text-sm my-5">100 ml · {money(selected.price)}</p>
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
                      <p className="status-note my-4">Start building your collection</p>
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
                              <h3 className="font-display text-xl">{p.name}</h3>
                              <span className="text-xs">{money(p.price * (bag[p.id] || 0))}</span>
                            </div>
                            <p className="product-notes">{p.category}</p>
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
                  placeholder="Search by fragrance name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search-results">
                  {perfumes
                    .filter((p) =>
                      `${p.name} ${p.notes}`.toLowerCase().includes(query.toLowerCase()),
                    )
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
                          <h3 className="font-display text-2xl">{p.name}</h3>
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





