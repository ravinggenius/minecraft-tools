CREATE TABLE public.profiles (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	name TEXT NOT NULL,
	is_welcome_needed BOOLEAN NOT NULL DEFAULT TRUE,
	PRIMARY KEY (id)
);
