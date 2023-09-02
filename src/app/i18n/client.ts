"use client";

import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
	initReactI18next,
	useTranslation as useTranslationOrignal
} from "react-i18next";

import {
	cookieName,
	getOptions,
	SUPPORTED_LOCALES,
	SupportedLocale
} from "./settings";

const runsOnServer = typeof window === "undefined";

i18next
	.use(initReactI18next)
	.use(LanguageDetector)
	.use(
		resourcesToBackend(
			(language: string, namespace: string) =>
				import(`./locales/${language}/${namespace}.json`)
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
	lng: SupportedLocale,
	ns: Parameters<typeof useTranslationOrignal>[0],
	options: Parameters<typeof useTranslationOrignal>[1]
) => {
	const [cookies, setCookie] = useCookies([cookieName]);

	const reply = useTranslationOrignal(ns, options);

	const { i18n } = reply;

	if (runsOnServer && lng && i18n.resolvedLanguage !== lng) {
		i18n.changeLanguage(lng);
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
			if (!lng || i18n.resolvedLanguage === lng) {
				return;
			}

			i18n.changeLanguage(lng);
		}, [lng, i18n]);

		const cookieLng = cookies[cookieName];

		// eslint-disable-next-line react-hooks/rules-of-hooks
		useEffect(() => {
			if (cookieLng === lng) {
				return;
			}

			setCookie(cookieName, lng, { path: "/" });
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, [lng, cookieLng]);
	}

	return reply;
};
