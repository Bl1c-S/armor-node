"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  AuthUser,
  LoginCredentials,
  RegisterCredentials,
  UserContextType,
} from "@/types/auth";
import { authApi, AuthApiError } from "@/services/authApi";
import {
  getStoredTokens,
  setStoredTokens,
  clearStoredTokens,
  isTokenExpired,
  extractUserFromToken,
} from "@/utils/token";

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const isAuthenticated = useMemo(() => {
    return !!user && !!accessToken && !isTokenExpired(accessToken);
  }, [user, accessToken]);

  /**
   * Logs out the user and clears all credentials.
   */
  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    clearStoredTokens();
  }, []);

  /**
   * Refreshes the active session using the stored or state refresh token.
   */
  const refreshSession = useCallback(async (): Promise<boolean> => {
    const currentRefresh = refreshToken || getStoredTokens().refreshToken;
    if (!currentRefresh || isTokenExpired(currentRefresh)) {
      logout();
      return false;
    }

    try {
      const response = await authApi.refresh(currentRefresh);
      const newAccess = response.tokens.accessToken.value;
      const newRefresh = response.tokens.refreshToken.value;
      const newUser =
        extractUserFromToken(newAccess, response.tokens.accessToken.userId) ||
        user;

      setAccessToken(newAccess);
      setRefreshToken(newRefresh);
      setUser(newUser);
      setStoredTokens(newAccess, newRefresh, newUser);
      return true;
    } catch (error) {
      console.warn("Failed to refresh session:", error);
      logout();
      return false;
    }
  }, [refreshToken, user, logout]);

  /**
   * Logs in a user with credentials and persists tokens.
   */
  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await authApi.login(credentials);
        const newAccess = response.tokens.accessToken.value;
        const newRefresh = response.tokens.refreshToken.value;
        const userId = response.tokens.accessToken.userId;

        const resolvedUser = extractUserFromToken(newAccess, userId) || {
          id: userId,
          email: credentials.email,
          userName: credentials.email,
        };

        setAccessToken(newAccess);
        setRefreshToken(newRefresh);
        setUser(resolvedUser);
        setStoredTokens(newAccess, newRefresh, resolvedUser);

        return { success: true };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Login failed. Please check your credentials.";
        return { success: false, error: message };
      }
    },
    []
  );

  /**
   * Registers a new user and automatically logs them in upon success.
   */
  const register = useCallback(
    async (
      credentials: RegisterCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        await authApi.register(credentials);

        // Attempt automatic login with newly registered credentials
        const loginResult = await login(credentials);
        if (loginResult.success) {
          return { success: true };
        }

        return {
          success: true,
          error:
            "Registration was successful, but automatic sign-in failed. Please log in manually.",
        };
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Registration failed. Please try again.";
        return { success: false, error: message };
      }
    },
    [login]
  );

  /**
   * Autologin logic on initial mount using access and refresh tokens.
   */
  useEffect(() => {
    let isSubscribed = true;

    async function initializeAuth() {
      try {
        const {
          accessToken: storedAccess,
          refreshToken: storedRefresh,
          storedUser,
        } = getStoredTokens();

        if (!storedAccess && !storedRefresh) {
          if (isSubscribed) setIsLoading(false);
          return;
        }

        // 1. Access token is present and still valid
        if (storedAccess && !isTokenExpired(storedAccess)) {
          const userFromToken = extractUserFromToken(
            storedAccess,
            storedUser?.id
          );
          const activeUser = storedUser || userFromToken;

          if (isSubscribed) {
            setAccessToken(storedAccess);
            setRefreshToken(storedRefresh);
            setUser(activeUser);
            setIsLoading(false);
          }

          // Background verification with /me if available
          try {
            const freshUser = await authApi.getMe(storedAccess);
            if (isSubscribed && freshUser) {
              setUser(freshUser);
              setStoredTokens(storedAccess, storedRefresh || "", freshUser);
            }
          } catch (err: unknown) {
            // Keep local active session if backend verification is temporarily unreachable
            // But log out if it's an authorization/authentication error
            if (
              err instanceof AuthApiError &&
              (err.statusCode === 401 || err.statusCode === 403)
            ) {
              clearStoredTokens();
              if (isSubscribed) {
                setUser(null);
                setAccessToken(null);
                setRefreshToken(null);
              }
            }
          }
          return;
        }

        // 2. Access token is expired, but refresh token is available and valid
        if (storedRefresh && !isTokenExpired(storedRefresh)) {
          try {
            const response = await authApi.refresh(storedRefresh);
            const newAccess = response.tokens.accessToken.value;
            const newRefresh = response.tokens.refreshToken.value;
            const newUser =
              extractUserFromToken(
                newAccess,
                response.tokens.accessToken.userId
              ) || storedUser;

            if (isSubscribed) {
              setAccessToken(newAccess);
              setRefreshToken(newRefresh);
              setUser(newUser);
              setStoredTokens(newAccess, newRefresh, newUser);
            }
          } catch (err) {
            console.warn("Autologin refresh failed:", err);
            clearStoredTokens();
            if (isSubscribed) {
              setUser(null);
              setAccessToken(null);
              setRefreshToken(null);
            }
          }
        } else {
          // Both tokens are expired or invalid
          clearStoredTokens();
          if (isSubscribed) {
            setUser(null);
            setAccessToken(null);
            setRefreshToken(null);
          }
        }
      } finally {
        if (isSubscribed) {
          setIsLoading(false);
        }
      }
    }

    initializeAuth();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const value = useMemo<UserContextType>(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    }),
    [
      user,
      accessToken,
      refreshToken,
      isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      refreshSession,
    ]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
