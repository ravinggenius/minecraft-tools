view "released_items" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      v.id AS release_id,
      v.edition,
      v.version,
      v.is_latest,
      i.id,
      i.created_at,
      i.updated_at,
      i.identifier,
      i.wiki_url,
      i.rarity,
      i.stack_size,
      i.is_renewable
    FROM public.items AS i
      JOIN public.item_releases AS iv ON i.id = iv.item_id
      JOIN public.releases AS v ON iv.release_id = v.id;
  SQL
  depends_on = [table.items, table.item_releases, table.releases]
}
