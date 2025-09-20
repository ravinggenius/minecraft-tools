table "release_cycles" {
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

  column "name" {
    null = false
    type = sql("citext")
  }

  primary_key {
    columns = [column.id]
  }

  unique "release_cycles_name_key" {
    columns = [column.name]
  }
}

table "release_cycle_releases" {
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

  column "release_id" {
    null = false
    type = uuid
  }

  column "release_cycle_id" {
    null = false
    type = uuid
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "release_cycle_releases_release_id_fkey" {
    columns     = [column.release_id]
    ref_columns = [table.releases.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "release_cycle_releases_release_cycle_id_fkey" {
    columns     = [column.release_cycle_id]
    ref_columns = [table.release_cycles.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "release_cycle_releases_release_id_release_cycle_id_key" {
    columns = [column.release_id, column.release_cycle_id]
  }
}
