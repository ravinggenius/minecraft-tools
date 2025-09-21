import { z } from "zod/v4";

import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { EDITION } from "../release/schema";

import { RELEASE_CYCLE, ReleaseCycle, ReleaseCycleAttrs } from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(RELEASE_CYCLE)`
		SELECT
			rc.id,
			rc.created_at AS "createdAt",
			rc.updated_at AS "updatedAt",
			rc.name
		FROM
			release_cycles AS rc
		ORDER BY
			rc.name ASC
	`);

export const create = async (attrs: ReleaseCycleAttrs) => {
	await enforceAuthorization(["create", "new", "release-cycle"]);

	return (await pool).one(sql.type(RELEASE_CYCLE)`
		INSERT INTO release_cycles (name)
		VALUES (${attrs.name})
		ON CONFLICT (name) DO UPDATE
		SET
			updated_at = DEFAULT
		RETURNING
			id,
			created_at AS "createdAt",
			updated_at AS "updatedAt",
			name
	`);
};

export const get = async (releaseCycleId: ReleaseCycle["id"]) => {
	await enforceAuthorization(["read", "any", "release-cycle"]);

	return (await pool).maybeOne(sql.type(RELEASE_CYCLE)`
		SELECT
			rc.id,
			rc.created_at AS "createdAt",
			rc.updated_at AS "updatedAt",
			rc.name
		FROM
			release_cycles AS rc
		WHERE
			rc.id = ${releaseCycleId}
	`);
};

export const update = async (
	releaseCycleId: ReleaseCycle["id"],
	attrs: ReleaseCycleAttrs
) => {
	await enforceAuthorization(["update", "any", "release-cycle"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "alreadyExists"
			FROM
				release_cycles
			WHERE
				name = ${attrs.name}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["name"]
			});
		}

		return transaction.one(sql.type(RELEASE_CYCLE)`
			UPDATE release_cycles
			SET
				updated_at = DEFAULT,
				name = ${attrs.name}
			WHERE id = ${releaseCycleId}
			RETURNING
				id,
				created_at AS "createdAt",
				updated_at AS "updatedAt",
				name
		`);
	});
};

export const EXTENDED_RELEASE_CYCLE = RELEASE_CYCLE.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	editions: z.array(EDITION),
	releasesCount: z.int().nonnegative()
});

export type ExtendedReleaseCycle = z.infer<typeof EXTENDED_RELEASE_CYCLE>;

export const search = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const mayRead = await confirmAuthorization([
		"read",
		"any",
		"release-cycle"
	]);

	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		mayRead && include.isAvailableForTools !== undefined
			? sql.fragment`(r.is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayRead
			? undefined
			: sql.fragment`(r.is_available_for_tools = ${true})`,
		includeText
			? sql.fragment`(
				(rc.name LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(r.edition::citext LIKE ANY(${sql.array(includeText, "text")}))
			)`
			: undefined,
		include.name
			? sql.fragment`(rc.name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"text"
				)}))`
			: undefined,
		include.edition
			? sql.fragment`(r.edition = ANY(${sql.array(include.edition, "edition")}))`
			: undefined
	].filter(Boolean);

	const countQuery = expand
		? sql.type(COUNT)`
				SELECT
					count(*) AS count
				FROM
					(
						SELECT
							count(*) AS count
						FROM
							release_cycles AS rc
							LEFT OUTER JOIN releases AS r ON r.cycle_id = rc.id
						${
							whereClauses.length
								? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
								: sql.fragment``
						}
						GROUP BY
							rc.id,
							r.edition
					)
			`
		: sql.type(COUNT)`
				SELECT
					count(*) AS count
				FROM
					(
						SELECT
							count(*)
						FROM
							release_cycles AS rc
							LEFT OUTER JOIN releases AS r ON r.cycle_id = rc.id
						${
							whereClauses.length
								? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
								: sql.fragment``
						}
						GROUP BY
							rc.id
					)
			`;

	const dataQuery = expand
		? sql.type(EXTENDED_RELEASE_CYCLE)`
				SELECT
					rc.id,
					rc.name,
					count(r.id)::int AS "releasesCount",
					COALESCE(
						json_agg(
							DISTINCT r.edition
							ORDER BY
								r.edition
						) FILTER (
							WHERE
								r.edition IS NOT NULL
						),
						'[]'::json
					) AS editions
				FROM
					release_cycles AS rc
					LEFT OUTER JOIN releases AS r ON r.cycle_id = rc.id
				${
					whereClauses.length
						? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
						: sql.fragment``
				}
				GROUP BY
					rc.id,
					r.edition
				ORDER BY
					rc.name ASC
				LIMIT
					${limit}
				OFFSET
					${offset}
			`
		: sql.type(EXTENDED_RELEASE_CYCLE)`
				SELECT
					rc.id,
					rc.name,
					count(r.id)::int AS "releasesCount",
					COALESCE(
						json_agg(
							DISTINCT r.edition
							ORDER BY
								r.edition
						) FILTER (
							WHERE
								r.edition IS NOT NULL
						),
						'[]'::json
					) AS editions
				FROM
					release_cycles AS rc
					LEFT OUTER JOIN releases AS r ON r.cycle_id = rc.id
				${
					whereClauses.length
						? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
						: sql.fragment``
				}
				GROUP BY
					rc.id
				ORDER BY
					rc.name ASC
				LIMIT
					${limit}
				OFFSET
					${offset}
			`;

	return (await pool).transaction(
		async (tx) =>
			({
				count: await tx.oneFirst(countQuery),
				data: await tx.any(dataQuery)
			}) satisfies SearchResults<ExtendedReleaseCycle>
	);
};
