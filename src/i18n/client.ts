"use client";

import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
	initReactI18next,
	useTranslation as useTranslationOrignal
} from "react-i18next";

import { LocaleContext } from "@/components/_/LocaleProvider/LocaleProvider";

import { cookieName, getOptions, SUPPORTED_LOCALES } from "./settings";

const runsOnServer = typeof window === "undefined";

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(
		resourcesToBackend(
			(language: string, namespace: string) =>
				import(`@/../public/locales/${language}/${namespace}.json`)
		)
	)
	.init({
		...getOptions(),
		lng: undefined,
		detection: {
			order: ["path", "htmlTag", "cookie", "navigator"]
		},
		preload: runsOnServer ? SUPPORTED_LOCALES : []
	});

export const useTranslation = (
	ns: Parameters<typeof useTranslationOrignal>[0],
	options?: Parameters<typeof useTranslationOrignal>[1]
) => {
	const locale = useContext(LocaleContext);

	const [cookies, setCookie] = useCookies([cookieName]);

	const reply = useTranslationOrignal(ns, options);

	const { i18n } = reply;

	if (runsOnServer && locale && i18n.resolvedLanguage !== locale) {
		i18n.changeLanguage(locale);
	} else {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (activeLng === i18n.resolvedLanguage) {
				return;
			}

			setActiveLng(i18n.resolvedLanguage);
		}, [activeLng, i18n.resolvedLanguage]);

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (!locale || i18n.resolvedLanguage === locale) {
				return;
			}

			i18n.changeLanguage(locale);
		}, [locale, i18n]);

		const cookieLng = cookies[cookieName];

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (cookieLng === locale) {
				return;
			}

			setCookie(cookieName, locale, { path: "/" });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [locale, cookieLng]);
	}

	return reply;
};
