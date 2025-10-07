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

  # SEE https://minecraft.wiki/w/Resource_location
  column "identifier" {
    null = false
    type = sql("public.citext")
  }

  column "variant" {
    null = true
    type = sql("public.citext")
  }

  column "is_variant" {
    type = boolean
    as {
      expr = "variant IS NOT NULL"
    }
  }

  primary_key {
    columns = [column.id]
  }

  index "items_identifier_key" {
    columns = [column.identifier]
  }

  index "items_is_variant_key" {
    columns = [column.is_variant]
  }

  unique "items_all_unique_key" {
    columns        = [column.identifier, column.variant]
    nulls_distinct = false
  }
}

table "item_metadata" {
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

  primary_key {
    columns = [column.id]
  }

  unique "item_metadata_rarity_stack_size_unique_key" {
    columns = [column.rarity, column.stack_size]
  }
}

table "item_names" {
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

  column "translation_key" {
    null = true
    type = sql("public.citext")
  }

  column "name" {
    null = false
    type = sql("public.citext")
  }

  primary_key {
    columns = [column.id]
  }

  unique "item_names_translation_key_name_key" {
    columns        = [column.translation_key, column.name]
    nulls_distinct = false
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

  column "release_id" {
    null = false
    type = uuid
  }

  column "item_id" {
    null = false
    type = uuid
  }

  column "item_metadata_id" {
    null = false
    type = uuid
  }

  column "item_name_id" {
    null = false
    type = uuid
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "item_releases_release_id_fkey" {
    columns     = [column.release_id]
    ref_columns = [table.releases.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_releases_item_id_fkey" {
    columns     = [column.item_id]
    ref_columns = [table.items.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_releases_item_metadata_id_fkey" {
    columns     = [column.item_metadata_id]
    ref_columns = [table.item_metadata.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_releases_item_name_id_fkey" {
    columns     = [column.item_name_id]
    ref_columns = [table.item_names.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "item_releases_release_id_item_ids_key" {
    columns = [column.release_id, column.item_id, column.item_metadata_id, column.item_name_id]
  }
}
