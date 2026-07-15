"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star, CheckCircle, XCircle, Loader2, Package, Users,
  MessageSquare, ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import Navbar from "@/components/Navbar";

interface Review {
  id: string;
  customer_name: string;
  rating: number;
  text: string;
  approved: boolean;
  created_at: string;
}

interface Order {
  id: string;
  customer_email: string;
  total: number;
  status: string;
  created_at: string;
  items: { productName: string; quantity: number; price: number }[];
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  newsletter_consent: boolean;
  is_admin: boolean;
  created_at: string;
}

export default function AdminPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"reviews" | "orders" | "customers">("reviews");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
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

      const res = await fetch(`/api/customers/profile?authId=${session.user.id}`);
      const profile = res.ok ? (await res.json()).profile : null;

      if (!profile?.is_admin) {
        router.push("/account");
        return;
      }

      setIsAdmin(true);
      const token = session.access_token;
      await loadReviews(token);
      await loadOrders(token);
      await loadCustomers(token);
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  const loadReviews = async (token?: string) => {
    const res = await fetch("/api/admin/reviews", {
      headers: { Authorization: `Bearer ${token || authToken}` },
    });
    const data = res.ok ? (await res.json()).reviews : [];
    setReviews(data as Review[] || []);
  };

  const loadOrders = async (token?: string) => {
    const res = await fetch("/api/admin/orders", {
      headers: { Authorization: `Bearer ${token || authToken}` },
    });
    const data = res.ok ? (await res.json()).orders : [];
    setOrders(data as Order[] || []);
  };

  const loadCustomers = async (token?: string) => {
    const res = await fetch("/api/admin/customers", {
      headers: { Authorization: `Bearer ${token || authToken}` },
    });
    const data = res.ok ? (await res.json()).customers : [];
    setCustomers(data as Customer[] || []);
  };

  const approveReview = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id, approved: true }),
    });
    await loadReviews();
    setActionLoading(null);
  };

  const rejectReview = async (id: string) => {
    setActionLoading(id);
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id }),
    });
    await loadReviews();
    setActionLoading(null);
  };

  const updateOrderStatus = async (id: string, status: string) => {
    setActionLoading(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id, status }),
    });
    await loadOrders();
    setActionLoading(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-gold" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const pendingReviews = reviews.filter(r => !r.approved);
  const approvedReviews = reviews.filter(r => r.approved);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => router.push("/account")}
            className="flex items-center gap-2 text-foreground/40 hover:text-gold text-xs tracking-wide uppercase transition-colors mb-4"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            Torna al profilo
          </button>
          <h1 className="text-foreground text-2xl md:text-3xl font-light tracking-wide mb-1">
            Pannello Admin
          </h1>
          <p className="text-foreground/40 text-sm font-light">
            Gestisci recensioni, ordini e utenti
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
          <div className="rounded-xl border border-gold/15 bg-white/[0.02] p-3 sm:p-4 text-center">
            <MessageSquare size={20} strokeWidth={1.5} className="text-gold/60 mx-auto mb-2" />
            <p className="text-foreground text-lg sm:text-xl font-light">{pendingReviews.length}</p>
            <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-wide">In attesa</p>
          </div>
          <div className="rounded-xl border border-gold/15 bg-white/[0.02] p-3 sm:p-4 text-center">
            <Package size={20} strokeWidth={1.5} className="text-gold/60 mx-auto mb-2" />
            <p className="text-foreground text-lg sm:text-xl font-light">{orders.length}</p>
            <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-wide">Ordini</p>
          </div>
          <div className="rounded-xl border border-gold/15 bg-white/[0.02] p-3 sm:p-4 text-center">
            <Users size={20} strokeWidth={1.5} className="text-gold/60 mx-auto mb-2" />
            <p className="text-foreground text-lg sm:text-xl font-light">{customers.length}</p>
            <p className="text-foreground/40 text-[10px] sm:text-xs uppercase tracking-wide">Utenti</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "reviews"
                ? "bg-gold/15 text-gold border border-gold/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <MessageSquare size={14} strokeWidth={1.5} />
            Recensioni {pendingReviews.length > 0 && `(${pendingReviews.length})`}
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
            onClick={() => setActiveTab("customers")}
            className={`flex-1 py-2.5 rounded-lg text-xs tracking-wide uppercase font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "customers"
                ? "bg-gold/15 text-gold border border-gold/20"
                : "text-foreground/40 hover:text-foreground/60"
            }`}
          >
            <Users size={14} strokeWidth={1.5} />
            Utenti
          </button>
        </div>

        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {/* REVIEWS TAB */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              {pendingReviews.length > 0 && (
                <div>
                  <h3 className="text-gold/80 text-sm tracking-[0.15em] uppercase font-medium mb-3">
                    In attesa di approvazione
                  </h3>
                  <div className="space-y-3">
                    {pendingReviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-gold/20 bg-gold/[0.03] p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-foreground/80 text-sm font-medium">{review.customer_name}</p>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={12} strokeWidth={1.5} className="text-gold fill-gold" />
                              ))}
                            </div>
                          </div>
                          <p className="text-foreground/30 text-xs">{new Date(review.created_at).toLocaleDateString("it-IT")}</p>
                        </div>
                        <p className="text-foreground/70 text-sm font-light leading-relaxed mb-4">{review.text}</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => approveReview(review.id)}
                            disabled={actionLoading === review.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 text-xs tracking-wide uppercase font-medium hover:bg-green-500/25 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === review.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} strokeWidth={1.5} />}
                            Approva
                          </button>
                          <button
                            onClick={() => rejectReview(review.id)}
                            disabled={actionLoading === review.id}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 text-xs tracking-wide uppercase font-medium hover:bg-red-500/25 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === review.id ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} strokeWidth={1.5} />}
                            Rifiuta
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {approvedReviews.length > 0 && (
                <div>
                  <h3 className="text-foreground/40 text-sm tracking-[0.15em] uppercase font-medium mb-3">
                    Recensioni pubblicate
                  </h3>
                  <div className="space-y-3">
                    {approvedReviews.map((review) => (
                      <div key={review.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="text-foreground/60 text-sm font-light">{review.customer_name}</p>
                            <div className="flex gap-0.5 mt-1">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} size={12} strokeWidth={1.5} className="text-gold fill-gold" />
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-green-400/60 text-xs px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                              Pubblicata
                            </span>
                            <button
                              onClick={() => rejectReview(review.id)}
                              disabled={actionLoading === review.id}
                              className="text-red-400/50 hover:text-red-400 text-xs transition-colors"
                            >
                              Rimuovi
                            </button>
                          </div>
                        </div>
                        <p className="text-foreground/50 text-sm font-light leading-relaxed">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reviews.length === 0 && (
                <div className="text-center py-16 rounded-2xl border border-gold/10 bg-white/[0.02]">
                  <MessageSquare size={40} strokeWidth={1} className="text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/40 text-sm font-light">Nessuna recensione</p>
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-gold/10 bg-white/[0.02]">
                  <Package size={40} strokeWidth={1} className="text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/40 text-sm font-light">Nessun ordine</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="rounded-xl border border-gold/15 bg-white/[0.02] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-foreground/80 text-sm font-mono">#{order.id.slice(0, 8)}</p>
                        <p className="text-foreground/40 text-xs">{order.customer_email}</p>
                      </div>
                      <p className="text-foreground/40 text-xs">{new Date(order.created_at).toLocaleDateString("it-IT")}</p>
                    </div>
                    <div className="space-y-1 mb-3">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                          <span className="text-foreground/50">{item.quantity}x {item.productName}</span>
                          <span className="text-foreground/30">€{item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, "confirmed")}
                          disabled={actionLoading === order.id}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            order.status === "confirmed"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-white/5 text-foreground/40 border border-white/10 hover:text-green-400"
                          }`}
                        >
                          Confermato
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "pending")}
                          disabled={actionLoading === order.id}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            order.status === "pending"
                              ? "bg-gold/20 text-gold border border-gold/30"
                              : "bg-white/5 text-foreground/40 border border-white/10 hover:text-gold"
                          }`}
                        >
                          In attesa
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, "shipped")}
                          disabled={actionLoading === order.id}
                          className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                            order.status === "shipped"
                              ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                              : "bg-white/5 text-foreground/40 border border-white/10 hover:text-blue-400"
                          }`}
                        >
                          Spedito
                        </button>
                      </div>
                      <span className="text-foreground text-sm font-medium">€{Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CUSTOMERS TAB */}
          {activeTab === "customers" && (
            <div className="space-y-2">
              {customers.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-gold/10 bg-white/[0.02]">
                  <Users size={40} strokeWidth={1} className="text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/40 text-sm font-light">Nessun utente registrato</p>
                </div>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-gold/20 bg-gold/5 flex items-center justify-center text-gold text-sm font-medium shrink-0">
                      {customer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground/80 text-sm font-medium truncate">{customer.name}</p>
                      <p className="text-foreground/40 text-xs truncate">{customer.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      {customer.is_admin && (
                        <span className="text-gold/60 text-[10px] px-2 py-0.5 rounded-full bg-gold/10 border border-gold/20 uppercase tracking-wide">
                          Admin
                        </span>
                      )}
                      <p className="text-foreground/30 text-xs mt-1">
                        {new Date(customer.created_at).toLocaleDateString("it-IT")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
