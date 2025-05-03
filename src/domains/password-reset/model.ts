import { addMinutes } from "date-fns";

import CodedError, { ERROR_CODE } from "@/library/coded-error";
import * as config from "@/services/config-service/service.mjs";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";
import * as secretService from "@/services/secret-service/service";

import {
	PASSWORD_RESET,
	PASSWORD_RESET_RESET_ATTRS,
	PasswordReset,
	PasswordResetResetAttrs
} from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const create = async ({
	email,
	nonce
}: Pick<PasswordReset, "email" | "nonce">) => {
	const expiresAt = addMinutes(
		new Date(),
		config.sessionAssistancePasswordResetExpiryMinutes
	);

	return (await pool).one(sql.type(PASSWORD_RESET)`
		INSERT INTO
			password_resets (email, nonce, expires_at)
		VALUES
			(
				${email},
				${nonce},
				${expiresAt.toJSON()}
			)
		ON CONFLICT (email) DO UPDATE
		SET
			updated_at = DEFAULT,
			nonce = EXCLUDED.nonce,
			expires_at = EXCLUDED.expires_at
		RETURNING
			id,
			created_at AS "createdAt",
			updated_at AS "updatedAt",
			expires_at AS "expiresAt",
			email,
			nonce
	`);
};

export const reset = async (attrs: PasswordResetResetAttrs) => {
	const { email, nonce, password, passwordConfirmation } =
		await PASSWORD_RESET_RESET_ATTRS.parseAsync(attrs);

	if (passwordConfirmation !== password) {
		throw new CodedError(ERROR_CODE.CONFIRMATION_MISMATCH, {
			path: ["passwordConfirmation"]
		});
	}

	const hashword = await secretService.hash(password);

	return (await pool).transaction(async (transaction) => {
		const { rowCount } = await transaction.query(sql.type(VOID)`
			WITH
				resettable_account AS (
					SELECT
						a.id AS account_id
					FROM
						accounts AS a
						INNER JOIN password_resets AS pr ON a.email = pr.email
					WHERE
						a.email = ${email}::email
						AND a.email_verified_at < now()
						AND pr.nonce = ${nonce}
						AND pr.expires_at > now()
				)
			UPDATE accounts
			SET
				hashword = ${hashword}
			FROM
				resettable_account
			WHERE
				id = resettable_account.account_id
		`);

		const success = rowCount === 1;

		if (success) {
			await transaction.query(sql.type(VOID)`
				DELETE FROM password_resets
				WHERE
					email = ${email}::email
					AND nonce = ${nonce}
			`);
		}

		return success;
	});
};

export const clearExpired = async () => {
	await (
		await pool
	).query(sql.type(VOID)`
		DELETE FROM password_resets
		WHERE
			expires_at <= NOW()
	`);
};
