-- Up Migration

ALTER TABLE accounts
ADD COLUMN token_nonce text NOT NULL DEFAULT '',
ADD COLUMN token_nonce_count integer NOT NULL DEFAULT 1;

-- Down Migration

ALTER TABLE accounts
DROP COLUMN token_nonce_count,
DROP COLUMN token_nonce;
