DELETE FROM password_resets
WHERE expires_at <= NOW();
