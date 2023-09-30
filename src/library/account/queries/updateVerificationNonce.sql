UPDATE accounts
SET
    token_nonce = $<tokenNonce>,
    token_nonce_count = token_nonce_count + 1,
    updated_at = NOW()
WHERE profile_id = $<profileId>
RETURNING
    id,
    profile_id AS "profileId",
    email,
    token_nonce AS "tokenNonce";
