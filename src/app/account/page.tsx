"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Star, ShoppingBag, LogOut,
  Loader2, CheckCircle, Package, MessageSquare, Camera, Shield, ArrowLeft, Trash2, AlertTriangle, X,
  Crown, Award, Sparkles, TrendingUp, Calendar, Heart,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  newsletter_consent: boolean;
  is_admin: boolean;
  avatar_url: string | null;
}

interface Order {
  id: string;
  total: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  created_at: string;
  items: { productName: string; quantity: number; price: number }[];
}

interface Review {
  id: string;
  rating: number;
  text: string;
  approved: boolean;
  created_at: string;
}

const TIERS = [
  { name: "Ospite", min: 0, icon: User, color: "from-slate-500/20 to-slate-600/10" },
  { name: "Amico", min: 10, icon: Heart, color: "from-blue-500/20 to-cyan-500/10" },
  { name: "TIMILIA Lover", min: 30, icon: Crown, color: "from-gold/20 to-amber-500/10" },
  { name: "Ambasciatore", min: 60, icon: Award, color: "from-amber-400/30 to-yellow-500/20" },
];

function getTier(points: number) {
  let current = TIERS[0];
  let next = TIERS[1];
  for (let i = 0; i < TIERS.length; i++) {
    if (points >= TIERS[i].min) {
      current = TIERS[i];
      next = TIERS[i + 1] || null;
    }
  }
  const progress = next ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100) : 100;
  return { current, next, progress };
}

export default function AccountPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"profile" | "orders" | "reviews">("profile");
  const [reviewForm, setReviewForm] = useState({ rating: 5, text: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/");
        return;
      }
      setUser(session.user);
      setAuthToken(session.access_token);

      const res = await fetch("/api/customers/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const profileData = res.ok ? (await res.json()).profile : null;

      setProfile(profileData as CustomerProfile | null);

      if (profileData) {
        const ordersRes = await fetch("/api/customers/orders", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const ordersData = ordersRes.ok ? (await ordersRes.json()).orders : [];
        setOrders(ordersData as Order[] || []);

        const reviewsRes = await fetch("/api/customers/reviews", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const reviewsData = reviewsRes.ok ? (await reviewsRes.json()).reviews : [];
        setReviews(reviewsData as Review[] || []);
      }

      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const [avatarError, setAvatarError] = useState<string | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !user) return;

    setAvatarError(null);

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("L'immagine non può superare i 2MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setAvatarError("Seleziona un file immagine valido");
      return;
    }

    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `${user.id}.${ext}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const avatarUrl = `${publicUrl}?t=${Date.now()}`;

      await fetch("/api/customers/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ avatar_url: avatarUrl }),
      });

      setProfile({ ...profile, avatar_url: avatarUrl });
    } catch {
      // error
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeletingAccount(true);
    try {
      await fetch("/api/customers/profile", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      await supabase.auth.signOut();
      router.push("/");
    } catch {
      setDeletingAccount(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!profile) return;
    try {
      await fetch(`/api/customers/reviews?id=${reviewId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const reviewsRes = await fetch("/api/customers/reviews", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const newReviews = reviewsRes.ok ? (await reviewsRes.json()).reviews : [];
      setReviews(newReviews as Review[] || []);
    } catch {
      // error
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !reviewForm.text.trim()) return;
    setSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          text: reviewForm.text,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, text: "" });
        setTimeout(() => setReviewSuccess(false), 3000);

        const reviewsRes2 = await fetch("/api/customers/reviews", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const newReviews = reviewsRes2.ok ? (await reviewsRes2.json()).reviews : [];
        setReviews(newReviews as Review[] || []);
      }
    } catch {
      // error
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 blur-3xl bg-gold/10 rounded-full" />
          <Loader2 size={32} className="animate-spin text-gold relative" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  const loyaltyPoints = orders.length * 10 + reviews.length * 5 + (profile?.newsletter_consent ? 5 : 0);
  const { current: currentTier, next: nextTier, progress: tierProgress } = getTier(loyaltyPoints);
  const TierIcon = currentTier.icon;

  const achievements = [
    { icon: ShoppingBag, label: "Primo ordine", unlocked: orders.length > 0 },
    { icon: Star, label: "Prima recensione", unlocked: reviews.length > 0 },
    { icon: Mail, label: "Newsletter", unlocked: profile?.newsletter_consent || false },
    { icon: Crown, label: "TIMILIA Lover", unlocked: loyaltyPoints >= 30 },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <Navbar />

      {/* Dynamic background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gold/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-700/[0.03] rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto relative">
        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8"
        >
          {/* Glow behind avatar */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-gold/[0.06] rounded-full blur-[80px] pointer-events-none" />

          <div className="relative flex flex-col items-center text-center">
            {/* Avatar with animated ring */}
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full"
                style={{
                  background: "conic-gradient(from 0deg, transparent, rgba(212,175,55,0.3), transparent, rgba(212,175,55,0.15), transparent)",
                }}
              />
              <div className="relative w-28 h-28 rounded-full border-2 border-gold/30 bg-gradient-to-br from-gold/10 to-transparent overflow-hidden flex items-center justify-center">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" width={112} height={112} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gold text-3xl font-light">
                    {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <label className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center cursor-pointer hover:bg-gold/30 transition-colors z-10">
                {uploadingAvatar ? (
                  <Loader2 size={15} className="animate-spin text-gold" />
                ) : (
                  <Camera size={15} strokeWidth={1.5} className="text-gold" />
                )}
                <input type="file" accept="image/*,.png,.jpg,.jpeg,.webp" onChange={handleAvatarUpload} className="hidden" />
              </label>
            </div>
            {avatarError && (
              <p className="text-red-400/70 text-xs mt-2">{avatarError}</p>
            )}

            {/* Name + tier */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-2"
            >
              <h1 className="text-foreground text-2xl md:text-4xl font-light tracking-wide">
                {profile?.name || "Utente"}
              </h1>
            </motion.div>

            {/* Tier badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r ${currentTier.color} border border-gold/20 mb-3`}
            >
              <TierIcon size={14} strokeWidth={1.5} className="text-gold" />
              <span className="text-gold/90 text-xs tracking-[0.15em] uppercase font-medium">{currentTier.name}</span>
            </motion.div>

            <p className="text-foreground/40 text-sm font-light mb-6">{user.email}</p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-foreground/50 hover:text-gold hover:border-gold/30 text-xs tracking-wide uppercase transition-all"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
                Home
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-foreground/50 hover:text-red-400 hover:border-red-500/30 text-xs tracking-wide uppercase transition-all"
              >
                <LogOut size={14} strokeWidth={1.5} />
                Esci
              </button>
              {profile?.is_admin && (
                <button
                  onClick={() => router.push("/admin")}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold/80 hover:text-gold hover:bg-gold/20 text-xs tracking-wide uppercase transition-all"
                >
                  <Shield size={14} strokeWidth={1.5} />
                  Admin
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* LOYALTY PROGRESS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="rounded-2xl border border-gold/15 bg-gradient-to-br from-white/[0.04] to-transparent p-6 mb-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-gold/[0.04] rounded-full blur-3xl" />
          <div className="relative flex items-center justify-between mb-4">
            <div>
              <p className="text-foreground/40 text-xs uppercase tracking-[0.15em] mb-1">Status Fedeltà</p>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-gold" />
                <span className="text-foreground text-lg font-light">{loyaltyPoints} punti</span>
              </div>
            </div>
            {nextTier && (
              <div className="text-right">
                <p className="text-foreground/30 text-xs uppercase tracking-wide mb-1">Prossimo</p>
                <p className="text-gold/70 text-sm font-light">{nextTier.name}</p>
              </div>
            )}
          </div>
          {/* Progress bar */}
          <div className="relative h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${tierProgress}%` }}
              transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-gold/40 via-gold to-amber-400"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </motion.div>
          </div>
          {nextTier && (
            <p className="text-foreground/30 text-xs font-light mt-3">
              Mancano <span className="text-gold/60">{nextTier.min - loyaltyPoints}</span> punti per diventare <span className="text-gold/60">{nextTier.name}</span>
            </p>
          )}
        </motion.div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
          {[
            { icon: Package, label: "Ordini", value: orders.length, color: "text-gold" },
            { icon: Star, label: "Recensioni", value: reviews.length, color: "text-amber-400" },
            { icon: TrendingUp, label: "Punti", value: loyaltyPoints, color: "text-gold" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="group relative rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5 text-center overflow-hidden transition-all hover:border-gold/20"
            >
              <div className="absolute inset-0 bg-gold/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
              <stat.icon size={22} strokeWidth={1.5} className={`${stat.color} mx-auto mb-2 relative`} />
              <p className="text-foreground text-xl sm:text-2xl font-light relative">{stat.value}</p>
              <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-wide relative">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ACHIEVEMENT BADGES */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-3 mb-8"
        >
          {achievements.map((ach) => (
            <div
              key={ach.label}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                ach.unlocked
                  ? "border-gold/25 bg-gold/[0.06] text-gold/80"
                  : "border-white/5 bg-white/[0.02] text-foreground/20"
              }`}
            >
              <ach.icon size={12} strokeWidth={1.5} className={ach.unlocked ? "text-gold" : "text-foreground/20"} />
              <span className="tracking-wide">{ach.label}</span>
            </div>
          ))}
        </motion.div>

        {/* TABS */}
        <div className="flex gap-1 mb-8 p-1 bg-white/[0.03] border border-white/5 rounded-2xl max-w-md mx-auto">
          {[
            { id: "profile" as const, icon: User, label: "Profilo" },
            { id: "orders" as const, icon: Package, label: "Ordini" },
            { id: "reviews" as const, icon: MessageSquare, label: "Recensioni" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex-1 py-3 rounded-xl text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? "bg-gold/15 text-gold border border-gold/20"
                  : "text-foreground/40 hover:text-foreground/60"
              }`}
            >
              <tab.icon size={14} strokeWidth={1.5} />
              {tab.label}
              {tab.id === "reviews" && reviews.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold/30 text-gold text-[9px] flex items-center justify-center">
                  {reviews.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* PROFILE TAB */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gold/15 bg-gradient-to-br from-white/[0.04] to-transparent p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.03] rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <User size={18} strokeWidth={1.5} className="text-gold/70" />
                  </div>
                  <h2 className="text-foreground text-sm tracking-[0.15em] uppercase font-medium">Dati personali</h2>
                </div>
                <div className="relative space-y-1">
                  {[
                    { icon: User, label: "Nome", value: profile?.name || "—" },
                    { icon: Mail, label: "Email", value: user.email },
                    { icon: Phone, label: "Telefono", value: profile?.phone || "—" },
                    { icon: Mail, label: "Newsletter", value: profile?.newsletter_consent ? "Iscritto" : "Non iscritto" },
                  ].map((field) => (
                    <div key={field.label} className="flex items-center gap-3 py-3 border-b border-white/5 group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors">
                      <field.icon size={16} strokeWidth={1.5} className="text-foreground/30 group-hover:text-gold/50 transition-colors" />
                      <div className="flex-1">
                        <p className="text-foreground/40 text-xs uppercase tracking-wide">{field.label}</p>
                        <p className="text-foreground/80 text-sm font-light">{field.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete account */}
              <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertTriangle size={18} strokeWidth={1.5} className="text-red-400/60" />
                  <h2 className="text-foreground text-sm tracking-[0.15em] uppercase font-medium">Zona pericolosa</h2>
                </div>
                <p className="text-foreground/40 text-sm font-light mb-4">
                  L'eliminazione dell'account è permanente. Tutti i tuoi dati, ordini e recensioni verranno rimossi.
                </p>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-red-500/20 text-red-400/80 text-xs tracking-wide uppercase font-medium hover:bg-red-500/10 hover:border-red-500/40 transition-colors rounded-lg"
                >
                  <Trash2 size={14} strokeWidth={1.5} />
                  Elimina account
                </button>
              </div>
            </div>
          )}

          {/* DELETE CONFIRMATION MODAL */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => !deletingAccount && setShowDeleteConfirm(false)}>
              <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-[#111111] shadow-2xl p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
                    <AlertTriangle size={26} strokeWidth={1.5} className="text-red-400" />
                  </div>
                  <h3 className="text-foreground text-xl font-light mb-3">Elimina account?</h3>
                  <p className="text-foreground/50 text-sm font-light leading-relaxed mb-8">
                    Questa azione è irreversibile. Il tuo profilo, i tuoi ordini e le tue recensioni verranno eliminati definitivamente.
                  </p>
                  <div className="flex gap-3 w-full">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={deletingAccount}
                      className="flex-1 py-3 border border-white/10 text-foreground/60 text-xs tracking-wide uppercase font-medium hover:bg-white/5 transition-colors rounded-xl disabled:opacity-50"
                    >
                      Annulla
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      disabled={deletingAccount}
                      className="flex-1 py-3 bg-red-500/80 text-white text-xs tracking-wide uppercase font-medium hover:bg-red-500 transition-colors rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {deletingAccount ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Eliminazione...
                        </>
                      ) : (
                        <>
                          <Trash2 size={14} strokeWidth={1.5} />
                          Elimina
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-gold/10 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-gold/[0.03] rounded-full blur-3xl" />
                  <ShoppingBag size={40} strokeWidth={1} className="text-foreground/20 mx-auto mb-4 relative" />
                  <p className="text-foreground/40 text-sm font-light relative">Nessun ordine ancora effettuato</p>
                  <a
                    href="/tera#shop"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 transition-colors relative"
                  >
                    <ShoppingBag size={15} strokeWidth={1.5} />
                    Vai allo shop
                  </a>
                </div>
              ) : (
                orders.map((order, i) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group rounded-2xl border border-gold/15 bg-gradient-to-br from-white/[0.04] to-transparent p-6 hover:border-gold/25 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gold/[0.03] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                          <Package size={16} strokeWidth={1.5} className="text-gold/70" />
                        </div>
                        <div>
                          <p className="text-foreground/40 text-xs uppercase tracking-wide">Ordine</p>
                          <p className="text-foreground/80 text-sm font-light font-mono">#{order.id.slice(0, 8)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end mb-0.5">
                          <Calendar size={12} strokeWidth={1.5} className="text-foreground/30" />
                          <p className="text-foreground/60 text-xs">{new Date(order.created_at).toLocaleDateString("it-IT")}</p>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-full border ${
                          order.status === "delivered"
                            ? "bg-green-500/10 text-green-400/70 border-green-500/20"
                            : order.status === "shipped"
                              ? "bg-blue-500/10 text-blue-400/70 border-blue-500/20"
                              : order.payment_status === "paid"
                                ? "bg-emerald-500/10 text-emerald-400/70 border-emerald-500/20"
                                : "bg-gold/10 text-gold/70 border-gold/20"
                        }`}>
                          {{ pending: "Pagamento in attesa", paid: "Pagato", preparing: "In preparazione", shipped: "Spedito", delivered: "Consegnato" }[order.status] || order.status}
                        </span>
                      </div>
                    </div>
                    <div className="relative space-y-2 mb-4">
                      {order.items.map((item, j) => (
                        <div key={j} className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60 font-light">{item.quantity}x {item.productName}</span>
                          <span className="text-foreground/40 font-light">€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="relative flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-foreground/40 text-xs uppercase tracking-wide">Totale</span>
                      <span className="text-foreground text-base font-medium">€{Number(order.total).toFixed(2)}</span>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review form */}
              <div className="rounded-2xl border border-gold/15 bg-gradient-to-br from-white/[0.04] to-transparent p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.03] rounded-full blur-2xl" />
                <div className="relative flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center">
                    <Star size={18} strokeWidth={1.5} className="text-gold/70" />
                  </div>
                  <h2 className="text-foreground text-sm tracking-[0.15em] uppercase font-medium">Lascia una recensione</h2>
                </div>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                    <label className="block text-foreground/60 text-sm tracking-wide mb-2">Valutazione</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: n })}
                          className="transition-transform hover:scale-110"
                        >
                          <Star
                            size={24}
                            strokeWidth={1.5}
                            className={n <= reviewForm.rating ? "text-gold fill-gold" : "text-foreground/20"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-foreground/60 text-sm tracking-wide mb-2">La tua recensione</label>
                    <textarea
                      value={reviewForm.text}
                      onChange={(e) => setReviewForm({ ...reviewForm, text: e.target.value })}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-white/[0.04] border border-white/10 rounded-xl text-foreground text-sm font-light focus:border-gold/40 focus:outline-none transition-colors resize-none"
                      placeholder="Racconta la tua esperienza da TIMILIA..."
                    />
                  </div>
                  {reviewSuccess && (
                    <div className="flex items-center gap-2 text-gold/80 text-sm font-light bg-gold/10 border border-gold/20 rounded-lg px-4 py-2.5">
                      <CheckCircle size={16} strokeWidth={1.5} />
                      Recensione inviata! Sarà visibile dopo approvazione.
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={submittingReview || !reviewForm.text.trim()}
                    className="px-6 py-3 bg-gold text-background text-sm tracking-[0.15em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-xl"
                  >
                    {submittingReview && <Loader2 size={16} className="animate-spin" />}
                    Invia recensione
                  </button>
                </form>
              </div>

              {/* Existing reviews */}
              <div>
                <h3 className="text-foreground/60 text-sm tracking-[0.15em] uppercase font-medium mb-4">Le tue recensioni</h3>
                {reviews.length === 0 ? (
                  <div className="text-center py-12 rounded-2xl border border-gold/10 bg-gradient-to-br from-white/[0.03] to-transparent relative overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/[0.03] rounded-full blur-3xl" />
                    <MessageSquare size={32} strokeWidth={1} className="text-foreground/20 mx-auto mb-3 relative" />
                    <p className="text-foreground/40 text-sm font-light relative">Nessuna recensione ancora</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review, i) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="group rounded-xl border border-gold/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5 hover:border-gold/20 transition-all relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gold/[0.02] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex gap-0.5">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} size={14} strokeWidth={1.5} className="text-gold fill-gold" />
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wide ${
                              review.approved
                                ? "bg-green-500/10 text-green-400/70 border border-green-500/20"
                                : "bg-gold/10 text-gold/60 border border-gold/20"
                            }`}>
                              {review.approved ? "Pubblicata" : "In attesa"}
                            </span>
                            <button
                              onClick={() => handleDeleteReview(review.id)}
                              className="w-7 h-7 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400/60 hover:text-red-400 hover:bg-red-500/20 transition-colors"
                              aria-label="Elimina recensione"
                            >
                              <X size={12} strokeWidth={2} />
                            </button>
                          </div>
                        </div>
                        <p className="text-foreground/70 text-sm font-light leading-relaxed relative">{review.text}</p>
                        <p className="text-foreground/30 text-xs mt-3 relative">
                          {new Date(review.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
