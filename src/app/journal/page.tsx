import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { articles } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { PageIntro } from "@/components/shop/PageIntro";
import { HairlineArrow } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories and guides from Ratna Jewellers: choosing a signature ring, layering necklaces, gifting and caring for fine jewellery.",
  alternates: site.url ? { canonical: "/journal" } : undefined,
};

export default function JournalPage() {
  const [lead, ...rest] = articles;
  return (
    <>
      <PageIntro
        title="The journal"
        intro="Guides to choosing, wearing and caring for fine jewellery."
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
      />
      <div className="wrap pb-24 md:pb-32">
        <Link href={`/journal/${lead.slug}`} className="group grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="zoom-frame relative aspect-[16/11] bg-parchment lg:col-span-7">
            {lead.image && <Image src={lead.image.src} alt={lead.image.alt} fill preload sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" className="object-cover" />}
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <p className="text-caption text-taupe">
              <time dateTime={lead.publishedOn}>{formatDate(lead.publishedOn)}</time>, {lead.readingMinutes} minute read
            </p>
            <h2 className="display-md mt-3">{lead.title}</h2>
            <p className="mt-4 text-taupe">{lead.dek}</p>
            <span className="mt-6 inline-flex items-center gap-4 text-[0.875rem] font-medium">
              Read the story <HairlineArrow />
            </span>
          </div>
        </Link>

        <ul className="mt-24 grid gap-14 md:grid-cols-3 md:gap-8">
          {rest.map((a) => (
            <li key={a.slug}>
              <Link href={`/journal/${a.slug}`} className="group block">
                <div className="zoom-frame relative aspect-[4/5] bg-parchment">
                  {a.image && <Image src={a.image.src} alt={a.image.alt} fill sizes="(min-width: 768px) 30vw, 100vw" placeholder="blur" className="object-cover" />}
                </div>
                <p className="mt-5 text-caption text-taupe">
                  <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
                </p>
                <h2 className="mt-2 font-display text-2xl leading-snug">{a.title}</h2>
                <p className="mt-2 text-[0.9375rem] text-taupe">{a.dek}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
