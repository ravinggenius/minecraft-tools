import { confirmAuthorization } from "@/library/authorization";
import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { PLATFORM_RELEASE } from "../platform-release/schema";

import {
	ImportRelease,
	Release,
	RELEASE,
	SPECIFIC_RELEASE,
	SpecificRelease,
	UPCOMING
} from "./schema";
import { Include } from "./search.schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

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
			count(pr.id) AS count
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
		${
			whereClauses.length
				? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
				: sql.fragment``
		}
	`;

	const dataQuery = sql.type(SPECIFIC_RELEASE)`
		SELECT
			pr.id,
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
			LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
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
				LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
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
			jsonb_agg(jsonb_build_object('platformId', p.id, 'name', p.name, 'productionReleasedOn', pr.production_released_on)) AS platforms
		FROM
			platform_releases AS pr
			LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id
			LEFT OUTER JOIN releases AS r ON pr.release_id = r.id
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
	const rainbow = Object.entries(release.platformsCondensed).map(
		async ([productionReleasedOn, names]) => {
			if (productionReleasedOn === UPCOMING.value) {
				return;
			}

			return (await pool).one(sql.type(
				PLATFORM_RELEASE.pick({
					id: true,
					platformId: true,
					releaseId: true
				})
			)`
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
							id,
							name
					),
					the_release AS (
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
										? sql.date(
												release.developmentReleasedOn
											)
										: null
								},
								${release.changelog ?? null}
							)
						ON CONFLICT (edition, version) DO UPDATE
						SET
							updated_at = DEFAULT,
							development_released_on = EXCLUDED.development_released_on,
							changelog = EXCLUDED.changelog
						RETURNING
							id,
							created_at,
							updated_at,
							edition,
							version,
							name,
							development_released_on,
							changelog,
							is_latest
					)
				INSERT INTO
					platform_releases (platform_id, release_id, production_released_on)
				SELECT
					p.id,
					r.id,
					${sql.date(new Date(productionReleasedOn))}
				FROM
					the_platforms AS p,
					the_release AS r
				ON CONFLICT (platform_id, release_id) DO UPDATE
				SET
					updated_at = DEFAULT,
					production_released_on = ${sql.date(new Date(productionReleasedOn))}
				RETURNING
					id,
					platform_id AS "platformId",
					release_id AS "releaseId"
			`);
		}
	);

	return Promise.allSettled(rainbow);
};
