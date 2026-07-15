"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, Phone, Star, ShoppingBag, LogOut,
  Loader2, CheckCircle, Package, MessageSquare, Camera, Shield, ArrowLeft, Trash2, AlertTriangle, X,
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
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push("/");
        return;
      }
      setUser(session.user);

      const res = await fetch(`/api/customers/profile?authId=${session.user.id}`);
      const profileData = res.ok ? (await res.json()).profile : null;

      setProfile(profileData as CustomerProfile | null);

      if (profileData) {
        const ordersRes = await fetch(`/api/customers/orders?customerId=${profileData.id}`);
        const ordersData = ordersRes.ok ? (await ordersRes.json()).orders : [];
        setOrders(ordersData as Order[] || []);

        const reviewsRes = await fetch(`/api/customers/reviews?customerId=${profileData.id}`);
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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile || !user) return;

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authId: user.id, avatar_url: avatarUrl }),
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
      await fetch(`/api/customers/profile?authId=${user.id}`, { method: "DELETE" });
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
      await fetch(`/api/customers/reviews?id=${reviewId}`, { method: "DELETE" });
      const reviewsRes = await fetch(`/api/customers/reviews?customerId=${profile.id}`);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerEmail: profile.email,
          rating: reviewForm.rating,
          text: reviewForm.text,
        }),
      });

      if (res.ok) {
        setReviewSuccess(true);
        setReviewForm({ rating: 5, text: "" });
        setTimeout(() => setReviewSuccess(false), 3000);

        const reviewsRes2 = await fetch(`/api/customers/reviews?customerId=${profile.id}`);
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
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center mb-10"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border border-gold/30 bg-gold/10 overflow-hidden flex items-center justify-center">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Avatar" width={96} height={96} className="w-full h-full object-cover" />
              ) : (
                <span className="text-gold text-2xl font-light">
                  {(profile?.name || user.email || "U").charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center cursor-pointer hover:bg-gold/30 transition-colors">
              {uploadingAvatar ? (
                <Loader2 size={14} className="animate-spin text-gold" />
              ) : (
                <Camera size={14} strokeWidth={1.5} className="text-gold" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </label>
          </div>
          <h1 className="text-foreground text-2xl md:text-3xl font-light tracking-wide mb-1">
            {profile?.name || "Utente"}
          </h1>
          <p className="text-foreground/40 text-sm font-light">{user.email}</p>
          <div className="flex items-center gap-4 mt-4">
            <a
              href="/"
              className="flex items-center gap-2 text-foreground/40 hover:text-gold text-xs tracking-wide uppercase transition-colors"
            >
              <ArrowLeft size={14} strokeWidth={1.5} />
              Home
            </a>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-foreground/40 hover:text-red-400 text-xs tracking-wide uppercase transition-colors"
            >
              <LogOut size={14} strokeWidth={1.5} />
              Esci
            </button>
            {profile?.is_admin && (
              <button
                onClick={() => router.push("/admin")}
                className="flex items-center gap-2 text-gold/60 hover:text-gold text-xs tracking-wide uppercase transition-colors"
              >
                <Shield size={14} strokeWidth={1.5} />
                Pannello Admin
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 p-1 bg-white/[0.03] border border-white/5 rounded-xl max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "profile"
                ? "bg-gold/15 text-gold border border-gold/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <User size={14} strokeWidth={1.5} />
            Profilo
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "orders"
                ? "bg-gold/15 text-gold border border-gold/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <Package size={14} strokeWidth={1.5} />
            Ordini
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "reviews"
                ? "bg-gold/15 text-gold border border-gold/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <MessageSquare size={14} strokeWidth={1.5} />
            Recensioni
          </button>
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
              <div className="rounded-2xl border border-gold/15 bg-white/[0.02] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <User size={18} strokeWidth={1.5} className="text-gold/60" />
                  <h2 className="text-foreground text-sm tracking-[0.15em] uppercase font-medium">Dati personali</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 py-3 border-b border-white/5">
                    <User size={16} strokeWidth={1.5} className="text-foreground/30" />
                    <div className="flex-1">
                      <p className="text-foreground/40 text-xs uppercase tracking-wide">Nome</p>
                      <p className="text-foreground/80 text-sm font-light">{profile?.name || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-white/5">
                    <Mail size={16} strokeWidth={1.5} className="text-foreground/30" />
                    <div className="flex-1">
                      <p className="text-foreground/40 text-xs uppercase tracking-wide">Email</p>
                      <p className="text-foreground/80 text-sm font-light">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3 border-b border-white/5">
                    <Phone size={16} strokeWidth={1.5} className="text-foreground/30" />
                    <div className="flex-1">
                      <p className="text-foreground/40 text-xs uppercase tracking-wide">Telefono</p>
                      <p className="text-foreground/80 text-sm font-light">{profile?.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-3">
                    <Mail size={16} strokeWidth={1.5} className="text-foreground/30" />
                    <div className="flex-1">
                      <p className="text-foreground/40 text-xs uppercase tracking-wide">Newsletter</p>
                      <p className="text-foreground/80 text-sm font-light">
                        {profile?.newsletter_consent ? "Iscritto" : "Non iscritto"}
                      </p>
                    </div>
                  </div>
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
                <div className="text-center py-16 rounded-2xl border border-gold/10 bg-white/[0.02]">
                  <ShoppingBag size={40} strokeWidth={1} className="text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/40 text-sm font-light">Nessun ordine ancora effettuato</p>
                  <a
                    href="/tera#shop"
                    className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs tracking-[0.15em] uppercase font-medium hover:bg-gold/25 transition-colors"
                  >
                    <ShoppingBag size={15} strokeWidth={1.5} />
                    Vai allo shop
                  </a>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-gold/15 bg-white/[0.02] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-foreground/40 text-xs uppercase tracking-wide">Ordine</p>
                        <p className="text-foreground/80 text-sm font-light font-mono">
                          #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-foreground/40 text-xs uppercase tracking-wide">Data</p>
                        <p className="text-foreground/80 text-sm font-light">
                          {new Date(order.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span className="text-foreground/60 font-light">{item.quantity}x {item.productName}</span>
                          <span className="text-foreground/40 font-light">€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        order.status === "pending"
                          ? "bg-gold/10 text-gold/70 border border-gold/20"
                          : "bg-green-500/10 text-green-400/70 border border-green-500/20"
                      }`}>
                        {order.status === "pending" ? "In attesa" : "Confermato"}
                      </span>
                      <span className="text-foreground text-sm font-medium">
                        €{Number(order.total).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {/* Review form */}
              <div className="rounded-2xl border border-gold/15 bg-white/[0.02] p-6">
                <div className="flex items-center gap-3 mb-5">
                  <Star size={18} strokeWidth={1.5} className="text-gold/60" />
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
                  <div className="text-center py-12 rounded-2xl border border-gold/10 bg-white/[0.02]">
                    <MessageSquare size={32} strokeWidth={1} className="text-foreground/20 mx-auto mb-3" />
                    <p className="text-foreground/40 text-sm font-light">Nessuna recensione ancora</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-gold/10 bg-white/[0.02] p-5">
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
                        <p className="text-foreground/70 text-sm font-light leading-relaxed">{review.text}</p>
                        <p className="text-foreground/30 text-xs mt-3">
                          {new Date(review.created_at).toLocaleDateString("it-IT")}
                        </p>
                      </div>
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
