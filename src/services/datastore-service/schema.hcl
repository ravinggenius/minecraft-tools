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

enum "permission_action" {
  schema = schema.public
  values = [
    "create",
    "read",
    "share",
    "update",
    "destroy"
  ]
}

enum "permission_scope" {
  schema = schema.public
  values = [
    "any",
    "new",
    "own",
    "one"
  ]
}

enum "permission_subject" {
  schema = schema.public
  values = [
    "compendium",
    "profile",
    "platform",
    "release",
    "world"
  ]
}

table "permissions" {
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

  column "action" {
    null = false
    type = enum.permission_action
  }

  column "scope" {
    null = false
    type = enum.permission_scope
  }

  column "subject" {
    null = false
    type = enum.permission_subject
  }

  column "auxiliary" {
    null = true
    type = jsonb
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "permissions_profile_id_fkey" {
    columns     = [column.profile_id]
    ref_columns = [table.profiles.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "permissions_profile_id_subject_action_scope_auxiliary_key" {
    columns = [
		  column.profile_id,
		  column.subject,
		  column.action,
		  column.scope,
		  column.auxiliary
    ]
    nulls_distinct = false
  }
}

table "platforms" {
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

  unique "platforms_name_key" {
    columns = [column.name]
  }
}

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

enum "edition" {
  schema = schema.public
  values = [
    "bedrock",
    "java"
  ]
}

table "releases" {
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

  column "development_released_on" {
    null = true
    type = date
  }

  column "changelog" {
    null = true
    type = text
  }

  column "is_available_for_tools" {
    null    = false
    type    = boolean
    default = false
  }

  column "is_latest" {
    null    = false
    type    = boolean
    default = false
  }

  primary_key {
    columns = [column.id]
  }

  unique "releases_edition_version_key" {
    columns = [column.edition, column.version]
  }
}

function "update_release_flags" {
  schema = schema.public
  lang   = PLpgSQL
  return = trigger
  as     = <<-SQL
    BEGIN
      IF pg_trigger_depth() = 1 THEN
        WITH latest AS (
          SELECT
            r.id,
            ROW_NUMBER() OVER (
              PARTITION BY r.edition
              ORDER BY min(pr.production_released_on) DESC
            ) = 1 AS is_latest
          FROM releases AS r
          INNER JOIN platform_releases AS pr ON r.id = pr.release_id
          GROUP BY r.id
        )
        UPDATE releases
        SET
          is_latest = latest.is_latest
        FROM latest
        WHERE releases.id = latest.id;
      END IF;

      RETURN NEW;
    END
  SQL
}

trigger "trigger_update_release_flags" {
  on = table.releases

  after {
    insert = true
    update = true
    delete = true
  }

  execute {
    function = function.update_release_flags
  }
}

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

table "item_releases" {
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

  column "item_id" {
    null = false
    type = uuid
  }

  column "release_id" {
    null = false
    type = uuid
  }

  primary_key {
    columns = [column.id]
  }

  foreign_key "item_releases_item_id_fkey" {
    columns     = [column.item_id]
    ref_columns = [table.items.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  foreign_key "item_releases_release_id_fkey" {
    columns     = [column.release_id]
    ref_columns = [table.releases.column.id]
    on_update   = CASCADE
    on_delete   = CASCADE
  }

  unique "item_releases_item_id_release_id_key" {
    columns = [column.item_id, column.release_id]
  }
}

view "released_items" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      v.id AS release_id,
      v.edition,
      v.version,
      v.is_latest,
      i.*
    FROM items AS i
      INNER JOIN item_releases AS iv ON i.id = iv.item_id
      INNER JOIN releases AS v ON iv.release_id = v.id
  SQL
}
