"use server";

import { redirect } from "next/navigation";

import { clearSessionCookie, readSessionCookie } from "@/library/_/session";
import * as sessionModel from "@/library/session/model";

export const deleteSession = async (data: FormData) => {
	const sessionId = await readSessionCookie();

	if (sessionId) {
		await sessionModel.destroy(sessionId);
	}

	clearSessionCookie();

	redirect("/");
};
