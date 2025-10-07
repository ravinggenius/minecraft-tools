view "flattened_items" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      ir.id,
      i.id AS item_id,
      i.identifier,
      i.variant,
      i.is_variant,
      "in".translation_key,
      "in".name,
      im.rarity,
      im.stack_size,
      r.edition,
      r.version,
      r.is_available_for_tools
    FROM
      public.item_releases AS ir
      INNER JOIN public.releases AS r ON ir.release_id = r.id
      INNER JOIN public.items AS i ON ir.item_id = i.id
      INNER JOIN public.item_metadata AS im ON ir.item_metadata_id = im.id
      INNER JOIN public.item_names AS "in" ON ir.item_name_id = "in".id;
  SQL
  depends_on = [table.item_releases, table.releases, table.items, table.item_metadata, table.item_names]
}
