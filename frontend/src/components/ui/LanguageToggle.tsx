"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useSyncExternalStore,
} from "react";
import { useOnClickOutside } from "@/hooks";

import {
  getStoredLanguage,
  detectBrowserLanguage,
  subscribeLanguage,
  applyLanguage,
} from "@/utils/i18n";

import { setCookie } from "@/utils/cookies";
import { LanguageCode, LanguageOption } from "@/types/i18n";
import { LG_COOKIE, LG_EVENT, LG_DEFAULT, LG_SUPPORTED } from "@/types/i18n";
import { EN, RU, UA, H_UA, LANGUAGES, LG_HTML } from "@/types/i18n";

// Re-export for backward compatibility
export type { LanguageCode, LanguageOption };

export {
  EN,
  RU,
  UA,
  H_UA,
  LANGUAGES,
  LG_HTML,
  LG_SUPPORTED,
  LG_EVENT,
  detectBrowserLanguage,
  getStoredLanguage,
  applyLanguage,
};

export function LanguageToggle({ className = "" }: { className?: string }) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const currentLanguage = useSyncExternalStore(
    subscribeLanguage,
    getStoredLanguage,
    () => LG_DEFAULT,
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply language to <html lang="..."> on mount / change
  useEffect(() => {
    applyLanguage(currentLanguage);
  }, [currentLanguage]);

  // Close on outside click or Escape key
  useOnClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleSelectLanguage = (code: LanguageCode) => {
    try {
      setCookie(LG_COOKIE, code);
      localStorage.setItem(LG_COOKIE, code);
    } catch {
      // Ignore storage access errors
    }
    applyLanguage(code);
    window.dispatchEvent(new Event(LG_EVENT));
    setIsOpen(false);
  };

  if (!isMounted) {
    return (
      <div
        className={`h-3 min-w-3 px-3 py-2 rounded-xl border border-card-border bg-card/50 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const selected =
    LG_SUPPORTED.find((l) => l.code === currentLanguage) || LG_SUPPORTED[0];

  return (
    <div
      className={`relative inline-block text-left ${className}`}
      ref={dropdownRef}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Language options menu"
        className="flex items-center gap-2 h-6 px-3 py-2 rounded-xl border border-card-border bg-card hover:border-primary text-foreground transition-all shadow-sm active:scale-95"
      >
        {/* Globe icon */}
        <svg
          className="w-4 h-4 text-primary"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>

        <span className="text-xs font-semibold uppercase">
          {selected.short}
        </span>

        {/* Dropdown Chevron */}
        <svg
          className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-40 rounded-2xl border border-card-border bg-card p-1.5 shadow-xl shadow-black/15 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {LG_SUPPORTED.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  isSelected
                    ? "bg-primary text-primary-foreground font-bold shadow-sm"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{lang.label}</span>
                </div>
                {isSelected ? (
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase">
                    {lang.short}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
