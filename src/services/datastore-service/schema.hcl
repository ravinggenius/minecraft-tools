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

enum "edition" {
  schema = schema.public
  values = [
    "bedrock",
    "java"
  ]
}

table "versions" {
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

  column "edition" {
    null = false
    type = enum.edition
  }

  column "version" {
    null = false
    type = text
  }

  column "cycle" {
    null = false
    type = sql("integer ARRAY[2]")
  }

  column "released_on" {
    null = false
    type = date
  }

  column "release_notes_url" {
    null = false
    type = text
  }

  column "is_published" {
    null    = false
    type    = boolean
    default = false
  }

  column "is_latest" {
    null    = false
    type    = boolean
    default = false
  }

  column "is_latest_in_cycle" {
    null    = false
    type    = boolean
    default = false
  }

  primary_key {
    columns = [column.id]
  }

  unique "versions_edition_version_key" {
    columns = [column.edition, column.version]
  }
}

function "update_latest_version_flags" {
  schema = schema.public
  lang   = PLpgSQL
  return = trigger
  as     = <<-SQL
    BEGIN
      IF pg_trigger_depth() = 1 THEN
        WITH latest AS (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY edition
              ORDER BY released_on DESC
            ) = 1 AS is_latest,
            ROW_NUMBER() OVER (
              PARTITION BY edition, cycle
              ORDER BY released_on DESC
            ) = 1 AS is_latest_in_cycle
          FROM versions
        )
        UPDATE versions
        SET
          is_latest = latest.is_latest,
          is_latest_in_cycle = latest.is_latest_in_cycle
        FROM latest
        WHERE versions.id = latest.id;
      END IF;

      RETURN NEW;
    END
  SQL
}

trigger "trigger_update_latest_version_flags" {
  on = table.versions

  after {
    insert = true
    update = true
    delete = true
  }

  execute {
    function = function.update_latest_version_flags
  }
}

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

table "item_versions" {
  schema = schema.public

  column "id" {
    null    = false
    type    = uuid
    default = sql("uuid_generate_v4()")
  }

  column "item_id" {
    null = false
    type = uuid
  }

  column "version_id" {
    null = false
    type = uuid
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

  primary_key {
    columns = [column.id]
  }

  foreign_key "item_versions_item_id_fkey" {
    columns     = [column.item_id]
    ref_columns = [table.items.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_versions_version_id_fkey" {
    columns     = [column.version_id]
    ref_columns = [table.versions.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "item_versions_item_id_version_id_key" {
    columns = [column.item_id, column.version_id]
  }
}

view "versioned_items" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      v.id AS version_id,
      v.edition,
      v.version,
      v.cycle,
      v.is_latest,
      v.is_latest_in_cycle,
      i.*
    FROM items AS i
      INNER JOIN item_versions AS iv ON i.id = iv.item_id
      INNER JOIN versions AS v ON iv.version_id = v.id
  SQL
}
