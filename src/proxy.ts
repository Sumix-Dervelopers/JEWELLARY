import { NextResponse, type NextRequest } from "next/server";
import { knownSlugs } from "@/data/slugs";

/*
 * Dynamic pages stream behind <Suspense> so client navigations are instant, which means a
 * notFound() inside them can no longer change the HTTP status. This check runs first, so an
 * unknown product, collection or story returns a real 404 to browsers and crawlers.
 */
const sets: Record<string, Set<string>> = {
  products: new Set(knownSlugs.products),
  collections: new Set(knownSlugs.collections),
  journal: new Set(knownSlugs.journal),
};

export function proxy(request: NextRequest) {
  const [, section, slug, ...rest] = request.nextUrl.pathname.split("/");
  const known = sets[section];
  if (known && slug && (rest.length > 0 || !known.has(slug))) {
    // Rewriting to a path no route matches renders app/not-found.tsx with a 404 status.
    return NextResponse.rewrite(new URL("/_missing", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path+", "/collections/:path+", "/journal/:path+"],
};
