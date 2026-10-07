"use client";

import React, { useState, useRef } from "react";
import { useUser } from "@/context";
import { useOnClickOutside } from "@/hooks";
import { useRouter } from "next/navigation";
import { HEADER_BUTTON_STYLES } from "@/constants";
import { IconUser, IconLogIn, IconLogOut, IconChevronDown } from "./Icons";

/**
 * Placeholder skeleton shown while checking autologin state
 */
export function AuthSkeleton({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-7 w-20 rounded bg-muted/40 animate-pulse border border-card-border ${className}`}
      aria-hidden="true"
    />
  );
}

interface SignInButtonProps {
  onClick: () => void;
  className?: string;
}

/**
 * Trigger button to open the authentication modal
 */
export function SignInButton({ onClick, className = "" }: SignInButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${HEADER_BUTTON_STYLES} ${className}`.trim()}
    >
      <IconLogIn className="w-3.5 h-3.5" />
      <span>Sign In</span>
    </button>
  );
}

interface UserAccountMenuProps {
  email: string;
  onLogout: () => void;
  className?: string;
}

/**
 * Dropdown menu for authenticated users
 */
export function UserAccountMenu({
  email,
  onLogout,
  className = "",
}: UserAccountMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setIsOpen(false), isOpen);

  return (
    <div
      ref={menuRef}
      className={`relative inline-block text-left ${className}`.trim()}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label="User account menu"
        className={HEADER_BUTTON_STYLES}
      >
        <IconUser className="w-3.5 h-3.5 text-current" />
        <span className="max-w-[120px] truncate hidden sm:inline">
          {email}
        </span>
        <IconChevronDown
          className={`w-3.5 h-3.5 text-current/80 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-52 rounded-md border border-card-border bg-card/95 backdrop-blur-md p-1.5 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-2 border-b border-card-border mb-1">
            <p className="text-[11px] text-muted-foreground font-medium">
              Signed in as
            </p>
            <p className="text-xs font-bold text-foreground truncate">
              {email}
            </p>
          </div>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-500/15 hover:text-red-600 dark:hover:text-red-300 hover:border-red-500/30 hover:shadow-[0_0_14px_rgba(239,68,68,0.45)] hover:brightness-110 border border-transparent active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <IconLogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * User button component that orchestrates user state (skeleton, sign in, or account menu)
 * and controls authentication modal visibility.
 */
export function UserButton({ className = "" }: { className?: string }) {
  const { user, isAuthenticated, isLoading, logout } = useUser();
  const router = useRouter();

  return (
    <div className={className}>
      {isLoading ? (
        <AuthSkeleton />
      ) : isAuthenticated && user ? (
        <UserAccountMenu email={user.email} onLogout={logout} />
      ) : (
        <SignInButton onClick={() => router.push('/login')} />
      )}
    </div>
  );
}
