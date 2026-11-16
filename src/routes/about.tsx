import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Layers, PackageCheck, Truck, Factory, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Our Story & Botanical Heritage | Artisan Scents" },
      {
        name: "description",
        content:
          "Discover the artisanal heritage of Artisan Scents by founder Vaishali Chavan. Pure botanical compositions, rare essences, handcrafted extrait perfumes, therapeutic oils, luxury soaps, and sacred agarbatti.",
      },
    ],
  }),
  component: AboutPage,
});

export default function AboutPage() {
  return (
    <>
      <div className="announcement">
        S C E N T S · A R T I S A N <span className="ml-3">✦</span> Handcrafted Luxury Perfumery &amp; Pure Botanical Essences
      </div>
      <Header currentPage="About" />

      <main className="bg-[#fafaf8] text-[#333333] min-h-screen">
        {/* Hero Section with Luminous Luxury Daylight Aesthetic & Authentic Atelier Imagery */}
        <section className="relative overflow-hidden border-b border-[#1b5e3f]/20 py-20 sm:py-28 px-6 sm:px-12 bg-[#faf9f5] text-[#072416]">
          {/* Authentic Brand Exhibition & Atelier Background */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/Sage Green Spa Perfume Still Life (1).png"
              alt="Artisan Scents Atelier — Sage Green Spa Perfume Still Life"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#1b5e3f] font-bold mb-4">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>OUR STORY &amp; HERITAGE</span>
            </div>

            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-tight text-[#072416] leading-[1.08] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              The Spirit of
              <br />
              <em className="text-[#135d37] font-serif italic">Artisanal Perfumery</em>
            </h1>

            <div className="reveal-on-scroll reveal-delay-200 mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#1b5e3f]/25 text-xs text-[#072416] tracking-widest font-semibold uppercase shadow-xs">
                Founder: <span className="text-[#135d37]">VAISHALI CHAVAN</span>
              </div>
              <div className="text-xs text-[#1b5e3f] font-semibold tracking-wide bg-white/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#1b5e3f]/20">
                ✦ Pure Botanical Heritage
              </div>
              <div className="text-xs text-[#1b5e3f] font-semibold tracking-wide bg-white/60 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#1b5e3f]/20">
                ✦ Handcrafted in Maharashtra
              </div>
            </div>

            <p className="reveal-on-scroll reveal-delay-300 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-2xl leading-relaxed">
              Rooted in botanical stewardship and artisanal dedication, Artisan Scents crafts evocative extrait perfumes, pure therapeutic essence oils, handcrafted soaps, and sacred agarbatti. Bringing together centuries-old distillation traditions with contemporary olfactory elegance.
            </p>
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        {/* About Company Section */}
        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <div className="reveal-on-scroll">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-semibold mb-3">
              <span className="w-5 h-[1px] bg-[#d4af37]" />
              <span>ABOUT COMPANY</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a] mb-8">
              Artisan Scents
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-8 space-y-6 text-base sm:text-lg leading-relaxed text-[#444444] font-light">
                <p className="bg-white p-7 sm:p-9 rounded-2xl border border-[#e8e2d8] shadow-sm leading-relaxed text-[#2a2a2a]">
                  <strong className="text-[#1b5e3f] font-semibold block text-xl mb-3 font-display">
                    A Multi-Category Fragrance Brand
                  </strong>
                  Artisan Scents is a fragrance brand operating across a diverse portfolio of fragrance
                  products and related solutions. With a focus on the fragrance and flavours sector, the
                  brand brings together products such as essential oils, essence oils, perfumes, car
                  perfumes, soaps, and agarbatti.
                </p>

                <p className="bg-white p-7 sm:p-9 rounded-2xl border border-[#e8e2d8] shadow-sm leading-relaxed text-[#2a2a2a]">
                  <strong className="text-[#1b5e3f] font-semibold block text-xl mb-3 font-display">
                    Our Strategic Approach
                  </strong>
                  Our approach centres on understanding fragrance preferences, exploring product
                  possibilities, and delivering solutions aligned with evolving customer and business
                  requirements. From everyday fragrance experiences to specialised fragrance and
                  flavour applications, Artisan Scents aims to build meaningful connections through
                  the world of scent.
                </p>
              </div>

              <div className="lg:col-span-4 bg-[#fcfbf9] rounded-2xl border border-[#e8e2d8] p-7 shadow-sm space-y-6">
                <div className="text-xs uppercase tracking-widest text-[#1b5e3f] font-bold">
                  Brand Highlights
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1a1a]">Diverse Portfolio</div>
                      <div className="text-xs text-[#666666] mt-0.5">
                        Essential oils, essence oils, luxury perfumes, soaps, car diffusers &amp; agarbatti.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1a1a]">Tailored Solutions</div>
                      <div className="text-xs text-[#666666] mt-0.5">
                        Aligned with evolving individual and commercial scent preferences.
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-[#1a1a1a]">Founder &amp; Artisan</div>
                      <div className="text-xs text-[#666666] mt-0.5">Vaishali Chavan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Authentic Brand & Atelier Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 reveal-on-scroll">
              <div className="relative rounded-2xl overflow-hidden border border-[#e8e2d8] shadow-md group">
                <img
                  src="/assets/exibition/artisan scent (1).webp"
                  alt="Artisan Scents Brand Exhibition & Fragrance Showcase"
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] tracking-widest uppercase text-[#86efac] font-bold block mb-1">
                      The Atelier &amp; Exhibitions
                    </span>
                    <h4 className="font-display text-xl text-white">Artisan Fragrance Architecture</h4>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#e8e2d8] shadow-md group">
                <img
                  src="/Sage Green Spa Perfume Still Life (1).png"
                  alt="Sage Green Spa Perfume Still Life — Artisan Olfactory Aesthetics"
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] tracking-widest uppercase text-[#86efac] font-bold block mb-1">
                      Spa &amp; Still Life Aesthetics
                    </span>
                    <h4 className="font-display text-xl text-white">Botanical Purity &amp; Luxury</h4>
                  </div>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-[#e8e2d8] shadow-md group">
                <img
                  src="/assets/project site/artisan scent (33).webp"
                  alt="Artisan Scents Botanical Terroir & Sourcing Fields"
                  className="w-full h-64 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white">
                    <span className="text-[10px] tracking-widest uppercase text-[#d4af37] font-bold block mb-1">
                      Terroir &amp; Botanical Fields
                    </span>
                    <h4 className="font-display text-xl text-white">Ethical Botanical Stewardship</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Section: 5 Detailed Product Categories */}
        <section className="bg-white py-20 border-y border-[#e8e2d8]">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 reveal-on-scroll">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-semibold mb-3">
                <span className="w-5 h-[1px] bg-[#d4af37]" />
                <span>PRODUCT PORTFOLIO</span>
                <span className="w-5 h-[1px] bg-[#d4af37]" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a]">
                Five Core Categories
              </h2>
              <p className="text-[#666666] text-sm mt-3 font-light leading-relaxed">
                From everyday wellness rituals to opulent extrait perfumes, explore our five core
                product divisions.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-7">
              {/* 01. ESSENCE OILS */}
              <div className="reveal-on-scroll group rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md">
                <div>
                  {/* Category Image Area - Edge-to-edge with no inner margin or radius; square 1:1 ratio so product is never cropped */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                    <img
                      src="/assets/essence oil/Amber Patchouli Oil Bottle.png"
                      alt="Artisan Scents Pure Essence Oils"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="font-mono text-base font-bold text-[#1b5e3f] bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#e8e2d8] shadow-xs">
                        01.
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] bg-white/95 backdrop-blur-xs border border-[#e8e2d8] px-3.5 py-1 rounded-full font-bold shadow-xs">
                        Aromatics
                      </span>
                    </div>
                  </div>
                  <div className="p-7 pb-0">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#1b5e3f] transition-colors">
                      Essence Oils
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed mb-5">
                      Artisan Scents offers essence oils designed for fragrance applications across a
                      variety of suitable products and environments. With a focus on fragrance
                      character and versatility, these oils serve as an option for businesses and
                      customers seeking distinctive aromatic profiles for their specific requirements.
                    </p>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-[#e8e2d8] space-y-1.5">
                  <div className="text-xs font-semibold text-[#1b5e3f] uppercase tracking-wider">
                    Diverse fragrance profiles
                  </div>
                  <div className="text-xs text-[#666666]">
                    Floral, woody, fresh and oriental-inspired notes
                  </div>
                </div>
              </div>

              {/* 02. HANDCRAFTED SOAPS */}
              <div className="reveal-on-scroll reveal-delay-100 group rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md">
                <div>
                  {/* Category Image Area - Edge-to-edge with no inner margin or radius; square 1:1 ratio so product is never cropped */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                    <img
                      src="/assets/SOAP NEW/Artisan Signature Soap.png"
                      alt="Artisan Scents Handcrafted Luxury Soaps"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="font-mono text-base font-bold text-[#1b5e3f] bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#e8e2d8] shadow-xs">
                        02.
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] bg-white/95 backdrop-blur-xs border border-[#e8e2d8] px-3.5 py-1 rounded-full font-bold shadow-xs">
                        Personal Care
                      </span>
                    </div>
                  </div>
                  <div className="p-7 pb-0">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#1b5e3f] transition-colors">
                      Handcrafted Luxury Soaps
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed mb-5">
                      Discover soaps that combine everyday cleansing with an appealing fragrance
                      experience. Designed to complement daily personal-care routines, our soap
                      category brings together fragrance, presentation, and everyday usability.
                    </p>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-[#e8e2d8] flex items-center gap-2 flex-wrap">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#e8e2d8] text-[#1b5e3f] font-medium">
                    Refreshing
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#e8e2d8] text-[#1b5e3f] font-medium">
                    Sensory
                  </span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white border border-[#e8e2d8] text-[#1b5e3f] font-medium">
                    Everyday care
                  </span>
                </div>
              </div>

              {/* 03. SCENTED AGARBATTI */}
              <div className="reveal-on-scroll reveal-delay-200 group rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md">
                <div>
                  {/* Category Image Area - Edge-to-edge with no inner margin or radius; square 1:1 ratio so product is never cropped */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                    <img
                      src="/assets/AGARBATTI NEW/Deluxe Incense Collection.png"
                      alt="Artisan Scents Scented Agarbatti"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="font-mono text-base font-bold text-[#1b5e3f] bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#e8e2d8] shadow-xs">
                        03.
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] bg-white/95 backdrop-blur-xs border border-[#e8e2d8] px-3.5 py-1 rounded-full font-bold shadow-xs">
                        Rituals
                      </span>
                    </div>
                  </div>
                  <div className="p-7 pb-0">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#1b5e3f] transition-colors">
                      Scented Agarbatti
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed mb-5">
                      Artisan Scents brings fragrance to traditional rituals and everyday moments
                      through its agarbatti range. Suitable for prayer spaces, meditation settings, and
                      home ambience, these incense products help create an atmosphere of calm and
                      familiarity.
                    </p>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-[#e8e2d8] space-y-1.5">
                  <div className="text-xs font-semibold text-[#1b5e3f] uppercase tracking-wider">
                    Fragrances inspired by Indian traditions
                  </div>
                  <div className="text-xs text-[#666666]">
                    Floral, woody and soothing scent profiles
                  </div>
                </div>
              </div>

              {/* 04. CAR PERFUME */}
              <div className="reveal-on-scroll reveal-delay-100 group rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md">
                <div>
                  {/* Category Image Area - Edge-to-edge with no inner margin or radius; square 1:1 ratio so product is never cropped */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                    <img
                      src="/assets/car perfurm/Arctic Mist Luxury Car Fragrance.png"
                      alt="Artisan Scents Car Luxury Perfumes"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="font-mono text-base font-bold text-[#1b5e3f] bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#e8e2d8] shadow-xs">
                        04.
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] bg-white/95 backdrop-blur-xs border border-[#e8e2d8] px-3.5 py-1 rounded-full font-bold shadow-xs">
                        Automotive
                      </span>
                    </div>
                  </div>
                  <div className="p-7 pb-0">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#1b5e3f] transition-colors">
                      Car Luxury Perfumes
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed mb-5">
                      Enhance your driving environment with car perfumes designed to bring a pleasant
                      fragrance to vehicle interiors. Combining compact designs with an everyday
                      lifestyle appeal, this category offers a simple way to personalise the in-car
                      experience.
                    </p>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-[#e8e2d8] space-y-1">
                  <div className="text-xs text-[#1b5e3f] font-semibold">
                    • Designed for automotive fragrance use
                  </div>
                  <div className="text-xs text-[#555555]">• Compact and stylish diffuser formats</div>
                  <div className="text-xs text-[#555555]">
                    • Fresh, woody and sophisticated fragrance options
                  </div>
                </div>
              </div>

              {/* 05. LUXURY PERFUMES */}
              <div className="reveal-on-scroll reveal-delay-200 group rounded-2xl border border-[#e8e2d8] bg-[#fcfbf9] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl w-full md:w-[calc(50%-14px)] lg:w-[calc(33.333%-19px)] max-w-md">
                <div>
                  {/* Category Image Area - Edge-to-edge with no inner margin or radius; square 1:1 ratio so product is never cropped */}
                  <div className="relative aspect-square w-full overflow-hidden bg-[#faf8f5]">
                    <img
                      src="/assets/body perform/Luxurious Ivory Amber Perfume Display.png"
                      alt="Artisan Scents Luxury Perfumes Collection"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none">
                      <span className="font-mono text-base font-bold text-[#1b5e3f] bg-white/95 backdrop-blur-xs px-3.5 py-1 rounded-full border border-[#e8e2d8] shadow-xs">
                        05.
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#1b5e3f] bg-white/95 backdrop-blur-xs border border-[#e8e2d8] px-3.5 py-1 rounded-full font-bold shadow-xs">
                        Haute Parfumerie
                      </span>
                    </div>
                  </div>
                  <div className="p-7 pb-0">
                    <h3 className="font-display text-2xl text-[#1a1a1a] mb-2 group-hover:text-[#1b5e3f] transition-colors">
                      Luxury Perfumes
                    </h3>
                    <p className="text-sm text-[#555555] font-light leading-relaxed mb-5">
                      Artisan Scents' luxury perfume category celebrates fragrance as an expression of
                      personality, style, and individuality. With an emphasis on sophisticated
                      presentation and distinctive scent experiences, these perfumes are suited to
                      personal wear, special occasions, and thoughtful gifting.
                    </p>
                  </div>
                </div>
                <div className="p-7 pt-4 border-t border-[#e8e2d8] space-y-1.5">
                  <div className="text-xs font-semibold text-[#1b5e3f] uppercase tracking-wider">
                    Distinctive fragrance compositions
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#666666]">
                    <span>Sophisticated scent profiles</span>
                    <a
                      href="/perfumes"
                      className="text-[#1b5e3f] font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      View Perfumes <ArrowRight size={13} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quality, Standards & Production Pillars */}
        <section className="max-w-6xl mx-auto px-6 sm:px-8 py-20">
          <div className="reveal-on-scroll mb-14 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-semibold mb-3">
              <span className="w-5 h-[1px] bg-[#d4af37]" />
              <span>QUALITY ARCHITECTURE</span>
              <span className="w-5 h-[1px] bg-[#d4af37]" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#1a1a1a]">
              Every Detail Shapes the Experience
            </h2>
            <p className="text-[#555555] text-sm sm:text-base mt-4 font-light leading-relaxed">
              Artisan Scents' luxury perfume category celebrates fragrance as an expression of
              personality, style, and individuality. With an emphasis on sophisticated presentation
              and distinctive scent experiences, these perfumes are suited to personal wear,
              special occasions, and thoughtful gifting.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Pillar 1 */}
            <div className="reveal-on-scroll group bg-white rounded-2xl border border-[#e8e2d8] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-5">
                  <Sparkles size={22} />
                </div>
                <h3 className="font-display text-lg text-[#1a1a1a] mb-3 group-hover:text-[#1b5e3f] transition-colors">
                  Fragrance Specifications
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-light">
                  Rigorous GC-MS gas chromatography testing, olfactory pyramid profiling, and IFRA adherence ensuring purest essence formulation.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="reveal-on-scroll reveal-delay-100 group bg-white rounded-2xl border border-[#e8e2d8] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-5">
                  <ShieldCheck size={22} />
                </div>
                <h3 className="font-display text-lg text-[#1a1a1a] mb-3 group-hover:text-[#1b5e3f] transition-colors">
                  Material Verification
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-light">
                  Ethical provenance verification of wild-harvested botanicals, therapeutic carrier oils, and clean burning non-toxic incense bases.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="reveal-on-scroll reveal-delay-200 group bg-white rounded-2xl border border-[#e8e2d8] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-5">
                  <PackageCheck size={22} />
                </div>
                <h3 className="font-display text-lg text-[#1a1a1a] mb-3 group-hover:text-[#1b5e3f] transition-colors">
                  Product &amp; Packaging Checks
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-light">
                  Hermetic sealing inspection, amber UV-shielded glass flacons, precision car diffuser leak testing, and sensory shelf-life evaluation.
                </p>
              </div>
            </div>

            {/* Pillar 4 */}
            <div className="reveal-on-scroll group bg-white rounded-2xl border border-[#e8e2d8] p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-lg flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#1b5e3f]/10 text-[#1b5e3f] flex items-center justify-center mb-5">
                  <Truck size={22} />
                </div>
                <h3 className="font-display text-lg text-[#1a1a1a] mb-3 group-hover:text-[#1b5e3f] transition-colors">
                  Sourcing &amp; Procurement
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed font-light">
                  Direct farm partnerships across Maharashtra and premier Indian growing belts, guaranteeing fresh seasonal harvests from field to still.
                </p>
              </div>
            </div>
          </div>

          {/* Manufacturing Units & Retail Outlets Showcase Box */}
          <div className="mt-10 reveal-on-scroll group bg-white rounded-2xl border border-[#e8e2d8] p-6 sm:p-8 shadow-sm transition-all duration-300 hover:border-[#1b5e3f]/50 hover:shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 relative aspect-16/10 sm:aspect-4/3 w-full rounded-xl overflow-hidden bg-[#faf8f5] border border-[#e8e2d8] shadow-2xs">
                <img
                  src="/assets/project%20site/artisan%20scent%20(14).webp"
                  alt="Artisan Scents Distillation & Manufacturing Operations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1b5e3f] font-semibold mb-3">
                  <Factory size={16} className="text-[#d4af37]" />
                  <span>DISTILLATION &amp; RETAIL FOOTPRINT</span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl text-[#1a1a1a] mb-3 group-hover:text-[#1b5e3f] transition-colors">
                  Manufacturing Units &amp; Outlets
                </h3>

                <p className="text-sm text-[#555555] leading-relaxed font-light mb-6">
                  Our manufacturing operations and steam distillation units are situated in <strong>Junnar</strong> and <strong>Sangamner</strong>, directly sourcing seasonal harvests. Our experience boutiques and retail outlets welcome patrons across <strong>Navi Mumbai (Airoli)</strong>, <strong>Dombivali</strong>, and <strong>Alandi</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#e8e2d8]">
                  <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#e8e2d8]">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1b5e3f] mb-1 flex items-center gap-1.5">
                      <Factory size={14} className="text-[#d4af37]" />
                      <span>Manufacturing Units</span>
                    </div>
                    <div className="text-base font-display font-semibold text-[#1a1a1a]">
                      Junnar · Sangamner
                    </div>
                    <div className="text-xs text-[#666666] mt-0.5 font-light">
                      Steam distillation &amp; botanical extraction
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#faf9f5] border border-[#e8e2d8]">
                    <div className="text-xs font-bold uppercase tracking-wider text-[#1b5e3f] mb-1 flex items-center gap-1.5">
                      <MapPin size={14} className="text-[#d4af37]" />
                      <span>Retail Outlets</span>
                    </div>
                    <div className="text-base font-display font-semibold text-[#1a1a1a]">
                      Navi Mumbai (Airoli) · Dombivali · Alandi
                    </div>
                    <div className="text-xs text-[#666666] mt-0.5 font-light">
                      Experience boutiques &amp; olfactory counters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Collaboration */}
        <section className="bg-gradient-to-r from-[#181614] via-[#100e0d] to-[#0a0908] text-white py-16 border-t border-[#1b5e3f]/20">
          <div className="max-w-3xl mx-auto px-6 text-center reveal-on-scroll">
            <div className="text-xs uppercase tracking-[0.25em] text-[#86efac] font-medium mb-3">
              BEGIN A CONVERSATION
            </div>
            <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
              Explore the World of Artisan Scents
            </h2>
            <p className="text-[#c4c0b8] text-sm sm:text-base font-light mb-8 max-w-xl mx-auto leading-relaxed">
              Whether you are looking for personal signature scents, curated retail lines, or bespoke
              fragrance solutions, our atelier welcomes you.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="h-12 px-7 rounded-full bg-[#1b5e3f] hover:bg-[#23734e] text-white border border-[#2d8659]/50 font-medium tracking-wide shadow-xl transition-all"
              >
                <a href="/perfumes" className="flex items-center gap-2">
                  Explore Products <ArrowRight size={15} className="text-[#86efac]" />
                </a>
              </Button>
              <Button
                asChild
                className="h-12 px-7 rounded-full border border-white/20 hover:border-white/40 bg-white/10 hover:bg-white/20 text-white text-sm font-medium tracking-wide backdrop-blur-md transition-all"
              >
                <a href="/contact">Contact</a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
