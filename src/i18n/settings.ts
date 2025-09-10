import { InitOptions } from "i18next";

import * as config from "@/services/config-service/service-public";

export const SUPPORTED_LOCALES = ["en-US"] as const;

export const FALLBACK_LOCALE = SUPPORTED_LOCALES[0];

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const cookieName = config.i18nName;

export const getOptions = () =>
	({
		debug: config.debugI18n,
		fallbackLng: FALLBACK_LOCALE,
		interpolation: {
			escapeValue: false
		},
		load: "currentOnly",
		supportedLngs: SUPPORTED_LOCALES
	}) satisfies InitOptions as InitOptions;
