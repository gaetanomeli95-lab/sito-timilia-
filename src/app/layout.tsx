import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";
import CookieBanner from "@/components/CookieBanner";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pizzeriatimilia.com"),
  title: "TIMILIA – Pizza di Sicilia | Pizzeria Palermo",
  description: "Nel cuore del centro storico di Palermo, a due passi dai Quattro Canti. Tradizione siciliana contemporanea. Pizza senza glutine TERA.",
  keywords: ["pizzeria", "Palermo", "Sicilia", "pizza senza glutine", "TERA", "TIMILIA", "Quattro Canti", "Via Maqueda", "pizza artigianale"],
  authors: [{ name: "TIMILIA" }],
  alternates: {
    canonical: "https://pizzeriatimilia.com",
  },
  openGraph: {
    title: "TIMILIA – Pizza di Sicilia",
    description: "Tradizione siciliana contemporanea. Pizzeria nel cuore di Palermo. Pizza senza glutine TERA.",
    type: "website",
    locale: "it_IT",
    siteName: "TIMILIA",
    url: "https://pizzeriatimilia.com",
    images: [{
      url: "/images/hero-iniziale-desktop.png",
      width: 1200,
      height: 630,
      alt: "TIMILIA – Pizza di Sicilia, Palermo",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TIMILIA – Pizza di Sicilia | Pizzeria Palermo",
    description: "Tradizione siciliana contemporanea. Pizza senza glutine TERA. Via Maqueda 221, Palermo.",
    images: ["/images/hero-iniziale-desktop.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
};

const restaurantJsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "TIMILIA – Pizza di Sicilia",
  description: "Pizzeria nel cuore di Palermo. Tradizione siciliana contemporanea. Pizza senza glutine TERA.",
  servesCuisine: ["Pizza", "Siciliana", "Gluten Free"],
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Via Maqueda, 221",
    addressLocality: "Palermo",
    addressRegion: "Sicilia",
    postalCode: "90133",
    addressCountry: "IT",
  },
  telephone: "+39 379 248 3597",
  url: "https://pizzeriatimilia.com",
  openingHours: ["Mo-Th,Su 11:30-00:00", "Fr-Sa 11:30-01:00"],
  sameAs: [
    "https://www.instagram.com/pizzatimilia/",
    "https://www.facebook.com/timiliapalermo",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <GoogleTranslateScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantJsonLd) }}
        />
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
