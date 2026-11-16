import { createFileRoute, Link } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState, useMemo, useRef } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  Lock,
  X,
  MessageCircle,
  Factory,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts, money, type Product } from "@/lib/products";
import { useWishlist, useShoppingBag, openCartDrawer } from "@/lib/store";
import heroPoster from "@/assets/hero-poster.jpg.asset.json";
import { EntranceLoader } from "@/components/EntranceLoader";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import perfumeStory from "@/assets/images/perfume_story_editorial_1791888489737.jpg";
import emeraldPerfume from "@/assets/images/hero_emerald_perfume_1791888469120.jpg";
import aboutSectionImage from "@/assets/images/aboutsectionimagehomepage.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Artisan Scents — Premium Fragrances & Essential Oils" },
      {
        name: "description",
        content:
          "Discover Artisan Scents: luxury perfumes, pure essential oils, car diffusers, and handcrafted agarbatti. Crafted with botanical expertise.",
      },
      { property: "og:title", content: "Artisan Scents — Premium Fragrances" },
      {
        property: "og:description",
        content: "Premium fragrances. Botanical expertise. Artisanal excellence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const products = useProducts();
  const [selected, setSelected] = useState<Product>();
  const { bag, addToBag, updateQty: update, totalItems } = useShoppingBag();
  const { saved, toggleSaved, wishlistCount } = useWishlist();
  const [panel, setPanel] = useState<"bag" | "search" | "menu" | "story" | null>(null);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const close = () => {
    setPanel(null);
    setSelected(undefined);
    setCheckout(false);
  };
  const total = products.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);
  useEffect(() => {
    setMounted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);
  useEffect(() => {
    if (!panel && !selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", listener);
    };
  }, [panel, selected]);
  const add = (p: Product) => {
    addToBag(p.id, 1);
    setSelected(undefined);
    openCartDrawer(p);
  };
  const bestSellers = useMemo(() => {
    // 5 category best sellers (1 iconic product from each category)
    return [
      products.find((p) => p.id === "ivory-amber") || products.find((p) => p.category === "perfumes"),
      products.find((p) => p.id === "patchouli-oil") || products.find((p) => p.category === "essence-oils"),
      products.find((p) => p.id === "car-arctic-mist") || products.find((p) => p.category === "car-perfumes"),
      products.find((p) => p.id === "agarbatti-premium") || products.find((p) => p.category === "agarbatti"),
      products.find((p) => p.id === "soap-signature") || products.find((p) => p.category === "soaps"),
    ].filter((p): p is Product => Boolean(p));
  }, [products]);

  return (
    <>
      <EntranceLoader />
      <div className="announcement">
        Luxury Fragrances. Botanical Excellence. Artisanal Craftsmanship.{" "}
        <span className="ml-3">✦</span>
      </div>
      <Header
        currentPage="Home"
        onSearchClick={() => setPanel("search")}
        onBagClick={() => setPanel("bag")}
        totalItems={totalItems}
        wishlistCount={wishlistCount}
      />
      <main>
        {/* Luxury Hero Section */}
        <section className="relative overflow-hidden text-[#0b3320] bg-[#faf9f5] border-b border-[#1b5e3f]/20">
          {/* Video Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <video
              ref={videoRef}
              src="/artisanvideo.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover scale-105"
            />
            {/* Soft Luminous Light Overlay: sheer gradient so background video is clearly visible while text has optimal dark-green contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/65 via-white/20 to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/45 via-transparent to-black/5 pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-20 pb-16 lg:pt-28 lg:pb-24">
            <div className="max-w-4xl flex flex-col items-start">
              <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
                <span className="w-6 h-[1.5px] bg-[#d4af37]" />
                <span>LUXURY PERFUMES &amp; BOTANICAL ESSENCES</span>
              </div>

              <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] max-w-3xl drop-shadow-[0_2px_10px_rgba(255,255,255,0.95)]">
                Timeless Elegance in
                <br />
                <em className="text-[#135d37] italic font-serif drop-shadow-[0_2px_12px_rgba(19,93,55,0.15)]">
                  every Drop
                </em>
              </h1>

              <div className="reveal-on-scroll reveal-delay-200 mt-8 flex flex-wrap items-center gap-4">
                <Button
                  asChild
                  className="h-13 px-9 bg-[#1b5e3f] hover:bg-[#14472f] text-white border border-[#2d8659]/80 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-105 hover:shadow-[#1b5e3f]/30 cursor-pointer"
                >
                  <a href="/perfumes" className="flex items-center gap-2.5">
                    <span>Explore Collection</span>
                    <ArrowRight size={16} className="text-[#86efac]" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Value Assurance Trust Strip (Below Hero Section) */}
        <section className="bg-[#faf9f5] border-b border-[#1b5e3f]/15 py-5 sm:py-6 px-4 sm:px-8 shadow-xs">
          <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center shrink-0 shadow-md">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#072416] leading-tight">
                  Artisanal Purity
                </div>
                <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">100% Rare Botanical Extracts</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center shrink-0 shadow-md">
                <Sparkles size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#072416] leading-tight">
                  Haute Sillage
                </div>
                <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">Long-Lasting Extrait Formulations</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center shrink-0 shadow-md">
                <Truck size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#072416] leading-tight">
                  Pan-India Dispatch
                </div>
                <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">Insured Doorstep Courier</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center shrink-0 shadow-md">
                <Lock size={18} />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#072416] leading-tight">
                  Curated Sampling
                </div>
                <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">Free Tester with Every Order</div>
              </div>
            </div>
          </div>
        </section>

        <section id="collection" className="section">
          <div className="section-heading reveal-on-scroll">
            <div>
              <div className="eyebrow text-muted-foreground">OUR COLLECTION</div>
              <h2 className="section-title">Our Categories of Luxury</h2>
            </div>
            <a
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#1b5e3f] hover:text-[#164a31] transition-colors"
            >
              View all products <ArrowRight size={15} />
            </a>
          </div>

          <div className="product-grid">
            {bestSellers.map((p, idx) => {
              const delayClass = [
                "reveal-delay-100",
                "reveal-delay-200",
                "reveal-delay-300",
                "reveal-delay-100",
                "reveal-delay-200",
              ][idx % 5];
              return (
                <ProductCard
                  key={p.id}
                  product={p}
                  isSaved={saved.includes(p.id)}
                  onToggleSaved={toggleSaved}
                  onAddToCart={add}
                  delayClass={delayClass}
                />
              );
            })}
          </div>

          {/* View All Products Link */}
          <div className="flex justify-center mt-10 reveal-on-scroll">
            <a
              href="/products"
              className="inline-flex items-center gap-3 h-12 px-8 rounded-full border border-[#1b5e3f]/40 bg-white hover:bg-[#1b5e3f] hover:text-white text-[#1b5e3f] text-sm font-medium tracking-wide transition-all duration-300 shadow-sm hover:shadow-md"
            >
              See all Products <ArrowRight size={15} />
            </a>
          </div>
        </section>

        {/* Premium About Us Section */}
        <section id="about-us" className="relative overflow-hidden py-14 sm:py-24 lg:py-32 bg-[#fafaf8] text-[#1a1a1a] border-y border-[#1b5e3f]/15">
          {/* Subtle Ambient Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1b5e3f]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-[#d4af37]/8 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
            {/* Eyebrow & Main Section Heading */}
            <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 lg:mb-20 reveal-on-scroll">
              <div className="inline-flex items-center gap-2.5 text-xs uppercase tracking-[0.3em] text-[#1b5e3f] font-semibold mb-3">
                <span className="w-8 h-[1px] bg-[#d4af37]" />
                <span>ABOUT ARTISAN SCENTS</span>
                <span className="w-8 h-[1px] bg-[#d4af37]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a] leading-[1.12]">
                The Alchemy of Botanical Luxury &amp;
                <br />
                <em className="text-[#1b5e3f] font-serif italic">Artisanal Mastery</em>
              </h2>
              <p className="mt-4 text-[#555555] text-base sm:text-lg font-light leading-relaxed max-w-2xl mx-auto">
                Rooted in centuries-old Indian perfume traditions and crafted in unison with KEOMC&apos;s botanical laboratories, we transform nature&apos;s rare essences into unforgettable sensory poetry.
              </p>
            </div>

            {/* Split Story Showcase */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-stretch">
              {/* Left Column: Premium About Section Image with Floating Badges */}
              <div className="lg:col-span-6 relative reveal-on-scroll flex flex-col">
                <div className="relative rounded-3xl overflow-hidden border-2 border-[#1b5e3f]/25 shadow-2xl bg-[#f5f5f0] group flex-1 min-h-[460px] sm:min-h-[560px] lg:min-h-[680px]">
                  <img
                    src={aboutSectionImage}
                    alt="Artisan Scents About Section - Premium Fragrances & Botanical Excellence"
                    className="w-full h-full min-h-[460px] sm:min-h-[560px] lg:min-h-[680px] object-cover transition-transform duration-1000 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Soft gradient vignetting */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between pointer-events-none">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-[#d4af37]/50 text-[#f6e05e] text-[10px] sm:text-xs font-medium tracking-widest uppercase">
                      <Sparkles size={12} className="text-[#d4af37]" />
                      Haute Parfumerie
                    </span>
                    <span className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-[#1b5e3f]/90 backdrop-blur-md border border-[#86efac]/40 text-white text-[10px] sm:text-xs font-semibold tracking-wider uppercase">
                      30–40% Extrait
                    </span>
                  </div>

                  {/* Floating Bottom Stamp Card */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 p-3.5 sm:p-5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center gap-3 sm:gap-4 shadow-xl">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#1b5e3f] border-2 border-[#d4af37] flex flex-col items-center justify-center shrink-0 shadow-lg">
                      <span className="text-[8px] sm:text-[9px] font-mono tracking-widest uppercase text-[#86efac] leading-tight">EST.</span>
                      <span className="text-[11px] sm:text-xs font-bold font-serif text-[#f6e05e]">KEOMC</span>
                    </div>
                    <div>
                      <div className="font-display text-sm sm:text-base font-medium text-white tracking-wide">
                        Pure Steam-Distilled Terroir
                      </div>
                      <div className="text-[10px] sm:text-xs text-[#c4f0db] font-light mt-0.5 leading-tight">
                        Zero synthetic fillers · Non-toxic · Ethical botanical harvest
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Narrative & Heritage Pillars */}
              <div className="lg:col-span-6 flex flex-col justify-center reveal-on-scroll reveal-delay-150">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-3">
                  <span>OUR STORY &amp; PHILOSOPHY</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl text-[#1a1a1a] font-normal leading-snug mb-4 sm:mb-5">
                  More Than a Fragrance. An Invisible Signature.
                </h3>

                <p className="text-[#444444] text-sm sm:text-base leading-relaxed font-light mb-4">
                  At Artisan Scents, we believe perfume is not merely an accessory—it is an emotional sanctuary, a living memory, and the purest reflection of who you are. Born in collaboration with <strong>Kulswami Essence Oil Manufacturing Company (KEOMC)</strong>, our atelier bridges age-old Indian aromatic wisdom with modern scientific refinement.
                </p>

                <p className="text-[#555555] text-sm sm:text-base leading-relaxed font-light mb-6 sm:mb-8">
                  From steam-distilled single-origin essential oils to high-concentration extrait perfumes, cold-process botanical soaps, charcoal-free dhoop, and inverted wooden car diffusers, every creation is composed in small artisanal batches to honour the spirit of the earth.
                </p>

                {/* 3 Pillars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div className="p-3.5 sm:p-4 rounded-xl border border-[#e8e2d8] bg-white shadow-sm hover:border-[#1b5e3f]/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-2">
                      <ShieldCheck size={16} />
                    </div>
                    <h4 className="font-display text-sm font-semibold text-[#1a1a1a] mb-0.5 sm:mb-1">Single-Origin</h4>
                    <p className="text-xs text-[#666666] font-light leading-relaxed">
                      Traceable botanicals cultivated at peak season.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl border border-[#e8e2d8] bg-white shadow-sm hover:border-[#1b5e3f]/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-2">
                      <Sparkles size={16} />
                    </div>
                    <h4 className="font-display text-sm font-semibold text-[#1a1a1a] mb-0.5 sm:mb-1">Small Batch</h4>
                    <p className="text-xs text-[#666666] font-light leading-relaxed">
                      Slow-matured and hand-poured in limited runs.
                    </p>
                  </div>

                  <div className="p-3.5 sm:p-4 rounded-xl border border-[#e8e2d8] bg-white shadow-sm hover:border-[#1b5e3f]/40 transition-colors">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-2">
                      <ShoppingBag size={16} />
                    </div>
                    <h4 className="font-display text-sm font-semibold text-[#1a1a1a] mb-0.5 sm:mb-1">Enduring Sillage</h4>
                    <p className="text-xs text-[#666666] font-light leading-relaxed">
                      30–40% pure oil for all-day intimate presence.
                    </p>
                  </div>
                </div>

                {/* Manufacturing Units & Retail Outlets */}
                <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-[#e8e2d8] shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="border-b sm:border-b-0 sm:border-r border-[#e8e2d8] pb-3 sm:pb-0 sm:pr-4">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1b5e3f] flex items-center gap-1.5 mb-1.5">
                      <Factory size={13} className="text-[#d4af37]" />
                      <span>Manufacturing Units</span>
                    </div>
                    <div className="text-sm font-display font-semibold text-[#111111]">
                      Junnar · Sangamner
                    </div>
                    <div className="text-[11px] text-[#777777] font-light mt-0.5">
                      Steam distillation &amp; botanical laboratories
                    </div>
                  </div>

                  <div className="sm:pl-2">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#1b5e3f] flex items-center gap-1.5 mb-1.5">
                      <MapPin size={13} className="text-[#d4af37]" />
                      <span>Outlets</span>
                    </div>
                    <div className="text-sm font-display font-semibold text-[#111111]">
                      Navi Mumbai (Airoli) · Dombivali · Alandi
                    </div>
                    <div className="text-[11px] text-[#777777] font-light mt-0.5">
                      Experience boutiques &amp; olfactory counters
                    </div>
                  </div>
                </div>

                {/* Action CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                  <Button
                    asChild
                    className="h-11 sm:h-12 px-7 rounded-full bg-[#1b5e3f] hover:bg-[#164a31] text-white border border-[#2d8659]/50 font-medium tracking-wide shadow-lg transition-all justify-center"
                  >
                    <a href="/about" className="inline-flex items-center gap-2">
                      Discover Our Story <ArrowRight size={16} />
                    </a>
                  </Button>

                  <Button
                    asChild
                    className="h-11 sm:h-12 px-7 rounded-full border border-[#1b5e3f]/30 hover:border-[#1b5e3f] bg-white hover:bg-[#1b5e3f]/5 text-[#1b5e3f] text-sm font-medium tracking-wide transition-all shadow-sm justify-center"
                  >
                    <a href="/keomc" className="inline-flex items-center gap-2">
                      Botanical Heritage (KEOMC) <ArrowRight size={14} />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Connoisseur Advice */}
        <section className="section bg-[#fafaf8] text-[#333333] border-b border-[#2d8659]/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-medium mb-3">
                <span className="w-5 h-[1px] bg-[#d4af37]" />
                <span>CONNOISSEUR ADVICE</span>
                <span className="w-5 h-[1px] bg-[#d4af37]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a]">
                The Art of Scenting
              </h2>
              <p className="text-[#666666] text-sm mt-3 font-light leading-relaxed">
                Fragrance is an invisible garment. Discover three rituals to elevate longevity,
                projection, and personal presence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[
                {
                  n: "01",
                  title: "Pulse Point Resonance",
                  body: "Apply pure oils or perfume to inner wrists, behind ears, and along the collarbones. Natural blood flow radiates gentle heat that slowly unfurls subtle middle notes.",
                },
                {
                  n: "02",
                  title: "Bespoke Olfactory Layering",
                  body: "Lay a deep grounding anchor using Vetiver or Patchouli oil on damp skin, then mist Midnight Eau de Parfum or a floral touch over fabric for a signature sillage.",
                },
                {
                  n: "03",
                  title: "Ambient & Cabin Sanctuary",
                  body: "Inverted wooden car diffusers and slow-burning agarbatti sticks purify interior spaces without harsh aerosol propellants, cultivating mindful tranquility.",
                },
              ].map((r, idx) => (
                <div
                  key={r.n}
                  className={`reveal-on-scroll reveal-delay-${(idx + 1) * 100} rounded-2xl border border-[#1b5e3f]/20 bg-white p-7 shadow-sm transition hover:shadow-md hover:border-[#1b5e3f]/40`}
                >
                  <div className="font-display text-4xl text-[#1b5e3f] mb-3">{r.n}</div>
                  <h3 className="font-display text-xl text-[#1a1a1a] mb-2">{r.title}</h3>
                  <p className="text-sm text-[#555555] font-light leading-relaxed">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Editorial Story Spotlight */}
        <section className="section py-16 bg-[#f7f6f2] text-[#333333] border-b border-[#2d8659]/15">
          <div className="max-w-7xl mx-auto px-6 sm:px-8">
            <div className="reveal-on-scroll reveal-slow relative rounded-2xl overflow-hidden border border-[#1b5e3f]/20 shadow-xl bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 p-8 sm:p-12 lg:p-16 z-10 reveal-left reveal-delay-100">
                  <div className="eyebrow text-[#1b5e3f] font-semibold tracking-[0.25em] text-xs uppercase mb-3">
                    OUR PHILOSOPHY
                  </div>
                  <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1a1a1a] leading-tight">
                    More Than a Fragrance
                  </h2>
                  <p className="text-[#1b5e3f] font-serif italic text-lg sm:text-xl mt-2 mb-4">
                    It's a feeling. A memory. A part of you.
                  </p>
                  <p className="text-[#555555] text-sm sm:text-base font-light max-w-lg mb-8 leading-relaxed">
                    Every drop is formulated to resonate with emotion and presence. We blend
                    centuries-old Indian perfume traditions with modern organic distillation to
                    create perfumes that linger like poetry.
                  </p>
                  <Button
                    asChild
                    className="h-11 px-7 rounded-full bg-[#1b5e3f] hover:bg-[#164a31] border border-[#1b5e3f]/40 text-white font-medium tracking-wide shadow-md"
                  >
                    <a href="/about" className="inline-flex items-center gap-2">
                      Discover Our Story <ArrowRight size={15} />
                    </a>
                  </Button>
                </div>
                <div className="lg:col-span-5 h-72 lg:h-full relative overflow-hidden reveal-right reveal-delay-200">
                  <img
                    src={perfumeStory}
                    alt="Artisan Scents editorial portrait"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-white/20 via-transparent to-transparent opacity-60" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="journal" className="section journal">
          <img
            src="/assets/crafted-with.jpg"
            alt="Crafted with intention - Artisan Scents"
            width={1200}
            height={900}
            loading="lazy"
            className="reveal-scale"
            style={{ objectFit: "cover", borderRadius: "12px" }}
          />
          <div className="reveal-on-scroll reveal-delay-150">
            <div className="eyebrow text-muted-foreground">THE ARTISAN DIFFERENCE</div>
            <h2 className="section-title">
              Crafted with
              <br />
              <em>intention.</em>
            </h2>
            <p>
              Every Artisan Scents product is carefully formulated using natural botanical extracts
              and essential oils. From our luxury perfumes to our pure essence oils, each item
              reflects our commitment to quality, sustainability, and artisanal excellence.
            </p>
            <Button variant="editorial" onClick={() => setPanel("story")}>
              Learn more <ArrowRight />
            </Button>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section bg-[#fafaf8] text-[#333333] border-b border-[#2d8659]/15 py-20">
          <div className="max-w-4xl mx-auto px-6 sm:px-8">
            <div className="text-center mb-14 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-medium mb-3">
                <span className="w-5 h-[1px] bg-[#d4af37]" />
                <span>FREQUENTLY ASKED QUESTIONS</span>
                <span className="w-5 h-[1px] bg-[#d4af37]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a]">
                Everything You Need to Know
              </h2>
              <p className="text-[#666666] text-sm mt-3 font-light leading-relaxed max-w-xl mx-auto">
                Have questions about our fragrances, ingredients, or orders? We've answered the most common ones below.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "What makes Artisan Scent fragrances different from regular perfumes?",
                  a: "Our fragrances are crafted in small batches using high-concentration botanical essences sourced in collaboration with KEOMC's aromatic plant labs. We utilize traditional steam distillation and cold-press extraction to preserve the authentic character of rare botanicals. Every formulation is free from synthetic fillers, phthalates, and harsh chemicals.",
                },
                {
                  q: "Are your products 100% natural and chemical-free?",
                  a: "Yes. We are committed to pure botanical extracts, therapeutic-grade essential oils, cold-pressed plant oils, and sustainable glass and wooden packaging. Our agarbatti sticks are 100% charcoal-free, our soaps contain no SLS or parabens, and our essence oils are pure single-origin distillates.",
                },
                {
                  q: "How long do the perfumes and essence oils last?",
                  a: "Our luxury perfumes feature an Extrait de Parfum concentration (30–40% pure essence) and typically provide 8–12 hours of lingering sillage on skin and fabric. Essence oils applied to pulse points last 6–10 hours, while hanging car diffusers deliver steady fragrance for up to 60 days.",
                },
                {
                  q: "What is your shipping and returns policy?",
                  a: "We offer complimentary pan-India shipping on all orders above ₹999, dispatched within 24 hours via insured couriers. We also provide a 7-day return guarantee for unopened products in original packaging, along with an instant replacement guarantee in case of any transit breakage.",
                },
              ].map((faq, idx) => (
                <details
                  key={idx}
                  className={`reveal-on-scroll reveal-delay-${(idx % 4) * 100 + 50} group rounded-2xl border border-[#e8e2d8] bg-white overflow-hidden transition-all duration-300 hover:border-[#1b5e3f]/30 hover:shadow-md`}
                >
                  <summary className="flex items-center justify-between px-7 py-5 cursor-pointer list-none select-none">
                    <span className="font-display text-base sm:text-lg text-[#1a1a1a] pr-4">{faq.q}</span>
                    <span className="shrink-0 w-6 h-6 rounded-full border border-[#1b5e3f]/30 flex items-center justify-center text-[#1b5e3f] group-open:rotate-45 transition-transform duration-300">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                  </summary>
                  <div className="px-7 pb-6 text-sm text-[#555555] font-light leading-relaxed border-t border-[#e8e2d8] pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer newsletter />
      {(selected || panel) && (
        <div className={`overlay ${panel === "bag" ? "bag-overlay" : ""}`} onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label={
              selected?.name ||
              (panel === "bag"
                ? "Your shopping bag"
                : panel === "search"
                  ? "Search products"
                  : panel === "story"
                    ? "Artisan Scents Story"
                    : "Navigation")
            }
            className={`dialog ${panel === "bag" ? "bag-panel" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dialog-header">
              <h2 className="font-display text-3xl">
                {selected
                  ? selected.name
                  : panel === "bag"
                    ? `Your bag (${totalItems})`
                    : panel === "search"
                      ? "Find your fragrance"
                      : panel === "menu"
                        ? "ARTISAN SCENTS"
                        : "Our Commitment to Quality"}
              </h2>
              <Button variant="ghost" size="icon" aria-label="Close" autoFocus onClick={close}>
                <X />
              </Button>
            </div>
            {selected && (
              <div className="detail-grid">
                <img src={selected.image} alt={selected.name} style={{ objectFit: "contain" }} />
                <div>
                  <div className="eyebrow text-muted-foreground">
                    {selected.family} · {selected.category}
                  </div>
                  <h3 className="section-title">{selected.name}</h3>
                  <p className="text-sm leading-7 my-5">{selected.description}</p>
                  <p className="product-notes">{selected.notes}</p>
                  {selected.botanicalName && (
                    <p className="text-xs my-2 text-muted-foreground">{selected.botanicalName}</p>
                  )}
                  <p className="text-sm my-5">
                    {selected.size || "100 ml"} · {money(selected.price)}
                  </p>
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
                      <h3 className="font-display text-3xl">A fragrance awaits.</h3>
                      <p className="status-note my-4">Your bag is currently empty.</p>
                      <Button variant="editorial" onClick={close}>
                        Explore the collection <ArrowRight />
                      </Button>
                    </div>
                  ) : (
                    products
                      .filter((p) => (bag[p.id] || 0) > 0)
                      .map((p) => (
                        <div className="bag-item" key={p.id}>
                          <img src={p.image} alt={p.name} style={{ objectFit: "contain" }} />
                          <div>
                            <div className="flex justify-between">
                              <h3 className="font-display text-xl">{p.name}</h3>
                              <span className="text-xs">{money(p.price * (bag[p.id] || 0))}</span>
                            </div>
                            <p className="product-notes capitalize">
                              {p.category.replace("-", " ")}
                            </p>
                            <div className="quantity">
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label={`Remove one ${p.name}`}
                                onClick={() => update(p.id, -1)}
                              >
                                <Minus />
                              </Button>
                              <span className="text-xs">{bag[p.id]}</span>
                              <Button
                                variant="outline"
                                size="icon"
                                aria-label={`Add one ${p.name}`}
                                onClick={() => update(p.id, 1)}
                              >
                                <Plus />
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
                  aria-label="Search by product name or note"
                  placeholder="Search a fragrance, an oil, a scent…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="search-results">
                  {products
                    .filter((p) =>
                      `${p.name} ${p.notes} ${p.category}`
                        .toLowerCase()
                        .includes(query.toLowerCase()),
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
                  {!products.some((p) =>
                    `${p.name} ${p.notes} ${p.category}`
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  ) && (
                    <p className="status-note py-8">
                      No fragrances found. Try lavender, oud, or rose.
                    </p>
                  )}
                </div>
              </>
            )}
            {panel === "menu" && (
              <nav className="flex flex-col gap-6 font-display text-3xl">
                {[
                  ["Perfumes", "/perfumes"],
                  ["Oils", "/essence-oils"],
                  ["Car Perfumes", "/car-perfumes"],
                  ["Agarbatti", "/agarbatti"],
                  ["About", "/about"],
                ].map(([label, id]) => (
                  <a key={id} href={id} onClick={close} className="flex justify-between">
                    {label}
                    <ChevronRight />
                  </a>
                ))}
              </nav>
            )}
            {panel === "story" && (
              <div className="max-w-lg mx-auto py-5">
                <div className="eyebrow text-muted-foreground mb-5">Artisan Scents</div>
                <p className="text-sm leading-8">
                  We believe fragrance is more than a scent—it's a story, a memory, a moment. Each
                  Artisan Scents product is meticulously crafted using natural botanical extracts
                  and essential oils sourced through partnerships with KEOMC.
                </p>
                <p className="text-sm leading-8 mt-5">
                  From our luxury perfumes to our pure essence oils, every product reflects our
                  commitment to quality, sustainability, and artisanal excellence. We work with
                  aromatic plants from around the world, using traditional distillation methods to
                  preserve their natural essence.
                </p>
                <p className="font-display text-3xl my-6">Fragrance is personal. Make it yours.</p>
                <Button
                  variant="editorial"
                  onClick={() => {
                    close();
                    document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Explore our collection <ArrowRight />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}





