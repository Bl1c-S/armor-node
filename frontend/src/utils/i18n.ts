import { getCookie } from "./cookies";
import { LanguageCode, HtmlLangCode } from "@/types/i18n";
import { LG_COOKIE, LG_EVENT, LG_DEFAULT, LG_MAP } from "@/types/i18n";
import { EN, RU, UA, H_UA } from "@/types/i18n";

/**
 * Resolves the HTML lang attribute during SSR from cookies or Accept-Language header
 */
export function resolveServerLanguage(
  cookieLang?: string,
  acceptLangHeader?: string | null,
): HtmlLangCode {
  if (cookieLang === UA) return H_UA;
  if (cookieLang === RU) return RU;
  if (cookieLang === EN) return EN;

  if (acceptLangHeader) {
    const lower = acceptLangHeader.toLowerCase();

    if (lower.includes(H_UA) || lower.includes(UA)) return H_UA;
    if (lower.includes(RU)) return RU;
  }

  return EN;
}

/**
 * Automatically detects preferred language from browser settings in client
 */
export function detectBrowserLanguage(): LanguageCode {
  if (typeof navigator === "undefined") return LG_DEFAULT;
  const languages = navigator.languages || [navigator.language];
  for (const lang of languages) {
    if (!lang) continue;
    const lower = lang.toLowerCase();
    if (lower.startsWith(H_UA) || lower.startsWith(UA)) {
      return UA;
    }
    if (lower.startsWith(RU)) {
      return RU;
    }
    if (lower.startsWith(EN)) {
      return EN;
    }
  }
  return LG_DEFAULT;
}

/**
 * Retrieves the currently saved language from cookies, localStorage, or browser detection
 */
export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return LG_DEFAULT;
  try {
    console.log("Getting stored language from cookies or localStorage:");
    const fromCookie = getCookie(LG_COOKIE);
    if (fromCookie === EN || fromCookie === RU || fromCookie === UA) {
      console.debug("fromCookie", fromCookie);
      return fromCookie;
    }
    const fromStorage = localStorage.getItem(LG_COOKIE);
    if (fromStorage === EN || fromStorage === RU || fromStorage === UA) {
      console.debug("fromStorage", fromStorage);
      return fromStorage;
    }
  } catch {
    console.error("Failed to read language cookie or localStorage");
  }
  return detectBrowserLanguage();
}

/**
 * Subscribes to storage and custom language change events
 */
export function subscribeLanguage(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(LG_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(LG_EVENT, callback);
  };
}

/**
 * Applies the selected language to the document root element
 */
export function applyLanguage(code: LanguageCode): void {
  if (typeof document === "undefined") return;
  document.documentElement.lang = LG_MAP[code] || EN;
}
