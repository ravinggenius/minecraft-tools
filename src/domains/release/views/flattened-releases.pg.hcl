view "flattened_releases" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      COALESCE(pr.id, r.id) AS id,
      pr.id AS platform_release_id,
      r.id AS release_id,
      r.edition,
      r.version,
      NULLIF(
        jsonb_strip_nulls(
          jsonb_build_object(
            'id', rc.id,
            'name', rc.name
          )
        ),
        '{}'::jsonb
      ) AS cycle,
      r.development_released_on,
      pr.production_released_on AS "first_production_released_on",
      r.changelog,
      r.is_latest,
      r.is_available_for_tools,
      NULLIF(
        jsonb_strip_nulls(
          jsonb_build_object(
            'id', p.id,
            'name', p.name,
            'production_released_on', pr.production_released_on
          )
        ),
        '{}'::jsonb
      ) AS platform
    FROM
      public.platform_releases AS pr
      LEFT OUTER JOIN public.platforms AS p ON pr.platform_id = p.id
      RIGHT OUTER JOIN public.releases AS r ON pr.release_id = r.id
      LEFT OUTER JOIN public.release_cycles AS rc ON r.cycle_id = rc.id;
  SQL
  depends_on = [table.platform_releases, table.platforms, table.releases, table.release_cycles]
}
