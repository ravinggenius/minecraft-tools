"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import * as passwordResetModel from "@/domains/password-reset/model";
import * as sessionModel from "@/domains/session/model";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/session-manager";
import * as secretService from "@/services/secret-service/service";

import { DATA, TOKEN } from "./schema";

export const resetForgottenPassword: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	if (maybeProfile) {
		redirect("/profile");
	}

	try {
		const { email, token, password, passwordConfirmation } =
			await DATA.parseAsync(normalizeFormData(data));

		const decrypted = await TOKEN.parseAsync(
			await secretService.decrypt(token)
		);

		if (decrypted.email === email && decrypted.expiresAt > new Date()) {
			const isChanged = await passwordResetModel.reset({
				email: decrypted.email,
				nonce: decrypted.nonce,
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
