import { loadPageTranslations } from "@/i18n/server";
import * as emailService from "@/services/email-service/service";

const sendForgotPassword = async (
	to: Parameters<typeof emailService.send>[0],
	link: URL
) => {
	const { t: tBranding } = await loadPageTranslations("branding");
	const { t } = await loadPageTranslations("email-forgot-password");

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
