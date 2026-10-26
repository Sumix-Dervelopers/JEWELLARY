import Link from "next/link";
import { cacheLife } from "next/cache";
import { site } from "@/config/site";
import { footerNav } from "@/config/navigation";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Wordmark } from "@/components/ui/primitives";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="label font-sans text-mist">{title}</h2>
      <ul className="mt-5 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-line text-[0.9375rem] text-ivory/85 hover:text-ivory">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Cached so the static shell can prerender; refreshes daily. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const { contact } = site;
  const hasContact = contact.email || contact.phone || contact.address;

  return (
    <footer className="on-dark bg-obsidian pb-[env(safe-area-inset-bottom)] text-ivory">
      {/* Letters from Sumix — the newsletter lives here so it appears once on every page */}
      <section id="letters" aria-labelledby="letters-title" className="border-b border-line-dark">
        <div className="wrap grid gap-10 py-20 md:py-28 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-6">
            <h2 id="letters-title" className="display-lg">
              Letters from Sumix
            </h2>
            <p className="mt-5 max-w-[42ch] text-ivory/75">
              Collection launches, stories from the journal and occasional updates from the house.
            </p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <NewsletterForm tone="dark" />
          </div>
        </div>
      </section>

      <div className="wrap pt-16 pb-10 md:pt-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-4">
            <Link href="/" aria-label="Sumix Jewels, home" className="inline-block">
              <Wordmark className="text-xl xl:text-2xl" />
            </Link>
            <p className="mt-6 max-w-[26ch] font-display text-xl leading-snug text-ivory/90">{site.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            <Column title="Shop" links={footerNav.shop} />
            <Column title="Client care" links={footerNav.care} />
            <div>
              <Column title="The house" links={footerNav.house} />
              <div className="mt-10">
                <h2 className="label font-sans text-mist">Contact</h2>
                {hasContact ? (
                  <address className="mt-5 space-y-1.5 text-[0.9375rem] text-ivory/85 not-italic">
                    {contact.address && <p>{contact.address}</p>}
                    {contact.phone && (
                      <p>
                        <a className="link-line" href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                          {contact.phone}
                        </a>
                      </p>
                    )}
                    {contact.email && (
                      <p>
                        <a className="link-line" href={`mailto:${contact.email}`}>
                          {contact.email}
                        </a>
                      </p>
                    )}
                    {contact.hours && <p className="text-mist">{contact.hours}</p>}
                  </address>
                ) : (
                  <p className="mt-5 text-[0.9375rem] text-ivory/85">
                    <Link href="/contact" className="link-line">
                      Send us an enquiry
                    </Link>
                  </p>
                )}
                {site.social.length > 0 && (
                  <ul className="mt-5 flex gap-5 text-[0.9375rem]">
                    {site.social.map((s) => (
                      <li key={s.href}>
                        <a href={s.href} className="link-line text-ivory/85" rel="noopener noreferrer" target="_blank">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-line-dark pt-8 text-caption text-mist md:flex-row md:items-center md:justify-between">
          <p>
            © <CopyrightYear /> {site.name}. Prices shown in {site.currency.label}.
          </p>
          {site.catalogueIsDemo && (
            <p>Products, prices and imagery are shown for demonstration and are not yet available to order.</p>
          )}
        </div>
      </div>
    </footer>
  );
}
