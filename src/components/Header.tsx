import { useState, useEffect, useRef } from "react";
import { Menu, Search, ShoppingBag, Heart, X, ChevronDown, ArrowRight, Trash2 } from "lucide-react";
import { useWishlist, useShoppingBag, OPEN_CART_EVENT } from "@/lib/store";
import { useProducts, money, type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";

type HeaderProps = {
  currentPage?: string;
  onSearchClick?: () => void;
  onWishlistClick?: () => void;
  onBagClick?: () => void;
  totalItems?: number;
  wishlistCount?: number;
};

type CategoryNavItem = {
  label: string;
  href: string;
  categoryKey: "perfumes" | "essence-oils" | "car-perfumes" | "agarbatti" | "soaps";
  subtitle: string;
};

const categoryNavItems: CategoryNavItem[] = [
  {
    label: "Perfumes",
    href: "/perfumes",
    categoryKey: "perfumes",
    subtitle: "Haute Parfumerie",
  },
  {
    label: "Essence Oils",
    href: "/essence-oils",
    categoryKey: "essence-oils",
    subtitle: "Pure Botanicals",
  },
  {
    label: "Car Perfumes",
    href: "/car-perfumes",
    categoryKey: "car-perfumes",
    subtitle: "Automotive Luxury",
  },
  {
    label: "Agarbatti",
    href: "/agarbatti",
    categoryKey: "agarbatti",
    subtitle: "Traditional Incense",
  },
  {
    label: "Soaps",
    href: "/soaps",
    categoryKey: "soaps",
    subtitle: "Artisan Bathing Bars",
  },
];

const rightNavItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "KEOMC", href: "/keomc" },
  { label: "Contact", href: "/contact" },
];

export function Header({
  currentPage,
  onSearchClick,
  onWishlistClick,
  onBagClick,
  totalItems: propTotalItems,
  wishlistCount: propWishlistCount,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Global store hooks for fallback modal/drawer
  const { saved, toggleSaved, wishlistCount: storeWishlistCount } = useWishlist();
  const { bag, updateQty, removeItem, clearBag, totalItems: storeTotalItems, addToBag } = useShoppingBag();
  const products = useProducts();

  // Unified Cart Drawer state matching Screenshot 2
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handleOpenCart = (e: Event) => {
      const customEvent = e as CustomEvent<Product | undefined>;
      if (customEvent.detail) {
        setLastAddedProduct(customEvent.detail);
      }
      setIsCartOpen(true);
    };

    window.addEventListener(OPEN_CART_EVENT, handleOpenCart);
    return () => {
      window.removeEventListener(OPEN_CART_EVENT, handleOpenCart);
    };
  }, []);

  // Internal drawer state if parent doesn't override
  const [internalDrawer, setInternalDrawer] = useState<"bag" | "wishlist" | "search" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const effectiveTotalItems = propTotalItems !== undefined ? propTotalItems : storeTotalItems;
  const effectiveWishlistCount = propWishlistCount !== undefined ? propWishlistCount : storeWishlistCount;

  const handleCategoryEnter = (key: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setHoveredCategory(key);
  };

  const handleCategoryLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 160);
  };

  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setHoveredCategory(null);
    setMobileOpen(false);
    setInternalDrawer(null);
  }, [currentPage]);

  // Lock scroll when internal drawer is open
  useEffect(() => {
    if (!internalDrawer) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInternalDrawer(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [internalDrawer]);

  const handleSearchClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onSearchClick) {
      onSearchClick();
    } else {
      setInternalDrawer("search");
    }
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onWishlistClick) {
      onWishlistClick();
    } else {
      window.location.href = "/wishlist";
    }
  };

  const handleBagClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsCartOpen(true);
  };

  const cartProducts = products.filter((p) => (bag[p.id] || 0) > 0);
  const savedProducts = products.filter((p) => saved.includes(p.id));
  const cartSubtotal = cartProducts.reduce((sum, p) => sum + p.price * (bag[p.id] || 0), 0);

  const searchResults = searchQuery.trim()
    ? products.filter((p) =>
        `${p.name} ${p.notes} ${p.category} ${p.family}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      {/* Desktop / Tablet / Mobile Header */}
      <header
        className={`luxury-header${scrolled ? " luxury-header--scrolled" : ""}`}
        role="banner"
      >
        {/* Left Side: Mobile Hamburger & Desktop 5 Category Dropdowns */}
        <div className="luxury-header-left">
          {/* Mobile Hamburger on the left */}
          <button
            type="button"
            className="luxury-hamburger lg:hidden mr-2"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={22} />
          </button>

          <nav className="luxury-nav hidden lg:flex" aria-label="Primary navigation left">
            {categoryNavItems.map((cat, idx) => {
              const catProducts = products.filter((p) => p.category === cat.categoryKey).slice(0, 3);
              const isOpen = hoveredCategory === cat.categoryKey;
              const isActive = currentPage === cat.label || currentPage === cat.categoryKey;
              const alignClass =
                idx === 0
                  ? "left-0"
                  : idx === 1
                    ? "left-0 xl:-left-6"
                    : idx === 2
                      ? "left-1/2 -translate-x-1/2"
                      : idx === 3
                        ? "right-0 xl:-right-6"
                        : "right-0";

              return (
                <div
                  key={cat.categoryKey}
                  className="luxury-dropdown-wrapper"
                  onMouseEnter={() => handleCategoryEnter(cat.categoryKey)}
                  onMouseLeave={handleCategoryLeave}
                >
                  <a
                    href={cat.href}
                    className={`luxury-nav-link luxury-dropdown-trigger${isActive ? " active" : ""}`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    <span>{cat.label}</span>
                    <ChevronDown
                      size={11}
                      strokeWidth={2.5}
                      className={`luxury-chevron${isOpen ? " rotated" : ""}`}
                    />
                  </a>

                  {isOpen && (
                    <div
                      className={`luxury-category-dropdown ${alignClass} w-[420px] sm:w-[450px]`}
                      role="menu"
                      onMouseEnter={() => handleCategoryEnter(cat.categoryKey)}
                      onMouseLeave={handleCategoryLeave}
                    >
                      {/* Dropdown Header */}
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#eeebe5]">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-[0.18em] text-[#1b5e3f] block">
                            {cat.label} Collection
                          </span>
                          <span className="text-[11px] text-[#777777] font-medium">
                            {cat.subtitle}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-[#888888] bg-[#f5f3ef] px-2.5 py-0.5 rounded-full">
                          Featured
                        </span>
                      </div>

                      {/* 3 Products Grid */}
                      <div className="grid grid-cols-3 gap-2.5">
                        {catProducts.map((p) => (
                          <a
                            key={p.id}
                            href={`/products/${p.id}`}
                            onClick={() => setHoveredCategory(null)}
                            className="group flex flex-col p-2 rounded-xl bg-[#faf8f5] hover:bg-[#f3efe6] border border-[#eeebe5] hover:border-[#1b5e3f]/40 transition-all text-left shadow-2xs hover:shadow-xs"
                          >
                            <div className="w-full aspect-square rounded-lg bg-white overflow-hidden p-1.5 flex items-center justify-center border border-[#ece7de] mb-2 group-hover:scale-[1.04] transition-transform">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-full h-full object-contain"
                                loading="lazy"
                              />
                            </div>
                            <h4 className="font-display font-bold text-xs text-[#111111] group-hover:text-[#1b5e3f] line-clamp-1 transition-colors leading-tight">
                              {p.name}
                            </h4>
                            <p className="text-[10px] text-[#777777] font-medium line-clamp-1 mt-0.5">
                              {p.notes.split("·")[0]?.trim() || p.notes}
                            </p>
                            <span className="font-mono text-xs font-bold text-[#1b5e3f] mt-1.5">
                              {money(p.price)}
                            </span>
                          </a>
                        ))}
                      </div>

                      {/* View More Button */}
                      <a
                        href={cat.href}
                        onClick={() => setHoveredCategory(null)}
                        className="mt-3.5 flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#1b5e3f] hover:bg-[#164a31] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-xs group"
                      >
                        <span>View More</span>
                        <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                      </a>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>

        {/* Center: Center-Aligned Logo */}
        <div className="luxury-header-center">
          <a href="/" className="luxury-logo-link" aria-label="Artisan Scents – home">
            <div className="luxury-logo-circle">
              <img
                src="/assets/logo.jpeg"
                alt="Artisan Scents logo"
                className="luxury-logo-img"
                width={48}
                height={48}
              />
            </div>
            <div>
              <div className="luxury-brand-title">
                ARTISAN <span className="text-[#d4af37]" style={{ color: "#d4af37" }}>SCENT</span>
              </div>
              <div className="luxury-brand-subtitle">LUXURY FRAGRANCES</div>
            </div>
          </a>
        </div>

        {/* Right Side: Desktop Right Nav Links (Home, About, KEOMC, Contact) & Action Icons */}
        <div className="luxury-header-right">
          <nav className="luxury-nav hidden lg:flex" aria-label="Primary navigation right">
            {rightNavItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`luxury-nav-link${currentPage === item.label ? " active" : ""}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Icons on far right: Search, Wishlist (Heart), Shopping Bag */}
          <div className="luxury-icons flex items-center gap-1 sm:gap-2">
            {/* Search Button */}
            <button
              type="button"
              className="luxury-icon-btn"
              aria-label="Search Fragrance Catalogue"
              title="Search fragrances"
              onClick={handleSearchClick}
            >
              <Search size={18} strokeWidth={1.5} />
            </button>

            {/* Wishlist Button */}
            <button
              type="button"
              className="luxury-icon-btn luxury-wishlist-btn relative"
              aria-label={`Wishlist, ${effectiveWishlistCount} items`}
              title="View Wishlist"
              onClick={handleWishlistClick}
            >
              <Heart
                size={18}
                strokeWidth={1.5}
                className={effectiveWishlistCount > 0 ? "fill-rose-600 text-rose-600 transition-colors" : "transition-colors"}
              />
              {effectiveWishlistCount > 0 && (
                <span className="luxury-bag-count luxury-wishlist-badge">
                  {effectiveWishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              className="luxury-icon-btn luxury-bag-btn relative"
              aria-label={`Shopping bag, ${effectiveTotalItems} items`}
              title="Shopping Bag"
              onClick={handleBagClick}
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {effectiveTotalItems > 0 && (
                <span className="luxury-bag-count">{effectiveTotalItems}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Built-in Slide-Over Drawer for Bag, Wishlist, or Search when triggered from Header */}
      {internalDrawer && (
        <div
          className="bag-overlay"
          onClick={() => setInternalDrawer(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bag-panel"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 mb-4 border-b border-[#eeebe5]">
              <div className="flex items-center gap-2">
                {internalDrawer === "bag" && (
                  <ShoppingBag size={20} className="text-[#1b5e3f]" />
                )}
                {internalDrawer === "wishlist" && (
                  <Heart size={20} className="text-rose-600 fill-rose-600" />
                )}
                {internalDrawer === "search" && (
                  <Search size={20} className="text-[#1b5e3f]" />
                )}
                <h2 className="font-display text-2xl text-[#111111]">
                  {internalDrawer === "bag"
                    ? `Shopping Bag (${effectiveTotalItems})`
                    : internalDrawer === "wishlist"
                      ? `My Wishlist (${effectiveWishlistCount})`
                      : "Search Fragrances"}
                </h2>
              </div>
              <button
                type="button"
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#777777] hover:text-[#111111] hover:bg-[#f5f3ef] transition-colors"
                onClick={() => setInternalDrawer(null)}
                aria-label="Close panel"
              >
                <X size={18} />
              </button>
            </div>

            {/* 1. SHOPPING BAG CONTENT */}
            {internalDrawer === "bag" && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="bag-list overflow-y-auto divide-y divide-[#f2efe9]">
                  {cartProducts.length === 0 ? (
                    <div className="py-16 text-center">
                      <ShoppingBag size={38} className="mx-auto mb-4 text-[#aaa7a0] opacity-50" />
                      <h3 className="font-display text-2xl text-[#111111]">Your bag is empty</h3>
                      <p className="text-xs text-[#777777] mt-2 mb-6">
                        Explore our handcrafted haute parfumerie and artisanal botanicals.
                      </p>
                      <Button
                        variant="editorial"
                        onClick={() => {
                          setInternalDrawer(null);
                          window.location.href = "/products";
                        }}
                      >
                        Explore Catalogue <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </div>
                  ) : (
                    cartProducts.map((p) => {
                      const qty = bag[p.id] || 0;
                      return (
                        <div key={p.id} className="py-4 flex gap-4 items-center">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-16 h-20 object-contain rounded-lg bg-[#faf8f5] p-1 border border-[#eeebe5]"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-base text-[#111111] truncate">{p.name}</h4>
                            <p className="text-[11px] text-[#777777] capitalize">{p.category.replace("-", " ")}</p>
                            <p className="font-mono text-xs font-semibold text-[#1b5e3f] mt-1">
                              {money(p.price)}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => updateQty(p.id, -1)}
                                className="w-6 h-6 rounded border border-[#d5cebf] flex items-center justify-center text-xs hover:bg-[#f0ede6]"
                              >
                                -
                              </button>
                              <span className="font-mono text-xs font-medium px-1">{qty}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(p.id, 1)}
                                className="w-6 h-6 rounded border border-[#d5cebf] flex items-center justify-center text-xs hover:bg-[#f0ede6]"
                              >
                                +
                              </button>
                              <button
                                type="button"
                                onClick={() => removeItem(p.id)}
                                className="ml-auto text-xs text-rose-600 hover:underline flex items-center gap-1"
                              >
                                <Trash2 size={12} /> Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {cartProducts.length > 0 && (
                  <div className="pt-4 border-t border-[#eeebe5] mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-[#444444]">Subtotal</span>
                      <span className="font-mono text-lg font-bold text-[#111111]">
                        {money(cartSubtotal)}
                      </span>
                    </div>
                    <Button
                      className="w-full h-12 bg-[#1b5e3f] hover:bg-[#164a31] text-white rounded-full font-medium tracking-wide shadow-md flex items-center justify-center gap-2"
                      onClick={() => {
                        setInternalDrawer(null);
                        window.location.href = "/cart";
                      }}
                    >
                      View Shopping Cart &amp; Checkout <ArrowRight size={16} />
                    </Button>
                    <p className="text-[10px] text-center text-[#777777] mt-2">
                      Pan-India delivery · Complimentary olfactory sampling included.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. WISHLIST CONTENT */}
            {internalDrawer === "wishlist" && (
              <div className="flex-1 flex flex-col justify-between">
                <div className="bag-list overflow-y-auto divide-y divide-[#f2efe9]">
                  {savedProducts.length === 0 ? (
                    <div className="py-16 text-center">
                      <Heart size={38} className="mx-auto mb-4 text-[#aaa7a0] opacity-50" />
                      <h3 className="font-display text-2xl text-[#111111]">Your Wishlist is Empty</h3>
                      <p className="text-xs text-[#777777] mt-2 mb-6">
                        Click the heart icon on any product to save your favored formulations.
                      </p>
                      <Button
                        variant="editorial"
                        onClick={() => {
                          setInternalDrawer(null);
                          window.location.href = "/products";
                        }}
                      >
                        Explore Fragrances <ArrowRight size={14} className="ml-2" />
                      </Button>
                    </div>
                  ) : (
                    savedProducts.map((p) => (
                      <div key={p.id} className="py-4 flex gap-4 items-center">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-20 object-contain rounded-lg bg-[#faf8f5] p-1 border border-[#eeebe5]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-base text-[#111111] truncate">{p.name}</h4>
                          <p className="text-[11px] text-[#777777] truncate">{p.notes}</p>
                          <p className="font-mono text-xs font-semibold text-[#1b5e3f] mt-1">
                            {money(p.price)}
                          </p>

                          <div className="flex items-center gap-2 mt-3">
                            <button
                              type="button"
                              onClick={() => {
                                addToBag(p.id, 1);
                                setInternalDrawer("bag");
                              }}
                              className="px-3 py-1 rounded-full bg-[#1b5e3f] text-white text-xs font-medium hover:bg-[#164a31] transition-colors"
                            >
                              Move to Bag
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleSaved(p.id)}
                              className="text-xs text-[#888888] hover:text-rose-600 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {savedProducts.length > 0 && (
                  <div className="pt-4 border-t border-[#eeebe5] mt-4">
                    <Button
                      className="w-full h-11 bg-[#1b5e3f] hover:bg-[#164a31] text-white rounded-full font-medium text-xs flex items-center justify-center gap-2 shadow-xs"
                      onClick={() => {
                        setInternalDrawer(null);
                        window.location.href = "/wishlist";
                      }}
                    >
                      <Heart size={14} className="fill-rose-400 text-rose-400" />
                      <span>Open Full Wishlist Page ({effectiveWishlistCount})</span>
                      <ArrowRight size={14} />
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* 3. SEARCH CATALOGUE CONTENT */}
            {internalDrawer === "search" && (
              <div className="flex-1 flex flex-col">
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search perfumes, oud, vetiver, oils…"
                    autoFocus
                    className="w-full px-4 py-3 pl-10 rounded-xl border border-[#d5cebf] bg-[#faf8f5] text-sm text-[#111111] outline-none focus:border-[#1b5e3f] focus:ring-1 focus:ring-[#1b5e3f]"
                  />
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#888888]" />
                </div>

                <div className="bag-list overflow-y-auto divide-y divide-[#f2efe9]">
                  {searchQuery.trim() === "" ? (
                    <div className="py-12 text-center text-xs text-[#777777]">
                      Type keywords like <span className="font-medium text-[#1b5e3f]">amber</span>,{" "}
                      <span className="font-medium text-[#1b5e3f]">lavender</span>, or{" "}
                      <span className="font-medium text-[#1b5e3f]">diffuser</span> to explore.
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="py-12 text-center text-xs text-[#777777]">
                      No fragrances matched "{searchQuery}".
                    </div>
                  ) : (
                    searchResults.map((p) => (
                      <a
                        key={p.id}
                        href={`/products/${p.id}`}
                        onClick={() => setInternalDrawer(null)}
                        className="py-3 flex gap-3 items-center hover:bg-[#fbfaf8] rounded-xl px-2 transition-colors"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-12 h-14 object-contain rounded bg-[#faf8f5] p-1 border border-[#eeebe5]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-sm text-[#111111] truncate">{p.name}</h4>
                          <p className="text-[10px] text-[#777777] truncate">{p.notes}</p>
                          <span className="font-mono text-xs font-semibold text-[#1b5e3f]">
                            {money(p.price)}
                          </span>
                        </div>
                      </a>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="luxury-mobile-overlay" onClick={() => setMobileOpen(false)}>
          <nav
            className="luxury-mobile-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="luxury-mobile-header">
              <a href="/" className="flex items-center gap-3 no-underline" onClick={() => setMobileOpen(false)}>
                <div className="luxury-logo-circle" style={{ width: 40, height: 40 }}>
                  <img
                    src="/assets/logo.jpeg"
                    alt="Artisan Scents logo"
                    className="luxury-logo-img"
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <div className="luxury-brand-title" style={{ fontSize: 16 }}>
                    ARTISAN <span className="text-[#d4af37]" style={{ color: "#d4af37" }}>SCENT</span>
                  </div>
                  <div className="luxury-brand-subtitle" style={{ fontSize: 7 }}>LUXURY FRAGRANCES</div>
                </div>
              </a>
              <button
                type="button"
                className="luxury-icon-btn"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* Mobile Quick Action Buttons for Wishlist & Bag */}
            <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#eeebe5]">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setInternalDrawer("wishlist");
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#faf8f5] border border-[#e4ded5] text-xs font-medium text-[#222222]"
              >
                <Heart size={16} className={effectiveWishlistCount > 0 ? "fill-rose-600 text-rose-600" : ""} />
                Wishlist ({effectiveWishlistCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setInternalDrawer("bag");
                }}
                className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1b5e3f] text-white text-xs font-medium shadow-xs"
              >
                <ShoppingBag size={16} />
                Bag ({effectiveTotalItems})
              </button>
            </div>

            {/* Mobile Categories & Products Section */}
            <div className="p-4 border-b border-[#eeebe5]">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1b5e3f] block mb-2.5">
                Categories
              </span>
              <div className="space-y-1.5">
                {categoryNavItems.map((cat) => {
                  const isExpanded = mobileCategoryOpen === cat.categoryKey;
                  const catProducts = products.filter((p) => p.category === cat.categoryKey).slice(0, 3);
                  return (
                    <div key={cat.label} className="border-b border-[#f0ede6] pb-1.5 last:border-b-0">
                      <div className="flex items-center justify-between py-1">
                        <a
                          href={cat.href}
                          className={`text-sm font-semibold tracking-wide uppercase ${
                            currentPage === cat.label || currentPage === cat.categoryKey
                              ? "text-[#1b5e3f]"
                              : "text-[#222222]"
                          }`}
                          onClick={() => setMobileOpen(false)}
                        >
                          {cat.label}
                        </a>
                        <button
                          type="button"
                          className="p-1.5 text-[#666666] hover:text-[#111111]"
                          onClick={() => setMobileCategoryOpen(isExpanded ? null : cat.categoryKey)}
                          aria-label={`Toggle ${cat.label} products`}
                        >
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-2 pb-2">
                          <div className="grid grid-cols-3 gap-2">
                            {catProducts.map((p) => (
                              <a
                                key={p.id}
                                href={`/products/${p.id}`}
                                className="flex flex-col p-1.5 rounded-lg bg-[#faf8f5] border border-[#eeebe5]"
                                onClick={() => setMobileOpen(false)}
                              >
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  className="w-full aspect-square object-contain rounded bg-white p-1 mb-1"
                                />
                                <span className="text-[11px] font-semibold text-[#111111] truncate">
                                  {p.name}
                                </span>
                                <span className="text-[10px] font-bold text-[#1b5e3f] mt-0.5">
                                  {money(p.price)}
                                </span>
                              </a>
                            ))}
                          </div>
                          <a
                            href={cat.href}
                            className="mt-2.5 flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-[#1b5e3f] text-white text-xs font-bold uppercase tracking-wider"
                            onClick={() => setMobileOpen(false)}
                          >
                            <span>View More</span>
                            <ArrowRight size={13} />
                          </a>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile Main Pages Section */}
            <div className="p-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#888888] block mb-2.5">
                Pages
              </span>
              <ul className="space-y-2">
                {rightNavItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className={`text-sm font-semibold tracking-wide uppercase py-1 block ${
                        currentPage === item.label ? "text-[#1b5e3f]" : "text-[#444444] hover:text-[#111111]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      )}

      {/* Slide-Over Cart Drawer matching Screenshot 2 */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        lastAddedProduct={lastAddedProduct}
      />
    </>
  );
}
