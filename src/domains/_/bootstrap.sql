-- Extension bootstrap: run once before `pgschema apply`.
-- pgschema does not manage extensions (they're cluster/database-level
-- objects, out of scope by design), so this stays a small separate
-- idempotent step rather than part of the declarative schema.

COMMENT ON SCHEMA public IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "citext" WITH SCHEMA public;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
