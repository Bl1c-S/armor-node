/**
 * Shared styling for all interactive header buttons:
 * - Language Toggle
 * - Theme Toggle
 * - User Account Menu
 * - Sign In Button
 */
export const HEADER_BUTTON_STYLES =
  "flex items-center gap-2 px-3 py-1.5 rounded text-xs font-semibold border border-card-border bg-card hover:bg-muted hover:border-primary text-foreground transition-all duration-150 shadow-sm";

/**
 * Shared styling for authentication inputs
 */
export const AUTH_INPUT_STYLES =
  "w-full px-3 py-2 text-sm rounded-md border border-card-border bg-background/50 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-150";

/**
 * Shared styling for primary authentication submit buttons
 */
export const AUTH_SUBMIT_BUTTON_STYLES =
  "w-full py-2.5 mt-2 px-4 rounded-md font-bold text-sm bg-primary text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

/**
 * Shared styling for Google OAuth secondary button
 */
export const AUTH_GOOGLE_BUTTON_STYLES =
  "w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-md font-semibold text-sm bg-background border border-card-border hover:bg-muted text-foreground transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/40 active:scale-[0.98] shadow-sm";

/**
 * Shared styling for auth container card
 */
export const AUTH_CARD_STYLES =
  "rounded-xl border border-card-border bg-card p-6 shadow-sm";

