"use client";

import { useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X, AlertTriangle } from "lucide-react";
import type { MenuItem } from "@/data/menuData";

const allergenMap: Record<string, string> = {
  "1": "Cereali",
  "2": "Crostacei",
  "3": "Uova",
  "4": "Pesce",
  "5": "Frutta a guscio",
  "6": "Soia",
  "7": "Lattosio",
  "8": "Sesamo",
  "9": "Sedano",
  "10": "Senape",
  "11": "Solfiti",
  "12": "Lupini",
};

function parseAllergens(note?: string): string[] {
  if (!note) return [];
  const match = note.match(/Allergeni\s+([\d-]+)/i);
  if (!match) return [];
  return match[1].split("-").map((s) => s.trim());
}

type ProductModalProps = {
  item: MenuItem | null;
  categoryTitle: string;
  onClose: () => void;
};

export default function ProductModal({
  item,
  categoryTitle,
  onClose,
}: ProductModalProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    if (item) {
      document.body.style.overflow = "hidden";
      setCurrentImageIdx(0);

      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleEsc);

      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleEsc);
      };
    }
  }, [item, onClose]);

  if (!item) return null;

  const allergens = parseAllergens(item.note);
  const allImages = item.images ?? (item.image ? [item.image] : []);
  const hasMultipleImages = allImages.length > 1;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8"
          onClick={onClose}
        >
          {/* Backdrop with blur */}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-xl" />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, y: 20, filter: "blur(8px)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 w-full max-w-4xl max-h-[90vh] md:max-h-[80vh] overflow-y-auto md:overflow-hidden bg-[#0a0a0a] border border-white/[0.08] rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 80px rgba(0,0,0,0.6), 0 0 120px rgba(200,169,126,0.04)",
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-background/60 backdrop-blur-md text-foreground/60 hover:text-gold hover:bg-background/80 transition-all duration-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Image Gallery + Content — side by side on desktop */}
            <div className="flex flex-col md:flex-row md:h-[80vh]">
            {/* Image Gallery */}
            {allImages.length > 0 && (
              <div className="relative w-full md:w-[60%] md:h-full overflow-hidden rounded-t-lg md:rounded-tl-lg md:rounded-tr-none bg-[#111] flex flex-col">
                <div className="relative w-full h-80 sm:h-96 md:h-full flex items-center justify-center flex-1">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImageIdx}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={allImages[currentImageIdx]}
                        alt={item.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, 768px"
                      />
                    </motion.div>
                  </AnimatePresence>

                  {hasMultipleImages && (
                    <>
                      <button
                        onClick={() =>
                          setCurrentImageIdx((prev) =>
                            prev === 0 ? allImages.length - 1 : prev - 1
                          )
                        }
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-md text-foreground/60 hover:text-gold hover:bg-background/70 transition-all duration-400 z-10"
                      >
                        <span className="text-sm">‹</span>
                      </button>
                      <button
                        onClick={() =>
                          setCurrentImageIdx((prev) =>
                            prev === allImages.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-background/50 backdrop-blur-md text-foreground/60 hover:text-gold hover:bg-background/70 transition-all duration-400 z-10"
                      >
                        <span className="text-sm">›</span>
                      </button>
                      <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-background/50 backdrop-blur-md text-foreground/50 text-[10px] font-light tracking-wide">
                        {currentImageIdx + 1} / {allImages.length}
                      </div>
                    </>
                  )}
                </div>

                {hasMultipleImages && (
                  <div className="flex gap-2 p-3 bg-[#0a0a0a] overflow-x-auto scrollbar-hide flex-shrink-0">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIdx(idx)}
                        className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden rounded-sm transition-all duration-500 ${
                          idx === currentImageIdx
                            ? "ring-1 ring-gold/60 opacity-100"
                            : "opacity-40 hover:opacity-70"
                        }`}
                      >
                        <Image
                          src={img}
                          alt=""
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 md:w-[40%] p-6 md:p-8 lg:p-10 overflow-y-auto md:overflow-y-auto scrollbar-hide">
              <span className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
                {categoryTitle}
              </span>

              <div className="flex justify-between items-start gap-4 mb-5">
                <h2 className="text-2xl md:text-3xl font-light tracking-[0.03em] text-foreground leading-tight">
                  {item.name}
                </h2>
                {item.price !== undefined && (
                  <span className="text-gold text-xl md:text-2xl font-light whitespace-nowrap shrink-0">
                    € {item.price.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="w-12 h-[1px] bg-gold/30 mb-6" />

              {item.description && (
                <p className="text-foreground/60 text-sm md:text-base font-light leading-relaxed mb-8">
                  {item.description}
                </p>
              )}

              {allergens.length > 0 && (
                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-gold/60" />
                    <span className="text-foreground/50 text-xs tracking-[0.2em] uppercase font-medium">
                      Allergeni
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {allergens.map((code) => {
                      const label = allergenMap[code];
                      if (!label) return null;
                      return (
                        <div
                          key={code}
                          className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] border border-white/5 rounded-sm"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
                          <span className="text-foreground/50 text-xs font-light">
                            {label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {item.note && !item.note.match(/^Allergeni/i) && (
                <p className="text-foreground/30 text-xs mt-6 font-light">
                  {item.note}
                </p>
              )}
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
