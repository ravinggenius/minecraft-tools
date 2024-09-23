"use server";

import { addDays } from "date-fns";
import { redirect } from "next/navigation";
import { ZodError } from "zod";

import * as accountModel from "@/domains/account/model";
import { AccountCreateAttrs } from "@/domains/account/schema";
import * as sessionModel from "@/domains/session/model";
import sendAddressVerification from "@/emails/address-verification";
import { extractLocaleFromRequest } from "@/i18n/server";
import CodedError from "@/library/coded-error";
import { normalizeFormData, ServerAction } from "@/library/server-action";
import {
	maybeProfileFromSession,
	writeSessionCookie
} from "@/library/session-manager";
import * as config from "@/services/config-service/service.mjs";
import * as secretService from "@/services/secret-service/service";

const createProfileAction: ServerAction = async (data) => {
	const maybeProfile = await maybeProfileFromSession();

	const locale = extractLocaleFromRequest();

	if (maybeProfile) {
		redirect(`/${locale}/profile`);
	}

	try {
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

		await sendAddressVerification(locale, account.email, verificationUrl);

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

	redirect(`/${locale}/profile`);
};

export default createProfileAction;
