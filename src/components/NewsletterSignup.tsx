"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Errore di connessione");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-2 text-gold/80 text-xs font-light">
        <CheckCircle size={14} strokeWidth={1.5} />
        <span>Iscrizione completata!</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <Mail size={14} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full pl-9 pr-3 py-2 bg-white/[0.03] border border-white/10 rounded-lg text-foreground text-xs font-light focus:border-gold/30 focus:outline-none transition-colors"
          placeholder="Email per la newsletter"
        />
      </div>
      {error && <p className="text-red-400/70 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 border border-gold/20 text-gold/80 text-xs tracking-wide hover:bg-gold/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={14} className="animate-spin" />}
        {loading ? "Iscrizione..." : "Iscriviti"}
      </button>
    </form>
  );
}
