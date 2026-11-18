// Body Perfumes (12 New Fragrances)
const bodyPerfume1 = "/assets/perfumes/Artisan Scent Ivory Amber Perfume.png";
const bodyPerfume2 = "/assets/perfumes/Artisan Scent Ocean Breeze Perfume.png";
const bodyPerfume3 = "/assets/perfumes/Artisan Scent Lone Legend Perfume.png";
const bodyPerfume4 = "/assets/perfumes/Artisan Ocean Breeze Perfume Bottle.png";
const bodyPerfume5 = "/assets/perfumes/Artisan Scent Ivory Oud Bottle.png";
const bodyPerfume6 = "/assets/perfumes/Artisan Scent Wild Essence Bottle.png";
const bodyPerfume7 = "/assets/perfumes/Crimson Charm Perfume Bottle.png";
const bodyPerfume8 = "/assets/perfumes/Scarlet Spirit Luxury Perfume Bottle.png";
const bodyPerfume9 = "/assets/perfumes/Artisan Pure Musk Perfume Bottle.png";
const bodyPerfume10 = "/assets/perfumes/Artisan Scent Ice Wave Bottle.png";
const bodyPerfume11 = "/assets/perfumes/Visionary Artisan Scent Perfume Bottle.png";
const bodyPerfume12 = "/assets/Royal Noir Artisan Scent Bottle.png";

// Essence Oils
const essence1 = "/assets/essence oil/Elegant Patchouli Oil Bottle.png";
const essence2 = "/assets/essence oil/Rosemary Oil Essence Bottle.png";
const essence3 = "/assets/essence oil/Citronella Oil Essential Oil Bottle.png";
const essence4 = "/assets/essence oil/Elegant Geranium Oil Bottle.png";
const essence5 = "/assets/essence oil/Palmarosa Oil Golden Essence Bottle.png";
const essence6 = "/assets/essence oil/Lavender Oil Essence Bottle.png";
const essence7 = "/assets/essence oil/Lemongrass Oil Essence Bottle.png";
const essence8 = "/assets/essence oil/Menthol Mint Oil Essence Bottle.png";
const essence9 = "/assets/essence oil/Golden Vetiver Oil Bottle.png";

// Car Perfumes (5 Fragrances)
const carPerfume1 = "/assets/carperfumes/Arctic Mist Car Freshener Render.png";
const carPerfume2 = "/assets/carperfumes/Royal Valley Teardrop Car Perfume.png";
const carPerfume3 = "/assets/Regal Oud Wooden Car Freshener.png";
const carPerfume4 = "/assets/carperfumes/Amber Heritage Car Freshener Bottle.png";
const carPerfume5 = "/assets/carperfumes/Mystic Musk Hanging Air Freshener.png";

// Agarbatti
const agarbatti1 = "/assets/AGARBATTI NEW/Premium Agarbatti Sticks.png";
const agarbatti2 = "/assets/AGARBATTI NEW/Deluxe Incense Collection.png";
const agarbatti3 = "/assets/AGARBATTI NEW/Artisanscent Incense Jar Pyramid.png";
const agarbatti4 = "/assets/sandal agarbatti.png";

// Soaps
const soap1 = "/assets/SOAP NEW/Artisan Signature Soap.png";
const soap2 = "/assets/SOAP NEW/ARTISAN SCENT Aromatics Soap Ring.png";
const soap3 = "/assets/soaps/Glossy Green Heart with Leaf Emblem.png";
const soap4 = "/assets/soaps/Glossy Ivory Flower Soap with Gold AS Monogram.png";
const soap5 = "/assets/soaps/Glossy Blue AS Leaf-Em embossed Soap.png";

// Gifting (3 Luxury Gift Sets)
const giftSet1 = "/assets/Artisan Scents Luxury Gift Set.png";
const giftSet2 = "/assets/Artisan Scents Luxury Fragrance Gift Set.png";
const giftSet3 = "/assets/Artisan Scents Luxury Perfume Collection.png";

import { useState, useEffect } from "react";

export type Product = {
  id: string;
  name: string;
  notes: string;
  family: string;
  category: "perfumes" | "essence-oils" | "car-perfumes" | "agarbatti" | "soaps" | "gifting";
  price: number;
  salePrice?: number | undefined;
  image: string;
  badge: string;
  description: string;
  botanicalName?: string | undefined;
  size?: string | undefined;
  applications?: string[] | undefined;
  stock?: number | undefined;
  rating?: number | undefined;
  sku?: string | undefined;
};

export const products: Product[] = [
  // BODY PERFUMES (12 New Products - 30ml / ₹569)
  {
    id: "ivory-amber",
    name: "Ivory Amber",
    notes: "Warm Amber · Golden Resin · Vanilla",
    family: "Oriental Amber",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235101",
    image: bodyPerfume1,
    badge: "Bestseller",
    description:
      "A radiant and velvety blend of golden amber, warm resin, and comforting vanilla accords. An intimate, enduring aura designed for refined day-to-evening wear.",
  },
  {
    id: "ocean-breeze",
    name: "Ocean Breeze",
    notes: "Marine Accord · Sea Salt · Crisp Citrus",
    family: "Aquatic Fresh",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235102",
    image: bodyPerfume2,
    badge: "Bestseller",
    description:
      "Invigorating coastal marine notes kissed by ocean sea spray and crisp sunlit citrus. Evoking the brisk freshness of morning ocean winds.",
  },
  {
    id: "lone-legend",
    name: "Lone Legend",
    notes: "Smoky Woods · Rich Leather · Spiced Amber",
    family: "Woody Leather",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235103",
    image: bodyPerfume3,
    badge: "Bestseller",
    description:
      "Bold, mysterious, and unapologetically distinct. Rich spiced amber layered over aged cedarwood and dark leather undertones.",
  },
  {
    id: "ocean-breeze-men",
    name: "Ocean Breeze Men",
    notes: "Aquatic Mint · Cedarwood · Bergamot",
    family: "Aromatic Aquatic",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235104",
    image: bodyPerfume4,
    badge: "Bestseller",
    description:
      "A sharp, masculine oceanic surge pairing zesty Italian bergamot with crushed mint and a grounded, cedarwood base.",
  },
  {
    id: "ivory-oud",
    name: "Ivory Oud",
    notes: "Precious Agarwood · White Florals · Musk",
    family: "Oud Floral",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235105",
    image: bodyPerfume5,
    badge: "Bestseller",
    description:
      "A sophisticated modern oud softened with delicate white petals and cream musk. Opulent yet wearable, bridging regal depth and modern grace.",
  },
  {
    id: "wild-essence",
    name: "Wild Essence",
    notes: "Botanical Green · Forest Moss · Earthy Woods",
    family: "Chypre Green",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235106",
    image: bodyPerfume6,
    badge: "Artisanal",
    description:
      "Untamed botanical harmony inspired by deep untouched forests. Crisp verdant leaves, damp oakmoss, and aromatic vetiver roots.",
  },
  {
    id: "crimson-charm",
    name: "Crimson Charm",
    notes: "Damask Rose · Red Berries · Sandalwood",
    family: "Fruity Floral",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235107",
    image: bodyPerfume7,
    badge: "Romantic",
    description:
      "An intoxicating composition of velvety crimson rose petals, succulent wild berries, and a lingering, sensual sandalwood base.",
  },
  {
    id: "scarlet-spirit",
    name: "Scarlet Spirit",
    notes: "Spiced Plum · Dark Florals · Warm Patchouli",
    family: "Oriental Floral",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235108",
    image: bodyPerfume8,
    badge: "Bold",
    description:
      "Exuberant and passionate. Luminous dark florals woven with warm spiced plum notes and patchouli for a hypnotic signature trail.",
  },
  {
    id: "pure-musk",
    name: "Pure Musk",
    notes: "White Musk · Powdery Florals · Clean Iris",
    family: "Musk Floral",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235109",
    image: bodyPerfume9,
    badge: "Timeless",
    description:
      "Serene, clean, and softly seductive. Intimate powdery white musk enveloping skin like a whisper of cashmere on a calm morning.",
  },
  {
    id: "ice-wave",
    name: "Ice Wave",
    notes: "Glacial Mint · Eucalyptus · Crisp Amber",
    family: "Frost Aromatic",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235110",
    image: bodyPerfume10,
    badge: "Refreshing",
    description:
      "A chilled rush of crystalline mint and glacial freshness tempered with soft modern woods. Crisp, exhilarating, and intensely revitalizing.",
  },
  {
    id: "visionary",
    name: "Visionary",
    notes: "Golden Amber · Rare Woods · Spiced Saffron",
    family: "Warm Spicy",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235111",
    image: bodyPerfume11,
    badge: "Signature",
    description:
      "Formulated for the trailblazer. Luxurious golden amber illuminated by precious saffron threads and deep roasted woods.",
  },
  {
    id: "royal-noir",
    name: "Royal Noir",
    notes: "Dark Woods · Black Pepper · Smoky Incense",
    family: "Woody Amber",
    category: "perfumes",
    price: 569,
    size: "30 ml",
    sku: "2235112",
    image: bodyPerfume12,
    badge: "Luxury",
    description:
      "Regal nocturnal majesty. Dark woods, black pepper spices, and hypnotic frankincense create an unforgettable atmosphere of luxury.",
  },

  // ESSENCE OILS
  {
    id: "patchouli-oil",
    name: "Patchouli Oil",
    notes: "Earthy · Musky · Exotic",
    family: "Essential",
    category: "essence-oils",
    price: 599,
    image: essence1,
    badge: "Bestseller",
    botanicalName: "Pogostemon cablin",
    size: "10 ml",
    description:
      "Rich, earthy patchouli prized for fragrance stability. Perfect for fine fragrances and perfumes.",
  },
  {
    id: "rosemary-oil",
    name: "Rosemary Oil",
    notes: "Herbal · Refreshing · Woody",
    family: "Essential",
    category: "essence-oils",
    price: 399,
    image: essence2,
    badge: "Bestseller",
    botanicalName: "Rosmarinus officinalis",
    size: "10 ml",
    description:
      "Herbal and refreshing. Widely used in hair care, room fragrances, and wellness products.",
  },
  {
    id: "citronella-oil",
    name: "Citronella Oil",
    notes: "Fresh · Herbal · Citrus",
    family: "Essential",
    category: "essence-oils",
    price: 275,
    image: essence3,
    badge: "Bestseller",
    botanicalName: "Cymbopogon winterianus",
    size: "10 ml",
    description:
      "Fresh herbal fragrance. Widely used in insect-repellent products, soaps, and cosmetics.",
  },
  {
    id: "geranium-oil",
    name: "Geranium Oil",
    notes: "Rose-like · Floral · Sweet",
    family: "Essential",
    category: "essence-oils",
    price: 550,
    image: essence4,
    badge: "Bestseller",
    botanicalName: "Pelargonium graveolens",
    size: "10 ml",
    description: "Sweet floral aroma extensively used in cosmetics and personal care formulations.",
  },
  {
    id: "palmarosa-oil",
    name: "Palmarosa Oil",
    notes: "Rose-like · Fragrant · Sweet",
    family: "Essential",
    category: "essence-oils",
    price: 425,
    image: essence5,
    badge: "Bestseller",
    botanicalName: "Cymbopogon martinii",
    size: "10 ml",
    description: "Rich in natural geraniol. Ideal cosmetic ingredient and excellent blending oil.",
  },
  {
    id: "lavender-oil",
    name: "Lavender Oil",
    notes: "Floral · Calming · Sweet",
    family: "Essential",
    category: "essence-oils",
    price: 450,
    image: essence6,
    badge: "Premium Oil",
    botanicalName: "Lavandula officinalis",
    size: "10 ml",
    description: "Calming and sweet. Popular in aromatherapy, wellness, skincare, and perfumery.",
  },
  {
    id: "lemongrass-oil",
    name: "Lemongrass Oil",
    notes: "Fresh · Citrus · Herbal",
    family: "Essential",
    category: "essence-oils",
    price: 299,
    image: essence7,
    badge: "Fresh",
    botanicalName: "Cymbopogon flexuosus",
    size: "10 ml",
    description:
      "Fresh citrus scent. A major source of natural citral used in personal care and fragrances.",
  },
  {
    id: "menthol-oil",
    name: "Menthol Mint Oil",
    notes: "Cooling · Refreshing · Mint",
    family: "Essential",
    category: "essence-oils",
    price: 325,
    image: essence8,
    badge: "Premium Oil",
    botanicalName: "Mentha arvensis",
    size: "10 ml",
    description:
      "Strong cooling effect. Popular wellness ingredient used in oral care and personal care products.",
  },
  {
    id: "vetiver-oil",
    name: "Vetiver Oil",
    notes: "Deep · Earthy · Woody",
    family: "Essential",
    category: "essence-oils",
    price: 650,
    image: essence9,
    badge: "Rare Oil",
    botanicalName: "Chrysopogon zizanioides",
    size: "10 ml",
    description:
      "Deep earthy woody notes. Excellent perfume fixative used in attars and luxury fragrances.",
  },

  // CAR PERFUMES (5 New Products - 8ml / ₹189)
  {
    id: "car-arctic-mist",
    name: "Arctic Mist",
    notes: "Glacial Mint · Clean Air · Cool Ozone",
    family: "Automotive Fresh",
    category: "car-perfumes",
    price: 189,
    size: "8 ml",
    sku: "5573101",
    image: carPerfume1,
    badge: "Bestseller",
    description:
      "A breath of pristine arctic mountain air. Diffuses crisp glacial mint and clean ozone notes to keep your car interior permanently fresh and uplifting.",
  },
  {
    id: "car-royal-valley",
    name: "Royal Valley",
    notes: "Lush Pine · Valley Florals · Damp Cedar",
    family: "Automotive Woody",
    category: "car-perfumes",
    price: 189,
    size: "8 ml",
    sku: "5573102",
    image: carPerfume2,
    badge: "Bestseller",
    description:
      "Inspired by royal valley woodlands. Fresh alpine pine, crushed green needles, and sweet morning blossom for a serene, luxurious driving ambience.",
  },
  {
    id: "car-regal-oud",
    name: "Regal Oud",
    notes: "Oriental Oud · Ambergris · Warm Spices",
    family: "Automotive Luxury",
    category: "car-perfumes",
    price: 189,
    size: "8 ml",
    sku: "5573103",
    image: carPerfume3,
    badge: "Bestseller",
    description:
      "An opulent hanging diffuser releasing velvety agarwood, warm golden amber, and subtle spice to elevate your vehicle into a palace lounge.",
  },
  {
    id: "car-amber-heritage",
    name: "Amber Heritage",
    notes: "Golden Amber · Sandalwood · Sweet Vanilla",
    family: "Automotive Amber",
    category: "car-perfumes",
    price: 189,
    size: "8 ml",
    sku: "5573104",
    image: carPerfume4,
    badge: "Bestseller",
    description:
      "Timeless warmth. Rich amber resin blended with heritage Mysore sandalwood to deliver a calming, premium atmosphere on every journey.",
  },
  {
    id: "car-mystic-musk",
    name: "Mystic Musk",
    notes: "White Musk · Soft Petals · Clean Linen",
    family: "Automotive Fresh",
    category: "car-perfumes",
    price: 189,
    size: "8 ml",
    sku: "5573105",
    image: carPerfume5,
    badge: "Bestseller",
    description:
      "Pure, delicate white musk and gentle blossoms create an aura of pristine cleanliness and comforting elegance in your cabin.",
  },

  // AGARBATTI
  {
    id: "agarbatti-premium",
    name: "Premium Agarbatti Sticks",
    notes: "Floral · Woody · Soothing",
    family: "Traditional",
    category: "agarbatti",
    price: 399,
    image: agarbatti1,
    badge: "Bestseller",
    size: "Box",
    description:
      "Fragrances inspired by Indian traditions. Floral and woody scent profiles for prayer spaces and meditation.",
  },
  {
    id: "agarbatti-deluxe",
    name: "Deluxe Incense Collection",
    notes: "Woody · Floral · Aromatic",
    family: "Traditional",
    category: "agarbatti",
    price: 499,
    image: agarbatti2,
    badge: "Bestseller",
    size: "Box",
    description:
      "Premium incense products for rituals and everyday moments. Creates an atmosphere of calm and familiarity.",
  },
  {
    id: "agarbatti-pyramid",
    name: "Pyramid Premium Dhoop Sticks",
    notes: "Woody · Herbal · Pure",
    family: "Traditional",
    category: "agarbatti",
    price: 599,
    image: agarbatti3,
    badge: "Bestseller",
    size: "Pyramid Pack",
    description:
      "Premium pyramid dhoop sticks in traditional style. Perfect for creating peaceful ambience in any space.",
  },
  {
    id: "agarbatti-sandalwood",
    name: "Sandalwood Premium Agarbatti",
    notes: "Pure Sandalwood · Sacred Amber · Forest Resin",
    family: "Traditional",
    category: "agarbatti",
    price: 449,
    image: agarbatti4,
    badge: "Bestseller",
    size: "Box of 50",
    description:
      "Handcrafted artisanal sandalwood incense sticks composed with pure sandalwood paste and sacred aromatic resins for devotional serenity and lasting peace.",
  },

  // SOAPS
  {
    id: "soap-signature",
    name: "Artisan Signature Soap",
    notes: "Botanical · Creamy · Gentle",
    family: "Personal Care",
    category: "soaps",
    price: 249,
    image: soap1,
    badge: "Bestseller",
    size: "100 g",
    description:
      "A cold-process bathing bar infused with pure botanical essence oils. Creamy lather and a soft, lingering fragrance for daily luxury.",
  },
  {
    id: "soap-varad-ring",
    name: "Artisan Scent Aromatics Soap Ring",
    notes: "Floral · Woody · Rich",
    family: "Personal Care",
    category: "soaps",
    price: 299,
    image: soap2,
    badge: "Bestseller",
    size: "125 g",
    description:
      "An aromatic artisan soap ring enriched with essential oils, crafted for a rich, fragrant cleanse and a refined shelf presence.",
  },
  {
    id: "soap-green-heart",
    name: "Luxury Green Heart Botanical Soap",
    notes: "Wild Aloe · Herbal Green · Vetiver Dew",
    family: "Personal Care",
    category: "soaps",
    price: 289,
    image: soap3,
    badge: "Bestseller",
    size: "100 g",
    description:
      "A soothing handcrafted heart-shaped botanical soap enriched with pure aloe extracts, nourishing plant oils, and calming herbal essence for a velvety, refreshing spa lather.",
  },
  {
    id: "soap-pearlescent-flower",
    name: "Pearlescent Flower Artisan Soap",
    notes: "White Jasmine · Lotus Blossom · Sweet Almond",
    family: "Personal Care",
    category: "soaps",
    price: 299,
    image: soap4,
    badge: "Bestseller",
    size: "110 g",
    description:
      "An exquisitely sculpted floral bathing bar infused with fragrant night jasmine, lotus nectar, and sweet almond oil, leaving skin delicately scented, soft, and radiant.",
  },
  {
    id: "soap-turquoise-spa",
    name: "Premium Turquoise Spa Bath Bar",
    notes: "Ocean Mineral · Sea Kelp · Crushed Mint",
    family: "Personal Care",
    category: "soaps",
    price: 279,
    image: soap5,
    badge: "Bestseller",
    size: "105 g",
    description:
      "An invigorating coastal spa bar formulated with marine minerals, nutrient-dense sea kelp, and crisp mint for a restorative, energizing daily cleanse.",
  },

  // GIFTING (3 Luxury Gift Sets)
  {
    id: "gift-luxury-set",
    name: "Artisan Scents Luxury Gift Set",
    notes: "Signature Extrait · Hanging Car Diffuser · Botanical Flower Soap",
    family: "Luxury Gift Set",
    category: "gifting",
    price: 1499,
    image: giftSet1,
    badge: "Bestseller",
    size: "4-Piece Bespoke Set",
    description:
      "An exquisite introductory presentation box featuring two luxury extrait flacons, an artisanal wooden hanging car diffuser, and a hand-sculpted pearlescent flower soap.",
  },
  {
    id: "gift-fragrance-deluxe-set",
    name: "Artisan Scents Grand Deluxe Gift Hamper",
    notes: "Full Olfactory Collection · Extrait · Diffusers · Soaps · Essence Oils",
    family: "Grand Hamper",
    category: "gifting",
    price: 2999,
    image: giftSet2,
    badge: "Grand Luxury",
    size: "10-Piece Grand Hamper",
    description:
      "The ultimate royal olfactory indulgence: two extrait perfumes, dual hanging car diffusers, hand-rolled incense sticks, triple botanical bathing bars, and therapeutic essence oils in an embossed gold keepsake box.",
  },
  {
    id: "gift-perfume-collection",
    name: "Artisan Scents Luxury Perfume Collection",
    notes: "Ivory Amber · Ocean Breeze · Crimson Charm · Lone Legend",
    family: "Parfum Coffret",
    category: "gifting",
    price: 1999,
    image: giftSet3,
    badge: "Connoisseur Edition",
    size: "4 × 30 ml Coffret",
    description:
      "A prestigious coffret of four 30ml extrait de parfum masterworks presented in a lavish gold-embossed presentation box. An unforgettable signature gift for fine fragrance enthusiasts.",
  },
];

export const money = (amount: number) => `₹${amount}`;

export const PRODUCTS_STORAGE_KEY = "artisanscent_live_catalog_v10";
export const PRODUCTS_UPDATED_EVENT = "artisanscent:products-updated";

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return products;
  try {
    const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (!raw) {
      // Clear legacy storage keys
      localStorage.removeItem("artisanscent_live_catalog");
      localStorage.removeItem("artisanscent_live_catalog_v2");
      localStorage.removeItem("artisanscent_live_catalog_v3");
      localStorage.removeItem("artisanscent_live_catalog_v4");
      localStorage.removeItem("artisanscent_live_catalog_v5");
      localStorage.removeItem("artisanscent_live_catalog_v6");
      localStorage.removeItem("artisanscent_live_catalog_v7");
      localStorage.removeItem("artisanscent_live_catalog_v8");
      localStorage.removeItem("artisanscent_live_catalog_v9");
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      return products;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      const hasOldProducts = parsed.some(
        (p: Product) =>
          p.id === "agarbatti-sacred-temple" ||
          p.id === "agarbatti-mysore-sandal" ||
          p.id === "soap-lavender-botanical" ||
          p.id === "soap-varad-aromatics" ||
          p.id === "soap-nourishing-clay" ||
          p.id === "gold-faceted" ||
          p.id === "midnight-mystery" ||
          p.id === "car-classic" ||
          p.id === "car-wooden"
      );
      const missingNewProducts =
        !parsed.some((p: Product) => p.id === "gift-luxury-set") ||
        !parsed.some((p: Product) => p.id === "agarbatti-sandalwood") ||
        !parsed.some((p: Product) => p.id === "soap-green-heart");
      if (hasOldProducts || missingNewProducts) {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
        return products;
      }
      return parsed.map((p: Product) => {
        const fresh = products.find((prod) => prod.id === p.id);
        if (fresh) {
          return { ...p, image: fresh.image };
        }
        return p;
      });
    }
  } catch {
    // fallback to initial
  }
  return products;
}

export function saveStoredProducts(updatedList: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new CustomEvent(PRODUCTS_UPDATED_EVENT, { detail: updatedList }));
  } catch (e) {
    console.error("Failed to save products to localStorage", e);
  }
}

export function useProducts(): Product[] {
  const [currentProducts, setCurrentProducts] = useState<Product[]>(products);

  useEffect(() => {
    // Sync on mount
    setCurrentProducts(getStoredProducts());

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<Product[]>;
      if (customEvent.detail && Array.isArray(customEvent.detail)) {
        setCurrentProducts(customEvent.detail);
      } else {
        setCurrentProducts(getStoredProducts());
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === PRODUCTS_STORAGE_KEY) {
        setCurrentProducts(getStoredProducts());
      }
    };

    window.addEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(PRODUCTS_UPDATED_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return currentProducts;
}
