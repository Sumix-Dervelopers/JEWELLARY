import type { Metadata } from "next";
import { site } from "@/config/site";
import { HeroSection } from "@/components/home/HeroSection";
import { CollectionShowcase } from "@/components/home/CollectionShowcase";
import { FeaturedPieces } from "@/components/home/FeaturedPieces";
import { SignatureCampaign } from "@/components/home/SignatureCampaign";
import { CraftStory } from "@/components/home/CraftStory";
import { GiftEdit } from "@/components/home/GiftEdit";
import { ServiceNotes } from "@/components/home/ServiceNotes";
import { JournalPreview } from "@/components/home/JournalPreview";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: { absolute: `${site.name} | Fine jewellery to be treasured` },
  alternates: site.url ? { canonical: "/" } : undefined,
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CollectionShowcase />
      <FeaturedPieces />
      <SignatureCampaign />
      <CraftStory />
      <GiftEdit />
      <ServiceNotes />
      <JournalPreview />
      {site.url && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: site.url,
            logo: `${site.url}/icon.svg`,
            ...(site.social.length ? { sameAs: site.social.map((s) => s.href) } : {}),
          }}
        />
      )}
    </>
  );
}
