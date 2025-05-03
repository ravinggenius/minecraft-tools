import { add } from "date-fns";

import CodedError, { ERROR_CODE } from "@/library/coded-error";
import * as config from "@/services/config-service/service.mjs";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";
import * as secretService from "@/services/secret-service/service";

import * as accountModel from "../account/model";
import { ACCOUNT } from "../account/schema";

import {
	SESSION,
	Session,
	SESSION_CREDENTIALS,
	SessionCredentials
} from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const create = async (attrs: SessionCredentials) => {
	const { email, password } = await SESSION_CREDENTIALS.parseAsync(attrs);

	const maybeAccountPlusHashword = await accountModel.findByEmail(email);

	if (!maybeAccountPlusHashword) {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}

	const { id: accountId, hashword } = maybeAccountPlusHashword;

	if (await secretService.compare(password, hashword)) {
		const expiresAt = add(new Date(), {
			seconds: config.sessionMaxAgeSeconds
		});

		return (await pool).one(sql.type(SESSION)`
			INSERT INTO
				sessions (account_id, expires_at)
			VALUES
				(
					${accountId},
					${expiresAt.toJSON()}
				)
			RETURNING
				id,
				created_at AS "createdAt",
				updated_at AS "updatedAt",
				expires_at AS "expiresAt",
				account_id AS "accountId"
		`);
	} else {
		throw new CodedError(ERROR_CODE.CREDENTIALS_INVALID);
	}
};

export const verify = async (sessionId: Session["id"]) =>
	(await pool).maybeOne(sql.type(ACCOUNT.pick({ profileId: true }))`
		SELECT
			a.profile_id AS "profileId"
		FROM
			accounts AS a
			INNER JOIN sessions AS s ON a.id = s.account_id
		WHERE
			s.id = ${sessionId}
			AND s.expires_at > NOW()
		LIMIT
			1
	`);

export const destroy = async (sessionId: Session["id"]) => {
	await (
		await pool
	).query(sql.type(VOID)`
		DELETE FROM sessions
		WHERE
			id = ${sessionId}
	`);
};

export const clearExpired = async () => {
	await (
		await pool
	).query(sql.type(VOID)`
		DELETE FROM sessions
		WHERE
			expires_at <= NOW()
	`);
};
