import type { Metadata } from "next";
import { PageIntro } from "@/components/shop/PageIntro";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping bag",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageIntro title="Your bag" crumbs={[{ label: "Home", href: "/" }, { label: "Shopping bag" }]} />
      <div className="wrap pb-24 md:pb-32">
        <CartView />
      </div>
    </>
  );
}
