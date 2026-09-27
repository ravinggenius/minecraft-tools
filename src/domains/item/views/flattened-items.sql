CREATE VIEW public.flattened_items AS
SELECT
  irr.id,
  i.id AS item_id,
  i.identifier,
  i.variant,
  i.is_variant,
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
  LEFT OUTER JOIN public.item_colors AS ic ON irr.item_color_id = ic.id
  LEFT OUTER JOIN public.item_rarities AS ir ON irr.item_rarity_id = ir.id
  LEFT OUTER JOIN public.item_stack_sizes AS iss ON irr.item_stack_size_id = iss.id
  LEFT OUTER JOIN public.item_translation_keys AS itk ON irr.item_translation_key_id = itk.id;
