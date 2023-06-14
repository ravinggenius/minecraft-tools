-- Up Migration

CREATE EXTENSION citext;

-- https://dba.stackexchange.com/a/165923
-- https://html.spec.whatwg.org/multipage/input.html#e-mail-state-(type=email)
CREATE DOMAIN email AS citext
CHECK (
	value ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'
);

CREATE TABLE profiles (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	name text NOT NULL
);

CREATE TABLE accounts (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	profile_id uuid NOT NULL REFERENCES profiles,
	email email NOT NULL UNIQUE,
	email_verified_at timestamp with time zone,
	hashword text NOT NULL
);

CREATE TABLE sessions (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	account_id uuid NOT NULL REFERENCES accounts,
	expires_at timestamp with time zone NOT NULL
);

-- Down Migration

DROP TABLE sessions;

DROP TABLE accounts;

DROP TABLE profiles;

DROP DOMAIN email;

DROP EXTENSION citext;
