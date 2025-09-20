table "platform_releases" {
  schema = schema.public

  column "id" {
    null    = false
    type    = uuid
    default = sql("uuid_generate_v4()")
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

  column "platform_id" {
    null = false
    type = uuid
  }

  column "release_id" {
    null = false
    type = uuid
  }

  column "production_released_on" {
    null = false
    type = date
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "platform_releases_platform_id_fkey" {
    columns     = [column.platform_id]
    ref_columns = [table.platforms.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "platform_releases_release_id_fkey" {
    columns     = [column.release_id]
    ref_columns = [table.releases.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "platform_releases_platform_id_release_id_key" {
    columns = [column.platform_id, column.release_id]
  }
}
