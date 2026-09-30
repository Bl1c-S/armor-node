import React from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Header() {
  return (
    <header className="w-full border-b border-card-border bg-card/60 backdrop-blur-md">
      <div className="page-container h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-wider text-foreground">
            ARMOR<span className="text-primary">NODE</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
