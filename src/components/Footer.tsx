"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Phone, MapPin, Clock, Instagram, Facebook, Star, MessageCircle } from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer id="contatti" ref={ref} className="relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0">
        <Image
          src="/images/sfondi/5.png"
          alt="Sfondo"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.25) 25%, rgba(10,10,10,0.25) 75%, rgba(10,10,10,0.95) 100%)",
          }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8"
        >
          <div className="lg:col-span-1">
            <Image
              src="/images/logo.png"
              alt="TIMILIA"
              width={50}
              height={50}
              className="object-contain mb-6"
            />
            <p className="text-foreground/50 text-sm font-light leading-relaxed mb-6">
              Nel cuore del centro storico di Palermo. Tradizione siciliana contemporanea.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/pizzatimilia/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-gold hover:border-gold/30 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.facebook.com/timiliapalermo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-gold hover:border-gold/30 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a
                href="https://www.google.com/search?sca_esv=9bf71fb085e6e221&sxsrf=ANbL-n5C1BswKzsh3MMfqFXnxA1UNs61fQ:1780736562454&q=timilia+palermo+&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOeW-wBQrQSO9Tzvsyb0OqkQRCd8oqW9LtAYlf_3blnonTBUENV_DfNg4K3pmZNELuaQWlHQ%3D&uds=ALYpb_k6otuSYDT1zFYqBpNGDSzKyH7hSZ0tf_YL8wbw4Ic3MJViW4bMqzma7H6DSYEb3U8r_lKXMCfMliyiQfGaZ8GYLUYrv2EP9sH63xUiBs4Cgyy-GHo&sa=X&ved=2ahUKEwiRl_nRoPKUAxWYnP0HHdOJBgkQ3PALegQIGhAE&biw=1920&bih=957&dpr=1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-gold hover:border-gold/30 transition-colors"
                aria-label="Google Recensioni"
              >
                <Star size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-foreground text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Contatti
            </h3>
            <div className="space-y-4">
              <a
                href="tel:+393792483597"
                className="flex items-center gap-3 text-foreground/50 hover:text-gold transition-colors group"
              >
                <Phone size={16} strokeWidth={1.5} className="text-gold/60 group-hover:text-gold" />
                <span className="text-sm font-light">+39 379 248 3597</span>
              </a>
              <a
                href="https://wa.me/393792483597"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-foreground/50 hover:text-gold transition-colors group"
              >
                <MessageCircle size={16} strokeWidth={1.5} className="text-gold/60 group-hover:text-gold" />
                <span className="text-sm font-light">WhatsApp</span>
              </a>
              <div className="flex items-start gap-3 text-foreground/50">
                <MapPin size={16} strokeWidth={1.5} className="text-gold/60 mt-1 shrink-0" />
                <span className="text-sm font-light">
                  Via Maqueda, 213<br />
                  90133 Palermo PA
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-foreground text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Orari
            </h3>
            <div className="space-y-3 text-foreground/50 text-sm font-light">
              <div className="flex items-center gap-3">
                <Clock size={16} strokeWidth={1.5} className="text-gold/60 shrink-0" />
                <span>Mar – Dom: 19:00 – 23:30</span>
              </div>
              <p className="text-foreground/30 text-xs">Lunedì chiuso</p>
            </div>
          </div>

          <div>
            <h3 className="text-foreground text-xs tracking-[0.2em] uppercase font-medium mb-6">
              Link
            </h3>
            <div className="space-y-3">
              {[
                { label: "Home", href: "#hero" },
                { label: "Tera", href: "#tera" },
                { label: "Menu", href: "#menu" },
                { label: "Contatti", href: "#contatti" },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="block text-foreground/50 hover:text-gold text-sm font-light transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-foreground/30 text-xs font-light tracking-wide">
            © {new Date().getFullYear()} TIMILIA – Pizza di Sicilia. Tutti i diritti riservati.
          </p>
          <p className="text-foreground/20 text-xs font-light">
            Via Maqueda 213, Palermo
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
