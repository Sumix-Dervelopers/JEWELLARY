/*
 * Lightweight slug registry for Proxy, which should not import the catalogue (it pulls in images).
 * A unit test (src/lib/slugs.test.ts) fails if these drift from the data files.
 * When products come from a backend, replace this with a lookup or remove the Proxy check.
 */
export const knownSlugs = {
  products: [
    "aurelle-solitaire-ring",
    "sera-stacking-set",
    "vow-bridal-pair",
    "pear-drop-pendant",
    "duet-layered-necklace",
    "verdant-emerald-pendant",
    "luna-pearl-drops",
    "lumen-line-bracelet",
  ],
  collections: ["rings", "necklaces", "earrings", "bracelets", "bridal", "signature"],
  journal: [
    "finding-your-signature-ring",
    "how-to-layer-necklaces",
    "jewellery-for-meaningful-occasions",
    "caring-for-fine-jewellery",
  ],
} as const;
