SELECT token_nonce_count AS "tokenNonceCount"
FROM accounts
WHERE profile_id = $<profileId>
LIMIT 1;
