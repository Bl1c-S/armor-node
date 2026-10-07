"use client";

import React, { useEffect, useState, useRef, useSyncExternalStore } from "react";
import { useOnClickOutside } from "@/hooks";
import { HEADER_BUTTON_STYLES } from "@/constants";
import { setCookie } from "@/utils/cookies";
import {
  ThemeMode,
  THEMES,
  THEME_COOKIE_NAME,
  THEME_CHANGE_EVENT,
  DEFAULT_THEME,
} from "@/types/theme";
import {
  getStoredTheme,
  getSystemTheme,
  subscribeTheme,
  applyTheme,
} from "@/utils/theme";
import { IconSun, IconMoon, IconSystem, IconCheck, IconChevronDown } from "./Icons";

// Re-export for backward compatibility
export type { ThemeMode };
export const THEME_KEY = THEME_COOKIE_NAME;
export { THEMES, THEME_CHANGE_EVENT, getSystemTheme, getStoredTheme, applyTheme };

export function ThemeToggle({ className = "" }: { className?: string }) {
  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const theme = useSyncExternalStore(
    subscribeTheme,
    getStoredTheme,
    () => DEFAULT_THEME
  );

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Apply theme & listen to system OS dark/light mode changes when mode is "system"
  useEffect(() => {
    applyTheme(theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (getStoredTheme() === THEMES.SYSTEM) {
        applyTheme(THEMES.SYSTEM);
      }
    };

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme]);

  // Close on outside click or Escape key
  useOnClickOutside(dropdownRef, () => setIsOpen(false), isOpen);

  const handleSelectTheme = (mode: ThemeMode) => {
    try {
      setCookie(THEME_COOKIE_NAME, mode);
      localStorage.setItem(THEME_COOKIE_NAME, mode);
    } catch {
      // Ignore storage access errors
    }
    applyTheme(mode);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
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

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="Theme options menu"
        className={HEADER_BUTTON_STYLES}
      >
        {/* Dynamic active icon */}
        {theme === THEMES.LIGHT && <IconSun className="w-3.5 h-3.5 text-current" />}
        {theme === THEMES.SYSTEM && <IconSystem className="w-3.5 h-3.5 text-current" />}
        {theme === THEMES.DARK && <IconMoon className="w-3.5 h-3.5 text-current" />}

        <span className="text-xs font-semibold capitalize">{theme}</span>

        {/* Dropdown Chevron */}
        <IconChevronDown
          className={`w-3.5 h-3.5 text-current/80 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-36 rounded-md border border-card-border bg-card p-1 shadow-xl shadow-black/15 z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          {/* Light Theme Option */}
          <button
            type="button"
            role="menuitemradio"
            aria-checked={theme === THEMES.LIGHT}
            onClick={() => handleSelectTheme(THEMES.LIGHT)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
              theme === THEMES.LIGHT
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <IconSun className="w-3.5 h-3.5" />
              <span>Light</span>
            </div>
            {theme === THEMES.LIGHT && <IconCheck className="w-3.5 h-3.5" />}
          </button>

          {/* System Theme Option */}
          <button
            type="button"
            role="menuitemradio"
            aria-checked={theme === THEMES.SYSTEM}
            onClick={() => handleSelectTheme(THEMES.SYSTEM)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
              theme === THEMES.SYSTEM
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <IconSystem className="w-3.5 h-3.5" />
              <span>System</span>
            </div>
            {theme === THEMES.SYSTEM && <IconCheck className="w-3.5 h-3.5" />}
          </button>

          {/* Dark Theme Option */}
          <button
            type="button"
            role="menuitemradio"
            aria-checked={theme === THEMES.DARK}
            onClick={() => handleSelectTheme(THEMES.DARK)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-medium transition-colors ${
              theme === THEMES.DARK
                ? "bg-primary text-primary-foreground font-bold shadow-sm"
                : "text-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2">
              <IconMoon className="w-3.5 h-3.5" />
              <span>Dark</span>
            </div>
            {theme === THEMES.DARK && <IconCheck className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
}
