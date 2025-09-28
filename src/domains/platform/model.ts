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
import {
	Include,
	NORMALIZED_PLATFORM,
	NormalizedPlatform
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(PLATFORM)`
		SELECT
			id,
			created_at,
			updated_at,
			name
		FROM
			platforms
		ORDER BY
			name ASC
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
			id,
			created_at,
			updated_at,
			name
		FROM
			platforms
		WHERE
			id = ${platformId}
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

export const searchNormalized = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const mayRead = await confirmAuthorization(["read", "any", "platform"]);

	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		mayRead && include.isAvailableForTools !== undefined
			? sql.fragment`(is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayRead ? undefined : sql.fragment`is_available_for_tools = ${true}`,
		includeText
			? sql.fragment`(
				(name LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(
					EXISTS (
						SELECT 1
						FROM unnest(editions) AS e
						WHERE e::citext LIKE ANY(${sql.array(includeText, "citext")})
					)
				)
			)`
			: undefined,
		include.name
			? sql.fragment`(name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"text"
				)}))`
			: undefined,
		include.edition
			? sql.fragment`(editions::citext[] && ${sql.array(include.edition, "citext")})`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_platforms
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(NORMALIZED_PLATFORM)`
		SELECT
			id,
			name,
			releases_count,
			editions::text[],
			is_available_for_tools
		FROM
			normalized_platforms
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			name ASC
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
			}) satisfies SearchResults<NormalizedPlatform>
	);
};
