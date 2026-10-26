import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageIntro } from "@/components/shop/PageIntro";
import { ArrowLink } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Client care",
  description: "How ordering works at Sumix Jewels, with delivery, returns and jewellery care information.",
  alternates: site.url ? { canonical: "/client-care" } : undefined,
};

function Pending() {
  return (
    <p className="border-l border-champagne pl-4 text-taupe">
      Details to follow. Until they are published here, ask us directly and we will confirm them for your order.
    </p>
  );
}

export default function ClientCarePage() {
  const { policies } = site;
  const sections = [
    {
      id: "ordering",
      title: "How ordering works",
      body: (
        <div className="space-y-4">
          <p>
            Every order begins as an enquiry. Add pieces to your bag, then send it from checkout with your contact details
            and any notes, such as a ring size question or a gift message.
          </p>
          <p>
            We then confirm availability, delivery and payment with you directly. No card details are collected on this
            website.
          </p>
          <ArrowLink href="/cart">Go to your bag</ArrowLink>
        </div>
      ),
    },
    { id: "delivery", title: "Delivery", body: policies.delivery ? <p>{policies.delivery}</p> : <Pending /> },
    { id: "returns", title: "Returns and exchanges", body: policies.returns ? <p>{policies.returns}</p> : <Pending /> },
    {
      id: "gift",
      title: "Gift presentation",
      body: policies.giftPresentation ? <p>{policies.giftPresentation}</p> : <Pending />,
    },
    {
      id: "care",
      title: "Caring for your jewellery",
      body: (
        <div className="space-y-4">
          <p>Each piece lists its own care notes. Our journal has a short guide to the habits that keep fine jewellery looking its best.</p>
          <ArrowLink href="/journal/caring-for-fine-jewellery">Read the care guide</ArrowLink>
        </div>
      ),
    },
  ];

  return (
    <>
      <PageIntro
        title="Client care"
        intro="Everything about ordering, delivery and looking after your pieces."
        crumbs={[{ label: "Home", href: "/" }, { label: "Client care" }]}
      />
      <div className="wrap grid gap-12 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-10">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <ul className="sticky top-[calc(var(--header-h)+2rem)] space-y-3 text-[0.9375rem]">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="link-line text-taupe hover:text-obsidian">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="divide-y divide-line border-y border-line lg:col-span-8 lg:col-start-5">
          {sections.map((s) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-title`} className="grid gap-4 py-10 md:grid-cols-[14rem_1fr] md:gap-10">
              <h2 id={`${s.id}-title`} className="font-display text-2xl">
                {s.title}
              </h2>
              <div className="text-[0.9375rem] leading-relaxed text-obsidian/85">{s.body}</div>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
