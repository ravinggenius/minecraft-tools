enum "rarity" {
  schema = schema.public
  values = [
    "common",
    "uncommon",
    "rare",
    "epic"
  ]
}

table "items" {
  schema = schema.public

  column "id" {
    null    = false
    type    = uuid
    default = sql("public.uuid_generate_v4()")
  }

  column "created_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }

  column "updated_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }

  column "identifier" {
    null = false
    type = text
  }

  column "wiki_url" {
    null = false
    type = text
  }

  column "rarity" {
    null    = false
    type    = enum.rarity
    default = "common"
  }

  column "stack_size" {
    null    = false
    type    = integer
    default = 64
  }

  column "is_renewable" {
    null = false
    type = boolean
  }

  primary_key {
    columns = [column.id]
  }
}

table "item_releases" {
  schema = schema.public

  column "id" {
    null    = false
    type    = uuid
    default = sql("public.uuid_generate_v4()")
  }

  column "created_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }

  column "updated_at" {
    null    = false
    type    = timestamptz
    default = sql("now()")
  }

  column "item_id" {
    null = false
    type = uuid
  }

  column "release_id" {
    null = false
    type = uuid
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "item_releases_item_id_fkey" {
    columns     = [column.item_id]
    ref_columns = [table.items.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_releases_release_id_fkey" {
    columns     = [column.release_id]
    ref_columns = [table.releases.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "item_releases_item_id_release_id_key" {
    columns = [column.item_id, column.release_id]
  }
}

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
    FROM public.items i
      JOIN public.item_releases iv ON i.id = iv.item_id
      JOIN public.releases v ON iv.release_id = v.id;
  SQL
}
