import * as releaseModel from "@/domains/release/model";
import { IMPORT_RELEASES } from "@/domains/release/schema";
import rawImportReleases from "@/services/datastore-service/fixtures/releases.json";

IMPORT_RELEASES.parse(rawImportReleases).reduce(
	(memo, release) => memo.then(() => releaseModel.doImport(release)),
	Promise.resolve([]) as ReturnType<typeof releaseModel.doImport>
);
