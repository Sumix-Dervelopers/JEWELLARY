import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "@/config/site";
import { collections } from "@/data/collections";
import { getCollection, productsInCollection, sortProducts } from "@/lib/catalog";
import { Breadcrumbs } from "@/components/ui/primitives";
import { ShopBrowser } from "@/components/shop/ShopBrowser";
import { StaticGrid } from "@/components/shop/StaticGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { CollectionSkeleton } from "@/components/ui/Skeletons";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return { title: "Collection not found" };
  return {
    title: collection.name,
    description: collection.description,
    alternates: site.url ? { canonical: `/collections/${collection.slug}` } : undefined,
    openGraph: { title: `${collection.name} | ${site.name}`, description: collection.description, images: [collection.image.src.src] },
  };
}

export default function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  return (
    <Suspense fallback={<CollectionSkeleton />}>
      <CollectionPageContent params={params} />
    </Suspense>
  );
}

async function CollectionPageContent({ params }: { params: PageProps<"/collections/[slug]">["params"] }) {
  const { slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const items = productsInCollection(collection);
  const scope = collection.kind === "category" ? { category: collection.match.category } : { collection: collection.match.collection };

  return (
    <>
      <section className="wrap grid gap-10 pt-10 pb-16 md:pt-14 lg:grid-cols-12 lg:items-end lg:gap-10 lg:pb-20">
        <div className="lg:col-span-5">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collections", href: "/shop" },
              { label: collection.name },
            ]}
          />
          <h1 className="display-xl mt-10 lg:mt-16">{collection.name}</h1>
          <p className="lede mt-6 max-w-[40ch] text-obsidian/80">{collection.description}</p>
        </div>
        <div className="relative aspect-[4/3] bg-parchment lg:col-span-6 lg:col-start-7 lg:aspect-[5/4]">
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1024px) 46vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <div className="wrap pb-24 md:pb-32">
        <Suspense fallback={<StaticGrid products={sortProducts(items, "featured")} />}>
          <ShopBrowser {...scope} />
        </Suspense>
      </div>

      {site.url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
              { "@type": "ListItem", position: 2, name: collection.name, item: `${site.url}/collections/${collection.slug}` },
            ],
          }}
        />
      )}
    </>
  );
}
