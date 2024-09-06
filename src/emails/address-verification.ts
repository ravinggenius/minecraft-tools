import { loadPageTranslations } from "@/i18n/server";
import { SupportedLocale } from "@/i18n/settings";
import * as emailService from "@/services/email-service/service";

const sendAddressVerification = async (
	locale: SupportedLocale,
	to: Parameters<typeof emailService.send>[0],
	verificationUrl: URL
) => {
	const { t: tBranding } = await loadPageTranslations(locale, "branding");
	const { t } = await loadPageTranslations(
		locale,
		"email-address-verification"
	);

	const body = t("body.text", {
		link: verificationUrl,
		returnObjects: true
	}) as Array<string>;

	return emailService.send(tBranding("email.from-name"), to, t("subject"), {
		text: body.join("\n\n")
	});
};

export default sendAddressVerification;
