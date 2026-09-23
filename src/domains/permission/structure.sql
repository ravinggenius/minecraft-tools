CREATE TYPE public.permission_action AS ENUM ('create', 'read', 'share', 'update', 'destroy');
CREATE TYPE public.permission_scope AS ENUM ('any', 'new', 'own', 'one');
CREATE TYPE public.permission_subject AS ENUM ('compendium', 'item', 'profile', 'platform', 'release', 'release-cycle', 'world');

CREATE TABLE public.permissions (
  id uuid NOT NULL DEFAULT public.uuid_generate_v4(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  profile_id uuid NOT NULL,
  action public.permission_action NOT NULL,
  scope public.permission_scope NOT NULL,
  subject public.permission_subject NOT NULL,
  auxiliary jsonb,
  PRIMARY KEY (id),
  CONSTRAINT permissions_profile_id_fkey FOREIGN KEY (profile_id)
    REFERENCES public.profiles (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT permissions_profile_id_subject_action_scope_auxiliary_key
    UNIQUE NULLS NOT DISTINCT (profile_id, subject, action, scope, auxiliary)
);
