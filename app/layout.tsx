import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Geist } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import "./sections.css";
import DockNavigation from "@/components/DockNavigation";
import Footer from "@/components/Footer";
import IntroPreloader from "@/components/IntroPreloader";
import AmbientLayers from "@/components/AmbientLayers";
import SiteHeader from "@/components/SiteHeader";
import CustomCursor from "@/components/CustomCursor";
import GroundObserver from "@/components/GroundObserver";
import SmoothScroll from "@/components/SmoothScroll";
import { GA_MEASUREMENT_ID, analyticsEnabled } from "@/lib/analytics";
import { SITE_URL } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  // Resolves the relative canonical URLs each page sets.
  metadataBase: new URL(SITE_URL),
  title: "BLUETRON INFOTECH LLP",
  description: "BLUETRON INFOTECH LLP is a technology solutions and IT infrastructure company delivering reliable, scalable and cost-effective solutions for Corporate, Government, PSU, Education and Enterprise customers.",
  keywords: [
    "BLUETRON INFOTECH LLP",
    "Bluetron",
    "Bluetrons",
    "IT Infrastructure",
    "Enterprise Networking",
    "Cybersecurity",
    "Data Center",
    "CCTV and Surveillance",
    "Managed IT Services",
    "System Integrator",
  ],
  authors: [{ name: "BLUETRON INFOTECH LLP" }],
  openGraph: {
    title: "BLUETRON INFOTECH LLP",
    description: "BLUETRON INFOTECH LLP is a technology solutions and IT infrastructure company delivering reliable, scalable and cost-effective solutions for Corporate, Government, PSU, Education and Enterprise customers.",
    url: SITE_URL,
    siteName: "BLUETRON INFOTECH LLP",
    locale: "en_IN",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  // Search Console's HTML-tag ownership check. Set GOOGLE_SITE_VERIFICATION to
  // the content="…" value Google gives you; while unset, no tag is rendered.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: [
      { url: "/favicon.webp", type: "image/webp" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.webp",
    apple: "/favicon.webp",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${jetbrainsMono.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-screen flex flex-col bg-surface-base text-ink-1 relative selection:bg-accent/30 selection:text-ink-1 font-sans overflow-x-hidden">
        {/* Reports which ground the fixed chrome is floating over. Renders
            nothing; see lib/useGroundObserver.ts for why it exists. */}
        <GroundObserver />
        {/* Eased wheel scrolling for the sticky layers; see the component. */}
        <SmoothScroll />
        <CustomCursor />
        <IntroPreloader />
        <AmbientLayers />
        <DockNavigation />
        <SiteHeader />
        <main className="flex flex-1 flex-col relative z-10 w-full">
          {children}
        </main>
        <Footer />
      </body>
      {/* GA4 on every route. Client-side navigations are counted by GA's
          Enhanced Measurement (browser history events), not by us. */}
      {analyticsEnabled && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
    </html>
  );
}
