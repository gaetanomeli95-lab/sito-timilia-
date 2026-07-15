"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star, CheckCircle, XCircle, Loader2, Package, Users,
  MessageSquare, ArrowLeft, Power, MapPin, Mail, Phone, Truck,
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
  shipping_name: string;
  shipping_address: string;
  shipping_city: string | null;
  shipping_zip: string | null;
  shipping_phone: string | null;
  subtotal: number;
  shipping_cost: number;
  coupon_code: string | null;
  coupon_discount: number;
  total: number;
  status: string;
  payment_status: string;
  tracking_number: string | null;
  notes: string | null;
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
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [togglingMaintenance, setTogglingMaintenance] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (error) {
      setLoginError(error.message);
      setLoginLoading(false);
      return;
    }
    if (data.session) {
      setUser(data.user);
      setAuthToken(data.session.access_token);
      setShowLogin(false);
      const res = await fetch("/api/customers/profile", {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      const profile = res.ok ? (await res.json()).profile : null;
      if (!profile?.is_admin) {
        router.push("/account");
        return;
      }
      setIsAdmin(true);
      const token = data.session.access_token;
      await loadReviews(token);
      await loadOrders(token);
      await loadCustomers(token);
      await loadMaintenanceMode(token);
      setLoading(false);
    }
    setLoginLoading(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setShowLogin(true);
        setLoading(false);
        return;
      }
      setUser(session.user);
      setAuthToken(session.access_token);

      const res = await fetch("/api/customers/profile", {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
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
      await loadMaintenanceMode(token);
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

  const loadMaintenanceMode = async (token?: string) => {
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${token || authToken}` },
      });
      const data = res.ok ? await res.json() : null;
      setMaintenanceMode(data?.maintenance_mode || false);
    } catch {
      // ignore
    }
  };

  const toggleMaintenance = async () => {
    setTogglingMaintenance(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ enabled: !maintenanceMode }),
      });
      setMaintenanceMode(!maintenanceMode);
    } catch {
      // ignore
    }
    setTogglingMaintenance(false);
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

  const updateOrderStatus = async (id: string, status: string, trackingNumber?: string) => {
    setActionLoading(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ id, status, trackingNumber }),
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

  if (showLogin || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-700/[0.03] rounded-full blur-[100px] pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative max-w-sm w-full"
        >
          <div className="text-center mb-8">
            <h1 className="text-gold text-3xl font-light tracking-[0.3em] mb-2">TIMILIA</h1>
            <div className="h-px w-16 bg-gold/30 mx-auto" />
            <p className="text-foreground/40 text-xs tracking-wide uppercase mt-4">Accesso Admin</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl border border-gold/15 bg-white/[0.02] p-8 backdrop-blur-sm space-y-4">
            <div>
              <label className="text-foreground/50 text-xs tracking-wide uppercase mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 px-3 text-sm text-foreground outline-none transition-colors focus:border-gold/30"
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="text-foreground/50 text-xs tracking-wide uppercase mb-1.5 block">Password</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 px-3 text-sm text-foreground outline-none transition-colors focus:border-gold/30"
                placeholder="••••••••"
              />
            </div>
            {loginError && (
              <p className="text-red-400/70 text-xs">{loginError}</p>
            )}
            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg border border-gold/30 bg-gold/15 text-gold text-sm py-2.5 tracking-wide uppercase font-medium hover:bg-gold/25 transition-colors disabled:opacity-50"
            >
              {loginLoading ? <Loader2 size={16} className="mx-auto animate-spin" /> : "Accedi"}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

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
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-foreground text-2xl md:text-3xl font-light tracking-wide">
              Pannello Admin
            </h1>
            <button
              onClick={toggleMaintenance}
              disabled={togglingMaintenance}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wide uppercase font-medium transition-all ${
                maintenanceMode
                  ? "bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25"
                  : "bg-white/[0.04] border border-white/10 text-foreground/50 hover:text-gold hover:border-gold/30"
              }`}
            >
              {togglingMaintenance ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Power size={14} strokeWidth={1.5} />
              )}
              {maintenanceMode ? "Manutenzione ON" : "Manutenzione"}
            </button>
          </div>
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
                  <OrderCard
                    key={order.id}
                    order={order}
                    actionLoading={actionLoading}
                    onUpdateStatus={updateOrderStatus}
                  />
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

const ORDER_STATUSES = [
  { value: "pending", label: "In attesa" },
  { value: "preparing", label: "In preparazione" },
  { value: "shipped", label: "Spedito" },
  { value: "delivered", label: "Consegnato" },
];

function OrderCard({
  order,
  actionLoading,
  onUpdateStatus,
}: {
  order: Order;
  actionLoading: string | null;
  onUpdateStatus: (id: string, status: string, trackingNumber?: string) => Promise<void>;
}) {
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [expanded, setExpanded] = useState(false);
  const busy = actionLoading === order.id;

  const updateStatus = async (status: string) => {
    if (status === order.status && status !== "shipped") return;
    await onUpdateStatus(order.id, status, status === "shipped" ? trackingNumber.trim() : undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gold/15 bg-white/[0.02] overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setExpanded((value) => !value)}
        className="w-full p-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-foreground/80 text-sm font-mono">#{order.id.slice(0, 8)}</p>
              <span className="rounded-full border border-gold/20 bg-gold/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-gold/80">
                {order.status === "paid" ? "Pagato" : ORDER_STATUSES.find((item) => item.value === order.status)?.label || order.status}
              </span>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wide ${order.payment_status === "paid" ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300" : "border-amber-500/25 bg-amber-500/10 text-amber-300"}`}>
                {order.payment_status === "paid" ? "Pagamento ricevuto" : "Non pagato"}
              </span>
            </div>
            <p className="text-foreground/60 text-sm truncate">{order.shipping_name || order.customer_email}</p>
            <p className="text-foreground/35 text-xs truncate">{order.customer_email}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-foreground text-base font-medium">€{Number(order.total).toFixed(2)}</p>
            <p className="text-foreground/35 text-xs">
              {new Date(order.created_at).toLocaleDateString("it-IT")}
            </p>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/5 p-5 space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/5 bg-black/10 p-4 space-y-2">
              <p className="text-foreground/35 text-[10px] uppercase tracking-[0.15em]">Cliente</p>
              <p className="text-foreground/75 text-sm">{order.shipping_name}</p>
              <p className="flex items-center gap-2 text-foreground/45 text-xs"><Mail size={12} />{order.customer_email}</p>
              {order.shipping_phone && <p className="flex items-center gap-2 text-foreground/45 text-xs"><Phone size={12} />{order.shipping_phone}</p>}
            </div>
            <div className="rounded-lg border border-white/5 bg-black/10 p-4 space-y-2">
              <p className="text-foreground/35 text-[10px] uppercase tracking-[0.15em]">Spedizione</p>
              <p className="flex items-start gap-2 text-foreground/55 text-xs leading-relaxed">
                <MapPin size={12} className="mt-0.5 shrink-0" />
                <span>{order.shipping_address}<br />{order.shipping_zip} {order.shipping_city}</span>
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={`${item.productName}-${index}`} className="flex justify-between text-xs">
                <span className="text-foreground/55">{item.quantity}x {item.productName}</span>
                <span className="text-foreground/40">€{(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t border-white/5 pt-2 space-y-1">
              <div className="flex justify-between text-xs text-foreground/35"><span>Subtotale</span><span>€{Number(order.subtotal || 0).toFixed(2)}</span></div>
              {Number(order.coupon_discount) > 0 && <div className="flex justify-between text-xs text-gold/65"><span>Sconto {order.coupon_code ? `(${order.coupon_code})` : ""}</span><span>-€{Number(order.coupon_discount).toFixed(2)}</span></div>}
              <div className="flex justify-between text-xs text-foreground/35"><span>Spedizione</span><span>{Number(order.shipping_cost) === 0 ? "Gratuita" : `€${Number(order.shipping_cost).toFixed(2)}`}</span></div>
            </div>
          </div>

          {order.notes && (
            <div className="rounded-lg border border-white/5 bg-black/10 p-3">
              <p className="text-foreground/35 text-[10px] uppercase tracking-wide mb-1">Note</p>
              <p className="text-foreground/55 text-xs">{order.notes}</p>
            </div>
          )}

          <div>
            <p className="text-foreground/35 text-[10px] uppercase tracking-[0.15em] mb-2">Aggiorna stato</p>
            <div className="flex flex-wrap gap-2">
              {ORDER_STATUSES.map((status) => (
                <button
                  key={status.value}
                  type="button"
                  disabled={busy}
                  onClick={() => updateStatus(status.value)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${
                    order.status === status.value
                      ? "border-gold/35 bg-gold/15 text-gold"
                      : "border-white/10 bg-white/[0.03] text-foreground/40 hover:border-gold/25 hover:text-foreground/70"
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Truck size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/30" />
              <input
                type="text"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                placeholder="Codice tracking spedizione"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-foreground outline-none transition-colors focus:border-gold/30"
              />
            </div>
            <button
              type="button"
              disabled={busy || !trackingNumber.trim()}
              onClick={() => updateStatus("shipped")}
              className="rounded-lg border border-blue-500/25 bg-blue-500/10 px-4 py-2.5 text-xs text-blue-300 transition-colors hover:bg-blue-500/20 disabled:opacity-40"
            >
              {busy ? <Loader2 size={14} className="mx-auto animate-spin" /> : "Salva tracking e spedisci"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
