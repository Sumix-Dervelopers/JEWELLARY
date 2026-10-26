import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "@/config/site";
import { products } from "@/data/products";
import { categoryNames, collections } from "@/data/collections";
import { getProduct, relatedProducts } from "@/lib/catalog";
import { Breadcrumbs, PriceDisplay } from "@/components/ui/primitives";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import { ProductCard } from "@/components/product/ProductCard";
import { JsonLd } from "@/components/seo/JsonLd";
import { ProductSkeleton } from "@/components/ui/Skeletons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Piece not found" };
  const description = product.seo?.description ?? `${product.summary} ${product.description[0]}`;
  return {
    title: product.seo?.title ?? product.name,
    description,
    alternates: site.url ? { canonical: `/products/${product.slug}` } : undefined,
    openGraph: { title: `${product.name} | ${site.name}`, description, images: [product.images[0].src.src] },
  };
}

function Section({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  return (
    <details className="group border-b border-line" open={defaultOpen}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-[0.9375rem] font-medium [&::-webkit-details-marker]:hidden">
        {title}
        <span aria-hidden="true" className="relative size-3">
          <span className="absolute top-1/2 left-0 h-px w-3 bg-current" />
          <span className="absolute top-0 left-1/2 h-3 w-px bg-current transition-transform duration-200 ease-[var(--ease-out)] group-open:scale-y-0" />
        </span>
      </summary>
      <div className="pb-6 text-[0.9375rem] leading-relaxed text-obsidian/80">{children}</div>
    </details>
  );
}

export default function ProductPage({ params }: PageProps<"/products/[slug]">) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductPageContent params={params} />
    </Suspense>
  );
}

async function ProductPageContent({ params }: { params: PageProps<"/products/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = relatedProducts(product, 4);
  const category = collections.find((c) => c.slug === product.category);
  const edits = collections.filter((c) => c.kind === "edit" && product.collections.includes(c.slug));

  return (
    <>
      <div className="wrap pt-8 md:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: categoryNames[product.category], href: `/collections/${product.category}` },
            { label: product.name },
          ]}
        />
      </div>

      <article className="wrap grid gap-10 pt-8 pb-24 md:pt-10 lg:grid-cols-12 lg:gap-14 xl:gap-20">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            {product.newArrival && <p className="text-caption text-antique">New arrival</p>}
            <h1 className="display-md mt-1">{product.name}</h1>
            <PriceDisplay price={product.price} compareAt={product.compareAtPrice} className="mt-4 block text-xl" />
            <p className="lede mt-6 text-obsidian/85">{product.summary}</p>

            <dl className="mt-6 grid grid-cols-[6.5rem_1fr] gap-y-2 text-[0.9375rem]">
              <dt className="text-taupe">Metal</dt>
              <dd>{product.materials.metal}</dd>
              {product.materials.stones && (
                <>
                  <dt className="text-taupe">Stones</dt>
                  <dd>{product.materials.stones}</dd>
                </>
              )}
              <dt className="text-taupe">Availability</dt>
              <dd>
                {product.availability === "available" && "Available to order"}
                {product.availability === "made-to-order" && "Made to order; timing confirmed with your enquiry"}
                {product.availability === "unavailable" && "Currently unavailable"}
              </dd>
            </dl>

            <div className="mt-10">
              <ProductPurchase product={product} />
            </div>

            {site.catalogueIsDemo && (
              <p className="mt-6 border-l border-champagne pl-4 text-caption text-taupe">
                Demonstration listing. Metal, stones, price and imagery are illustrative until confirmed by {site.name}. Adding
                to your bag starts an order enquiry; no payment is taken.
              </p>
            )}

            <div className="mt-10 border-t border-line">
              <Section title="Description" defaultOpen>
                <div className="space-y-3">
                  {product.description.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
              </Section>
              <Section title="Details">
                <ul className="list-inside list-disc space-y-1.5 marker:text-champagne">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Care">
                <ul className="list-inside list-disc space-y-1.5 marker:text-champagne">
                  {product.care.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </Section>
              <Section title="Ordering and delivery">
                <p>
                  Orders are placed by enquiry. Send your bag as an enquiry and we will confirm availability, delivery and
                  payment with you directly. See <Link href="/client-care" className="link-line text-obsidian [background-size:100%_1px]">client care</Link> for details.
                </p>
              </Section>
            </div>

            {(category || edits.length > 0) && (
              <p className="mt-8 text-caption text-taupe">
                Part of{" "}
                {[category, ...edits]
                  .filter((c) => c !== undefined)
                  .map((c, i, arr) => (
                    <span key={c.slug}>
                      <Link href={`/collections/${c.slug}`} className="link-line text-obsidian [background-size:100%_1px]">
                        {c.name}
                      </Link>
                      {i < arr.length - 2 ? ", " : i === arr.length - 2 ? " and " : ""}
                    </span>
                  ))}
              </p>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="border-t border-line bg-parchment/60">
          <div className="wrap py-20 md:py-28">
            <h2 id="related-title" className="display-md">
              You may also love
            </h2>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-4 lg:gap-x-6">
              {related.map((p) => (
                <li key={p.id}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {site.url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
              { "@type": "ListItem", position: 2, name: categoryNames[product.category], item: `${site.url}/collections/${product.category}` },
              { "@type": "ListItem", position: 3, name: product.name, item: `${site.url}/products/${product.slug}` },
            ],
          }}
        />
      )}
      {/* Product structured data is withheld while the catalogue is a demonstration: no fabricated offers. */}
      {site.url && !site.catalogueIsDemo && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description.join(" "),
            image: product.images.map((i) => `${site.url}${i.src.src}`),
            sku: product.id,
            brand: { "@type": "Brand", name: site.name },
            material: product.materials.metal,
            offers: {
              "@type": "Offer",
              url: `${site.url}/products/${product.slug}`,
              priceCurrency: site.currency.code,
              price: product.price,
              availability:
                product.availability === "unavailable" ? "https://schema.org/OutOfStock" : product.availability === "made-to-order" ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
            },
          }}
        />
      )}
    </>
  );
}
