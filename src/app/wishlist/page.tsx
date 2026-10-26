import type { Metadata } from "next";
import { PageIntro } from "@/components/shop/PageIntro";
import { WishlistView } from "@/components/product/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <>
      <PageIntro title="Your wishlist" crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="wrap pb-24 md:pb-32">
        <WishlistView />
      </div>
    </>
  );
}
