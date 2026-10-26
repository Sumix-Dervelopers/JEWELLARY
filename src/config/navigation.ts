export const primaryNav = [
  { label: "Shop", href: "/shop" },
  { label: "Collections", href: "/collections/signature", mega: true },
  { label: "Rings", href: "/collections/rings" },
  { label: "Necklaces", href: "/collections/necklaces" },
  { label: "Earrings", href: "/collections/earrings" },
  { label: "Bracelets", href: "/collections/bracelets" },
] as const;

export const secondaryNav = [
  { label: "Our Story", href: "/about" },
  { label: "Journal", href: "/journal" },
] as const;

export const footerNav = {
  shop: [
    { label: "All jewellery", href: "/shop" },
    { label: "Rings", href: "/collections/rings" },
    { label: "Necklaces", href: "/collections/necklaces" },
    { label: "Earrings", href: "/collections/earrings" },
    { label: "Bracelets", href: "/collections/bracelets" },
    { label: "Bridal", href: "/collections/bridal" },
  ],
  care: [
    { label: "Contact and enquiries", href: "/contact" },
    { label: "Delivery and returns", href: "/client-care#delivery" },
    { label: "Jewellery care", href: "/journal/caring-for-fine-jewellery" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Shopping bag", href: "/cart" },
  ],
  house: [
    { label: "Our Story", href: "/about" },
    { label: "Journal", href: "/journal" },
    { label: "Signature Pieces", href: "/collections/signature" },
  ],
};
