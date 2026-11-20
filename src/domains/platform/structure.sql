CREATE TABLE public.platforms (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	name public.citext NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT platforms_name_key UNIQUE (name)
);
