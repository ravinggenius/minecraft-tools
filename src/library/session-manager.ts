import { redirect } from "next/navigation";

import * as profileModel from "@/domains/profile/model";
import * as sessionModel from "@/domains/session/model";
import { Session } from "@/domains/session/schema";
import { extractLocaleFromRequest } from "@/i18n/server";
import * as sessionCookieService from "@/services/session-cookie-service/service";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const writeSessionCookie = async (session: Session) =>
	sessionCookieService.write(session.id, session.expiresAt);

export const readSessionCookie = () => sessionCookieService.read();

export const clearSessionCookie = () => sessionCookieService.clear();

const maybeAccountFromSession = async () => {
	const maybeSessionId = await readSessionCookie();

	return maybeSessionId
		? await sessionModel.verify(maybeSessionId)
		: undefined;
};

export const maybeProfileFromSession = async () => {
	const maybeAccount = await maybeAccountFromSession();

	return maybeAccount
		? await profileModel.get(maybeAccount.profileId)
		: undefined;
};

export const requireProfile = async () => {
	const maybeProfile = await maybeProfileFromSession();

	if (!maybeProfile) {
		const locale = await extractLocaleFromRequest();

		redirect(`/${locale}/sessions/new`);
	}

	return maybeProfile;
};

export const requireVerifiedProfile = async () => {
	const profile = await requireProfile();

	if (!(await profileModel.isEmailVerified(profile.id))) {
		const locale = await extractLocaleFromRequest();

		redirect(`/${locale}/profile/verification-prompt`);
	}

	return profile;
};
