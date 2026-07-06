"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronUp } from "lucide-react";
import { menuCategories, MenuItem } from "@/data/menuData";
import { previewImages, categoryDescriptions } from "@/data/menuMeta";
import ProductModal from "./ProductModal";
import CategoryRow from "./CategoryRow";
import LargeProductCard from "./LargeProductCard";

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
      <div className="relative z-10 mx-4 lg:mx-8 h-[130px] sm:h-[170px] lg:h-[215px] flex-shrink-0 overflow-hidden rounded-[1.6rem] border border-white/[0.08] shadow-[0_24px_90px_rgba(0,0,0,0.4)]" data-enter>
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
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-light tracking-wide text-[#f5f0e8]">
              {category?.title}
            </h2>
            <p className="text-[#f5f0e8]/45 text-[11px] lg:text-sm font-light leading-relaxed line-clamp-1 mt-1 max-w-[60vw] lg:max-w-md">
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
