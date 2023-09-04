"use client";

import { ReactNode, createContext } from "react";

import { FALLBACK_LOCALE, SupportedLocale } from "@/app/i18n/settings";

export const LocaleContext = createContext<SupportedLocale>(FALLBACK_LOCALE);

export default function LocaleProvider({
	children,
	locale
}: {
	children: ReactNode;
	locale: SupportedLocale;
}) {
	return (
		<LocaleContext.Provider value={locale}>
			{children}
		</LocaleContext.Provider>
	);
}
