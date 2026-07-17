"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Navigation, ExternalLink } from "lucide-react";

export default function MapSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const mapsEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3160.123!2d13.3615!3d38.1157!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zVmlhIE1hcXVlZGEsIDIyMSwgUGFsZXJtbw!5e0!3m2!1sit!2sit!4v1700000000000";
  const mapsDirectionsUrl = "https://www.google.com/maps/dir/?api=1&destination=Via+Maqueda+221+Palermo";

  return (
    <section
      ref={ref}
      id="mappa"
      className="relative py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(200,169,126,0.06),transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-10"
        >
          <span className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
            Dove siamo
          </span>
          <h2 className="text-foreground text-2xl md:text-3xl font-light tracking-wide mb-4">
            Nel cuore di Palermo
          </h2>
          <div className="w-12 h-[1px] bg-gold/30 mx-auto mb-4" />
          <p className="text-foreground/45 text-sm font-light max-w-md mx-auto">
            Via Maqueda 221, a due passi dai Quattro Canti. Nel centro storico di Palermo.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_90px_rgba(0,0,0,0.4)]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            {/* Map embed */}
            <div className="lg:col-span-2 relative h-[300px] sm:h-[400px] lg:h-[450px] bg-[#0a0a0a]">
              <iframe
                src="https://maps.google.com/maps?q=Via%20Maqueda%20221%20Palermo&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(0.3) contrast(1.1) brightness(0.85)" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mappa TIMILIA - Via Maqueda 221, Palermo"
              />
            </div>

            {/* Info panel */}
            <div className="lg:col-span-1 p-6 lg:p-8 bg-[#0a0a0a] flex flex-col justify-center gap-5">
              <div className="flex items-start gap-3">
                <MapPin size={20} strokeWidth={1.5} className="text-gold/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-foreground/80 text-sm font-light leading-relaxed">
                    Via Maqueda, 221
                  </p>
                  <p className="text-foreground/50 text-sm font-light">
                    90133 Palermo, Sicilia
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-white/5" />

              <div className="flex items-start gap-3">
                <Navigation size={20} strokeWidth={1.5} className="text-gold/60 mt-0.5 shrink-0" />
                <div>
                  <p className="text-foreground/50 text-xs font-light leading-relaxed mb-1">
                    A due passi dai Quattro Canti, nel cuore del centro storico.
                  </p>
                </div>
              </div>

              <a
                href={mapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold/10 border border-gold/30 text-gold text-xs tracking-[0.2em] uppercase font-medium hover:bg-gold/20 hover:border-gold/50 transition-all duration-400 rounded-full mt-2"
              >
                <Navigation size={14} strokeWidth={1.5} />
                Indicazioni stradali
                <ExternalLink size={12} strokeWidth={1.5} className="opacity-50" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
