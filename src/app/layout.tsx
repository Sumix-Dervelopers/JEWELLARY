import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope } from "next/font/google";
import Script from "next/script";
import { site } from "@/config/site";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { StoreHydrator } from "@/components/layout/StoreHydrator";
import { MotionProvider } from "@/components/layout/MotionProvider";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  axes: ["opsz"],
  style: ["normal", "italic"],
  variable: "--font-bodoni",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  // Without a configured domain, fall back to the deployment URL (or localhost) so social images resolve.
  metadataBase: new URL(
    site.url ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : `http://localhost:${process.env.PORT ?? 3000}`),
  ),
  title: {
    default: `${site.name} | Fine jewellery to be treasured`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    title: `${site.name} | Fine jewellery to be treasured`,
    description: site.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  interactiveWidget: "resizes-content",
  themeColor: "#10100f",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className={`${bodoni.variable} ${manrope.variable} no-js`} suppressHydrationWarning>
      <head>
        {/* Reveals stay visible without JavaScript; this flag is removed before first paint */}
        <Script id="init-flags" strategy="beforeInteractive">
          {"document.documentElement.classList.remove('no-js');try{if(localStorage.getItem('sumix-announce-off')==='1')document.documentElement.dataset.announce='off'}catch(e){}"}
        </Script>
      </head>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="sr-only z-[100] bg-obsidian px-4 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <MotionProvider>
          <AnnouncementBar />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <CartDrawer />
          <StoreHydrator />
        </MotionProvider>
      </body>
    </html>
  );
}
