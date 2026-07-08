"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, Instagram, Facebook, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import CustomerAuthModal from "./CustomerAuthModal";
import LanguageSelector from "./LanguageSelector";

const navLinks = [
  { href: "#hero", label: "Home", type: "anchor" },
  { href: "#ambient", label: "Esperienza", type: "anchor" },
  { href: "#tera", label: "Tera", type: "anchor" },
  { href: "/menu", label: "Menu", type: "route" },
  { href: "#brand", label: "Brand", type: "anchor" },
  { href: "#recensioni", label: "Recensioni", type: "anchor" },
  { href: "#contatti", label: "Contatti", type: "anchor" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  useEffect(() => {
    const sections = ["hero", "ambient", "tera", "menu", "brand", "recensioni", "contatti"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent, link: typeof navLinks[number]) => {
    if (link.type === "route") {
      e.preventDefault();
      setMenuOpen(false);
      router.push(link.href);
      return;
    }
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-background/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href="#hero" className="flex items-center gap-3 group">
              <Image
                src="/images/logo-timilia-original.jpg"
                alt="TIMILIA"
                width={52}
                height={52}
                className="object-contain transition-transform duration-500 group-hover:scale-110"
              />
              <span className="text-foreground font-semibold tracking-[0.2em] text-sm uppercase">
                TIMILIA
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive =
                  link.type === "anchor" && activeSection === link.href.replace("#", "");
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    className={`relative text-xs tracking-[0.15em] uppercase transition-colors duration-300 group ${
                      isActive ? "text-gold" : "text-foreground/70 hover:text-gold"
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ${
                        isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-60"
                      }`}
                    />
                  </a>
                );
              })}
            </div>

            <div className="hidden md:flex items-center gap-3 ml-2 pl-6 border-l border-white/10">
              <LanguageSelector />
              <button
                onClick={() => setAuthOpen(true)}
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-foreground/50 hover:text-gold hover:border-gold/30 transition-colors"
                aria-label="Accedi / Registrati"
              >
                <User size={18} strokeWidth={1.5} />
              </button>
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
              className={`md:hidden text-foreground p-2 ${menuOpen ? "opacity-0 pointer-events-none" : "opacity-100"} transition-opacity`}
              aria-label="Toggle menu"
            >
              <MenuIcon size={24} />
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
            className="fixed inset-0 z-[60] bg-background/98 backdrop-blur-xl flex flex-col items-center justify-center md:hidden"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-foreground p-2"
              aria-label="Close menu"
            >
              <X size={28} />
            </button>
            <div className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => {
                const isActive =
                  link.type === "anchor" && activeSection === link.href.replace("#", "");
                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`text-2xl tracking-[0.2em] uppercase transition-colors relative ${
                      isActive ? "text-gold" : "text-foreground hover:text-gold"
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="mobile-active"
                        className="absolute -bottom-2 left-0 right-0 h-px bg-gold"
                      />
                    )}
                  </motion.a>
                );
              })}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center gap-6 mt-4"
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors"
                  aria-label="Accedi / Registrati"
                >
                  <User size={24} strokeWidth={1.5} />
                  <span className="text-sm tracking-wide">Accedi</span>
                </button>
                <a
                  href="https://www.instagram.com/pizzatimilia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/50 hover:text-gold transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={24} strokeWidth={1.5} />
                </a>
                <a
                  href="https://www.facebook.com/timiliapalermo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/50 hover:text-gold transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={24} strokeWidth={1.5} />
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-4"
              >
                <LanguageSelector />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CustomerAuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
