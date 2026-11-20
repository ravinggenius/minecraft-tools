CREATE TABLE public.item_stack_sizes (
	id UUID NOT NULL DEFAULT public.uuid_generate_v4 (),
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	identifier INTEGER NOT NULL,
	PRIMARY KEY (id),
	CONSTRAINT item_stack_sizes_identifier_key UNIQUE (identifier)
);
