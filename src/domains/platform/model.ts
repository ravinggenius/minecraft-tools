import { z } from "zod/v4";

import { confirmAuthorization } from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { EDITION } from "../release/schema";

import { PLATFORM } from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

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

	const countQuery = expand
		? sql.type(COUNT)`
				SELECT
					count(*) AS count
				FROM
					(
						SELECT
							count(*) AS count
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
							p.id,
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

	const dataQuery = expand
		? sql.type(EXTENDED_PLATFORM)`
				SELECT
					p.id,
					p.name,
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
					platforms AS p
					LEFT OUTER JOIN platform_releases AS pr ON p.id = pr.platform_id
					LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
				${
					whereClauses.length
						? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
						: sql.fragment``
				}
				GROUP BY
					p.id,
					r.edition
				ORDER BY
					p.name ASC
				LIMIT
					${limit}
				OFFSET
					${offset}
			`
		: sql.type(EXTENDED_PLATFORM)`
				SELECT
					p.id,
					p.name,
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
