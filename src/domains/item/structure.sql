CREATE TYPE public.rarity AS ENUM ('common', 'uncommon', 'rare', 'epic');

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
CREATE INDEX items_is_variant_key ON public.items (is_variant);
CREATE UNIQUE INDEX items_all_unique_key ON public.items (identifier, variant) NULLS NOT DISTINCT;

CREATE TABLE public.item_metadata (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  rarity public.rarity NOT NULL DEFAULT 'common',
  stack_size integer NOT NULL DEFAULT 64,
  PRIMARY KEY (id),
  CONSTRAINT item_metadata_rarity_stack_size_unique_key UNIQUE (rarity, stack_size)
);

CREATE TABLE public.item_names (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  translation_key public.citext,
  name public.citext NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_names_translation_key_name_key UNIQUE NULLS NOT DISTINCT (translation_key, name)
);

CREATE TABLE public.item_releases (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  release_id uuid NOT NULL,
  item_id uuid NOT NULL,
  item_metadata_id uuid NOT NULL,
  item_name_id uuid NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_releases_release_id_fkey FOREIGN KEY (release_id)
    REFERENCES public.releases (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_id_fkey FOREIGN KEY (item_id)
    REFERENCES public.items (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_metadata_id_fkey FOREIGN KEY (item_metadata_id)
    REFERENCES public.item_metadata (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_name_id_fkey FOREIGN KEY (item_name_id)
    REFERENCES public.item_names (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_release_id_item_ids_key
    UNIQUE (release_id, item_id, item_metadata_id, item_name_id)
);
