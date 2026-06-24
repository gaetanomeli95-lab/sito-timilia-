"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { menuCategories } from "@/data/menuData";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function MenuItemCard({ item, index }: { item: typeof menuCategories[0]["items"][0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const hasImage = !!item.image;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: "easeOut" }}
      className="py-6 border-b border-white/5 last:border-b-0"
    >
      <div className={`flex gap-5 ${hasImage ? "items-start" : "items-baseline justify-between"}`}>
        {hasImage && (
          <div className="relative w-24 h-24 md:w-44 md:h-44 lg:w-64 lg:h-64 flex-shrink-0 overflow-hidden rounded-sm">
            <Image
              src={item.image!}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 96px, (max-width: 1024px) 176px, 256px"
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-baseline gap-4 mb-2">
            <h3 className="text-foreground text-base md:text-lg font-light tracking-wide">
              {item.name}
            </h3>
            <span className="text-gold text-base md:text-lg font-light whitespace-nowrap">
              € {item.price.toFixed(2)}
            </span>
          </div>
          {item.description && (
            <p className="text-foreground/50 text-sm font-light leading-relaxed">
              {item.description}
            </p>
          )}
          {item.note && (
            <p className="text-foreground/30 text-xs mt-2 font-light">
              {item.note}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0].id);
  const tabsRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (el) {
      const offset = 120;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Logo watermark a piena pagina dietro ai prodotti del menu */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.12]">
        <Image
          src="/images/logo.png"
          alt=""
          fill
          className="object-contain p-4 md:p-10"
          sizes="100vw"
          priority
        />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-foreground/60 hover:text-gold transition-colors text-xs tracking-[0.2em] uppercase font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Torna al sito
          </Link>
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
            Menu
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 pt-32 pb-16 md:pt-40 md:pb-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gold/80 text-xs tracking-[0.3em] uppercase font-medium block mb-4"
          >
            Timilia — Pizza di Sicilia
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-[0.05em] text-foreground mb-6"
          >
            Il nostro menu
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-foreground/50 text-base md:text-lg font-light max-w-2xl mx-auto leading-relaxed"
          >
            Ogni piatto racconta una storia di ricerca, equilibrio e identità. La nostra pizza nasce da una ricerca continua sulle materie prime, da impasti studiati e da combinazioni di gusto che uniscono tradizione e creatività.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="w-16 h-[1px] bg-gold/40 mx-auto mt-8"
          />
        </div>
      </section>

      {/* Sticky Category Tabs */}
      <div
        ref={tabsRef}
        className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
            {menuCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-4 py-2 text-xs tracking-[0.15em] uppercase font-medium whitespace-nowrap transition-colors duration-300 ${
                  activeCategory === cat.id
                    ? "text-gold"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {cat.title}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Menu Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-6 lg:px-8 py-16 md:py-24">
        {menuCategories.map((category, catIndex) => (
          <section
            key={category.id}
            id={category.id}
            className="mb-20 md:mb-28 last:mb-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-light tracking-[0.05em] text-foreground mb-3">
                {category.title}
              </h2>
              {category.subtitle && (
                <p className="text-foreground/40 text-sm font-light leading-relaxed max-w-xl">
                  {category.subtitle}
                </p>
              )}
              <div className="w-12 h-[1px] bg-gold/30 mt-4" />
            </motion.div>

            <div>
              {category.items.map((item, itemIndex) => (
                <MenuItemCard key={`${catIndex}-${itemIndex}`} item={item} index={itemIndex} />
              ))}
            </div>
          </section>
        ))}
      </main>

      {/* Footer Note */}
      <section className="relative z-10 border-t border-white/5 py-12">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <p className="text-foreground/30 text-xs font-light tracking-[0.1em]">
            In assenza di prodotti freschi verranno utilizzati prodotti surgelati di ottima qualita.
            <br />
            Coperto € 2.50
          </p>
        </div>
      </section>
    </div>
  );
}
