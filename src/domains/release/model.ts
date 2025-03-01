import { z } from "zod";

import { COUNT, SearchParams, SearchResults } from "@/library/search";
import { pool, sql } from "@/services/datastore-service/service";

import { PLATFORM_RELEASE } from "../platform-release/schema";
import { PLATFORM } from "../platform/schema";

import { ImportRelease, RELEASE, UPCOMING } from "./schema";
import { Include } from "./search.schema";

export const EXTENDED_RELEASE = RELEASE.omit({
	createdAt: true,
	updatedAt: true
}).extend({
	productionReleasedOn: z.coerce.date(),
	platformReleases: z.array(
		z.object({
			id: PLATFORM.shape.id,
			name: PLATFORM.shape.name,
			releasedOn: PLATFORM_RELEASE.shape.releasedOn
		})
	)
});

export interface ExtendedRelease extends z.infer<typeof EXTENDED_RELEASE> {}

export const search = async ({
	conditions: { include, exclude },
	expand,
	pagination: { limit, offset }
}: SearchParams<Include>) => {
	const includeText = include.text?.map((text) => `%${text}%`);

	const whereClauses = [
		includeText
			? sql.fragment`(
				(r.edition::citext LIKE ANY(${sql.array(includeText, "text")}))
				OR
				(r.version LIKE ANY(${sql.array(includeText, "text")}))
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
		include.cycle?.from
			? sql.fragment`(r.cycle >= ${sql.array(include.cycle.from, "int4")})`
			: undefined,
		include.cycle?.to
			? sql.fragment`(r.cycle <= ${sql.array(include.cycle.to, "int4")})`
			: undefined,
		include.isEarliestInCycle === undefined
			? undefined
			: sql.fragment`(r.is_earliest_in_cycle = ${include.isEarliestInCycle})`,
		include.isLatestInCycle === undefined
			? undefined
			: sql.fragment`(r.is_latest_in_cycle = ${include.isLatestInCycle})`,
		include.isLatest === undefined
			? undefined
			: sql.fragment`(r.is_latest = ${include.isLatest})`,
		include.platform
			? sql.fragment`(p.name LIKE ANY(${sql.array(
					include.platform.map((platform) => `%${platform}%`),
					"text"
				)}))`
			: undefined,
		include.releasedOn?.from
			? sql.fragment`(pr.released_on >= ${sql.date(include.releasedOn.from)})`
			: undefined,
		include.releasedOn?.to
			? sql.fragment`(pr.released_on <= ${sql.date(include.releasedOn.to)})`
			: undefined
	].filter(Boolean);

	const countQuery = expand
		? sql.type(COUNT)`
				SELECT
					count(*) AS count
				FROM
					releases AS r
					RIGHT OUTER JOIN platform_releases AS pr ON r.id = pr.release_id
					LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id ${whereClauses.length
					? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
					: sql.fragment``}
			`
		: sql.type(COUNT)`
				SELECT
					count(*) AS count
				FROM
					(
						SELECT
							count(*)
						FROM
							releases AS r
							INNER JOIN platform_releases AS pr ON r.id = pr.release_id
							INNER JOIN platforms AS p ON pr.platform_id = p.id ${whereClauses.length
					? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
					: sql.fragment``}
						GROUP BY
							r.id
					)
			`;

	const dataQuery = expand
		? sql.type(EXTENDED_RELEASE)`
				SELECT
					pr.id,
					r.edition,
					r.version,
					r.cycle,
					r.development_released_on AS "developementReleasedOn",
					pr.released_on AS "productionReleasedOn",
					r.notes_url AS "notesUrl",
					r.is_earliest_in_cycle AS "isEarliestInCycle",
					r.is_latest_in_cycle AS "isLatestInCycle",
					r.is_latest AS "isLatest",
					jsonb_build_array(
						jsonb_build_object(
							'id',
							p.id,
							'name',
							p.name,
							'releasedOn',
							pr.released_on
						)
					) AS "platformReleases"
				FROM
					releases AS r
					RIGHT OUTER JOIN platform_releases AS pr ON r.id = pr.release_id
					LEFT OUTER JOIN platforms AS p ON pr.platform_id = p.id ${whereClauses.length
					? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
					: sql.fragment``}
				ORDER BY
					r.cycle DESC,
					r.edition ASC,
					"productionReleasedOn" DESC,
					r.version ASC,
					p.name ASC
				LIMIT
					${limit}
				OFFSET
					${offset}
			`
		: sql.type(EXTENDED_RELEASE)`
				SELECT
					r.id,
					r.edition,
					r.version,
					r.cycle,
					r.development_released_on AS "developementReleasedOn",
					min(pr.released_on) AS "productionReleasedOn",
					r.notes_url AS "notesUrl",
					r.is_earliest_in_cycle AS "isEarliestInCycle",
					r.is_latest_in_cycle AS "isLatestInCycle",
					r.is_latest AS "isLatest",
					COALESCE(
						jsonb_agg(
							jsonb_build_object(
								'id',
								p.id,
								'name',
								p.name,
								'releasedOn',
								pr.released_on
							)
						),
						'[]'
					) AS "platformReleases"
				FROM
					releases AS r
					INNER JOIN platform_releases AS pr ON r.id = pr.release_id
					INNER JOIN platforms AS p ON pr.platform_id = p.id ${whereClauses.length
					? sql.fragment`WHERE ${sql.join(whereClauses, sql.fragment` AND `)}`
					: sql.fragment``}
				GROUP BY
					r.id
				ORDER BY
					r.cycle DESC,
					r.edition ASC,
					"productionReleasedOn" DESC,
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
			}) satisfies SearchResults<ExtendedRelease>
	);
};

export const doImport = async (release: ImportRelease) => {
	const cycle = release.version
		.split(".")
		.slice(0, 2)
		.map((part) => Number.parseInt(part, 10));

	const rainbow = Object.entries(release.platforms).map(
		async ([releasedOn, names]) => {
			if (releasedOn === UPCOMING.value) {
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
								cycle,
								development_released_on,
								notes_url
							)
						VALUES
							(
								${release.edition},
								${release.version},
								${sql.array(cycle, sql.fragment`integer[]`)},
								${release.developmentReleasedOn
					? sql.date(release.developmentReleasedOn)
					: null},
								${release.notesUrl ?? null}
							)
						ON CONFLICT (edition, version) DO UPDATE
						SET
							updated_at = DEFAULT,
							development_released_on = EXCLUDED.development_released_on,
							notes_url = EXCLUDED.notes_url
						RETURNING
							id,
							created_at,
							updated_at,
							edition,
							version,
							cycle,
							development_released_on,
							notes_url,
							is_earliest_in_cycle,
							is_latest_in_cycle,
							is_latest
					)
				INSERT INTO
					platform_releases (platform_id, release_id, released_on)
				SELECT
					p.id,
					r.id,
					${sql.date(new Date(releasedOn))}
				FROM
					the_platforms AS p,
					the_release AS r
				ON CONFLICT (platform_id, release_id) DO UPDATE
				SET
					updated_at = DEFAULT,
					released_on = ${sql.date(new Date(releasedOn))}
				RETURNING
					id,
					platform_id AS "platformId",
					release_id AS "releaseId"
			`);
		}
	);

	return Promise.allSettled(rainbow);
};
