"use client";

import i18next from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

import { SHARED_OPTIONS } from "./settings";

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
		...SHARED_OPTIONS,
		detection: {
			caches: ["cookie"],
			order: ["cookie", "navigator"]
		}
	});

export { useTranslation } from "react-i18next";
