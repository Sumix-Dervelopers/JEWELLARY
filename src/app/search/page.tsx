import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/shop/PageIntro";
import { SearchResults } from "@/components/shop/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <>
      <PageIntro title="Search" crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]} />
      <div className="wrap pb-24 md:pb-32">
        <Suspense fallback={<div className="min-h-[20rem]" aria-busy="true" />}>
          <SearchResults />
        </Suspense>
      </div>
    </>
  );
}
