"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/context";
import {
  AUTH_STRINGS,
  AUTH_INPUT_STYLES,
  AUTH_SUBMIT_BUTTON_STYLES,
  AUTH_GOOGLE_BUTTON_STYLES,
  AUTH_CARD_STYLES,
} from "@/constants";
import { IconGoogle } from "@/components/ui";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !confirmPassword) {
      setError(AUTH_STRINGS.ERRORS.FILL_ALL_FIELDS);
      return;
    }

    if (password !== confirmPassword) {
      setError(AUTH_STRINGS.ERRORS.PASSWORDS_DONT_MATCH);
      return;
    }

    if (password.length < 8) {
      setError(AUTH_STRINGS.ERRORS.PASSWORD_MIN_LENGTH);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await register({ email, password });
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/");
        }
        return;
      }
      setError(result.error || AUTH_STRINGS.ERRORS.REGISTER_FAILED);
    } catch {
      setError(AUTH_STRINGS.ERRORS.UNEXPECTED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    alert(AUTH_STRINGS.OAUTH.GOOGLE_NOT_IMPLEMENTED);
  };

  return (
    <div className="w-[400px] max-w-full mx-auto">
      <div className="text-center mb-8">
        <Link href="/" className="inline-block transition-opacity hover:opacity-80">
          <h1 className="text-2xl font-light text-foreground flex items-center justify-center gap-2 flex-wrap">
            {AUTH_STRINGS.BRAND.SIGN_UP_HEADING}{" "}
            <span className="font-black tracking-wider text-foreground">
              ARMOR<span className="text-primary">NODE</span>
            </span>
          </h1>
        </Link>
      </div>

      <div className={AUTH_CARD_STYLES}>
        {error && (
          <div
            role="alert"
            className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-start gap-2.5"
          >
            <span className="leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="auth-email-input"
              className="block text-sm font-semibold text-foreground mb-1.5"
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
              className={AUTH_INPUT_STYLES}
            />
          </div>

          <div>
            <label
              htmlFor="auth-password-input"
              className="block text-sm font-semibold text-foreground mb-1.5"
            >
              {AUTH_STRINGS.LABELS.PASSWORD}
            </label>
            <input
              id="auth-password-input"
              type="password"
              required
              autoComplete="new-password"
              placeholder={AUTH_STRINGS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className={AUTH_INPUT_STYLES}
            />
          </div>

          <div>
            <label
              htmlFor="auth-confirm-password-input"
              className="block text-sm font-semibold text-foreground mb-1.5"
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
              className={AUTH_INPUT_STYLES}
            />
            <p className="mt-2 text-[11px] text-muted-foreground leading-relaxed">
              {AUTH_STRINGS.HINTS.PASSWORD_REQUIREMENTS}
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={AUTH_SUBMIT_BUTTON_STYLES}
          >
            {isSubmitting
              ? AUTH_STRINGS.BUTTONS.CREATING_ACCOUNT
              : AUTH_STRINGS.BUTTONS.SUBMIT_REGISTER}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-card-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground text-xs font-semibold uppercase tracking-widest">
              {AUTH_STRINGS.OAUTH.DIVIDER_OR}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={AUTH_GOOGLE_BUTTON_STYLES}
        >
          <IconGoogle className="w-4 h-4" />
          {AUTH_STRINGS.OAUTH.GOOGLE_CONTINUE}
        </button>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm border border-card-border bg-card/50 rounded-md p-4 text-foreground shadow-sm">
          {AUTH_STRINGS.LINKS.ALREADY_HAVE_ACCOUNT}{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold"
          >
            {AUTH_STRINGS.LINKS.SIGN_IN}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

