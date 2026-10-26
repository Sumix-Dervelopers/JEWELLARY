import Link from "next/link";
import { clsx } from "clsx";
import type { ComponentProps, ReactNode } from "react";
import { formatPrice } from "@/lib/format";

export const cn = clsx;

/* ---------- Wordmark ---------- */

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-display text-[1.0625rem] leading-none tracking-[0.32em] whitespace-nowrap xl:text-[1.1875rem]",
        className,
      )}
    >
      SUMIX<span className="ml-[0.5em] text-[0.78em] tracking-[0.42em]">JEWELS</span>
    </span>
  );
}

/* ---------- Hairline arrow ---------- */

export function HairlineArrow({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={cn("hairline-arrow", className)}>
      <span className="shaft" />
      <svg className="head" width="8" height="9" viewBox="0 0 8 9" fill="none">
        <path d="M1 1l5.5 3.5L1 8" stroke="currentColor" strokeWidth="1" />
      </svg>
    </span>
  );
}

/* ---------- Buttons ---------- */

type Tone = "dark" | "light" | "outline-dark" | "outline-light";

const toneClasses: Record<Tone, string> = {
  dark: "bg-obsidian text-ivory hover:bg-ink",
  light: "bg-ivory text-obsidian hover:bg-white",
  "outline-dark": "border border-obsidian/80 text-obsidian hover:bg-obsidian hover:text-ivory",
  "outline-light": "border border-ivory/60 text-ivory hover:bg-ivory hover:text-obsidian",
};

const buttonBase =
  "pressable inline-flex min-h-12 items-center justify-center gap-3 px-7 text-[0.875rem] font-medium tracking-[0.04em] transition-[background-color,color,border-color,transform] duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export function buttonClass(tone: Tone = "dark", className?: string) {
  return cn(buttonBase, toneClasses[tone], className);
}

export function Button({ tone = "dark", className, ...props }: ComponentProps<"button"> & { tone?: Tone }) {
  return <button type="button" className={buttonClass(tone, className)} {...props} />;
}

export function ButtonLink({
  tone = "dark",
  className,
  ...props
}: ComponentProps<typeof Link> & { tone?: Tone }) {
  return <Link className={buttonClass(tone, className)} {...props} />;
}

/** Quiet text link with an extending hairline arrow — the house call to action */
export function ArrowLink({ children, className, ...props }: ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link
      className={cn("group inline-flex min-h-11 items-center gap-4 text-[0.875rem] font-medium tracking-[0.04em] whitespace-nowrap", className)}
      {...props}
    >
      <span>{children}</span>
      <HairlineArrow />
    </Link>
  );
}

/* ---------- Price ---------- */

export function PriceDisplay({
  price,
  compareAt,
  className,
}: {
  price: number;
  compareAt?: number;
  className?: string;
}) {
  return (
    <span className={cn("tabular-nums", className)}>
      {compareAt && compareAt > price ? (
        <>
          <span className="sr-only">Now </span>
          {formatPrice(price)}
          <span className="sr-only">, was </span>
          <s className="ml-2 text-taupe">{formatPrice(compareAt)}</s>
        </>
      ) : (
        formatPrice(price)
      )}
    </span>
  );
}

/* ---------- Breadcrumbs ---------- */

export function Breadcrumbs({ items, className }: { items: { label: string; href?: string }[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-caption text-taupe", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden="true" className="h-px w-3 bg-current opacity-50" />
            )}
            {item.href ? (
              <Link href={item.href} className="link-line hover:text-obsidian">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-obsidian">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ---------- Section heading ---------- */

export function SectionHeading({
  title,
  intro,
  as: Tag = "h2",
  className,
  children,
}: {
  title: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div className="max-w-2xl">
        <Tag className="display-md">{title}</Tag>
        {intro && <p className="mt-4 max-w-[46ch] text-taupe">{intro}</p>}
      </div>
      {children}
    </div>
  );
}
