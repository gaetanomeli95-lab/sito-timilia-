"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu as MenuIcon, X, Instagram, Facebook, User, ShoppingBag, LogOut } from "lucide-react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import CustomerAuthModal from "./CustomerAuthModal";
import LanguageSelector from "./LanguageSelector";
import { supabase } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

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
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save active section to localStorage when it changes
  useEffect(() => {
    if (activeSection && window.location.pathname === "/") {
      localStorage.setItem('timilia_active_section', activeSection);
    }
  }, [activeSection]);

  // Restore scroll to saved section when returning to homepage
  useEffect(() => {
    if (window.location.pathname === "/") {
      const savedSection = localStorage.getItem('timilia_active_section');
      if (savedSection && savedSection !== "hero") {
        const element = document.getElementById(savedSection);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        }
      }
    }
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
    if (!isHomePage) {
      e.preventDefault();
      setMenuOpen(false);
      router.push(`/${link.href}`);
      return;
    }
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAuthUser(null);
    setUserMenuOpen(false);
    router.push("/");
  };

  const handleProfileClick = () => {
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push("/account");
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled || !isHomePage
            ? "bg-background/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <a href={isHomePage ? "#hero" : "/"} className="flex items-center gap-3 group">
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
                    href={isHomePage ? link.href : `/${link.href}`}
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
              <a
                href="/tera#shop"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 hover:border-gold/50 transition-all duration-300"
                aria-label="Shop TERA"
              >
                <ShoppingBag size={16} strokeWidth={1.5} />
                <span>Shop</span>
              </a>
              <LanguageSelector />
              {authUser ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-9 h-9 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center text-gold text-xs font-medium hover:bg-gold/20 transition-colors"
                    aria-label="Account"
                  >
                    {(authUser.email || "U").charAt(0).toUpperCase()}
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-gold/15 bg-[#111111] shadow-2xl py-1.5 z-50">
                        <button
                          onClick={handleProfileClick}
                          className="w-full px-4 py-2.5 text-left text-sm text-foreground/70 hover:text-gold hover:bg-gold/5 transition-colors flex items-center gap-2"
                        >
                          <User size={15} strokeWidth={1.5} />
                          Il mio profilo
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-foreground/70 hover:text-red-400 hover:bg-red-500/5 transition-colors flex items-center gap-2 border-t border-white/5 mt-1"
                        >
                          <LogOut size={15} strokeWidth={1.5} />
                          Esci
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-foreground/50 hover:text-gold hover:border-gold/30 transition-colors"
                  aria-label="Accedi / Registrati"
                >
                  <User size={18} strokeWidth={1.5} />
                </button>
              )}
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
                    href={isHomePage ? link.href : `/${link.href}`}
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
                <a
                  href="/tera#shop"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-sm tracking-[0.15em] uppercase font-medium hover:bg-gold/25 hover:border-gold/50 transition-all duration-300"
                  aria-label="Shop TERA"
                >
                  <ShoppingBag size={18} strokeWidth={1.5} />
                  <span>Shop</span>
                </a>
                {authUser ? (
                  <>
                    <button
                      onClick={handleProfileClick}
                      className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors"
                      aria-label="Il mio profilo"
                    >
                      <User size={24} strokeWidth={1.5} />
                      <span className="text-sm tracking-wide">Profilo</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-foreground/50 hover:text-red-400 transition-colors"
                      aria-label="Esci"
                    >
                      <LogOut size={24} strokeWidth={1.5} />
                      <span className="text-sm tracking-wide">Esci</span>
                    </button>
                  </>
                ) : (
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
                )}
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
