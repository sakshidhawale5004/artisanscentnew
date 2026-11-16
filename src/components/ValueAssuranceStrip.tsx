import { ShieldCheck, Sparkles, Truck, ShoppingBag } from "lucide-react";

export function ValueAssuranceStrip() {
  return (
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
            <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">
              100% Rare Botanical Extracts
            </div>
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
            <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">
              Long-Lasting Extrait Formulations
            </div>
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
            <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">
              Insured Doorstep Courier
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1b5e3f] text-white flex items-center justify-center shrink-0 shadow-md">
            <ShoppingBag size={18} />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#072416] leading-tight">
              Curated Sampling
            </div>
            <div className="text-[11px] text-[#1b5e3f] mt-0.5 leading-snug font-medium">
              Free Tester with Every Order
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
