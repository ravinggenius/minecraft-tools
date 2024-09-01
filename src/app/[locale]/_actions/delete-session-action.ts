"use server";

import { redirect } from "next/navigation";

import * as sessionModel from "@/domains/session/model";
import { extractLocaleFromRequest } from "@/i18n/server";
import { ServerAction } from "@/library/server-action";
import {
	clearSessionCookie,
	readSessionCookie
} from "@/library/session-manager";

const deleteSessionAction: ServerAction = async (data) => {
	const sessionId = await readSessionCookie();

	if (sessionId) {
		await sessionModel.destroy(sessionId);
	}

	clearSessionCookie();

	const locale = extractLocaleFromRequest();

	redirect(`/${locale}`);
};

export default deleteSessionAction;
