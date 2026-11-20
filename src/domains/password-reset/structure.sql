CREATE TABLE public.password_resets (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	email public.email NOT NULL,
	expires_at TIMESTAMPTZ,
	nonce TEXT NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT password_resets_email_key UNIQUE (email)
);
