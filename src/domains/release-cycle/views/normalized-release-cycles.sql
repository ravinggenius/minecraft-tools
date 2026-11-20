CREATE VIEW public.normalized_release_cycles AS
SELECT
	id,
	name,
	count(release ->> 'id') AS releases_count,
	coalesce(
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
	min(release ->> 'production_released_on')::DATE AS first_production_released_on,
	coalesce(
		bool_or((release ->> 'is_available_for_tools')::BOOLEAN),
		FALSE
	) AS is_available_for_tools
FROM
	public.flattened_release_cycles
GROUP BY
	id,
	name;
