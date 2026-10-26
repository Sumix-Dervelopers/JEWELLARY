import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/primitives";

export function PageIntro({
  title,
  intro,
  crumbs,
  children,
}: {
  title: ReactNode;
  intro?: ReactNode;
  crumbs: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <div className="wrap pt-10 pb-12 md:pt-14 md:pb-16">
      <Breadcrumbs items={crumbs} />
      <div className="mt-8 flex flex-col gap-6 md:mt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="display-lg">{title}</h1>
          {intro && <p className="mt-4 max-w-[52ch] text-taupe">{intro}</p>}
        </div>
        {children}
      </div>
    </div>
  );
}
