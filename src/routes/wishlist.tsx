import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useWishlist, useShoppingBag } from "@/lib/store";
import { useProducts, money, type Product } from "@/lib/products";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ValueAssuranceStrip } from "@/components/ValueAssuranceStrip";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  ShoppingBag,
  CheckCircle2,
  Trash2,
  ArrowLeft,
  Share2,
} from "lucide-react";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Artisan Scent" },
      {
        name: "description",
        content:
          "Your curated selection of Artisan Scent luxury perfumes, pure botanical essence oils, and personal care fragrances.",
      },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const { saved, toggleSaved } = useWishlist();
  const { addToBag, totalItems } = useShoppingBag();
  const products = useProducts();

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const wishlistProducts = products.filter((p) => saved.includes(p.id));
  const wishlistTotal = wishlistProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddToBag = (product: Product) => {
    addToBag(product.id, 1);
    showToast(`Added "${product.name}" to your bag.`);
  };

  const handleAddAllToBag = () => {
    if (wishlistProducts.length === 0) return;
    wishlistProducts.forEach((p) => addToBag(p.id, 1));
    showToast(`Added all ${wishlistProducts.length} items to your shopping bag.`);
  };

  return (
    <>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#072416] text-[#86efac] border border-[#2d8659] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 size={16} className="text-[#86efac] shrink-0" />
          <span className="font-medium text-white">{toastMessage}</span>
          <a
            href="/cart"
            className="ml-2 px-3 py-1 bg-[#1b5e3f] hover:bg-[#257d54] text-white rounded-full text-[11px] font-semibold transition-colors"
          >
            View Bag →
          </a>
        </div>
      )}

      <div className="announcement">
        Complimentary Pan-India Delivery on Orders ₹999+ <span className="ml-3">✦</span> Botanical Haute Parfumerie
      </div>

      <Header currentPage="Wishlist" />

      <main className="min-h-screen bg-[#faf9f5] text-[#222222]">
        {/* Category Hero Banner */}
        <section className="relative overflow-hidden text-[#072416] bg-[#faf9f5] border-b border-[#1b5e3f]/20 py-20 sm:py-28 px-6 sm:px-12">
          {/* Background Image */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src="/assets/shopimages/perfume sectionimage.png"
              alt="Artisan Scent Curated Wishlist"
              className="w-full h-full object-cover scale-105"
            />
            {/* Luminous Soft White/Cream Overlay for bright botanical atmosphere and crisp dark green text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#faf9f5]/95 via-[#faf9f5]/85 to-[#faf9f5]/55" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#faf9f5] via-transparent to-[#faf9f5]/30" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div className="reveal-fade inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#1b5e3f] font-bold mb-4 drop-shadow-[0_1px_3px_rgba(255,255,255,0.9)]">
                <span className="w-6 h-[1.5px] bg-[#d4af37]" />
                <span>SAVED CREATIONS &amp; WISHLIST</span>
              </div>
              <h1 className="reveal-on-scroll reveal-delay-100 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.08] tracking-tight text-[#072416] drop-shadow-[0_2px_12px_rgba(255,255,255,0.95)]">
                My Private
                <br />
                <em className="text-[#135d37] font-serif italic">Wishlist ({wishlistProducts.length})</em>
              </h1>
              <p className="reveal-on-scroll reveal-delay-200 mt-5 text-sm sm:text-base text-[#333333] font-light max-w-xl leading-relaxed">
                Your private curation of preferred extrait perfumes, essence oils, and botanical creations.
              </p>
            </div>

            {wishlistProducts.length > 0 && (
              <div className="flex items-center gap-3 shrink-0">
                <Button
                  onClick={handleAddAllToBag}
                  className="h-12 px-7 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={15} className="text-[#86efac]" />
                  <span>Add All to Bag</span>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 px-6 border-[#d5cebf] bg-white/90 backdrop-blur-xs text-[#222222] hover:border-[#1b5e3f] rounded-full text-xs font-semibold"
                >
                  <Link to="/cart">
                    <span>Bag ({totalItems})</span>
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Value Assurance Trust Strip */}
        <ValueAssuranceStrip />

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-6 sm:px-12 py-12">
          {wishlistProducts.length === 0 ? (
            /* Minimalist Empty State */
            <div className="text-center py-20 px-6 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-white border border-[#e8e2d8] flex items-center justify-center mx-auto mb-5 text-[#1b5e3f] shadow-xs">
                <Heart size={24} className="text-[#1b5e3f] stroke-1" />
              </div>
              <h2 className="font-display text-2xl text-[#072416] mb-2 font-normal">
                Your Wishlist is Empty
              </h2>
              <p className="text-[#777777] text-xs sm:text-sm font-light leading-relaxed mb-8">
                Explore our botanical perfumes, pure essence oils, and handcrafted soaps to curate your personal fragrance collection.
              </p>
              <Button
                asChild
                className="h-11 px-8 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-medium text-xs shadow-sm transition-all"
              >
                <Link to="/products">
                  <span>Explore Collection</span>
                  <ArrowRight size={14} className="ml-2 text-[#86efac]" />
                </Link>
              </Button>
            </div>
          ) : (
            /* Minimal Product Grid */
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {wishlistProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group bg-white rounded-2xl border border-[#e8e2d8] overflow-hidden transition-all duration-300 hover:border-[#1b5e3f]/40 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image Area */}
                      <div className="relative aspect-square w-full bg-[#faf8f5] p-6 flex items-center justify-center border-b border-[#f0ede6]">
                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                          className="w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={product.image}
                            alt={product.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        </Link>

                        {/* Minimal Remove from Wishlist Button */}
                        <button
                          onClick={() => {
                            toggleSaved(product.id);
                            showToast(`Removed "${product.name}" from wishlist.`);
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs border border-[#e8e2d8] flex items-center justify-center text-[#777777] hover:text-rose-600 hover:border-rose-300 transition-colors shadow-2xs"
                          aria-label="Remove from wishlist"
                          title="Remove item"
                        >
                          <Heart size={14} className="fill-rose-500 text-rose-500" />
                        </button>

                        {product.badge && (
                          <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider text-[#1b5e3f] bg-white border border-[#e8e2d8] font-semibold px-2.5 py-0.5 rounded-full">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-5 pb-3">
                        <div className="text-[10px] uppercase tracking-wider text-[#1b5e3f] font-semibold mb-1">
                          {product.category.replace("-", " ")}
                        </div>

                        <Link
                          to="/products/$productId"
                          params={{ productId: product.id }}
                          className="block group-hover:text-[#1b5e3f] transition-colors"
                        >
                          <h3 className="font-display text-lg text-[#072416] font-normal leading-snug line-clamp-1">
                            {product.name}
                          </h3>
                        </Link>

                        <div className="mt-2 flex items-baseline justify-between">
                          <span className="font-mono text-base font-semibold text-[#072416]">
                            {money(product.price)}
                          </span>
                          <span className="text-[11px] text-[#888888] font-light">
                            {product.size || "Standard Edition"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-5 pt-0">
                      <div className="pt-3 border-t border-[#f0ede6] flex items-center gap-2">
                        <Button
                          onClick={() => handleAddToBag(product)}
                          className="flex-1 h-10 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full font-medium text-xs shadow-2xs transition-all flex items-center justify-center gap-1.5"
                        >
                          <ShoppingBag size={13} className="text-[#86efac]" />
                          <span>Add to Bag</span>
                        </Button>

                        <button
                          onClick={() => {
                            const shareUrl = window.location.origin + `/products/${product.id}`;
                            if (navigator.share) {
                              navigator
                                .share({
                                  title: product.name,
                                  text: `Artisan Scent: ${product.name}`,
                                  url: shareUrl,
                                })
                                .catch(() => {});
                            } else {
                              navigator.clipboard.writeText(shareUrl);
                              showToast("Product link copied to clipboard.");
                            }
                          }}
                          className="w-10 h-10 rounded-full border border-[#d5cebf] bg-white hover:border-[#1b5e3f] text-[#666666] hover:text-[#1b5e3f] flex items-center justify-center transition-colors shadow-2xs"
                          title="Share"
                        >
                          <Share2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal Summary Bar */}
              <div className="mt-12 p-6 rounded-2xl bg-white border border-[#e8e2d8] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
                <div>
                  <div className="text-xs text-[#777777] font-light">Total Wishlist Valuation</div>
                  <div className="font-mono text-xl font-bold text-[#072416]">
                    {money(wishlistTotal)}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    asChild
                    variant="ghost"
                    className="text-xs text-[#1b5e3f] hover:text-[#072416]"
                  >
                    <Link to="/products">Continue Browsing</Link>
                  </Button>
                  <Button
                    asChild
                    className="h-10 px-6 bg-[#1b5e3f] hover:bg-[#14472f] text-white rounded-full text-xs font-medium shadow-xs"
                  >
                    <Link to="/cart">View Shopping Bag →</Link>
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Minimal Bottom Link */}
          <div className="mt-12 text-center">
            <Link
              to="/products"
              className="text-xs text-[#1b5e3f] hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              <ArrowLeft size={13} />
              <span>Continue Exploring Fragrances</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
