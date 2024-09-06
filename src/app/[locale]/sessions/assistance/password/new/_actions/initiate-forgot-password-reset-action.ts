"use server";

import { redirect } from "next/navigation";

import * as accountModel from "@/domains/account/model";
import { ACCOUNT } from "@/domains/account/schema";
import * as passwordResetModel from "@/domains/password-reset/model";
import sendForgotPassword from "@/emails/forgot-password";
import { extractLocaleFromRequest } from "@/i18n/server";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import { maybeProfileFromSession } from "@/library/session-manager";
import * as config from "@/services/config-service/service.mjs";
import * as secretService from "@/services/secret-service/service";

const initiateForgotPasswordResetAction: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	const locale = extractLocaleFromRequest();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const result = await normalizeFormData(
		ACCOUNT.pick({
			email: true
		}),
		data
	);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	const { email } = result.data;

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

		await sendForgotPassword(
			extractLocaleFromRequest(),
			email,
			passwordAssistanceUrl
		);
	}

	const query = new URLSearchParams({
		email
	});

	redirect(`/${locale}/sessions/assistance/password/prompt?${query}`);
};

export default initiateForgotPasswordResetAction;
