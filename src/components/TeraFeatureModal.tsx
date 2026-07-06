"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Image from "next/image";

export type TeraFeatureContent = {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  body: string;
  image?: string;
  emoji?: string;
  items?: { name: string; desc: string }[];
};

type TeraFeatureModalProps = {
  content: TeraFeatureContent | null;
  onClose: () => void;
};

export default function TeraFeatureModal({ content, onClose }: TeraFeatureModalProps) {
  useEffect(() => {
    if (!content) return;
    document.body.style.overflow = "hidden";

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [content, onClose]);

  return (
    <AnimatePresence>
      {content && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[1.8rem] border border-white/12 bg-[linear-gradient(160deg,#1a1f1c_0%,#121613_60%,#0c0f0d_100%)] p-6 sm:p-8 shadow-[0_40px_120px_rgba(0,0,0,0.5)]"
          >
            <button
              onClick={onClose}
              aria-label="Chiudi"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-6 pr-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/12 bg-white/[0.06]">
                <content.icon className="w-5 h-5 text-[#a8b8a4] stroke-[1.2]" />
              </div>
              <div>
                <h3 className="text-white text-lg sm:text-xl font-light tracking-[0.06em] uppercase">
                  {content.title}
                </h3>
                <p className="text-[#a8b8a4]/60 text-xs sm:text-sm font-light mt-0.5">
                  {content.desc}
                </p>
              </div>
            </div>

            <p className="text-white/72 text-sm sm:text-base font-light leading-relaxed mb-6">
              {content.body}
            </p>

            {content.image && (
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/30">
                <Image
                  src={content.image}
                  alt={content.title}
                  width={500}
                  height={400}
                  className="w-full h-auto object-cover"
                  sizes="(max-width: 480px) 100vw, 480px"
                />
              </div>
            )}

            {content.items && content.items.length > 0 && (
              <div className="space-y-3">
                <span className="text-[#a8b8a4] text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
                  Le farine TERA
                </span>
                {content.items.map((item) => (
                  <div
                    key={item.name}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors duration-300 hover:border-[#748470]/30 hover:bg-white/[0.04]"
                  >
                    <h4 className="text-white text-sm font-medium tracking-wide mb-1">
                      {item.name}
                    </h4>
                    <p className="text-white/50 text-sm font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-5 border-t border-white/[0.06]">
              <p className="text-[#a8b8a4]/40 text-[10px] tracking-[0.2em] uppercase font-light text-center">
                TERA — Progetto Gluten Free TIMILIA
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
