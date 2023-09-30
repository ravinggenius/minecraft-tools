import { loadPageTranslations } from "@/i18n/server";
import * as emailService from "@/services/email-service";

const sendAddressVerification = async (
	to: Parameters<typeof emailService.send>[0],
	verificationUrl: URL
) => {
	const { t: tBranding } = await loadPageTranslations("branding");
	const { t } = await loadPageTranslations("email-address-verification");

	const body = t("body.text", {
		link: verificationUrl,
		returnObjects: true
	}) as Array<string>;

	return emailService.send(tBranding("email.from-name"), to, t("subject"), {
		text: body.join("\n\n")
	});
};

export default sendAddressVerification;
