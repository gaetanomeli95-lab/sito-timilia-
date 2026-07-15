"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Star, ExternalLink, Quote, ArrowRight } from "lucide-react";
import ReviewForm from "./ReviewForm";

interface SiteReview {
  id: string;
  customerName: string;
  rating: number;
  text: string;
  createdAt: string;
}

const platforms = [
  {
    name: "Google",
    rating: 4.8,
    reviews: "3.200+",
    href: "https://www.google.com/search?q=Timilia+Palermo+recensioni",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    ),
    color: "text-[#4285F4]",
    glow: "rgba(66,133,244,0.12)",
  },
  {
    name: "TripAdvisor",
    rating: 4.5,
    reviews: "1.800+",
    href: "https://www.tripadvisor.it/Restaurant_Review-g187890-d12666141-Reviews-Timilia-Palermo_Province_of_Palermo_Sicily.html",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 7.5c-2.3 0-4.5.5-6.3 1.5H2l1.4 1.6c-.4.6-.6 1.3-.6 2.1 0 2.1 1.7 3.8 3.8 3.8 2.1 0 3.8-1.7 3.8-3.8 0-.8-.2-1.5-.6-2.1L12 9.7l2.2 1c-.4.6-.6 1.3-.6 2.1 0 2.1 1.7 3.8 3.8 3.8 2.1 0 3.8-1.7 3.8-3.8 0-.8-.2-1.5-.6-2.1L22 9h-3.7c-1.8-1-4-1.5-6.3-1.5zM6.6 12.2c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8zm10.8 0c1 0 1.8.8 1.8 1.8s-.8 1.8-1.8 1.8-1.8-.8-1.8-1.8.8-1.8 1.8-1.8z" />
      </svg>
    ),
    color: "text-[#00af87]",
    glow: "rgba(0,175,135,0.12)",
  },
  {
    name: "Restaurant Guru",
    rating: 4.6,
    reviews: "1.100+",
    href: "https://restaurantguru.it/Timilia-Palermo",
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3.5 6c.83 0 1.5.67 1.5 1.5S9.33 11 8.5 11 7 10.33 7 9.5 7.67 8 8.5 8zm7 0c.83 0 1.5.67 1.5 1.5S16.33 11 15.5 11 14 10.33 14 9.5 14.67 8 15.5 8zM12 17.5c-2.33 0-4.31-1.46-5.11-3.5h10.22c-.8 2.04-2.78 3.5-5.11 3.5z" />
      </svg>
    ),
    color: "text-[#f5a623]",
    glow: "rgba(245,166,35,0.12)",
  },
];

const featuredReviews = [
  {
    text: "La pizza senza glutine più buona che abbia mai mangiato. Non sembra nemmeno senza glutine! Impasto leggero e digeribile, ingredienti di altissima qualità.",
    author: "Maria G.",
    source: "Google",
    rating: 5,
  },
  {
    text: "Esperienza unica a Palermo. Il progetto TERA è rivoluzionario. Giuseppe D'Angelo è un maestro della pizza. Posti limitati ma atmosfera intima e curata.",
    author: "Antonio R.",
    source: "TripAdvisor",
    rating: 5,
  },
  {
    text: "Consigliato a chiunque, celiaci e non. La differenza non si nota. Provata la MURTATELLA e la A BUFALINA, eccezionali. Tornerò sicuramente.",
    author: "Sofia L.",
    source: "Restaurant Guru",
    rating: 5,
  },
];

export default function ReviewsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [siteReviews, setSiteReviews] = useState<SiteReview[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => setSiteReviews(data.reviews || []))
      .catch(() => {});
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-center mb-20"
        >
          <span className="text-gold text-xs tracking-[0.3em] uppercase font-medium">
            Dicono di noi
          </span>
          <h2 className="mt-4 text-4xl md:text-6xl font-light tracking-[0.03em] text-foreground">
            Le Recensioni
          </h2>
          <div className="mt-8 flex flex-col items-center gap-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  strokeWidth={1.5}
                  className="text-gold fill-gold"
                />
              ))}
            </div>
            <span className="text-foreground/50 text-sm font-light tracking-wide">
              <span className="text-gold/90 text-base">4.8</span> su 5 · oltre 6.000 recensioni totali
            </span>
          </div>
        </motion.div>

        {/* Platform cards — premium style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {platforms.map((platform, idx) => (
            <motion.a
              key={platform.name}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + idx * 0.15, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 p-8 transition-all duration-500 hover:border-gold/35 bg-[linear-gradient(160deg,rgba(200,169,126,0.05),rgba(255,255,255,0.02)_40%,rgba(0,0,0,0.12))] backdrop-blur-md hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
            >
              {/* Glow blur on hover */}
              <div
                className="absolute -right-12 -top-12 h-32 w-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-[2]"
                style={{ background: platform.glow }}
              />
              {/* Sweep line on hover */}
              <div className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold/50 via-gold/20 to-transparent transition-transform duration-700 group-hover:scale-x-100" />

              <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className={platform.color}>{platform.icon}</span>
                    <span className="text-foreground text-sm font-medium tracking-[0.1em] uppercase">
                      {platform.name}
                    </span>
                  </div>
                  <ExternalLink
                    size={16}
                    strokeWidth={1.5}
                    className="text-foreground/25 group-hover:text-gold/60 transition-colors"
                  />
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-4xl font-light text-foreground">
                    {platform.rating.toFixed(1)}
                  </span>
                  <span className="text-foreground/30 text-sm font-light">/ 5</span>
                </div>

                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      strokeWidth={1.5}
                      className={
                        i < Math.floor(platform.rating)
                          ? "text-gold fill-gold"
                          : "text-foreground/15"
                      }
                    />
                  ))}
                </div>

                <div className="mt-auto pt-4 border-t border-gold/10">
                  <p className="text-foreground/40 text-xs font-light tracking-wide">
                    {platform.reviews} recensioni
                  </p>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Featured reviews — premium card style */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {featuredReviews.map((review, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + idx * 0.15, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-2xl border border-gold/15 p-8 bg-[linear-gradient(160deg,rgba(200,169,126,0.06),rgba(255,255,255,0.02)_40%,rgba(0,0,0,0.15))] backdrop-blur-md transition-all duration-500 hover:border-gold/35 hover:shadow-[0_20px_60px_rgba(200,169,126,0.08)]"
            >
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/[0.08] blur-3xl transition-transform duration-700 group-hover:scale-[2]" />
              <div className="absolute left-0 top-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-gold/50 via-gold/20 to-transparent transition-transform duration-700 group-hover:scale-x-100" />

              <div className="relative flex flex-col h-full min-h-[280px]">
                <div className="flex items-start justify-between mb-5">
                  <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Quote size={20} strokeWidth={1.2} className="text-gold/50" />
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} size={13} strokeWidth={1.5} className="text-gold fill-gold" />
                    ))}
                  </div>
                </div>

                <p className="text-foreground/75 text-sm font-light leading-[1.8] mb-6 flex-1">
                  "{review.text}"
                </p>

                <div className="flex items-center gap-3 pt-5 border-t border-gold/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/15 flex items-center justify-center text-gold text-xs font-medium">
                    {review.author.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground/90 text-sm font-medium tracking-wide">
                      {review.author}
                    </span>
                    <span className="text-gold/50 text-[10px] font-light tracking-[0.15em] uppercase">
                      via {review.source}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA — Lascia una recensione */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
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
        {siteReviews.length > 0 && (
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
