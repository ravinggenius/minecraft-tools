CREATE VIEW public.normalized_items AS
SELECT
  i.id,
  i.created_at,
  i.updated_at,
  i.item_identity_id,
  ii.identifier,
  ii.variant,
  ii.is_variant,
  i.item_color_id,
  ic.identifier AS color,
  i.item_rarity_id,
  ir.identifier AS rarity,
  i.item_stack_size_id,
  iss.identifier AS stack_size,
  i.item_translation_key_id,
  itk.identifier AS translation_key
FROM
  public.items AS i
  INNER JOIN public.item_identities AS ii ON i.item_identity_id = ii.id
  LEFT OUTER JOIN public.item_colors AS ic ON i.item_color_id = ic.id
  INNER JOIN public.item_rarities AS ir ON i.item_rarity_id = ir.id
  INNER JOIN public.item_stack_sizes AS iss ON i.item_stack_size_id = iss.id
  LEFT OUTER JOIN public.item_translation_keys AS itk ON i.item_translation_key_id = itk.id;
