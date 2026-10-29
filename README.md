# Ratna Jewellers — Kathmandu storefront concept

Designed and developed by **Sumix Developers** as a portfolio project.

A luxury fine-jewellery storefront built with Next.js 16 (App Router, Cache Components), React 19,
Tailwind CSS 4, Motion and Base UI.

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run start        # serve the production build
```

| Script               | What it does                                                        |
| -------------------- | ------------------------------------------------------------------- |
| `npm run lint`       | ESLint (Next.js core-web-vitals + TypeScript rules)                 |
| `npm run typecheck`  | Generates route types, then `tsc --noEmit`                          |
| `npm test`           | Vitest unit tests (cart maths, filters, search, validation)         |
| `npm run test:e2e`   | Playwright end-to-end tests; starts `next start` on port 3100       |
| `npm run images`     | Rebuilds every crop in `src/assets/images` from `design/source-images` |

End-to-end tests use the locally installed Google Chrome (`channel: "chrome"`). Run
`npm run build` first, as the test server is `next start`. On a machine without Chrome, run
`npx playwright install chromium` and set `E2E_CHANNEL=chromium`.

---

## What is real and what is a demonstration

**Works today, fully client-side:**

- Catalogue browsing, collection pages, product pages with gallery, zoom and swipe.
- Filtering by category, occasion and price, plus sorting. State lives in the URL, so it is shareable and survives a refresh.
- Product search (overlay and `/search`).
- Guest **bag** and **wishlist**, persisted in `localStorage` on the visitor's device. Quantities are capped per piece, unavailable sizes are blocked, and stored bags are re-validated against the catalogue on load.
- Correct 404s for unknown products, collections and stories (see `src/proxy.ts`).

**Not connected yet. The UI says so honestly:**

| Feature            | Current behaviour                                                       | To connect it                                                         |
| ------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Newsletter         | Validates the address server-side, then reports "not connected yet"; nothing is stored | Set `NEWSLETTER_WEBHOOK_URL` (see `src/app/api/newsletter/route.ts`)  |
| Contact form       | Validates server-side, then reports that nothing was sent               | Set `ENQUIRY_WEBHOOK_URL` (see `src/app/api/enquiry/route.ts`)        |
| Checkout           | **Enquiry-based.** Sends the bag as an order request; prices are recomputed on the server. No payment is taken and no card details are collected anywhere | Set `ENQUIRY_WEBHOOK_URL`, or replace with a hosted payment flow (below) |
| Accounts           | None. Bag and wishlist are per device                                   | Add an auth provider, then sync the stores to a backend               |
| Inventory          | Static `availability` field per product                                 | Connect a commerce backend                                            |

### Payments

Do not build a card form. Use a hosted checkout from a provider that supports your market
(redirect or embedded checkout). Create the session in a route handler from server-side prices
(`getProductById`, as `api/enquiry` already does) and keep secret keys in server-only
environment variables.

### Moving the catalogue to a backend

`src/data/products.ts` matches the `Product` type in `src/lib/types.ts`. Replace the array with
a fetch from your commerce API inside a `"use cache"` function. The pages, filters and cart
already go through `src/lib/catalog.ts`. Then update or remove the slug registry in
`src/data/slugs.ts`, which Proxy uses for 404s; a unit test keeps it in sync today.

---

## Portfolio contact details and launch checklist

This project is configured as a fictional Kathmandu jewellery-store concept for portfolio use.
Everything lives in **`src/config/site.ts`**. Its contact details are sample values, not a real shop:

- **Email:** `hello@ratnajewellers.example` uses the reserved `.example` domain and cannot receive mail.
- **Location and hours:** Thamel, Kathmandu, Nepal; Sunday–Friday, 10:00 am–6:00 pm (NPT). These are illustrative.
- **Phone** is left `null` (hidden) so the site never shows a number that might belong to someone.
- **Policies** (`delivery`, `returns`, `giftPresentation`) on `/client-care` are sample copy.
- **`credit`** shows "Designed and developed by Sumix Developers" in the footer. Set `credit.href` to link it to the studio's website.
- **`isPortfolioConcept: true`** makes the footer say the site is a portfolio concept. Set it to `false` for a real launch.
- Replace these placeholders with verified business details before presenting this as a real shop.
- **Social links** are empty and hidden until set.
- **Currency** defaults to Nepalese rupees with lakh grouping (`Rs 4,85,000`). Change `currency` for INR, USD, etc.
- **Ring sizes** default to US 5–9. Confirm the standard you use.
- **`catalogueIsDemo: true`** shows a demonstration notice on every product page and in the footer, and **withholds Product structured data** from search engines. Set it to `false` only once names, prices, metals and stones are verified.

The product data (`src/data/products.ts`) is illustrative. Material lines describe what each
photograph shows; no metal purity, stone grade, origin, certification or manufacturing claim
is made anywhere on the site. The brand story (`/about`) is portfolio-concept copy; add real
history, workshop or sourcing details only when they are confirmed. The footer labels the site
as a portfolio concept, and the contact form and newsletter are not connected to an email service.

---

## Imagery

All photography was **generated for this build with Figma AI** (Gemini image model) to a single
art direction: warm directional light, deep shadow, yellow gold, and stone, silk or ivory grounds.
Masters are in `design/source-images/`; the crops used on the site are produced by
`scripts/process-images.mjs`.

- The images depict **illustrative pieces, not real Ratna Jewellers products**. Replace them with real product photography before selling. Drop a new master into `design/source-images/` under the same name (or edit the crop table) and run `npm run images`.
- Review Figma's AI terms for commercial use of generated images before launch.
- The catalogue is deliberately small (8 pieces) because each product image is a crop of a photograph in which that piece actually appears. More imagery can be generated when Figma AI credits allow; the prompts follow the house direction described above.

All images are imported statically, so `next/image` gets intrinsic sizes and blur placeholders,
and serves AVIF or WebP at responsive widths. The hero uses `<picture>` art direction, so phones
download a vertical frame and desktops a horizontal one.

---

## Design system

**Palette** (`src/app/globals.css`, `@theme`): obsidian `#10100F`, ink `#080808`, ivory
`#F7F3EB`, parchment `#EFE9DF`, stone `#DDD5C7`, champagne `#C6A66B`, antique `#9C7B45`. Taupe
`#6E655A` (5.1:1 on ivory) and mist `#A39A8C` (6.8:1 on obsidian) are used for secondary text.
Gold is reserved for hairlines, focus rings, icons and small state labels.

**Type:** Bodoni Moda (Didone with an optical-size axis, the vernacular of fashion editorial)
for display; Jost (geometric, Art Deco lineage) for interface and body text. Navigation and
labels stay in sentence case; the tracked caps are reserved for the hero eyebrow and the
footer headings.

**Motion** follows a single shared vocabulary:

| Token            | Value                                  | Used for                      |
| ---------------- | -------------------------------------- | ----------------------------- |
| `--ease-out`     | `cubic-bezier(0.23, 1, 0.32, 1)`       | entrances, hovers, UI         |
| `--ease-in-out`  | `cubic-bezier(0.77, 0, 0.175, 1)`      | on-screen movement, reveals   |
| `--ease-drawer`  | `cubic-bezier(0.32, 0.72, 0, 1)`       | drawers and sheets            |
| `--dur-press`    | 140 ms                                 | press feedback (`scale(0.97)`)|
| `--dur-ui`       | 220 ms                                 | hovers, links, toggles        |
| `--dur-drawer`   | 420 ms                                 | drawers                       |
| `--dur-reveal`   | 700 ms                                 | scroll reveals                |

- **CSS** (off the main thread): the hero choreography (image settle, masked headline lines, staggered copy), hairline arrows, image zoom, curtain reveals and drawer and dialog transitions via Base UI's `data-starting-style` / `data-ending-style`.
- **Motion** (only where it earns its place): the scroll-linked campaign frame (`clip-path` plus a gentle drift), product-grid layout transitions when filtering, the gallery crossfade and swipe, and the active-filter underline.
- Every hover effect is gated to `(hover: hover)`. `prefers-reduced-motion` keeps opacity fades and removes movement, both in CSS and through `MotionConfig reducedMotion="user"`.

**Components:** Base UI provides accessible primitives for the drawers (bag, mobile menu,
filters), dialogs (search, lightbox) and the navigation mega-menu, so focus trapping, Escape
handling and scroll lock come built in.

---

## Project structure

```
src/
  app/                 routes (App Router), sitemap, robots, API route handlers
  components/
    layout/            header, mega menu, mobile menu, search, announcement bar, footer
    home/              homepage sections
    product/           card, gallery, purchase panel, wishlist
    shop/              filterable browser, search results, page intro
    cart/              drawer, line items, bag view
    forms/             newsletter and enquiry forms
    ui/                primitives (buttons, arrow links, price, breadcrumbs), reveal, skeletons
  config/              site.ts (brand facts), navigation.ts
  data/                products, collections, journal, images, slug registry
  lib/                 types, catalogue queries, cart logic, stores, validation, formatting
  proxy.ts             real 404s for unknown dynamic routes
design/source-images/  image masters
scripts/               image pipeline
tests/e2e/             Playwright specs
```

## Deployment (Coolify)

The repo ships a production `Dockerfile` that builds Next.js's standalone server and runs it as a
non-root user on port 3000.

1. In Coolify, create a new resource from this Git repository and choose the **Dockerfile** build pack.
2. Set **Ports Exposes** to `3000` and attach your domain.
3. Add the environment variables from `.env.example`. Tick **Build Variable** on
   `NEXT_PUBLIC_SITE_URL`, because `NEXT_PUBLIC_*` values are baked in at build time; the two
   webhook URLs are read at runtime and need no rebuild.
4. Deploy. The image has a built-in health check on `/`.

To try the image locally: `docker build --build-arg NEXT_PUBLIC_SITE_URL=http://localhost:3000 -t ratna-jewellers .`
then `docker run -p 3000:3000 ratna-jewellers`.

## Notes for developers

- This is Next.js 16 with **Cache Components**. Routes are prerendered; anything reading `searchParams` sits inside `<Suspense>`, and dynamic pages stream their params-dependent content so client navigations stay instant. Read `node_modules/next/dist/docs` before changing caching (see `AGENTS.md`).
- Pages stay mounted (React `<Activity>`) after navigation. Transient UI such as drawers and the lightbox resets itself on hide.
- The project currently lives in a OneDrive folder. OneDrive syncing `node_modules` and `.next` slows Turbopack and occasionally delays hot reload; moving the project outside OneDrive, or excluding those folders, avoids this.
