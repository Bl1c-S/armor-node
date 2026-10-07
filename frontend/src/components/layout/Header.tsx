"use client";

import React from "react";
import Link from "next/link";
import { ThemeToggle, LanguageToggle, UserButton } from "@/components/ui";

/**
 * Brand logo section in the header
 */
function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
      <span className="text-xl font-black tracking-wider text-foreground">
        ARMOR<span className="text-primary">NODE</span>
      </span>
    </Link>
  );
}

/**
 * Global Header component
 */
export function Header() {
  return (
    <header className="w-full border-b border-card-border bg-card/60 backdrop-blur-md">
      <div className="page-container h-16 flex items-center justify-between">
        <BrandLogo />

        <div className="flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <UserButton />
        </div>
      </div>
    </header>
  );
}

