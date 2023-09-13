"use server";

import { parseAcceptLanguage } from "intl-parse-accept-language";
import { cookies, headers } from "next/headers";
import { availableLocales } from "preferred-locale";

import * as config from "@/library/_/config.mjs";

import makeTranslate, { MakeTranslateOptions } from "./make-translate";
import {
	FALLBACK_LOCALE,
	SUPPORTED_LOCALES,
	SupportedLocale,
	Translation
} from "./settings";

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

export const translation = async (
	namespace: string,
	options?: MakeTranslateOptions
) => {
	const locale = extractLocaleFromRequest();

	const translation: Translation = (
		await import(`@/../public/locales/${locale}/${namespace}.json`)
	).default;

	return makeTranslate(translation, options);
};
