"use server";

import { addDays } from "date-fns";
import { redirect, RedirectType } from "next/navigation";
import { ZodError } from "zod";

import * as accountModel from "@/domains/account/model";
import sendAddressVerification from "@/emails/address-verification";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError from "@/library/coded-error";
import { maybeProfileFromSession } from "@/library/session-manager";
import * as config from "@/services/config-service/service.mjs";
import * as secretService from "@/services/secret-service/service";

const resendEmailVerificationAction = async () => {
	const maybeProfile = await maybeProfileFromSession();

	const locale = extractLocaleFromRequest();

	if (!maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	try {
		const account = await accountModel.updateVerificationNonce(
			maybeProfile.id,
			secretService.nonce()
		);

		const token = await secretService.encrypt({
			email: account.email,
			nonce: account.tokenNonce,
			expiresAt: addDays(
				new Date(),
				config.emailVerificationExpiryDays
			).toJSON()
		});

		const verificationUrl = new URL(
			"/profile/verification",
			config.hostUrl
		);

		verificationUrl.search = new URLSearchParams({
			email: account.email,
			token
		}).toString();

		await sendAddressVerification(locale, account.email, verificationUrl);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	// hack to force the page to reload so the timer to show/hide
	// the resubmit form is properly reset. simply doing nothing
	// or redirecting to /profile/verification-prompt does not work
	redirect(`/${locale}/profile`, RedirectType.replace);
};

export default resendEmailVerificationAction;
