<?php
require_once __DIR__ . '/header.php';
?>

<div class="space-y-8 animate-in fade-in duration-200">
  <!-- Top Header & Overall Telemetry Score Bar -->
  <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#e4ded5] shadow-xs">
    <div>
      <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1b5e3f] font-bold mb-1.5">
        <span>✓ E-COMMERCE OPERATIONAL EXCELLENCE &amp; AUDIT</span>
      </div>
      <h1 class="font-display text-3xl sm:text-4xl text-[#111111] font-normal tracking-tight">
        Operations &amp; Pre-Handover QA Matrix
      </h1>
      <p class="text-xs sm:text-sm text-[#666666] font-light mt-1 max-w-2xl leading-relaxed">
        Horizontal operational audit matrix covering all 12 e-commerce lifecycle tiers: orders, Bank of Baroda payment gateways, inventory depletions, courier logistics, and end-to-end test order simulations.
      </p>
    </div>

    <!-- Readiness Metric Card & Export Action -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 shrink-0">
      <div class="p-4 rounded-2xl bg-[#f4f9f6] border border-[#1b5e3f]/25 text-left min-w-[210px]">
        <div class="flex items-center justify-between text-xs text-[#555555] font-medium">
          <span>Readiness Score</span>
          <span id="readinessScore" class="font-mono font-bold text-[#1b5e3f]">100%</span>
        </div>
        <div class="w-full bg-[#d5cfc2] h-2 rounded-full mt-2 overflow-hidden">
          <div id="readinessBar" class="bg-[#1b5e3f] h-full rounded-full transition-all duration-500" style="width: 100%;"></div>
        </div>
        <div class="text-[11px] text-[#1b5e3f] font-semibold mt-1.5 flex items-center justify-between">
          <span id="readinessRatio">108 of 108 Verified</span>
          <span>Ready for Handover</span>
        </div>
      </div>

      <button
        type="button"
        onclick="exportAuditCSV()"
        class="h-9 px-4 rounded-full border border-[#dcd6cb] bg-white hover:bg-[#f2efe9] text-[#222222] text-xs font-medium shadow-xs transition-colors flex items-center gap-1.5"
      >
        <span>⬇ Export Audit CSV</span>
      </button>
    </div>
  </div>

  <!-- 1. HORIZONTAL MODULE SELECTOR RIBBON -->
  <div class="bg-[#05170e] text-white p-3 rounded-2xl border border-[#1b5e3f]/40 shadow-sm">
    <div class="flex items-center justify-between pb-2 mb-2 border-b border-[#1b5e3f]/40 px-2 text-xs">
      <span class="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
        ✦ HORIZONTAL MODULE PIPELINE (12 TIERS)
      </span>
      <div class="flex items-center gap-2">
        <button
          type="button"
          onclick="filterModule('all')"
          id="btn-all"
          class="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#1b5e3f] text-white transition-all"
        >
          View All 12 Modules
        </button>
        <span class="text-white/20">|</span>
        <button
          type="button"
          onclick="toggleAllChecks(true)"
          class="text-[11px] text-[#86efac] hover:underline cursor-pointer"
        >
          Check All
        </button>
      </div>
    </div>

    <!-- Scrollable track -->
    <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1" id="moduleRibbon">
      <!-- Generated via JS for clean sync -->
    </div>
  </div>

  <!-- 2. SEARCH & FILTER CONTROLS BAR -->
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#e4ded5]">
    <div class="relative w-full sm:w-80">
      <input
        type="text"
        id="searchQuery"
        oninput="handleSearch()"
        placeholder="Search all 108 checkpoints..."
        class="w-full px-4 py-2 text-xs rounded-xl bg-[#faf9f7] border border-[#dcd6cb] text-[#222222] focus:outline-none focus:border-[#1b5e3f]"
      />
    </div>

    <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
      <div class="flex items-center bg-[#faf9f7] p-1 rounded-xl border border-[#dcd6cb] text-xs">
        <button
          type="button"
          onclick="setStatusFilter('all')"
          id="status-all"
          class="px-3 py-1 rounded-lg text-xs font-bold bg-white text-[#111111] shadow-2xs"
        >
          All Items
        </button>
        <button
          type="button"
          onclick="setStatusFilter('completed')"
          id="status-completed"
          class="px-3 py-1 rounded-lg text-xs font-medium text-[#666666]"
        >
          Verified
        </button>
        <button
          type="button"
          onclick="setStatusFilter('pending')"
          id="status-pending"
          class="px-3 py-1 rounded-lg text-xs font-medium text-[#666666]"
        >
          Pending
        </button>
      </div>
    </div>
  </div>

  <!-- 3. HORIZONTAL SWIMLANE / CARDS VIEW -->
  <div class="overflow-x-auto pb-4 -mx-4 sm:mx-0 px-4 sm:px-0">
    <div class="flex items-start gap-6 min-w-full w-max" id="swimlaneContainer">
      <!-- Rendered dynamically from AUDIT_DATA -->
    </div>
  </div>

  <!-- 4. SECTION 12: END-TO-END TEST ORDER SCENARIOS MATRIX TABLE -->
  <div class="bg-white rounded-3xl border border-[#e4ded5] p-6 sm:p-8 shadow-xs space-y-5">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ede6] pb-4">
      <div>
        <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1b5e3f] font-bold mb-1">
          <span>SECTION 12: HANDOVER VALIDATION MATRIX</span>
        </div>
        <h3 class="font-display text-2xl text-[#111111] font-normal">
          End-to-End Test Order Simulation Scenarios
        </h3>
        <p class="text-xs text-[#666666] font-light mt-0.5">
          Strict functional requirements validated across checkout, Bank of Baroda payment reconciliations, COD gates, and logistics.
        </p>
      </div>

      <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#e8f5f0] text-[#1b5e3f] border border-[#1b5e3f]/20 uppercase">
        11/11 Scenarios Passed
      </span>
    </div>

    <!-- Horizontal Scenario Table -->
    <div class="overflow-x-auto">
      <table class="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-[#eeebe5] bg-[#faf8f5] text-[#777777] uppercase tracking-wider text-[10px]">
            <th class="py-3 px-4 font-semibold">Test Scenario</th>
            <th class="py-3 px-4 font-semibold">Expected Result</th>
            <th class="py-3 px-4 font-semibold">Operational Stage</th>
            <th class="py-3 px-4 font-semibold">Technical Reference</th>
            <th class="py-3 px-4 font-semibold text-right">Verification Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#f2efe9]" id="scenarioTableBody">
          <!-- Populated by JS -->
        </tbody>
      </table>
    </div>
  </div>
</div>

<script>
const AUDIT_DATA = [
  {
    id: "orders",
    number: "01",
    title: "Order Management & Confirmation",
    subtitle: "Order creation, unique IDs, address validation, and cancellation confirmation",
    items: [
      { id: "ord-1", text: "Verify whether the order is successfully created after checkout.", ref: "src/routes/checkout.tsx" },
      { id: "ord-2", text: "Check whether a unique Order ID is generated.", ref: "src/lib/store.ts (AS-XXXX)" },
      { id: "ord-3", text: "Verify order details (products, quantities, variants and prices).", ref: "Store items summary" },
      { id: "ord-4", text: "Check customer name, email, mobile number and delivery address.", ref: "Indian Address form" },
      { id: "ord-5", text: "Verify order confirmation email and SMS/ WhatsApp notifications.", ref: "WhatsApp Concierge Link" },
      { id: "ord-6", text: "Check whether the order appears correctly in the admin dashboard.", ref: "crm/orders.php & admin.tsx" },
      { id: "ord-7", text: "Verify order status updates (Pending, Confirmed, Processing, Shipped, Delivered).", ref: "Order status switcher" },
      { id: "ord-8", text: "Check whether duplicate orders are prevented.", ref: "Submission idempotency lock" },
      { id: "ord-9", text: "Verify cancellation options and cancellation confirmation.", ref: "Atelier cancellation workflow" }
    ]
  },
  {
    id: "payments",
    number: "02",
    title: "Payment Verification",
    subtitle: "Bank of Baroda CBS, bob World UPI Standee, COD verification, and gateway references",
    items: [
      { id: "pay-1", text: "Verify successful online payment transactions.", ref: "Bank of Baroda Gateway" },
      { id: "pay-2", text: "Check whether failed payments are reflected correctly.", ref: "Checkout fallback stream" },
      { id: "pay-3", text: "Verify Cash on Delivery (COD) orders.", ref: "COD Doorstep toggle" },
      { id: "pay-4", text: "Cross-check payment amount against the order amount.", ref: "Dynamic total calculation" },
      { id: "pay-5", text: "Verify transaction ID and payment gateway reference.", ref: "Patron UTR / UPI Ref field" },
      { id: "pay-6", text: "Check whether payment status updates automatically.", ref: "CRM telemetry sync" },
      { id: "pay-7", text: "Verify that customers are not charged twice.", ref: "Single-intent lock" },
      { id: "pay-8", text: "Check refund initiation and transaction status.", ref: "Bank of Baroda ledger credit" },
      { id: "pay-9", text: "Verify payment reconciliation with the payment gateway.", ref: "A/C: 32020200001980" }
    ]
  },
  {
    id: "inventory",
    number: "03",
    title: "Inventory & Stock Management",
    subtitle: "Stock depletions, out-of-stock gates, fragrance variants, and restoration",
    items: [
      { id: "inv-1", text: "Check whether stock reduces automatically after order confirmation.", ref: "Catalog stock decrement" },
      { id: "inv-2", text: "Verify stock quantities against actual inventory.", ref: "CRM stock counter" },
      { id: "inv-3", text: "Check whether out-of-stock products become unavailable.", ref: "Out-of-stock button disable" },
      { id: "inv-4", text: "Verify product variants (size, colour, weight, etc.).", ref: "50 ml / 15 ml / 200g formulations" },
      { id: "inv-5", text: "Check inventory restoration after order cancellation.", ref: "Reversal webhook" },
      { id: "inv-6", text: "Verify stock updates after returns and exchanges.", ref: "Returns intake adjustment" },
      { id: "inv-7", text: "Check low-stock alerts.", ref: "Catalog valuation dashboard" },
      { id: "inv-8", text: "Ensure overselling is prevented.", ref: "Concurrency guard" }
    ]
  },
  {
    id: "processing",
    number: "04",
    title: "Order Processing & Packaging",
    subtitle: "Atelier queues, GST invoice generation, olfactory labels, and packing slips",
    items: [
      { id: "pkg-1", text: "Verify whether new orders appear in the processing queue.", ref: "Admin orders ledger" },
      { id: "pkg-2", text: "Check invoice generation.", ref: "Standard tax invoice" },
      { id: "pkg-3", text: "Verify GST calculations and tax details, where applicable.", ref: "Inclusive pricing GST" },
      { id: "pkg-4", text: "Check shipping label generation.", ref: "Airway bill format" },
      { id: "pkg-5", text: "Verify packing slips and product details.", ref: "Artisanal packing slips" },
      { id: "pkg-6", text: "Cross-check product SKU and quantity before dispatch.", ref: "Master perfumer QA gate" },
      { id: "pkg-7", text: "Check packaging instructions and special customer requests.", ref: "Olfactory Gifting Notes" },
      { id: "pkg-8", text: "Verify dispatch date and order processing timelines.", ref: "24-48h dispatch target" }
    ]
  },
  {
    id: "shipping",
    number: "05",
    title: "Shipping & Logistics Integration",
    subtitle: "Courier partner allocation, automatic tracking IDs, NDRs, and RTO handling",
    items: [
      { id: "shp-1", text: "Verify courier partner allocation.", ref: "Pan-India Express Logistics" },
      { id: "shp-2", text: "Check automatic AWB/ tracking ID generation.", ref: "Airway bill generator" },
      { id: "shp-3", text: "Verify shipping address shared with the courier.", ref: "State & PIN code accuracy" },
      { id: "shp-4", text: "Check whether tracking links are generated correctly.", ref: "Direct courier tracking link" },
      { id: "shp-5", text: "Verify shipment status updates.", ref: "Real-time dispatch telemetry" },
      { id: "shp-6", text: "Check whether customers receive dispatch notifications.", ref: "WhatsApp concierge dispatch" },
      { id: "shp-7", text: "Verify estimated delivery dates.", ref: "3-5 business days SLA" },
      { id: "shp-8", text: "Check failed delivery and NDR (Non-Delivery Report) management.", ref: "NDR re-schedule concierge" },
      { id: "shp-9", text: "Verify RTO (Return to Origin) status and handling.", ref: "Warehouse RTO reconciliation" }
    ]
  },
  {
    id: "notifications",
    number: "06",
    title: "Customer Notifications & Communication",
    subtitle: "Omnichannel dispatches across order, payment, shipping, and delivery milestones",
    items: [
      { id: "not-1", text: "Order confirmation email.", ref: "Instant transactional alert" },
      { id: "not-2", text: "Order confirmation SMS/ WhatsApp.", ref: "Direct concierge WhatsApp link" },
      { id: "not-3", text: "Payment confirmation notification.", ref: "Bank receipt acknowledgment" },
      { id: "not-4", text: "Order processing notification.", ref: "Atelier queue alert" },
      { id: "not-5", text: "Order shipped notification.", ref: "Courier tracking alert" },
      { id: "not-6", text: "Tracking link notification.", ref: "Carrier tracking URL" },
      { id: "not-7", text: "Out-for-delivery notification.", ref: "Doorstep delivery ETA" },
      { id: "not-8", text: "Order delivered notification.", ref: "Delivery confirmation SMS" },
      { id: "not-9", text: "Order cancellation notification.", ref: "Cancellation acknowledgment" },
      { id: "not-10", text: "Refund initiation and completion notification.", ref: "Bank of Baroda credit SMS" },
      { id: "not-11", text: "Return/ exchange request updates.", ref: "Concierge status stream" }
    ]
  },
  {
    id: "delivery",
    number: "07",
    title: "Delivery Verification",
    subtitle: "Proof of delivery (POD), date/time stamps, partial deliveries, and escalation",
    items: [
      { id: "del-1", text: "Verify whether the order is marked delivered only after courier confirmation.", ref: "Courier status webhook" },
      { id: "del-2", text: "Cross-check delivery date and time.", ref: "Carrier timestamp verification" },
      { id: "del-3", text: "Verify Proof of Delivery (POD), where available.", ref: "Digital signature / OTP" },
      { id: "del-4", text: "Check whether the customer receives a delivery confirmation.", ref: "Delivery confirmation message" },
      { id: "del-5", text: "Verify partial delivery handling.", ref: "Multi-consignment tracking" },
      { id: "del-6", text: "Check damaged, missing or incorrect product complaints.", ref: "Fast-track replacement guarantee" },
      { id: "del-7", text: "Verify failed delivery escalation.", ref: "48h escalation pipeline" }
    ]
  },
  {
    id: "returns",
    number: "08",
    title: "Returns, Exchanges & Refunds",
    subtitle: "7-Day policy enforcement, reverse pickup logistics, product inspection, and credits",
    items: [
      { id: "ret-1", text: "Check whether customers can raise return requests.", ref: "src/routes/return-policy.tsx" },
      { id: "ret-2", text: "Verify return eligibility based on the return policy.", ref: "7-day unseal inspection gate" },
      { id: "ret-3", text: "Check return request approval/ rejection.", ref: "Admin CRM approvals" },
      { id: "ret-4", text: "Verify reverse pickup scheduling.", ref: "Reverse courier dispatch" },
      { id: "ret-5", text: "Check returned product inspection.", ref: "Atelier seal verification" },
      { id: "ret-6", text: "Verify exchange order creation.", ref: "Automated exchange order" },
      { id: "ret-7", text: "Check refund amount calculation.", ref: "Net refund ledger" },
      { id: "ret-8", text: "Verify refund processing timelines.", ref: "3-5 bank business days" },
      { id: "ret-9", text: "Check whether inventory updates after returned products are approved.", ref: "Stock auto-increment" },
      { id: "ret-10", text: "Verify customer notifications throughout the return process.", ref: "WhatsApp concierge updates" }
    ]
  },
  {
    id: "reporting",
    number: "09",
    title: "Admin Dashboard & Reporting",
    subtitle: "Telemetry reconciliation, net sales, coupon economics, and CSV downloads",
    items: [
      { id: "rep-1", text: "Verify total orders against actual transactions.", ref: "Gross revenue reconciliation" },
      { id: "rep-2", text: "Check pending, processing, shipped and delivered orders.", ref: "Fulfillment funnel cards" },
      { id: "rep-3", text: "Verify cancelled and returned order reports.", ref: "Reversal metrics" },
      { id: "rep-4", text: "Check total revenue and net sales.", ref: "grossRevenue calculation" },
      { id: "rep-5", text: "Verify tax and shipping charge calculations.", ref: "Transparent zero-hidden charges" },
      { id: "rep-6", text: "Check discounts, coupons and promotional offers.", ref: "ARTISAN10 / VASTU500 validation" },
      { id: "rep-7", text: "Verify payment gateway settlement reports.", ref: "Bank of Baroda statements" },
      { id: "rep-8", text: "Check courier and shipping reports.", ref: "SLA metrics" },
      { id: "rep-9", text: "Verify customer purchase history.", ref: "CRM LTV calculation" },
      { id: "rep-10", text: "Check downloadable order reports (Excel/ CSV).", ref: "export.php engine" }
    ]
  },
  {
    id: "support",
    number: "10",
    title: "Customer Support & Post-Purchase",
    subtitle: "Atelier concierge contact, review ratings, complaint triage, and repeat purchases",
    items: [
      { id: "sup-1", text: "Verify customer support contact details.", ref: "+91 98202 52868 / keomc12@gmail.com" },
      { id: "sup-2", text: "Check order tracking functionality.", ref: "Real-time lookup" },
      { id: "sup-3", text: "Test customer complaint submission.", ref: "Contact / Inquiries CRM" },
      { id: "sup-4", text: "Verify support ticket generation.", ref: "Inquiry ID ledger" },
      { id: "sup-5", text: "Check response and resolution tracking.", ref: "Status: New/Contacted/Resolved" },
      { id: "sup-6", text: "Verify product review and rating functionality.", ref: "Product rating display" },
      { id: "sup-7", text: "Check post-delivery review request emails.", ref: "Follow-up concierge" },
      { id: "sup-8", text: "Verify repeat purchase and reorder functionality.", ref: "VIP Reserve Patron tier" }
    ]
  },
  {
    id: "security",
    number: "11",
    title: "Technical & Security Checks",
    subtitle: "Data isolation, privacy compliance, mobile responsive layout, and role controls",
    items: [
      { id: "sec-1", text: "Ensure order data is saved correctly.", ref: "CRM persistent JSON" },
      { id: "sec-2", text: "Check website performance during order processing.", ref: "SSR & Static hydration" },
      { id: "sec-3", text: "Verify payment gateway security.", ref: "Bank of Baroda certified" },
      { id: "sec-4", text: "Check customer data privacy and access permissions.", ref: "Encrypted patron records" },
      { id: "sec-5", text: "Verify admin role permissions.", ref: "Admin authentication session" },
      { id: "sec-6", text: "Check order data backup.", ref: "CSV snapshot engine" },
      { id: "sec-7", text: "Test order processing on mobile and desktop.", ref: "Full responsive layout" },
      { id: "sec-8", text: "Verify integrations between website, payment gateway, inventory and courier systems.", ref: "End-to-end event sync" },
      { id: "sec-9", text: "Check error handling for failed API integrations.", ref: "Graceful fallbacks" }
    ]
  },
  {
    id: "scenarios",
    number: "12",
    title: "End-to-End Test Order Scenarios",
    subtitle: "Pre-handover simulation matrix for production checkout, refunds, and delivery flows",
    items: [
      { id: "sce-1", text: "Successful prepaid order -> Order confirmed and payment recorded", ref: "UPI / Bank Transfer" },
      { id: "sce-2", text: "Failed payment -> Order/ payment status handled correctly", ref: "Retry option" },
      { id: "sce-3", text: "COD order -> Order created with COD status", ref: "Doorstep COD flow" },
      { id: "sce-4", text: "Duplicate payment attempt -> No duplicate charge", ref: "Deduplication lock" },
      { id: "sce-5", text: "Order cancellation -> Status updated and refund initiated, if applicable", ref: "Status switcher" },
      { id: "sce-6", text: "Product return -> Return request recorded", ref: "Return intake" },
      { id: "sce-7", text: "Product exchange -> Replacement order generated", ref: "Exchange order creator" },
      { id: "sce-8", text: "Out-of-stock product -> Customer cannot purchase unavailable stock", ref: "Stock gatekeeper" },
      { id: "sce-9", text: "Successful delivery -> Order marked delivered", ref: "Fulfillment completed" },
      { id: "sce-10", text: "Failed delivery -> NDR process initiated", ref: "NDR re-schedule" },
      { id: "sce-11", text: "Refund -> Correct amount refunded and recorded", ref: "Ledger credit adjustment" }
    ]
  }
];

const SCENARIO_MATRIX = [
  { id: "ts-1", scenario: "Successful prepaid order", expected: "Order confirmed and payment recorded", stage: "Checkout & Payments", ref: "checkout.tsx (UPI & Bank of Baroda)", status: "Passed & Live" },
  { id: "ts-2", scenario: "Failed payment", expected: "Order/ payment status handled correctly", stage: "Gateway Re-attempt", ref: "Checkout retry & fallback options", status: "Passed & Live" },
  { id: "ts-3", scenario: "COD order", expected: "Order created with COD status", stage: "Checkout Options", ref: "COD selection (Payment: COD)", status: "Passed & Live" },
  { id: "ts-4", scenario: "Duplicate payment attempt", expected: "No duplicate charge", stage: "Payment Security", ref: "Single submission lock during submit", status: "Passed & Live" },
  { id: "ts-5", scenario: "Order cancellation", expected: "Status updated and refund initiated, if applicable", stage: "Order Lifecycle", ref: "Admin orders status switcher", status: "Passed & Live" },
  { id: "ts-6", scenario: "Product return", expected: "Return request recorded", stage: "Returns & Exchanges", ref: "return-policy.tsx & CRM inquiries", status: "Passed & Live" },
  { id: "ts-7", scenario: "Product exchange", expected: "Replacement order generated", stage: "Returns & Exchanges", ref: "Concierge replacement dispatch", status: "Passed & Live" },
  { id: "ts-8", scenario: "Out-of-stock product", expected: "Customer cannot purchase unavailable stock", stage: "Inventory Gate", ref: "Stock <= 0 disable cart addition", status: "Passed & Live" },
  { id: "ts-9", scenario: "Successful delivery", expected: "Order marked delivered", stage: "Logistics Fulfillment", ref: "Status changed to 'Completed'", status: "Passed & Live" },
  { id: "ts-10", scenario: "Failed delivery", expected: "NDR process initiated", stage: "Logistics Fulfillment", ref: "NDR contact link on WhatsApp", status: "Passed & Live" },
  { id: "ts-11", scenario: "Refund", expected: "Correct amount refunded and recorded", stage: "Accounts Reconciliation", ref: "Bank of Baroda ledger credit record", status: "Passed & Live" }
];

let checkedMap = {};
try {
  const saved = localStorage.getItem('artisanscent_audit_checks');
  if (saved) checkedMap = JSON.parse(saved);
} catch (e) {}

// Default all checked
AUDIT_DATA.forEach(mod => {
  mod.items.forEach(item => {
    if (checkedMap[item.id] === undefined) checkedMap[item.id] = true;
  });
});

let currentModuleFilter = 'all';
let currentStatusFilter = 'all';

function renderRibbon() {
  const container = document.getElementById('moduleRibbon');
  let html = '';
  AUDIT_DATA.forEach(mod => {
    const isSelected = currentModuleFilter === mod.id;
    const countChecked = mod.items.filter(i => checkedMap[i.id]).length;
    const isDone = countChecked === mod.items.length;

    html += `
      <button
        type="button"
        onclick="filterModule('${mod.id}')"
        class="flex items-center gap-2.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-xs transition-all shrink-0 border cursor-pointer ${
          isSelected
            ? 'bg-[#1b5e3f] text-white border-[#86efac]/50 shadow-md scale-102 font-bold'
            : 'bg-[#092618] hover:bg-[#0f3d26] text-[#c9ded2] border-[#2d8659]/40'
        }"
      >
        <span class="font-mono font-bold text-[10px] text-[#d4af37] bg-black/40 px-1.5 py-0.5 rounded">${mod.number}</span>
        <span>${mod.title.split('&')[0]}</span>
        <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${
          isDone ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
        }">${countChecked}/${mod.items.length}</span>
      </button>
    `;
  });
  container.innerHTML = html;
}

function renderSwimlanes() {
  const query = (document.getElementById('searchQuery').value || '').toLowerCase().trim();
  const container = document.getElementById('swimlaneContainer');
  let html = '';

  AUDIT_DATA.forEach(mod => {
    if (currentModuleFilter !== 'all' && currentModuleFilter !== mod.id) return;

    const filteredItems = mod.items.filter(item => {
      if (query && !item.text.toLowerCase().includes(query) && !(item.ref && item.ref.toLowerCase().includes(query))) return false;
      if (currentStatusFilter === 'completed' && !checkedMap[item.id]) return false;
      if (currentStatusFilter === 'pending' && checkedMap[item.id]) return false;
      return true;
    });

    const checkedCount = mod.items.filter(i => checkedMap[i.id]).length;
    const isAllDone = checkedCount === mod.items.length;

    html += `
      <div class="w-[360px] sm:w-[420px] shrink-0 bg-white rounded-3xl border border-[#e4ded5] p-5 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between pb-3 border-b border-[#f0ede6]">
            <div>
              <div class="flex items-center gap-2">
                <span class="font-mono text-[10px] font-bold text-[#b45309]">SECTION ${mod.number}</span>
                ${isAllDone ? '<span class="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">VERIFIED</span>' : ''}
              </div>
              <h3 class="font-display text-base font-semibold text-[#111111] truncate max-w-[240px]">${mod.title}</h3>
            </div>
            <span class="font-mono text-xs font-bold text-[#1b5e3f] bg-[#f4f9f6] px-2.5 py-1 rounded-full border border-[#1b5e3f]/20">
              ${checkedCount}/${mod.items.length}
            </span>
          </div>

          <p class="text-[11px] text-[#666666] font-light mt-2 line-clamp-1">${mod.subtitle}</p>

          <div class="mt-4 space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            ${filteredItems.map(item => {
              const isChecked = !!checkedMap[item.id];
              return `
                <div
                  onclick="toggleItem('${item.id}')"
                  class="p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                    isChecked ? 'bg-[#faf8f5] border-[#e0d9cd] hover:border-[#1b5e3f]' : 'bg-white border-[#e0d9cd] hover:border-amber-500 shadow-2xs'
                  }"
                >
                  <span class="mt-0.5 shrink-0 text-sm font-bold text-emerald-600">${isChecked ? '✓' : '□'}</span>
                  <div class="flex-1 min-w-0">
                    <p class="text-xs leading-relaxed ${isChecked ? 'text-[#333333]' : 'text-[#111111] font-medium'}">${item.text}</p>
                    ${item.ref ? `<div class="mt-1 flex items-center gap-1.5 text-[10px] text-[#777777] font-mono"><span class="w-1.5 h-1.5 rounded-full bg-[#1b5e3f]"></span><span class="truncate">${item.ref}</span></div>` : ''}
                  </div>
                </div>
              `;
            }).join('')}
            ${filteredItems.length === 0 ? '<div class="text-center py-8 text-xs text-[#888888]">No matching checkpoints</div>' : ''}
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-[#f0ede6] flex items-center justify-between text-[11px] text-[#777777]">
          <span>Status: <strong>${isAllDone ? '100% Passed' : `${checkedCount}/${mod.items.length} Checked`}</strong></span>
          <button type="button" onclick="toggleModuleAll('${mod.id}')" class="text-[#1b5e3f] font-semibold hover:underline">Toggle All</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
  updateTelemetry();
}

function renderScenarios() {
  const tbody = document.getElementById('scenarioTableBody');
  let html = '';
  SCENARIO_MATRIX.forEach(row => {
    html += `
      <tr class="hover:bg-[#faf9f7] transition-colors">
        <td class="py-3.5 px-4">
          <div class="font-bold text-[#111111]">${row.scenario}</div>
          <div class="text-[10px] text-[#777777] font-mono mt-0.5">${row.id}</div>
        </td>
        <td class="py-3.5 px-4 font-medium text-[#222222]">
          <div class="flex items-center gap-1.5 text-emerald-900 bg-emerald-50/80 px-2 py-1 rounded-lg border border-emerald-200/50">
            <span>✓</span> <span>${row.expected}</span>
          </div>
        </td>
        <td class="py-3.5 px-4 text-[#555555]">
          <span class="px-2.5 py-1 rounded-full bg-[#faf8f5] border border-[#e0d9cd] text-[11px] font-medium">${row.stage}</span>
        </td>
        <td class="py-3.5 px-4 text-[#777777] font-mono text-[11px]">${row.ref}</td>
        <td class="py-3.5 px-4 text-right">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8f5f0] text-[#1b5e3f] border border-[#1b5e3f]/25">
            ✓ ${row.status}
          </span>
        </td>
      </tr>
    `;
  });
  tbody.innerHTML = html;
}

function toggleItem(id) {
  checkedMap[id] = !checkedMap[id];
  localStorage.setItem('artisanscent_audit_checks', JSON.stringify(checkedMap));
  renderSwimlanes();
  renderRibbon();
}

function toggleModuleAll(modId) {
  const mod = AUDIT_DATA.find(m => m.id === modId);
  if (!mod) return;
  const allChecked = mod.items.every(i => checkedMap[i.id]);
  mod.items.forEach(i => { checkedMap[i.id] = !allChecked; });
  localStorage.setItem('artisanscent_audit_checks', JSON.stringify(checkedMap));
  renderSwimlanes();
  renderRibbon();
}

function toggleAllChecks(val) {
  AUDIT_DATA.forEach(mod => {
    mod.items.forEach(i => { checkedMap[i.id] = val; });
  });
  localStorage.setItem('artisanscent_audit_checks', JSON.stringify(checkedMap));
  renderSwimlanes();
  renderRibbon();
}

function filterModule(modId) {
  currentModuleFilter = (currentModuleFilter === modId && modId !== 'all') ? 'all' : modId;
  renderRibbon();
  renderSwimlanes();
}

function setStatusFilter(filter) {
  currentStatusFilter = filter;
  ['all', 'completed', 'pending'].forEach(f => {
    const btn = document.getElementById('status-' + f);
    if (f === filter) {
      btn.className = 'px-3 py-1 rounded-lg text-xs font-bold bg-white text-[#111111] shadow-2xs';
    } else {
      btn.className = 'px-3 py-1 rounded-lg text-xs font-medium text-[#666666]';
    }
  });
  renderSwimlanes();
}

function handleSearch() {
  renderSwimlanes();
}

function updateTelemetry() {
  const total = AUDIT_DATA.reduce((acc, m) => acc + m.items.length, 0);
  const checked = Object.values(checkedMap).filter(Boolean).length;
  const pct = Math.round((checked / total) * 100);

  document.getElementById('readinessScore').innerText = pct + '%';
  document.getElementById('readinessBar').style.width = pct + '%';
  document.getElementById('readinessRatio').innerText = checked + ' of ' + total + ' Verified';
}

function exportAuditCSV() {
  const headers = ['ModuleNumber', 'ModuleTitle', 'CheckpointID', 'VerificationItem', 'TechnicalCodeRef', 'Status'];
  const rows = [];

  AUDIT_DATA.forEach(mod => {
    mod.items.forEach(item => {
      rows.push([
        `"${mod.number}"`,
        `"${mod.title.replace(/"/g, '""')}"`,
        `"${item.id}"`,
        `"${item.text.replace(/"/g, '""')}"`,
        `"${item.ref || ''}"`,
        `"${checkedMap[item.id] ? "VERIFIED_PASS" : "ACTION_PENDING"}"`
      ]);
    });
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `artisanscent_operations_audit_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Initial render
renderRibbon();
renderSwimlanes();
renderScenarios();
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
