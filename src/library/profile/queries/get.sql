SELECT
	id,
	created_at AS "createdAt",
	updated_at AS "updatedAt",
	name,
	is_welcome_needed AS "isWelcomeNeeded"
FROM profiles
WHERE id = $<profileId>;
