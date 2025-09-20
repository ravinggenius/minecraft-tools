table "sessions" {
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
