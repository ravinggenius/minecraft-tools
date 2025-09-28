view "normalized_releases" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      release_id AS id,
      edition,
      "version",
      cycle,
      development_released_on,
      min(platform ->> 'production_released_on')::date AS "first_production_released_on",
      changelog,
      is_latest,
      is_available_for_tools,
      COALESCE(
        jsonb_agg(
          platform
          ORDER BY
            platform ->> 'name'
        ) FILTER (
          WHERE
            platform ->> 'id' IS NOT NULL
        ),
        '[]'::jsonb
      ) AS platforms
    FROM
      public.flattened_releases
    GROUP BY
      release_id,
      edition,
      "version",
      cycle,
      development_released_on,
      changelog,
      is_latest,
      is_available_for_tools;
  SQL
  depends_on = [view.flattened_releases]
}
