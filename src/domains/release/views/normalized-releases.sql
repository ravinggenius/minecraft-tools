CREATE VIEW public.normalized_releases AS
SELECT
	release_id AS id,
	edition,
	"version",
	cycle,
	development_released_on,
	min(platform ->> 'production_released_on')::DATE AS "first_production_released_on",
	changelog,
	is_latest,
	is_available_for_tools,
	coalesce(
		jsonb_agg(
			platform
			ORDER BY
				platform ->> 'name'
		) FILTER (
			WHERE
				platform ->> 'id' IS NOT NULL
		),
		'[]'::JSONB
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
