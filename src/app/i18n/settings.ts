export const FALLBACK_LOCALE = "en-US" as const;

export const SUPPORTED_LOCALES = [FALLBACK_LOCALE] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const cookieName = "_locale";

export const defaultNS = "translation";

export const getOptions = (
	lng: SupportedLocale = FALLBACK_LOCALE,
	ns: string | Array<string> = defaultNS
) => ({
	supportedLngs: SUPPORTED_LOCALES,
	fallbackLng: FALLBACK_LOCALE,
	lng,
	fallbackNS: defaultNS,
	defaultNS,
	ns
});
