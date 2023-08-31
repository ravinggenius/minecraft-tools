import Iron from "@hapi/iron";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import * as profileModel from "@/library/profile/model";
import * as sessionModel from "@/library/session/model";
import { Session } from "@/library/session/schema";

import * as config from "./config.mjs";

export const writeSessionCookie = async (session: Session) =>
	cookies().set(
		config.sessionName,
		await Iron.seal(session.id, config.sessionSecret, Iron.defaults),
		{
			...config.sessionCookieOptions,
			expires: session.expiresAt
		}
	);

export const readSessionCookie = async () => {
	const token = cookies().get(config.sessionName)?.value;

	return token
		? await (Iron.unseal(
				token,
				config.sessionSecret,
				Iron.defaults
		  ) as Promise<Session["id"]>)
		: undefined;
};

export const clearSessionCookie = () => cookies().delete(config.sessionName);

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
