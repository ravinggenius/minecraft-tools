SELECT a.email_verified_at <= NOW() AS "emailVerified"
FROM profiles AS p
INNER JOIN accounts AS a ON p.id = a.profile_id
WHERE p.id = $<profileId>
LIMIT 1;
