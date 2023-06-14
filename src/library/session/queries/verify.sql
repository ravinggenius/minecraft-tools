SELECT
	a.id,
	a.created_at AS "createdAt",
	a.updated_at AS "updatedAt",
	a.profile_id AS "profileId",
	a.email,
	a.email_verified_at AS "emailVerifiedAt"
FROM accounts AS a
INNER JOIN sessions AS s ON a.id = s.account_id
WHERE s.id = $<sessionId>
AND s.expires_at > NOW()
LIMIT 1;
