import type { Metadata } from "next";
import { Montserrat, Mulish } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Atmosphere from "@/components/Atmosphere";
import CookieConsent from "@/components/CookieConsent";
import Analytics from "@/components/Analytics";
import { BRAND } from "@/data/brand";

// Display face — Montserrat Light, tracked tight. Body — Mulish.
// This pairing is the one holzer.in uses and it carries most of the
// boutique feel; the old Fraunces/Instrument pair read much warmer.
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["200", "300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  variable: "--font-mulish",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const description =
  "Hand-built sofas, beds, dining and accents in solid wood. Commissioned, not mass-produced. An Indian furniture atelier in Panchkula.";

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.domain),
  title: {
    default: "Oaklen — Furniture that outlives trends",
    template: "%s — Oaklen",
  },
  description,
  keywords: [
    "furniture", "solid wood furniture", "handmade sofa", "custom furniture India",
    "premium furniture Panchkula", "designer furniture", "made to order furniture",
  ],
  openGraph: {
    title: "Oaklen — Furniture that outlives trends",
    description,
    url: BRAND.domain,
    siteName: "Oaklen",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Oaklen" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Oaklen — Furniture that outlives trends",
    description,
    images: ["/og.svg"],
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  alternates: { canonical: BRAND.domain },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${montserrat.variable} ${mulish.variable}`}>
        <Analytics />
        <CartProvider>
          <Atmosphere />
          <Nav />
          <main>{children}</main>
          <Footer />
          <CookieConsent />
        </CartProvider>
      </body>
    </html>
  );
}
