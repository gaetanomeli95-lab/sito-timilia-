import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import GoogleTranslateScript from "@/components/GoogleTranslateScript";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TIMILIA – Pizza di Sicilia | Pizzeria Palermo",
  description: "Nel cuore del centro storico di Palermo, a due passi dai Quattro Canti. Tradizione siciliana contemporanea. Pizza senza glutine TERA.",
  keywords: ["pizzeria", "Palermo", "Sicilia", "pizza senza glutine", "TERA", "TIMILIA", "Quattro Canti"],
  authors: [{ name: "TIMILIA" }],
  openGraph: {
    title: "TIMILIA – Pizza di Sicilia",
    description: "Tradizione siciliana contemporanea. Pizzeria nel cuore di Palermo.",
    type: "website",
    locale: "it_IT",
    images: ["/images/hero-iniziale-desktop.png"],
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
  url: "https://www.pizzatimilia.it",
  openingHours: ["Mar-Dom 19:00-23:30"],
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
      </body>
    </html>
  );
}
