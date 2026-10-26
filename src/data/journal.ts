import type { Article } from "@/lib/types";
import { images } from "./images";

export const articles: Article[] = [
  {
    slug: "finding-your-signature-ring",
    title: "Finding your signature ring",
    dek: "The ring you wear every day should be chosen for your hands, not for a photograph.",
    publishedOn: "2026-09-28",
    readingMinutes: 4,
    image: { src: images.craftSetting, alt: "A round diamond held in six gold claws" },
    body: [
      "A signature ring is the one you stop noticing you are wearing, and the one other people come to associate with you. Choosing it is less about trends than about proportion, habit and the shape of your own hand.",
      "## Start with the hand",
      "Long fingers carry elongated stones and wider bands comfortably. Shorter fingers tend to look most graceful with a slimmer band and a stone that sits a little lower. Neither is a rule; try both and notice which one you forget about first.",
      "## Think about your days",
      "If you work with your hands, a lower setting catches less. A raised claw setting lets in more light, which is why it suits a ring worn for occasions. Many people own one of each.",
      "## Size at the right time",
      "Fingers change through the day and with the temperature. Size in the afternoon, when your hands are warm, and choose the size that slides on with a little resistance at the knuckle.",
      "## Wear it before you decide",
      "Spend a few minutes with the ring on. Write, pick up your phone, push your hair back. The right ring will feel like it belongs there.",
    ],
    related: { label: "Explore rings", href: "/collections/rings" },
  },
  {
    slug: "how-to-layer-necklaces",
    title: "A guide to styling necklaces",
    dek: "Layering looks effortless when the lengths are deliberate.",
    publishedOn: "2026-08-14",
    readingMinutes: 3,
    image: { src: images.collectionNecklaces, alt: "Two fine gold chains layered at the neck" },
    body: [
      "The difference between necklaces that look layered and necklaces that look tangled is usually a few centimetres.",
      "## Leave space between lengths",
      "Keep at least four to five centimetres between each chain so each one has room to fall. A short chain at the collarbone and a longer one with a pendant is the easiest place to begin.",
      "## Vary the weight",
      "Pair a very fine chain with one that has a little more presence, or let a single pendant be the only stone. When everything is the same weight, nothing reads clearly.",
      "## Match the neckline",
      "Open necklines suit pendants that sit just below the collarbone. High necklines suit longer chains worn over fabric. Off-shoulder necklines are the moment for something close to the neck.",
    ],
    related: { label: "Explore necklaces", href: "/collections/necklaces" },
  },
  {
    slug: "jewellery-for-meaningful-occasions",
    title: "Choosing jewellery for meaningful occasions",
    dek: "Some gifts are opened once. Fine jewellery is opened every morning.",
    publishedOn: "2026-07-02",
    readingMinutes: 4,
    image: { src: images.collectionBridal, alt: "A bride holding her veil, wearing a diamond ring and bracelet" },
    body: [
      "A piece given to mark a moment carries that moment with it. That is a lot to ask of an object, so it helps to choose with a little intention.",
      "## Look at what they already wear",
      "Notice whether they wear yellow or white metals, studs or drops, one piece or many. The best gift feels like something they would have chosen themselves.",
      "## Choose something that can be worn often",
      "A pendant, a pair of pearl drops or a fine bracelet will be worn far more than a statement piece kept for occasions, and every wearing brings the memory back.",
      "## When in doubt, ask",
      "If you are unsure of a ring size or a stone, send us an enquiry with what you know. A short conversation is better than a guess.",
    ],
    related: { label: "Send an enquiry", href: "/contact" },
  },
  {
    slug: "caring-for-fine-jewellery",
    title: "Jewellery care and storage",
    dek: "Small habits that keep fine pieces looking the way they did on the first day.",
    publishedOn: "2026-05-20",
    readingMinutes: 3,
    image: { src: images.craftBench, alt: "A goldsmith's hands working on a ring at a wooden bench" },
    body: [
      "Most wear on fine jewellery comes from everyday contact: other pieces, hard surfaces, lotions and water. A few habits prevent most of it.",
      "## Last on, first off",
      "Put jewellery on after perfume, make-up and hairspray, and take it off before you wash, swim, exercise or sleep.",
      "## Store pieces apart",
      "Harder stones can scratch softer stones and metals. A lined box with separate compartments, or individual soft pouches, keeps every piece safe.",
      "## Clean gently",
      "A soft, dry cloth after wearing is usually enough. Pearls prefer a cloth that is very slightly damp. Avoid harsh chemicals, and ask before using an ultrasonic cleaner on any stone.",
      "## Check settings and clasps",
      "Every so often, look closely at claws and clasps. If a stone moves when you touch it, stop wearing the piece until it has been checked.",
    ],
    related: { label: "Read about client care", href: "/client-care" },
  },
];

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
