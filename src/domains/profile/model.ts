import { z } from "zod/v4";

import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { PROFILE, Profile, PUBLIC_PROFILE } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const get = async (profileId: Profile["id"]) =>
	(await pool).one(sql.type(
		PROFILE.omit({ createdAt: true, updatedAt: true })
	)`
		SELECT
			id,
			name,
			is_welcome_needed
		FROM
			profiles
		WHERE
			id = ${profileId}
	`);

export const getPublic = async (profileId: Profile["id"]) =>
	(await pool).one(sql.type(PUBLIC_PROFILE)`
		SELECT
			id,
			name
		FROM
			profiles
		WHERE
			id = ${profileId}
	`);

export const isEmailVerified = async (profileId: Profile["id"]) =>
	(await pool).oneFirst(sql.type(
		z.object({
			emailVerified: z.boolean()
		})
	)`
		SELECT
			(
				a.email_verified_at IS NOT NULL
				AND a.email_verified_at <= NOW()
			) AS "email_verified"
		FROM
			profiles AS p
			INNER JOIN accounts AS a ON p.id = a.profile_id
		WHERE
			p.id = ${profileId}
		LIMIT
			1
	`);

export const markAsWelcomed = async (profileId: Profile["id"]) => {
	await (
		await pool
	).query(sql.type(VOID)`
		UPDATE profiles
		SET
			is_welcome_needed = FALSE
		WHERE
			id = ${profileId}
	`);
};
