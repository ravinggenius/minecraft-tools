-- Up Migration

ALTER TABLE accounts
ADD COLUMN token_nonce text NOT NULL DEFAULT '',
ADD COLUMN token_nonce_updated_at timestamp with time zone NOT NULL DEFAULT now();

-- Down Migration

ALTER TABLE accounts
DROP COLUMN token_nonce,
DROP COLUMN token_nonce_updated_at;
