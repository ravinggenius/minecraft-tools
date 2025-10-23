view "normalized_items" {
  schema = schema.public
  as     = <<-SQL
    SELECT
      item_id AS id,
      identifier,
      variant,
      is_variant,
      NULLIF(
        jsonb_strip_nulls(
          CASE
            WHEN count(DISTINCT translation_key) = 1 AND count(DISTINCT edition) > 1 THEN jsonb_object_agg('both', translation_key)
            ELSE jsonb_object_agg(edition, translation_key)
          END
        ),
        '{}'::jsonb
      ) AS translation_keys,
      NULLIF(
        jsonb_strip_nulls(
          CASE
            WHEN count(DISTINCT name) = 1 AND count(DISTINCT edition) > 1 THEN jsonb_object_agg('both', name)
            ELSE jsonb_object_agg(edition, name)
          END
        ),
        '{}'::jsonb
      ) AS names,
      NULLIF(
        jsonb_strip_nulls(
          CASE
            WHEN count(DISTINCT rarity) = 1 AND count(DISTINCT edition) > 1 THEN jsonb_object_agg('both', rarity)
            ELSE jsonb_object_agg(edition, rarity)
          END
        ),
        '{}'::jsonb
      ) AS rarities,
      NULLIF(
        jsonb_strip_nulls(
          CASE
            WHEN count(DISTINCT stack_size) = 1 AND count(DISTINCT edition) > 1 THEN jsonb_object_agg('both', stack_size)
            ELSE jsonb_object_agg(edition, stack_size)
          END
        ),
        '{}'::jsonb
      ) AS stack_sizes,
      jsonb_agg(
        DISTINCT edition
        ORDER BY
          edition
      ) AS editions,
      count(DISTINCT cycle_name)::integer AS cycles_count,
      (
        SELECT
          jsonb_agg(
            cycles.cycle_name
            ORDER BY
              cycles.min_release_date
          ) AS jsonb_agg
        FROM
          (
            SELECT
              fi.cycle_name,
              min(fi.first_production_released_on) AS min_release_date
            FROM
              public.flattened_items AS fi
            WHERE
              fi.identifier OPERATOR(public.=) flattened_items.identifier
              AND NOT fi.variant IS DISTINCT
            FROM
              flattened_items.variant
            GROUP BY
              fi.cycle_name
          ) AS cycles
      ) AS cycle_names,
      count(edition)::integer AS releases_count,
      (
        SELECT
          jsonb_agg(
            jsonb_build_object(
              'edition',
              edition_version.edition,
              'version',
              edition_version.version
            )
            ORDER BY
              edition_version.min_release_date
          ) AS jsonb_agg
        FROM
          (
            SELECT
              fi.edition,
              fi.version,
              min(fi.first_production_released_on) AS min_release_date
            FROM
              public.flattened_items AS fi
            WHERE
              fi.identifier OPERATOR(public.=) flattened_items.identifier
              AND NOT fi.variant IS DISTINCT
            FROM
              flattened_items.variant
            GROUP BY
              fi.edition,
              fi.version
          ) AS edition_version
      ) AS releases,
      (
        SELECT
          jsonb_agg(
            edition_version.version
            ORDER BY
              edition_version.min_release_date
          ) AS jsonb_agg
        FROM
          (
            SELECT
              fi.version,
              min(fi.first_production_released_on) AS min_release_date
            FROM
              public.flattened_items AS fi
            WHERE
              fi.identifier OPERATOR(public.=) flattened_items.identifier
              AND NOT fi.variant IS DISTINCT
            FROM
              flattened_items.variant
            GROUP BY
              fi.edition,
              fi.version
          ) AS edition_version
      ) AS versions,
      min(first_production_released_on) AS first_production_released_on,
      COALESCE(bool_or(is_available_for_tools), false) AS is_available_for_tools
    FROM
      public.flattened_items
    GROUP BY
      item_id,
      identifier,
      variant,
      is_variant;
  SQL
  depends_on = [view.flattened_items]
}
