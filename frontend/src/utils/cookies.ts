/**
 * Cookie helper utilities for browser client
 */

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)")
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function getSecureCookieFlag(): string {
  if (
    typeof window !== "undefined" &&
    (window.location.protocol === "https:" || window.isSecureContext)
  ) {
    return "; Secure";
  }
  return "";
}

export function setCookie(name: string, value: string, days = 90): void {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  const secureFlag = getSecureCookieFlag();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax${secureFlag}`;
}

export function removeCookie(name: string): void {
  if (typeof document === "undefined") return;
  const secureFlag = getSecureCookieFlag();
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${secureFlag}`;
}

