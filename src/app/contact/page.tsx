import type { Metadata } from "next";
import { site } from "@/config/site";
import { PageIntro } from "@/components/shop/PageIntro";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Contact and enquiries",
  description: "Ask Sumix Jewels about sizing, stones, a particular piece or a gift.",
  alternates: site.url ? { canonical: "/contact" } : undefined,
};

export default function ContactPage() {
  const { contact } = site;
  const hasDetails = contact.email || contact.phone || contact.address;

  return (
    <>
      <PageIntro
        title="Contact and enquiries"
        intro="Ask about sizing, stones, a particular piece or a gift. Tell us as much or as little as you like."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="wrap grid gap-16 pb-24 md:pb-32 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <EnquiryForm kind="contact" />
        </div>
        {hasDetails && (
          <aside className="lg:col-span-4 lg:col-start-9">
            <h2 className="font-display text-2xl">Other ways to reach us</h2>
            <address className="mt-6 space-y-2 text-[0.9375rem] not-italic">
              {contact.address && <p>{contact.address}</p>}
              {contact.phone && (
                <p>
                  <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link-line">
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.email && (
                <p>
                  <a href={`mailto:${contact.email}`} className="link-line">
                    {contact.email}
                  </a>
                </p>
              )}
              {contact.hours && <p className="text-taupe">{contact.hours}</p>}
            </address>
          </aside>
        )}
      </div>
    </>
  );
}
