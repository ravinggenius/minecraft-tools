UPDATE profiles
SET is_welcome_needed = false
WHERE id = $<profileId>;