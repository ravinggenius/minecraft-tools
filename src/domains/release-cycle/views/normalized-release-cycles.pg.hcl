view "normalized_release_cycles" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      id,
      name,
      count(release ->> 'id') AS releases_count,
      COALESCE(
        array_agg(
          DISTINCT (release ->> 'edition')::public.edition
          ORDER BY
            (release ->> 'edition')::public.edition
        ) FILTER (
          WHERE
            (release ->> 'edition') IS NOT NULL
        ),
        ARRAY[]::public.edition[]
      ) AS editions,
      min(release ->> 'production_released_on')::date AS first_production_released_on,
      COALESCE(
        bool_or((release ->> 'is_available_for_tools')::boolean),
        false
      ) AS is_available_for_tools
    FROM
      public.flattened_release_cycles
    GROUP BY
      id,
      name;
  SQL
  depends_on = [view.flattened_release_cycles]
}
