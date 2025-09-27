import { z } from "zod/v4";

import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { EDITION } from "../release/schema";

import { Platform, PLATFORM, PlatformAttrs } from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(PLATFORM)`
		SELECT
			p.id,
			p.created_at,
			p.updated_at,
			p.name
		FROM
			platforms AS p
		ORDER BY
			p.name ASC
	`);

export const create = async (attrs: PlatformAttrs) => {
	await enforceAuthorization(["create", "new", "platform"]);

	return (await pool).one(sql.type(PLATFORM)`
		INSERT INTO platforms (name)
		VALUES (${attrs.name})
		ON CONFLICT (name) DO UPDATE
		SET
			updated_at = DEFAULT
		RETURNING
			id,
			created_at,
			updated_at,
			name
	`);
};

export const get = async (platformId: Platform["id"]) => {
	await enforceAuthorization(["read", "any", "platform"]);

	return (await pool).one(sql.type(PLATFORM)`
		SELECT
			p.id,
			p.created_at,
			p.updated_at,
			p.name
		FROM
			platforms AS p
		WHERE
			p.id = ${platformId}
	`);
};

export const update = async (
	platformId: Platform["id"],
	attrs: PlatformAttrs
) => {
	await enforceAuthorization(["update", "any", "platform"]);

	return (await pool).transaction(async (transaction) => {
		const alreadyExists = await transaction.oneFirst(sql.type(
			z.object({
				alreadyExists: z.boolean()
			})
		)`
			SELECT
				count(id) > 0 AS "already_exists"
			FROM
				platforms
			WHERE
				name = ${attrs.name}
		`);

		if (alreadyExists) {
			throw new CodedError(ERROR_CODE.DUPLICATE_ENTRY, {
				path: ["name"]
			});
		}

		return transaction.one(sql.type(PLATFORM)`
			UPDATE platforms
			SET
				updated_at = DEFAULT,
				name = ${attrs.name}
			WHERE id = ${platformId}
			RETURNING
				id,
				created_at,
				updated_at,
				name
		`);
	});
};

export const EXTENDED_PLATFORM = PLATFORM.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	editions: z.array(EDITION),
	releasesCount: z.int().nonnegative()
});

export type ExtendedPlatform = z.infer<typeof EXTENDED_PLATFORM>;

export const search = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const mayRead = await confirmAuthorization(["read", "any", "platform"]);

	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		mayRead && include.isAvailableForTools !== undefined
			? sql.fragment`(r.is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayRead ? undefined : sql.fragment`r.is_available_for_tools = ${true}`,
		includeText
			? sql.fragment`(
				(p.name LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(r.edition::citext LIKE ANY(${sql.array(includeText, "text")}))
			)`
			: undefined,
		include.name
			? sql.fragment`(p.name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"text"
				)}))`
			: undefined,
		include.edition
			? sql.fragment`(r.edition = ANY(${sql.array(include.edition, "edition")}))`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			(
				SELECT
					count(*)
				FROM
					platforms AS p
					LEFT OUTER JOIN platform_releases AS pr ON p.id = pr.platform_id
					LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
				${
					whereClauses.length
						? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
						: sql.fragment``
				}
				GROUP BY
					p.id
			)
	`;

	const dataQuery = sql.type(EXTENDED_PLATFORM)`
		SELECT
			p.id,
			p.name,
			count(r.id)::int AS "releases_count",
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
			platforms AS p
			LEFT OUTER JOIN platform_releases AS pr ON p.id = pr.platform_id
			LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		GROUP BY
			p.id
		ORDER BY
			p.name ASC
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
			}) satisfies SearchResults<ExtendedPlatform>
	);
};
