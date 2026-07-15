"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export default function MaintenancePage() {
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const res = await fetch("/api/customers/profile", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          const data = res.ok ? await res.json() : null;
          if (data?.profile?.is_admin) {
            setIsAdmin(true);
          }
        }
      } catch {
        // ignore
      }
      setChecking(false);
    };
    checkAdmin();
  }, []);

  const handleBypass = () => {
    document.cookie = "maintenance_bypass=true; path=/; max-age=86400";
    window.location.href = "/";
  };

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
        <div className="mb-8">
          <h1 className="text-gold text-3xl md:text-4xl font-light tracking-[0.3em] mb-3">
            TIMILIA
          </h1>
          <div className="h-px w-16 bg-gold/30 mx-auto" />
        </div>

        <div className="rounded-2xl border border-gold/15 bg-white/[0.02] p-8 backdrop-blur-sm">
          <h2 className="text-foreground text-xl font-light mb-3">
            Sito in manutenzione
          </h2>
          <p className="text-foreground/50 text-sm font-light leading-relaxed mb-6">
            Stiamo lavorando per offrirti un'esperienza ancora migliore.
            Torneremo online a breve.
          </p>
          <p className="text-foreground/30 text-xs font-light">
            Grazie per la pazienza · TIMILIA
          </p>
        </div>

        <p className="text-foreground/20 text-[10px] tracking-wide mt-8">
          Via Maqueda 221, 90133 Palermo PA
        </p>

        {checking ? (
          <div className="mt-6 flex items-center justify-center gap-2 text-foreground/30 text-xs">
            <Loader2 size={14} className="animate-spin" />
            <span>Verifica accesso...</span>
          </div>
        ) : (
          isAdmin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleBypass}
              className="mt-6 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 transition-colors"
            >
              Entra come Admin
            </motion.button>
          )
        )}
      </motion.div>
    </div>
  );
}
