"use client";

import i18next from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import { getOptions } from "./settings";

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
		detection: {
			caches: ["cookie"],
			order: ["cookie", "navigator"]
		}
	});

export { useTranslation } from "react-i18next";
