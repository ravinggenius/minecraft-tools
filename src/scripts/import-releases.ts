import * as releaseModel from "@/library/release/model";
import { IMPORT_RELEASES } from "@/library/release/schema";
import rawImportReleases from "@/services/datastore-service/fixtures/releases.json";

export const execute = () =>
	IMPORT_RELEASES.parse(rawImportReleases).reduce(
		(memo, release) => memo.then(() => releaseModel.doImport(release)),
		Promise.resolve([]) as ReturnType<typeof releaseModel.doImport>
	);
