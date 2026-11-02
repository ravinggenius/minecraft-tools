CREATE TABLE public.items (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  item_identity_id uuid NOT NULL,
  item_color_id uuid,
  item_rarity_id uuid NOT NULL,
  item_stack_size_id uuid NOT NULL,
  item_translation_key_id uuid,
  PRIMARY KEY (id),
  CONSTRAINT items_item_identity_id_fkey FOREIGN KEY (item_identity_id)
    REFERENCES public.item_identities (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT items_item_color_id_fkey FOREIGN KEY (item_color_id)
    REFERENCES public.item_colors (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT items_item_rarity_id_fkey FOREIGN KEY (item_rarity_id)
    REFERENCES public.item_rarities (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT items_item_stack_size_id_fkey FOREIGN KEY (item_stack_size_id)
    REFERENCES public.item_stack_sizes (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT items_item_translation_key_id_fkey FOREIGN KEY (item_translation_key_id)
    REFERENCES public.item_translation_keys (id) ON UPDATE CASCADE ON DELETE CASCADE
);
CREATE INDEX items_item_identity_id_key ON public.items (item_identity_id);
CREATE INDEX items_item_color_id_key ON public.items (item_color_id);
CREATE INDEX items_item_rarity_id_key ON public.items (item_rarity_id);
CREATE INDEX items_item_stack_size_id_key ON public.items (item_stack_size_id);
CREATE INDEX items_item_translation_key_id_key ON public.items (item_translation_key_id);
CREATE UNIQUE INDEX items_all_unique_key ON public.items (
  item_identity_id,
  item_color_id,
  item_rarity_id,
  item_stack_size_id,
  item_translation_key_id
) NULLS NOT DISTINCT;
