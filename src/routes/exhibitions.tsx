import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/exhibitions")({
  head: () => ({
    meta: [
      { title: "Exhibitions | Artisan Scents" },
      {
        name: "description",
        content:
          "Artisan Scents exhibitions — where our scent worlds, botanical craft, and artisanal incense meet the public.",
      },
    ],
  }),
  component: ExhibitionsPage,
});

const gallery = [
  "(1)",
  "(2)",
  "(3)",
  "(5)",
  "(6)",
  "(7)",
  "(8)",
  "(9)",
  "(10)",
  "(11)",
  "(12)",
].map((n) => `/assets/exibition/artisan scent ${n}.webp`);

function ExhibitionsPage() {
  return (
    <>
      <div className="announcement">
        Exhibitions · Scent Meets the Public <span className="ml-3">✦</span>
      </div>
      <Header currentPage="Exhibitions" />

      <main className="bg-[#f5f5f0] text-[#333333] min-h-screen">
        {/* Category Hero Banner */}
        <section className="relative overflow-hidden text-[#072416] bg-[#faf9f5] border-b border-[#1b5e3f]/20 py-20 sm:py-28 px-6 sm:px-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/exibition/artisan scent (1).webp"
              alt="Artisan Scents Brand Exhibitions & Public Showcases"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>BRAND EXHIBITIONS &amp; SHOWCASES</span>
            </div>
            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              Where Scent
              <br />
              <em className="text-[#135d37] font-serif italic">Meets the Public</em>
            </h1>
            <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-2xl leading-relaxed">
              Snapshots from craft fairs, trade showcases, and botanical exhibitions where we share
              our perfumes, oils, incense, and the stories behind them.
            </p>
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        <section className="max-w-7xl mx-auto px-6 sm:px-8 py-14">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
            {gallery.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt={`Artisan Scents exhibition ${idx + 1}`}
                loading="lazy"
                className={`reveal-on-scroll reveal-delay-${((idx % 3) + 1) * 100} mb-5 w-full rounded-xl border border-[#1b5e3f]/12 object-cover`}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer tagline="Scent, craft, and community in the open air." />
    </>
  );
}





