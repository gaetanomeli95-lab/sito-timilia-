import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-700/[0.03] rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-md"
      >
        <h1 className="text-gold text-3xl font-light tracking-[0.3em] mb-4">TIMILIA</h1>
        <div className="h-px w-16 bg-gold/30 mx-auto mb-6" />
        <h2 className="text-foreground text-6xl font-light mb-4">404</h2>
        <p className="text-foreground/40 text-sm font-light mb-8">
          La pagina che cerchi non esiste o è stata spostata.
        </p>
        <Link
          href="/"
          className="inline-flex items-center px-6 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 transition-colors"
        >
          Torna alla home
        </Link>
      </motion.div>
    </div>
  );
}
