/*
 * Fallbacks for client navigations between dynamic routes. Direct visits are fully prerendered
 * (generateStaticParams), so these only flash while the next page's payload arrives.
 */
const block = "bg-parchment motion-safe:animate-pulse";

export function ProductSkeleton() {
  return (
    <div className="wrap grid gap-10 pt-16 pb-24 lg:grid-cols-12 lg:gap-14" aria-busy="true" aria-label="Loading piece">
      <div className={`aspect-[4/5] lg:col-span-7 ${block}`} />
      <div className="space-y-5 lg:col-span-5">
        <div className={`h-10 w-3/4 ${block}`} />
        <div className={`h-6 w-1/3 ${block}`} />
        <div className={`h-24 w-full ${block}`} />
        <div className={`h-12 w-full ${block}`} />
      </div>
    </div>
  );
}

export function CollectionSkeleton() {
  return (
    <div className="wrap pt-16 pb-24" aria-busy="true" aria-label="Loading collection">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-5">
          <div className={`h-20 w-2/3 ${block}`} />
          <div className={`h-16 w-full ${block}`} />
        </div>
        <div className={`aspect-[5/4] lg:col-span-6 lg:col-start-7 ${block}`} />
      </div>
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="wrap pt-16 pb-24" aria-busy="true" aria-label="Loading story">
      <div className="mx-auto max-w-3xl space-y-5">
        <div className={`mx-auto h-14 w-3/4 ${block}`} />
        <div className={`mx-auto h-6 w-1/2 ${block}`} />
      </div>
      <div className={`mx-auto mt-14 aspect-[16/9] max-w-5xl ${block}`} />
    </div>
  );
}
