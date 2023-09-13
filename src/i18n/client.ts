"use client";

import { preferredLocale } from "preferred-locale";
import { useEffect, useState } from "react";
import { getCookie } from "typescript-cookie";

import * as config from "@/library/_/config-public.mjs";

import makeTranslate, { MakeTranslateOptions } from "./make-translate";
import {
	FALLBACK_LOCALE,
	SUPPORTED_LOCALES,
	SupportedLocale,
	Translation
} from "./settings";

export const extractLocaleFromBrowser = () =>
	getCookie(config.i18nName) ??
	preferredLocale(FALLBACK_LOCALE, [...SUPPORTED_LOCALES]);

export const useTranslation = (
	namespace: string,
	options?: MakeTranslateOptions
) => {
	const [translation, setTranslation] = useState<Translation>({});

	const localeFromBrowser = extractLocaleFromBrowser();

	const locale = SUPPORTED_LOCALES.includes(localeFromBrowser)
		? (localeFromBrowser as SupportedLocale)
		: FALLBACK_LOCALE;

	useEffect(() => {
		fetch(`/locales/${locale}/${namespace}.json`).then((response) =>
			response.json().then((t) => {
				setTranslation(t as Translation);
			})
		);
	}, [locale, namespace]);

	return makeTranslate(translation, options);
};
