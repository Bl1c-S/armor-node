export const EN = "en";
export const RU = "ru";
export const UA = "ua";
export const H_UA = "uk"; // HTML language code for Ukrainian (ISO 639-1)

export const LANGUAGES = {
  EN,
  RU,
  UA,
} as const;

export const LG_HTML = {
  EN,
  RU,
  UK: H_UA,
} as const;

export type LanguageCode = (typeof LANGUAGES)[keyof typeof LANGUAGES];
export type HtmlLangCode = (typeof LG_HTML)[keyof typeof LG_HTML];

export const LG_COOKIE = "armor_language";
export const LG_EVENT = "armor-language-change";
export const LG_DEFAULT: LanguageCode = EN;

export interface LanguageOption {
  code: LanguageCode;
  label: string;
  short: string;
}

export const LG_SUPPORTED: readonly LanguageOption[] = [
  { code: EN, label: "English", short: "EN" },
  { code: RU, label: "Русский", short: "RU" },
  { code: UA, label: "Українська", short: "UA" },
] as const;

export const LG_MAP: Record<LanguageCode, HtmlLangCode> = {
  [EN]: EN,
  [RU]: RU,
  [UA]: H_UA,
};
