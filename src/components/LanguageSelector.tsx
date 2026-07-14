"use client";

import { useState, useEffect, useRef } from "react";

const languages = [
  { code: "it", label: "Italiano", flag: "🇮🇹", svg: "it" },
  { code: "en", label: "English", flag: "🇬🇧", svg: "gb" },
  { code: "fr", label: "Français", flag: "🇫🇷", svg: "fr" },
  { code: "es", label: "Español", flag: "🇪🇸", svg: "es" },
  { code: "de", label: "Deutsch", flag: "🇩🇪", svg: "de" },
  { code: "ja", label: "日本語", flag: "🇯🇵", svg: "jp" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳", svg: "cn" },
  { code: "ar", label: "العربية", flag: "🇸🇦", svg: "sa" },
  { code: "ru", label: "Русский", flag: "🇷🇺", svg: "ru" },
  { code: "pt", label: "Português", flag: "🇵🇹", svg: "pt" },
];

function FlagIcon({ code, size = 18 }: { code: string; size?: number }) {
  const w = size;
  const h = Math.round(size * 0.75);
  return (
    <img
      src={`https://flagcdn.com/w40/${code}.png`}
      alt={code}
      width={w}
      height={h}
      loading="lazy"
      style={{
        width: `${w}px`,
        height: `${h}px`,
        objectFit: "cover",
        display: "inline-block",
        borderRadius: "2px",
        flexShrink: 0,
      }}
    />
  );
}

function setGoogTransCookie(lang: string) {
  const host = window.location.hostname;
  const value = lang === "it" ? "" : `/it/${lang}`;
  // Set cookie for domain and subdomains
  document.cookie = `googtrans=${value};path=/;domain=.${host};max-age=31536000`;
  document.cookie = `googtrans=${value};path=/;max-age=31536000`;
}

function getGoogTransCookie(): string {
  const match = document.cookie.match(/googtrans=\/it\/([a-zA-Z-]+)/);
  return match ? match[1] : "it";
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("it");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("timilia_lang");
    const cookieLang = getGoogTransCookie();
    const lang = saved || cookieLang || "it";
    setCurrentLang(lang);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectLanguage = (code: string) => {
    setCurrentLang(code);
    localStorage.setItem("timilia_lang", code);
    setOpen(false);
    setGoogTransCookie(code);
    // Reload page so Google Translate picks up the cookie
    window.location.reload();
  };

  const current = languages.find((l) => l.code === currentLang) ?? languages[0];

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-white/15 bg-white/[0.06] hover:border-gold/50 hover:bg-gold/10 transition-all"
        aria-label="Select language"
      >
        <FlagIcon code={current.svg} size={18} />
        <span className="text-[10px] tracking-wide font-medium text-foreground/80">{current.code.toUpperCase().replace("ZH-CN", "ZH")}</span>
        <svg
          className={`w-3 h-3 text-foreground/40 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90vw] max-w-[320px] max-h-[50vh] overflow-y-auto rounded-xl border border-gold/20 bg-white/5 backdrop-blur-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] py-1.5 z-[200] sm:absolute sm:right-0 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:top-full sm:mt-2 sm:w-44 sm:max-h-[60vh] sm:z-[100] sm:bg-white/5 sm:backdrop-blur-[20px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => selectLanguage(lang.code)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs transition-colors ${
                currentLang === lang.code
                  ? "text-gold bg-gold/8"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/[0.04]"
              }`}
            >
              <FlagIcon code={lang.svg} size={20} />
              <span className="font-light tracking-wide">{lang.label}</span>
              {currentLang === lang.code && (
                <svg className="w-3 h-3 ml-auto text-gold" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
