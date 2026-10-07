import { AuthUser, JwtPayload } from "@/types/auth";
import { getCookie, setCookie, removeCookie } from "./cookies";

export const ACCESS_TOKEN_KEY = "armor_access_token";
export const REFRESH_TOKEN_KEY = "armor_refresh_token";
export const USER_STORAGE_KEY = "armor_user";

/**
 * Safely decodes the payload of a JWT token without external dependencies.
 */
export function parseJwt(token: string): JwtPayload | null {
  if (!token || typeof token !== "string") return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch {
    return null;
  }
}

/**
 * Checks whether a given JWT token is expired or within the expiry buffer (default: 15 seconds).
 */
export function isTokenExpired(token: string | null | undefined, bufferSeconds = 15): boolean {
  if (!token) return true;

  const payload = parseJwt(token);
  if (!payload || !payload.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp <= currentTime + bufferSeconds;
}

/**
 * Extracts AuthUser representation from token claims.
 */
export function extractUserFromToken(token: string, defaultId?: string): AuthUser | null {
  const payload = parseJwt(token);
  if (!payload) return null;

  const email =
    (payload.unique_name as string) ||
    (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] as string) ||
    (payload.name as string) ||
    "";

  const id = defaultId || (payload.sub as string) || "";

  if (!email && !id) return null;

  return {
    id,
    email,
    userName: email,
  };
}

/**
 * Retrieves access and refresh tokens from localStorage (with cookie fallback).
 */
export function getStoredTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
  storedUser: AuthUser | null;
} {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, storedUser: null };
  }

  try {
    const accessToken =
      localStorage.getItem(ACCESS_TOKEN_KEY) || getCookie(ACCESS_TOKEN_KEY);
    const refreshToken =
      localStorage.getItem(REFRESH_TOKEN_KEY) || getCookie(REFRESH_TOKEN_KEY);

    let storedUser: AuthUser | null = null;
    const userJson = localStorage.getItem(USER_STORAGE_KEY);
    if (userJson) {
      storedUser = JSON.parse(userJson) as AuthUser;
    }

    return { accessToken, refreshToken, storedUser };
  } catch {
    return { accessToken: null, refreshToken: null, storedUser: null };
  }
}

/**
 * Persists access and refresh tokens across localStorage and cookies.
 */
export function setStoredTokens(
  accessToken: string,
  refreshToken: string,
  user?: AuthUser | null
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Set cookies for potential SSR synchronization
    setCookie(ACCESS_TOKEN_KEY, accessToken, 1); // 1 day
    setCookie(REFRESH_TOKEN_KEY, refreshToken, 7); // 7 days

    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  } catch {
    // Ignore storage quota/permission errors
  }
}

/**
 * Clears stored authentication credentials.
 */
export function clearStoredTokens(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);

    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
  } catch {
    // Ignore errors
  }
}
