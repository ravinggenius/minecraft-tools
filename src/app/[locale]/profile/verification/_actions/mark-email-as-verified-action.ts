import { redirect } from "next/navigation";

import * as accountModel from "@/domains/account/model";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import { maybeProfileFromSession } from "@/library/session-manager";
import * as secretService from "@/services/secret-service/service";

import { DATA, TOKEN } from "./mark-email-as-verified-action.schema";

const markEmailAsVerifiedAction: ServerAction = async (data) => {
	"use server";

	const maybeProfile = await maybeProfileFromSession();

	const locale = await extractLocaleFromRequest();

	if (!maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const result = await normalizeFormData(DATA, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	const { email, token } = result.data;

	const account = await accountModel.findByEmail(email);

	const decrypted = await TOKEN.safeParseAsync(
		await secretService.decrypt(token)
	);

	if (!decrypted.success) {
		return { issues: decrypted.error.issues };
	}

	if (
		account &&
		!account.emailVerifiedAt &&
		account.tokenNonce &&
		decrypted.data.email === account.email &&
		decrypted.data.nonce === account.tokenNonce &&
		decrypted.data.expiresAt > new Date()
	) {
		await accountModel.markEmailAsVerified(account.id);
	} else {
		const error = new CodedError(ERROR_CODE.CREDENTIALS_INVALID);

		return error.toJson();
	}

	redirect(`/${locale}/profile`);
};

export default markEmailAsVerifiedAction;
