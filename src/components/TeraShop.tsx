"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Check, Loader2, Truck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { teraProducts } from "@/data/teraProducts";

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
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

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
                  <div className="text-right">
                    <p className="text-white text-2xl font-light">
                      &euro;{product.price.toFixed(2)}
                    </p>
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

                <button
                  onClick={() => addToCart(product.id)}
                  className="w-full py-3 bg-white/10 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/20 hover:border-white/40 transition-all duration-500 flex items-center justify-center gap-2 rounded-full"
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  Aggiungi al carrello
                </button>
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

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-white/15 border border-white/25 backdrop-blur-md px-5 py-3 text-white text-xs tracking-wide hover:bg-white/25 transition-colors"
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          <span>{cartCount} {cartCount === 1 ? "articolo" : "articoli"}</span>
          <span className="text-white/60">·</span>
          <span>&euro;{cartTotal.toFixed(2)}</span>
        </motion.button>
      )}

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

                  <div className="sticky bottom-0 bg-[#1a1f17]/95 backdrop-blur-md border-t border-white/10 px-6 py-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/50 text-sm font-light">Totale</span>
                      <span className="text-white text-xl font-light">
                        &euro;{cartTotal.toFixed(2)}
                      </span>
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
            total={cartTotal}
            onClose={() => {
              setCheckoutOpen(false);
              if (orderSuccess) {
                setCart([]);
                setCartOpen(false);
                setOrderSuccess(false);
              }
            }}
            loading={loading}
            error={error}
            success={orderSuccess}
            onSubmit={async (formData) => {
              setLoading(true);
              setError("");
              try {
                const res = await fetch("/api/orders", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    ...formData,
                    items: cart.map((item) => ({
                      productId: item.productId,
                      productName: item.productName,
                      quantity: item.quantity,
                      price: item.price,
                    })),
                  }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error || "Errore");
                  return;
                }
                setOrderSuccess(true);
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
  total: number;
  onClose: () => void;
  loading: boolean;
  error: string;
  success: boolean;
  onSubmit: (data: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    notes: string;
  }) => void;
}

function CheckoutModal({ cart, total, onClose, loading, error, success, onSubmit }: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ customerName: name, customerEmail: email, customerPhone: phone, shippingAddress: address, notes });
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

        {success ? (
          <div className="text-center py-8">
            <Check size={48} strokeWidth={1.5} className="text-white/80 mx-auto mb-4" />
            <h3 className="text-white text-xl font-light mb-2">Ordine ricevuto!</h3>
            <p className="text-white/50 text-sm font-light">
              Ti contatteremo via email per la conferma e il pagamento.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-white/10 border border-white/20 text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-white/20 transition-colors rounded-full"
            >
              Chiudi
            </button>
          </div>
        ) : (
          <>
            <h3 className="text-white text-xl font-light mb-2">Checkout</h3>
            <p className="text-white/40 text-xs font-light mb-6">
              Completa i dati per ricevere il tuo blend TERA.
            </p>

            <div className="mb-6 border border-white/8 rounded-xl p-4 bg-white/[0.02]">
              {cart.map((item) => (
                <div key={item.productId} className="flex justify-between text-white/60 text-xs font-light py-1">
                  <span>{item.productName} × {item.quantity}</span>
                  <span>&euro;{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/10 mt-2 pt-2 flex justify-between text-white text-sm font-light">
                <span>Totale</span>
                <span>&euro;{total.toFixed(2)}</span>
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
                  placeholder="Via, numero, città, CAP"
                />
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
                {loading ? "Elaborazione..." : "Invia ordine"}
              </button>
              <p className="text-white/30 text-xs font-light text-center">
                Ti contatteremo per la conferma e il pagamento prima della spedizione.
              </p>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
