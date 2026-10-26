import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "@/config/site";
import { articles, getArticle } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { ArrowLink, Breadcrumbs } from "@/components/ui/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArticleSkeleton } from "@/components/ui/Skeletons";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Story not found" };
  return {
    title: article.title,
    description: article.dek,
    alternates: site.url ? { canonical: `/journal/${article.slug}` } : undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.dek,
      publishedTime: article.publishedOn,
      ...(article.image ? { images: [article.image.src.src] } : {}),
    },
  };
}

export default function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticlePageContent params={params} />
    </Suspense>
  );
}

async function ArticlePageContent({ params }: { params: PageProps<"/journal/[slug]">["params"] }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();
  const others = articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  return (
    <article>
      <header className="wrap pt-10 md:pt-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: article.title }]} />
        <div className="mx-auto mt-14 max-w-3xl text-center md:mt-20">
          <p className="text-caption text-taupe">
            <time dateTime={article.publishedOn}>{formatDate(article.publishedOn)}</time>, {article.readingMinutes} minute read
          </p>
          <h1 className="display-lg mt-4">{article.title}</h1>
          <p className="lede mx-auto mt-6 max-w-[46ch] text-taupe">{article.dek}</p>
        </div>
      </header>

      {article.image && (
        <div className="wrap mt-14 md:mt-20">
          <div className="relative mx-auto aspect-[4/5] max-w-5xl bg-parchment sm:aspect-[16/9]">
            <Image src={article.image.src} alt={article.image.alt} fill preload sizes="(min-width: 1024px) 64rem, 100vw" placeholder="blur" className="object-cover" />
          </div>
        </div>
      )}

      <div className="wrap py-16 md:py-24">
        <div className="mx-auto max-w-[38rem] space-y-6 text-[1.0625rem] leading-[1.75] text-obsidian/90">
          {article.body.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="display-sm pt-6">
                {block.slice(3)}
              </h2>
            ) : (
              <p key={i} className={i === 0 ? "font-display text-[1.375rem] leading-[1.55] text-obsidian" : undefined}>
                {block}
              </p>
            ),
          )}
          {article.related && (
            <div className="pt-6">
              <ArrowLink href={article.related.href}>{article.related.label}</ArrowLink>
            </div>
          )}
        </div>
      </div>

      <aside aria-labelledby="more-stories" className="border-t border-line">
        <div className="wrap py-16 md:py-24">
          <h2 id="more-stories" className="display-sm">
            More from the journal
          </h2>
          <ul className="mt-8 grid gap-8 divide-y divide-line md:grid-cols-2 md:divide-y-0">
            {others.map((a) => (
              <li key={a.slug} className="pt-8 first:pt-0 md:pt-0">
                <Link href={`/journal/${a.slug}`} className="group block">
                  <h3 className="font-display text-2xl leading-snug group-hover:text-antique">{a.title}</h3>
                  <p className="mt-2 text-taupe">{a.dek}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {site.url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.dek,
            datePublished: article.publishedOn,
            author: { "@type": "Organization", name: site.name },
            publisher: { "@type": "Organization", name: site.name },
            ...(article.image ? { image: `${site.url}${article.image.src.src}` } : {}),
            mainEntityOfPage: `${site.url}/journal/${article.slug}`,
          }}
        />
      )}
    </article>
  );
}
