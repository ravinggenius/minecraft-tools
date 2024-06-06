"use server";

import { addDays } from "date-fns";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import sendAddressVerification from "@/emails/address-verification";
import CodedError from "@/library/_/errors/coded-error";
import { normalizeFormData, ServerAction } from "@/library/_/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/_/session-manager";
import * as accountModel from "@/library/account/model";
import { AccountCreateAttrs } from "@/library/account/schema";
import * as sessionModel from "@/library/session/model";
import * as config from "@/services/config-service.mjs";
import * as secretService from "@/services/secret-service";

export const createProfile: ServerAction = async (data) => {
	try {
		const maybeProfile = await maybeProfileFromSession();

		if (maybeProfile) {
			redirect("/profile");
		}

		const attrs = normalizeFormData(data) as AccountCreateAttrs;

		const account = await accountModel.create(attrs, secretService.nonce());

		const token = await secretService.encrypt({
			email: account.email,
			nonce: account.tokenNonce,
			expiresAt: addDays(
				new Date(),
				config.emailVerificationExpiryDays
			).toJSON()
		});

		const verificationUrl = new URL(
			"/profile/verification",
			config.hostUrl
		);

		verificationUrl.search = new URLSearchParams({
			email: account.email,
			token
		}).toString();

		await sendAddressVerification(account.email, verificationUrl);

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
