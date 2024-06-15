schema "public" {
  comment = "standard public schema"
}

extension "uuid-ossp" {
  schema = schema.public
}

extension "citext" {
  schema = schema.public
}

domain "email" {
  schema = schema.public
  null   = true
  type   = sql("citext")

  check "valid_email_check" {
    expr = "VALUE ~ '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$'"
  }
}

table "profiles" {
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

table "sessions" {
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

  column "account_id" {
    null = false
    type = uuid
  }

  column "expires_at" {
    null = false
    type = timestamptz
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "sessions_account_id_fkey" {
    columns     = [column.account_id]
    ref_columns = [table.accounts.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }
}

table "password_resets" {
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

  column "email" {
    null = false
    type = domain.email
  }

  column "expires_at" {
    null = true
    type = timestamptz
  }

  column "nonce" {
    null = false
    type = text
  }

  primary_key {
    columns = [column.id]
  }

  unique "password_resets_email_key" {
    columns = [column.email]
  }
}
