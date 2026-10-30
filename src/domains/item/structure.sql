CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- SEE https://minecraft.wiki/w/Resource_location
  identifier public.citext NOT NULL,
  variant public.citext,
  is_variant boolean GENERATED ALWAYS AS (variant IS NOT NULL) STORED,
  PRIMARY KEY (id)
);
CREATE INDEX items_identifier_key ON public.items (identifier);
CREATE INDEX items_variant_key ON public.items (variant);
CREATE INDEX items_is_variant_key ON public.items (is_variant);
CREATE UNIQUE INDEX items_all_unique_key ON public.items (identifier, variant) NULLS NOT DISTINCT;
