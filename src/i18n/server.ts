"use server";

import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { parseAcceptLanguage } from "intl-parse-accept-language";
import { cookies, headers } from "next/headers";
import { availableLocales } from "preferred-locale";
import { initReactI18next } from "react-i18next/initReactI18next";

import * as config from "@/library/_/config.mjs";

import {
	FALLBACK_LOCALE,
	SUPPORTED_LOCALES,
	SupportedLocale,
	getOptions
} from "./settings";

const initI18next = async (
	lng: SupportedLocale,
	ns: string | Array<string>
) => {
	const i18nInstance = createInstance();

	await i18nInstance
		.use(initReactI18next)
		.use(
			resourcesToBackend(
				(language: string, namespace: string) =>
					import(`@/../public/locales/${language}/${namespace}.json`)
			)
		)
		.init(getOptions(lng, ns));

	return i18nInstance;
};

export const extractLocaleFromRequest = () => {
	const cookieLocale = cookies().get(config.i18nName)?.value;

	if (SUPPORTED_LOCALES.includes(cookieLocale as SupportedLocale)) {
		return cookieLocale as SupportedLocale;
	}

	const acceptLanguage = headers().get("Accept-Language");

	const headerLocales = parseAcceptLanguage(acceptLanguage);

	const [headerLocale] = availableLocales(headerLocales, [
		...SUPPORTED_LOCALES
	]);

	if (SUPPORTED_LOCALES.includes(headerLocale as SupportedLocale)) {
		return headerLocale as SupportedLocale;
	}

	return FALLBACK_LOCALE;
};

interface Options {
	keyPrefix?: string;
}

export const loadPageTranslations = async (
	ns: string | Array<string>,
	options: Options = {}
) => {
	const locale = extractLocaleFromRequest();

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
