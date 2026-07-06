"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { menuCategories, MenuItem } from "@/data/menuData";
import ProductModal from "./ProductModal";

const previewImages: Record<string, string> = {
  impasti: "/images/menu/classiche-MARGHERITA.jpg",
  antipasti: "/images/menu/nuovo-antipasti-stritti-fuddi.png",
  "passi-dautore": "/images/menu/passi-CAMURRIA.jpg",
  "le-storiche": "/images/menu/storiche-PANORMUS.jpg",
  "le-classiche": "/images/menu/nuovo-classiche-caprese.png",
  buffalotti: "/images/menu/buffalotti-CU_CRUDU.jpg",
  crusta: "/images/menu/nuovo-crusta-timpulata.png",
  "le-vegane": "/images/menu/vegane-PATAT.jpg",
  "rotundi-casseruola": "/images/menu/classiche-CALZONE.jpg",
  insalate: "/images/menu/nuovo-insalate-caprese.png",
  hamburger: "/images/menu/classiche-DIAVOLA.jpg",
  dolci: "/images/logo-timilia-original.jpg",
  bevande: "/images/logo-timilia-original.jpg",
  birre: "/images/logo-timilia-original.jpg",
  "birre-sg": "/images/logo-timilia-original.jpg",
  vini: "/images/logo-timilia-original.jpg",
  cocktail: "/images/logo-timilia-original.jpg",
  aggiunzioni: "/images/logo-timilia-original.jpg",
};

const categoryEmojis: Record<string, string> = {
  impasti: "🫧",
  antipasti: "🧆",
  "passi-dautore": "✨",
  "le-storiche": "📜",
  "le-classiche": "🍕",
  buffalotti: "🧀",
  crusta: "🫓",
  "le-vegane": "🌿",
  "rotundi-casseruola": "🍞",
  insalate: "🥗",
  hamburger: "🍔",
  dolci: "🍰",
  bevande: "🥤",
  birre: "🍺",
  "birre-sg": "🌾",
  vini: "🍷",
  cocktail: "🍸",
  aggiunzioni: "➕",
};

const categoryDescriptions: Record<string, string> = {
  impasti: "I nostri impasti: contemporaneo, senza glutine, rotundo in casseruola e crusta.",
  antipasti: "Street food siciliano, rielaborato con materie prime d'eccellenza.",
  "passi-dautore": "Ricerca, equilibrio e creatività. Ogni pizza è un'opera unica.",
  "le-storiche": "Le ricette che hanno scritto la storia della pizza napoletana.",
  "le-classiche": "I grandi classici, eseguiti con maestria e ingredienti selezionati.",
  buffalotti: "Calzoni dal gusto ricco, doppia farcitura interna ed esterna.",
  crusta: "Base sottile e croccante. Leggerezza e fragranza in ogni morso.",
  "le-vegane": "Proposte vegetali che rispettano la qualità senza compromessi.",
  "rotundi-casseruola": "Pane soffice e morbido, farcito con ingredienti di qualità.",
  insalate: "Freschezza e colore. Insalate gourmet con ingredienti di stagione.",
  hamburger: "Burger d'autore, carne Scottona e combinazioni gourmet.",
  dolci: "Dolci senza glutine e senza lattosio (eccetto il cannolo).",
  bevande: "Acque, bibite, caffè e digestivi.",
  birre: "Birre artigianali siciliane e nazionali.",
  "birre-sg": "Birre artigianali senza glutine.",
  vini: "Vini al calice, selezione siciliana.",
  cocktail: "Spritz, cocktail classici e signature.",
  aggiunzioni: "Aggiunte e personalizzazioni per la tua pizza.",
};

export default function MenuScene() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [selectedCat, setSelectedCat] = useState<number | null>(0);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCatTitle, setSelectedCatTitle] = useState("");

  const sceneRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const displayIdx = hoveredIdx ?? selectedCat ?? 0;
  const category = menuCategories[displayIdx];
  const imageSrc = previewImages[category?.id] ?? "/images/logo-timilia-original.jpg";

  useEffect(() => {
    if (!sceneRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sceneRef.current!.querySelectorAll("[data-enter]"),
        { opacity: 0, y: 24, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.04,
        }
      );
    }, sceneRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!bannerRef.current) return;
    const el = bannerRef.current;
    gsap.killTweensOf(el);
    gsap.to(el, {
      scale: 1.06,
      duration: 8,
      ease: "none",
      repeat: -1,
      yoyo: true,
    });
  }, [displayIdx]);

  useEffect(() => {
    if (!productsRef.current || selectedCat === null) return;
    const items = productsRef.current.querySelectorAll("[data-product]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 30, filter: "blur(6px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.08,
      }
    );
  }, [selectedCat]);

  const handleCategoryClick = (idx: number) => {
    setSelectedCat(selectedCat === idx ? null : idx);
  };

  const handleOpenProduct = useCallback((item: MenuItem, cat: string) => {
    setSelectedCatTitle(cat);
    setSelectedItem(item);
  }, []);

  const handleCloseProduct = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const expandedCategory = selectedCat !== null ? menuCategories[selectedCat] : null;

  return (
    <div ref={sceneRef} className="relative min-h-screen bg-[#0c0a08] flex flex-col overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(circle_at_22%_8%,rgba(200,169,126,0.18),transparent_30%),radial-gradient(circle_at_82%_14%,rgba(212,165,116,0.12),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(200,169,126,0.1),transparent_40%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-80 bg-gradient-to-b from-gold/[0.09] via-gold/[0.03] to-transparent" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(180deg,transparent_0%,transparent_60%,rgba(0,0,0,0.4)_100%)]" />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="relative z-20 flex items-center justify-between px-5 lg:px-10 pt-5 pb-3" data-enter>
        <Link href="/" className="flex items-center gap-2 text-[#f5f0e8]/55 hover:text-gold transition-colors text-[10px] tracking-[0.2em] uppercase font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Torna al sito</span>
        </Link>
        <span className="text-gold/70 text-[10px] tracking-[0.4em] uppercase font-medium">
          Timilia
        </span>
        <span className="text-[#f5f0e8]/35 text-[10px] tracking-[0.3em] uppercase font-light">
          Menu
        </span>
      </header>

      {/* Category banner strip — rectangular, horizontal */}
      <div className="relative z-10 mx-4 lg:mx-8 h-[150px] sm:h-[170px] lg:h-[215px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border border-white/[0.08] shadow-[0_24px_90px_rgba(0,0,0,0.4)]" data-enter>
        <div ref={bannerRef} className="absolute inset-0 transition-opacity duration-500" style={{ willChange: "transform" }}>
          <Image
            src={imageSrc}
            alt={category?.title ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0c0a08]/82 via-[#0c0a08]/28 to-[#0c0a08]/52" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0a08]/72 via-transparent to-white/[0.04]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_42%,rgba(200,169,126,0.16),transparent_34%)]" />

        {/* Category title overlay on the banner */}
        <div className="absolute inset-0 flex items-center justify-between px-5 lg:px-10 z-10">
          <div>
            <span className="text-gold/80 text-[10px] tracking-[0.3em] uppercase font-medium block mb-1.5">
              {String(displayIdx + 1).padStart(2, "0")} — Categoria
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide text-[#f5f0e8]">
              {category?.title}
            </h2>
            <p className="text-[#f5f0e8]/45 text-xs lg:text-sm font-light leading-relaxed line-clamp-1 mt-1 max-w-md">
              {categoryDescriptions[category?.id] ?? category?.subtitle}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-gold/70 text-xs font-light">
              {category?.items.length} prodotti
            </span>
            <div className="h-[1px] w-12 bg-gold/35" />
          </div>
        </div>
      </div>

      {/* Mobile: sticky horizontal scrollable category tabs */}
      <nav className="lg:hidden sticky top-0 flex-shrink-0 px-5 py-3 overflow-x-auto scrollbar-hide border-b border-white/[0.07] z-20 bg-[#0c0a08]/90 backdrop-blur-xl">
        <div className="flex gap-1.5">
          {menuCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(idx)}
              className={`px-3 py-1.5 rounded-full text-[11px] tracking-wide font-light whitespace-nowrap transition-all duration-400 ${
                displayIdx === idx
                  ? "bg-gold/18 text-gold border border-gold/28 shadow-[0_0_28px_rgba(200,169,126,0.14)]"
                  : "text-[#f5f0e8]/48 border border-white/[0.05] bg-white/[0.025]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Desktop left: sticky category list */}
        <nav className="hidden lg:flex lg:w-[22%] flex-shrink-0 px-6 py-6 flex-col justify-start overflow-y-auto scrollbar-hide sticky top-0 self-start max-h-[calc(100vh-0px)]">
          <div data-enter className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-gold/30" />
              <span className="text-gold/70 text-[9px] tracking-[0.3em] uppercase">
                Categorie
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-0.5">
            {menuCategories.map((cat, idx) => (
              <CategoryRow
                key={cat.id}
                cat={cat}
                idx={idx}
                isActive={displayIdx === idx}
                isExpanded={selectedCat === idx}
                onHover={() => setHoveredIdx(idx)}
                onLeave={() => setHoveredIdx(null)}
                onClick={() => handleCategoryClick(idx)}
              />
            ))}
          </div>
        </nav>

        {/* Right: products scroll area — large cards, one per row */}
        <div className="flex-1 lg:w-[78%] relative overflow-y-auto scrollbar-hide min-h-0">
          {expandedCategory ? (
            <div ref={productsRef} className="px-4 sm:px-6 lg:px-8 py-5">
              <div className="flex items-center gap-4 mb-5">
                <h3 className="text-base lg:text-lg font-light text-gold/90 tracking-wide">
                  {expandedCategory.title}
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/25 to-transparent" />
                <button
                  onClick={() => setSelectedCat(null)}
                  className="flex items-center gap-1 text-[#f5f0e8]/40 hover:text-gold text-[10px] tracking-[0.2em] uppercase transition-colors duration-400"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                  Chiudi
                </button>
              </div>

              {/* Large product cards — one per row, scrollable */}
              <div className="flex flex-col gap-4 lg:gap-5 pb-8">
                {expandedCategory.items.map((item, i) => (
                  <LargeProductCard
                    key={i}
                    item={item}
                    catTitle={expandedCategory.title}
                    onOpen={handleOpenProduct}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full px-6">
              <div className="text-center max-w-sm">
                <p className="text-[#f5f0e8]/35 text-sm font-light leading-relaxed">
                  Seleziona una categoria per visualizzare i prodotti
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="h-[1px] w-16 bg-gold/20" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ProductModal
        item={selectedItem}
        categoryTitle={selectedCatTitle}
        onClose={handleCloseProduct}
      />
    </div>
  );
}

/* ---------- Category Row ---------- */
function CategoryRow({
  cat,
  idx,
  isActive,
  isExpanded,
  onHover,
  onLeave,
  onClick,
}: {
  cat: (typeof menuCategories)[number];
  idx: number;
  isActive: boolean;
  isExpanded: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    gsap.to(ref.current, {
      x: x * 0.04,
      duration: 0.5,
      ease: "power3.out",
    });
    if (glowRef.current) {
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      glowRef.current.style.background = `radial-gradient(circle at ${glowX}% 50%, rgba(216, 154, 61, 0.1), transparent 70%)`;
      gsap.to(glowRef.current, { opacity: 1, duration: 0.4 });
    }
  };

  const handleMouseLeave = () => {
    onLeave();
    if (ref.current) {
      gsap.to(ref.current, { x: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
    }
    if (glowRef.current) {
      gsap.to(glowRef.current, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <button
      ref={ref}
      data-enter
      onMouseEnter={onHover}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative flex items-center gap-3 py-2.5 px-3 rounded-xl text-left transition-colors duration-500 hover:bg-white/[0.04]"
      style={{ willChange: "transform" }}
    >
      <span
        ref={glowRef}
        className="absolute inset-0 opacity-0 rounded-xl pointer-events-none"
      />
      <span
        className={`text-base transition-all duration-500 ${
          isActive ? "scale-110" : "opacity-60 group-hover:opacity-100"
        }`}
      >
        {categoryEmojis[cat.id] ?? "•"}
      </span>
      <span
        className={`text-sm lg:text-base font-light tracking-wide transition-all duration-500 ${
          isActive
            ? "text-gold"
            : "text-[#f5f0e8]/52 group-hover:text-[#f5f0e8]/82"
        }`}
        style={{
          textShadow: isActive ? "0 0 20px rgba(216, 154, 61, 0.2)" : "none",
          fontWeight: isActive ? 400 : 300,
          letterSpacing: isActive ? "0.03em" : "0.01em",
        }}
      >
        {cat.title}
      </span>
      {isExpanded && (
        <span className="ml-auto text-gold/40 text-[10px]">▾</span>
      )}
    </button>
  );
}

/* ---------- Large Product Card ---------- */
function LargeProductCard({
  item,
  catTitle,
  onOpen,
}: {
  item: MenuItem;
  catTitle: string;
  onOpen: (item: MenuItem, cat: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 4;
    const rotateX = -((y - cy) / cy) * 4;
    gsap.to(ref.current, {
      rotateY,
      rotateX,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
    if (spotlightRef.current) {
      spotlightRef.current.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(200,169,126,0.12), transparent 220px)`;
      spotlightRef.current.style.opacity = "1";
    }
  };

  const handleMouseLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
    }
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "0";
    }
  };

  const hasImage = !!item.image;

  return (
    <div
      ref={ref}
      data-product
      onClick={() => onOpen(item, catTitle)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] hover:border-gold/30 transition-all duration-700 flex flex-col sm:flex-row shadow-[0_20px_80px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_110px_rgba(0,0,0,0.4)]"
      style={{ willChange: "transform", transformStyle: "preserve-3d", background: "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))" }}
    >
      <div ref={spotlightRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-20" />
      <div className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold/50 to-transparent transition-transform duration-700 group-hover:scale-x-100 z-20" />
      <div className="absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-gradient-to-l from-transparent via-gold/40 to-transparent transition-transform duration-700 group-hover:scale-x-100 z-20" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gold/[0.08] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-32 w-32 rounded-full bg-gold/[0.06] blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100 z-10" />

      {/* Image — adapts to natural shape, no cropping, no empty borders */}
      <div className="relative w-full sm:w-[50%] lg:w-[45%] flex-shrink-0 overflow-hidden bg-[#15120e]">
        {hasImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.name}
              width={600}
              height={450}
              className="w-full h-auto object-cover transition-transform duration-[1.2s] group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, 500px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#15120e]/40 via-transparent to-white/[0.03]" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-[-18deg] group-hover:translate-x-[300%] transition-transform duration-[1.4s] ease-out" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo-timilia-original.jpg"
              alt=""
              fill
              className="object-contain p-8 opacity-15"
              sizes="400px"
            />
          </div>
        )}
      </div>

      {/* Content — right side on desktop, below on mobile */}
      <div className="relative flex-1 p-5 lg:p-7 flex flex-col justify-center" style={{ transform: "translateZ(25px)" }}>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h4 className="relative text-[#f5f0e8] text-lg lg:text-2xl font-light tracking-wide leading-tight group-hover:text-gold transition-colors duration-500">
            {item.name}
          </h4>
          {item.price !== undefined && (
            <span className="relative text-gold text-lg lg:text-2xl font-light whitespace-nowrap shrink-0">
              €{item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="relative text-[#f5f0e8]/55 text-sm font-light leading-relaxed group-hover:text-[#f5f0e8]/72 transition-colors duration-500">
            {item.description}
          </p>
        )}
        {item.note && (
          <p className="relative text-[#f5f0e8]/30 text-[10px] tracking-wide mt-3 font-light">
            {item.note}
          </p>
        )}
        <div className="relative mt-4 flex items-center gap-2 text-gold/0 group-hover:text-gold/60 transition-colors duration-500">
          <span className="text-[10px] tracking-[0.2em] uppercase font-light">Scopri</span>
          <span className="text-xs transition-transform duration-500 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </div>
  );
}
