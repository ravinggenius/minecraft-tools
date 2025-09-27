view "normalized_platforms" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      p.id,
      p.name,
      count(r.id) AS "releases_count",
      COALESCE(
        array_agg(
          DISTINCT r.edition
          ORDER BY
            r.edition
        ) FILTER (
          WHERE
            r.edition IS NOT NULL
        ),
        ARRAY[]::public.edition[]
      ) AS editions,
      COALESCE(
        bool_or(r.is_available_for_tools),
        false
      ) AS is_available_for_tools
    FROM
      public.platforms AS p
      LEFT OUTER JOIN public.platform_releases AS pr ON p.id = pr.platform_id
      LEFT OUTER JOIN public.releases AS r ON pr.release_id = r.id
    GROUP BY
      p.id
  SQL
  depends_on = [table.platforms, table.platform_releases, table.releases]
}
