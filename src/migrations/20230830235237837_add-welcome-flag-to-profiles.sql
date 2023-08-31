-- Up Migration

ALTER TABLE profiles
ADD COLUMN is_welcome_needed boolean NOT NULL DEFAULT true;

-- Down Migration

ALTER TABLE profiles
DROP COLUMN is_welcome_needed;
