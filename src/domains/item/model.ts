import { VOID } from "@/services/datastore-service/schema";
import { pool, sql } from "@/services/datastore-service/service";

import { ImportItem } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const doImport = async (item: ImportItem) =>
	(await pool).any(
		sql.type(VOID)`
			WITH
			the_release AS (
				SELECT r,id
				FROM releases AS r
				INNER JOIN unnest(
				${sql.array(
					item.releases.map(({ edition }) => edition),
					"edition"
				)}::edition[],
				${sql.array(
					item.releases.map(({ version }) => version),
					"text"
				)}::text[]
				) AS criteria(edition, version)
				ON r.edition = criteria.edition 
				AND r.version = criteria.version
			),
			the_item AS (
				INSERT INTO items
					(identifier, variant)
				VALUES
					(
						${item.identifier},
						${item.variant ?? null}
					)
				ON CONFLICT (identifier, variant) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			),
			the_metadata AS (
				INSERT INTO item_metadata
					(rarity, stack_size)
				VALUES
					(
						${item.rarity},
						${item.stackSize}
					)
				ON CONFLICT (rarity, stack_size) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			),
			the_name AS (
				INSERT INTO item_names
					(translation_key, name)
				VALUES
					(
						${item.translationKey ?? null},
						${item.name}
					)
				ON CONFLICT (translation_key, name) DO UPDATE
				SET
					updated_at = DEFAULT
				RETURNING
					id
			)
			INSERT INTO item_releases
				(release_id, item_id, item_metadata_id, item_name_id)
			SELECT
				r.id,
				i.id,
				m.id,
				n.id
			FROM the_release AS r
			CROSS JOIN the_item AS i
			CROSS JOIN the_metadata AS m
			CROSS JOIN the_name AS n
			ON CONFLICT (release_id, item_id, item_metadata_id, item_name_id) DO UPDATE
			SET
				updated_at = DEFAULT
		`
	);
