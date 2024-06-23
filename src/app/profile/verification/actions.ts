"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import { normalizeFormData, ServerAction } from "@/library/_/server-action";
import { maybeProfileFromSession } from "@/library/_/session-manager";
import * as accountModel from "@/library/account/model";
import * as secretService from "@/services/secret-service/service";

import { DATA, TOKEN } from "./schema";

export const markEmailAsVerified: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	if (!maybeProfile) {
		redirect("/profile");
	}

	try {
		const { email, token } = await DATA.parseAsync(normalizeFormData(data));

		const account = await accountModel.findByEmail(email);

		const decrypted = await TOKEN.parseAsync(
			await secretService.decrypt(token)
		);

		if (
			account &&
			!account.emailVerifiedAt &&
			account.tokenNonce &&
			decrypted.email === account.email &&
			decrypted.nonce === account.tokenNonce &&
			decrypted.expiresAt > new Date()
		) {
			await accountModel.markEmailAsVerified(account.id);
		} else {
			throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
		}
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect("/profile");
};
