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

CREATE TABLE public.item_colors (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier public.citext NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_colors_identifier_key UNIQUE (identifier)
);

CREATE TABLE public.item_rarities (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier public.citext NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_rarities_identifier_key UNIQUE (identifier)
);

CREATE TABLE public.item_stack_sizes (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier integer NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_stack_sizes_identifier_key UNIQUE (identifier)
);

CREATE TABLE public.item_translation_keys (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  identifier public.citext NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT item_translation_keys_identifier_key UNIQUE (identifier)
);

CREATE TABLE public.item_releases (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  release_id uuid NOT NULL,
  item_id uuid NOT NULL,
  item_color_id uuid,
  item_rarity_id uuid NOT NULL,
  item_stack_size_id uuid NOT NULL,
  item_translation_key_id uuid,
  PRIMARY KEY (id),
  CONSTRAINT item_releases_release_id_fkey FOREIGN KEY (release_id)
    REFERENCES public.releases (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_id_fkey FOREIGN KEY (item_id)
    REFERENCES public.items (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_color_id_fkey FOREIGN KEY (item_color_id)
    REFERENCES public.item_colors (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_rarity_id_fkey FOREIGN KEY (item_rarity_id)
    REFERENCES public.item_rarities (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_stack_size_id_fkey FOREIGN KEY (item_stack_size_id)
    REFERENCES public.item_stack_sizes (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT item_releases_item_translation_key_id_fkey FOREIGN KEY (item_translation_key_id)
    REFERENCES public.item_translation_keys (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE UNIQUE INDEX item_releases_release_id_item_ids_key ON public.item_releases (
  release_id,
  item_id,
  item_color_id,
  item_rarity_id,
  item_stack_size_id,
  item_translation_key_id
) NULLS NOT DISTINCT;
