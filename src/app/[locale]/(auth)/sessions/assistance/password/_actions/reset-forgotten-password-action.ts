import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as passwordResetModel from "@/domains/password-reset/model";
import * as sessionModel from "@/domains/session/model";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/session-manager";
import * as secretService from "@/services/secret-service/service";

import { DATA, TOKEN } from "../schema";

const resetForgottenPasswordAction: ServerAction = async (data) => {
	"use server";

	const maybeProfile = await maybeProfileFromSession();

	const locale = await extractLocaleFromRequest();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const result = await normalizeFormData(DATA, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	const { email, token, password, passwordConfirmation } = result.data;

	const decrypted = await TOKEN.safeParseAsync(
		await secretService.decrypt(token)
	);

	if (!decrypted.success) {
		return { issues: decrypted.error.issues };
	}

	if (
		decrypted.data.email === email &&
		decrypted.data.expiresAt > new Date()
	) {
		try {
			const isChanged = await passwordResetModel.reset({
				email: decrypted.data.email,
				nonce: decrypted.data.nonce,
				password,
				passwordConfirmation
			});

			if (isChanged) {
				const session = await sessionModel.create({
					email,
					password
				});

				await writeSessionCookie(session);
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
	}

	redirect(`/${locale}/profile`);
};

export default resetForgottenPasswordAction;
