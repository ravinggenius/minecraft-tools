INSERT INTO password_resets (email, nonce, expires_at)
VALUES ($<email>, $<nonce>, $<expiresAt>)
ON CONFLICT (email) DO UPDATE
    SET nonce = EXCLUDED.nonce,
        expires_at = EXCLUDED.expires_at
RETURNING
    id,
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    expires_at AS "expiresAt",
    email,
    nonce;
