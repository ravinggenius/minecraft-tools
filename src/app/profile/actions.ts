"use server";

import { redirect } from "next/navigation";

import * as sessionModel from "@/domains/session/model";
import { ServerAction } from "@/library/server-action";
import {
	clearSessionCookie,
	readSessionCookie
} from "@/library/session-manager";

export const deleteSession: ServerAction = async (data) => {
	const sessionId = await readSessionCookie();

	if (sessionId) {
		await sessionModel.destroy(sessionId);
	}

	clearSessionCookie();

	redirect("/");
};
