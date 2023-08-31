export const FALLBACK_LOCALE = "en-US" as const;

export const SUPPORTED_LOCALES = [FALLBACK_LOCALE] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];
