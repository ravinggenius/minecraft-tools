"use server";

import { redirect } from "next/navigation";

import * as accountModel from "@/domains/account/model";
import { ACCOUNT } from "@/domains/account/schema";
import * as passwordResetModel from "@/domains/password-reset/model";
import sendForgotPassword from "@/emails/forgot-password";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import { maybeProfileFromSession } from "@/library/session-manager";
import * as config from "@/services/config-service/service.mjs";
import * as secretService from "@/services/secret-service/service";

export const initiateForgotPasswordReset: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	const { email } = await ACCOUNT.pick({
		email: true
	}).parseAsync(normalizeFormData(data));

	if (await accountModel.isEmailVerified(email)) {
		const passwordReset = await passwordResetModel.create({
			email,
			nonce: secretService.nonce()
		});

		const token = await secretService.encrypt({
			email: passwordReset.email,
			nonce: passwordReset.nonce,
			expiresAt: new Date(passwordReset.expiresAt).toJSON()
		});

		const passwordAssistanceUrl = new URL(
			"/sessions/assistance/password",
			config.hostUrl
		);

		passwordAssistanceUrl.search = new URLSearchParams({
			email: passwordReset.email,
			token
		}).toString();

		await sendForgotPassword(email, passwordAssistanceUrl);
	}

	const query = new URLSearchParams({
		email
	});

	redirect(`/sessions/assistance/password/prompt?${query}`);
};
