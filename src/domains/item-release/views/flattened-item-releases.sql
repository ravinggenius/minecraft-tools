CREATE VIEW public.flattened_item_releases AS
SELECT
  irr.id,
  irr.release_id,
  i.id AS item_id,
  ii.identifier,
  ii.variant,
  ii.is_variant,
  ic.identifier AS color,
  ir.identifier AS rarity,
  iss.identifier AS stack_size,
  itk.identifier AS translation_key,
  nr.edition,
  (nr."cycle" ->> 'name')::public.citext AS cycle_name,
  nr.version::public.citext,
  nr.first_production_released_on,
  nr.is_available_for_tools
FROM
  public.item_releases AS irr
  INNER JOIN public.normalized_releases AS nr ON irr.release_id = nr.id
  INNER JOIN public.items AS i ON irr.item_id = i.id
  INNER JOIN public.item_identities AS ii ON i.item_identity_id = ii.id
  LEFT OUTER JOIN public.item_colors AS ic ON i.item_color_id = ic.id
  INNER JOIN public.item_rarities AS ir ON i.item_rarity_id = ir.id
  INNER JOIN public.item_stack_sizes AS iss ON i.item_stack_size_id = iss.id
  LEFT OUTER JOIN public.item_translation_keys AS itk ON i.item_translation_key_id = itk.id;
