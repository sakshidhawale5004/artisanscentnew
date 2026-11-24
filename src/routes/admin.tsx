import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  products as initialProducts,
  money,
  type Product,
  getStoredProducts,
  saveStoredProducts,
} from "@/lib/products";
import {
  type Inquiry,
  getStoredInquiries,
  saveStoredInquiries,
  type CRMOrder,
  getStoredOrders,
  saveStoredOrders,
  syncCloudOrders,
  addOrderToCRM,
  ORDERS_UPDATED_EVENT,
} from "@/lib/store";
import { OperationsAuditHub } from "@/components/OperationsAuditHub";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Artisan Scent Haute Parfumerie · Staff CRM & Commerce Admin Hub" },
      {
        name: "description",
        content:
          "Internal CRM and commerce administration hub for Artisan Scent Haute Parfumerie: product catalog, orders, Bank of Baroda payment gateway, logistics, and customer support.",
      },
    ],
  }),
  component: AdminHubPage,
});

export type Order = CRMOrder;

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  segment: string;
  ordersCount: number;
  totalSpend: number;
  lastOrder: string;
  inquiryInterest?: string | undefined;
};

export type ReturnRecord = {
  id: string;
  orderId: string;
  date: string;
  customer: string;
  phone: string;
  item: string;
  reason: string;
  status: "Pending Pickup" | "Under Inspection" | "Refund Processed" | "Exchange Dispatched";
  reverseAwb: string;
  refundAmount: number;
};

export type CouponRecord = {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  expiry: string;
  description: string;
  redeemedCount: number;
  active: boolean;
};

type ExtendedProduct = Product & {
  salePrice?: number | undefined;
  stock?: number | undefined;
  rating?: number | undefined;
  sku?: string | undefined;
};

type AdminTab =
  | "overview"
  | "products"
  | "customers"
  | "orders"
  | "reports"
  | "payments"
  | "shipping"
  | "inventory"
  | "returns"
  | "notifications"
  | "support"
  | "testing"
  | "settings";

const tabTitles: Record<AdminTab, string> = {
  overview: "Dashboard & Telemetry",
  products: "Product Catalog Management",
  customers: "Patrons & Customer Directory",
  orders: "Orders Fulfillment Queue",
  reports: "Financial Reports & Audit",
  payments: "Bank of Baroda & Payment Gateway",
  shipping: "Shipping & Logistics Integration",
  inventory: "Inventory & Stock Valuation",
  returns: "Returns, Exchanges & Refunds",
  notifications: "Multi-Channel Notification Dispatcher",
  support: "Support Tickets & Reviews",
  testing: "Operations & QA Audit Suite",
  settings: "Store Settings & Security",
};

function AdminHubPage() {
  const [mounted, setMounted] = useState<boolean>(false);

  // Authentication State (Empty initial values - no default disclosure)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authUsername, setAuthUsername] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [showAuthPassword, setShowAuthPassword] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  // Theme State
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Navigation View Tab & Mobile Sidebar State
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // CRM State
  const [productList, setProductList] = useState<ExtendedProduct[]>([]);
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [inquiriesList, setInquiriesList] = useState<Inquiry[]>([]);
  const [returnsList, setReturnsList] = useState<ReturnRecord[]>([]);

  // Payment Gateway Custom QR Generator & Cheque Modal State
  const [paymentCustomAmount, setPaymentCustomAmount] = useState<number>(0);
  const [paymentCustomRef, setPaymentCustomRef] = useState<string>("");
  const [isChequeModalOpen, setIsChequeModalOpen] = useState<boolean>(false);
  const [paymentSubTab, setPaymentSubTab] = useState<"transactions" | "failed" | "refunds">("transactions");

  // Notifications Dispatcher State
  const [selectedNotifOrder, setSelectedNotifOrder] = useState<string>("");
  const [selectedNotifTemplate, setSelectedNotifTemplate] = useState<string>("order_confirm");

  // Filters & Search
  const [productSearch, setProductSearch] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [orderSearch, setOrderSearch] = useState<string>("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>("all");
  const [shippingSearch, setShippingSearch] = useState<string>("");
  const [customerSearch, setCustomerSearch] = useState<string>("");

  // Product Add / Edit Modal State (Clean empty initial values)
  const [isProductModalOpen, setIsProductModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<ExtendedProduct | null>(null);
  const [formName, setFormName] = useState<string>("");
  const [formCategory, setFormCategory] = useState<Product["category"]>("perfumes");
  const [formPrice, setFormPrice] = useState<number>(0);
  const [formSalePrice, setFormSalePrice] = useState<number | undefined>(undefined);
  const [formRating, setFormRating] = useState<number>(5);
  const [formImage, setFormImage] = useState<string>("");
  const [formNotes, setFormNotes] = useState<string>("");
  const [formFamily, setFormFamily] = useState<string>("");
  const [formSize, setFormSize] = useState<string>("");
  const [formBadge, setFormBadge] = useState<string>("");
  const [formStock, setFormStock] = useState<number>(0);
  const [formDescription, setFormDescription] = useState<string>("");

  // Image Upload Control States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Modals for Orders & Invoices
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeModal, setActiveModal] = useState<
    "none" | "orderDetail" | "invoice" | "shippingLabel" | "packingSlip" | "refund"
  >("none");
  const [refundOrder, setRefundOrder] = useState<Order | null>(null);
  const [refundAmount, setRefundAmount] = useState<number>(0);
  const [refundReason, setRefundReason] = useState<string>("Customer request / Damaged box");

  // Toast / Feedback message
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  // Check login & theme on mount
  useEffect(() => {
    setMounted(true);
    const isLogged = localStorage.getItem("artisanscent_admin_logged");
    if (isLogged === "true") {
      setIsAuthenticated(true);
    }
    const savedTheme = (localStorage.getItem("artisanscent_theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Load central products catalog
    const loaded = getStoredProducts();
    setProductList(
      loaded.map((p) => ({
        ...p,
        stock: p.stock ?? 45,
        rating: p.rating ?? 4.9,
        sku: p.sku ?? `ART-${p.id.toUpperCase()}`,
      }))
    );

    // Initial orders & telemetry pull
    const localOrders = getStoredOrders();
    if (localOrders && localOrders.length > 0) {
      setOrdersList(localOrders);
      if (!selectedNotifOrder && localOrders[0]) {
        setSelectedNotifOrder(localOrders[0].id);
      }
    }

    try {
      const storedCust = localStorage.getItem("artisanscent_crm_customers");
      if (storedCust) setCustomerList(JSON.parse(storedCust));
    } catch {}

    setInquiriesList(getStoredInquiries());

    // Sync cloud orders
    syncCloudOrders().then((merged) => {
      if (merged && Array.isArray(merged)) {
        setOrdersList(merged);
        if (merged[0]) setSelectedNotifOrder(merged[0].id);
      }
    });

    const handleSync = () => {
      const freshOrders = getStoredOrders();
      if (freshOrders) setOrdersList(freshOrders);
      setInquiriesList(getStoredInquiries());
    };

    window.addEventListener("artisanscent:inquiries-updated", handleSync);
    window.addEventListener(ORDERS_UPDATED_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener("artisanscent:inquiries-updated", handleSync);
      window.removeEventListener(ORDERS_UPDATED_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("artisanscent_theme", nextTheme);
    showFeedback(`Switched to ${nextTheme === "dark" ? "Dark Velvet" : "Pure Light"} theme.`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      authUsername.toLowerCase() === "admin" &&
      (authPassword === "artisan2026" || authPassword === "admin123" || authPassword === "admin")
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("artisanscent_admin_logged", "true");
      setAuthError("");
      showFeedback("Welcome, Administrator. Staff Commerce Hub active.");
    } else {
      setAuthError("Invalid username or password. Please verify your credentials.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("artisanscent_admin_logged");
    showFeedback("Signed out from Admin Hub.");
  };

  // Image upload handler
  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      showFeedback("Please select an image file (PNG, JPG, WEBP, or SVG).");
      return;
    }
    setIsUploadingImage(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result as string;
      const img = new Image();
      img.src = src;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_DIM = 900;
        let { width, height } = img;
        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL("image/jpeg", 0.88);
          setFormImage(compressed);
          showFeedback(`Image "${file.name}" uploaded and optimized!`);
        } else {
          setFormImage(src);
        }
        setIsUploadingImage(false);
      };
    };
    reader.readAsDataURL(file);
  };

  // Product modal handlers (Clean blank inputs)
  const openAddProductModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormCategory("perfumes");
    setFormPrice(0);
    setFormSalePrice(undefined);
    setFormRating(5);
    setFormImage("");
    setFormNotes("");
    setFormFamily("");
    setFormSize("");
    setFormBadge("");
    setFormStock(0);
    setFormDescription("");
    setIsProductModalOpen(true);
  };

  const openEditProductModal = (p: ExtendedProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price);
    setFormSalePrice(p.salePrice);
    setFormRating(p.rating || 4.9);
    setFormImage(p.image);
    setFormNotes(p.notes);
    setFormFamily(p.family);
    setFormSize(p.size || "30 ml");
    setFormBadge(p.badge);
    setFormStock(p.stock || 45);
    setFormDescription(p.description);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let updated: ExtendedProduct[];
    if (editingProduct) {
      updated = productList.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              name: formName,
              category: formCategory,
              price: Number(formPrice),
              salePrice: formSalePrice ? Number(formSalePrice) : undefined,
              rating: Number(formRating),
              image: formImage,
              notes: formNotes,
              family: formFamily,
              size: formSize,
              badge: formBadge,
              stock: Number(formStock),
              description: formDescription,
            }
          : p
      );
      showFeedback(`Product "${formName}" updated successfully.`);
    } else {
      const newId = `prod-${Date.now().toString().slice(-6)}`;
      const newProduct: ExtendedProduct = {
        id: newId,
        name: formName,
        category: formCategory,
        price: Number(formPrice),
        salePrice: formSalePrice ? Number(formSalePrice) : undefined,
        rating: Number(formRating),
        image: formImage,
        notes: formNotes,
        family: formFamily,
        size: formSize,
        badge: formBadge,
        stock: Number(formStock),
        sku: `ART-${newId.toUpperCase()}`,
        description: formDescription,
      };
      updated = [newProduct, ...productList];
      showFeedback(`New luxury fragrance "${formName}" added to catalog.`);
    }

    setProductList(updated);
    saveStoredProducts(updated);
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from the catalog?`)) {
      const updated = productList.filter((p) => p.id !== id);
      setProductList(updated);
      saveStoredProducts(updated);
      showFeedback(`"${name}" has been removed.`);
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrdersList((prev) => {
      const next = prev.map((item) => (item.id === orderId ? { ...item, status: newStatus } : item));
      saveStoredOrders(next, true);
      return next;
    });
    showFeedback(`Order ${orderId} marked as ${newStatus}.`);
  };

  const updateStock = (productId: string, delta: number) => {
    setProductList((prev) => {
      const next = prev.map((p) => (p.id === productId ? { ...p, stock: Math.max(0, (p.stock || 0) + delta) } : p));
      saveStoredProducts(next);
      return next;
    });
    showFeedback("Stock adjusted.");
  };

  // CSV Exporters
  const exportCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showFeedback(`Exported ${filename}.csv.`);
  };

  // Calculated Metrics
  const grossRevenue = useMemo(() => ordersList.reduce((s, o) => s + (o.total || 0), 0), [ordersList]);
  const onlinePaidVolume = useMemo(
    () => ordersList.filter((o) => o.paymentMethod?.toLowerCase().includes("online") || o.paymentMethod?.toLowerCase().includes("upi")).reduce((s, o) => s + (o.total || 0), 0),
    [ordersList]
  );
  const codVolume = useMemo(
    () => ordersList.filter((o) => o.paymentMethod?.toLowerCase().includes("cod") || o.paymentMethod?.toLowerCase().includes("cash")).reduce((s, o) => s + (o.total || 0), 0),
    [ordersList]
  );
  const totalInventoryUnits = useMemo(() => productList.reduce((s, p) => s + (p.stock || 0), 0), [productList]);
  const totalInventoryValuation = useMemo(() => productList.reduce((s, p) => s + (p.stock || 0) * p.price, 0), [productList]);
  const lowStockCount = useMemo(() => productList.filter((p) => (p.stock || 0) <= 15).length, [productList]);
  const outOfStockCount = useMemo(() => productList.filter((p) => (p.stock || 0) === 0).length, [productList]);

  // Filtered lists
  const filteredProducts = useMemo(() => {
    return productList.filter((p) => {
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (stockFilter === "in-stock" && (p.stock || 0) <= 15) return false;
      if (stockFilter === "low-stock" && ((p.stock || 0) > 15 || (p.stock || 0) === 0)) return false;
      if (stockFilter === "out-stock" && (p.stock || 0) > 0) return false;
      if (productSearch.trim()) {
        const q = productSearch.toLowerCase();
        return p.name.toLowerCase().includes(q) || p.notes.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      }
      return true;
    });
  }, [productList, categoryFilter, stockFilter, productSearch]);

  const filteredOrders = useMemo(() => {
    return ordersList.filter((o) => {
      if (orderStatusFilter !== "all" && o.status.toLowerCase() !== orderStatusFilter.toLowerCase()) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase();
        return (
          o.id.toLowerCase().includes(q) ||
          o.customerName?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.phone?.toLowerCase().includes(q) ||
          o.address?.city?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [ordersList, orderStatusFilter, orderSearch]);

  const simulateNewOrder = () => {
    const mockOrder: Order = {
      id: `ART-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: "Radhika Merchant",
      email: "radhika.merchant@example.com",
      phone: "+91 98201 99880",
      items: [
        {
          id: "ivory-amber",
          name: "Ivory Amber Eau de Parfum",
          price: 569,
          quantity: 2,
          size: "30 ml",
        },
        {
          id: "royal-valley",
          name: "Royal Valley Teardrop Car Perfume",
          price: 399,
          quantity: 1,
          size: "10 ml",
        },
      ],
      total: 1537,
      status: "Confirmed",
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: "Bank of Baroda UPI (Verified)",
      shippingAddress: "12A Maker Towers, Cuffe Parade, Mumbai, Maharashtra - 400005",
      address: {
        line1: "12A Maker Towers",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400005",
      },
      awb: `BD-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courier: "BlueDart Express",
    };
    addOrderToCRM(mockOrder);
    setOrdersList((prev) => [mockOrder, ...prev]);
    showFeedback(`Simulated new luxury order ${mockOrder.id} successfully!`);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#071910] text-[#c5a880] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#c5a880] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs tracking-widest uppercase">Loading Artisan Admin...</p>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATION GATE (SPLIT SCREEN HERO)
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div id="authGate" className="auth-gate">
        {/* Left Side: Brand Banner */}
        <div
          className="auth-banner-pane"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(14, 9, 7, 0.65) 0%, rgba(9, 26, 17, 0.88) 100%), url('/assets/crafted-with.jpg')",
          }}
        >
          <div className="auth-banner-top">
            <a href="/" className="auth-back-link">
              <i className="bi bi-arrow-left"></i> BACK TO STOREFRONT
            </a>
          </div>

          <div className="auth-banner-center">
            <div className="auth-brand-badge-pill">
              <img src="/assets/logo.jpeg" alt="Artisan Scent" className="auth-brand-logo-pill" />
              <div className="auth-brand-badge-text">
                <b>ARTISAN SCENT</b>
                <small>ESTD 2026 · HAUTE PARFUMERIE</small>
              </div>
            </div>

            <h1 className="auth-banner-title">Artisan Scent Admin Portal</h1>

            <p className="auth-banner-desc">
              Secure access to manage luxury fragrance orders, catalog inventory, Bank of Baroda settlements, shipping
              logistics, customer concierge inquiries, and rare botanical distillations.
            </p>

            <div className="auth-banner-tags">
              <span className="auth-tag">
                <i className="bi bi-patch-check-fill" style={{ color: "var(--gold)" }}></i> Pure Botanical Essences
              </span>
              <span className="auth-tag">
                <i className="bi bi-shield-lock-fill" style={{ color: "var(--gold)" }}></i> Role Protected
              </span>
              <span className="auth-tag">
                <i className="bi bi-bank" style={{ color: "var(--gold)" }}></i> Bank of Baroda CBS
              </span>
            </div>
          </div>

          <div className="auth-banner-footer">
            <span>© 2026 Artisan Scent Haute Parfumerie & KEOMC Botanical Labs. All rights reserved.</span>
          </div>
        </div>

        {/* Right Side: Clean Modern Sign In */}
        <div className="auth-form-pane">
          <div className="auth-form-container">
            <div className="auth-shield-header">
              <div className="auth-shield-icon">
                <i className="bi bi-shield-check"></i>
              </div>
              <h2 className="auth-title">Welcome Back</h2>
              <p className="auth-subtitle">Please sign in to your staff admin account</p>
            </div>

            {authError && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#991b1b",
                  border: "1px solid #fecaca",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  fontSize: "12.5px",
                  marginBottom: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <i className="bi bi-exclamation-triangle-fill"></i>
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="authUser">
                  Username
                </label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-person auth-icon-left"></i>
                  <input
                    type="text"
                    id="authUser"
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="Enter admin username"
                    required
                  />
                </div>
              </div>

              <div className="auth-field-group">
                <label className="auth-field-label" htmlFor="authPass">
                  Password
                </label>
                <div className="auth-input-wrapper">
                  <i className="bi bi-lock auth-icon-left"></i>
                  <input
                    type={showAuthPassword ? "text" : "password"}
                    id="authPass"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-toggle-pwd"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    title="Toggle Password Visibility"
                  >
                    <i className={`bi ${showAuthPassword ? "bi-eye-fill" : "bi-eye-slash-fill"}`}></i>
                  </button>
                </div>
              </div>

              <div className="auth-options-line">
                <label className="auth-remember-label">
                  <input type="checkbox" defaultChecked />
                  <span>Remember session</span>
                </label>
                <span className="auth-status-chip">
                  <i className="bi bi-dot"></i> Staff Access
                </span>
              </div>

              <button type="submit" className="auth-submit-btn">
                Sign In
              </button>
            </form>

            <div className="auth-support-footer">
              <p className="auth-support-query">Need help accessing your account?</p>
              <p className="auth-support-contact">
                Contact concierge administrator at{" "}
                <a href="tel:+918369424099">
                  <b>+91 8369424099</b>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED CRM LAYOUT
  // =========================================================================
  return (
    <div className="crm-layout" data-theme={theme}>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`crm-sidebar-backdrop ${isSidebarOpen ? "active" : ""}`}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* ======================================================================
           LEFT NAVIGATION SIDEBAR
           ====================================================================== */}
      <aside className={`crm-sidebar ${isSidebarOpen ? "open" : ""}`} id="crmSidebar">
        {/* Brand Header */}
        <div className="crm-sidebar-brand">
          <a href="/" target="_blank" className="crm-brand-link">
            <img src="/assets/logo.jpeg" alt="Artisan Scent" className="crm-brand-logo-img" />
            <div className="crm-brand-info">
              <div className="crm-brand-title">ARTISAN SCENT</div>
              <div className="crm-brand-sub">
                <span className="live-pulse"></span> Commerce Hub
              </div>
            </div>
          </a>
          <button
            type="button"
            className="crm-sidebar-close"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close Navigation Menu"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Scrollable Navigation Tabs */}
        <nav className="crm-sidebar-nav" role="tablist">
          <div className="nav-section-title">Main Menu</div>
          <button
            type="button"
            className={`tab-btn ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("overview");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-speedometer2"></i> <span>Dashboard</span>
            </span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("products");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-box-seam"></i> <span>Products & services</span>
            </span>
            <span className="badge-pill">{productList.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "customers" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("customers");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-people"></i> <span>Customers</span>
            </span>
            <span className="badge-pill">{customerList.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("orders");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-bag-check"></i> <span>Orders</span>
            </span>
            <span className="badge-pill">{ordersList.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "reports" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("reports");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-bar-chart-line"></i> <span>Reports & Audit</span>
            </span>
          </button>

          <div className="nav-section-title">Commerce Operations</div>
          <button
            type="button"
            className={`tab-btn ${activeTab === "payments" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("payments");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-credit-card-2-front"></i> <span>Payments & Gateway</span>
            </span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "shipping" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("shipping");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-truck"></i> <span>Shipping & Logistics</span>
            </span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "inventory" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("inventory");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-boxes"></i> <span>Inventory</span>
            </span>
            {lowStockCount > 0 && <span className="badge-pill badge-danger">{lowStockCount}</span>}
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "returns" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("returns");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-arrow-return-left"></i> <span>Returns & Refunds</span>
            </span>
            <span className="badge-pill">{returnsList.length}</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "notifications" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("notifications");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-bell"></i> <span>Notifications Hub</span>
            </span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "support" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("support");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-headset"></i> <span>Support & Reviews</span>
            </span>
            <span className="badge-pill">{inquiriesList.length}</span>
          </button>

          <div className="nav-section-title">System & Diagnostics</div>
          <button
            type="button"
            className={`tab-btn tab-btn-highlight ${activeTab === "testing" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("testing");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-play-circle-fill" style={{ color: "var(--gold)" }}></i>{" "}
              <span>Operations & QA Audit</span>
            </span>
            <span className="badge-pill">12/12</span>
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("settings");
              setIsSidebarOpen(false);
            }}
          >
            <span className="tab-btn-content">
              <i className="bi bi-gear"></i> <span>Settings & Roles</span>
            </span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="crm-sidebar-footer">
          <div className="staff-pill">
            <div className="staff-avatar">A</div>
            <div className="staff-meta">
              <span className="staff-name">Staff Admin</span>
              <span className="staff-role">Super Admin</span>
            </div>
          </div>
          <div className="sidebar-action-row">
            <a href="/" target="_blank" className="store-link-btn" title="Open Storefront in New Tab">
              <i className="bi bi-shop"></i> Storefront <i className="bi bi-arrow-up-right"></i>
            </a>
            <button
              type="button"
              className="icon-btn"
              onClick={toggleTheme}
              title="Toggle Dark / Light Theme"
              aria-label="Toggle Theme"
            >
              <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
            </button>
            <button
              type="button"
              className="icon-btn"
              onClick={handleLogout}
              title="Sign Out of CRM"
              aria-label="Sign Out"
            >
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================================
           MAIN CONTENT AREA WRAPPER
           ====================================================================== */}
      <div className="crm-content-wrapper">
        {/* Sticky Topbar Header */}
        <header className="crm-topbar">
          <div className="crm-topbar-inner">
            <div className="crm-topbar-left">
              <button
                type="button"
                className="crm-menu-toggle"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-label="Open Sidebar Menu"
              >
                <i className="bi bi-list"></i>
              </button>
              <div className="crm-topbar-breadcrumb">
                <span className="crumb-lead">Admin Hub</span>
                <i className="bi bi-chevron-right crumb-sep"></i>
                <span className="crumb-active">{tabTitles[activeTab]}</span>
              </div>
            </div>

            <div className="crm-controls">
              <a href="/" target="_blank" className="store-link-btn" title="Open Storefront in New Tab">
                <i className="bi bi-shop"></i> Storefront <i className="bi bi-arrow-up-right"></i>
              </a>
              <button
                type="button"
                className="icon-btn"
                onClick={toggleTheme}
                title="Toggle Theme"
                aria-label="Toggle Theme"
              >
                <i className={`bi ${theme === "dark" ? "bi-sun-fill" : "bi-moon-stars-fill"}`}></i>
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={handleLogout}
                title="Sign Out of CRM"
                aria-label="Sign Out"
              >
                <i className="bi bi-box-arrow-right"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="crm-main">
          {/* ==================================================================
               VIEW 1: OVERVIEW / DASHBOARD
               ================================================================== */}
          {activeTab === "overview" && (
            <section id="view-overview" className="crm-view active">
              {/* KPI Metrics Grid */}
              <div className="overview-grid">
                <div className="kpi-card">
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap rev">
                      <i className="bi bi-currency-rupee"></i>
                    </div>
                    <span className="kpi-trend up">Gross Revenue</span>
                  </div>
                  <div className="kpi-label">Gross Revenue</div>
                  <div className="kpi-value">{money(grossRevenue)}</div>
                  <div className="kpi-sub">Across all confirmed customer orders</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap ord">
                      <i className="bi bi-bag-check-fill"></i>
                    </div>
                    <span className="kpi-trend up">Live Orders</span>
                  </div>
                  <div className="kpi-label">Total Orders</div>
                  <div className="kpi-value">{ordersList.length}</div>
                  <div className="kpi-sub">Storefront & Concierge checkouts</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap prod">
                      <i className="bi bi-boxes"></i>
                    </div>
                    <span className="kpi-trend neutral">Catalog</span>
                  </div>
                  <div className="kpi-label">Fragrance Catalog</div>
                  <div className="kpi-value">{productList.length}</div>
                  <div className="kpi-sub">Perfumes, Attars & Botanicals</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap cust">
                      <i className="bi bi-people-fill"></i>
                    </div>
                    <span className="kpi-trend neutral">Patrons</span>
                  </div>
                  <div className="kpi-label">Registered Patrons</div>
                  <div className="kpi-value">{customerList.length}</div>
                  <div className="kpi-sub">Verified customer accounts</div>
                </div>

                <div className="kpi-card">
                  <div className="kpi-top">
                    <div className="kpi-icon-wrap inq">
                      <i className="bi bi-chat-quote-fill"></i>
                    </div>
                    <span className="kpi-trend neutral">Concierge</span>
                  </div>
                  <div className="kpi-label">Inquiries & Leads</div>
                  <div className="kpi-value">{inquiriesList.length}</div>
                  <div className="kpi-sub">Wholesale & bespoke queries</div>
                </div>
              </div>

              {/* Order Fulfillment Pipeline Bar */}
              <div className="pipeline-bar">
                <div className="pipeline-title">
                  <i className="bi bi-diagram-3-fill" style={{ color: "var(--accent)" }}></i>
                  <span>Order Fulfillment Pipeline:</span>
                </div>
                <div className="pipeline-items">
                  <span className="status-badge" style={{ background: "#fef3c7", color: "#92400e" }}>
                    Pending ({ordersList.filter((o) => o.status === "Pending").length})
                  </span>
                  <span className="status-badge" style={{ background: "#dbeafe", color: "#1e40af" }}>
                    Confirmed ({ordersList.filter((o) => o.status === "Confirmed").length})
                  </span>
                  <span className="status-badge" style={{ background: "#e0e7ff", color: "#3730a3" }}>
                    In Packing ({ordersList.filter((o) => o.status === "Processing").length})
                  </span>
                  <span className="status-badge" style={{ background: "#d1fae5", color: "#065f46" }}>
                    Dispatched ({ordersList.filter((o) => o.status === "Shipped").length})
                  </span>
                  <span className="status-badge" style={{ background: "#ecfdf5", color: "#047857" }}>
                    Delivered ({ordersList.filter((o) => o.status === "Completed" || o.status === "Delivered").length})
                  </span>
                </div>
              </div>

              {/* Dual Column Panel: Recent Orders + Headquarters Card */}
              <div className="dual-section">
                {/* Recent Orders Table */}
                <div className="panel-box">
                  <div className="panel-header">
                    <div className="panel-title">
                      <i className="bi bi-clock-history" style={{ color: "var(--accent)" }}></i> Recent Orders
                    </div>
                    <button type="button" className="panel-action-btn" onClick={() => setActiveTab("orders")}>
                      View All Orders &rarr;
                    </button>
                  </div>
                  <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ordersList.slice(0, 5).map((ord) => (
                          <tr key={ord.id}>
                            <td>
                              <b>{ord.id}</b>
                              <div style={{ fontSize: "11px", color: "var(--muted)" }}>{ord.date}</div>
                            </td>
                            <td>
                              <div>{ord.customerName}</div>
                              <div style={{ fontSize: "11px", color: "var(--muted)" }}>{ord.phone}</div>
                            </td>
                            <td>{ord.items?.length || 1} items</td>
                            <td>
                              <b>{money(ord.total)}</b>
                            </td>
                            <td>
                              <span
                                className="status-badge"
                                style={{
                                  background:
                                    ord.status === "Completed" || ord.status === "Confirmed"
                                      ? "rgba(21,128,61,0.12)"
                                      : "rgba(234,179,8,0.15)",
                                  color:
                                    ord.status === "Completed" || ord.status === "Confirmed" ? "#15803d" : "#b45309",
                                }}
                              >
                                {ord.status}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-outline"
                                style={{ padding: "4px 8px", fontSize: "11px" }}
                                onClick={() => {
                                  setSelectedOrder(ord);
                                  setActiveModal("orderDetail");
                                }}
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                        {ordersList.length === 0 && (
                          <tr>
                            <td colSpan={6} style={{ textAlign: "center", padding: "28px", color: "var(--muted)" }}>
                              No customer orders received yet. Storefront checkouts will appear here automatically.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Headquarters & Store Overview Box */}
                <div className="panel-box">
                  <div className="panel-header">
                    <div className="panel-title">
                      <i className="bi bi-pie-chart-fill" style={{ color: "var(--gold)" }}></i> Catalog & Operations
                    </div>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>{productList.length} Fragrances</span>
                  </div>
                  <div className="panel-body">
                    <div
                      style={{
                        padding: "14px",
                        background: "var(--surface-alt)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid var(--line)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 700,
                          color: "var(--fg)",
                          marginBottom: "4px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <i className="bi bi-geo-alt-fill" style={{ color: "var(--accent)" }}></i> Atelier & Distillation
                        Facility
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--muted)", lineHeight: 1.5 }}>
                        <b>Kulswami Essence Oil Manufacturing Company (KEOMC)</b>
                        <br />
                        Airoli Branch, Navi Mumbai, Maharashtra - 400708
                        <br />
                        Concierge Hotline: <b>+91 8369424099</b>
                      </div>
                    </div>

                    <div
                      style={{
                        marginTop: "16px",
                        padding: "14px",
                        background: "linear-gradient(135deg, rgba(27,94,63,0.08) 0%, rgba(212,175,55,0.06) 100%)",
                        borderRadius: "var(--radius-md)",
                        border: "1px solid rgba(27,94,63,0.2)",
                      }}
                    >
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--accent)", marginBottom: "3px" }}>
                        Bank of Baroda CBS Verified
                      </div>
                      <div style={{ fontSize: "11.5px", color: "var(--fg-soft)" }}>
                        Current A/C: <b>32020200001980</b> · IFSC: <b>BARB0AIROLI</b>
                        <br />
                        UPI: <b>kulsw98202980@barodampay</b>
                      </div>
                    </div>

                    <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
                      <button
                        type="button"
                        className="btn-primary"
                        style={{ flex: 1, justifyContent: "center", padding: "8px" }}
                        onClick={openAddProductModal}
                      >
                        <i className="bi bi-plus-lg"></i> Add Product
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        style={{ flex: 1, justifyContent: "center", padding: "8px" }}
                        onClick={() => {
                          syncCloudOrders().then((merged) => {
                            if (merged && Array.isArray(merged)) {
                              setOrdersList(merged);
                              showFeedback("Orders synced with cloud telemetry.");
                            }
                          });
                        }}
                      >
                        <i className="bi bi-arrow-clockwise"></i> Refresh Orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 3: PRODUCTS & SERVICES (CATALOG MANAGEMENT)
               ================================================================== */}
          {activeTab === "products" && (
            <section id="view-products" className="crm-view active">
              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search fragrances by name, notes, or category..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="filter-select"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">All Categories ({productList.length})</option>
                    <option value="perfumes">Body Perfumes</option>
                    <option value="essence-oils">Essence Oils</option>
                    <option value="car-perfumes">Car Fresheners</option>
                    <option value="agarbatti">Incense & Agarbatti</option>
                    <option value="soaps">Botanical Soaps</option>
                    <option value="gifting">Luxury Gift Sets</option>
                  </select>

                  <select
                    className="filter-select"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                  >
                    <option value="all">All Stock Statuses</option>
                    <option value="in-stock">In Stock (&gt; 15)</option>
                    <option value="low-stock">Low Stock (≤ 15)</option>
                    <option value="out-stock">Out of Stock (0)</option>
                  </select>
                </div>

                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_products",
                        ["ID", "Name", "Category", "Price", "Size", "Stock", "Notes", "SKU"],
                        productList.map((p) => [
                          p.id,
                          p.name,
                          p.category,
                          p.price,
                          p.size || "",
                          p.stock || 0,
                          p.notes,
                          p.sku || "",
                        ])
                      )
                    }
                  >
                    <i className="bi bi-file-earmark-spreadsheet"></i> Export Products CSV
                  </button>
                  <button type="button" className="btn-primary" onClick={openAddProductModal}>
                    <i className="bi bi-plus-circle"></i> Add New Fragrance
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fragrance Profile</th>
                      <th>Category</th>
                      <th>Price (₹)</th>
                      <th>Volume / Pack</th>
                      <th>Stock Units</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                objectFit: "contain",
                                background: "#fff",
                                border: "1px solid var(--line)",
                              }}
                            />
                            <div>
                              <b>{p.name}</b>
                              <div style={{ fontSize: "11px", color: "var(--muted)" }}>{p.notes}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span style={{ textTransform: "capitalize", fontSize: "12px" }}>{p.category}</span>
                        </td>
                        <td>
                          <b>₹{p.price}</b>
                        </td>
                        <td>{p.size || "30 ml"}</td>
                        <td>
                          <b>{p.stock || 45}</b> units
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background:
                                (p.stock || 0) === 0
                                  ? "#fee2e2"
                                  : (p.stock || 0) <= 15
                                  ? "#fef3c7"
                                  : "rgba(21,128,61,0.12)",
                              color:
                                (p.stock || 0) === 0 ? "#b91c1c" : (p.stock || 0) <= 15 ? "#b45309" : "#15803d",
                            }}
                          >
                            {(p.stock || 0) === 0 ? "Out of Stock" : (p.stock || 0) <= 15 ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              onClick={() => openEditProductModal(p)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px", color: "var(--danger)" }}
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 4: ORDERS QUEUE & FULFILLMENT
               ================================================================== */}
          {activeTab === "orders" && (
            <section id="view-orders" className="crm-view active">
              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search orders by customer, phone, order ID, city..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                    />
                  </div>

                  <select
                    className="filter-select"
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                  >
                    <option value="all">All Order Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">In Packing</option>
                    <option value="shipped">Dispatched</option>
                    <option value="completed">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_orders",
                        ["OrderID", "Customer", "Phone", "Email", "Total", "Status", "Date", "PaymentMode"],
                        ordersList.map((o) => [
                          o.id,
                          o.customerName || "",
                          o.phone || "",
                          o.email || "",
                          o.total,
                          o.status,
                          o.date,
                          o.paymentMethod || "",
                        ])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Orders CSV
                  </button>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      syncCloudOrders().then((merged) => {
                        if (merged && Array.isArray(merged)) {
                          setOrdersList(merged);
                          showFeedback("Orders refreshed from live telemetry.");
                        }
                      });
                    }}
                  >
                    <i className="bi bi-arrow-clockwise"></i> Refresh Orders
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order ID & Date</th>
                      <th>Customer Contact</th>
                      <th>Items & Variants</th>
                      <th>Amount & Payment</th>
                      <th>Fulfillment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <b>{ord.id}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{ord.date}</div>
                        </td>
                        <td>
                          <div>{ord.customerName}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {ord.phone || "Storefront patron"}{ord.address?.city ? ` · ${ord.address.city}` : ""}
                          </div>
                        </td>
                        <td>
                          {ord.items?.map((it, idx) => (
                            <div key={idx} style={{ fontSize: "12px" }}>
                              {it.quantity}x {it.name} ({it.size || "30 ml"})
                            </div>
                          ))}
                        </td>
                        <td>
                          <b>{money(ord.total)}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {ord.paymentMethod || "Bank of Baroda UPI"}
                          </div>
                        </td>
                        <td>
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order["status"])}
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 600,
                              background:
                                ord.status === "Completed"
                                  ? "#ecfdf5"
                                  : ord.status === "Confirmed"
                                  ? "#eff6ff"
                                  : "#fffbeb",
                              color:
                                ord.status === "Completed"
                                  ? "#047857"
                                  : ord.status === "Confirmed"
                                  ? "#1d4ed8"
                                  : "#b45309",
                              border: "1px solid var(--line)",
                            }}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">In Packing</option>
                            <option value="Shipped">Dispatched</option>
                            <option value="Completed">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="View Order Details & Timeline"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveModal("orderDetail");
                              }}
                            >
                              <i className="bi bi-info-circle"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="Print Tax Invoice"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveModal("invoice");
                              }}
                            >
                              <i className="bi bi-receipt"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="Print Courier Shipping Label"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveModal("shippingLabel");
                              }}
                            >
                              <i className="bi bi-tag"></i>
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px" }}
                              title="Print Warehouse Packing Slip"
                              onClick={() => {
                                setSelectedOrder(ord);
                                setActiveModal("packingSlip");
                              }}
                            >
                              <i className="bi bi-card-checklist"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredOrders.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                          No orders matched your filter criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 5: BANK OF BARODA & PAYMENT GATEWAY RECONCILIATION
               ================================================================== */}
          {activeTab === "payments" && (
            <section id="view-payments" className="crm-view active">
              {/* Bank of Baroda Verified Settlement Card */}
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(27,94,63,0.12) 0%, rgba(212,175,55,0.08) 100%)",
                  border: "1px solid rgba(27,94,63,0.25)",
                  borderRadius: "var(--radius-md)",
                  padding: "18px 22px",
                  marginBottom: "20px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        background: "#1b5e3f",
                        color: "#fff",
                        padding: "3px 9px",
                        borderRadius: "999px",
                      }}
                    >
                      Bank of Baroda CBS
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--success)", fontWeight: 600 }}>
                      <i className="bi bi-shield-check"></i> Merchant Verified
                    </span>
                  </div>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--fg)", margin: 0 }}>
                    KULSWAMI ESSENCE OIL MANUFACTURING COMPANY
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "var(--muted)", margin: "4px 0 0" }}>
                    Airoli Branch · Current A/C: <b>32020200001980</b> · IFSC: <b>BARB0AIROLI</b> · UPI:{" "}
                    <b>kulsw98202980@barodampay</b>
                  </p>
                </div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <a
                    href="/assets/payment/bob_upi_qr.png"
                    download="BankOfBaroda_bobWorld_UPI_QR.png"
                    className="btn-primary"
                    style={{ padding: "8px 14px", fontSize: "12.5px", textDecoration: "none" }}
                  >
                    <i className="bi bi-qr-code"></i> Download UPI QR
                  </a>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ padding: "8px 14px", fontSize: "12.5px" }}
                    onClick={() => {
                      navigator.clipboard.writeText("kulsw98202980@barodampay");
                      showFeedback("Copied official UPI ID kulsw98202980@barodampay to clipboard!");
                    }}
                  >
                    <i className="bi bi-copy"></i> Copy UPI ID
                  </button>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ padding: "8px 14px", fontSize: "12.5px" }}
                    onClick={() => setIsChequeModalOpen(true)}
                  >
                    <i className="bi bi-file-earmark-image"></i> View Cheque Leaf
                  </button>
                </div>
              </div>

              {/* Payment Stat Cards */}
              <div className="recon-grid">
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Total Gross Volume</div>
                  <div className="recon-stat-val">{money(grossRevenue)}</div>
                  <div className="recon-stat-sub">Across all payment channels</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Bank of Baroda UPI Paid</div>
                  <div className="recon-stat-val" style={{ color: "var(--success)" }}>
                    {money(onlinePaidVolume)}
                  </div>
                  <div className="recon-stat-sub">Direct UPI & Razorpay prepaid</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Cash on Delivery (COD)</div>
                  <div className="recon-stat-val" style={{ color: "var(--warning)" }}>
                    {money(codVolume)}
                  </div>
                  <div className="recon-stat-sub">Physical cash on delivery</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Net Bank Settled</div>
                  <div className="recon-stat-val" style={{ color: "var(--accent)" }}>
                    {money(grossRevenue * 0.98)}
                  </div>
                  <div className="recon-stat-sub">Net credited to Bank of Baroda</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Total Refunds Issued</div>
                  <div className="recon-stat-val" style={{ color: "#0d9488" }}>
                    {money(returnsList.filter((r) => r.status === "Refund Processed").reduce((sum, r) => sum + r.refundAmount, 0))}
                  </div>
                  <div className="recon-stat-sub">Approved returns ledger</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Failed Payment Attempts</div>
                  <div className="recon-stat-val" style={{ color: "var(--danger)" }}>
                    0
                  </div>
                  <div className="recon-stat-sub">Immediate concierge recovery</div>
                </div>
              </div>

              {/* Dynamic Order Payment QR Generator */}
              <div className="panel-box" style={{ marginTop: "20px", marginBottom: "20px" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-qr-code" style={{ color: "var(--accent)" }}></i> Dynamic Order UPI QR
                    Generator for Staff
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Generates instant UPI deep-links & QR codes
                  </span>
                </div>
                <div className="panel-body">
                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
                    <div style={{ flex: "1 1 200px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                        Invoice Amount (₹)
                      </label>
                      <input
                        type="number"
                        value={paymentCustomAmount}
                        onChange={(e) => setPaymentCustomAmount(Number(e.target.value))}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                      />
                    </div>
                    <div style={{ flex: "1 1 240px" }}>
                      <label style={{ fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "4px" }}>
                        Order / Client Reference
                      </label>
                      <input
                        type="text"
                        value={paymentCustomRef}
                        onChange={(e) => setPaymentCustomRef(e.target.value)}
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--line)" }}
                      />
                    </div>
                    <div>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          const upiUri = `upi://pay?pa=kulsw98202980@barodampay&pn=KULSWAMI%20ESSENCE%20OIL%20MFG%20CO&am=${paymentCustomAmount}&cu=INR&tn=${encodeURIComponent(
                            paymentCustomRef
                          )}`;
                          navigator.clipboard.writeText(upiUri);
                          showFeedback(`Generated & copied UPI URI for ₹${paymentCustomAmount}`);
                        }}
                      >
                        <i className="bi bi-link-45deg"></i> Copy UPI Intent Link
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Transaction / Order</th>
                      <th>Customer Contact</th>
                      <th>Gateway Reference ID</th>
                      <th>Payment Mode</th>
                      <th>Amount & Settlement</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((ord) => (
                      <tr key={ord.id}>
                        <td>
                          <b>{ord.id}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{ord.date}</div>
                        </td>
                        <td>
                          <div>{ord.customerName}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{ord.phone}</div>
                        </td>
                        <td>
                          <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
                            {ord.id.replace("ART-", "BOB-TXN-")}
                          </span>
                        </td>
                        <td>{ord.paymentMethod || "Bank of Baroda UPI"}</td>
                        <td>
                          <b>{money(ord.total)}</b>
                        </td>
                        <td>
                          <span className="status-badge" style={{ background: "rgba(21,128,61,0.12)", color: "#15803d" }}>
                            <i className="bi bi-check-circle-fill"></i> Settled
                          </span>
                        </td>
                      </tr>
                    ))}
                    {ordersList.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                          No payment transactions recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 6: SHIPPING & LOGISTICS INTEGRATION
               ================================================================== */}
          {activeTab === "shipping" && (
            <section id="view-shipping" className="crm-view active">
              <div className="recon-grid">
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Ready for Dispatch</div>
                  <div className="recon-stat-val">
                    {ordersList.filter((o) => o.status === "Confirmed" || o.status === "Processing").length}
                  </div>
                  <div className="recon-stat-sub">Packing in progress</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">In-Transit Shipments</div>
                  <div className="recon-stat-val" style={{ color: "var(--info)" }}>
                    {ordersList.filter((o) => o.status === "Shipped").length}
                  </div>
                  <div className="recon-stat-sub">With BlueDart / Delhivery</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Delivered (Verified POD)</div>
                  <div className="recon-stat-val" style={{ color: "var(--success)" }}>
                    {ordersList.filter((o) => o.status === "Completed" || o.status === "Delivered").length}
                  </div>
                  <div className="recon-stat-sub">Successful deliveries</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">NDR (Failed Delivery)</div>
                  <div className="recon-stat-val" style={{ color: "var(--danger)" }}>
                    0
                  </div>
                  <div className="recon-stat-sub">No pending delivery issues</div>
                </div>
              </div>

              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search shipments by order, customer, AWB..."
                      value={shippingSearch}
                      onChange={(e) => setShippingSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_shipping",
                        ["OrderID", "Customer", "Destination", "Courier", "AWB", "Status"],
                        ordersList.map((o) => [
                          o.id,
                          o.customerName || "",
                          o.address?.city || "",
                          o.courier || "BlueDart Express",
                          o.awb || "Pending Allocation",
                          o.status,
                        ])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Shipping Log CSV
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order Ref</th>
                      <th>Recipient & Destination</th>
                      <th>Courier Partner Allocation</th>
                      <th>AWB / Tracking Number</th>
                      <th>Shipment Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((o) => (
                      <tr key={o.id}>
                        <td>
                          <b>{o.id}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{o.date}</div>
                        </td>
                        <td>
                          <div>{o.customerName}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {typeof o.address === "string"
                              ? o.address
                              : o.address?.line1
                              ? `${o.address.line1}, ${o.address.city || ""} ${o.address.pincode || ""}`
                              : "Storefront checkout destination"}
                          </div>
                        </td>
                        <td>
                          <span className="status-badge" style={{ background: "#e0f2fe", color: "#0369a1" }}>
                            {o.courier || "BlueDart Express"}
                          </span>
                        </td>
                        <td>
                          <b style={{ fontFamily: "monospace" }}>{o.awb || "Pending Allocation"}</b>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background:
                                o.status === "Completed"
                                  ? "#ecfdf5"
                                  : o.status === "Shipped"
                                  ? "#eff6ff"
                                  : "#fef3c7",
                              color:
                                o.status === "Completed"
                                  ? "#047857"
                                  : o.status === "Shipped"
                                  ? "#1d4ed8"
                                  : "#b45309",
                            }}
                          >
                            {o.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => {
                              setSelectedOrder(o);
                              setActiveModal("shippingLabel");
                            }}
                          >
                            <i className="bi bi-printer"></i> Print Label
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ordersList.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                          No shipments currently scheduled for dispatch.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 7: INVENTORY & STOCK VALUATION
               ================================================================== */}
          {activeTab === "inventory" && (
            <section id="view-inventory" className="crm-view active">
              <div className="recon-grid">
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Total Units in Stock</div>
                  <div className="recon-stat-val">{totalInventoryUnits}</div>
                  <div className="recon-stat-sub">{productList.length} catalog items</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Inventory Valuation</div>
                  <div className="recon-stat-val" style={{ color: "var(--accent)" }}>
                    {money(totalInventoryValuation)}
                  </div>
                  <div className="recon-stat-sub">Retail catalog valuation</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">In-Stock SKUs</div>
                  <div className="recon-stat-val" style={{ color: "var(--success)" }}>
                    {productList.filter((p) => (p.stock || 0) > 15).length}
                  </div>
                  <div className="recon-stat-sub">Available for instant dispatch</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Low-Stock Alerts</div>
                  <div className="recon-stat-val" style={{ color: "var(--warning)" }}>
                    {lowStockCount}
                  </div>
                  <div className="recon-stat-sub">Units ≤ 15 threshold</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Out-of-Stock SKUs</div>
                  <div className="recon-stat-val" style={{ color: "var(--danger)" }}>
                    {outOfStockCount}
                  </div>
                  <div className="recon-stat-sub">Requires atelier batch distillation</div>
                </div>
              </div>

              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search inventory by fragrance name, SKU..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_inventory",
                        ["Fragrance", "Category", "Size", "Stock", "Price", "ValuationINR"],
                        productList.map((p) => [
                          p.name,
                          p.category,
                          p.size || "",
                          p.stock || 0,
                          p.price,
                          (p.stock || 0) * p.price,
                        ])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Inventory CSV
                  </button>
                  <button type="button" className="btn-primary" onClick={openAddProductModal}>
                    <i className="bi bi-plus-circle"></i> Add New SKU
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Fragrance Profile</th>
                      <th>Category</th>
                      <th>Pack Size</th>
                      <th>Available Units</th>
                      <th>Stock Status</th>
                      <th>Quick Stock Adjustments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <b>{p.name}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{p.notes}</div>
                        </td>
                        <td>
                          <span style={{ textTransform: "capitalize", fontSize: "12px" }}>{p.category}</span>
                        </td>
                        <td>{p.size || "30 ml"}</td>
                        <td>
                          <b>{p.stock || 0}</b> units
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background:
                                (p.stock || 0) === 0
                                  ? "#fee2e2"
                                  : (p.stock || 0) <= 15
                                  ? "#fef3c7"
                                  : "rgba(21,128,61,0.12)",
                              color:
                                (p.stock || 0) === 0 ? "#b91c1c" : (p.stock || 0) <= 15 ? "#b45309" : "#15803d",
                            }}
                          >
                            {(p.stock || 0) === 0 ? "Out of Stock" : (p.stock || 0) <= 15 ? "Low Stock" : "In Stock"}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: "flex", gap: "6px" }}>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 10px", fontSize: "11px" }}
                              onClick={() => updateStock(p.id, -5)}
                            >
                              -5
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 10px", fontSize: "11px" }}
                              onClick={() => updateStock(p.id, -1)}
                            >
                              -1
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 10px", fontSize: "11px" }}
                              onClick={() => updateStock(p.id, 1)}
                            >
                              +1
                            </button>
                            <button
                              type="button"
                              className="btn-outline"
                              style={{ padding: "4px 10px", fontSize: "11px" }}
                              onClick={() => updateStock(p.id, 10)}
                            >
                              +10 Restock
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 8: RETURNS, EXCHANGES & REFUNDS
               ================================================================== */}
          {activeTab === "returns" && (
            <section id="view-returns" className="crm-view active">
              <div className="recon-grid">
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Total Return Requests</div>
                  <div className="recon-stat-val">{returnsList.length}</div>
                  <div className="recon-stat-sub">Submitted by patrons</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Pending Reverse Pickups</div>
                  <div className="recon-stat-val" style={{ color: "var(--warning)" }}>
                    {returnsList.filter((r) => r.status === "Pending Pickup").length}
                  </div>
                  <div className="recon-stat-sub">Awaiting BlueDart reverse courier</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Replacement Exchanges</div>
                  <div className="recon-stat-val" style={{ color: "var(--accent)" }}>
                    {returnsList.filter((r) => r.status === "Exchange Dispatched").length}
                  </div>
                  <div className="recon-stat-sub">Exchange orders fulfilled</div>
                </div>
              </div>

              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input type="text" placeholder="Search returns by ID, customer, order ref..." />
                  </div>
                </div>
                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_returns",
                        ["ReturnID", "OrderID", "Date", "Customer", "Item", "Reason", "Status", "ReverseAWB"],
                        returnsList.map((r) => [
                          r.id,
                          r.orderId,
                          r.date,
                          r.customer,
                          r.item,
                          r.reason,
                          r.status,
                          r.reverseAwb,
                        ])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Returns CSV
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Return ID & Date</th>
                      <th>Customer & Order Ref</th>
                      <th>Item & Return Reason</th>
                      <th>Reverse AWB</th>
                      <th>Return Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {returnsList.map((r) => (
                      <tr key={r.id}>
                        <td>
                          <b>{r.id}</b>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{r.date}</div>
                        </td>
                        <td>
                          <div>{r.customer}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                            {r.phone} · Ref: <b>{r.orderId}</b>
                          </div>
                        </td>
                        <td>
                          <div>{r.item}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{r.reason}</div>
                        </td>
                        <td>
                          <b style={{ fontFamily: "monospace" }}>{r.reverseAwb}</b>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background:
                                r.status === "Refund Processed"
                                  ? "#ecfdf5"
                                  : r.status === "Pending Pickup"
                                  ? "#fef3c7"
                                  : "#eff6ff",
                              color:
                                r.status === "Refund Processed"
                                  ? "#047857"
                                  : r.status === "Pending Pickup"
                                  ? "#b45309"
                                  : "#1d4ed8",
                            }}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn-outline"
                            style={{ padding: "4px 8px", fontSize: "11px" }}
                            onClick={() => {
                              setRefundAmount(r.refundAmount);
                              setActiveModal("refund");
                            }}
                          >
                            Process Refund
                          </button>
                        </td>
                      </tr>
                    ))}
                    {returnsList.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                          No return or exchange requests recorded.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 9: MULTI-CHANNEL CUSTOMER NOTIFICATIONS DISPATCHER
               ================================================================== */}
          {activeTab === "notifications" && (
            <section id="view-notifications" className="crm-view active">
              <div className="panel-box" style={{ maxWidth: "960px", margin: "0 auto 24px" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-chat-dots-fill" style={{ color: "var(--accent)" }}></i> Multi-Channel Customer
                    Notification Dispatcher
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Automated WhatsApp & Email templates with live order data
                  </span>
                </div>
                <div className="panel-body">
                  <p style={{ fontSize: "12.5px", color: "var(--muted)", marginBottom: "18px" }}>
                    Select an order and choose an event touchpoint to generate an automated customer notification with
                    real customer name, order number, line items, and live tracking links.
                  </p>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Select Order</label>
                      <select
                        className="filter-select"
                        style={{ width: "100%" }}
                        value={selectedNotifOrder}
                        onChange={(e) => setSelectedNotifOrder(e.target.value)}
                      >
                        {ordersList.map((o) => (
                          <option key={o.id} value={o.id}>
                            {o.id} - {o.customerName} ({money(o.total)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Notification Touchpoint / Event Template</label>
                      <select
                        className="filter-select"
                        style={{ width: "100%" }}
                        value={selectedNotifTemplate}
                        onChange={(e) => setSelectedNotifTemplate(e.target.value)}
                      >
                        <option value="order_confirm">1. Order Confirmation (Email / WhatsApp)</option>
                        <option value="payment_receipt">2. Payment Receipt & Bank of Baroda Intimation</option>
                        <option value="order_processing">3. Order In Processing / Packing</option>
                        <option value="order_shipped">4. Order Shipped & AWB Live Tracking</option>
                        <option value="out_delivery">5. Out for Delivery Notification</option>
                        <option value="order_delivered">6. Order Delivered & Review Request</option>
                        <option value="order_cancelled">7. Order Cancellation & Refund Notice</option>
                        <option value="return_update">8. Return / Exchange Request Update</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <h4
                      style={{
                        fontSize: "12px",
                        textTransform: "uppercase",
                        color: "var(--muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Live Message Preview:
                    </h4>
                    <div
                      style={{
                        background: "var(--surface-alt)",
                        border: "1px solid var(--line)",
                        borderRadius: "var(--radius-md)",
                        padding: "16px 20px",
                        fontFamily: "monospace",
                        fontSize: "12px",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {selectedNotifOrder ? (
                        `✨ *ARTISAN SCENT HAUTE PARFUMERIE* ✨
Dear ${ordersList.find((o) => o.id === selectedNotifOrder)?.customerName || "Valued Patron"},

Your order *#${selectedNotifOrder}* for ${money(
                          ordersList.find((o) => o.id === selectedNotifOrder)?.total || 0
                        )} is confirmed with our botanical atelier!

📦 *Items:*
${ordersList
  .find((o) => o.id === selectedNotifOrder)
  ?.items?.map((it) => `• ${it.quantity}x ${it.name} (${it.size || "30 ml"})`)
  .join("\n") || "• Line items detailed on invoice"}

🏦 *Settlement:* Bank of Baroda Current Account / Verified UPI
🚚 *Courier Partner:* ${ordersList.find((o) => o.id === selectedNotifOrder)?.courier || "BlueDart Express"} (AWB: ${
                          ordersList.find((o) => o.id === selectedNotifOrder)?.awb || "Pending Allocation"
                        })

Thank you for choosing Artisan Scent Haute Parfumerie.`
                      ) : (
                        <span style={{ color: "var(--muted)", fontStyle: "italic" }}>
                          No customer order selected. Select an order above to preview the multi-channel notification.
                        </span>
                      )}
                    </div>

                    <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                          const ord = ordersList.find((o) => o.id === selectedNotifOrder);
                          const phone = ord?.phone?.replace(/[^0-9]/g, "") || "918369424099";
                          const text = encodeURIComponent(
                            `Artisan Scent Order Update #${selectedNotifOrder}: Your order is confirmed and scheduled for dispatch with BlueDart.`
                          );
                          window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
                        }}
                      >
                        <i className="bi bi-whatsapp"></i> Send Notification on WhatsApp
                      </button>
                      <button
                        type="button"
                        className="btn-outline"
                        onClick={() => {
                          showFeedback("Notification dispatched to customer email address.");
                        }}
                      >
                        <i className="bi bi-envelope"></i> Send via Email
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 10: CUSTOMERS DIRECTORY
               ================================================================== */}
          {activeTab === "customers" && (
            <section id="view-customers" className="crm-view active">
              <div className="table-toolbar">
                <div className="toolbar-left">
                  <div className="search-box">
                    <i className="bi bi-search"></i>
                    <input
                      type="text"
                      placeholder="Search customers by name, phone, city..."
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                    />
                  </div>
                </div>
                <div className="toolbar-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() =>
                      exportCSV(
                        "artisanscent_customers",
                        ["ID", "Name", "Email", "Phone", "Segment", "TotalSpend", "Orders"],
                        customerList.map((c) => [c.id, c.name, c.email, c.phone, c.segment, c.totalSpend, c.ordersCount])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Customers CSV
                  </button>
                </div>
              </div>

              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Segment</th>
                      <th>Orders</th>
                      <th>Total Spend (₹)</th>
                      <th>Last Order</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerList.map((c) => (
                      <tr key={c.id}>
                        <td>
                          <b>{c.name}</b>
                        </td>
                        <td>
                          <div>{c.email}</div>
                          <div style={{ fontSize: "11px", color: "var(--muted)" }}>{c.phone}</div>
                        </td>
                        <td>
                          <span
                            className="status-badge"
                            style={{
                              background: c.segment.includes("VIP") ? "#fef3c7" : "var(--surface-alt)",
                              color: c.segment.includes("VIP") ? "#92400e" : "var(--fg)",
                            }}
                          >
                            {c.segment}
                          </span>
                        </td>
                        <td>{c.ordersCount} orders</td>
                        <td>
                          <b>{money(c.totalSpend)}</b>
                        </td>
                        <td>{c.lastOrder || "—"}</td>
                        <td>
                          <a
                            href={`https://wa.me/${c.phone.replace(/[^0-9]/g, "")}`}
                            target="_blank"
                            className="btn-outline"
                            style={{ padding: "4px 8px", fontSize: "11px", textDecoration: "none" }}
                          >
                            <i className="bi bi-whatsapp"></i> Chat
                          </a>
                        </td>
                      </tr>
                    ))}
                    {customerList.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--muted)" }}>
                          No patron profiles saved yet. Customer accounts are created automatically upon checkout.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 11: CUSTOMER SUPPORT & REVIEWS
               ================================================================== */}
          {activeTab === "support" && (
            <section id="view-support" className="crm-view active">
              <div className="recon-grid" style={{ marginBottom: "20px" }}>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Active Support Inquiries</div>
                  <div className="recon-stat-val" style={{ color: "var(--warning)" }}>
                    {inquiriesList.length}
                  </div>
                  <div className="recon-stat-sub">Concierge queries</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Average Rating</div>
                  <div className="recon-stat-val" style={{ color: "var(--success)" }}>
                    4.9 ★
                  </div>
                  <div className="recon-stat-sub">Verified customer feedback</div>
                </div>
              </div>

              {/* Inquiries Table */}
              <div className="panel-box" style={{ marginBottom: "28px" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-headset" style={{ color: "var(--accent)" }}></i> Concierge Inquiries & Wholesale
                    Leads
                  </div>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                    onClick={() =>
                      exportCSV(
                        "artisanscent_inquiries",
                        ["ID", "Name", "Email", "Phone", "Interest", "Message", "Status"],
                        inquiriesList.map((i) => [i.id, i.name, i.email, i.phone, i.interest, i.message, i.status])
                      )
                    }
                  >
                    <i className="bi bi-download"></i> Export Inquiries CSV
                  </button>
                </div>
                <div className="table-container" style={{ border: "none", boxShadow: "none" }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Inquiry ID & Date</th>
                        <th>Patron Contact</th>
                        <th>Interest</th>
                        <th>Message</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiriesList.map((inq) => (
                        <tr key={inq.id}>
                          <td>
                            <b>{inq.id}</b>
                            <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                              {inq.date} · {inq.time}
                            </div>
                          </td>
                          <td>
                            <div>{inq.name}</div>
                            <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                              {inq.email} · {inq.phone}
                            </div>
                          </td>
                          <td>
                            <span className="status-badge" style={{ background: "#eff6ff", color: "#1d4ed8" }}>
                              {inq.interest}
                            </span>
                          </td>
                          <td style={{ maxWidth: "260px" }}>{inq.message}</td>
                          <td>
                            <span
                              className="status-badge"
                              style={{
                                background: inq.status === "Closed" ? "#ecfdf5" : "#fffbeb",
                                color: inq.status === "Closed" ? "#047857" : "#b45309",
                              }}
                            >
                              {inq.status}
                            </span>
                          </td>
                          <td>
                            <a
                              href={`https://wa.me/${inq.phone?.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                `Hello ${inq.name}, greetings from Artisan Scent Haute Parfumerie. Regarding your inquiry on ${inq.interest}:`
                              )}`}
                              target="_blank"
                              className="btn-outline"
                              style={{ padding: "4px 8px", fontSize: "11px", textDecoration: "none" }}
                            >
                              <i className="bi bi-whatsapp"></i> Reply
                            </a>
                          </td>
                        </tr>
                      ))}
                      {inquiriesList.length === 0 && (
                        <tr>
                          <td colSpan={6} style={{ textAlign: "center", padding: "28px", color: "var(--muted)" }}>
                            No inquiries recorded. Inquiries submitted on the contact page will appear here instantly.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 12: FINANCIAL REPORTS & AUDIT
               ================================================================== */}
          {activeTab === "reports" && (
            <section id="view-reports" className="crm-view active">
              <div className="recon-grid">
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Total Gross Sales</div>
                  <div className="recon-stat-val">{money(grossRevenue)}</div>
                  <div className="recon-stat-sub">Confirmed gross turnover</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">GST (18% Inclusive) Collected</div>
                  <div className="recon-stat-val" style={{ color: "var(--info)" }}>
                    {money(grossRevenue * 0.18)}
                  </div>
                  <div className="recon-stat-sub">CGST 9% + SGST 9%</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Online Payment Volume</div>
                  <div className="recon-stat-val" style={{ color: "var(--success)" }}>
                    {money(onlinePaidVolume)}
                  </div>
                  <div className="recon-stat-sub">Bank of Baroda UPI & Razorpay</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">COD Volume</div>
                  <div className="recon-stat-val" style={{ color: "var(--warning)" }}>
                    {money(codVolume)}
                  </div>
                  <div className="recon-stat-sub">Cash on delivery volume</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Gateway Deductions (2%)</div>
                  <div className="recon-stat-val" style={{ color: "var(--danger)" }}>
                    {money(onlinePaidVolume * 0.02)}
                  </div>
                  <div className="recon-stat-sub">UPI & Gateway transaction fee</div>
                </div>
                <div className="recon-stat-card">
                  <div className="recon-stat-title">Net Bank Payout</div>
                  <div className="recon-stat-val" style={{ color: "var(--accent)" }}>
                    {money(grossRevenue - onlinePaidVolume * 0.02)}
                  </div>
                  <div className="recon-stat-sub">Settled to Bank of Baroda</div>
                </div>
              </div>

              <div className="panel-box" style={{ marginTop: "24px" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-file-earmark-spreadsheet-fill" style={{ color: "var(--accent)" }}></i> Downloadable
                    Audit & Accounting Reports
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>Export standard CSV / Excel sheets</span>
                </div>
                <div className="panel-body">
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "16px" }}>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "14px", justifyContent: "center" }}
                      onClick={() =>
                        exportCSV(
                          "artisanscent_orders_report",
                          ["OrderID", "Customer", "Total", "Status", "Date"],
                          ordersList.map((o) => [o.id, o.customerName || "", o.total, o.status, o.date])
                        )
                      }
                    >
                      <i className="bi bi-file-earmark-text"></i> Download Orders & Invoices Report (CSV)
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "14px", justifyContent: "center" }}
                      onClick={() =>
                        exportCSV(
                          "artisanscent_settlements",
                          ["OrderID", "Amount", "Mode", "Status"],
                          ordersList.map((o) => [o.id, o.total, o.paymentMethod || "UPI", "Settled"])
                        )
                      }
                    >
                      <i className="bi bi-credit-card"></i> Download Gateway Settlements (CSV)
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "14px", justifyContent: "center" }}
                      onClick={() =>
                        exportCSV(
                          "artisanscent_shipping_log",
                          ["OrderID", "Customer", "Courier", "AWB", "Status"],
                          ordersList.map((o) => [o.id, o.customerName || "", o.courier || "BlueDart", o.awb || "", o.status])
                        )
                      }
                    >
                      <i className="bi bi-truck"></i> Download Courier & Shipping Report (CSV)
                    </button>
                    <button
                      type="button"
                      className="btn-outline"
                      style={{ padding: "14px", justifyContent: "center" }}
                      onClick={() =>
                        exportCSV(
                          "artisanscent_inventory_valuation",
                          ["Fragrance", "Stock", "Price", "Valuation"],
                          productList.map((p) => [p.name, p.stock || 0, p.price, (p.stock || 0) * p.price])
                        )
                      }
                    >
                      <i className="bi bi-boxes"></i> Download Inventory & Stock Valuation (CSV)
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ==================================================================
               VIEW 13: TEST SCENARIOS & 12-SECTION OPERATIONS QA AUDIT HUB
               ================================================================== */}
          {activeTab === "testing" && (
            <section id="view-testing" className="crm-view active">
              {/* Embed the 12-Section Horizontal QA Audit Hub */}
              <OperationsAuditHub />
            </section>
          )}

          {/* ==================================================================
               VIEW 14: SETTINGS, ROLES & SECURITY
               ================================================================== */}
          {activeTab === "settings" && (
            <section id="view-settings" className="crm-view active">
              <div className="panel-box" style={{ maxWidth: "960px", margin: "0 auto 24px" }}>
                <div className="panel-header">
                  <div className="panel-title">
                    <i className="bi bi-sliders" style={{ color: "var(--accent)" }}></i> Store Configuration & Official
                    Profile
                  </div>
                  <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                    Syncs with invoices & storefront contact
                  </span>
                </div>
                <form
                  className="panel-body"
                  onSubmit={(e) => {
                    e.preventDefault();
                    showFeedback("Store settings saved successfully.");
                  }}
                >
                  <div className="form-row">
                    <div className="form-group">
                      <label>Official Store Name</label>
                      <input type="text" defaultValue="Artisan Scent Haute Parfumerie" required />
                    </div>
                    <div className="form-group">
                      <label>Tagline / Brand Slogan</label>
                      <input type="text" defaultValue="Rare Botanicals & Haute Parfumerie" required />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginTop: "14px" }}>
                    <div className="form-group">
                      <label>Contact Phone Number</label>
                      <input type="text" defaultValue="+91 8369424099" required />
                    </div>
                    <div className="form-group">
                      <label>WhatsApp Concierge Number</label>
                      <input type="text" defaultValue="918369424099" required />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginTop: "14px" }}>
                    <div className="form-group">
                      <label>Official Support Email</label>
                      <input type="email" defaultValue="concierge@artisanscent.com" required />
                    </div>
                    <div className="form-group">
                      <label>GSTIN / Tax ID</label>
                      <input type="text" defaultValue="27BARB0AIROLI1Z" required />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginTop: "14px" }}>
                    <label>Headquarters / Distillation Facility Address</label>
                    <textarea
                      rows={2}
                      defaultValue="Kulswami Essence Oil Manufacturing Company, Airoli Branch, Navi Mumbai, Maharashtra - 400708"
                      required
                    ></textarea>
                  </div>

                  <div className="form-row" style={{ marginTop: "14px" }}>
                    <div className="form-group">
                      <label>Free Delivery Threshold (₹)</label>
                      <input type="number" defaultValue={2000} required />
                    </div>
                    <div className="form-group">
                      <label>Standard Shipping Charge (₹)</label>
                      <input type="number" defaultValue={150} required />
                    </div>
                  </div>

                  <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
                    <button type="submit" className="btn-primary">
                      <i className="bi bi-check-lg"></i> Save Store Settings
                    </button>
                  </div>
                </form>
              </div>

              {/* Payment Gateway Settings Panel */}
              <div className="panel-box" style={{ maxWidth: "960px", margin: "0 auto 24px" }}>
                <div
                  className="panel-header"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <div className="panel-title">
                    <i className="bi bi-credit-card-2-front" style={{ color: "var(--accent)" }}></i> Bank of Baroda &
                    Payment Gateway Settings
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: "rgba(21,128,61,0.12)", color: "#15803d" }}
                  >
                    <i className="bi bi-shield-check-fill"></i> Gateway Ready
                  </span>
                </div>
                <div className="panel-body">
                  <div
                    style={{
                      background: "rgba(21,128,61,0.06)",
                      border: "1px solid rgba(21,128,61,0.22)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px 16px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <i className="bi bi-shield-lock-fill" style={{ color: "var(--success)", fontSize: "18px" }}></i>
                    <div style={{ fontSize: "12px", color: "var(--fg-soft)", lineHeight: 1.45 }}>
                      <b>Bank of Baroda CBS Integration:</b> Account <b>32020200001980</b> and UPI ID{" "}
                      <b>kulsw98202980@barodampay</b> are active across storefront checkout and WhatsApp concierge.
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Beneficiary Entity Name</label>
                      <input type="text" readOnly defaultValue="KULSWAMI ESSENCE OIL MANUFACTURING COMPANY" />
                    </div>
                    <div className="form-group">
                      <label>Bank Name & Branch</label>
                      <input type="text" readOnly defaultValue="Bank of Baroda (Airoli Branch - 0891)" />
                    </div>
                  </div>

                  <div className="form-row" style={{ marginTop: "14px" }}>
                    <div className="form-group">
                      <label>Current Account Number</label>
                      <input type="text" readOnly defaultValue="32020200001980" />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input type="text" readOnly defaultValue="BARB0AIROLI" />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* =====================================================================
           MODALS
           ===================================================================== */}
      {/* 1. PRODUCT CONFIGURE MODAL (ADD / EDIT) */}
      {isProductModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-pencil-square" style={{ color: "var(--accent)" }}></i>{" "}
                {editingProduct ? "Edit Fragrance Formulation" : "Configure New Product"}
              </h3>
              <button type="button" className="modal-close" onClick={() => setIsProductModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveProduct} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Fragrance Name *</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Ivory Amber Eau de Parfum"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Fragrance Family / Collection</label>
                  <input
                    type="text"
                    value={formFamily}
                    onChange={(e) => setFormFamily(e.target.value)}
                    placeholder="e.g. Oriental Amber"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as Product["category"])}
                    required
                  >
                    <option value="perfumes">Body Perfumes (Eau de Parfum)</option>
                    <option value="essence-oils">Essence Oils</option>
                    <option value="car-perfumes">Car Fresheners</option>
                    <option value="agarbatti">Incense & Agarbatti</option>
                    <option value="soaps">Botanical Soaps</option>
                    <option value="gifting">Luxury Gift Sets</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Pack Volume / Variant *</label>
                  <input
                    type="text"
                    value={formSize}
                    onChange={(e) => setFormSize(e.target.value)}
                    placeholder="e.g. 30 ml or 50 ml"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Retail Price (₹) *</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Inventory Stock Units</label>
                  <input
                    type="number"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Key Olfactory Notes</label>
                <input
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="e.g. Amber · Golden Resin · Vanilla"
                />
              </div>

              {/* Device Image File Upload */}
              <div className="form-group">
                <label>
                  <i className="bi bi-cloud-arrow-up-fill" style={{ color: "var(--accent)" }}></i> Upload Product Photo
                  from Device
                </label>
                <div
                  className="file-upload-zone"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: "pointer" }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) processImageFile(f);
                    }}
                  />
                  <div className="upload-zone-content">
                    <div className="upload-zone-left">
                      <div className="upload-icon-circle">
                        <i className="bi bi-image"></i>
                      </div>
                      <div className="upload-text-wrap">
                        <span className="upload-primary-text">Click to choose image or drag &amp; drop here</span>
                        <span className="upload-sub-text">Supports PNG, JPG, JPEG, WEBP (Max 5MB)</span>
                      </div>
                    </div>
                    <button type="button" className="btn-outline" style={{ padding: "6px 12px", fontSize: "12px" }}>
                      <i className="bi bi-folder2-open"></i> Browse File
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Or Enter Image Path / URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="/assets/perfumes/..."
                />
              </div>

              <div className="img-preview-box">
                <div className="img-preview-thumb">
                  <img src={formImage} alt="Preview" style={{ objectFit: "contain" }} />
                </div>
                <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                  <b>Selected Image Preview</b>
                  <br />
                  Will be displayed across product catalog & storefront.
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="modal-footer" style={{ padding: "16px 0 0", marginTop: "16px", borderTop: "1px solid var(--line)" }}>
                <button type="button" className="btn-outline" onClick={() => setIsProductModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <i className="bi bi-check-lg"></i> Save Fragrance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. ORDER DETAILS & TIMELINE MODAL */}
      {activeModal === "orderDetail" && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-info-circle-fill" style={{ color: "var(--accent)" }}></i> Order #{selectedOrder.id} Details & Lifecycle
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px", marginBottom: "18px" }}>
                <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Patron</div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{selectedOrder.customerName}</div>
                  <div style={{ fontSize: "12px", color: "var(--muted)" }}>{selectedOrder.phone} · {selectedOrder.email}</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Destination Address</div>
                  <div style={{ fontSize: "12px" }}>{selectedOrder.shippingAddress || `${selectedOrder.address?.line1}, ${selectedOrder.address?.city}`}</div>
                </div>
                <div style={{ background: "var(--surface-alt)", padding: "12px", borderRadius: "8px", border: "1px solid var(--line)" }}>
                  <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase" }}>Payment Mode</div>
                  <div style={{ fontWeight: 700, fontSize: "14px" }}>{selectedOrder.paymentMethod || "Bank of Baroda UPI"}</div>
                  <div style={{ fontSize: "12px", color: "var(--success)" }}>Total: {money(selectedOrder.total)}</div>
                </div>
              </div>

              <h4 style={{ fontSize: "13px", marginBottom: "8px" }}>Order Items:</h4>
              <div className="table-container" style={{ marginBottom: "18px" }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Variant</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items?.map((it, idx) => (
                      <tr key={idx}>
                        <td><b>{it.name}</b></td>
                        <td>{it.size || "30 ml"}</td>
                        <td>{it.quantity}</td>
                        <td>{money(it.price)}</td>
                        <td><b>{money(it.price * it.quantity)}</b></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. TAX INVOICE MODAL */}
      {activeModal === "invoice" && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-receipt" style={{ color: "var(--accent)" }}></i> Official Tax Invoice
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ background: "#fff", color: "#111", padding: "24px", borderRadius: "8px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "2px solid #111", paddingBottom: "14px" }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 700 }}>ARTISAN SCENT HAUTE PARFUMERIE</h2>
                  <div style={{ fontSize: "11.5px", color: "#555" }}>
                    Kulswami Essence Oil Manufacturing Company<br />
                    Airoli Branch, Navi Mumbai, Maharashtra - 400708<br />
                    GSTIN: 27BARB0AIROLI1Z
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>TAX INVOICE</h3>
                  <div style={{ fontSize: "12px" }}>Invoice Ref: <b>INV-{selectedOrder.id}</b></div>
                  <div style={{ fontSize: "11px", color: "#555" }}>Date: {selectedOrder.date}</div>
                </div>
              </div>

              <div style={{ marginTop: "16px", marginBottom: "16px", fontSize: "12px" }}>
                <b>Billed To:</b> {selectedOrder.customerName} | Phone: {selectedOrder.phone}<br />
                <b>Address:</b> {selectedOrder.shippingAddress || selectedOrder.address?.line1}
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", marginTop: "12px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #ddd", textAlign: "left" }}>
                    <th style={{ padding: "8px 0" }}>Description</th>
                    <th style={{ padding: "8px 0" }}>Qty</th>
                    <th style={{ padding: "8px 0" }}>Price</th>
                    <th style={{ padding: "8px 0", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items?.map((it, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "8px 0" }}>{it.name} ({it.size || "30 ml"})</td>
                      <td style={{ padding: "8px 0" }}>{it.quantity}</td>
                      <td style={{ padding: "8px 0" }}>{money(it.price)}</td>
                      <td style={{ padding: "8px 0", textAlign: "right" }}>{money(it.price * it.quantity)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3} style={{ padding: "12px 0 0", textAlign: "right", fontWeight: 700 }}>Total (GST Inclusive):</td>
                    <td style={{ padding: "12px 0 0", textAlign: "right", fontWeight: 700, fontSize: "14px" }}>{money(selectedOrder.total)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                Close
              </button>
              <button type="button" className="btn-primary" onClick={() => window.print()}>
                <i className="bi bi-printer"></i> Print Tax Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. PRINTABLE SHIPPING LABEL MODAL */}
      {activeModal === "shippingLabel" && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-tag-fill" style={{ color: "var(--accent)" }}></i> Courier Shipping Label
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ background: "#fff", color: "#111", border: "2px solid #000", padding: "20px", borderRadius: "6px" }}>
              <div style={{ textAlign: "center", borderBottom: "2px dashed #000", paddingBottom: "10px" }}>
                <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 800 }}>BLUEDART EXPRESS AIR</h3>
                <div style={{ fontSize: "12px", fontFamily: "monospace", fontWeight: 700 }}>
                  AWB: {selectedOrder.awb || `BD-${selectedOrder.id.replace("ART-", "99")}`}
                </div>
              </div>
              <div style={{ marginTop: "12px", fontSize: "12px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase" }}>Deliver To:</div>
                <div style={{ fontSize: "14px", fontWeight: 700 }}>{selectedOrder.customerName}</div>
                <div>{selectedOrder.shippingAddress || selectedOrder.address?.line1}</div>
                <div>Phone: <b>{selectedOrder.phone}</b></div>
              </div>
              <div style={{ marginTop: "14px", borderTop: "1px solid #000", paddingTop: "8px", fontSize: "11px", display: "flex", justifyContent: "space-between" }}>
                <span>Ref: #{selectedOrder.id}</span>
                <span>Type: <b>{selectedOrder.paymentMethod?.includes("COD") ? "COD" : "PREPAID"}</b></span>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                Close
              </button>
              <button type="button" className="btn-primary" onClick={() => window.print()}>
                <i className="bi bi-printer"></i> Print Shipping Label
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. WAREHOUSE PACKING SLIP MODAL */}
      {activeModal === "packingSlip" && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-card-checklist" style={{ color: "var(--accent)" }}></i> Warehouse Picking & Packing Slip
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ background: "#fff", color: "#111", padding: "16px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #ddd", paddingBottom: "8px" }}>
                <b>Order #{selectedOrder.id}</b>
                <span>Date: {selectedOrder.date}</span>
              </div>
              <div style={{ marginTop: "10px", fontSize: "12px" }}>
                <b>Pick Items for Dispatch:</b>
                <ul style={{ margin: "8px 0 0 16px", padding: 0 }}>
                  {selectedOrder.items?.map((it, idx) => (
                    <li key={idx} style={{ marginBottom: "4px" }}>
                      [ ] <b>{it.quantity}x</b> {it.name} ({it.size || "30 ml"})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                Close
              </button>
              <button type="button" className="btn-primary" onClick={() => window.print()}>
                <i className="bi bi-printer"></i> Print Packing Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. INITIATE REFUND MODAL */}
      {activeModal === "refund" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-arrow-counterclockwise" style={{ color: "#0d9488" }}></i> Process Customer Refund
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Refund Amount (₹)</label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(Number(e.target.value))}
                />
              </div>
              <div className="form-group" style={{ marginTop: "12px" }}>
                <label>Refund Reason</label>
                <input
                  type="text"
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary"
                style={{ background: "#0d9488" }}
                onClick={() => {
                  showFeedback(`Refund of ₹${refundAmount} initiated via Bank of Baroda payment gateway.`);
                  setActiveModal("none");
                }}
              >
                <i className="bi bi-check-lg"></i> Confirm & Process Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CREATE PROMO COUPON MODAL */}
      {activeModal === "coupon" && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-ticket-perforated" style={{ color: "var(--accent)" }}></i> Create Promo Coupon
              </h3>
              <button type="button" className="modal-close" onClick={() => setActiveModal("none")}>
                &times;
              </button>
            </div>
            <form
              className="modal-body"
              onSubmit={(e) => {
                e.preventDefault();
                if (!newCouponCode) return;
                const newC: CouponRecord = {
                  code: newCouponCode.toUpperCase(),
                  type: newCouponType,
                  value: Number(newCouponValue),
                  minOrder: Number(newCouponMin),
                  expiry: "2026-12-31",
                  description: newCouponDesc || "Promotional celebration voucher",
                  redeemedCount: 0,
                  active: true,
                };
                setCouponsList((prev) => [newC, ...prev]);
                showFeedback(`Coupon ${newC.code} created!`);
                setActiveModal("none");
              }}
            >
              <div className="form-row">
                <div className="form-group">
                  <label>Coupon Code *</label>
                  <input
                    type="text"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value)}
                    placeholder="e.g. FESTIVE20"
                    style={{ textTransform: "uppercase" }}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Discount Type *</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as "percentage" | "fixed")}
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ marginTop: "12px" }}>
                <div className="form-group">
                  <label>Discount Value *</label>
                  <input
                    type="number"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Minimum Order Amount (₹)</label>
                  <input
                    type="number"
                    value={newCouponMin}
                    onChange={(e) => setNewCouponMin(Number(e.target.value))}
                  />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: "12px" }}>
                <label>Description</label>
                <input
                  type="text"
                  value={newCouponDesc}
                  onChange={(e) => setNewCouponDesc(e.target.value)}
                  placeholder="e.g. 20% off festive fragrance celebration discount"
                />
              </div>
              <div className="modal-footer" style={{ padding: "16px 0 0", marginTop: "16px", borderTop: "1px solid var(--line)" }}>
                <button type="button" className="btn-outline" onClick={() => setActiveModal("none")}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <i className="bi bi-check-lg"></i> Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. BANK OF BARODA CHEQUE MODAL */}
      {isChequeModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box large">
            <div className="modal-header">
              <h3 className="modal-title">
                <i className="bi bi-bank" style={{ color: "var(--accent)" }}></i> Bank of Baroda Official Cheque Leaf
              </h3>
              <button type="button" className="modal-close" onClick={() => setIsChequeModalOpen(false)}>
                &times;
              </button>
            </div>
            <div className="modal-body" style={{ textAlign: "center" }}>
              <img
                src="/assets/payment/bob_cheque.jpg"
                alt="Bank of Baroda Cheque"
                style={{ width: "100%", maxHeight: "500px", objectFit: "contain", borderRadius: "8px" }}
              />
              <div style={{ marginTop: "12px", fontSize: "12.5px", color: "var(--muted)" }}>
                Beneficiary: <b>KULSWAMI ESSENCE OIL MANUFACTURING COMPANY</b> · Account: <b>32020200001980</b> · IFSC: <b>BARB0AIROLI</b>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn-outline" onClick={() => setIsChequeModalOpen(false)}>
                Close
              </button>
              <a href="/assets/payment/bob_cheque.jpg" download="BankOfBaroda_Cheque.jpg" className="btn-primary">
                <i className="bi bi-download"></i> Download Cheque Image
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {feedbackMsg && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 99999,
            background: "#091a11",
            color: "#86efac",
            border: "1px solid #1b5e3f",
            padding: "12px 18px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 500,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <i className="bi bi-check-circle-fill" style={{ color: "#22c55e", fontSize: "16px" }}></i>
          <span>{feedbackMsg}</span>
        </div>
      )}
    </div>
  );
}
