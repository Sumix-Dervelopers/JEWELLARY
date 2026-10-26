import Link from "next/link";
import { BookOpen, Heart, MessageSquare, PackageCheck } from "lucide-react";

/*
 * Each note describes something the site genuinely does today. Delivery, returns and payment
 * claims are deliberately absent until the business confirms them in src/config/site.ts.
 */
const notes = [
  {
    icon: MessageSquare,
    title: "Ask before you choose",
    text: "Send an enquiry about sizing, stones or a particular piece.",
    href: "/contact",
    cta: "Send an enquiry",
  },
  {
    icon: PackageCheck,
    title: "Order by enquiry",
    text: "Your bag becomes an order request, so every purchase begins with a conversation, not a card form.",
    href: "/client-care#ordering",
    cta: "How ordering works",
  },
  {
    icon: Heart,
    title: "A wishlist without an account",
    text: "Save pieces on this device and return to them whenever you like.",
    href: "/wishlist",
    cta: "Open your wishlist",
  },
  {
    icon: BookOpen,
    title: "Care for every piece",
    text: "Each listing explains how to wear, clean and store it.",
    href: "/journal/caring-for-fine-jewellery",
    cta: "Read the care guide",
  },
];

export function ServiceNotes() {
  return (
    <section aria-labelledby="service-title" className="border-y border-line">
      <div className="wrap py-16 md:py-20">
        <h2 id="service-title" className="sr-only">
          Client care
        </h2>
        <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-line">
          {notes.map(({ icon: Icon, ...n }) => (
            <li key={n.title} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
              <Icon size={20} strokeWidth={1} className="text-antique" aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl">{n.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-taupe">{n.text}</p>
              <Link href={n.href} className="link-line mt-4 inline-block text-caption font-medium">
                {n.cta}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
