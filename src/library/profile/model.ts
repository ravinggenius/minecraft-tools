import { db, readQueries } from "../_/datastore";

import { Profile, PublicProfile } from "./schema";

const queries = readQueries("profile", ["get", "getPublic"]);

export const get = async (profileId: Profile["id"]) =>
	db.one<Profile>(queries.get, {
		profileId
	});

export const getPublic = (profileId: Profile["id"]) =>
	db.one<PublicProfile>(queries.getPublic, {
		profileId
	});
