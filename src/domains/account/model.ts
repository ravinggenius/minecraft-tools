import { z } from "zod";

import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { BOOLEAN_NAMED, VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";
import * as secretService from "@/services/secret-service/service";

import { Profile } from "../profile/schema";

import {
	ACCOUNT,
	Account,
	ACCOUNT_CREATE_ATTRS,
	AccountCreateAttrs
} from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const create = async (
	attrs: AccountCreateAttrs,
	tokenNonce: Account["tokenNonce"]
) => {
	const {
		account: { password, passwordConfirmation, ...account },
		profile
	} = await ACCOUNT_CREATE_ATTRS.parseAsync(attrs);

	if (passwordConfirmation !== password) {
		throw new CodedError(ERROR_CODE.CONFIRMATION_MISMATCH, {
			path: ["account", "passwordConfirmation"]
		});
	}

	const hashword = await secretService.hash(password);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			BOOLEAN_NAMED("alreadyExists")
		)`
			SELECT
				count(id) > 0 AS "alreadyExists"
			FROM
				accounts
			WHERE
				email = ${account.email}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["account", "email"]
			});
		}

		return transaction.one(sql.type(
			ACCOUNT.pick({
				email: true,
				tokenNonce: true
			})
		)`
			WITH profile AS (
				INSERT INTO
					profiles (name)
				VALUES
					(${profile.name})
				RETURNING
					id
			),
			permission AS (
				INSERT INTO
					permissions (profile_id, action, scope, subject)
				SELECT id, action, scope, subject
				FROM profile
				CROSS JOIN (
					VALUES
						('update'::permission_action, 'own'::permission_scope, 'profile'::permission_subject),
						('create'::permission_action, 'new'::permission_scope, 'world'::permission_subject),
						('read'::permission_action, 'own'::permission_scope, 'world'::permission_subject),
						('share'::permission_action, 'own'::permission_scope, 'world'::permission_subject),
						('update'::permission_action, 'own'::permission_scope, 'world'::permission_subject),
						('destroy'::permission_action, 'own'::permission_scope, 'world'::permission_subject)
				) AS assertions(action, scope, subject)
			)
			INSERT INTO
				accounts (profile_id, email, hashword, token_nonce)
			VALUES
				(
					(SELECT id FROM profile),
					${account.email},
					${hashword},
					${tokenNonce}
				)
			RETURNING
				email,
				token_nonce AS "tokenNonce"
		`);
	});
};

export const findByEmail = async (email: Account["email"]) => {
	const maybeAccountPlusHashword = await (
		await pool
	).maybeOne(sql.type(ACCOUNT.extend({ hashword: z.string() }))`
		SELECT
			id,
			created_at AS "createdAt",
			updated_at AS "updatedAt",
			profile_id AS "profileId",
			email,
			email_verified_at AS "emailVerifiedAt",
			hashword,
			token_nonce AS "tokenNonce",
			token_nonce_count AS "tokenNonceCount"
		FROM
			accounts
		WHERE
			email = ${email}::email
		LIMIT
			1
	`);

	return maybeAccountPlusHashword || undefined;
};

export const updateVerificationNonce = async (
	profileId: Profile["id"],
	tokenNonce: Account["tokenNonce"]
) =>
	(await pool).one(sql.type(
		ACCOUNT.pick({
			id: true,
			profileId: true,
			email: true,
			tokenNonce: true
		})
	)`
		UPDATE accounts
		SET
			token_nonce = ${tokenNonce},
			token_nonce_count = token_nonce_count + 1,
			updated_at = NOW()
		WHERE
			profile_id = ${profileId}
		RETURNING
			id,
			profile_id AS "profileId",
			email,
			token_nonce AS "tokenNonce"
	`);

export const getTokenNonceCount = async (profileId: Profile["id"]) =>
	(await pool).oneFirst(sql.type(ACCOUNT.pick({ tokenNonceCount: true }))`
		SELECT
			token_nonce_count AS "tokenNonceCount"
		FROM
			accounts
		WHERE
			profile_id = ${profileId}
		LIMIT
			1
	`);

export const markEmailAsVerified = async (id: Account["id"]) => {
	await (
		await pool
	).query(sql.type(VOID)`
		UPDATE accounts
		SET
			updated_at = NOW(),
			email_verified_at = NOW(),
			token_nonce = ''
		WHERE
			id = ${id}
	`);
};

export const isEmailVerified = async (email: Account["email"]) => {
	const result = await (
		await pool
	).maybeOneFirst(sql.type(z.object({ isVerified: z.boolean() }))`
		SELECT
			email_verified_at < now() AS "isVerified"
		FROM
			accounts
		WHERE
			email = ${email}::email
			AND email_verified_at IS NOT NULL
		LIMIT
			1
	`);

	return Boolean(result);
};
