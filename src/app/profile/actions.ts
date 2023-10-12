"use server";

import { redirect } from "next/navigation";

import { ServerAction } from "@/library/_/server-action";
import { clearSessionCookie, readSessionCookie } from "@/library/_/session";
import * as sessionModel from "@/library/session/model";

export const deleteSession: ServerAction = async (data) => {
	const sessionId = await readSessionCookie();

	if (sessionId) {
		await sessionModel.destroy(sessionId);
	}

	clearSessionCookie();

	redirect("/");
};
