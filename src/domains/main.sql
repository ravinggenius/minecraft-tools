-- pgschema entry point.
-- NOTE: schema/extension bootstrap (public schema comment, uuid-ossp, citext)
-- lives in the separate pre-migrate bootstrap script, not here -- pgschema
-- does not manage extensions.

-- Structure: tables, domains, enums, functions, triggers.
-- Ordered so every foreign key / domain reference is defined before use.
\i profile/structure.sql

\i account/structure.sql

\i password-reset/structure.sql

\i permission/structure.sql

\i session/structure.sql

\i platform/structure.sql

\i release-cycle/structure.sql
\i release/structure.sql
\i release/views/flattened-releases.sql
\i release/views/normalized-releases.sql
\i release-cycle/views/flattened-release-cycles.sql
\i release-cycle/views/normalized-release-cycles.sql

\i platform/views/normalized-platforms.sql

\i item/structure.sql
\i item/views/flattened-items.sql
\i item/views/normalized-items.sql
