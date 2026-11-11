CREATE TABLE public.item_translation_keys (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier public.citext NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_translation_keys_identifier_key UNIQUE (identifier)
);
