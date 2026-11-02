import { pool, sql } from "@/services/datastore-service/service";

import { ITEM_STACK_SIZE } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(ITEM_STACK_SIZE)`
		SELECT
			id,
			created_at,
			updated_at,
			identifier
		FROM
			item_stack_sizes
		ORDER BY
			identifier ASC
	`);
