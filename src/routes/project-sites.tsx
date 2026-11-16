import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";

export const Route = createFileRoute("/project-sites")({
  head: () => ({
    meta: [
      { title: "Project Sites | Artisan Scents" },
      {
        name: "description",
        content:
          "Artisan Scents project sites — botanical gardens, distillation fields, and installations across our sourcing and manufacturing network.",
      },
    ],
  }),
  component: ProjectSitesPage,
});

const numbers = [
  "(13)",
  "(14)",
  "(16)",
  "(17)",
  "(18)",
  "(19)",
  "(20)",
  "(21)",
  "(22)",
  "(23)",
  "(24)",
  "(25)",
  "(26)",
  "(27)",
  "(28)",
  "(29)",
  "(30)",
  "(31)",
  "(32)",
  "(33)",
  "(34)",
  "(37)",
  "(38)",
];

const gallery = numbers.map((n) => `/assets/project site/artisan scent ${n}.webp`);

function ProjectSitesPage() {
  return (
    <>
      <div className="announcement">
        Project Sites · Gardens, Fields &amp; Installations <span className="ml-3">✦</span>
      </div>
      <Header currentPage="Project Sites" />

      <main className="bg-[#f5f5f0] text-[#333333] min-h-screen">
        {/* Category Hero Banner */}
        <section className="relative overflow-hidden text-[#072416] bg-[#faf9f5] border-b border-[#1b5e3f]/20 py-20 sm:py-28 px-6 sm:px-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/project%20site/artisan%20scent%20(33).webp"
              alt="Artisan Scent Botanical Fields and Cultivation Network"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>BOTANICAL FIELDS &amp; INSTALLATIONS</span>
            </div>
            <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              From Garden
              <br />
              <em className="text-[#135d37] font-serif italic">to Flacon</em>
            </h1>
            <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-2xl leading-relaxed">
              A look at the botanical gardens, distillation fields, and installations that form the
              backbone of our sourcing and manufacturing network with KEOMC.
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
                alt={`Artisan Scents project site ${idx + 1}`}
                loading="lazy"
                className={`reveal-on-scroll reveal-delay-${((idx % 3) + 1) * 100} mb-5 w-full rounded-xl border border-[#1b5e3f]/12 object-cover`}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer tagline="Botanical sourcing, cultivation, and craft." />
    </>
  );
}





