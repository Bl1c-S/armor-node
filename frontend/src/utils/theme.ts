import { getCookie } from "./cookies";
import {
  ThemeMode,
  THEMES,
  THEME_COOKIE_NAME,
  THEME_CHANGE_EVENT,
  DEFAULT_THEME,
} from "@/types/theme";

/**
 * Resolves the CSS class applied to <html> during SSR based on stored theme cookie
 */
export function resolveThemeClass(cookieTheme?: string): string {
  if (cookieTheme === THEMES.DARK) return THEMES.DARK;
  if (cookieTheme === THEMES.LIGHT) return THEMES.LIGHT;
  return "";
}

/**
 * Detects whether system preferences indicate dark mode
 */
export function getSystemTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Retrieves the currently saved theme from cookies or localStorage
 */
export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return DEFAULT_THEME;
  try {
    const fromCookie = getCookie(THEME_COOKIE_NAME);
    if (
      fromCookie === THEMES.LIGHT ||
      fromCookie === THEMES.DARK ||
      fromCookie === THEMES.SYSTEM
    ) {
      return fromCookie;
    }
    const fromStorage = localStorage.getItem(THEME_COOKIE_NAME);
    if (
      fromStorage === THEMES.LIGHT ||
      fromStorage === THEMES.DARK ||
      fromStorage === THEMES.SYSTEM
    ) {
      return fromStorage;
    }
  } catch {
    // Ignore storage/cookie access errors
  }
  return DEFAULT_THEME;
}

/**
 * Subscribes to storage and custom theme change events
 */
export function subscribeTheme(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(THEME_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
  };
}

/**
 * Applies the effective theme class to the document root element
 */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove(THEMES.LIGHT, THEMES.DARK);
  const effectiveTheme = mode === THEMES.SYSTEM ? getSystemTheme() : mode;
  root.classList.add(effectiveTheme);
}
