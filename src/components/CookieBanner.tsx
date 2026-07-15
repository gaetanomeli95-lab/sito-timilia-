"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";

const COOKIE_CONSENT_KEY = "timilia_cookie_consent";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!consent) {
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setShow(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "declined");
    } catch {
      // ignore
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4"
        >
          <div className="max-w-3xl mx-auto rounded-2xl border border-gold/15 bg-[#111111]/95 backdrop-blur-md p-5 sm:p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <p className="text-foreground/70 text-xs font-light leading-relaxed">
                  Utilizziamo cookie tecnici per il funzionamento del sito (autenticazione, carrello, sessione).
                  Non utilizziamo cookie di profilazione. Consulta la{" "}
                  <Link href="/cookie" className="text-gold hover:underline">
                    Cookie Policy
                  </Link>{" "}
                  e la{" "}
                  <Link href="/privacy" className="text-gold hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={decline}
                  className="px-4 py-2 rounded-full border border-white/15 text-foreground/50 text-xs font-light hover:text-foreground/70 hover:border-white/25 transition-colors"
                >
                  Rifiuta
                </button>
                <button
                  onClick={accept}
                  className="px-5 py-2 rounded-full border border-gold/30 bg-gold/15 text-gold text-xs font-medium hover:bg-gold/25 transition-colors"
                >
                  Accetta
                </button>
                <button
                  onClick={decline}
                  className="p-2 text-foreground/30 hover:text-foreground/60 transition-colors"
                  aria-label="Chiudi"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
