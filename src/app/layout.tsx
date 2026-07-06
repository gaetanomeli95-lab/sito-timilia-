import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

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
  },
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
      <body className="min-h-full flex flex-col bg-background text-foreground">{children}</body>
    </html>
  );
}
