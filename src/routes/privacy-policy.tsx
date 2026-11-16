import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Lock, Eye, FileText, Bell, Mail } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Artisan Scent" },
      {
        name: "description",
        content:
          "Read Artisan Scent's Privacy Policy. Learn how we protect, handle, and secure your personal information with strict confidentiality.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

export default function PrivacyPolicyPage() {
  const lastUpdated = "October 2026";

  return (
    <>
      <div className="announcement">
        Client Confidentiality &amp; Data Security <span className="ml-3">✦</span> Artisan Scent
      </div>
      <Header currentPage="About" />

      <main className="bg-[#fafaf8] text-[#333333] min-h-screen">
        {/* Editorial Hero Banner */}
        <section className="relative overflow-hidden text-[#072416] bg-[#faf9f5] border-b border-[#1b5e3f]/20 py-20 sm:py-24 px-6 sm:px-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/shopimages/perfume sectionimage.png"
              alt="Artisan Scent Legal & Compliance"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
              <span>LEGAL &amp; COMPLIANCE</span>
              <span className="w-6 h-[1.5px] bg-[#d4af37]" />
            </div>
            <h1 className="reveal-on-scroll font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
              Privacy Policy
            </h1>
            <p className="reveal-on-scroll reveal-delay-100 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-xl mx-auto leading-relaxed">
              At Artisan Scent, your privacy is an inviolable trust. We are committed to safeguarding your personal information with absolute integrity.
            </p>
            <div className="mt-5 inline-block px-4 py-1.5 rounded-full bg-white/80 border border-[#1b5e3f]/25 text-xs text-[#072416] font-mono tracking-widest uppercase">
              Last Updated · {lastUpdated}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-4xl mx-auto px-6 sm:px-8 py-16">
          {/* Trust Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#e8f5f0] text-[#1b5e3f] flex items-center justify-center mb-4">
                <Lock size={18} />
              </div>
              <h3 className="font-display text-lg text-[#1a1a1a] mb-1">256-Bit SSL Encryption</h3>
              <p className="text-xs text-[#666666] font-light leading-relaxed">
                All checkout data and transactions are encrypted with bank-grade security protocols.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#e8f5f0] text-[#1b5e3f] flex items-center justify-center mb-4">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-display text-lg text-[#1a1a1a] mb-1">Zero Third-Party Sale</h3>
              <p className="text-xs text-[#666666] font-light leading-relaxed">
                We never monetize, rent, or trade your contact or olfactory preference data with external brokers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <div className="w-10 h-10 rounded-full bg-[#e8f5f0] text-[#1b5e3f] flex items-center justify-center mb-4">
                <Eye size={18} />
              </div>
              <h3 className="font-display text-lg text-[#1a1a1a] mb-1">Your Full Control</h3>
              <p className="text-xs text-[#666666] font-light leading-relaxed">
                Request review, amendment, or total deletion of your personal profile at any moment.
              </p>
            </div>
          </div>

          {/* Detailed Policy Text */}
          <div className="space-y-10 text-[#444444] text-sm sm:text-base font-light leading-relaxed">
            <div className="p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                <span className="text-[#1b5e3f] font-serif">01.</span> Information We Collect
              </h2>
              <p className="mb-4">
                When you explore or acquire from Artisan Scent, we collect necessary personal details to process your orders, tailor your sensory recommendations, and ensure immaculate doorstep delivery:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#555555]">
                <li><strong>Identity Information:</strong> Full legal name, billing address, and dispatch shipping address.</li>
                <li><strong>Contact Credentials:</strong> Valid electronic mail address and verified telephone number for tracking dispatches.</li>
                <li><strong>Transactional Details:</strong> Records of items purchased, order history, invoice reference codes, and payment status (processed securely through certified payment gateways; we never store complete raw credit card credentials).</li>
                <li><strong>Technical Telemetry:</strong> Device IP, browser configuration, and anonymous session telemetry to optimize website responsiveness.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                <span className="text-[#1b5e3f] font-serif">02.</span> Purpose of Data Processing
              </h2>
              <p className="mb-4">
                Your data is harnessed exclusively for legitimate commercial, operational, and customer stewardship purposes:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-[#555555]">
                <li>To fulfil product orders, package flacons, and execute prompt logistical dispatch.</li>
                <li>To transmit automated transactional receipts, airway bill tracking numbers, and delivery updates.</li>
                <li>To communicate private invitations to limited seasonal reserves, provided you have explicitly subscribed to our newsletter.</li>
                <li>To prevent fraudulent payments and comply with statutory Indian commerce regulations.</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                <span className="text-[#1b5e3f] font-serif">03.</span> Confidentiality &amp; Third-Party Partners
              </h2>
              <p className="mb-3">
                We collaborate solely with vetted operational partners who uphold stringent ISO/GDPR-compliant security thresholds:
              </p>
              <p className="text-sm text-[#555555]">
                • <strong>Logistics Couriers:</strong> Delivery partners (e.g. Blue Dart, Delhivery) receive solely your recipient address and contact telephone number.<br />
                • <strong>Payment Gateways:</strong> Regulated payment facilitators (Razorpay, Stripe) handle card/UPI transactions under PCI-DSS Level 1 compliance.<br />
                We do not sell, rent, or exchange customer information under any circumstance.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                <span className="text-[#1b5e3f] font-serif">04.</span> Cookies &amp; Local Preferences
              </h2>
              <p className="text-sm text-[#555555]">
                Artisan Scent utilizes subtle, lightweight HTTP cookies and browser storage solely to retain items in your shopping bag across visits, remember saved fragrance wishes, and assess site performance. You may disable cookies through your browser preferences at any juncture without forfeiting core shopping access.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-[#e8e2d8] shadow-sm">
              <h2 className="font-display text-2xl text-[#1a1a1a] mb-3 flex items-center gap-2">
                <span className="text-[#1b5e3f] font-serif">05.</span> Your Statutory Rights &amp; Contact
              </h2>
              <p className="text-sm text-[#555555] mb-4">
                In compliance with the Information Technology Act (2000) and Digital Personal Data Protection guidelines of India, you retain the unreserved right to inspect, correct, export, or mandate the erasure of your personal records from our database.
              </p>
              <div className="p-5 rounded-xl bg-[#f8f7f4] border border-[#e8e2d8] flex items-center gap-4">
                <Mail className="text-[#1b5e3f] shrink-0" size={24} />
                <div>
                  <div className="text-xs uppercase font-semibold text-[#1b5e3f] tracking-wider">Privacy Grievance Officer</div>
                  <div className="text-sm text-[#2a2a2a]">Artisan Scent, Mumbai, Maharashtra, India</div>
                  <a href="mailto:privacy@artisanscent.com" className="text-sm text-[#1b5e3f] underline hover:text-[#164a31]">
                    privacy@artisanscent.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer tagline="Client confidentiality. Botanical transparency. Artisanal excellence." />
    </>
  );
}
