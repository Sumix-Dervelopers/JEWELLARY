/**
 * Central brand configuration.
 *
 * Ratna Jewellers is a fictional Kathmandu jewellery store built as a portfolio concept. The contact
 * details and policies below are sample values (the email uses the reserved `.example` domain and
 * cannot receive mail). Values set to `null` are not shown on the site. Replace everything here with
 * verified details before using the site for a real business.
 */
export const site = {
  name: "Ratna Jewellers",
  wordmark: "RATNA JEWELLERS",
  tagline: "Jewellery that becomes part of your story.",
  description:
    "Ratna Jewellers is a fine-jewellery house in Thamel, Kathmandu: solitaires, pendants, pearls and bracelets designed for the moments that matter.",

  /** True while the site is shown as a portfolio piece; the footer then says so. */
  isPortfolioConcept: true,

  /** Studio credit in the footer. Set `href` to the studio's website to link it. */
  credit: { name: "Sumix Developers", href: null as string | null },

  /** Canonical origin, e.g. "https://ratnajewellers.com". Canonical URLs and the sitemap use it once set. */
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

  /** Sample details for the portfolio concept, not a real shop. */
  contact: {
    email: "hello@ratnajewellers.example" as string | null,
    phone: null as string | null,
    address: "Thamel, Kathmandu 44600, Nepal" as string | null,
    hours: "Sunday to Friday, 10:00 am to 6:00 pm (NPT)" as string | null,
  },

  /** Add verified profiles only, e.g. { label: "Instagram", href: "https://instagram.com/…" }. */
  social: [] as { label: string; href: string }[],

  /** Policy summaries shown on the Client Care page. `null` shows "details to follow". Sample copy. */
  policies: {
    delivery:
      "Complimentary insured delivery within the Kathmandu Valley, usually within two working days. Pieces can also be collected from our Thamel showroom." as string | null,
    returns:
      "Unworn pieces in their original packaging can be returned or exchanged within 14 days. Engraved and made-to-order pieces are final sale." as string | null,
    giftPresentation:
      "Every piece arrives in a Ratna Jewellers box with a handwritten card on request. Tell us the message when you place your enquiry." as string | null,
  },

  /** Messages for the announcement bar, rotated in order. Keep them factual. */
  announcements: [
    { text: "Introducing the Signature edit", href: "/collections/signature" },
    { text: "Visit our showroom in Thamel, Kathmandu", href: "/contact" },
    { text: "Save pieces to your wishlist, no account needed", href: "/wishlist" },
    { text: "Questions about sizing or stones? Send us an enquiry", href: "/contact" },
  ],
} as const;

export type Site = typeof site;
