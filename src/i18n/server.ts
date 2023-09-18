import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";

import { SupportedLocale, getOptions } from "./settings";

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

interface Options {
	keyPrefix?: string;
}

export const loadPageTranslations = async (
	lng: SupportedLocale,
	ns: string | Array<string>,
	options: Options = {}
) => {
	const i18nextInstance = await initI18next(lng, ns);

	return {
		t: i18nextInstance.getFixedT(
			lng,
			Array.isArray(ns) ? ns[0] : ns,
			options.keyPrefix
		),
		i18n: i18nextInstance
	};
};
