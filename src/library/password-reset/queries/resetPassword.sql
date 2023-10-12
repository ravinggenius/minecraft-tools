WITH resettable_account AS (
	SELECT a.id AS account_id
	FROM accounts AS a
	INNER JOIN password_resets AS pr on a.email = pr.email
	WHERE a.email = $<email>::email
	AND a.email_verified_at < now()
	AND pr.nonce = $<nonce>
	AND pr.expires_at > now()
)
UPDATE accounts
SET hashword = $<hashword>
FROM resettable_account
WHERE id = resettable_account.account_id;
