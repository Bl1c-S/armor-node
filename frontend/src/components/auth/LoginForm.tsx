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

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const { login } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError(AUTH_STRINGS.ERRORS.FILL_ALL_FIELDS);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ email, password });
      if (result.success) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/");
        }
        return;
      }
      setError(result.error || AUTH_STRINGS.ERRORS.LOGIN_FAILED);
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
            {AUTH_STRINGS.BRAND.SIGN_IN_HEADING}{" "}
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
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="auth-password-input"
                className="block text-sm font-semibold text-foreground"
              >
                {AUTH_STRINGS.LABELS.PASSWORD}
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-primary hover:underline"
              >
                {AUTH_STRINGS.LINKS.FORGOT_PASSWORD}
              </Link>
            </div>
            <input
              id="auth-password-input"
              type="password"
              required
              autoComplete="current-password"
              placeholder={AUTH_STRINGS.PLACEHOLDERS.PASSWORD}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isSubmitting}
              className={AUTH_INPUT_STYLES}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={AUTH_SUBMIT_BUTTON_STYLES}
          >
            {isSubmitting
              ? AUTH_STRINGS.BUTTONS.SIGNING_IN
              : AUTH_STRINGS.BUTTONS.SUBMIT_LOGIN}
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
          {AUTH_STRINGS.LINKS.NEW_TO_ARMORNODE}{" "}
          <Link
            href="/registration"
            className="text-primary hover:underline font-semibold"
          >
            {AUTH_STRINGS.LINKS.CREATE_ACCOUNT}
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

