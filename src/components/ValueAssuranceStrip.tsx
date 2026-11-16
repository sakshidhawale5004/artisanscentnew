import { ShieldCheck, Sparkles } from "lucide-react";

export function ValueAssuranceStrip() {
  return (
    <section className="bg-[#faf9f5] border-b border-[#1b5e3f]/15 py-5 sm:py-6 px-4 sm:px-8 shadow-xs">
      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-16 text-left">
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
      </div>
    </section>
  );
}
