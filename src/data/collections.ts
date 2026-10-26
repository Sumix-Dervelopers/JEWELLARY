import type { Collection, Occasion } from "@/lib/types";
import { images } from "./images";

export const collections: Collection[] = [
  {
    slug: "rings",
    name: "Rings",
    kind: "category",
    tagline: "Solitaires, bands and sets to stack",
    description:
      "Rings are worn closest to the hands that do everything, so we keep their lines clean and their settings low enough for daily life.",
    image: { src: images.collectionRings, alt: "A hand on ivory silk wearing three stacked gold rings" },
    match: { category: "rings" },
  },
  {
    slug: "necklaces",
    name: "Necklaces",
    kind: "category",
    tagline: "Pendants and fine chains",
    description:
      "From a single stone at the collarbone to two chains worn as one, necklaces chosen for where they fall as much as what they hold.",
    image: { src: images.collectionNecklaces, alt: "Layered fine gold chains at the collarbone" },
    match: { category: "necklaces" },
  },
  {
    slug: "earrings",
    name: "Earrings",
    kind: "category",
    tagline: "Pearls that move with you",
    description: "Earrings frame the face, so they should move a little when you speak and turn.",
    image: { src: images.collectionEarrings, alt: "A woman in profile wearing a pearl drop earring" },
    match: { category: "earrings" },
  },
  {
    slug: "bracelets",
    name: "Bracelets",
    kind: "category",
    tagline: "A line of light at the wrist",
    description: "Bracelets that lie flat and soft, made to be worn every day without a second thought.",
    image: { src: images.collectionBracelets, alt: "A wrist on warm travertine wearing a diamond line bracelet" },
    match: { category: "bracelets" },
  },
  {
    slug: "bridal",
    name: "Bridal",
    kind: "edit",
    tagline: "For the day, and every day after",
    description:
      "Engagement rings, fitted bands and the pieces worn on the day itself, chosen to stay with you long after it.",
    image: { src: images.collectionBridal, alt: "A bride holding her veil, wearing a diamond ring and line bracelet" },
    match: { collection: "bridal" },
  },
  {
    slug: "signature",
    name: "Signature Pieces",
    kind: "edit",
    tagline: "The pieces that define the house",
    description:
      "A small edit of the designs we consider most our own: the solitaire, the pear drop and the green stone on black silk.",
    image: { src: images.collectionSignature, alt: "An emerald-cut green pendant framed in diamonds on black silk" },
    match: { collection: "signature" },
  },
];

export const occasions: Occasion[] = [
  { slug: "gifts-for-her", name: "Gifts for her", line: "Pieces she will reach for first" },
  { slug: "milestones", name: "Meaningful milestones", line: "Birthdays, anniversaries, new beginnings" },
  { slug: "wedding", name: "Wedding and bridal", line: "For the day and every day after" },
  { slug: "everyday", name: "Everyday icons", line: "Fine enough for evening, easy enough for always" },
];

export const categoryNames: Record<string, string> = {
  rings: "Rings",
  necklaces: "Necklaces",
  earrings: "Earrings",
  bracelets: "Bracelets",
};
