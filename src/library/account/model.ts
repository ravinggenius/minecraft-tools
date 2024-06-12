import "server-only";
import { z } from "zod";

import { BOOLEAN_NAMED, pool, sql, VOID } from "@/services/datastore-service";
import * as secretService from "@/services/secret-service";

import CodedError, { ERROR_CODE } from "../_/errors/coded-error";
import { Profile } from "../profile/schema";

import {
	ACCOUNT,
	Account,
	ACCOUNT_CREATE_ATTRS,
	AccountCreateAttrs
} from "./schema";

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
		const alreadyExists = await transaction.oneFirst(
			sql.type(BOOLEAN_NAMED("alreadyExists"))`
				SELECT count(id) > 0 AS "alreadyExists"
				FROM accounts
				WHERE email = ${account.email}
			`
		);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["account", "email"]
			});
		}

		return transaction.one(
			sql.type(
				ACCOUNT.pick({
					email: true,
					tokenNonce: true
				})
			)`
				WITH profile AS (
					INSERT INTO profiles (name)
					VALUES (${profile.name})
					RETURNING id
				)
				INSERT INTO accounts (profile_id, email, hashword, token_nonce)
				VALUES ((SELECT id FROM profile), ${account.email}, ${hashword}, ${tokenNonce})
				RETURNING
					email,
					token_nonce AS "tokenNonce"
			`
		);
	});
};

export const findByEmail = async (email: Account["email"]) => {
	const maybeAccountPlusHashword = await (
		await pool
	).maybeOne(
		sql.type(ACCOUNT.extend({ hashword: z.string() }))`
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
			FROM accounts
			WHERE email = ${email}::email
			LIMIT 1
		`
	);

	return maybeAccountPlusHashword || undefined;
};

export const updateVerificationNonce = async (
	profileId: Profile["id"],
	tokenNonce: Account["tokenNonce"]
) =>
	(await pool).one(
		sql.type(
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
			WHERE profile_id = ${profileId}
			RETURNING
				id,
				profile_id AS "profileId",
				email,
				token_nonce AS "tokenNonce"
		`
	);

export const getTokenNonceCount = async (profileId: Profile["id"]) =>
	(await pool).oneFirst(
		sql.type(ACCOUNT.pick({ tokenNonceCount: true }))`
			SELECT token_nonce_count AS "tokenNonceCount"
			FROM accounts
			WHERE profile_id = ${profileId}
			LIMIT 1
		`
	);

export const markEmailAsVerified = async (id: Account["id"]) => {
	await (
		await pool
	).query(
		sql.type(VOID)`
			UPDATE accounts
			SET
				updated_at = NOW(),
				email_verified_at = NOW(),
				token_nonce = ''
			WHERE id = ${id}
		`
	);
};

export const isEmailVerified = async (email: Account["email"]) => {
	const result = await (
		await pool
	).maybeOneFirst(
		sql.type(z.object({ isVerified: z.boolean() }))`
			SELECT email_verified_at < now() AS "isVerified"
			FROM accounts
			WHERE email = ${email}::email
			AND email_verified_at IS NOT NULL
			LIMIT 1
		`
	);

	return Boolean(result);
};
