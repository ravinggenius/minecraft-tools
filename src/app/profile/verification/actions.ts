"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import { normalizeFormData, ServerAction } from "@/library/_/server-action";
import { maybeProfileFromSession } from "@/library/_/session";
import * as accountModel from "@/library/account/model";
import * as secretService from "@/services/secret-service";

import { DATA, TOKEN } from "./schema";

export const markEmailAsVerified: ServerAction = async (data) => {
	try {
		const maybeProfile = await maybeProfileFromSession();

		if (!maybeProfile) {
			redirect("/profile");
		}

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

			redirect("/profile");
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
};
