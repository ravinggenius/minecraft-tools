import { join } from "path";
import pgPromise, { IInitOptions, QueryFile } from "pg-promise";

import * as config from "./config.mjs";

const initOptions: IInitOptions = {
	capSQL: true,
	noWarnings: !config.isProduction
};

const pgp = pgPromise(initOptions);

// SEE https://github.com/vitaly-t/pg-promise/issues/175#issuecomment-766663282
export const db = pgp(config.databaseUrl);

export const readQueries = <Keys extends string>(
	modelName: string,
	keys: Array<Keys>
) =>
	keys.reduce((memo, key) => {
		const queryFile = new QueryFile(
			new URL(
				join("..", modelName, "queries", `${key}.sql`),
				import.meta.url
			)
				.toString()
				.replace(/^file:\/\//, "")
		);

		if (queryFile.error) {
			console.error(queryFile.error);
		}

		return {
			...memo,
			[key]: queryFile
		};
	}, {} as Record<Keys, QueryFile>);
