export const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
} as const;

export type ThemeMode = (typeof THEMES)[keyof typeof THEMES];

export const THEME_COOKIE_NAME = "armor_theme";
export const THEME_CHANGE_EVENT = "armor-theme-change";
export const DEFAULT_THEME: ThemeMode = THEMES.SYSTEM;
