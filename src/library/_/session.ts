import { redirect } from "next/navigation";

import * as profileModel from "@/library/profile/model";
import * as sessionModel from "@/library/session/model";
import { Session } from "@/library/session/schema";
import * as sessionCookieService from "@/services/session-cookie-service";

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

export const requireVerifiedProfile = async () => {
	const maybeProfile = await maybeProfileFromSession();

	if (!maybeProfile) {
		redirect("/sessions/new");
	}

	if (!(await profileModel.isEmailVerified(maybeProfile.id))) {
		// redirect("/profile/confirmation-prompt");
	}

	return maybeProfile;
};
