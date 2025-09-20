domain "email" {
  schema = schema.public
  null   = true
  type   = sql("citext")

  check "valid_email_check" {
    expr = "VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'"
  }
}

table "accounts" {
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

  column "profile_id" {
    null = false
    type = uuid
  }

  column "email" {
    null = false
    type = domain.email
  }

  column "email_verified_at" {
    null = true
    type = timestamptz
  }

  column "hashword" {
    null = false
    type = text
  }

  column "token_nonce" {
    null    = false
    type    = text
    default = ""
  }

  column "token_nonce_count" {
    null    = false
    type    = integer
    default = 1
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "accounts_profile_id_fkey" {
    columns     = [column.profile_id]
    ref_columns = [table.profiles.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "accounts_email_key" {
    columns = [column.email]
  }
}
