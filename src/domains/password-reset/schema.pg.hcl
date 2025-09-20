table "password_resets" {
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
