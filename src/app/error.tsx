"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md"
      >
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="relative">
          <h1 className="text-gold text-3xl font-light tracking-[0.3em] mb-4">TIMILIA</h1>
          <div className="h-px w-16 bg-gold/30 mx-auto mb-6" />
          <h2 className="text-foreground text-xl font-light mb-3">
            Qualcosa è andato storto
          </h2>
          <p className="text-foreground/40 text-sm font-light mb-8">
            Si è verificato un errore imprevisto. Riprova o torna alla home.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 transition-colors"
            >
              Riprova
            </button>
            <a
              href="/"
              className="px-6 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-foreground/50 text-xs tracking-[0.15em] uppercase font-medium hover:text-gold hover:border-gold/30 transition-colors"
            >
              Home
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
