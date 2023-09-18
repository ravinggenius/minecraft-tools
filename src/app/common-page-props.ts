import { SupportedLocale } from "@/i18n/settings";

export interface CommonPageProps {
	params: {
		locale: SupportedLocale;
	};
}
