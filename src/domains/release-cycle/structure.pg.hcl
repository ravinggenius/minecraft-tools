table "release_cycles" {
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
