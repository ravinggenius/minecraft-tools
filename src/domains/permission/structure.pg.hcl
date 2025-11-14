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
    "item",
    "profile",
    "platform",
    "release",
    "release-cycle",
    "world"
  ]
}

table "permissions" {
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
