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

  column "cycle_id" {
    null = true
    type = uuid
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

  foreign_key "releases_cycle_id_fkey" {
    columns     = [column.cycle_id]
    ref_columns = [table.release_cycles.column.id]
    on_update   = CASCADE
    on_delete   = SET_NULL
  }

  unique "releases_edition_version_key" {
    columns = [column.edition, column.version]
  }
}

table "platform_releases" {
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
