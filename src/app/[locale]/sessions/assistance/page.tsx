import { redirect } from "next/navigation";

import { SupportedLocale } from "@/i18n/settings";

export const generateMetadata = ({
	params: { locale }
}: {
	params: { locale: SupportedLocale };
}) => {
	redirect(`/${locale}/sessions/new`);
};

export default async function SessionAssistancePage() {
	return null;
}
