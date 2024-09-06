import { pool, sql } from "@/services/datastore-service/service";

import { PLATFORM_RELEASE } from "../platform-release/schema";

import { ImportRelease, UPCOMING } from "./schema";

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
						INSERT INTO platforms (name)
						SELECT ${sql.unnest(
							names.map((name) => [name]),
							["text"]
						)}
						ON CONFLICT (name) DO UPDATE
							SET updated_at = DEFAULT
						RETURNING id, name
					),
					the_release AS (
						INSERT INTO releases (
							edition,
							version,
							cycle,
							development_released_on,
							notes_url
						)
						VALUES (
							${release.edition},
							${release.version},
							${sql.array(cycle, sql.fragment`integer[]`)},
							${release.developmentReleasedOn ? sql.date(release.developmentReleasedOn) : null},
							${release.notesUrl ?? null}
						)
						ON CONFLICT (edition, version) DO UPDATE
							SET updated_at = DEFAULT,
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
				INSERT INTO platform_releases (platform_id, release_id, released_on)
				SELECT p.id, r.id, ${sql.date(new Date(releasedOn))}
				FROM the_platforms AS p, the_release AS r
				ON CONFLICT (platform_id, release_id) DO UPDATE
					SET updated_at = DEFAULT,
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
