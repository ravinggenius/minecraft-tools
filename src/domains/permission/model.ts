import { z } from "zod/v4";

import { pool, sql } from "@/services/datastore-service/service";

import { Profile } from "../profile/schema";

import { Assertion } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

const SUBJECT_TABLES = {
	profile: sql.identifier(["profiles"]),
	world: sql.identifier(["worlds"])
} as const;

export const mayContinue = async (
	profileId: Profile["id"],
	assertions: Array<Assertion>
) => {
	const subSelects = assertions.map((assertion) => {
		if (assertion.scope === "own" && assertion.subject === "profile") {
			return sql.fragment`
				SELECT count(*) AS matching_permissions
				FROM permissions AS p
				INNER JOIN ${SUBJECT_TABLES[assertion.subject]} AS subject
					ON p.profile_id = subject.id
				WHERE p.profile_id = ${profileId}
				AND p.action = ${assertion.action}::permission_action
				AND p.scope = ${assertion.scope}::permission_scope
				AND p.subject = ${assertion.subject}::permission_subject
				AND p.auxiliary IS NULL
			`;
		} else if (assertion.scope === "own" && assertion.subject === "world") {
			return sql.fragment`
				SELECT count(*) AS matching_permissions
				FROM permissions AS p
				INNER JOIN ${SUBJECT_TABLES[assertion.subject]} AS subject
					USING(profile_id)
				WHERE p.profile_id = ${profileId}
				AND p.action = ${assertion.action}::permission_action
				AND p.scope = ${assertion.scope}::permission_scope
				AND p.subject = ${assertion.subject}::permission_subject
				AND p.auxiliary IS NULL
			`;
		} else if (assertion.scope === "one" && assertion.subject === "world") {
			return sql.fragment`
				SELECT count(*) AS matching_permissions
				FROM permissions AS p
				WHERE p.profile_id = ${profileId}
				AND p.action = ${assertion.action}::permission_action
				AND p.scope = ${assertion.scope}::permission_scope
				AND p.subject = ${assertion.subject}::permission_subject
				AND p.auxiliary->>'worldId' = ${assertion.auxiliary.worldId}
			`;
		} else {
			return sql.fragment`
				SELECT count(*) AS matching_permissions
				FROM permissions
				WHERE profile_id = ${profileId}
				AND action = ${assertion.action}::permission_action
				AND scope = ${assertion.scope}::permission_scope
				AND subject = ${assertion.subject}::permission_subject
				AND auxiliary IS NULL
			`;
		}
	});

	return (await pool).oneFirst(sql.type(
		z.object({
			mayContinue: z.boolean()
		})
	)`
		SELECT sum(matching_permissions) > 0 AS "may_continue"
		FROM (
			${sql.join(
				subSelects,
				sql.fragment`
					UNION ALL
				`
			)}
		)
	`);
};
