SELECT count(id) > 0 AS "alreadyExists"
FROM accounts
WHERE email = $<email>;
