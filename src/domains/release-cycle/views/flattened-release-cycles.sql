CREATE VIEW public.flattened_release_cycles AS
SELECT
  rc.id,
  rc.name,
  NULLIF(
    jsonb_strip_nulls(
      jsonb_build_object(
        'id', r.id,
        'edition', r.edition,
        'version', r.version,
        'production_released_on', r.first_production_released_on,
        'is_available_for_tools', r.is_available_for_tools
      )
    ),
    '{}'::jsonb
  ) AS release
FROM
  public.release_cycles AS rc
  LEFT OUTER JOIN public.normalized_releases AS r ON (r.cycle ->> 'id')::uuid = rc.id;
