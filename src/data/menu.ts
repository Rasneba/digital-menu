/**
 * Yegesha Coffee — Menu
 * Single-origin Gesha, roasted at origin in Addis Ababa.
 */

export type Tag = "V" | "VG" | "GF" | "N" | "S";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  /** Pexels photo id */
  photo: number;
  tags?: Tag[];
}

export interface MenuCategory {
  id: string;
  numeral: string;
  title: string;
  tagline: string;
  note: string;
  /** Pexels photo id used for the full-bleed chapter plate */
  photo: number;
  items: MenuItem[];
}

export const brand = {
  name: "Yegesha Coffee",
  subtitle: "Specialty Café & Roastery",
  volume: "Menu · Addis Ababa",
  season: "Single Origin Gesha",
  established: "Addis Ababa",
  address: "Addis Ababa, Ethiopia",
  phone: "",
  hours: "Daily",
  addressShort: "Addis Ababa",
  city: "Addis Ababa",
  tagline: "Where Gesha comes home.",
  about:
    "A specialty café and roastery serving single-origin Gesha, grown in its birthplace and roasted at origin in Addis Ababa. Every cup reflects one variety, one source, and an unbroken journey from farm to cup.",
  taxNote: "All prices are inclusive of 5% SC & 15% VAT.",
};

export const categories: MenuCategory[] = [
  {
    id: "roasted-coffee",
    numeral: "I",
    title: "Roasted Coffee",
    tagline: "Single-origin Gesha, 250g",
    note: "100% Gesha — Single Origin, Gorigesha Mountain Coffee Plantation, Altitude: 1750–1850 masl, Classic Natural Process.",
    photo: 39529661,
    items: [
      {
        id: "classic-250g",
        name: "Classic - 250g",
        description:
          "Cupping Notes: Mandarin, Stone Fruits, Grape, and Peach with a Short, Clean, Pleasant Finish.",
        price: 2000,
        photo: 2756990,
        tags: ["VG", "GF"],
      },
      {
        id: "premium-250g",
        name: "Premium - 250g",
        description:
          "Cupping Notes: Mandarin, Stone Fruits, Grape, and Peach with a Short, Clean, Pleasant Finish.",
        price: 3000,
        photo: 34910280,
        tags: ["VG", "GF"],
      },
      {
        id: "elite-kolgai-250g",
        name: "Elite - Kolgai - 250g",
        description:
          "Cup Notes: Cocoa nib, lilac, honey-like sweetness, syrupy body.",
        price: 2900,
        photo: 14633306,
        tags: ["VG", "GF"],
      },
    ],
  },
  {
    id: "brewed-coffee",
    numeral: "II",
    title: "Brewed Coffee",
    tagline: "Espresso, pour-over and cold brew",
    note: "Espresso, Ristretto, Americano, Lungo, Cold Brew, Siphon, V60, Chemex, Aeropress.",
    photo: 34255748,
    items: [
      {
        id: "espresso",
        name: "Espresso",
        description: "Single shot of specialty espresso.",
        price: 300,
        photo: 2756990,
        tags: ["VG", "GF"],
      },
      {
        id: "espresso-tester",
        name: "Espresso Tester (2 Cup)",
        description: "Two cups of specialty espresso.",
        price: 300,
        photo: 2756990,
        tags: ["VG", "GF"],
      },
      {
        id: "ristretto",
        name: "Ristretto",
        description: "Short, concentrated shot of espresso.",
        price: 300,
        photo: 34910280,
        tags: ["VG", "GF"],
      },
      {
        id: "ristretto-tester",
        name: "Ristretto Tester (2 Cup)",
        description: "Two cups of ristretto.",
        price: 300,
        photo: 34910280,
        tags: ["VG", "GF"],
      },
      {
        id: "americano",
        name: "Classic Americano",
        description: "Espresso, White sugar.",
        price: 300,
        photo: 14633306,
        tags: ["VG", "GF"],
      },
      {
        id: "iced-americano",
        name: "Iced Americano",
        description: "Espresso, White sugar.",
        price: 300,
        photo: 34255748,
        tags: ["VG", "GF"],
      },
      {
        id: "lungo",
        name: "Lungo",
        description: "Long-pull espresso.",
        price: 300,
        photo: 34255748,
        tags: ["VG", "GF"],
      },
      {
        id: "cold-brew",
        name: "Cold Brew Coffee",
        description: "Coffee.",
        price: 450,
        photo: 2756990,
        tags: ["VG", "GF"],
      },
      {
        id: "siphon",
        name: "Siphon",
        description: "Coffee.",
        price: 450,
        photo: 34910280,
        tags: ["VG", "GF"],
      },
      {
        id: "v60",
        name: "V60 Drip",
        description: "Coffee.",
        price: 450,
        photo: 14633306,
        tags: ["VG", "GF"],
      },
      {
        id: "chemex",
        name: "Chemex",
        description: "Coffee.",
        price: 600,
        photo: 34255748,
        tags: ["VG", "GF"],
      },
      {
        id: "aeropress",
        name: "Aeropress",
        description: "Coffee.",
        price: 450,
        photo: 2756990,
        tags: ["VG", "GF"],
      },
    ],
  },
  {
    id: "milk-based",
    numeral: "III",
    title: "Milk Based",
    tagline: "Espresso with steamed milk",
    note: "All fasting drinks come with soy, almond, oats or coconut milk.",
    photo: 3070968,
    items: [
      {
        id: "brown-sugar-shaken",
        name: "Brown Sugar Shaken Espresso",
        description: "Cow's milk (or oat, soy, almond or coconut milk), Brown sugar, Espresso.",
        price: 450,
        photo: 34910280,
        tags: ["N"],
      },
      {
        id: "italian-macchiato",
        name: "Italian Macchiato",
        description: "Cow's milk, Espresso, White sugar.",
        price: 300,
        photo: 14633306,
        tags: [],
      },
      {
        id: "macchiato",
        name: "Macchiato",
        description: "Cow's milk, Espresso, White sugar.",
        price: 300,
        photo: 14633306,
        tags: [],
      },
      {
        id: "flat-white",
        name: "Flat White",
        description: "Cow's milk, Espresso, White sugar.",
        price: 350,
        photo: 34255748,
        tags: [],
      },
      {
        id: "caramel-macchiato",
        name: "Caramel Macchiato",
        description: "Cow's milk, Espresso, Caramel syrup, White sugar.",
        price: 400,
        photo: 34910280,
        tags: [],
      },
      {
        id: "salted-caramel-macchiato",
        name: "Salted Caramel Macchiato",
        description: "Cow's milk, Espresso, Salted caramel syrup, White sugar.",
        price: 400,
        photo: 34910280,
        tags: [],
      },
      {
        id: "cortado",
        name: "Cortado",
        description: "Cow's milk, Espresso, White sugar.",
        price: 350,
        photo: 14633306,
        tags: [],
      },
      {
        id: "cappuccino",
        name: "Cappuccino",
        description: "Cow's milk, Cocoa powder, Espresso, White sugar.",
        price: 400,
        photo: 34910280,
        tags: [],
      },
      {
        id: "cafe-latte",
        name: "Cafe Latte",
        description: "Cow's milk, Espresso, White sugar.",
        price: 400,
        photo: 34910280,
        tags: [],
      },
      {
        id: "pistachio-latte",
        name: "Pistachio Latte",
        description: "",
        price: 750,
        photo: 34255748,
        tags: ["N"],
      },
      {
        id: "mocha-latte",
        name: "Mocha Latte",
        description: "Cow's milk, Espresso, White sugar, Chocolate syrup, Mocha moka syrup.",
        price: 700,
        photo: 34910280,
        tags: ["N"],
      },
      {
        id: "caramel-latte",
        name: "Caramel Latte",
        description: "Cow's milk, Espresso, Caramel syrup, White sugar.",
        price: 650,
        photo: 34910280,
        tags: [],
      },
      {
        id: "salted-caramel-latte",
        name: "Salted Caramel Latte",
        description: "Cow's milk, Espresso, Salted caramel syrup, White sugar.",
        price: 650,
        photo: 34910280,
        tags: [],
      },
      {
        id: "vanilla-latte",
        name: "Vanilla Latte",
        description: "",
        price: 700,
        photo: 34910280,
        tags: [],
      },
      {
        id: "nutella-latte",
        name: "Nutella Latte",
        description: "Cow's milk, Nutella, Espresso, White sugar.",
        price: 750,
        photo: 34910280,
        tags: ["N"],
      },
      {
        id: "iced-latte",
        name: "Iced Latte",
        description: "Cow's milk, Espresso, White sugar.",
        price: 400,
        photo: 34255748,
        tags: [],
      },
      {
        id: "iced-caramel-latte",
        name: "Iced Caramel Latte",
        description: "Cow's milk, Espresso, Caramel syrup, White sugar.",
        price: 650,
        photo: 34255748,
        tags: [],
      },
      {
        id: "iced-salted-caramel-latte",
        name: "Iced Salted Caramel Latte",
        description: "Cow's milk, Espresso, Salted caramel syrup, White sugar.",
        price: 650,
        photo: 34255748,
        tags: [],
      },
      {
        id: "iced-mocha-latte",
        name: "Iced Mocha Latte",
        description: "Cow's milk, Espresso, White sugar, Chocolate syrup, Mocha moka syrup.",
        price: 700,
        photo: 34255748,
        tags: ["N"],
      },
      {
        id: "iced-pistachio-latte",
        name: "Iced Pistachio Latte",
        description: "",
        price: 750,
        photo: 34255748,
        tags: ["N"],
      },
      {
        id: "iced-vanilla-latte",
        name: "Iced Vanilla Latte",
        description: "",
        price: 700,
        photo: 34255748,
        tags: [],
      },
    ],
  },
  {
    id: "cold-drinks",
    numeral: "IV",
    title: "Cold Drinks & Others",
    tagline: "Iced teas, mojitos and soft drinks",
    note: "Refreshing non-coffee beverages.",
    photo: 17303318,
    items: [
      {
        id: "strawberry-mojito",
        name: "Strawberry Mojito",
        description: "Strawberry syrup, Soft drink, White sugar, Mint leaves, Lemon, Strawberry.",
        price: 450,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "iced-green-tea",
        name: "Iced Green Tea",
        description: "Green tea, White sugar, Mint leaves.",
        price: 250,
        photo: 17580946,
        tags: ["VG", "GF"],
      },
      {
        id: "classic-mojito",
        name: "Classic Mojito",
        description: "Soft drink, White sugar, Mint leaves, Lemon.",
        price: 450,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "tea",
        name: "Tea",
        description: "Black tea, Cinnamon stick, Clove, White sugar.",
        price: 200,
        photo: 17580946,
        tags: ["VG", "GF"],
      },
      {
        id: "ice-tea",
        name: "Ice Tea",
        description: "Black tea, White sugar, Mint leaves.",
        price: 250,
        photo: 17580946,
        tags: ["VG", "GF"],
      },
      {
        id: "flavored-tea",
        name: "Flavored Tea",
        description: "Green tea, White sugar.",
        price: 200,
        photo: 17580946,
        tags: ["VG", "GF"],
      },
      {
        id: "special-tea-no-alcohol",
        name: "Special Tea Without Alcohol",
        description: "Honey, Pineapple, White sugar, Hibiscus tea, Ginger.",
        price: 350,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "special-tea-with-alcohol",
        name: "Special Tea With Alcohol",
        description: "Ouzo, Honey, Pineapple, White sugar, Hibiscus tea, Ginger.",
        price: 450,
        photo: 3070968,
      },
      {
        id: "water-600ml",
        name: "600ml - Water",
        description: "",
        price: 100,
        photo: 17303318,
        tags: ["VG", "GF"],
      },
      {
        id: "soft-drink",
        name: "Soft Drink",
        description: "",
        price: 120,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "ambo-water",
        name: "Ambo Water",
        description: "",
        price: 120,
        photo: 17303318,
        tags: ["VG", "GF"],
      },
    ],
  },
  {
    id: "juice",
    numeral: "V",
    title: "Juice",
    tagline: "Fresh blended juices",
    note: "Blended with milk, honey and water over ice.",
    photo: 3070968,
    items: [
      {
        id: "peanut-butter-espresso",
        name: "Peanut Butter Espresso",
        description: "Espresso, peanut butter, and banana blended with milk and honey over ice.",
        price: 550,
        photo: 3070968,
        tags: ["N"],
      },
      {
        id: "mango-passion",
        name: "Mango Passion",
        description: "Ripe mango and passion fruit blended with milk, honey, and water over ice.",
        price: 500,
        photo: 3070968,
        tags: [],
      },
      {
        id: "avocado-noir",
        name: "Avocado Noir",
        description: "Avocado blended with milk, honey, and a squeeze of lemon over ice, finished with chocolate syrup.",
        price: 450,
        photo: 3070968,
        tags: [],
      },
      {
        id: "tropical-sunrise",
        name: "Tropical Sunrise",
        description: "Orange, pineapple, and mango with lemon and honey, blended with water over ice.",
        price: 550,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "melon-cold-brew",
        name: "Melon Cold Brew",
        description: "Watermelon and fresh mint shaken with cold brew coffee, lemon, and honey over ice.",
        price: 500,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "pineapple-ginger",
        name: "Pineapple Ginger",
        description: "Fresh pineapple, ginger, lemon, and honey, blended with water over ice.",
        price: 550,
        photo: 3070968,
        tags: ["VG"],
      },
      {
        id: "papaya-passion-bliss",
        name: "Papaya Passion Bliss",
        description: "",
        price: 550,
        photo: 3070968,
        tags: ["VG"],
      },
    ],
  },
  {
    id: "breakfast",
    numeral: "VI",
    title: "Breakfast",
    tagline: "Savory and sweet crepes",
    note: "Flour Option: Classic or Mixed (teff flour and white flour).",
    photo: 16474891,
    items: [
      {
        id: "egg-crepe",
        name: "Egg Crepe",
        description: "A choice of eggs sautéed with tomato, onion & chili, served with avocado, mozzarella, baby leaves & tahini dressing.",
        price: 750,
        photo: 16474891,
      },
      {
        id: "tuna-crepe",
        name: "Tuna Crepe",
        description: "Hummus pesto, tuna, olive, tomato, cucumber, fresh greens, pickled radish.",
        price: 900,
        photo: 16474891,
      },
      {
        id: "tofu-crepe",
        name: "Tofu Crepe",
        description: "Scramble tofu, guacamole, mushrooms, spinach, cucumber & tomatoes.",
        price: 650,
        photo: 16474891,
        tags: ["VG"],
      },
    ],
  },
  {
    id: "lunch-dinner",
    numeral: "VII",
    title: "Lunch & Dinner",
    tagline: "Hearty crepes for any time of day",
    note: "Flour Option: Classic or Mixed (teff flour and white flour).",
    photo: 16474891,
    items: [
      {
        id: "beef-teriyaki-crepe",
        name: "Beef Teriyaki Crepe",
        description: "Fillet mignon with caramelized onions, spicy pickled daikon, fresh mixed greens, and a creamy salad mayo dressing.",
        price: 1250,
        photo: 16474891,
      },
      {
        id: "chicken-pesto-crepe",
        name: "Chicken Pesto Crepe",
        description: "Sautéed Chicken with pesto sauce and coleslaw salad.",
        price: 1250,
        photo: 16474891,
      },
      {
        id: "mushroom-chicken-crepe",
        name: "Mushroom Chicken Crepe",
        description: "Sauteed chicken, spinach, mushrooms, cream, mozzarella cheese, mayo, & coleslaw salad.",
        price: 1250,
        photo: 16474891,
      },
      {
        id: "mediterranean-crepe",
        name: "Mediterranean Crepe",
        description: "Feta cheese, garlic tofu, olive with tzatziki sauce.",
        price: 900,
        photo: 16474891,
        tags: ["V"],
      },
      {
        id: "ratatouille-crepe",
        name: "Ratatouille Crepe",
        description: "Ratatouille, fasting mayo, mixed salad with tahini dressing.",
        price: 650,
        photo: 16474891,
        tags: ["VG"],
      },
      {
        id: "choco-berry-crepe",
        name: "Choco Berry Crepe",
        description: "Chocolate spread, banana, and Strawberry.",
        price: 850,
        photo: 16474891,
        tags: ["V"],
      },
      {
        id: "fruit-nut-crepe",
        name: "Fruit & Nut Crepe",
        description: "Peanut butter spread, cinnamon-infused banana topped with strawberry compote & crushed nuts.",
        price: 600,
        photo: 16474891,
        tags: ["N"],
      },
    ],
  },
  {
    id: "pastries",
    numeral: "VIII",
    title: "Pastries",
    tagline: "Freshly baked treats",
    note: "Includes fasting-friendly options.",
    photo: 28438607,
    items: [
      {
        id: "plain-croissant",
        name: "Plain Croissant",
        description: "",
        price: 370,
        photo: 32300842,
        tags: ["V"],
      },
      {
        id: "chocolate-croissant",
        name: "Chocolate Croissant",
        description: "",
        price: 420,
        photo: 29978685,
        tags: ["V"],
      },
      {
        id: "chocolate-cake",
        name: "Chocolate Cake",
        description: "",
        price: 650,
        photo: 29978685,
        tags: ["V"],
      },
      {
        id: "cheese-cake",
        name: "Cheese Cake",
        description: "",
        price: 800,
        photo: 39332801,
        tags: ["V"],
      },
      {
        id: "mille-feuille",
        name: "Mille-feuille",
        description: "",
        price: 550,
        photo: 39332801,
        tags: ["V"],
      },
      {
        id: "fasting-chocolate-cake",
        name: "Fasting Chocolate Cake",
        description: "",
        price: 530,
        photo: 29978685,
        tags: ["VG"],
      },
      {
        id: "banana-cake",
        name: "Banana Cake",
        description: "",
        price: 300,
        photo: 28438607,
        tags: ["V"],
      },
      {
        id: "cookies-250g",
        name: "Cookies - 250g",
        description: "",
        price: 800,
        photo: 32300842,
        tags: ["V"],
      },
    ],
  },
  {
    id: "ice-cream",
    numeral: "IX",
    title: "Ice Cream",
    tagline: "Scoops of house ice cream",
    note: "",
    photo: 28438607,
    items: [
      {
        id: "oreo-cream-cheese",
        name: "Oreo Cream Cheese Ice Cream",
        description: "",
        price: 300,
        photo: 39332801,
        tags: ["V"],
      },
      {
        id: "vanilla",
        name: "Vanilla Ice Cream",
        description: "",
        price: 300,
        photo: 39332801,
        tags: ["V"],
      },
      {
        id: "pistachio",
        name: "Pistachio Ice Cream",
        description: "",
        price: 300,
        photo: 39332801,
        tags: ["N", "V"],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Image helpers                                                      */
/* ------------------------------------------------------------------ */

const CDN = "https://images.pexels.com/photos";

/* Keep the CDN parameters byte-compatible with the pipeline the menu was
   built and tested against. Modern-format negotiation (WebP/AVIF) via
   `auto=format` is deliberately not enabled: the CDN's response to it
   could not be verified from the build sandbox, and breaking the food
   photography is not an acceptable trade for the byte savings. See the
   project notes for how to enable it safely. */
export function photoSrc(id: number, width = 900) {
  return `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

export function photoFull(id: number) {
  return `${CDN}/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=2400`;
}

/* ------------------------------------------------------------------ */
/* Book structure — page count, page order, per-page imagery          */
/* ------------------------------------------------------------------ */

/** Total pages: cover + (chapter plate + dishes) per category + back cover. */
export const TOTAL_PAGES = 2 + categories.length * 2;

/** Photo used by the printed front cover (kept in sync with CoverPage). */
export const COVER_PHOTO = 39047893;
/** Photo used by the printed back cover (kept in sync with BackCoverPage). */
export const BACK_COVER_PHOTO = 34206671;

let pageImagesCache: Map<number, string[]> | null = null;

/** Image URLs grouped by book page index — used to preload pages around the reader. */
export function pagesImageUrls(): Map<number, string[]> {
  if (pageImagesCache) return pageImagesCache;
  const map = new Map<number, string[]>();
  map.set(0, [photoSrc(COVER_PHOTO, 1600)]);
  categories.forEach((category, i) => {
    map.set(1 + i * 2, [photoSrc(category.photo, 1400)]);
    map.set(
      2 + i * 2,
      category.items.map((item) => photoSrc(item.photo, 900)),
    );
  });
  map.set(TOTAL_PAGES - 1, [photoSrc(BACK_COVER_PHOTO, 1600)]);
  pageImagesCache = map;
  return map;
}


export const allPhotos: { id: number; name: string; category: string }[] =
  categories.flatMap((category) =>
    category.items.map((item) => ({
      id: item.photo,
      name: item.name,
      category: category.title,
    })),
  );

/* ------------------------------------------------------------------ */
/* Currency / FX                                                      */
/* ------------------------------------------------------------------ */

export type Currency = "ETB" | "USD" | "EUR";

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  ETB: "Br",
  USD: "$",
  EUR: "€",
};

export const CURRENCY_NAMES: Record<Currency, string> = {
  ETB: "Ethiopian Birr",
  USD: "US Dollar",
  EUR: "Euro",
};

/** Base currency is ETB. Rates: 1 ETB = X foreign currency. */
export const EXCHANGE_RATES: Record<Currency, number> = {
  ETB: 1,
  USD: 0.018,
  EUR: 0.017,
};

export function convert(amount: number, from: Currency, to: Currency): number {
  if (from === to) return amount;
  return amount * (EXCHANGE_RATES[to] / EXCHANGE_RATES[from]);
}

export function formatPrice(value: number, currency: Currency = "ETB"): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const formatted =
    currency === "ETB" ? Math.round(value).toLocaleString() : value.toFixed(2);
  return `${symbol}${formatted}`;
}

export const DEFAULT_CURRENCY: Currency = "ETB";
