-- Up Migration

CREATE TABLE password_resets (
	id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
	created_at timestamp with time zone NOT NULL DEFAULT now(),
	updated_at timestamp with time zone NOT NULL DEFAULT now(),
	email email NOT NULL UNIQUE,
	expires_at timestamp with time zone,
	nonce text NOT NULL
);

-- Down Migration

DROP TABLE password_resets;
