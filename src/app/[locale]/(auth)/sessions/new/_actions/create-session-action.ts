import { redirect } from "next/navigation";
import { ZodError } from "zod/v4";

import * as sessionModel from "@/domains/session/model";
import { SESSION_CREDENTIALS } from "@/domains/session/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/session-manager";

const createSessionAction: ServerAction = async (data) => {
	"use server";

	const maybeProfile = await maybeProfileFromSession();

	const locale = await extractLocaleFromRequest();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	const result = await normalizeFormData(SESSION_CREDENTIALS, data);

	if (!result.success) {
		return { issues: result.error.issues };
	}

	try {
		const session = await sessionModel.create(result.data);

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

export default createSessionAction;
