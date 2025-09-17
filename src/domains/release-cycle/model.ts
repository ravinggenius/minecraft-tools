import { pool, sql } from "@/services/datastore-service/service";

import { RELEASE_CYCLE } from "./schema";

if (process.env.NEXT_RUNTIME === "nodejs") {
	await import("server-only");
}

export const listAll = async () =>
	(await pool).any(sql.type(RELEASE_CYCLE)`
		SELECT
			rc.id,
			rc.created_at AS "createdAt",
			rc.updated_at AS "updatedAt",
			rc.name
		FROM
			release_cycles AS rc
		ORDER BY
			rc.name ASC
	`);
