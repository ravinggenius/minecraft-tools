UPDATE accounts
SET
    updated_at = NOW(),
    email_verified_at = NOW(),
    token_nonce = ''
WHERE id = $<accountId>;
