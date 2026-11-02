CREATE TABLE public.item_identities (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- SEE https://minecraft.wiki/w/Resource_location
  identifier public.citext NOT NULL,
  variant public.citext,
  is_variant boolean GENERATED ALWAYS AS (variant IS NOT NULL) STORED,
  PRIMARY KEY (id)
);
CREATE INDEX item_identities_identifier_key ON public.item_identities (identifier);
CREATE INDEX item_identities_variant_key ON public.item_identities (variant);
CREATE INDEX item_identities_is_variant_key ON public.item_identities (is_variant);
CREATE UNIQUE INDEX item_identities_all_unique_key ON public.item_identities (identifier, variant) NULLS NOT DISTINCT;
