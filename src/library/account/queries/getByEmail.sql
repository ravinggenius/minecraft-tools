SELECT
	id,
	created_at AS "createdAt",
	updated_at AS "updatedAt",
	profile_id AS "profileId",
	email,
	email_verified_at AS "emailVerifiedAt",
	hashword,
	token_nonce AS "tokenNonce",
	token_nonce_count AS "tokenNonceCount"
FROM accounts
WHERE email = $<email>::email
LIMIT 1;
