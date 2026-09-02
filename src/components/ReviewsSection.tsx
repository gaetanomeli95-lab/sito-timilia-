"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ArrowRight } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface SiteReview {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    setReviewsLoading(true);
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setSiteReviews(data.reviews || []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [reviewFormOpen]);

  return (
    <section
      id="recensioni"
      ref={ref}
      className="relative overflow-hidden py-24 md:py-32"
      style={{
        background:
          "linear-gradient(to bottom, #0a0908 0%, #2a2218 8%, #332a1e 50%, #2a2218 92%, #0a0908 100%)",
      }}
    >
      {/* Ambient glows */}
      <div
        className="absolute top-1/4 left-1/4 w-[500px] h-[400px] rounded-full opacity-[0.15] blur-[130px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #c9a962 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[350px] rounded-full opacity-[0.12] blur-[110px] pointer-events-none"
        style={{ background: "radial-gradient(circle, #d4a574 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA — Lascia una recensione */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="text-center"
        >
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gold/[0.06] blur-2xl rounded-full" />
            <div className="relative">
              <p className="text-foreground/45 text-sm font-light tracking-wide mb-5">
                Hai mangiato da TIMILIA? La tua opinione è preziosa.
              </p>
              <button
                onClick={() => setReviewFormOpen(true)}
                className="group inline-flex items-center gap-3 px-10 py-4 border border-gold/30 text-gold text-xs tracking-[0.25em] uppercase font-medium hover:bg-gold/10 hover:border-gold/50 transition-all duration-500 cursor-pointer rounded-full"
              >
                Lascia una recensione
                <ArrowRight
                  size={14}
                  strokeWidth={1.5}
                  className="transition-transform duration-500 group-hover:translate-x-1"
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recensioni dal sito — visibili in basso */}
        {reviewsLoading && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-gold/80 text-xs tracking-[0.3em] uppercase font-medium">
                Recensioni dei clienti
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-6 space-y-3 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5" />
                      <div className="h-3 w-24 bg-white/5 rounded" />
                    </div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <div key={j} className="w-3 h-3 bg-white/5 rounded" />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-white/[0.04] rounded" />
                    <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!reviewsLoading && siteReviews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
            className="mt-20"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-12 bg-gold/40" />
              <span className="text-gold/80 text-xs tracking-[0.3em] uppercase font-medium">
                Recensioni dei clienti
              </span>
              <div className="flex-1 h-px bg-white/[0.06]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {siteReviews.map((review, idx) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 1.4 + idx * 0.1, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-2xl border border-gold/15 p-7 bg-[linear-gradient(160deg,rgba(200,169,126,0.05),rgba(255,255,255,0.02)_40%,rgba(0,0,0,0.12))] backdrop-blur-md transition-all duration-500 hover:border-gold/30 hover:shadow-[0_16px_50px_rgba(0,0,0,0.3)]"
                >
                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gold/[0.05] blur-2xl transition-transform duration-700 group-hover:scale-150" />

                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold/12 border border-gold/20 flex items-center justify-center text-gold text-sm font-medium">
                          {(review.customerName || "U").charAt(0).toUpperCase()}
                        </div>
                        <span className="text-foreground/80 text-sm font-medium tracking-wide">
                          {review.customerName}
                        </span>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} size={13} strokeWidth={1.5} className="text-gold fill-gold" />
                        ))}
                      </div>
                    </div>
                    <p className="text-foreground/55 text-sm font-light leading-[1.7] italic">
                      {review.text}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      <ReviewForm open={reviewFormOpen} onClose={() => setReviewFormOpen(false)} />
    </section>
  );
}
