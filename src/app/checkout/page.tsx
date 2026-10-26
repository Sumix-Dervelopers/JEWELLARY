import type { Metadata } from "next";
import { PageIntro } from "@/components/shop/PageIntro";
import { EnquiryForm } from "@/components/forms/EnquiryForm";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

/**
 * Enquiry-based checkout. No card details are collected. To take payments, integrate a hosted
 * provider (e.g. a redirect or embedded checkout) here; see README "Payments".
 */
export default function CheckoutPage() {
  return (
    <>
      <PageIntro
        title="Checkout"
        intro="Send your bag to us as an order enquiry. We will confirm availability, delivery and payment with you directly."
        crumbs={[{ label: "Home", href: "/" }, { label: "Bag", href: "/cart" }, { label: "Checkout" }]}
      />
      <div className="wrap pb-24 md:pb-32">
        <EnquiryForm kind="purchase" />
      </div>
    </>
  );
}
