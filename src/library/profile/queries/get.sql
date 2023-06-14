SELECT
	id,
	created_at AS "createdAt",
	updated_at AS "updatedAt",
	name
FROM profiles
WHERE id = $<profileId>;
