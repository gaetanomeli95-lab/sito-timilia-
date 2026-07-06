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
  dolci: "/images/logo.png",
  bevande: "/images/logo.png",
  birre: "/images/logo.png",
  "birre-sg": "/images/logo.png",
  vini: "/images/logo.png",
  cocktail: "/images/logo.png",
  aggiunzioni: "/images/logo.png",
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
  const [selectedCat, setSelectedCat] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedCatTitle, setSelectedCatTitle] = useState("");

  const sceneRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);

  const displayIdx = hoveredIdx ?? selectedCat ?? 0;
  const category = menuCategories[displayIdx];
  const imageSrc = previewImages[category?.id] ?? "/images/logo.png";

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
    gsap.fromTo(
      el,
      { opacity: 0, scale: 1.04 },
      { opacity: 1, scale: 1, duration: 0.7, ease: "power2.out" }
    );
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
    <div ref={sceneRef} className="relative min-h-screen bg-background overflow-hidden flex flex-col">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      <header className="relative z-20 flex items-center justify-between px-5 lg:px-10 pt-5 pb-3" data-enter>
        <Link href="/" className="flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-[10px] tracking-[0.2em] uppercase font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Torna al sito</span>
        </Link>
        <span className="text-gold/60 text-[10px] tracking-[0.4em] uppercase font-medium">
          Timilia
        </span>
        <span className="text-foreground/30 text-[10px] tracking-[0.3em] uppercase font-light">
          Menu
        </span>
      </header>

      {/* Category banner strip — rectangular, horizontal */}
      <div className="relative z-10 w-full h-[140px] sm:h-[160px] lg:h-[200px] flex-shrink-0 overflow-hidden" data-enter>
        <div ref={bannerRef} className="absolute inset-0" style={{ willChange: "transform" }}>
          <Image
            src={imageSrc}
            alt={category?.title ?? ""}
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-background/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-background/20" />

        {/* Category title overlay on the banner */}
        <div className="absolute inset-0 flex items-center justify-between px-5 lg:px-10 z-10">
          <div>
            <span className="text-gold/50 text-[10px] tracking-[0.3em] uppercase font-medium block mb-1.5">
              {String(displayIdx + 1).padStart(2, "0")} — Categoria
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-light tracking-wide text-foreground">
              {category?.title}
            </h2>
            <p className="text-foreground/40 text-xs lg:text-sm font-light leading-relaxed line-clamp-1 mt-1 max-w-md">
              {categoryDescriptions[category?.id] ?? category?.subtitle}
            </p>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-gold/40 text-xs font-light">
              {category?.items.length} prodotti
            </span>
            <div className="h-[1px] w-12 bg-gold/20" />
          </div>
        </div>
      </div>

      {/* Mobile: horizontal scrollable category tabs */}
      <nav className="lg:hidden flex-shrink-0 px-5 py-3 overflow-x-auto scrollbar-hide border-b border-white/[0.04] z-10">
        <div className="flex gap-1.5">
          {menuCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(idx)}
              className={`px-3 py-1.5 rounded-full text-[11px] tracking-wide font-light whitespace-nowrap transition-all duration-400 ${
                displayIdx === idx
                  ? "bg-gold/10 text-gold border border-gold/20"
                  : "text-foreground/40 border border-transparent"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Main content area */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Desktop left: category list */}
        <nav className="hidden lg:flex lg:w-[22%] flex-shrink-0 px-6 py-6 flex-col justify-start overflow-y-auto scrollbar-hide">
          <div data-enter className="mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-[1px] w-8 bg-gold/30" />
              <span className="text-gold/40 text-[9px] tracking-[0.3em] uppercase">
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
                <h3 className="text-base lg:text-lg font-light text-gold/80 tracking-wide">
                  {expandedCategory.title}
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-gold/15 to-transparent" />
                <button
                  onClick={() => setSelectedCat(null)}
                  className="flex items-center gap-1 text-foreground/30 hover:text-gold text-[10px] tracking-[0.2em] uppercase transition-colors duration-400"
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
                <p className="text-foreground/30 text-sm font-light leading-relaxed">
                  Seleziona una categoria per visualizzare i prodotti
                </p>
                <div className="mt-4 flex justify-center">
                  <div className="h-[1px] w-16 bg-gold/15" />
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
      className="group relative flex items-center gap-3 py-2 px-3 rounded-md text-left transition-colors duration-500"
      style={{ willChange: "transform" }}
    >
      <span
        ref={glowRef}
        className="absolute inset-0 opacity-0 rounded-md pointer-events-none"
      />
      <span
        className={`text-[10px] font-light tabular-nums transition-colors duration-500 ${
          isActive ? "text-gold/50" : "text-foreground/20"
        }`}
      >
        {String(idx + 1).padStart(2, "0")}
      </span>
      <span
        className={`text-sm lg:text-base font-light tracking-wide transition-all duration-500 ${
          isActive
            ? "text-gold"
            : "text-foreground/50 group-hover:text-foreground/80"
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(ref.current, {
      rotateY: (x / rect.width) * 2,
      rotateX: -(y / rect.height) * 2,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
    });
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
  };

  const hasImage = !!item.image;

  return (
    <div
      ref={ref}
      data-product
      onClick={() => onOpen(item, catTitle)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group cursor-pointer relative overflow-hidden rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-gold/20 transition-colors duration-700 flex flex-col sm:flex-row"
      style={{ willChange: "transform", transformStyle: "preserve-3d" }}
    >
      {/* Image — large, left side on desktop, top on mobile */}
      <div className="relative w-full sm:w-[45%] lg:w-[40%] flex-shrink-0 aspect-[4/3] sm:aspect-auto sm:min-h-[220px] lg:min-h-[260px] overflow-hidden bg-[#111]">
        {hasImage ? (
          <>
            <Image
              src={item.image!}
              alt={item.name}
              fill
              className="object-contain transition-transform duration-[1.2s] group-hover:scale-[1.06]"
              sizes="(max-width: 640px) 100vw, 400px"
            />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
              <div className="absolute -inset-x-full top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent skew-x-[-18deg] group-hover:translate-x-[300%] transition-transform duration-[1.4s] ease-out" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt=""
              fill
              className="object-contain p-8 opacity-15"
              sizes="400px"
            />
          </div>
        )}
      </div>

      {/* Content — right side on desktop, below on mobile */}
      <div className="flex-1 p-5 lg:p-7 flex flex-col justify-center" style={{ transform: "translateZ(20px)" }}>
        <div className="flex justify-between items-start gap-3 mb-3">
          <h4 className="text-foreground text-base lg:text-lg font-light tracking-wide leading-tight group-hover:text-gold transition-colors duration-500">
            {item.name}
          </h4>
          {item.price !== undefined && (
            <span className="text-gold/80 text-base lg:text-lg font-light whitespace-nowrap shrink-0">
              €{item.price.toFixed(2)}
            </span>
          )}
        </div>
        {item.description && (
          <p className="text-foreground/45 text-sm font-light leading-relaxed group-hover:text-foreground/60 transition-colors duration-500">
            {item.description}
          </p>
        )}
        {item.note && (
          <p className="text-foreground/25 text-[10px] tracking-wide mt-3 font-light">
            {item.note}
          </p>
        )}
      </div>
    </div>
  );
}
