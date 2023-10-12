SELECT email_verified_at < now() AS "isVerified"
FROM accounts
WHERE email = $<email>::email
AND email_verified_at IS NOT NULL
LIMIT 1;
