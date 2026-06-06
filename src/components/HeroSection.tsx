"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-banner.png"
          alt="TIMILIA Pizza di Sicilia"
          fill
          className="object-cover object-top"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
          className="mb-6"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
            Pizzeria Palermo
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: "easeOut" }}
          className="text-6xl md:text-8xl lg:text-9xl font-light tracking-[0.1em] text-foreground mb-4"
        >
          TIMILIA
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="text-xl md:text-2xl font-light tracking-[0.25em] text-foreground/90 mb-6"
        >
          Pizza di Sicilia
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1, ease: "easeOut" }}
          className="w-16 h-[1px] bg-gold/60 mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: "easeOut" }}
          className="text-foreground/60 text-sm md:text-base font-light tracking-[0.1em] max-w-md mb-12"
        >
          Tradizione siciliana contemporanea.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="tel:+393792483597"
            className="px-8 py-4 bg-gold text-background text-xs tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300"
          >
            Prenota un tavolo
          </a>
          <a
            href="#tera"
            className="px-8 py-4 border border-foreground/30 text-foreground text-xs tracking-[0.2em] uppercase font-medium hover:border-gold hover:text-gold transition-colors duration-300"
          >
            Scopri il progetto TERA
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-[1px] h-12 bg-gradient-to-b from-gold/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
