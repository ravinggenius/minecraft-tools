import { db, readQueries } from "../_/datastore";

import { Profile, PublicProfile } from "./schema";

const queries = readQueries("profile", [
	"get",
	"getPublic",
	"isEmailVerified",
	"markAsWelcomed"
]);

export const get = async (profileId: Profile["id"]) =>
	db.one<Profile>(queries.get, {
		profileId
	});

export const getPublic = (profileId: Profile["id"]) =>
	db.one<PublicProfile>(queries.getPublic, {
		profileId
	});

export const isEmailVerified = async (profileId: Profile["id"]) => {
	const { emailVerified } = await db.one<{ emailVerified: boolean }>(
		queries.isEmailVerified,
		{
			profileId
		}
	);

	return emailVerified;
};

export const markAsWelcomed = async (profileId: Profile["id"]) => {
	await db.none(queries.markAsWelcomed, {
		profileId
	});
};
