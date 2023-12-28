import { BOOLEAN_NAMED, pool, sql, VOID } from "../_/datastore";

import { PROFILE, Profile, PUBLIC_PROFILE } from "./schema";

export const get = async (profileId: Profile["id"]) =>
	(await pool).one(
		sql.type(PROFILE.omit({ createdAt: true, updatedAt: true }))`
			SELECT
				id,
				name,
				is_welcome_needed AS "isWelcomeNeeded"
			FROM profiles
			WHERE id = ${profileId}
		`
	);

export const getPublic = async (profileId: Profile["id"]) =>
	(await pool).one(
		sql.type(PUBLIC_PROFILE)`
			SELECT
				id,
				name
			FROM profiles
			WHERE id = ${profileId}
		`
	);

export const isEmailVerified = async (profileId: Profile["id"]) =>
	(await pool).oneFirst(
		sql.type(BOOLEAN_NAMED("emailVerified"))`
			SELECT
				(a.email_verified_at IS NOT NULL AND a.email_verified_at <= NOW()) AS "emailVerified"
			FROM profiles AS p
			INNER JOIN accounts AS a ON p.id = a.profile_id
			WHERE p.id = ${profileId}
			LIMIT 1
		`
	);

export const markAsWelcomed = async (profileId: Profile["id"]) => {
	await (
		await pool
	).query(sql.type(VOID)`
		UPDATE profiles
		SET is_welcome_needed = false
		WHERE id = ${profileId}
	`);
};
