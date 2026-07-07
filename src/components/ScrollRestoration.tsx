"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollRestoration() {
  const pathname = usePathname();
  const isBack = useRef(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const onPopState = () => {
      isBack.current = true;
    };

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = `scroll:${pathname}`;
    const saved = sessionStorage.getItem(storageKey);
    const wasBack = isBack.current;
    isBack.current = false;

    if (wasBack && saved !== null) {
      const pos = parseInt(saved, 10);
      if (pos > 0) {
        const tryRestore = (attempts = 0) => {
          if (document.body.scrollHeight >= pos || attempts >= 20) {
            window.scrollTo(0, pos);
          } else {
            requestAnimationFrame(() => tryRestore(attempts + 1));
          }
        };
        requestAnimationFrame(() => requestAnimationFrame(() => tryRestore()));
        return;
      }
    }

    sessionStorage.removeItem(storageKey);
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storageKey = `scroll:${pathname}`;

    const onScroll = () => {
      const y = window.scrollY;
      lastScrollY.current = y;
      if (y > 0) {
        sessionStorage.setItem(storageKey, String(y));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      const finalPos = lastScrollY.current || window.scrollY;
      if (finalPos > 0) {
        sessionStorage.setItem(storageKey, String(finalPos));
      }
    };
  }, [pathname]);

  return null;
}
