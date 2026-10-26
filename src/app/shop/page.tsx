import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/config/site";
import { products } from "@/data/products";
import { sortProducts } from "@/lib/catalog";
import { PageIntro } from "@/components/shop/PageIntro";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { StaticGrid } from "@/components/shop/StaticGrid";

export const metadata: Metadata = {
  title: "All jewellery",
  description: "Rings, necklaces, earrings and bracelets from Sumix Jewels. Filter by category, occasion and price.",
  alternates: site.url ? { canonical: "/shop" } : undefined,
};

export default function ShopPage() {
  return (
    <>
      <PageIntro
        title="All jewellery"
        intro="Every piece in the collection, from a single pear drop to a fitted bridal pair."
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
      />
      <div className="wrap pb-24 md:pb-32">
        <Suspense fallback={<StaticGrid products={sortProducts(products, "featured")} />}>
          <ShopBrowser />
        </Suspense>
      </div>
    </>
  );
}
