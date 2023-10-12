"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import CodedError from "@/library/_/errors/coded-error";
import { normalizeFormData, ServerAction } from "@/library/_/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/_/session";
import * as sessionModel from "@/library/session/model";
import { SessionCredentials } from "@/library/session/schema";

export const createSession: ServerAction = async (data) => {
	try {
		const maybeProfile = await maybeProfileFromSession();

		if (maybeProfile) {
			redirect("/profile");
		}

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

	redirect("/profile");
};
