import { SupportedLocale } from "@/app/i18n/settings";

export interface CommonPageProps {
	params: {
		locale: SupportedLocale;
	};
}
