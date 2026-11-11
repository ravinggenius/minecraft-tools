CREATE TABLE public.item_stack_sizes (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_stack_sizes_identifier_key UNIQUE (identifier)
);
