import validator from "validator";
import { z } from "zod/v4";

import * as config from "@/services/config-service/service-public";

import { PROFILE, PROFILE_ATTRS } from "../profile/schema";

export const ACCOUNT = z.object({
	id: z.uuid(),
	createdAt: z.iso.date(),
	updatedAt: z.iso.date(),
	profileId: PROFILE.shape.id,
	email: z.email().trim(),
	emailVerifiedAt: z.iso.date().nullish(),
	tokenNonce: z.string(),
	tokenNonceCount: z.int().positive()
});

export type Account = z.infer<typeof ACCOUNT>;

export const ACCOUNT_ATTRS = ACCOUNT.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	profileId: true,
	emailVerifiedAt: true,
	tokenNonce: true,
	tokenNonceCount: true
});

export type AccountAttrs = z.infer<typeof ACCOUNT_ATTRS>;

export const ACCOUNT_PASSWORD_ATTRS = z.object({
	password: z.string().refine((password) =>
		validator.isStrongPassword(password, {
			minLength: config.passwordMinLength
		})
	),
	passwordConfirmation: z.string()
});

export type AccountPasswordAttrs = z.infer<typeof ACCOUNT_PASSWORD_ATTRS>;

export const ACCOUNT_CREATE_ATTRS = z.object({
	account: ACCOUNT_ATTRS.merge(ACCOUNT_PASSWORD_ATTRS),
	profile: PROFILE_ATTRS
});

export type AccountCreateAttrs = z.infer<typeof ACCOUNT_CREATE_ATTRS>;

export const PROFILE_WITH_ACCOUNTS = PROFILE.extend({
	accounts: z.array(ACCOUNT)
});

export type ProfileWithAccounts = z.infer<typeof PROFILE_WITH_ACCOUNTS>;
