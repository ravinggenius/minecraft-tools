import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { cookies, headers } from "next/headers";
import { availableLocales } from "preferred-locale";
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

interface Options {
	keyPrefix?: string;
}

export const loadPageTranslations = async (
	locale: SupportedLocale,
	ns: string | Array<string>,
	options: Options = {}
) => {
	const i18nextInstance = await initI18next(locale, ns);

	return {
		t: i18nextInstance.getFixedT(
			locale,
			Array.isArray(ns) ? ns[0] : ns,
			options.keyPrefix
		),
		i18n: i18nextInstance
	};
};
