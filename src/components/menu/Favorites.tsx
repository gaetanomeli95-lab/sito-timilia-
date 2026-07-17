"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart } from "lucide-react";
import { supabase } from "@/lib/supabase-client";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkAuthAndLoad() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;

      if (!session) {
        setIsLoggedIn(false);
        setFavorites([]);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const res = await fetch("/api/customers/favorites", {
          headers: { authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (mounted) setFavorites(data.favorites || []);
        }
      } catch {
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkAuthAndLoad();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      checkAuthAndLoad();
    });

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const toggleFavorite = useCallback(
    async (itemName: string) => {
      if (!isLoggedIn) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      setFavorites((prev) => {
        const isFav = prev.includes(itemName);
        const next = isFav
          ? prev.filter((n) => n !== itemName)
          : [...prev, itemName];

        fetch("/api/customers/favorites", {
          method: "PATCH",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            itemName,
            action: isFav ? "remove" : "add",
          }),
        }).catch(() => {});

        return next;
      });
    },
    [isLoggedIn]
  );

  const isFavorite = useCallback(
    (itemName: string) => favorites.includes(itemName),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite, isLoggedIn, loading };
}

export function FavoriteButton({
  itemName,
  isFavorite,
  onToggle,
  isLoggedIn,
  size = 18,
  onRequireLogin,
}: {
  itemName: string;
  isFavorite: boolean;
  onToggle: (name: string) => void;
  isLoggedIn: boolean;
  size?: number;
  onRequireLogin?: () => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      onRequireLogin?.();
      return;
    }
    onToggle(itemName);
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
        isFavorite && isLoggedIn
          ? "text-gold bg-gold/10 border border-gold/30"
          : "text-foreground/30 hover:text-gold border border-white/[0.08] bg-white/[0.03]"
      }`}
      aria-label={isFavorite && isLoggedIn ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
      title={!isLoggedIn ? "Accedi per salvare i preferiti" : undefined}
    >
      <Heart
        size={size}
        strokeWidth={1.5}
        className={isFavorite && isLoggedIn ? "fill-gold" : ""}
      />
    </button>
  );
}
