import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_COLOR } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_COLOR)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_colors
		ORDER BY
			identifier ASC
	`);
