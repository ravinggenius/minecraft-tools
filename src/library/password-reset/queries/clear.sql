DELETE FROM password_resets
WHERE email = $<email>::email
AND nonce = $<nonce>;
