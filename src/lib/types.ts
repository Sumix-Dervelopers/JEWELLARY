import type { StaticImageData } from "next/image";

export type CategorySlug = "rings" | "necklaces" | "earrings" | "bracelets";
export type OccasionSlug = "gifts-for-her" | "milestones" | "wedding" | "everyday";

export interface ProductImage {
  src: StaticImageData;
  alt: string;
}

export interface VariantOption {
  id: string;
  label: string;
  available: boolean;
}

export interface ProductVariantGroup {
  /** e.g. "Ring size" */
  name: string;
  options: VariantOption[];
}

export type Availability = "available" | "made-to-order" | "unavailable";

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Edit collections such as "bridal" or "signature" */
  collections: string[];
  occasions: OccasionSlug[];
  /** Whole currency units (NPR has no minor unit in everyday pricing). */
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  /** One line for cards and search results */
  summary: string;
  description: string[];
  materials: { metal: string; stones?: string };
  details: string[];
  care: string[];
  variants?: ProductVariantGroup;
  availability: Availability;
  /** Maximum quantity a single bag line may hold */
  maxQuantity: number;
  featured?: boolean;
  newArrival?: boolean;
  /** ISO date the piece was added; drives "newest" sorting */
  addedOn: string;
  seo?: { title?: string; description?: string };
}

export interface Collection {
  slug: string;
  name: string;
  kind: "category" | "edit";
  /** One line for tiles */
  tagline: string;
  description: string;
  image: ProductImage;
  /** Which products belong: categories match on category, edits on the collections field */
  match: { category?: CategorySlug; collection?: string };
}

export interface Occasion {
  slug: OccasionSlug;
  name: string;
  line: string;
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  publishedOn: string;
  readingMinutes: number;
  image?: ProductImage;
  /** Paragraph blocks; strings starting with "## " render as subheadings */
  body: string[];
  related?: { label: string; href: string };
}
