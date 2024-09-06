"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import * as sessionModel from "@/domains/session/model";
import { SessionCredentials } from "@/domains/session/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/session-manager";

export const createSession: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	const locale = extractLocaleFromRequest();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	try {
		const session = await sessionModel.create(
			normalizeFormData(data) as SessionCredentials
		);

		await writeSessionCookie(session);
	} catch (error: unknown) {
		if (error instanceof CodedError) {
			return error.toJson();
		} else if (error instanceof ZodError) {
			return { issues: error.issues };
		} else {
			throw error;
		}
	}

	redirect(`/${locale}/profile`);
};
