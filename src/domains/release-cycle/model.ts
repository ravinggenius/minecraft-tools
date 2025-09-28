import { z } from "zod/v4";

import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import CodedError, { ERROR_CODE } from "@/library/coded-error";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { RELEASE_CYCLE, ReleaseCycle, ReleaseCycleAttrs } from "./schema";
import {
	FLATTENED_RELEASE_CYCLE,
	FlattenedReleaseCycle,
	Include,
	NORMALIZED_RELEASE_CYCLE,
	NormalizedReleaseCycle
} from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(RELEASE_CYCLE)`
		SELECT
			rc.id,
			rc.created_at,
			rc.updated_at,
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
			created_at,
			updated_at,
			name
	`);
};

export const get = async (releaseCycleId: ReleaseCycle["id"]) => {
	await enforceAuthorization(["read", "any", "release-cycle"]);

	return (await pool).maybeOne(sql.type(RELEASE_CYCLE)`
		SELECT
			id,
			created_at,
			updated_at,
			name
		FROM
			release_cycles
		WHERE
			id = ${releaseCycleId}
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
				count(id) > 0 AS "already_exists"
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
				created_at,
				updated_at,
				name
		`);
	});
};

const commonSearchConditions = async ({
	include,
	exclude
}: SearchParams<Include>["conditions"]) =>
	[
		include.name
			? sql.fragment`(name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"citext"
				)}))`
			: undefined
	].filter(Boolean);

export const searchFlattened = async ({
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
		...(await commonSearchConditions({ include, exclude })),
		mayRead && include.isAvailableForTools !== undefined
			? sql.fragment`((release ->> 'is_available_for_tools') = ${include.isAvailableForTools})`
			: undefined,
		mayRead
			? undefined
			: sql.fragment`((release ->> 'is_available_for_tools') = ${true})`,
		includeText
			? sql.fragment`(
				(name LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((release ->> 'edition')::citext LIKE ANY(${sql.array(includeText, "citext")}))
			)`
			: undefined,
		include.edition
			? sql.fragment`((release ->> 'edition')::citext = ANY(${sql.array(include.edition, "citext")}))`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			flattened_release_cycles
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(FLATTENED_RELEASE_CYCLE)`
		SELECT
			id,
			name,
			release
		FROM
			flattened_release_cycles
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			release ->> 'production_released_on' DESC NULLS FIRST
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
			}) satisfies SearchResults<FlattenedReleaseCycle> as SearchResults<FlattenedReleaseCycle>
	);
};

export const searchNormalized = async ({
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
		...(await commonSearchConditions({ include, exclude })),
		mayRead && include.isAvailableForTools !== undefined
			? sql.fragment`(is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayRead ? undefined : sql.fragment`(is_available_for_tools = ${true})`,
		includeText
			? sql.fragment`(
				(name LIKE ANY(${sql.array(includeText, "citext")}))
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
		include.edition
			? sql.fragment`(editions::citext[] && ${sql.array(include.edition, "citext")})`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_release_cycles
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(NORMALIZED_RELEASE_CYCLE)`
		SELECT
			id,
			name,
			releases_count,
			editions::text[],
			first_production_released_on,
			is_available_for_tools
		FROM
			normalized_release_cycles
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			first_production_released_on DESC NULLS FIRST
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
			}) satisfies SearchResults<NormalizedReleaseCycle> as SearchResults<NormalizedReleaseCycle>
	);
};
