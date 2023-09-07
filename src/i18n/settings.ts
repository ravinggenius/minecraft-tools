export const SUPPORTED_LOCALES = ["en-US"] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const FALLBACK_LOCALE = SUPPORTED_LOCALES[0];

export type Translation = Record<string, string>;
