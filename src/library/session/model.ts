import bcrypt from "bcrypt";
import { add } from "date-fns";
import "server-only";

import CodedError, { ERROR_CODE } from "@/library/_/errors/coded-error";
import * as accountModel from "@/library/account/model";
import { ACCOUNT } from "@/library/account/schema";
import * as config from "@/services/config-service.mjs";
import { pool, sql, VOID } from "@/services/datastore-service";

import {
	SESSION,
	Session,
	SESSION_CREDENTIALS,
	SessionCredentials
} from "./schema";

export const create = async (attrs: SessionCredentials) => {
	const { email, password } = await SESSION_CREDENTIALS.parseAsync(attrs);

	const maybeAccountPlusHashword = await accountModel.findByEmail(email);

	if (!maybeAccountPlusHashword) {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}

	const { id: accountId, hashword } = maybeAccountPlusHashword;

	if (await bcrypt.compare(password, hashword)) {
		const expiresAt = add(new Date(), {
			seconds: config.sessionMaxAgeSeconds
		});

		return (await pool).one(
			sql.type(SESSION)`
				INSERT INTO sessions (account_id, expires_at)
				VALUES (${accountId}, ${expiresAt.toJSON()})
				RETURNING
					id,
					created_at AS "createdAt",
					updated_at AS "updatedAt",
					expires_at AS "expiresAt",
					account_id AS "accountId"
			`
		);
	} else {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}
};

export const verify = async (sessionId: Session["id"]) =>
	(await pool).maybeOne(
		sql.type(ACCOUNT.pick({ profileId: true }))`
			SELECT a.profile_id AS "profileId"
			FROM accounts AS a
			INNER JOIN sessions AS s ON a.id = s.account_id
			WHERE s.id = ${sessionId}
			AND s.expires_at > NOW()
			LIMIT 1
		`
	);

export const destroy = async (sessionId: Session["id"]) => {
	await (
		await pool
	).query(sql.type(VOID)`
		DELETE FROM sessions
		WHERE id = ${sessionId}
	`);
};

export const clearExpired = async () => {
	await (
		await pool
	).query(sql.type(VOID)`
		DELETE FROM sessions
		WHERE expires_at <= NOW()
	`);
};
