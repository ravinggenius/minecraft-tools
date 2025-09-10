import {
	confirmAuthorization,
	enforceAuthorization
} from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import {
	ImportRelease,
	Release,
	RELEASE,
	ReleaseAttrs,
	SPECIFIC_RELEASE,
	SpecificRelease,
	UPCOMING
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const get = async (id: Release["id"]) => {
	return (await pool).maybeOne(sql.type(RELEASE)`
		SELECT
			r.id,
			r.edition,
			r.version,
			r.name,
			r.development_released_on AS "developmentReleasedOn",
			min(pr.production_released_on) AS "firstProductionReleasedOn",
			r.changelog,
			r.is_latest AS "isLatest",
			r.is_available_for_tools AS "isAvailableForTools",
			COALESCE(
				jsonb_agg(jsonb_build_object('platformId', p.id, 'name', p.name, 'productionReleasedOn', pr.production_released_on)) FILTER (
					WHERE
						p.id IS NOT NULL
				),
				'[]'::jsonb
			) AS platforms
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			RIGHT OUTER JOIN releases AS r ON pr.release_id = r.id
		WHERE
			r.id = ${id}
		GROUP BY
			r.id
	`);
};

export const mostRecentName = async () =>
	(await pool).maybeOneFirst(sql.type(RELEASE.pick({ name: true }))`
		SELECT
			name
		FROM
			releases
		ORDER BY
			created_at DESC
		LIMIT
			1
	`);

export const create = async (attrs: ReleaseAttrs) => {
	await enforceAuthorization(["create", "new", "release"]);

	return (await pool).any(sql.type(VOID)`
		WITH
			the_release AS (
				INSERT INTO
					releases (edition, version, name, development_released_on, changelog, is_available_for_tools)
				VALUES
					(
						${attrs.edition},
						${attrs.version},
						${attrs.name ?? null},
						${attrs.developmentReleasedOn ? sql.date(new Date(attrs.developmentReleasedOn)) : null},
						${attrs.changelog ?? null},
						${attrs.isAvailableForTools}
					)
				ON CONFLICT (edition, version) DO UPDATE
				SET
					updated_at = DEFAULT,
					edition = ${attrs.edition},
					version = ${attrs.version},
					name = ${attrs.name ?? null},
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
				attrs.platforms.map(({ platformId, productionReleasedOn }) => ({
					platform_id: platformId,
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
					name = ${attrs.name ?? null},
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
					attrs.platforms.map(
						({ platformId, productionReleasedOn }) => ({
							platform_id: platformId,
							production_released_on: productionReleasedOn
						})
					)
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

const searchConditions = async ({
	include,
	exclude
}: SearchParams<Include>["conditions"]) => {
	const mayReadAny = await confirmAuthorization(["read", "any", "release"]);

	const includeText = include.text?.map((text) => `%${text}%`);

	return [
		mayReadAny && include.isAvailableForTools !== undefined
			? sql.fragment`(r.is_available_for_tools = ${include.isAvailableForTools})`
			: undefined,
		mayReadAny
			? undefined
			: sql.fragment`r.is_available_for_tools = ${true}`,
		includeText
			? sql.fragment`(
				(r.edition::citext LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(r.version LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(r.name LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(p.name LIKE ANY(${sql.array(includeText, "text")}))
			)`
			: undefined,
		include.edition
			? sql.fragment`(r.edition = ANY(${sql.array(include.edition, "edition")}))`
			: undefined,
		include.version
			? sql.fragment`(r.version LIKE ANY(${sql.array(
					include.version.map((version) => `${version}%`),
					"text"
				)}))`
			: undefined,
		include.name
			? sql.fragment`(r.name LIKE ANY(${sql.array(
					include.name.map((name) => `%${name}%`),
					"text"
				)}))`
			: undefined,
		include.isLatest === undefined
			? undefined
			: sql.fragment`(r.is_latest = ${include.isLatest})`,
		include.platform
			? sql.fragment`(p.name LIKE ANY(${sql.array(
					include.platform.map((platform) => `%${platform}%`),
					"text"
				)}))`
			: undefined,
		include.productionReleasedOn?.from
			? sql.fragment`(pr.production_released_on >= ${sql.date(include.productionReleasedOn.from)})`
			: undefined,
		include.productionReleasedOn?.to
			? sql.fragment`(pr.production_released_on <= ${sql.date(include.productionReleasedOn.to)})`
			: undefined
	].filter(Boolean);
};

export const searchExpanded = async ({
	conditions,
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const whereClauses = await searchConditions(conditions);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(r.id) AS count
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			RIGHT OUTER JOIN releases AS r ON pr.release_id = r.id
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(SPECIFIC_RELEASE)`
		SELECT
			COALESCE(pr.id, r.id) AS id,
			r.id AS "releaseId",
			p.name AS "platformName",
			r.edition,
			r.version,
			r.name,
			r.development_released_on AS "developmentReleasedOn",
			pr.production_released_on AS "productionReleasedOn",
			r.changelog,
			r.is_latest AS "isLatest",
			r.is_available_for_tools AS "isAvailableForTools"
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			RIGHT OUTER JOIN releases AS r ON pr.release_id = r.id
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		ORDER BY
			pr.production_released_on DESC,
			r.edition ASC,
			r.version ASC,
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
			}) satisfies SearchResults<SpecificRelease> as SearchResults<SpecificRelease>
	);
};

export const search = async ({
	conditions,
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const whereClauses = await searchConditions(conditions);

	const countQuery = sql.type(COUNT)`
		SELECT
			count(*) AS count
		FROM (
			SELECT
				r.id
			FROM
				platform_releases AS pr
				LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
				RIGHT OUTER JOIN releases AS r ON pr.release_id = r.id
			${
				whereClauses.length
					? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
					: sql.fragment``
			}
			GROUP BY
				r.id
		)
	`;

	const dataQuery = sql.type(RELEASE)`
		SELECT
			r.id,
			r.edition,
			r.version,
			r.name,
			r.development_released_on AS "developmentReleasedOn",
			min(pr.production_released_on) AS "firstProductionReleasedOn",
			r.changelog,
			r.is_latest AS "isLatest",
			r.is_available_for_tools AS "isAvailableForTools",
			COALESCE(
				jsonb_agg(jsonb_build_object('platformId', p.id, 'name', p.name, 'productionReleasedOn', pr.production_released_on)) FILTER (
					WHERE
						p.id IS NOT NULL
				),
				'[]'::jsonb
			) AS platforms
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			RIGHT OUTER JOIN releases AS r ON pr.release_id = r.id
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
		GROUP BY
			r.id
		ORDER BY
			"firstProductionReleasedOn" DESC,
			r.edition ASC,
			r.version ASC
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
			}) satisfies SearchResults<Release> as SearchResults<Release>
	);
};

export const doImport = async (release: ImportRelease) => {
	return (await pool).transaction(async (tx) => {
		const releaseId = await tx.oneFirst(sql.type(
			RELEASE.pick({ id: true })
		)`
			INSERT INTO
				releases (
					edition,
					version,
					name,
					development_released_on,
					changelog
				)
			VALUES
				(
					${release.edition},
					${release.version},
					${release.name ?? null},
					${
						release.developmentReleasedOn
							? sql.date(new Date(release.developmentReleasedOn))
							: null
					},
					${release.changelog ?? null}
				)
			ON CONFLICT (edition, version) DO UPDATE
			SET
				updated_at = DEFAULT,
				name = EXCLUDED.name,
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
