table "profiles" {
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
    type = text
  }

  column "is_welcome_needed" {
    null    = false
    type    = boolean
    default = true
  }

  primary_key {
    columns = [column.id]
  }
}
