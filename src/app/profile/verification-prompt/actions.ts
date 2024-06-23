"use server";

import { addDays } from "date-fns";
import { redirect, RedirectType } from "next/navigation";
import { ZodError } from "zod";

import sendAddressVerification from "@/emails/address-verification";
import CodedError from "@/library/_/errors/coded-error";
import { maybeProfileFromSession } from "@/library/_/session-manager";
import * as accountModel from "@/library/account/model";
import * as config from "@/services/config-service/service.mjs";
import * as secretService from "@/services/secret-service/service";

export const resendEmailVerification = async () => {
	const maybeProfile = await maybeProfileFromSession();

	if (!maybeProfile) {
		redirect("/profile");
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

		await sendAddressVerification(account.email, verificationUrl);
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
	redirect("/profile", RedirectType.replace);
};
