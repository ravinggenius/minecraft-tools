CREATE TABLE public.item_translation_keys (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	identifier public.citext NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT item_translation_keys_identifier_key UNIQUE (identifier)
);
