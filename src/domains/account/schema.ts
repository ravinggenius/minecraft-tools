import validator from "validator";
import { z } from "zod/v4";

import * as config from "@/services/config-service/service-public.mjs";

import { PROFILE, PROFILE_ATTRS } from "../profile/schema";

export const ACCOUNT = z.object({
	id: z.uuid(),
	createdAt: z.coerce.date(),
	updatedAt: z.coerce.date(),
	profileId: PROFILE.shape.id,
	email: z.email().trim(),
	emailVerifiedAt: z.coerce.date().nullish(),
	tokenNonce: z.string(),
	tokenNonceCount: z.int().positive()
});

export interface Account extends z.infer<typeof ACCOUNT> {}

export const ACCOUNT_ATTRS = ACCOUNT.omit({
	id: true,
	createdAt: true,
	updatedAt: true,
	profileId: true,
	emailVerifiedAt: true,
	tokenNonce: true,
	tokenNonceCount: true
});

export interface AccountAttrs extends z.infer<typeof ACCOUNT_ATTRS> {}

export const ACCOUNT_PASSWORD_ATTRS = z.object({
	password: z.string().refine((password) =>
		validator.isStrongPassword(password, {
			minLength: config.passwordMinLength
		})
	),
	passwordConfirmation: z.string()
});

export interface AccountPasswordAttrs
	extends z.infer<typeof ACCOUNT_PASSWORD_ATTRS> {}

export const ACCOUNT_CREATE_ATTRS = z.object({
	account: ACCOUNT_ATTRS.merge(ACCOUNT_PASSWORD_ATTRS),
	profile: PROFILE_ATTRS
});

export interface AccountCreateAttrs
	extends z.infer<typeof ACCOUNT_CREATE_ATTRS> {}

export const PROFILE_WITH_ACCOUNTS = PROFILE.extend({
	accounts: z.array(ACCOUNT)
});

export interface ProfileWithAccounts
	extends z.infer<typeof PROFILE_WITH_ACCOUNTS> {}
