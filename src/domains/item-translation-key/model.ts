import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_TRANSLATION_KEY } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_TRANSLATION_KEY)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_translation_keys
		ORDER BY
			identifier ASC
	`);
