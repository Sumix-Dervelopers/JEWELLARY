import Link from "next/link";
import { collections } from "@/data/collections";
import { ArrowLink } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70svh] flex-col justify-center py-24">
      <p className="text-caption text-taupe">Page not found</p>
      <h1 className="display-xl mt-4 max-w-[14ch]">This piece has gone missing.</h1>
      <p className="lede mt-6 max-w-[44ch] text-taupe">
        The page you were looking for may have moved, or the piece may no longer be in the collection.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-2">
        <ArrowLink href="/shop">Browse all jewellery</ArrowLink>
        <ArrowLink href="/" className="text-taupe hover:text-obsidian">
          Return home
        </ArrowLink>
      </div>
      <ul className="mt-16 flex flex-wrap gap-x-8 gap-y-2 border-t border-line pt-8">
        {collections.map((c) => (
          <li key={c.slug}>
            <Link href={`/collections/${c.slug}`} className="link-line font-display text-xl">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
