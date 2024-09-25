import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { cookies, headers } from "next/headers";
import { availableLocales, mergeUserLocales } from "preferred-locale";
import { initReactI18next } from "react-i18next/initReactI18next";
import "server-only";

import {
	cookieName,
	FALLBACK_LOCALE,
	getOptions,
	SUPPORTED_LOCALES,
	SupportedLocale
} from "./settings";

const initI18next = async (
	locale: SupportedLocale,
	ns: string | Array<string>
) => {
	const i18nInstance = createInstance();

	await i18nInstance
		.use(initReactI18next)
		.use(
			resourcesToBackend(
				(language: string, namespace: string) =>
					import(`./locales/${language}/${namespace}.json`)
			)
		)
		.init({
			...getOptions(),
			lng: locale,
			ns
		});

	return i18nInstance;
};

export const extractLocaleFromRequest = () => {
	const cookieLocale = cookies().get(cookieName)?.value;

	if (SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
		return cookieLocale as SupportedLocale;
	}

	const acceptLanguage = headers().get("Accept-Language");

	const acceptLanguageLocales = parseAcceptLanguage(acceptLanguage);

	const [acceptLanguageLocale] = availableLocales(acceptLanguageLocales, [
		...SUPPORTED_LOCALES
	]);

	if (SUPPORTED_LOCALES.includes(acceptLanguageLocale as SupportedLocale)) {
		return acceptLanguageLocale as SupportedLocale;
	}

	return FALLBACK_LOCALE;
};

const LOCALE_PATTERN = /^[a-z]{2}(?:[-_][A-Z]{2})?$/i;

export const ensureLocalizedPathname = (pathname: string) => {
	const pathnameSegments = pathname
		.replace(/^\//, "")
		.split("/")
		.filter(Boolean);

	const pathnameHasExactLocale =
		pathnameSegments.length > 0 &&
		SUPPORTED_LOCALES.some((locale) => locale === pathnameSegments[0]);

	if (pathnameHasExactLocale) {
		return pathname;
	}

	const pathnameLocale =
		pathnameSegments.length > 0 && LOCALE_PATTERN.test(pathnameSegments[0])
			? pathnameSegments[0].replace("_", "-")
			: undefined;

	const [preferredLocale] = mergeUserLocales(
		availableLocales(
			[pathnameLocale, extractLocaleFromRequest()].filter(Boolean),
			[...SUPPORTED_LOCALES]
		)
	);

	const newPathnameSegments = pathnameLocale
		? [preferredLocale, ...pathnameSegments.slice(1)]
		: [preferredLocale, ...pathnameSegments];

	return `/${newPathnameSegments.join("/")}`;
};

interface LoadPageTranslationsOptions {
	keyPrefix?: string;
}

export const loadPageTranslations = async (
	locale: SupportedLocale,
	ns: string | Array<string>,
	options: LoadPageTranslationsOptions = {}
) => {
	const i18nextInstance = await initI18next(locale, ns);

	return {
		t: i18nextInstance.getFixedT(locale, ns, options.keyPrefix),
		i18n: i18nextInstance
	};
};
