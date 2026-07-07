"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, User, Mail, Phone, Lock, CheckCircle, Loader2,
  UserPlus, LogIn, ShieldCheck, RefreshCw,
} from "lucide-react";
import Image from "next/image";

interface CustomerAuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: (customer: { id: string; name: string; email: string }) => void;
}

type Mode = "register" | "login";
type Step = "form" | "otp" | "success";

export default function CustomerAuthModal({ open, onClose, onSuccess }: CustomerAuthModalProps) {
  const [mode, setMode] = useState<Mode>("register");
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [otpCode, setOtpCode] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugOtp, setDebugOtp] = useState("");

  const switchMode = (newMode: Mode) => {
    setMode(newMode);
    setStep("form");
    setError("");
    setPassword("");
    setOtpCode("");
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password, newsletterConsent: newsletter }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la registrazione");
        return;
      }

      setCustomerId(data.customerId);
      if (data.debugOtp) setDebugOtp(data.debugOtp);
      setStep("otp");
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.needsVerification && data.customerId) {
          setCustomerId(data.customerId);
          setStep("otp");
          await handleResendOtp(data.customerId);
          return;
        }
        setError(data.error || "Errore durante il login");
        return;
      }

      onSuccess?.(data.customer);
      setStep("success");
      setTimeout(() => handleClose(), 1500);
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, otpCode }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore durante la verifica");
        return;
      }

      onSuccess?.(data.customer);
      setStep("success");
      setTimeout(() => handleClose(), 1500);
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async (id?: string) => {
    const targetId = id || customerId;
    if (!targetId) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId: targetId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Errore invio codice");
        return;
      }

      if (data.debugOtp) setDebugOtp(data.debugOtp);
      setOtpCode("");
      setError("");
    } catch {
      setError("Errore di connessione.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setNewsletter(true);
    setOtpCode("");
    setCustomerId("");
    setError("");
    setDebugOtp("");
    setStep("form");
    setMode("register");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl border border-gold/15 bg-[#111111] shadow-2xl"
          >
            {/* Header con logo TIMILIA */}
            <div className="relative h-32 bg-gradient-to-br from-gold/15 via-gold/5 to-transparent border-b border-gold/10 flex flex-col items-center justify-center">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-foreground/50 hover:text-foreground hover:bg-white/10 transition-colors"
                aria-label="Chiudi"
              >
                <X size={18} />
              </button>
              <Image
                src="/images/logo-timilia-original.jpg"
                alt="TIMILIA"
                width={44}
                height={44}
                className="rounded-full object-cover mb-1.5"
              />
              <span className="text-gold text-sm tracking-[0.25em] uppercase font-light">
                TIMILIA
              </span>
              <span className="text-foreground/30 text-[9px] tracking-[0.2em] uppercase mt-0.5">
                Pizza di Sicilia
              </span>
            </div>

            <div className="p-5 sm:p-7 md:p-8">
              <AnimatePresence mode="wait">
                {/* SUCCESS STEP */}
                {step === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-6"
                  >
                    <CheckCircle size={52} strokeWidth={1.5} className="text-gold mx-auto mb-5" />
                    <h3 className="text-foreground text-xl font-light mb-2">
                      {mode === "register" ? "Benvenuto in TIMILIA!" : "Bentornato!"}
                    </h3>
                    <p className="text-foreground/50 text-sm font-light">
                      {mode === "register"
                        ? "Registrazione completata. Ora puoi lasciare recensioni."
                        : "Login effettuato con successo."}
                    </p>
                  </motion.div>
                ) : step === "otp" ? (
                  /* OTP STEP */
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center mb-6">
                      <div className="w-14 h-14 rounded-full border border-gold/25 bg-gold/10 flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={26} strokeWidth={1.5} className="text-gold" />
                      </div>
                      <h3 className="text-foreground text-xl font-light mb-2">Verifica il tuo account</h3>
                      <p className="text-foreground/50 text-sm font-light leading-relaxed">
                        Abbiamo inviato un codice a 6 cifre a<br />
                        <span className="text-foreground/70">{email}</span>
                      </p>
                    </div>

                    {debugOtp && (
                      <div className="mb-4 bg-gold/10 border border-gold/20 rounded-lg px-4 py-2.5 text-center">
                        <p className="text-gold/80 text-xs font-light">
                          [DEV MODE] Codice OTP: <span className="font-medium tracking-widest">{debugOtp}</span>
                        </p>
                      </div>
                    )}

                    <form onSubmit={handleVerifyOtp} className="space-y-5">
                      <div>
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          required
                          maxLength={6}
                          autoFocus
                          className="w-full px-4 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-2xl font-light tracking-[0.5em] text-center focus:border-gold/40 focus:outline-none transition-colors"
                          placeholder="000000"
                        />
                      </div>

                      {error && (
                        <p className="text-red-400/80 text-sm font-light bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading || otpCode.length !== 6}
                        className="w-full py-3.5 bg-gold text-background text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
                      >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        Verifica codice
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResendOtp()}
                        disabled={loading}
                        className="w-full text-foreground/40 hover:text-gold/70 text-xs font-light transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw size={13} strokeWidth={1.5} />
                        Invia di nuovo il codice
                      </button>
                    </form>
                  </motion.div>
                ) : (
                  /* FORM STEP — Register or Login */
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Tab switcher */}
                    <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
                      <button
                        onClick={() => switchMode("register")}
                        className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all ${
                          mode === "register"
                            ? "bg-gold/15 text-gold border border-gold/20"
                            : "text-foreground/40 hover:text-foreground/60"
                        }`}
                      >
                        Registrati
                      </button>
                      <button
                        onClick={() => switchMode("login")}
                        className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all ${
                          mode === "login"
                            ? "bg-gold/15 text-gold border border-gold/20"
                            : "text-foreground/40 hover:text-foreground/60"
                        }`}
                      >
                        Accedi
                      </button>
                    </div>

                    <h3 className="text-foreground text-xl font-light mb-1.5">
                      {mode === "register" ? "Crea il tuo account" : "Bentornato"}
                    </h3>
                    <p className="text-foreground/40 text-sm font-light mb-6">
                      {mode === "register"
                        ? "Registrati per lasciare recensioni e ricevere novità."
                        : "Accedi per lasciare recensioni e gestire il tuo profilo."}
                    </p>

                    <form onSubmit={mode === "register" ? handleRegister : handleLogin} className="space-y-4">
                      {mode === "register" && (
                        <div>
                          <label className="block text-foreground/60 text-sm tracking-wide mb-2">
                            Nome e cognome
                          </label>
                          <div className="relative">
                            <User size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                            <input
                              type="text"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              required
                              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors"
                              placeholder="Il tuo nome"
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-foreground/60 text-sm tracking-wide mb-2">
                          Email
                        </label>
                        <div className="relative">
                          <Mail size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors"
                            placeholder="email@esempio.com"
                          />
                        </div>
                      </div>

                      {mode === "register" && (
                        <div>
                          <label className="block text-foreground/60 text-sm tracking-wide mb-2">
                            Telefono <span className="text-foreground/30">(opzionale)</span>
                          </label>
                          <div className="relative">
                            <Phone size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                            <input
                              type="tel"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors"
                              placeholder="+39 ..."
                            />
                          </div>
                        </div>
                      )}

                      <div>
                        <label className="block text-foreground/60 text-sm tracking-wide mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <Lock size={18} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/30" />
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full pl-11 pr-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors"
                            placeholder="Minimo 6 caratteri"
                          />
                        </div>
                      </div>

                      {mode === "register" && (
                        <label className="flex items-start gap-3 cursor-pointer pt-1">
                          <input
                            type="checkbox"
                            checked={newsletter}
                            onChange={(e) => setNewsletter(e.target.checked)}
                            className="mt-0.5 w-4 h-4 accent-[#c8a97e] cursor-pointer shrink-0"
                          />
                          <span className="text-foreground/50 text-sm font-light leading-relaxed">
                            Voglio ricevere la newsletter con novità, eventi e offerte speciali di TIMILIA.
                          </span>
                        </label>
                      )}

                      {error && (
                        <p className="text-red-400/80 text-sm font-light bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                          {error}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-gold text-background text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
                      >
                        {loading && <Loader2 size={18} className="animate-spin" />}
                        {mode === "register" ? (
                          <>
                            <UserPlus size={18} strokeWidth={1.5} />
                            Registrati
                          </>
                        ) : (
                          <>
                            <LogIn size={18} strokeWidth={1.5} />
                            Accedi
                          </>
                        )}
                      </button>
                    </form>

                    {mode === "register" && (
                      <p className="text-foreground/30 text-xs font-light text-center mt-5 leading-relaxed">
                        Riceverai un codice OTP via email per verificare il tuo account.
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer brand */}
            <div className="px-7 py-4 border-t border-white/5 flex items-center justify-center gap-2">
              <span className="text-foreground/20 text-[10px] tracking-[0.2em] uppercase">
                Via Maqueda 221 · Palermo
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
