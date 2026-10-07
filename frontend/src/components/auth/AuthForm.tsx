"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@/context";
import { useOnClickOutside } from "@/hooks";
import { AUTH_STRINGS, AUTH_MODES, AuthMode } from "@/constants/auth";

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
}

export interface AuthFormProps {
  initialMode: AuthMode;
  onSuccess: () => void;
  onClose?: () => void;
  isModal?: boolean;
}

export function AuthForm({ initialMode, onSuccess, onClose, isModal = false }: AuthFormProps) {
  const { login, register } = useUser();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape (only if it's a modal)
  useOnClickOutside(modalRef, () => {
    if (isModal && onClose) onClose();
  }, isModal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(AUTH_STRINGS.ERRORS.FILL_ALL_FIELDS);
      return;
    }

    if (mode === AUTH_MODES.REGISTER) {
      if (password !== confirmPassword) {
        setError(AUTH_STRINGS.ERRORS.PASSWORDS_DONT_MATCH);
        return;
      }
      if (password.length < 8) {
        setError(AUTH_STRINGS.ERRORS.PASSWORD_MIN_LENGTH);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      if (mode === AUTH_MODES.LOGIN) {
        const result = await login({ email, password });
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || AUTH_STRINGS.ERRORS.LOGIN_FAILED);
        }
      } else {
        const result = await register({ email, password });
        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || AUTH_STRINGS.ERRORS.REGISTER_FAILED);
        }
      }
    } catch {
      setError(AUTH_STRINGS.ERRORS.UNEXPECTED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoginMode = mode === AUTH_MODES.LOGIN;

  return (
    <div
      ref={modalRef}
      className="w-full max-w-md min-h-[500px] flex flex-col rounded-md border border-card-border bg-card backdrop-blur-2xl p-6 shadow-2xl transition-all"
    >
      {/* Header with Title and close button */}
      <div className="flex items-center justify-between pb-3">
        <h2
          id="auth-modal-title"
          className="text-lg font-bold tracking-tight text-foreground"
        >
          {isLoginMode ? AUTH_STRINGS.TITLES.LOGIN : AUTH_STRINGS.TITLES.REGISTER}
        </h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label={AUTH_STRINGS.BUTTONS.CLOSE_ARIA}
            className="w-7 h-7 rounded bg-muted/70 hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-all duration-150 active:scale-95"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Sign Switcher with Predictive Primary color and small border round */}
      <div className="flex mt-3 p-1 rounded-md bg-muted/60 border border-card-border/40">
        <button
          type="button"
          onClick={() => {
            setMode(AUTH_MODES.LOGIN);
            setError(null);
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all duration-150 ${
            isLoginMode
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {AUTH_STRINGS.TABS.LOGIN}
        </button>
        <button
          type="button"
          onClick={() => {
            setMode(AUTH_MODES.REGISTER);
            setError(null);
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded transition-all duration-150 ${
            !isLoginMode
              ? "bg-primary text-primary-foreground font-bold shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {AUTH_STRINGS.TABS.REGISTER}
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="mt-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium flex items-start gap-2.5"
        >
          <svg
            className="w-4 h-4 shrink-0 mt-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="leading-snug">{error}</span>
        </div>
      )}

      {/* Form with small rounded inputs */}
      <form onSubmit={handleSubmit} className="mt-4 flex-1 flex flex-col space-y-3.5">
        <div>
          <label
            htmlFor="auth-email-input"
            className="block text-xs font-semibold text-foreground mb-1 ml-0.5"
          >
            {AUTH_STRINGS.LABELS.EMAIL}
          </label>
          <input
            id="auth-email-input"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder={AUTH_STRINGS.PLACEHOLDERS.EMAIL}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2 text-sm rounded border border-card-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150"
          />
        </div>

        <div>
          <label
            htmlFor="auth-password-input"
            className="block text-xs font-semibold text-foreground mb-1 ml-0.5"
          >
            {AUTH_STRINGS.LABELS.PASSWORD}
          </label>
          <input
            id="auth-password-input"
            type="password"
            required
            autoComplete={isLoginMode ? "current-password" : "new-password"}
            placeholder={AUTH_STRINGS.PLACEHOLDERS.PASSWORD}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
            className="w-full px-3.5 py-2 text-sm rounded border border-card-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150"
          />
        </div>

        {!isLoginMode && (
          <>
            <div>
              <label
                htmlFor="auth-confirm-password-input"
                className="block text-xs font-semibold text-foreground mb-1 ml-0.5"
              >
                {AUTH_STRINGS.LABELS.CONFIRM_PASSWORD}
              </label>
              <input
                id="auth-confirm-password-input"
                type="password"
                required
                autoComplete="new-password"
                placeholder={AUTH_STRINGS.PLACEHOLDERS.PASSWORD}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2 text-sm rounded border border-card-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150"
              />
            </div>

            <div className="text-[11px] text-muted-foreground leading-relaxed bg-muted/40 p-2.5 rounded border border-card-border/60">
              {AUTH_STRINGS.HINTS.PASSWORD_REQUIREMENTS}
            </div>
          </>
        )}

        <div className="mt-auto pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-1.5 py-2.5 px-4 rounded font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/95 hover:shadow-[0_0_15px_var(--primary)] hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4 animate-spin text-current"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {AUTH_STRINGS.BUTTONS.PROCESSING}
              </span>
            ) : isLoginMode ? (
              AUTH_STRINGS.BUTTONS.SUBMIT_LOGIN
            ) : (
              AUTH_STRINGS.BUTTONS.SUBMIT_REGISTER
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = AUTH_MODES.LOGIN,
}: AuthModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="flex min-h-full items-center justify-center p-4 py-12"><AuthForm initialMode={defaultMode} onSuccess={onClose} onClose={onClose} isModal={true} /></div>
    </div>
  );
}
