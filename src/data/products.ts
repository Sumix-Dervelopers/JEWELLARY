import { site } from "@/config/site";
import type { Product, ProductVariantGroup } from "@/lib/types";
import { images } from "./images";

/*
 * DEMONSTRATION CATALOGUE
 * Names, prices and descriptions are illustrative. Material lines describe what each photograph
 * shows; they are not verified specifications (no metal purity, stone grade or origin is claimed).
 * Replace with confirmed product data, or connect a commerce backend, before launch.
 */

const ringSizes = (unavailable: string[] = []): ProductVariantGroup => ({
  name: `Ring size (${site.ringSizeStandard})`,
  options: site.ringSizes.map((size) => ({
    id: `size-${size}`,
    label: `${site.ringSizeStandard} ${size}`,
    available: !unavailable.includes(size),
  })),
});

const ringCare = [
  "Remove before swimming, cleaning or exercise.",
  "Wipe gently with a soft, dry cloth after wear.",
  "Store on its own in a lined box so stones cannot scratch other pieces.",
];

const chainCare = [
  "Fasten the clasp before storing to keep the chain from tangling.",
  "Put perfume and lotion on first, then your jewellery.",
  "Store flat or hanging, away from other pieces.",
];

export const products: Product[] = [
  {
    id: "p-aurelle",
    slug: "aurelle-solitaire-ring",
    name: "Aurelle Solitaire Ring",
    category: "rings",
    collections: ["signature", "bridal"],
    occasions: ["milestones", "wedding"],
    price: 485000,
    images: [
      { src: images.aurelle1, alt: "Close view of a round diamond held by six polished gold claws" },
      { src: images.aurelle2, alt: "A goldsmith's hands setting the solitaire with fine tweezers at a wooden bench" },
    ],
    summary: "A round brilliant held high in six slender claws.",
    description: [
      "Aurelle is the ring we return to: one round stone, lifted in six fine claws so light can reach it from every side.",
      "The band narrows as it meets the setting, letting the stone sit closer to the hand than it first appears.",
    ],
    materials: { metal: "Yellow gold", stones: "Round brilliant diamond" },
    details: ["Six-claw solitaire setting", "Tapered band"],
    care: ringCare,
    variants: ringSizes(),
    availability: "available",
    maxQuantity: 2,
    featured: true,
    addedOn: "2026-03-02",
  },
  {
    id: "p-sera",
    slug: "sera-stacking-set",
    name: "Sera Stacking Set",
    category: "rings",
    collections: [],
    occasions: ["milestones", "everyday"],
    price: 320000,
    images: [
      { src: images.sera1, alt: "Three gold rings stacked on one finger: a plain band, a diamond line band and a solitaire" },
      { src: images.collectionRings, alt: "A hand resting on ivory silk wearing the Sera stacking set" },
    ],
    summary: "Three rings, chosen to be worn together.",
    description: [
      "A plain band, a line of small diamonds and a single solitaire, proportioned to sit flush against one another.",
      "Wear all three, or let the set separate across the years as each one comes to mean something different.",
    ],
    materials: { metal: "Yellow gold", stones: "Round diamonds" },
    details: ["Set of three rings", "Bands sit flush when stacked", "Sold together"],
    care: ringCare,
    variants: ringSizes(["9"]),
    availability: "available",
    maxQuantity: 2,
    addedOn: "2026-02-10",
  },
  {
    id: "p-vow",
    slug: "vow-bridal-pair",
    name: "Vow Bridal Pair",
    category: "rings",
    collections: ["bridal"],
    occasions: ["wedding"],
    price: 640000,
    images: [
      { src: images.vow1, alt: "A bride's hand wearing a round diamond engagement ring with a matching diamond band" },
      { src: images.collectionBridal, alt: "A bride holding her veil, wearing the Vow bridal pair and a line bracelet" },
    ],
    summary: "An engagement ring and its band, made as one.",
    description: [
      "The Vow pair is designed together from the first sketch, so the band curves to meet the engagement ring without a gap.",
      "Made to order in your size, with time to talk through the stone before work begins.",
    ],
    materials: { metal: "Yellow gold", stones: "Round brilliant diamonds" },
    details: ["Engagement ring and fitted band", "Made to order", "Stone chosen in consultation"],
    care: ringCare,
    variants: ringSizes(),
    availability: "made-to-order",
    maxQuantity: 1,
    addedOn: "2026-01-18",
  },
  {
    id: "p-pear",
    slug: "pear-drop-pendant",
    name: "Pear Drop Pendant",
    category: "necklaces",
    collections: ["signature"],
    occasions: ["gifts-for-her", "milestones"],
    price: 275000,
    images: [
      { src: images.pear1, alt: "A pear-shaped diamond pendant on a fine gold chain resting below the collarbone" },
      { src: images.pear2, alt: "A woman in profile by a window wearing the Pear Drop pendant" },
    ],
    summary: "A single pear-shaped stone on a whisper of chain.",
    description: [
      "The pear shape points the eye down and in, which is why it suits almost every neckline.",
      "It hangs from a fine chain that rests just below the collarbone, close enough to catch the light when you turn.",
    ],
    materials: { metal: "Yellow gold", stones: "Pear-shaped diamond" },
    details: ["Fine trace chain", "Pendant moves freely on the chain", "Spring-ring clasp"],
    care: chainCare,
    availability: "available",
    maxQuantity: 3,
    featured: true,
    addedOn: "2026-04-21",
  },
  {
    id: "p-duet",
    slug: "duet-layered-necklace",
    name: "Duet Layered Necklace",
    category: "necklaces",
    collections: [],
    occasions: ["everyday", "gifts-for-her"],
    price: 98000,
    images: [
      { src: images.duet1, alt: "Two fine gold chains layered at the neck, the lower one holding a small bezel-set diamond" },
      { src: images.collectionNecklaces, alt: "The Duet necklace worn with a black off-shoulder neckline" },
    ],
    summary: "Two fine chains and a single bezel-set stone.",
    description: [
      "Two chains joined at one clasp, so they fall at their own lengths and never twist into each other.",
      "Light enough to sleep in, considered enough for an evening.",
    ],
    materials: { metal: "Yellow gold", stones: "Bezel-set diamond" },
    details: ["Two chains on a single clasp", "Bezel-set stone on the lower chain"],
    care: chainCare,
    availability: "available",
    maxQuantity: 3,
    newArrival: true,
    addedOn: "2026-09-12",
  },
  {
    id: "p-verdant",
    slug: "verdant-emerald-pendant",
    name: "Verdant Emerald Pendant",
    category: "necklaces",
    collections: ["signature"],
    occasions: ["milestones"],
    price: 790000,
    images: [
      { src: images.verdant1, alt: "An emerald-cut green stone framed in small diamonds on a gold chain over black silk" },
      { src: images.verdant2, alt: "Close view of the emerald's step-cut facets and its frame of diamonds" },
      { src: images.campaignEmerald, alt: "The Verdant pendant with its chain pooled across folds of black silk" },
    ],
    summary: "A deep green step-cut stone, framed in light.",
    description: [
      "The step cut is chosen for green stones because it shows depth rather than sparkle: long, quiet facets that look like still water.",
      "A narrow frame of small diamonds keeps the colour from reading as dark, even by candlelight.",
    ],
    materials: { metal: "Yellow gold", stones: "Emerald-cut green stone with diamond surround" },
    details: ["Four-claw centre setting", "Diamond halo", "Fine cable chain"],
    care: [
      "Green stones of this kind dislike heat and sudden changes in temperature.",
      "Clean only with a soft, dry cloth; avoid ultrasonic cleaners.",
      "Store apart from harder stones that could scratch it.",
    ],
    availability: "available",
    maxQuantity: 1,
    newArrival: true,
    addedOn: "2026-10-01",
  },
  {
    id: "p-luna",
    slug: "luna-pearl-drops",
    name: "Luna Pearl Drops",
    category: "earrings",
    collections: ["bridal"],
    occasions: ["wedding", "gifts-for-her"],
    price: 185000,
    images: [
      { src: images.luna1, alt: "A round white pearl hanging on a fine gold chain from a diamond stud" },
      { src: images.collectionEarrings, alt: "A woman in profile wearing the Luna pearl drop earrings" },
    ],
    summary: "A bright stud with a pearl that moves as you do.",
    description: [
      "A small round stud sits at the lobe; beneath it, a short length of chain lets the pearl swing freely.",
      "Pearls warm against the skin, which is part of why they are so often the first fine piece someone owns.",
    ],
    materials: { metal: "Yellow gold", stones: "Round pearl, diamond stud" },
    details: ["Sold as a pair", "Post and butterfly backs", "Pearl drop on a short chain"],
    care: [
      "Put pearls on last, after perfume, hairspray and make-up.",
      "Wipe with a soft, slightly damp cloth after wearing.",
      "Store in a soft pouch; pearls can scratch against metal and stones.",
    ],
    availability: "available",
    maxQuantity: 2,
    featured: true,
    addedOn: "2026-05-08",
  },
  {
    id: "p-lumen",
    slug: "lumen-line-bracelet",
    name: "Lumen Line Bracelet",
    category: "bracelets",
    collections: ["bridal"],
    occasions: ["milestones", "wedding"],
    price: 560000,
    images: [
      { src: images.lumen1, alt: "A diamond line bracelet worn beside a polished gold bangle on a travertine ledge" },
      { src: images.lumen2, alt: "The Lumen bracelet on a bride's wrist against ivory lace" },
      { src: images.collectionBracelets, alt: "A hand resting on warm travertine in late afternoon light, wearing the Lumen bracelet" },
    ],
    summary: "An unbroken line of light around the wrist.",
    description: [
      "Each stone is set in its own small cup and linked to the next, so the bracelet lies soft and flat rather than stiff.",
      "It is the kind of piece that is worn every day once it is owned, which is why the clasp has a second safety catch.",
    ],
    materials: { metal: "Yellow gold", stones: "Round diamonds" },
    details: ["Individually set stones", "Box clasp with safety catch", "Flexible links"],
    care: [
      "Check the clasp and safety catch from time to time.",
      "Avoid knocks against hard surfaces; a bracelet takes more wear than any other piece.",
      "Store flat in a lined box.",
    ],
    availability: "available",
    maxQuantity: 1,
    featured: true,
    addedOn: "2026-06-15",
  },
];
