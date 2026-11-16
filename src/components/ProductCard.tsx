import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag } from "lucide-react";
import { money, type Product } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { triggerSprinkles } from "@/lib/sprinkles";

type ProductCardProps = {
  product: Product;
  isSaved?: boolean;
  onToggleSaved?: (id: string) => void;
  onAddToCart?: (product: Product, event?: React.MouseEvent) => void;
  delayClass?: string;
  freeGiftLabel?: string;
};

export function ProductCard({
  product: p,
  isSaved = false,
  onToggleSaved,
  onAddToCart,
  delayClass = "",
  freeGiftLabel = "Incl. Free Olfactory Sample",
}: ProductCardProps) {
  // Original MSRP for calculating discount (e.g. 50% OFF)
  const originalPrice = p.salePrice ? p.price : Math.round((p.price * 2) / 10) * 10 - 1;
  const discountPercent = p.salePrice
    ? Math.round(((p.price - p.salePrice) / p.price) * 100)
    : 50;

  // Review count based on product id hash for consistency
  const reviewCount = p.rating ? Math.floor(p.rating * 50) : 180 + ((p.name.length * 23) % 240);

  return (
    <article
      className={`reveal-on-scroll ${delayClass} group rounded-2xl overflow-hidden border border-[#e8e4dc] bg-white flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-[#1b5e3f]/50 hover:shadow-xl hover:shadow-[#1b5e3f]/8 p-3 sm:p-3.5`}
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden p-4 flex items-center justify-center bg-[#faf8f5] border border-[#f0ede6]">
        <Link
          to="/products/$productId"
          params={{ productId: p.id }}
          className="w-full h-full flex items-center justify-center"
        >
          <img
            src={p.image}
            alt={p.name}
            width={600}
            height={600}
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-Left Badges Stack (Matching Screenshot 2) */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
          <span className="text-[10px] font-bold text-white bg-[#1b5e3f] px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
            {discountPercent}% OFF
          </span>
          <span className="text-[9px] font-bold text-[#071c12] bg-[#d4af37] px-2 py-0.5 rounded shadow-xs tracking-wider uppercase">
            {p.badge || "BESTSELLER"}
          </span>
        </div>

        {/* Top-Right Heart Wishlist Button */}
        {onToggleSaved && (
          <button
            type="button"
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 border border-[#e8e4dc] flex items-center justify-center text-[#777777] hover:text-rose-600 hover:border-rose-200 transition-all shadow-xs z-10"
            aria-label={`${isSaved ? "Unsave" : "Save"} ${p.name}`}
            onClick={(e) => {
              e.preventDefault();
              onToggleSaved(p.id);
            }}
          >
            <Heart
              size={15}
              fill={isSaved ? "#e11d48" : "none"}
              className={isSaved ? "text-[#e11d48]" : "transition-colors"}
            />
          </button>
        )}

        {/* Bottom Center Gift / Sample Pill (Matching Screenshot 2) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none whitespace-nowrap">
          <span className="bg-white/95 backdrop-blur-xs text-[#444444] text-[10px] font-medium py-0.5 px-3 rounded-full border border-[#e8e4dc] shadow-2xs">
            {freeGiftLabel}
          </span>
        </div>
      </div>

      {/* Info Block */}
      <div className="pt-3 pb-1 flex flex-col flex-1 justify-between">
        <div>
          {/* Star Rating & Review Count (Matching Screenshot 2) */}
          <div className="flex items-center gap-1 text-[#d4af37] text-xs">
            <span className="tracking-tighter">★★★★★</span>
            <span className="font-bold text-[#111111] text-[11px] ml-1">4.9</span>
            <span className="text-[11px] text-[#888888] font-normal">({reviewCount})</span>
          </div>

          {/* Product Title */}
          <Link
            to="/products/$productId"
            params={{ productId: p.id }}
            className="font-display font-semibold text-base sm:text-lg text-[#111111] group-hover:text-[#1b5e3f] transition-colors block leading-tight mt-1 truncate"
          >
            {p.name}
          </Link>

          {/* Scent Notes / Subtitle */}
          <p className="text-xs text-[#777777] line-clamp-1 mt-1 font-light">
            {p.notes}
          </p>

          {/* Price Row: Current Price, Strikethrough Original, Green Discount Pill */}
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono text-base font-bold text-[#111111]">
              {money(p.price)}
            </span>
            <span className="font-mono text-xs text-[#999999] line-through">
              {money(originalPrice)}
            </span>
            <span className="text-[10px] font-bold text-[#1b5e3f] bg-[#e8f5ef] px-1.5 py-0.5 rounded">
              {discountPercent}% OFF
            </span>
          </div>
        </div>

        {/* Full-width Dark Green ADD TO CART Button */}
        {onAddToCart && (
          <Button
            type="button"
            className="w-full h-10 mt-3.5 rounded-full bg-[#1b5e3f] hover:bg-[#154a31] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              triggerSprinkles(e);
              onAddToCart(p, e);
            }}
          >
            <ShoppingBag size={14} />
            <span>ADD TO CART</span>
          </Button>
        )}
      </div>
    </article>
  );
}
