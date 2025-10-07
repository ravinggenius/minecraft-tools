import { z } from "zod/v4";

import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { RELEASE_CYCLE } from "../release-cycle/schema";

import {
	FLATTENED_RELEASE,
	FlattenedRelease,
	ImportRelease,
	NORMALIZED_RELEASE,
	NormalizedRelease,
	PLATFORM_RELEASE,
	Release,
	RELEASE,
	ReleaseAttrs,
	UPCOMING
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const get = async (releaseId: Release["id"]) =>
	(await pool).maybeOne(sql.type(NORMALIZED_RELEASE)`
		SELECT
			id,
			edition,
			version,
			cycle,
			development_released_on,
			first_production_released_on,
			changelog,
			is_latest,
			is_available_for_tools,
			platforms
		FROM
			normalized_releases
		WHERE
			id = ${releaseId}
	`);

export const mostRecentCycleId = async () =>
	(await pool).oneFirst(sql.type(RELEASE_CYCLE.pick({ id: true }).partial())`
		SELECT
			rc.id
		FROM
			release_cycles AS rc
			RIGHT OUTER JOIN releases AS r ON r.cycle_id = rc.id
		ORDER BY
			r.created_at DESC
		LIMIT
			1
	`);

export const create = async (attrs: ReleaseAttrs) => {
	await enforceAuthorization(["create", "new", "release"]);

	return (await pool).any(sql.type(VOID)`
		WITH
			the_release AS (
				INSERT INTO
					releases (edition, version, cycle_id, development_released_on, changelog, is_available_for_tools)
				VALUES
					(
						${attrs.edition},
						${attrs.version},
						${attrs.cycle?.id ?? null},
						${attrs.developmentReleasedOn ? sql.date(new Date(attrs.developmentReleasedOn)) : null},
						${attrs.changelog ?? null},
						${attrs.isAvailableForTools}
					)
				ON CONFLICT (edition, version) DO UPDATE
				SET
					updated_at = DEFAULT,
					edition = ${attrs.edition},
					version = ${attrs.version},
					cycle_id = ${attrs.cycle?.id ?? null},
					development_released_on = ${attrs.developmentReleasedOn ? sql.date(new Date(attrs.developmentReleasedOn)) : null},
					changelog = ${attrs.changelog ?? null},
					is_available_for_tools = ${attrs.isAvailableForTools}
				RETURNING
					id
			)
		INSERT INTO
			platform_releases (release_id, platform_id, production_released_on)
		SELECT
			r.id AS release_id,
			dates.platform_id,
			dates.production_released_on
		FROM
			the_release AS r,
			jsonb_to_recordset(${sql.jsonb(
				attrs.platforms.map(({ id, productionReleasedOn }) => ({
					platform_id: id,
					production_released_on: productionReleasedOn
				}))
			)}) AS dates(platform_id uuid, production_released_on date)
	`);
};

export const update = async (releaseId: Release["id"], attrs: ReleaseAttrs) => {
	await enforceAuthorization(["update", "any", "release"]);

	return (await pool).any(sql.type(VOID)`
		WITH
			the_release AS (
				UPDATE releases
				SET
					updated_at = DEFAULT,
					edition = ${attrs.edition},
					version = ${attrs.version},
					cycle_id = ${attrs.cycle?.id ?? null},
					development_released_on = ${attrs.developmentReleasedOn ? sql.date(new Date(attrs.developmentReleasedOn)) : null},
					changelog = ${attrs.changelog ?? null},
					is_available_for_tools = ${attrs.isAvailableForTools}
				WHERE id = ${releaseId}
				RETURNING
					id
			)
		MERGE INTO platform_releases AS target
		USING (
			SELECT
				r.id AS release_id,
				dates.platform_id,
				dates.production_released_on
			FROM
				the_release AS r,
				jsonb_to_recordset(${sql.jsonb(
					attrs.platforms.map(({ id, productionReleasedOn }) => ({
						platform_id: id,
						production_released_on: productionReleasedOn
					}))
				)}) AS dates(platform_id uuid, production_released_on date)
		) AS source
		ON target.release_id = source.release_id AND target.platform_id = source.platform_id
		WHEN MATCHED THEN
			UPDATE SET
				updated_at = DEFAULT,
				production_released_on = source.production_released_on
		WHEN NOT MATCHED BY SOURCE AND target.release_id = ${releaseId} THEN DELETE
		WHEN NOT MATCHED THEN
			INSERT (release_id, platform_id, production_released_on)
			VALUES (source.release_id, source.platform_id, source.production_released_on)
	`);
};

export const destroy = async (releaseId: Release["id"]) => {
	await enforceAuthorization(["destroy", "any", "release"]);

	(await pool).any(sql.type(VOID)`
		DELETE FROM releases
		WHERE id = ${releaseId}
	`);
};

const commonSearchConditions = async ({
	include,
	exclude
}: SearchParams<Include>["conditions"]) => {
	const mayReadAny = await confirmAuthorization(["read", "any", "release"]);

	return [
		mayReadAny && include.isAvailableForTools !== undefined
			? sql.fragment`(is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayReadAny ? undefined : sql.fragment`is_available_for_tools = ${true}`,
		include.edition
			? sql.fragment`(edition = ANY(${sql.array(include.edition, "edition")}))`
			: undefined,
		include.version
			? sql.fragment`(version LIKE ANY(${sql.array(
					include.version.map((version) => `${version}%`),
					"citext"
				)}))`
			: undefined,
		include.cycleName
			? sql.fragment`((cycle ->> 'name')::citext LIKE ANY(${sql.array(
					include.cycleName.map((name) => `%${name}%`),
					"citext"
				)}))`
			: undefined,
		include.isLatest === undefined
			? undefined
			: sql.fragment`(is_latest = ${include.isLatest})`,
		include.firstProductionReleasedOn?.from
			? sql.fragment`(first_production_released_on >= ${sql.date(include.firstProductionReleasedOn.from)})`
			: undefined,
		include.firstProductionReleasedOn?.to
			? sql.fragment`(first_production_released_on <= ${sql.date(include.firstProductionReleasedOn.to)})`
			: undefined
	].filter(Boolean);
};

export const searchFlattened = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		...(await commonSearchConditions({ include, exclude })),
		includeText
			? sql.fragment`(
				(edition::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(version LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((cycle ->> 'name')::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((platform ->> 'name')::citext LIKE ANY(${sql.array(includeText, "citext")}))
			)`
			: undefined,
		include.platformName
			? sql.fragment`((platform ->> 'name')::citext LIKE ANY(${sql.array(
					include.platformName.map((platform) => `%${platform}%`),
					"citext"
				)}))`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			flattened_releases
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(FLATTENED_RELEASE)`
		SELECT
			id,
			release_id,
			edition,
			version,
			cycle,
			development_released_on,
			changelog,
			is_latest,
			is_available_for_tools,
			platform
		FROM
			flattened_releases
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			platform ->> 'production_released_on' DESC,
			edition ASC,
			"version" ASC,
			platform ->> 'name' ASC
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
			}) satisfies SearchResults<FlattenedRelease> as SearchResults<FlattenedRelease>
	);
};

export const searchNormalized = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		...(await commonSearchConditions({ include, exclude })),
		includeText
			? sql.fragment`(
				(edition::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(version LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				((cycle ->> 'name')::citext LIKE ANY(${sql.array(includeText, "citext")}))
				OR
				(
					EXISTS (
						SELECT TRUE
						FROM jsonb_array_elements(platforms) AS platform
						WHERE (platform ->> 'name')::citext LIKE ANY(${sql.array(includeText, "citext")})
					)
				)
			)`
			: undefined,
		include.platformName
			? sql.fragment`(
				EXISTS (
					SELECT TRUE
					FROM jsonb_array_elements(platforms) AS platform
					WHERE (platform ->> 'name')::citext LIKE ANY(${sql.array(
						include.platformName.map((platform) => `%${platform}%`),
						"citext"
					)})
				)
			)`
			: undefined
	].filter(Boolean);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM
			normalized_releases
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(NORMALIZED_RELEASE)`
		SELECT
			id,
			edition,
			version,
			cycle,
			development_released_on,
			first_production_released_on,
			changelog,
			is_latest,
			is_available_for_tools,
			platforms
		FROM
			normalized_releases
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			first_production_released_on DESC,
			edition ASC,
			"version" DESC
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
			}) satisfies SearchResults<NormalizedRelease> as SearchResults<NormalizedRelease>
	);
};

export const listByEdition = async <T extends Release["edition"]>(edition: T) =>
	(await pool).any(sql.type(
		RELEASE.pick({
			version: true
		}).extend({
			position: z.number().nonnegative(),
			edition: z.literal(edition),
			cycleName: RELEASE_CYCLE.shape.name,
			firstProductionReleasedOn:
				PLATFORM_RELEASE.shape.productionReleasedOn.optional()
		})
	)`
		SELECT
			(ROW_NUMBER() OVER (ORDER BY first_production_released_on ASC))::int AS position,
			edition,
			"version",
			cycle ->> 'name' AS cycle_name,
			first_production_released_on
		FROM
			normalized_releases
		WHERE
			edition = ${edition}
		ORDER BY
			first_production_released_on ASC
	`);

export const doImport = async (release: ImportRelease) => {
	return (await pool).transaction(async (tx) => {
		const releaseId = await tx.oneFirst(sql.type(
			RELEASE.pick({ id: true })
		)`
			WITH
				the_cycle AS (
					INSERT INTO
						release_cycles (name)
					VALUES
						(${release.cycleName})
					ON CONFLICT (name) DO UPDATE
					SET
						updated_at = DEFAULT
					RETURNING
						id
				)
			INSERT INTO
				releases (
					cycle_id,
					edition,
					version,
					development_released_on,
					changelog
				)
			SELECT
				c.id,
				${release.edition},
				${release.version},
				${
					release.developmentReleasedOn
						? sql.date(new Date(release.developmentReleasedOn))
						: null
				},
				${release.changelog ?? null}
			FROM
				the_cycle AS c
			ON CONFLICT (edition, version) DO UPDATE
			SET
				updated_at = DEFAULT,
				cycle_id = EXCLUDED.cycle_id,
				development_released_on = EXCLUDED.development_released_on,
				changelog = EXCLUDED.changelog
			RETURNING
				id
		`);

		const rainbow = Object.entries(release.platformsCondensed).map(
			async ([productionReleasedOn, names]) => {
				if (productionReleasedOn === UPCOMING.value) {
					return;
				}

				return tx.one(sql.type(VOID)`
					WITH
						the_platforms AS (
							INSERT INTO
								platforms (name)
							SELECT
								${sql.unnest(
									names.map((name) => [name]),
									["text"]
								)}
							ON CONFLICT (name) DO UPDATE
							SET
								updated_at = DEFAULT
							RETURNING
								id
						)
					INSERT INTO
						platform_releases (release_id, platform_id, production_released_on)
					SELECT
						${releaseId},
						p.id,
						${sql.date(new Date(productionReleasedOn))}
					FROM
						the_platforms AS p
					ON CONFLICT (release_id, platform_id) DO UPDATE
					SET
						updated_at = DEFAULT,
						production_released_on = ${sql.date(new Date(productionReleasedOn))}
				`);
			}
		);

		return Promise.allSettled(rainbow);
	});
};
