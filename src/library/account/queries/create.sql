WITH profile AS (
	INSERT INTO profiles (name)
	VALUES ($<profile.name>)
	RETURNING
		id,
		created_at AS "createdAt",
		updated_at AS "updatedAt",
		name
)
INSERT INTO accounts (profile_id, email, hashword, token_nonce)
VALUES ((SELECT id FROM profile), $<account.email>, $<account.hashword>, $<tokenNonce>)
RETURNING
	id,
	created_at AS "createdAt",
	updated_at AS "updatedAt",
	profile_id AS "profileId",
	email,
	email_verified_at AS "emailVerifiedAt",
	token_nonce AS "tokenNonce";
