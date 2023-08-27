"use server";

import { redirect } from "next/navigation";
import { ZodError } from "zod";

import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import normalizeFormData from "@/library/_/normalize-form-data";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/_/session";
import { ServerAction } from "@/library/_/types";
import * as accountModel from "@/library/account/model";
import { AccountCreateAttrs } from "@/library/account/schema";
import * as sessionModel from "@/library/session/model";

export const createProfile: ServerAction = async (data: FormData) => {
	try {
		const maybeProfile = await maybeProfileFromSession();

		if (maybeProfile) {
			redirect("/profile");
		}

		const account = await accountModel.create(
			normalizeFormData(data) as AccountCreateAttrs
		);

		const session = await sessionModel.create({
			email: account.email,
			password: data.get("account.password") as string
		});

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
