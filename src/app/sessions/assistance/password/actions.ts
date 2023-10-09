"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import CodedError from "@/library/_/errors/coded-error";
import { normalizeFormData, ServerAction } from "@/library/_/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/_/session";
import * as passwordResetModel from "@/library/password-reset/model";
import * as sessionModel from "@/library/session/model";
import * as secretService from "@/services/secret-service";

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
