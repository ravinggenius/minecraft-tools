import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import * as emailService from "@/services/email-service/service";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const sendForgotPassword = async (
	locale: SupportedLocale,
	to: Parameters<typeof emailService.send>[0],
	link: URL
) => {
	const { t: tBranding } = await loadPageTranslations(locale, "branding");
	const { t } = await loadPageTranslations(locale, "email-forgot-password");

	return emailService.send(tBranding("email.from-name"), to, t("subject"), {
		text: (
			t("body.text", {
				link,
				returnObjects: true
			}) as Array<string>
		).join("\n\n")
	});
};

export default sendForgotPassword;
