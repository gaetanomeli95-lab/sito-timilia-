"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, X, Loader2, CheckCircle, UserPlus, MessageSquare } from "lucide-react";
import CustomerAuthModal from "./CustomerAuthModal";
import { supabase } from "@/lib/supabase-client";

interface ReviewFormProps {
  open: boolean;
  onClose: () => void;
}

export default function ReviewForm({ open, onClose }: ReviewFormProps) {
  const [customer, setCustomer] = useState<{ id: string; name: string; email: string } | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) return;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const res = await fetch("/api/customers/profile", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const { profile } = await res.json();
          if (profile) {
            setCustomer({ id: profile.id, name: profile.name, email: profile.email });
          }
        }
      }
    };
    checkSession();
  }, [open]);

  const handleAuthSuccess = (c: { id: string; name: string; email: string }) => {
    setCustomer(c);
    setShowAuth(false);
  };

  const handleOpenAuth = () => {
    setShowAuth(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setLoading(true);
    setError("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError("Accedi prima di inviare la recensione");
        return;
      }

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ rating, text }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante l'invio");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2500);
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setText("");
    setError("");
    setSuccess(false);
    onClose();
  };

  return (
    <>
      <CustomerAuthModal
        open={showAuth}
        onClose={() => setShowAuth(false)}
        onSuccess={handleAuthSuccess}
      />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[95] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-white/10 bg-[#111111] shadow-2xl"
            >
              <div className="relative h-28 bg-gradient-to-br from-gold/20 via-gold/5 to-transparent border-b border-white/5 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full border border-gold/30 bg-gold/10 flex items-center justify-center">
                  <MessageSquare size={28} strokeWidth={1.5} className="text-gold" />
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors"
                  aria-label="Chiudi"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 sm:p-8 md:p-10">
                {success ? (
                  <div className="text-center py-6">
                    <CheckCircle size={52} strokeWidth={1.5} className="text-gold mx-auto mb-5" />
                    <h3 className="text-foreground text-2xl font-light mb-3">Grazie!</h3>
                    <p className="text-foreground/50 text-sm font-light leading-relaxed">
                      La tua recensione è stata inviata e sarà pubblicata dopo approvazione.
                    </p>
                  </div>
                ) : !customer ? (
                  <div className="text-center py-6">
                    <h3 className="text-foreground text-2xl font-light mb-3">Lascia una recensione</h3>
                    <p className="text-foreground/50 text-sm font-light leading-relaxed mb-8">
                      Registrati per condividere la tua esperienza da TIMILIA.
                      Bastano un minuto e una passione per la pizza.
                    </p>
                    <button
                      onClick={handleOpenAuth}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-background text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold-light transition-colors rounded-xl"
                    >
                      <UserPlus size={18} strokeWidth={1.5} />
                      Registrati ora
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-foreground text-2xl font-light mb-2">Lascia una recensione</h3>
                    <p className="text-foreground/50 text-sm font-light mb-8">
                      Ciao <span className="text-gold/80">{customer.name}</span>, raccontaci la tua esperienza.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label className="block text-foreground/60 text-sm tracking-wide mb-3">
                          La tua valutazione
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="transition-transform hover:scale-125"
                            >
                              <Star
                                size={36}
                                strokeWidth={1.5}
                                className={
                                  star <= (hoverRating || rating)
                                    ? "text-gold fill-gold"
                                    : "text-foreground/20"
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-foreground/60 text-sm tracking-wide mb-2">
                          La tua recensione
                        </label>
                        <textarea
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          required
                          rows={5}
                          maxLength={500}
                          className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors resize-none"
                          placeholder="Racconta la tua esperienza da TIMILIA..."
                        />
                        <p className="text-foreground/30 text-xs mt-1.5 text-right">
                          {text.length}/500
                        </p>
                      </div>

                      {error && (
                        <p className="text-red-400/80 text-sm font-light bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading || rating === 0}
                        className="w-full py-3.5 bg-gold text-background text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
                      >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {loading ? "Invio in corso..." : "Invia recensione"}
                      </button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
