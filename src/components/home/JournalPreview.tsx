import Image from "next/image";
import Link from "next/link";
import { articles } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { ArrowLink, HairlineArrow } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/Reveal";

export function JournalPreview() {
  const [lead, ...rest] = articles;

  return (
    <section aria-labelledby="journal-title" className="wrap py-24 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <h2 id="journal-title" className="display-lg">
          The journal
        </h2>
        <ArrowLink href="/journal" className="hidden sm:inline-flex">
          All stories
        </ArrowLink>
      </div>

      <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <Link href={`/journal/${lead.slug}`} className="group block">
            <div className="zoom-frame relative aspect-[16/11] bg-parchment">
              {lead.image && (
                <Image src={lead.image.src} alt={lead.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" placeholder="blur" className="object-cover object-[50%_60%]" />
              )}
            </div>
            <p className="mt-6 text-caption text-taupe">
              <time dateTime={lead.publishedOn}>{formatDate(lead.publishedOn)}</time>, {lead.readingMinutes} minute read
            </p>
            <h3 className="display-md mt-2 max-w-[20ch]">{lead.title}</h3>
            <p className="mt-3 max-w-[50ch] text-taupe">{lead.dek}</p>
          </Link>
        </Reveal>

        <ul className="divide-y divide-line border-y border-line lg:col-span-4 lg:col-start-9 lg:self-end">
          {rest.map((a, i) => (
            <Reveal as="li" key={a.slug} stagger={i + 1}>
              <Link href={`/journal/${a.slug}`} className="group block py-8">
                <p className="text-caption text-taupe">
                  <time dateTime={a.publishedOn}>{formatDate(a.publishedOn)}</time>
                </p>
                <h3 className="mt-2 font-display text-2xl leading-snug">{a.title}</h3>
                <p className="mt-2 text-[0.9375rem] text-taupe">{a.dek}</p>
                <span className="mt-4 inline-flex items-center gap-3 text-caption font-medium">
                  Read <HairlineArrow />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
