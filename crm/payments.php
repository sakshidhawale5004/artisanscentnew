<?php
require_once __DIR__ . '/header.php';
?>

<div class="space-y-8 animate-in fade-in duration-200">
  <!-- Header with Quick Action Buttons -->
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div>
      <div class="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#1b5e3f] font-bold mb-1">
        <span>✓ Verified Corporate Banking Gateway</span>
      </div>
      <h1 class="font-display text-3xl text-[#111111] font-normal">
        Payment Gateway &amp; Banking Hub
      </h1>
      <p class="text-xs text-[#666666] mt-0.5 font-light">
        Official Bank of Baroda merchant settlement account, bob World UPI Standee, and custom order QR generator for atelier staff.
      </p>
    </div>

    <div class="flex flex-wrap items-center gap-2.5">
      <button
        type="button"
        onclick="openChequeModal()"
        class="h-9 px-4 rounded-full border border-[#dcd6cb] bg-white hover:bg-[#f2efe9] text-[#222222] text-xs font-medium shadow-xs transition-colors"
      >
        👁 View Bank Cheque Proof
      </button>
      <a
        href="uploads/payment/bob_upi_qr.png"
        download="bob_world_merchant_qr.png"
        class="h-9 px-4 rounded-full bg-[#1b5e3f] hover:bg-[#164a31] text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-colors"
      >
        ⬇ Download Standee QR
      </a>
    </div>
  </div>

  <!-- Row 1: Bank of Baroda & bob World Merchant Standee -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Left: Official Bank Account Card (7 cols) -->
    <div class="lg:col-span-7 bg-white rounded-3xl border border-[#e4ded5] p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center justify-between border-b border-[#f0ede6] pb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-[#fff7ed] border border-[#ffedd5] flex items-center justify-center text-[#ea580c] font-bold text-lg">
            BOB
          </div>
          <div>
            <h3 class="font-display text-xl text-[#111111]">
              Bank of Baroda (बैंक ऑफ़ बड़ौदा)
            </h3>
            <div class="text-[11px] text-[#666666]">
              Airoli Branch · CBS Current Account
            </div>
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8f5f0] text-[#1b5e3f] border border-[#1b5e3f]/20 uppercase">
          Active &amp; Verified
        </span>
      </div>

      <!-- Account Details Table -->
      <div class="space-y-3 text-xs">
        <!-- Beneficiary Name -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] gap-1">
          <span class="text-[#777777] font-medium">Account Beneficiary:</span>
          <div class="flex items-center gap-2">
            <span class="font-bold text-[#111111] select-all">
              KULSWAMI ESSENCE OIL MANUFACTURING COMPANY
            </span>
            <button
              type="button"
              onclick="copyToClipboard('KULSWAMI ESSENCE OIL MANUFACTURING COMPANY', this)"
              class="px-2 py-1 bg-white border border-[#d5cfc2] hover:border-[#1b5e3f] rounded text-[#1b5e3f] text-[11px] font-semibold"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- Account Number -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] gap-1">
          <span class="text-[#777777] font-medium">Account Number:</span>
          <div class="flex items-center gap-2">
            <span class="font-mono font-extrabold text-base text-[#072416] select-all">
              32020200001980
            </span>
            <button
              type="button"
              onclick="copyToClipboard('32020200001980', this)"
              class="px-2.5 py-1 bg-white border border-[#d5cfc2] hover:border-[#1b5e3f] rounded-lg text-xs font-semibold text-[#1b5e3f] shadow-2xs"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- IFSC Code -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8] gap-1">
          <span class="text-[#777777] font-medium">RTGS / NEFT IFSC Code:</span>
          <div class="flex items-center gap-2">
            <span class="font-mono font-bold text-sm text-[#072416] select-all">
              BARB0AIROLI
            </span>
            <span class="text-[10px] text-[#777777] font-light">(5th digit is zero 0)</span>
            <button
              type="button"
              onclick="copyToClipboard('BARB0AIROLI', this)"
              class="px-2.5 py-1 bg-white border border-[#d5cfc2] hover:border-[#1b5e3f] rounded-lg text-xs font-semibold text-[#1b5e3f] shadow-2xs"
            >
              Copy
            </button>
          </div>
        </div>

        <!-- Account Type & Branch -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
            <div class="text-[10px] uppercase font-bold text-[#777777]">Account Type</div>
            <div class="font-semibold text-xs text-[#111111] mt-0.5">
              चालू खाता / CURRENT ACCOUNT (CBS)
            </div>
          </div>
          <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
            <div class="text-[10px] uppercase font-bold text-[#777777]">Branch Details</div>
            <div class="font-medium text-xs text-[#111111] mt-0.5">
              Airoli Branch, Navi Mumbai - 400708
            </div>
          </div>
        </div>

        <!-- Codes Strip -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
            <div class="text-[10px] uppercase font-bold text-[#777777]">MICR Code</div>
            <div class="font-mono font-semibold text-xs text-[#111111] mt-0.5">400012125</div>
          </div>
          <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
            <div class="text-[10px] uppercase font-bold text-[#777777]">CTS Cheque No.</div>
            <div class="font-mono font-semibold text-xs text-[#111111] mt-0.5">000001 (CTS-2010)</div>
          </div>
          <div class="p-3 rounded-xl bg-[#faf8f5] border border-[#e8e2d8]">
            <div class="text-[10px] uppercase font-bold text-[#777777]">Branch Code</div>
            <div class="font-mono font-semibold text-xs text-[#111111] mt-0.5">0891 (Airoli)</div>
          </div>
        </div>
      </div>

      <!-- Bank Cheque Visual Preview Strip -->
      <div class="pt-2 border-t border-[#f0ede6]">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-semibold text-[#111111]">
            Official Verified Bank Cheque Document
          </span>
          <button
            type="button"
            onclick="openChequeModal()"
            class="text-xs text-[#1b5e3f] font-semibold hover:underline"
          >
            View Full Cheque →
          </button>
        </div>
        <div
          onclick="openChequeModal()"
          class="rounded-2xl border border-[#d8d2c5] overflow-hidden cursor-pointer group relative bg-black/5"
        >
          <img
            src="uploads/payment/bob_cheque.jpg"
            alt="Bank of Baroda Verified Cheque"
            class="w-full h-36 object-cover object-center group-hover:scale-102 transition-transform duration-300"
          />
          <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <span class="px-3.5 py-1.5 rounded-full bg-white/95 text-xs font-semibold text-[#072416] shadow-md">
              👁 Click to Enlarge Verification Document
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right: bob World Merchant UPI Standee (5 cols) -->
    <div class="lg:col-span-5 bg-white rounded-3xl border border-[#e4ded5] p-6 sm:p-7 shadow-xs space-y-5">
      <div class="flex items-center justify-between border-b border-[#f0ede6] pb-4">
        <div>
          <h3 class="font-display text-xl text-[#111111]">
            bob World Merchant UPI
          </h3>
          <div class="text-[11px] text-[#666666]">
            Official Scan &amp; Pay Standee
          </div>
        </div>
        <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#e8f5f0] text-[#1b5e3f] border border-[#1b5e3f]/20 uppercase">
          UPI 2.0
        </span>
      </div>

      <!-- Standee Image Preview -->
      <div class="text-center">
        <div class="inline-block relative p-2 bg-[#faf8f5] rounded-2xl border border-[#e5dfd5] shadow-xs">
          <img
            src="uploads/payment/bob_upi_qr.png"
            alt="bob World Merchant UPI Standee"
            class="w-52 h-auto mx-auto rounded-xl object-contain shadow-xs"
          />
        </div>
      </div>

      <!-- UPI Details -->
      <div class="bg-[#faf8f5] border border-[#e5dfd5] rounded-2xl p-4 space-y-3">
        <div>
          <div class="text-[10px] uppercase font-bold text-[#777777] tracking-wider">
            Official UPI ID / VPA
          </div>
          <div class="flex items-center justify-between gap-2 mt-1">
            <span class="font-mono text-sm font-extrabold text-[#072416] select-all">
              kulsw98202980@barodampay
            </span>
            <button
              type="button"
              onclick="copyToClipboard('kulsw98202980@barodampay', this)"
              class="px-3 py-1.5 bg-white border border-[#d5cfc2] hover:border-[#1b5e3f] rounded-lg text-xs font-semibold text-[#1b5e3f] shadow-2xs"
            >
              Copy
            </button>
          </div>
        </div>

        <div class="pt-2 border-t border-[#eeebe5] text-[11px] text-[#555555]">
          <div class="font-semibold text-[#111111]">Supported Apps:</div>
          <div class="text-[11px] text-[#666666] mt-0.5">
            Google Pay, PhonePe, Paytm, BHIM, bob World Pay, BharatPe, CRED, WhatsApp Pay.
          </div>
        </div>

        <div class="pt-1 flex gap-2">
          <a
            href="uploads/payment/bob_upi_qr.png"
            download="bob_world_merchant_qr.png"
            class="flex-1 py-2 rounded-xl bg-black hover:bg-neutral-800 text-white text-xs font-semibold text-center transition-colors"
          >
            ⬇ Download Standee QR
          </a>
          <a
            href="upi://pay?pa=kulsw98202980@barodampay&pn=KULSWAMI%20ESSENCE%20OIL%20MANUFACTURING%20COMPANY&cu=INR"
            class="px-3.5 py-2 rounded-xl bg-[#1b5e3f] hover:bg-[#164a31] text-white text-xs font-semibold text-center transition-colors"
            title="Test UPI Intent"
          >
            Test Intent ↗
          </a>
        </div>
      </div>
    </div>
  </div>

  <!-- Row 2: Dynamic QR Generator & Concierge Dispatch Block -->
  <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
    <!-- Custom Order QR Generator (6 cols) -->
    <div class="lg:col-span-6 bg-white rounded-3xl border border-[#e4ded5] p-6 sm:p-7 shadow-xs space-y-5">
      <div class="border-b border-[#f0ede6] pb-3">
        <h3 class="font-display text-xl text-[#111111]">
          Instant Order Payment QR Generator
        </h3>
        <p class="text-xs text-[#666666] font-light mt-0.5">
          Generate an instant dynamic UPI QR code with custom amount and order reference for any client.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-semibold text-[#444444] mb-1">
            Amount (₹)
          </label>
          <input
            type="number"
            id="qrAmount"
            value="4999"
            oninput="updateDynamicQR()"
            class="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f]"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#444444] mb-1">
            Order Reference / Note
          </label>
          <input
            type="text"
            id="qrRef"
            value="Order #1024"
            oninput="updateDynamicQR()"
            class="w-full text-xs px-3.5 py-2.5 rounded-xl border border-[#d8d2c5] bg-[#faf8f5] text-[#222222] focus:outline-none focus:border-[#1b5e3f]"
          />
        </div>
      </div>

      <!-- Generated QR Box -->
      <div class="p-4 rounded-2xl bg-[#f4f9f6] border border-[#1b5e3f]/25 flex flex-col sm:flex-row items-center gap-5">
        <img
          id="dynamicQrImg"
          src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3Dkulsw98202980%40barodampay%26pn%3DKULSWAMI%2520ESSENCE%2520OIL%2520MANUFACTURING%2520COMPANY%26am%3D4999%26tn%3DOrder%2520%25231024%26cu%3DINR"
          alt="Dynamic Payment QR"
          class="w-32 h-32 rounded-xl bg-white p-2 border border-[#d5cfc2] shadow-2xs"
        />
        <div class="flex-1 space-y-2 text-xs">
          <div>
            <span class="text-[10px] uppercase font-bold text-[#1b5e3f]">Dynamic Intent</span>
            <div id="dynamicAmountLabel" class="font-mono font-bold text-sm text-[#111111]">
              ₹4,999
            </div>
            <div id="dynamicRefLabel" class="text-[11px] text-[#666666] truncate">Order #1024</div>
          </div>

          <div class="pt-1 flex flex-wrap gap-2">
            <button
              type="button"
              onclick="copyDynamicLink(this)"
              class="px-3 py-1.5 rounded-lg bg-white border border-[#d5cfc2] hover:border-[#1b5e3f] text-[#1b5e3f] font-semibold text-xs shadow-2xs"
            >
              Copy UPI Link
            </button>
            <button
              type="button"
              onclick="copyDynamicWhatsAppMessage(this)"
              class="px-3 py-1.5 rounded-lg bg-[#1b5e3f] hover:bg-[#14472f] text-white font-semibold text-xs shadow-2xs"
            >
              Copy WhatsApp Request
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Concierge Payment Dispatch Block (6 cols) -->
    <div class="lg:col-span-6 bg-white rounded-3xl border border-[#e4ded5] p-6 sm:p-7 shadow-xs space-y-4">
      <div class="border-b border-[#f0ede6] pb-3 flex items-center justify-between">
        <div>
          <h3 class="font-display text-xl text-[#111111]">
            Concierge Payment Dispatch Block
          </h3>
          <p class="text-xs text-[#666666] font-light mt-0.5">
            Pre-formatted text block ready for invoices and WhatsApp patron assistance.
          </p>
        </div>
        <button
          type="button"
          onclick="copyOfficialBlock(this)"
          class="px-3 py-1.5 rounded-lg bg-[#faf8f5] border border-[#d5cfc2] hover:border-[#1b5e3f] text-[#1b5e3f] text-xs font-semibold shadow-2xs"
        >
          Copy Block
        </button>
      </div>

      <div class="bg-[#05170e] text-[#e0deda] p-4 rounded-2xl font-mono text-xs leading-relaxed border border-[#2d8659]/40 select-all">
        <div class="text-[#86efac] font-bold pb-2 border-b border-[#1b5e3f]/60 mb-2">
          ✦ ARTISAN SCENT &amp; KEOMC OFFICIAL SETTLEMENT DETAILS ✦
        </div>
        <div><span class="text-[#999999]">Beneficiary:</span> <strong class="text-white">KULSWAMI ESSENCE OIL MANUFACTURING COMPANY</strong></div>
        <div><span class="text-[#999999]">Bank Name:</span> Bank of Baroda (Airoli Branch)</div>
        <div><span class="text-[#999999]">Account No:</span> <strong class="text-[#86efac]">32020200001980</strong></div>
        <div><span class="text-[#999999]">Account Type:</span> Current Account (CBS)</div>
        <div><span class="text-[#999999]">IFSC Code:</span> <strong class="text-[#86efac]">BARB0AIROLI</strong></div>
        <div><span class="text-[#999999]">MICR Code:</span> 400012125</div>
        <div class="pt-2 mt-2 border-t border-[#1b5e3f]/60"><span class="text-[#999999]">UPI ID / VPA:</span> <strong class="text-[#86efac]">kulsw98202980@barodampay</strong></div>
      </div>

      <div class="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
        <strong>Notice for Customers:</strong> Remind patrons to verify that the beneficiary name displays as <strong>KULSWAMI ESSENCE OIL MANUFACTURING COMPANY</strong> when completing UPI transfers on PhonePe/GPay for their security.
      </div>
    </div>
  </div>
</div>

<!-- Modal for Viewing Bank Cheque Full Document -->
<div id="chequeModal" class="hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
  <div class="bg-white rounded-3xl border border-[#dcd6cb] max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[92vh] overflow-y-auto">
    <button
      type="button"
      onclick="closeChequeModal()"
      class="absolute top-5 right-5 text-[#888888] hover:text-[#111111] p-2 rounded-full bg-[#f5f4f0]"
    >
      ✕
    </button>

    <div class="mb-5">
      <div class="text-[10px] uppercase tracking-[0.25em] text-[#1b5e3f] font-semibold">
        LEGAL BANK VERIFICATION PROOF
      </div>
      <h2 class="font-display text-2xl text-[#111111] font-normal mt-0.5">
        Bank of Baroda Verified Current Account Cheque
      </h2>
      <p class="text-xs text-[#666666] font-light">
        Official cheque leaf for KULSWAMI ESSENCE OIL MANUFACTURING COMPANY (A/C: 32020200001980 | IFSC: BARB0AIROLI).
      </p>
    </div>

    <div class="rounded-2xl border-2 border-[#1b5e3f]/30 overflow-hidden shadow-lg bg-neutral-900 p-2">
      <img
        src="uploads/payment/bob_cheque.jpg"
        alt="Bank of Baroda Cheque"
        class="w-full h-auto rounded-xl object-contain max-h-[65vh] mx-auto"
      />
    </div>

    <div class="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#f0ede6] text-xs">
      <div class="font-mono text-[#555555]">
        CTS-2010 · AIROLI BRANCH · NAVI MUMBAI - 400708
      </div>
      <div class="flex items-center gap-2">
        <a
          href="uploads/payment/bob_cheque.jpg"
          download="bob_cheque_verification.jpg"
          class="px-4 py-2 rounded-full bg-[#1b5e3f] hover:bg-[#164a31] text-white text-xs font-medium"
        >
          ⬇ Download Document
        </a>
        <button
          type="button"
          onclick="closeChequeModal()"
          class="px-4 py-2 rounded-full border border-[#dcd6cb] text-xs text-[#555555] hover:bg-[#f5f4f0]"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</div>

<script>
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text);
  const orig = btn.innerText;
  btn.innerText = 'Copied!';
  setTimeout(() => { btn.innerText = orig; }, 2000);
}

function updateDynamicQR() {
  const amt = document.getElementById('qrAmount').value || 0;
  const ref = document.getElementById('qrRef').value || 'Order';
  document.getElementById('dynamicAmountLabel').innerText = '₹' + Number(amt).toLocaleString('en-IN');
  document.getElementById('dynamicRefLabel').innerText = ref;

  const uri = `upi://pay?pa=kulsw98202980@barodampay&pn=KULSWAMI%20ESSENCE%20OIL%20MANUFACTURING%20COMPANY&am=${amt}&tn=${encodeURIComponent(ref)}&cu=INR`;
  document.getElementById('dynamicQrImg').src = 'https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=' + encodeURIComponent(uri);
}

function copyDynamicLink(btn) {
  const amt = document.getElementById('qrAmount').value || 0;
  const ref = document.getElementById('qrRef').value || 'Order';
  const uri = `upi://pay?pa=kulsw98202980@barodampay&pn=KULSWAMI%20ESSENCE%20OIL%20MANUFACTURING%20COMPANY&am=${amt}&tn=${encodeURIComponent(ref)}&cu=INR`;
  copyToClipboard(uri, btn);
}

function copyDynamicWhatsAppMessage(btn) {
  const amt = document.getElementById('qrAmount').value || 0;
  const ref = document.getElementById('qrRef').value || 'Order';
  const msg = `✦ Artisan Scent Haute Parfumerie Payment Request ✦\n\nPayable: ₹${Number(amt).toLocaleString('en-IN')}\nReference: ${ref}\n\nOfficial UPI ID: kulsw98202980@barodampay\nBeneficiary: KULSWAMI ESSENCE OIL MANUFACTURING COMPANY\nBank: Bank of Baroda (A/C: 32020200001980, IFSC: BARB0AIROLI)\n\nScan QR or pay via GPay/PhonePe/Paytm. Once transferred, kindly share the UTR reference for instant formulation dispatch.`;
  copyToClipboard(msg, btn);
}

function copyOfficialBlock(btn) {
  const msg = `✦ Artisan Scent Haute Parfumerie Official Banking ✦\n\nBeneficiary: KULSWAMI ESSENCE OIL MANUFACTURING COMPANY\nBank: Bank of Baroda\nBranch: Airoli Branch, Navi Mumbai - 400708\nA/C No: 32020200001980\nAccount Type: Current Account\nIFSC Code: BARB0AIROLI\nMICR Code: 400012125\n\nOfficial UPI ID: kulsw98202980@barodampay\n(Scan & Pay supported across all UPI apps)`;
  copyToClipboard(msg, btn);
}

function openChequeModal() {
  document.getElementById('chequeModal').classList.remove('hidden');
}

function closeChequeModal() {
  document.getElementById('chequeModal').classList.add('hidden');
}
</script>

<?php require_once __DIR__ . '/footer.php'; ?>
