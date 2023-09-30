"use server";

import { addDays } from "date-fns";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import * as config from "@/library/_/config.mjs";
import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import normalizeFormData from "@/library/_/normalize-form-data";
import { maybeProfileFromSession } from "@/library/_/session";
import * as accountModel from "@/library/account/model";
import * as secretService from "@/services/secret-service";

import { DATA, TOKEN } from "./schema";

export const markEmailAsVerified = async (data: FormData) => {
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

		const now = new Date();

		if (
			account &&
			account.tokenNonce &&
			addDays(
				account.tokenNonceUpdatedAt,
				config.emailVerificationExpiryDays
			) > now &&
			decrypted.email === account.email &&
			decrypted.nonce === account.tokenNonce &&
			decrypted.expiresAt > now
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
