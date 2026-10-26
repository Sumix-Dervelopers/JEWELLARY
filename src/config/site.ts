/**
 * Central brand configuration.
 *
 * Everything a business owner needs to confirm lives here. Values set to `null` are not shown on
 * the site; nothing in this file is invented on the brand's behalf. Replace them with verified
 * details before launch.
 */
export const site = {
  name: "Sumix Jewels",
  wordmark: "SUMIX JEWELS",
  tagline: "Jewellery that becomes part of your story.",
  description:
    "Sumix Jewels makes fine jewellery to be treasured: solitaires, pendants, pearls and bracelets designed for the moments that matter.",

  /** Canonical origin, e.g. "https://sumixjewels.com". Canonical URLs and the sitemap use it once set. */
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? null,

  currency: {
    code: "NPR",
    /** en-IN gives lakh grouping (4,85,000) and the "Rs" symbol used in Nepal and India. */
    locale: "en-IN",
    display: "narrowSymbol" as const,
    label: "Nepalese rupees",
  },

  /** Ring sizes offered on ring listings. Confirm the sizing standard you use. */
  ringSizes: ["5", "6", "7", "8", "9"],
  ringSizeStandard: "US",

  /**
   * While true, every product page states that the listing is a demonstration and
   * product structured data is withheld from search engines.
   */
  catalogueIsDemo: true,

  contact: {
    email: null as string | null,
    phone: null as string | null,
    address: null as string | null,
    hours: null as string | null,
  },

  /** Add verified profiles only, e.g. { label: "Instagram", href: "https://instagram.com/…" }. */
  social: [] as { label: string; href: string }[],

  /** Policy summaries shown on the Client Care page. `null` shows "details to follow". */
  policies: {
    delivery: null as string | null,
    returns: null as string | null,
    giftPresentation: null as string | null,
  },

  /** Messages for the announcement bar, rotated in order. Keep them factual. */
  announcements: [
    { text: "Introducing the Signature edit", href: "/collections/signature" },
    { text: "Save pieces to your wishlist, no account needed", href: "/wishlist" },
    { text: "Questions about sizing or stones? Send us an enquiry", href: "/contact" },
  ],
} as const;

export type Site = typeof site;
