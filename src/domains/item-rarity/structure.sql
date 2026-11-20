CREATE TABLE public.item_rarities (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	identifier public.citext NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT item_rarities_identifier_key UNIQUE (identifier)
);
