"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Check, Loader2, Truck, ShieldCheck, Clock } from "lucide-react";
import Image from "next/image";
import { teraProducts } from "@/data/teraProducts";
import { supabase } from "@/lib/supabase-client";
import { SHIPPING_BASE_COST, SHIPPING_FREE_THRESHOLD } from "@/lib/commerce";

interface CartItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

const CART_KEY = "tera_cart";

export default function TeraShop() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartHydrated, setCartHydrated] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<"success" | "cancelled" | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const payment = new URLSearchParams(window.location.search).get("payment");
      if (payment === "success") {
        setCart([]);
        localStorage.removeItem(CART_KEY);
        setPaymentNotice("success");
      } else {
        const saved = localStorage.getItem(CART_KEY);
        if (saved) setCart(JSON.parse(saved));
        if (payment === "cancelled") setPaymentNotice("cancelled");
      }
    } catch {
      // ignore
    } finally {
      setCartHydrated(true);
    }
  }, []);

  // Check if user is logged in for prefilling
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserEmail(session.user.email || null);
          const res = await fetch("/api/customers/profile", {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          const data = res.ok ? await res.json() : null;
          if (data?.profile?.name) {
            setUserName(data.profile.name);
          }
        }
      } catch {
        // ignore
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!cartHydrated) return;
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, cartHydrated]);

  const addToCart = (productId: string) => {
    const product = teraProducts.find((p) => p.id === productId);
    if (!product) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { productId, productName: product.name, quantity: 1, price: product.price }];
    });
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shippingCost = cartTotal >= SHIPPING_FREE_THRESHOLD || cartTotal === 0 ? 0 : SHIPPING_BASE_COST;
  const grandTotal = cartTotal + shippingCost;

  return (
    <>
      {/* Shop Section */}
      <section id="shop" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 mb-8 md:mb-12 scroll-mt-20">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-px w-10 bg-white/30" />
          <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase font-medium">
            Il nostro shop
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-light tracking-wide text-white mb-3">
          Porta TERA a casa
        </h2>
        <p className="text-white/55 text-sm font-light mb-8 md:mb-10 max-w-xl">
          Il nostro blend senza glutine disponibile in pacchetti da 1kg, pronto per le tue ricette.
        </p>

        {paymentNotice && (
          <div className={`mb-8 rounded-xl border p-4 ${paymentNotice === "success" ? "border-emerald-300/25 bg-emerald-300/10" : "border-amber-300/25 bg-amber-300/10"}`}>
            <div className="flex items-start gap-3">
              {paymentNotice === "success" ? <Check size={18} className="mt-0.5 shrink-0 text-emerald-200" /> : <X size={18} className="mt-0.5 shrink-0 text-amber-200" />}
              <div>
                <p className="text-white text-sm font-medium">{paymentNotice === "success" ? "Pagamento completato" : "Pagamento annullato"}</p>
                <p className="mt-1 text-white/55 text-xs font-light">{paymentNotice === "success" ? "Stripe sta confermando l'ordine. Riceverai l'email di conferma e lo vedrai nel tuo account." : "Non è stato effettuato alcun addebito. Il carrello è ancora disponibile."}</p>
              </div>
            </div>
          </div>
        )}

        {/* Coming soon banner */}
        <div className="mb-8 rounded-2xl border border-white/15 bg-white/[0.04] p-6 backdrop-blur-sm">
          <p className="text-white/80 text-sm font-light text-center tracking-wide">
            Lo shop online sarà disponibile a breve. Stiamo finalizzando prezzi e logistica.
          </p>
          <p className="text-white/40 text-xs font-light text-center mt-2">
            Per ordini anticipati, contattaci direttamente · info@pizzeriatimilia.com
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {teraProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="group relative overflow-hidden rounded-[1.2rem] sm:rounded-[1.7rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.025))] p-4 sm:p-6 backdrop-blur-md transition-all duration-500 hover:border-white/24 hover:shadow-[0_28px_90px_rgba(0,0,0,0.24)]"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.06] blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:scale-x-100" />

              <div className="relative">
                {/* Product image */}
                <div className="relative aspect-[4/3] mb-5 rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.06]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>

                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-white text-lg font-light tracking-wide mb-1">
                      {product.name}
                    </h3>
                    <p className="text-white/45 text-xs font-light">{product.weight}</p>
                  </div>
                </div>

                <p className="text-white/60 text-sm font-light leading-relaxed mb-4">
                  {product.description}
                </p>

                <ul className="space-y-1.5 mb-6">
                  {product.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-white/50 text-xs font-light">
                      <Check size={12} strokeWidth={2} className="text-white/70 shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <div className="w-full py-3 bg-white/[0.04] border border-white/10 text-white/40 text-xs tracking-[0.2em] uppercase font-medium flex items-center justify-center gap-2 rounded-full">
                  <Clock size={14} strokeWidth={1.5} />
                  A breve disponibile
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/40 text-xs font-light">
          <span className="flex items-center gap-2">
            <Truck size={14} strokeWidth={1.5} />
            Spedizione in tutta Italia
          </span>
          <span className="flex items-center gap-2">
            <ShieldCheck size={14} strokeWidth={1.5} />
            Pagamento sicuro
          </span>
        </div>
      </section>

      {/* Floating Cart Button — disabled while shop is in coming soon mode */}

      {/* Cart Drawer */}
      <AnimatePresence>
        {cartOpen && !checkoutOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-full max-w-md bg-[#1a1f17] border-l border-white/10 overflow-y-auto"
            >
              <div className="sticky top-0 bg-[#1a1f17]/95 backdrop-blur-md border-b border-white/10 px-6 py-4 flex items-center justify-between">
                <h3 className="text-white text-sm tracking-[0.2em] uppercase font-medium">
                  Carrello
                </h3>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-white/50 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center px-6">
                  <ShoppingBag size={40} strokeWidth={1} className="text-white/20 mb-4" />
                  <p className="text-white/40 text-sm font-light">Il carrello è vuoto</p>
                </div>
              ) : (
                <>
                  <div className="px-6 py-6 space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.productId}
                        className="flex items-center gap-4 border border-white/8 rounded-xl p-4 bg-white/[0.02]"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-light truncate">
                            {item.productName}
                          </p>
                          <p className="text-white/40 text-xs font-light mt-0.5">
                            &euro;{item.price.toFixed(2)} cad.
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.productId, -1)}
                            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="text-white text-sm font-light w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, 1)}
                            className="w-7 h-7 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="text-white/30 hover:text-red-400/70 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-[#1a1f17]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-white/50 text-xs font-light">
                        <span>Subtotale</span>
                        <span>€{cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between text-white/50 text-xs font-light">
                        <span>Spedizione</span>
                        <span>{shippingCost === 0 ? "Gratuita" : `€${shippingCost.toFixed(2)}`}</span>
                      </div>
                      {shippingCost > 0 && (
                        <p className="text-white/30 text-[10px] font-light">
                          Spedizione gratuita per ordini sopra €{SHIPPING_FREE_THRESHOLD}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-white/50 text-sm font-light">Totale</span>
                        <span className="text-white text-xl font-light">€{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="w-full py-3 bg-white text-[#1a1f17] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors rounded-full"
                    >
                      Procedi all'ordine
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutOpen && (
          <CheckoutModal
            cart={cart}
            subtotal={cartTotal}
            shippingCost={shippingCost}
            total={grandTotal}
            prefillName={userName}
            prefillEmail={userEmail}
            onClose={() => setCheckoutOpen(false)}
            loading={loading}
            error={error}
            onSubmit={async (formData) => {
              setLoading(true);
              setError("");
              try {
                const res = await fetch("/api/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...formData,
                    items: cart.map((item) => ({
                      productId: item.productId,
                      quantity: item.quantity,
                    })),
                  }),
                });
                const data = await res.json();
                if (!res.ok || !data.url) {
                  setError(data.error || "Impossibile avviare il pagamento");
                  return;
                }
                window.location.assign(data.url);
              } catch {
                setError("Errore di connessione");
              } finally {
                setLoading(false);
              }
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface CheckoutModalProps {
  cart: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  prefillName?: string | null;
  prefillEmail?: string | null;
  onClose: () => void;
  loading: boolean;
  error: string;
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    shippingCity: string;
    shippingZip: string;
    notes: string;
  }) => void;
}

function CheckoutModal({ cart, subtotal, shippingCost, total, prefillName, prefillEmail, onClose, loading, error, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState(prefillName || "");
  const [email, setEmail] = useState(prefillEmail || "");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerName: name, customerEmail: email, customerPhone: phone, shippingAddress: address, shippingCity: city, shippingZip: zip, notes });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto border border-white/10 rounded-2xl bg-[#1a1f17] p-5 sm:p-6 md:p-8 shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <>
            <h3 className="text-white text-xl font-light mb-2">Checkout sicuro</h3>
            <p className="text-white/40 text-xs font-light mb-6">
              Completa i dati per ricevere il tuo blend TERA.
            </p>

            <div className="mb-6 border border-white/8 rounded-xl p-4 bg-white/[0.02]">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-white/60 text-xs font-light py-1">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>€{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 space-y-1">
                <div className="flex justify-between text-white/40 text-xs font-light">
                  <span>Subtotale</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white/40 text-xs font-light">
                  <span>Spedizione</span>
                  <span>{shippingCost === 0 ? "Gratuita" : `€${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-white text-sm font-light pt-1">
                  <span>Totale</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs tracking-wide mb-1.5">Nome e cognome *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="Mario Rossi"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-wide mb-1.5">Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="email@esempio.com"
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-wide mb-1.5">Telefono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors"
                  placeholder="+39 ..."
                />
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-wide mb-1.5">Indirizzo di spedizione *</label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors resize-none"
                  placeholder="Via, numero civico"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/50 text-xs tracking-wide mb-1.5">Città *</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="Palermo"
                  />
                </div>
                <div>
                  <label className="block text-white/50 text-xs tracking-wide mb-1.5">CAP *</label>
                  <input
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors"
                    placeholder="90133"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs tracking-wide mb-1.5">Note <span className="text-white/30">(opzionale)</span></label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-lg text-white text-sm font-light focus:border-white/30 focus:outline-none transition-colors resize-none"
                  placeholder="Eventuali istruzioni..."
                />
              </div>

              {error && <p className="text-red-400/80 text-xs font-light">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-white text-[#1a1f17] text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 rounded-full"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {loading ? "Apertura pagamento..." : "Paga in modo sicuro"}
              </button>
              <p className="text-white/30 text-xs font-light text-center">
                Verrai reindirizzato al checkout sicuro di Stripe. L'ordine viene confermato solo dopo il pagamento.
              </p>
            </form>
          </>
      </motion.div>
    </motion.div>
  );
}
