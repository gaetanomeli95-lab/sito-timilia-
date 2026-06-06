"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import Image from "next/image";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#ambient", label: "Esperienza" },
  { href: "#tera", label: "Tera" },
  { href: "#menu", label: "Menu" },
  { href: "#brand", label: "Brand" },
  { href: "#contatti", label: "Contatti" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-white/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#hero" className="flex items-center gap-3">
              <Image
                src="/images/logo.png"
                alt="TIMILIA"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="text-foreground font-semibold tracking-[0.2em] text-sm uppercase">
                TIMILIA
              </span>
            </a>

            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground/70 hover:text-gold text-xs tracking-[0.15em] uppercase transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-4 ml-2 pl-6 border-l border-white/10">
              <a
                href="https://www.instagram.com/pizzatimilia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/timiliapalermo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/50 hover:text-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-foreground p-2"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-foreground p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-foreground text-2xl tracking-[0.2em] uppercase hover:text-gold transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
